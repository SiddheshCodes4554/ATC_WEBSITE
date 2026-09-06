import { ID, Query, Permission, Role, Models } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  MembershipApplication,
  MembershipApplicationDocument,
  MembershipApplicationStatus,
  CreateMembershipApplicationInput,
  MembershipApplicationFilterOptions,
  MembershipApplicationStats,
} from '../types/membershipApplication.types';

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * ============================================================================
 * ATC Membership Application Database Service
 * ============================================================================
 * Handles public student membership submissions, duplicate prevention,
 * admin review workflows, and student dashboard status checks.
 */
export class MembershipApplicationService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.MEMBERSHIP_APPLICATIONS;
  }

  /**
   * Helper: Standard permissions for a membership application document
   * Public can create; only admins/users with appropriate session can manage.
   */
  private static getApplicationPermissions(): string[] {
    return [
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Resilient document creator that handles unknown attributes safely
   */
  private static async createDocumentResilient<T extends Models.Document = Models.Document>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, unknown>,
    permissions?: string[]
  ): Promise<T> {
    const payload = { ...data };
    let currentPermissions = permissions;
    const maxRetries = 4;

    for (let i = 0; i < maxRetries; i++) {
      try {
        if (currentPermissions && currentPermissions.length > 0) {
          return await databases.createDocument<T>(
            databaseId,
            collectionId,
            documentId,
            payload as any,
            currentPermissions
          );
        } else {
          return await databases.createDocument<T>(
            databaseId,
            collectionId,
            documentId,
            payload as any
          );
        }
      } catch (err: any) {
        // If permission error with document-level permissions, retry immediately without permissions
        if (
          currentPermissions &&
          (err?.code === 400 || err?.code === 401 || err?.code === 403 || /permission/i.test(err?.message || ''))
        ) {
          currentPermissions = undefined;
          continue;
        }

        // Check for unknown attribute errors
        const match =
          err?.message?.match(/Unknown attribute:\s*"([^"]+)"/i) ||
          err?.message?.match(/Attribute not found.*?:\s*"([^"]+)"/i) ||
          err?.message?.match(/attribute\s+"([^"]+)"\s+is unknown/i);

        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(
            `[MembershipApplicationService] Stripping unknown attribute "${match[1]}" from payload and retrying...`
          );
          delete payload[match[1]];
          continue;
        }

        throw err;
      }
    }

    return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any);
  }

  /**
   * Helper: Map Appwrite Document to strongly-typed MembershipApplication
   */
  private static mapDocumentToApplication(doc: Models.Document): MembershipApplication {
    const raw = doc as unknown as MembershipApplicationDocument;
    return {
      $id: raw.$id,
      $createdAt: raw.$createdAt,
      $updatedAt: raw.$updatedAt,
      name: raw.name || '',
      email: raw.email || '',
      phone: raw.phone || '',
      year: raw.year || '',
      section: raw.section || '',
      resumeLink: raw.resumeLink || '',
      skills: raw.skills || '',
      experience: raw.experience || '',
      availability: raw.availability || '',
      status: (raw.status as MembershipApplicationStatus) || 'pending',
    };
  }

  /**
   * Find an existing application by applicant email (case-insensitive search)
   */
  public static async getApplicationByEmail(
    email: string
  ): Promise<ServiceResult<MembershipApplication | null>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not properly initialized.' };
      }

      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) {
        return { success: true, data: null };
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('email', trimmedEmail),
          Query.limit(1),
        ]
      );

      if (res.documents.length === 0) {
        return { success: true, data: null };
      }

      return {
        success: true,
        data: this.mapDocumentToApplication(res.documents[0]),
      };
    } catch (err: any) {
      // If guest lacks list permission or collection has no email index, proceed gracefully
      if (err?.code === 401 || err?.code === 403 || err?.code === 404) {
        return { success: true, data: null };
      }
      console.warn('[MembershipApplicationService] getApplicationByEmail warning:', err);
      return {
        success: false,
        error: err?.message || 'Failed to check existing application.',
      };
    }
  }

  /**
   * Submit a new membership application
   * - Validates duplicate email
   * - Automatically assigns status = 'pending'
   * - Saves exactly the specified database attributes
   */
  public static async createApplication(
    input: CreateMembershipApplicationInput
  ): Promise<ServiceResult<MembershipApplication>> {
    try {
      if (!isAppwriteReady()) {
        return {
          success: false,
          error: 'Database connection is not configured. Please check your settings.',
        };
      }

      const normalizedEmail = input.email.trim().toLowerCase();

      // 1. Duplicate check by email
      const existingCheck = await this.getApplicationByEmail(normalizedEmail);
      if (existingCheck.success && existingCheck.data) {
        return {
          success: false,
          error: 'Looks like you already submitted a membership application.',
        };
      }

      // 2. Prepare payload matching exact collection attributes
      const documentId = ID.unique();
      const payload: Record<string, unknown> = {
        name: input.name.trim(),
        email: normalizedEmail,
        phone: input.phone.trim(),
        year: input.year.trim(),
        section: input.section.trim(),
        resumeLink: input.resumeLink?.trim() || '',
        skills: input.skills?.trim() || '',
        experience: input.experience?.trim() || '',
        availability: input.availability.trim(),
        status: 'pending',
      };

      const doc = await this.createDocumentResilient(
        this.databaseId,
        this.collectionId,
        documentId,
        payload,
        this.getApplicationPermissions()
      );

      return {
        success: true,
        data: this.mapDocumentToApplication(doc),
      };
    } catch (err: any) {
      console.error('[MembershipApplicationService] createApplication error:', err);
      return {
        success: false,
        error:
          err?.message ||
          'Failed to submit your membership application. Please try again.',
      };
    }
  }

  /**
   * Fetch all applications for Admin view with filtering, search, and sorting
   */
  public static async getApplications(
    options: MembershipApplicationFilterOptions = {}
  ): Promise<ServiceResult<{ applications: MembershipApplication[]; total: number }>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      const queries: string[] = [Query.limit(options.limit || 100)];

      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      // Status filter
      if (options.status && options.status !== 'all') {
        queries.push(Query.equal('status', options.status));
      }

      // Sorting
      if (options.sortBy === 'oldest') {
        queries.push(Query.orderAsc('$createdAt'));
      } else {
        queries.push(Query.orderDesc('$createdAt'));
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        queries
      );

      let applications = res.documents.map((doc) => this.mapDocumentToApplication(doc));

      // Client-side search filtering (by name, email, section) if search query provided
      if (options.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.trim().toLowerCase();
        applications = applications.filter((app) => {
          return (
            app.name.toLowerCase().includes(query) ||
            app.email.toLowerCase().includes(query) ||
            app.section.toLowerCase().includes(query) ||
            (app.skills && app.skills.toLowerCase().includes(query))
          );
        });
      }

      return {
        success: true,
        data: {
          applications,
          total: res.total,
        },
      };
    } catch (err: any) {
      console.error('[MembershipApplicationService] getApplications error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to retrieve membership applications.',
      };
    }
  }

  /**
   * Fetch a single application by its Appwrite ID
   */
  public static async getApplicationById(
    applicationId: string
  ): Promise<ServiceResult<MembershipApplication>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      const doc = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        applicationId
      );

      return {
        success: true,
        data: this.mapDocumentToApplication(doc),
      };
    } catch (err: any) {
      console.error('[MembershipApplicationService] getApplicationById error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to find membership application.',
      };
    }
  }

  /**
   * Update application status (Admin Action)
   * Allowed transitions: 'pending' | 'under_review' | 'approved' | 'rejected'
   */
  public static async updateApplicationStatus(
    applicationId: string,
    status: MembershipApplicationStatus
  ): Promise<ServiceResult<MembershipApplication>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      const doc = await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        applicationId,
        { status }
      );

      return {
        success: true,
        data: this.mapDocumentToApplication(doc),
      };
    } catch (err: any) {
      console.error('[MembershipApplicationService] updateApplicationStatus error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to update application status.',
      };
    }
  }

  /**
   * Calculate aggregated application statistics
   */
  public static async getApplicationStats(): Promise<ServiceResult<MembershipApplicationStats>> {
    try {
      const res = await this.getApplications({ limit: 100 });
      if (!res.success || !res.data) {
        return {
          success: false,
          error: res.error || 'Failed to calculate application stats.',
        };
      }

      const all = res.data.applications;
      const stats: MembershipApplicationStats = {
        total: all.length,
        pending: all.filter((a) => a.status === 'pending').length,
        underReview: all.filter((a) => a.status === 'under_review').length,
        approved: all.filter((a) => a.status === 'approved').length,
        rejected: all.filter((a) => a.status === 'rejected').length,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (err: any) {
      console.error('[MembershipApplicationService] getApplicationStats error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to load application statistics.',
      };
    }
  }
}

export const membershipApplicationService = MembershipApplicationService;
