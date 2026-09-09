import { ID, Query, Permission, Role, Models } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  StudentProfile,
  CreateStudentProfileInput,
  StudentDirectoryFilters,
  StudentDirectoryStats,
} from '../types/studentProfile.types';

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * ============================================================================
 * ATC Student Profile Database Service
 * ============================================================================
 * Handles student registration profile records (NIAT ID, Year, Section, Phone),
 * duplicate NIAT ID prevention, and admin student directory management.
 */
export class StudentProfileService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.STUDENT_PROFILES;
  }

  /**
   * Helper: Standard document-level permissions for a student profile
   */
  private static getProfilePermissions(userId: string): string[] {
    return [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.read(Role.users()),
      Permission.update(Role.users()),
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
        // If permission error with document-level permissions, retry without permissions
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
            `[StudentProfileService] Stripping unknown attribute "${match[1]}" from payload and retrying...`
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
   * Map raw Appwrite document to typed StudentProfile
   */
  public static mapDocumentToProfile(doc: Models.Document): StudentProfile {
    const raw = doc as unknown as Record<string, any>;
    return {
      $id: raw.$id,
      $createdAt: raw.$createdAt,
      $updatedAt: raw.$updatedAt,
      userId: raw.userId || raw.user_id || '',
      name: raw.name || raw.user_name || '',
      email: raw.email || raw.user_email || '',
      niatId: (raw.niatId || raw.studentId || raw.student_id || raw.niat_id || '').toString().trim(),
      studentId: (raw.studentId || raw.niatId || '').toString().trim(),
      phone: (raw.phone || raw.user_phone || '').toString().trim(),
      year: raw.year || raw.year_of_study || '1st Year',
      section: raw.section || 'S01',
    };
  }

  /**
   * Check if a NIAT ID is already registered in the student profiles collection
   */
  public static async getProfileByNiatId(
    niatId: string
  ): Promise<ServiceResult<StudentProfile | null>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not properly configured.' };
      }

      const trimmed = niatId.trim();
      if (!trimmed) {
        return { success: true, data: null };
      }

      // Try searching via niatId first, with graceful fallback to studentId
      try {
        const res = await databases.listDocuments(
          this.databaseId,
          this.collectionId,
          [Query.equal('niatId', trimmed), Query.limit(1)]
        );

        if (res.documents.length > 0) {
          return {
            success: true,
            data: this.mapDocumentToProfile(res.documents[0]),
          };
        }
      } catch {
        // If niatId index or attribute is missing in schema, try studentId
        try {
          const res = await databases.listDocuments(
            this.databaseId,
            this.collectionId,
            [Query.equal('studentId', trimmed), Query.limit(1)]
          );

          if (res.documents.length > 0) {
            return {
              success: true,
              data: this.mapDocumentToProfile(res.documents[0]),
            };
          }
        } catch {
          // If query fails due to permissions, return null safely
        }
      }

      return { success: true, data: null };
    } catch (err: any) {
      if (err?.code === 401 || err?.code === 403 || err?.code === 404) {
        return { success: true, data: null };
      }
      return {
        success: false,
        error: err?.message || 'Failed to check NIAT ID uniqueness.',
      };
    }
  }

  /**
   * Retrieve a student profile by their Appwrite user ID
   */
  public static async getProfileByUserId(
    userId: string
  ): Promise<ServiceResult<StudentProfile | null>> {
    try {
      if (!isAppwriteReady() || !userId) {
        return { success: true, data: null };
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('userId', userId), Query.limit(1)]
      );

      if (res.documents.length === 0) {
        return { success: true, data: null };
      }

      return {
        success: true,
        data: this.mapDocumentToProfile(res.documents[0]),
      };
    } catch (err: any) {
      if (err?.code === 401 || err?.code === 403 || err?.code === 404) {
        return { success: true, data: null };
      }
      console.warn('[StudentProfileService] getProfileByUserId error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to fetch student profile.',
      };
    }
  }

  /**
   * Create a new student profile document
   */
  public static async createProfile(
    input: CreateStudentProfileInput
  ): Promise<ServiceResult<StudentProfile>> {
    try {
      if (!isAppwriteReady()) {
        return {
          success: false,
          error: 'Database connection is not configured. Please check your settings.',
        };
      }

      const normalizedNiatId = input.niatId.trim();
      if (!normalizedNiatId) {
        return {
          success: false,
          error: 'NIAT ID is required.',
        };
      }

      // 1. Check duplicate NIAT ID
      const duplicateCheck = await this.getProfileByNiatId(normalizedNiatId);
      if (duplicateCheck.success && duplicateCheck.data) {
        return {
          success: false,
          error: 'This NIAT ID is already registered.',
        };
      }

      // 2. Prepare payload matching collection attributes
      const documentId = ID.unique();
      const payload: Record<string, unknown> = {
        userId: input.userId,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        niatId: normalizedNiatId,
        studentId: normalizedNiatId, // Compatibility alias
        phone: input.phone.trim(),
        year: input.year,
        section: input.section,
      };

      const doc = await this.createDocumentResilient(
        this.databaseId,
        this.collectionId,
        documentId,
        payload,
        this.getProfilePermissions(input.userId)
      );

      return {
        success: true,
        data: this.mapDocumentToProfile(doc),
      };
    } catch (err: any) {
      console.error('[StudentProfileService] createProfile error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to create student profile.',
      };
    }
  }

  /**
   * Fetch all registered student profiles for the Admin Users Directory
   */
  public static async getAllProfiles(
    options: StudentDirectoryFilters = {}
  ): Promise<ServiceResult<{ profiles: StudentProfile[]; total: number }>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      const queries: string[] = [
        Query.limit(options.limit || 100),
      ];

      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      // Year filter
      if (options.year && options.year !== 'all') {
        queries.push(Query.equal('year', options.year));
      }

      // Section filter
      if (options.section && options.section !== 'all') {
        queries.push(Query.equal('section', options.section));
      }

      // Ordering
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

      let profiles = res.documents.map((doc) => this.mapDocumentToProfile(doc));

      // Client-side text search (Name, NIAT ID, Email, Phone)
      if (options.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.trim().toLowerCase();
        profiles = profiles.filter((p) => {
          return (
            p.name.toLowerCase().includes(query) ||
            p.niatId.toLowerCase().includes(query) ||
            p.email.toLowerCase().includes(query) ||
            p.phone.toLowerCase().includes(query)
          );
        });
      }

      // Client-side sorting for name
      if (options.sortBy === 'name-asc') {
        profiles.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sortBy === 'name-desc') {
        profiles.sort((a, b) => b.name.localeCompare(a.name));
      }

      return {
        success: true,
        data: {
          profiles,
          total: res.total,
        },
      };
    } catch (err: any) {
      console.error('[StudentProfileService] getAllProfiles error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to retrieve registered students.',
      };
    }
  }

  /**
   * Calculate aggregated student statistics for Admin Dashboard & Directory
   */
  public static async getDirectoryStats(): Promise<ServiceResult<StudentDirectoryStats>> {
    try {
      const res = await this.getAllProfiles({ limit: 100 });
      if (!res.success || !res.data) {
        return {
          success: false,
          error: res.error || 'Failed to calculate directory stats.',
        };
      }

      const all = res.data.profiles;
      const sectionsCount: Record<string, number> = {};

      all.forEach((p) => {
        const sec = p.section || 'Unassigned';
        sectionsCount[sec] = (sectionsCount[sec] || 0) + 1;
      });

      const stats: StudentDirectoryStats = {
        total: all.length,
        firstYear: all.filter((p) => p.year === '1st Year').length,
        secondYear: all.filter((p) => p.year === '2nd Year').length,
        sectionsCount,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (err: any) {
      console.error('[StudentProfileService] getDirectoryStats error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to load directory statistics.',
      };
    }
  }
}

export const studentProfileService = StudentProfileService;
