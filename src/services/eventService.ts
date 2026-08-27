import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { StorageService } from './storage.service';
import {
  ATCEvent,
  EventDocument,
  CreateEventInput,
  UpdateEventInput,
  EventFilterOptions,
  EventServiceResult,
} from '../types/event.types';
import { serializeGalleryImages, parseGalleryImages } from '../types/project.types';

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
   * Helper: Transforms raw Appwrite EventDocument to typed ATCEvent
   */
  static mapDocumentToEvent(doc: EventDocument): ATCEvent {
    const rawDescription = doc.description || '';
    const galleryImageIds = parseGalleryImages((doc as any).galleryImageIds, rawDescription);
    const cleanDescription = rawDescription.replace(/<!--\s*ATC_GALLERY:\s*\[.*?\]\s*-->/gs, '').trim();

    return {
      ...(doc as any),
      description: cleanDescription,
      galleryImageIds,
    };
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
   * Helper: Resilient document creation that gracefully prunes attributes not present in Appwrite schema
   */
  private static async createDocumentResilient<T extends EventDocument>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, any>,
    permissions?: string[]
  ): Promise<T> {
    const payload = { ...data };
    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any, permissions);
      } catch (err: any) {
        const match =
          err?.message?.match(/Unknown attribute:\s*"([^"]+)"/i) ||
          err?.message?.match(/Attribute not found.*?:\s*"([^"]+)"/i) ||
          err?.message?.match(/attribute\s+"([^"]+)"\s+is unknown/i);
        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(`[EventService] Stripping unknown attribute "${match[1]}" from payload and retrying...`);
          delete payload[match[1]];
          continue;
        }
        throw err;
      }
    }
    return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any, permissions);
  }

  /**
   * Helper: Resilient document update that gracefully prunes attributes not present in Appwrite schema
   */
  private static async updateDocumentResilient<T extends EventDocument>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, any>
  ): Promise<T> {
    const payload = { ...data };
    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await databases.updateDocument<T>(databaseId, collectionId, documentId, payload as any);
      } catch (err: any) {
        const match =
          err?.message?.match(/Unknown attribute:\s*"([^"]+)"/i) ||
          err?.message?.match(/Attribute not found.*?:\s*"([^"]+)"/i) ||
          err?.message?.match(/attribute\s+"([^"]+)"\s+is unknown/i);
        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(`[EventService] Stripping unknown attribute "${match[1]}" from payload and retrying...`);
          delete payload[match[1]];
          continue;
        }
        throw err;
      }
    }
    return await databases.updateDocument<T>(databaseId, collectionId, documentId, payload as any);
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
        data: response.documents.map((doc) => this.mapDocumentToEvent(doc)),
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
        data: response.documents.map((doc) => this.mapDocumentToEvent(doc)),
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

      return { success: true, data: this.mapDocumentToEvent(document) };
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

      return { success: true, data: this.mapDocumentToEvent(response.documents[0]) };
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

      const rawDesc = input.description?.trim() || '';
      const gallerySerialized = serializeGalleryImages(input.galleryImageIds);
      const descriptionWithGallery = gallerySerialized !== '[]'
        ? `${rawDesc}\n\n<!-- ATC_GALLERY: ${gallerySerialized} -->`
        : rawDesc;

      const payload: Record<string, any> = {
        title: input.title.trim(),
        slug: formattedSlug,
        shortDescription: input.shortDescription?.trim() || '',
        description: descriptionWithGallery,
        eventType: input.eventType || 'workshop',
        startDate: input.startDate,
        endDate: input.endDate || null,
        venue: input.venue.trim(),
        coverImageId: input.coverImageId || null,
        accentColor: input.accentColor || '#FFE600',
        visualTheme: input.visualTheme || 'playful',
        featured: Boolean(input.featured),
        status: input.status || 'draft',
        registrationEnabled: input.registrationEnabled !== false,
        registrationLimit: input.registrationLimit ?? null,
        registrationDeadline: input.registrationDeadline || null,
        createdBy: input.createdBy || null,
      };

      if (input.galleryImageIds) {
        payload.galleryImageIds = gallerySerialized;
      }

      const documentId = customDocumentId || ID.unique();

      const document = await this.createDocumentResilient<EventDocument>(
        this.databaseId,
        this.collectionId,
        documentId,
        payload,
        this.getEventPermissions()
      );

      return { success: true, data: this.mapDocumentToEvent(document) };
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

      const updateData: Record<string, any> = { ...input };

      if (input.description !== undefined || input.galleryImageIds !== undefined) {
        const baseDesc = input.description !== undefined ? input.description.trim() : '';
        const cleanBase = baseDesc.replace(/<!--\s*ATC_GALLERY:\s*\[.*?\]\s*-->/gs, '').trim();
        const gallerySerialized = input.galleryImageIds !== undefined
          ? serializeGalleryImages(input.galleryImageIds)
          : '[]';

        updateData.description = gallerySerialized !== '[]'
          ? `${cleanBase}\n\n<!-- ATC_GALLERY: ${gallerySerialized} -->`
          : cleanBase;

        if (input.galleryImageIds !== undefined) {
          updateData.galleryImageIds = gallerySerialized;
        }
      }

      const document = await this.updateDocumentResilient<EventDocument>(
        this.databaseId,
        this.collectionId,
        eventId.trim(),
        updateData
      );

      return { success: true, data: this.mapDocumentToEvent(document) };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update event in Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Delete an event document from Appwrite and clean up storage assets
   */
  static async deleteEvent(
    eventId: string,
    coverImageId?: string,
    galleryImageIds?: string[]
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

      // Clean up cover image
      if (coverImageId?.trim()) {
        try {
          await StorageService.deleteEventImage(coverImageId.trim());
        } catch (imgErr) {
          console.warn('[EventService.deleteEvent] Cover image cleanup notice:', imgErr);
        }
      }

      // Clean up gallery images
      if (galleryImageIds && Array.isArray(galleryImageIds)) {
        for (const gId of galleryImageIds) {
          if (gId?.trim()) {
            try {
              await StorageService.deleteEventImage(gId.trim());
            } catch (gErr) {
              console.warn('[EventService.deleteEvent] Gallery image cleanup notice:', gErr);
            }
          }
        }
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to delete event from Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Auto-seed or Synchronize Official ATC Events into Appwrite Database
   */
  static async syncDefaultEventsToAppwrite(): Promise<EventServiceResult<ATCEvent[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in environment.' };
      }

      const defaultEvents: CreateEventInput[] = [
        {
          title: 'Worst UI/UX Hackathon',
          slug: 'worst-ui-ux',
          shortDescription: 'Break every UX rule possible in a 4-hour creative sprint.',
          description: 'In every software engineering syllabus, students are taught how to design intuitive, clean, and seamless user experiences. We wanted to flip that completely on its head.\n\nThe Worst UI/UX Hackathon challenged builders across NIAT Pune to intentionally violate every rule in the Human Interface Guidelines: unclickable buttons, backward progress bars, inverted scroll mechanics, Comic Sans typography, and multi-step captchas written in ancient languages.',
          eventType: 'hackathon',
          startDate: '2025-12-13T10:00:00.000Z',
          venue: 'Lab 5.0, NIAT Pune',
          accentColor: '#FF6B6B',
          visualTheme: 'playful',
          featured: true,
          status: 'completed',
          registrationEnabled: false,
        },
        {
          title: 'Git & GitHub: Road to GSoC',
          slug: 'git-github-road-to-gsoc',
          shortDescription: 'Learn. Contribute. Build in public.',
          description: 'A hands-on deep dive from zero Git knowledge to landing your first open-source pull requests and crafting winning Google Summer of Code proposals.\n\nCovering branch workflows, merge conflict resolution, interactive rebasing, open-source licensing, and proposal clinics.',
          eventType: 'workshop',
          startDate: '2026-02-07T10:00:00.000Z',
          venue: 'NIAT Audi & Lab 5.0, Pune',
          accentColor: '#2ED573',
          visualTheme: 'terminal',
          featured: true,
          status: 'completed',
          registrationEnabled: false,
        },
        {
          title: 'MST Blockchain Workshop',
          slug: 'mst-blockchain-workshop',
          shortDescription: 'Exploring decentralized technology & smart contracts.',
          description: 'Demystifying cryptographic primitives, consensus mechanisms, smart contracts in Solidity, and zero-knowledge proofs from the ground up.\n\nHands-on Solidity contract development, Remix IDE and testnet deployments on the NIAT Lab 5.0 cluster.',
          eventType: 'workshop',
          startDate: '2026-02-27T10:00:00.000Z',
          venue: 'NIAT Computer Wing & Lab 5.0, Pune',
          accentColor: '#00D2D3',
          visualTheme: 'futuristic',
          featured: true,
          status: 'completed',
          registrationEnabled: false,
        },
      ];

      for (const evt of defaultEvents) {
        const isAvailable = await this.isSlugAvailable(evt.slug);
        if (isAvailable) {
          try {
            await this.createEvent(evt);
          } catch (seedErr) {
            console.warn(`[EventService] Could not auto-seed ${evt.slug}:`, seedErr);
          }
        }
      }

      const all = await this.getAllEvents({ limit: 50 });
      return { success: true, data: all.data || [] };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sync default events.' };
    }
  }
}

export default EventService;
