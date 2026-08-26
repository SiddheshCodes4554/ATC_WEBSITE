import { ID, Query } from 'appwrite';
import { databases } from '../lib/appwrite/client';
import { APPWRITE_CONFIG, isAppwriteReady } from '../lib/appwrite/config';
import {
  EventDocument,
  RegistrationDocument,
  TeamMemberDocument,
  ProjectDocument,
  GalleryDocument,
  WebsiteContentDocument,
  PaginatedResponse,
  ServiceResponse,
} from '../types/appwrite.types';
import {
  createPublicReadAdminWritePermissions,
  createRegistrationPermissions,
} from '../lib/appwrite/permissions';

/**
 * ============================================================================
 * ATC Database Service (Appwrite Databases)
 * ============================================================================
 * Cleanly separates public read access from admin-only mutation operations.
 */
export class DatabaseService {

  /* ======================================================================== */
  /* PUBLIC DATA ACCESS METHODS                                               */
  /* ======================================================================== */

  /**
   * Fetches published public events with optional category and pagination filtering
   */
  static async getPublicEvents(options?: {
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<PaginatedResponse<EventDocument>>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured in environment.' };
      }

      const queries = [
        Query.notEqual('status', 'draft'),
        Query.orderDesc('date'),
        Query.limit(options?.limit || 20),
        Query.offset(options?.offset || 0),
      ];

      if (options?.category && options.category !== 'All') {
        queries.push(Query.equal('category', options.category));
      }

      const response = await databases.listDocuments<EventDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.EVENTS,
        queries
      );

      return {
        success: true,
        data: {
          documents: response.documents,
          total: response.total,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to retrieve public events.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Fetches a single event document by its unique URL slug
   */
  static async getPublicEventBySlug(
    slug: string
  ): Promise<ServiceResponse<EventDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const response = await databases.listDocuments<EventDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.EVENTS,
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: 'Event not found.' };
      }

      return { success: true, data: response.documents[0] };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch event by slug.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Fetches active public team members ordered by display hierarchy
   */
  static async getPublicTeamMembers(options?: {
    wing?: string;
  }): Promise<ServiceResponse<TeamMemberDocument[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const queries = [
        Query.equal('is_active', true),
        Query.orderAsc('order_index'),
        Query.limit(100),
      ];

      if (options?.wing) {
        queries.push(Query.equal('wing', options.wing));
      }

      const response = await databases.listDocuments<TeamMemberDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.TEAM_MEMBERS,
        queries
      );

      return { success: true, data: response.documents };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to retrieve team members.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Fetches public showcase projects
   */
  static async getPublicProjects(options?: {
    featuredOnly?: boolean;
    stage?: string;
    limit?: number;
  }): Promise<ServiceResponse<ProjectDocument[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const queries = [
        Query.orderAsc('order_index'),
        Query.limit(options?.limit || 20),
      ];

      if (options?.featuredOnly) {
        queries.push(Query.equal('is_featured', true));
      }
      if (options?.stage) {
        queries.push(Query.equal('stage', options.stage));
      }

      const response = await databases.listDocuments<ProjectDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
        queries
      );

      return { success: true, data: response.documents };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to retrieve projects.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Fetches published gallery memory wall items
   */
  static async getPublicGallery(options?: {
    category?: string;
    limit?: number;
  }): Promise<ServiceResponse<GalleryDocument[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const queries = [
        Query.equal('is_published', true),
        Query.orderAsc('order_index'),
        Query.limit(options?.limit || 50),
      ];

      if (options?.category && options.category !== 'All') {
        queries.push(Query.equal('category', options.category));
      }

      const response = await databases.listDocuments<GalleryDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.GALLERY,
        queries
      );

      return { success: true, data: response.documents };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to retrieve gallery items.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Fetches published dynamic website content section payload
   */
  static async getPublicWebsiteContent(
    sectionKey: string
  ): Promise<ServiceResponse<WebsiteContentDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const response = await databases.listDocuments<WebsiteContentDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.WEBSITE_CONTENT,
        [
          Query.equal('section_key', sectionKey),
          Query.equal('is_published', true),
          Query.limit(1),
        ]
      );

      if (response.documents.length === 0) {
        return { success: false, error: `Content section '${sectionKey}' not found.` };
      }

      return { success: true, data: response.documents[0] };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch content section.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Submits a public student event registration
   */
  static async createRegistration(data: {
    event_id: string;
    event_title: string;
    user_name: string;
    user_email: string;
    user_phone?: string;
    student_id?: string;
    college_name?: string;
    branch?: string;
    year_of_study?: string;
    custom_answers?: string;
  }): Promise<ServiceResponse<RegistrationDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      // Generate a unique high-entropy ticket code
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const ticketCode = `ATC-${data.event_id.substring(0, 4).toUpperCase()}-${randomSuffix}`;

      const document = await databases.createDocument<RegistrationDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.REGISTRATIONS,
        ID.unique(),
        {
          ...data,
          ticket_code: ticketCode,
          check_in_status: 'registered',
        },
        createRegistrationPermissions()
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to submit registration.',
        statusCode: error?.code,
      };
    }
  }

  /* ======================================================================== */
  /* ADMIN-ONLY DATA MUTATION METHODS                                         */
  /* ======================================================================== */

  /**
   * Admin: List all events including drafts
   */
  static async adminListEvents(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<PaginatedResponse<EventDocument>>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const response = await databases.listDocuments<EventDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.EVENTS,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(options?.limit || 50),
          Query.offset(options?.offset || 0),
        ]
      );

      return {
        success: true,
        data: {
          documents: response.documents,
          total: response.total,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to list admin events.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Create a new event
   */
  static async createEvent(
    data: Omit<EventDocument, keyof import('../types/appwrite.types').AppwriteBaseDocument>
  ): Promise<ServiceResponse<EventDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.createDocument<EventDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.EVENTS,
        ID.unique(),
        data,
        createPublicReadAdminWritePermissions()
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create event.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Update an existing event
   */
  static async updateEvent(
    eventId: string,
    data: Partial<EventDocument>
  ): Promise<ServiceResponse<EventDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.updateDocument<EventDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.EVENTS,
        eventId,
        data
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update event.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Delete an event
   */
  static async deleteEvent(eventId: string): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.EVENTS,
        eventId
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to delete event.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: List registrations for an event with search & check-in filters
   */
  static async adminListRegistrations(options: {
    eventId?: string;
    status?: string;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<PaginatedResponse<RegistrationDocument>>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const queries = [
        Query.orderDesc('$createdAt'),
        Query.limit(options.limit || 50),
        Query.offset(options.offset || 0),
      ];

      if (options.eventId) {
        queries.push(Query.equal('event_id', options.eventId));
      }
      if (options.status) {
        queries.push(Query.equal('check_in_status', options.status));
      }
      if (options.searchQuery) {
        queries.push(Query.search('user_name', options.searchQuery));
      }

      const response = await databases.listDocuments<RegistrationDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.REGISTRATIONS,
        queries
      );

      return {
        success: true,
        data: {
          documents: response.documents,
          total: response.total,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to retrieve registrations.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin / Volunteer: Check in a student ticket by ticket code or document ID
   */
  static async checkInRegistration(
    registrationId: string,
    adminId?: string
  ): Promise<ServiceResponse<RegistrationDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.updateDocument<RegistrationDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.REGISTRATIONS,
        registrationId,
        {
          check_in_status: 'checked_in',
          check_in_time: new Date().toISOString(),
          checked_in_by: adminId || 'admin',
        }
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to check in registration.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Create/Update Team Member
   */
  static async createTeamMember(
    data: Omit<TeamMemberDocument, keyof import('../types/appwrite.types').AppwriteBaseDocument>
  ): Promise<ServiceResponse<TeamMemberDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.createDocument<TeamMemberDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.TEAM_MEMBERS,
        ID.unique(),
        data,
        createPublicReadAdminWritePermissions()
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create team member.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Update Team Member
   */
  static async updateTeamMember(
    memberId: string,
    data: Partial<TeamMemberDocument>
  ): Promise<ServiceResponse<TeamMemberDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.updateDocument<TeamMemberDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.TEAM_MEMBERS,
        memberId,
        data
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update team member.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Delete Team Member
   */
  static async deleteTeamMember(memberId: string): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.TEAM_MEMBERS,
        memberId
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to delete team member.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Create/Update Project
   */
  static async createProject(
    data: Omit<ProjectDocument, keyof import('../types/appwrite.types').AppwriteBaseDocument>
  ): Promise<ServiceResponse<ProjectDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.createDocument<ProjectDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
        ID.unique(),
        data,
        createPublicReadAdminWritePermissions()
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create project.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Update Project
   */
  static async updateProject(
    projectId: string,
    data: Partial<ProjectDocument>
  ): Promise<ServiceResponse<ProjectDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.updateDocument<ProjectDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
        projectId,
        data
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update project.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Delete Project
   */
  static async deleteProject(projectId: string): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      await databases.deleteDocument(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.PROJECTS,
        projectId
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to delete project.',
        statusCode: error?.code,
      };
    }
  }
}
