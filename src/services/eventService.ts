import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  ATCEvent,
  EventDocument,
  CreateEventInput,
  UpdateEventInput,
  EventFilterOptions,
  EventServiceResult,
} from '../types/event.types';

/**
 * ============================================================================
 * ATC Appwrite Events Database Service
 * ============================================================================
 * Centralized service layer handling all CRUD operations and query logic
 * for the Appwrite Events table. Compatible with Appwrite SDK ^26.2.0.
 */
export class EventService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.EVENTS;
  }

  /**
   * Helper: Build standard permissions for public read and authenticated admin write
   * Note: Document-level permissions only allow 'read', 'update', 'delete', 'write' (not 'create').
   */
  private static getEventPermissions(): string[] {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Admin: Fetch all events with optional filters, pagination and sorting
   */
  static async getAllEvents(
    options: EventFilterOptions = {}
  ): Promise<EventServiceResult<ATCEvent[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in the environment.' };
      }

      const queries: string[] = [];

      // Sorting (default to latest start date)
      if (options.order === 'asc') {
        queries.push(Query.orderAsc('startDate'));
      } else {
        queries.push(Query.orderDesc('startDate'));
      }

      // Pagination
      queries.push(Query.limit(options.limit ?? 50));
      queries.push(Query.offset(options.offset ?? 0));

      // Status filter
      if (options.status) {
        if (Array.isArray(options.status)) {
          queries.push(Query.equal('status', options.status));
        } else {
          queries.push(Query.equal('status', options.status));
        }
      }

      // Event type filter
      if (options.eventType) {
        queries.push(Query.equal('eventType', options.eventType));
      }

      // Featured filter
      if (typeof options.featuredOnly === 'boolean' && options.featuredOnly) {
        queries.push(Query.equal('featured', true));
      }

      // Search query filter
      if (options.searchQuery?.trim()) {
        queries.push(Query.search('title', options.searchQuery.trim()));
      }

      const response = await databases.listDocuments<EventDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      return {
        success: true,
        data: response.documents as ATCEvent[],
        total: response.total,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch events from Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Public: Fetch published/upcoming/completed events (excludes drafts)
   */
  static async getPublicEvents(
    options: EventFilterOptions = {}
  ): Promise<EventServiceResult<ATCEvent[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in the environment.' };
      }

      const queries: string[] = [
        Query.notEqual('status', 'draft'),
      ];

      // Sorting
      if (options.order === 'asc') {
        queries.push(Query.orderAsc('startDate'));
      } else {
        queries.push(Query.orderDesc('startDate'));
      }

      // Pagination
      queries.push(Query.limit(options.limit ?? 20));
      queries.push(Query.offset(options.offset ?? 0));

      // Optional status override within public range
      if (options.status) {
        if (Array.isArray(options.status)) {
          queries.push(Query.equal('status', options.status));
        } else {
          queries.push(Query.equal('status', options.status));
        }
      }

      // Category / Type filter
      if (options.eventType && options.eventType !== 'All') {
        queries.push(Query.equal('eventType', options.eventType));
      }

      // Featured only
      if (options.featuredOnly) {
        queries.push(Query.equal('featured', true));
      }

      const response = await databases.listDocuments<EventDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      return {
        success: true,
        data: response.documents as ATCEvent[],
        total: response.total,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch public events.',
        code: error?.code,
      };
    }
  }

  /**
   * Fetch a single event document by its Appwrite Document ID
   */
  static async getEventById(
    eventId: string
  ): Promise<EventServiceResult<ATCEvent>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!eventId?.trim()) {
        return { success: false, error: 'Event ID is required.' };
      }

      const document = await databases.getDocument<EventDocument>(
        this.databaseId,
        this.collectionId,
        eventId.trim()
      );

      return { success: true, data: document as ATCEvent };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Event not found.',
        code: error?.code,
      };
    }
  }

  /**
   * Fetch a single event document by its unique URL slug
   */
  static async getEventBySlug(
    slug: string
  ): Promise<EventServiceResult<ATCEvent>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!slug?.trim()) {
        return { success: false, error: 'Event slug is required.' };
      }

      const response = await databases.listDocuments<EventDocument>(
        this.databaseId,
        this.collectionId,
        [Query.equal('slug', slug.trim().toLowerCase()), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: `Event with slug '${slug}' was not found.` };
      }

      return { success: true, data: response.documents[0] as ATCEvent };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch event by slug.',
        code: error?.code,
      };
    }
  }

  /**
   * Check if a slug is available (not already in use by another event)
   */
  static async isSlugAvailable(
    slug: string,
    excludeEventId?: string
  ): Promise<boolean> {
    try {
      if (!isAppwriteReady() || !slug?.trim()) return true;

      const queries = [
        Query.equal('slug', slug.trim().toLowerCase()),
        Query.limit(2),
      ];

      const response = await databases.listDocuments<EventDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      if (response.documents.length === 0) return true;
      if (excludeEventId && response.documents.length === 1 && response.documents[0].$id === excludeEventId) {
        return true;
      }

      return false;
    } catch {
      return true;
    }
  }

  /**
   * Admin: Create a new event document in Appwrite
   */
  static async createEvent(
    input: CreateEventInput,
    customDocumentId?: string
  ): Promise<EventServiceResult<ATCEvent>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in the environment.' };
      }

      // Input validation
      if (!input.title?.trim()) {
        return { success: false, error: 'Event title is required.' };
      }
      if (!input.slug?.trim()) {
        return { success: false, error: 'Event slug is required.' };
      }
      if (!input.startDate) {
        return { success: false, error: 'Event start date is required.' };
      }
      if (!input.venue?.trim()) {
        return { success: false, error: 'Event venue is required.' };
      }

      const formattedSlug = input.slug.trim().toLowerCase();

      // Check slug uniqueness
      const isAvailable = await this.isSlugAvailable(formattedSlug);
      if (!isAvailable) {
        return { success: false, error: `An event with slug '${formattedSlug}' already exists.` };
      }

      const payload = {
        title: input.title.trim(),
        slug: formattedSlug,
        shortDescription: input.shortDescription?.trim() || '',
        description: input.description?.trim() || '',
        eventType: input.eventType || 'workshop',
        startDate: input.startDate,
        endDate: input.endDate || null,
        venue: input.venue.trim(),
        coverImageId: input.coverImageId || null,
        accentColor: input.accentColor || '#FFE600',
        featured: Boolean(input.featured),
        status: input.status || 'draft',
        registrationEnabled: input.registrationEnabled !== false,
        registrationLimit: input.registrationLimit ?? null,
        registrationDeadline: input.registrationDeadline || null,
        createdBy: input.createdBy || null,
      };

      const documentId = customDocumentId || ID.unique();

      const document = await databases.createDocument<EventDocument>(
        this.databaseId,
        this.collectionId,
        documentId,
        payload,
        this.getEventPermissions()
      );

      return { success: true, data: document as ATCEvent };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create event in Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Update an existing event document
   */
  static async updateEvent(
    eventId: string,
    input: UpdateEventInput
  ): Promise<EventServiceResult<ATCEvent>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!eventId?.trim()) {
        return { success: false, error: 'Event ID is required for update.' };
      }

      // If slug is being updated, check uniqueness
      if (input.slug) {
        const formattedSlug = input.slug.trim().toLowerCase();
        const isAvailable = await this.isSlugAvailable(formattedSlug, eventId);
        if (!isAvailable) {
          return { success: false, error: `Slug '${formattedSlug}' is already in use by another event.` };
        }
        input.slug = formattedSlug;
      }

      const document = await databases.updateDocument<EventDocument>(
        this.databaseId,
        this.collectionId,
        eventId.trim(),
        input
      );

      return { success: true, data: document as ATCEvent };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update event in Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Delete an event document from Appwrite
   */
  static async deleteEvent(
    eventId: string
  ): Promise<EventServiceResult<void>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!eventId?.trim()) {
        return { success: false, error: 'Event ID is required for deletion.' };
      }

      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        eventId.trim()
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to delete event from Appwrite.',
        code: error?.code,
      };
    }
  }
}

export default EventService;
