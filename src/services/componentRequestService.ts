import { ID, Query, Permission, Role, Models } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  ComponentRequest,
  ComponentRequestStatus,
  CreateComponentRequestInput,
  ComponentRequestFilterOptions,
  ComponentRequestStats,
} from '../types/componentRequest.types';

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * ============================================================================
 * ATC Hardware Component Request Database Service
 * ============================================================================
 * Handles component requisition requests by students, duplicate request prevention,
 * admin approval/rejection/collection workflows, and status synchronization.
 */
export class ComponentRequestService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.COMPONENT_REQUESTS;
  }

  /**
   * Helper: Standard permissions for a component request document
   */
  private static getRequestPermissions(userId: string): string[] {
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
            `[ComponentRequestService] Stripping unknown attribute "${match[1]}" from payload and retrying...`
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
   * Helper: Map Appwrite Document to strongly-typed ComponentRequest
   */
  private static mapDocumentToRequest(doc: Models.Document): ComponentRequest {
    const raw = doc as unknown as any;
    return {
      $id: raw.$id,
      $createdAt: raw.$createdAt,
      $updatedAt: raw.$updatedAt,
      userId: raw.userId || '',
      studentName: raw.studentName || '',
      studentEmail: raw.studentEmail || '',
      componentName: raw.componentName || '',
      requestedQuantity: Number(raw.requestedQuantity) || 1,
      reason: raw.reason || '',
      status: (raw.status as ComponentRequestStatus) || 'pending',
      adminNotes: raw.adminNotes || '',
      category: raw.category || '',
    };
  }

  /**
   * Check if a student already has an active request (pending or approved) for this component
   */
  public static async checkActiveRequest(
    userId: string,
    componentName: string
  ): Promise<ServiceResult<ComponentRequest | null>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not properly initialized.' };
      }

      const trimmedName = componentName.trim().toLowerCase();
      if (!userId || !trimmedName) {
        return { success: true, data: null };
      }

      // Fetch student's requests to safely check active statuses
      const res = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('userId', userId),
          Query.limit(50),
          Query.orderDesc('$createdAt'),
        ]
      );

      const activeMatch = res.documents.find((doc: any) => {
        const matchesName = (doc.componentName || '').trim().toLowerCase() === trimmedName;
        const isActiveStatus = doc.status === 'pending' || doc.status === 'approved';
        return matchesName && isActiveStatus;
      });

      if (!activeMatch) {
        return { success: true, data: null };
      }

      return {
        success: true,
        data: this.mapDocumentToRequest(activeMatch),
      };
    } catch (err: any) {
      if (err?.code === 401 || err?.code === 403 || err?.code === 404) {
        return { success: true, data: null };
      }
      console.warn('[ComponentRequestService] checkActiveRequest warning:', err);
      return {
        success: false,
        error: err?.message || 'Failed to check active component requests.',
      };
    }
  }

  /**
   * Submit a new component request
   */
  public static async createRequest(
    input: CreateComponentRequestInput
  ): Promise<ServiceResult<ComponentRequest>> {
    try {
      if (!isAppwriteReady()) {
        return {
          success: false,
          error: 'Database connection is not configured. Please check your settings.',
        };
      }

      if (!input.userId) {
        return {
          success: false,
          error: 'Authentication is required to request a component.',
        };
      }

      if (!input.componentName || !input.componentName.trim()) {
        return {
          success: false,
          error: 'Component name is required.',
        };
      }

      if (!input.requestedQuantity || input.requestedQuantity < 1) {
        return {
          success: false,
          error: 'Requested quantity must be at least 1.',
        };
      }

      if (!input.reason || input.reason.trim().length < 10) {
        return {
          success: false,
          error: 'Please provide a detailed reason (at least 10 characters).',
        };
      }

      // 1. Duplicate active request check
      const duplicateCheck = await this.checkActiveRequest(input.userId, input.componentName);
      if (duplicateCheck.success && duplicateCheck.data) {
        const statusLabel = duplicateCheck.data.status === 'approved' ? 'approved (ready for collection)' : 'pending review';
        return {
          success: false,
          error: `You already have an active request for "${input.componentName}" that is currently ${statusLabel}.`,
        };
      }

      // 2. Prepare payload matching exact collection attributes
      const documentId = ID.unique();
      const payload: Record<string, unknown> = {
        userId: input.userId,
        studentName: input.studentName.trim(),
        studentEmail: input.studentEmail.trim().toLowerCase(),
        componentName: input.componentName.trim(),
        requestedQuantity: Math.floor(input.requestedQuantity),
        reason: input.reason.trim(),
        status: 'pending',
        adminNotes: '',
        category: input.category?.trim() || '',
      };

      const doc = await this.createDocumentResilient(
        this.databaseId,
        this.collectionId,
        documentId,
        payload,
        this.getRequestPermissions(input.userId)
      );

      return {
        success: true,
        data: this.mapDocumentToRequest(doc),
      };
    } catch (err: any) {
      console.error('[ComponentRequestService] createRequest error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to submit component request. Please try again.',
      };
    }
  }

  /**
   * Fetch all requests created by a specific student
   */
  public static async getStudentRequests(
    userId: string
  ): Promise<ServiceResult<ComponentRequest[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      if (!userId) {
        return { success: true, data: [] };
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('userId', userId),
          Query.limit(100),
          Query.orderDesc('$createdAt'),
        ]
      );

      return {
        success: true,
        data: res.documents.map((doc) => this.mapDocumentToRequest(doc)),
      };
    } catch (err: any) {
      console.error('[ComponentRequestService] getStudentRequests error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to retrieve your component requests.',
      };
    }
  }

  /**
   * Fetch a single component request by ID
   */
  public static async getRequestById(
    requestId: string
  ): Promise<ServiceResult<ComponentRequest>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      const doc = await databases.getDocument(
        this.databaseId,
        this.collectionId,
        requestId
      );

      return {
        success: true,
        data: this.mapDocumentToRequest(doc),
      };
    } catch (err: any) {
      console.error('[ComponentRequestService] getRequestById error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to find component request.',
      };
    }
  }

  /**
   * Fetch all requests for Admin view with filtering and search
   */
  public static async getAllRequests(
    options: ComponentRequestFilterOptions = {}
  ): Promise<ServiceResult<{ requests: ComponentRequest[]; total: number }>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      const queries: string[] = [
        Query.limit(options.limit || 100),
        Query.orderDesc('$createdAt'),
      ];

      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }

      // Status filter
      if (options.status && options.status !== 'all') {
        queries.push(Query.equal('status', options.status));
      }

      const res = await databases.listDocuments(
        this.databaseId,
        this.collectionId,
        queries
      );

      let requests = res.documents.map((doc) => this.mapDocumentToRequest(doc));

      // Client-side text search (component name, student name, email, reason, ID)
      if (options.searchQuery && options.searchQuery.trim()) {
        const query = options.searchQuery.trim().toLowerCase();
        requests = requests.filter((req) => {
          return (
            req.componentName.toLowerCase().includes(query) ||
            req.studentName.toLowerCase().includes(query) ||
            req.studentEmail.toLowerCase().includes(query) ||
            req.reason.toLowerCase().includes(query) ||
            req.$id.toLowerCase().includes(query)
          );
        });
      }

      return {
        success: true,
        data: {
          requests,
          total: res.total,
        },
      };
    } catch (err: any) {
      console.error('[ComponentRequestService] getAllRequests error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to retrieve component requests.',
      };
    }
  }

  /**
   * Update component request status and optional admin note (Admin action)
   */
  public static async updateRequestStatus(
    requestId: string,
    status: ComponentRequestStatus,
    adminNotes?: string
  ): Promise<ServiceResult<ComponentRequest>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Database connection is not configured.' };
      }

      const updatePayload: Record<string, unknown> = { status };
      if (adminNotes !== undefined) {
        updatePayload.adminNotes = adminNotes.trim();
      }

      const doc = await databases.updateDocument(
        this.databaseId,
        this.collectionId,
        requestId,
        updatePayload
      );

      return {
        success: true,
        data: this.mapDocumentToRequest(doc),
      };
    } catch (err: any) {
      console.error('[ComponentRequestService] updateRequestStatus error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to update component request status.',
      };
    }
  }

  /**
   * Calculate aggregated component request statistics
   */
  public static async getRequestStats(): Promise<ServiceResult<ComponentRequestStats>> {
    try {
      const res = await this.getAllRequests({ limit: 100 });
      if (!res.success || !res.data) {
        return {
          success: false,
          error: res.error || 'Failed to calculate request stats.',
        };
      }

      const all = res.data.requests;
      const stats: ComponentRequestStats = {
        total: all.length,
        pending: all.filter((r) => r.status === 'pending').length,
        approved: all.filter((r) => r.status === 'approved').length,
        rejected: all.filter((r) => r.status === 'rejected').length,
        collected: all.filter((r) => r.status === 'collected').length,
      };

      return {
        success: true,
        data: stats,
      };
    } catch (err: any) {
      console.error('[ComponentRequestService] getRequestStats error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to load request statistics.',
      };
    }
  }
}

export const componentRequestService = ComponentRequestService;
