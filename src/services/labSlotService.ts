import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  LabSlot,
  LabSlotDocument,
  CreateLabSlotInput,
  UpdateLabSlotInput,
  LabBookingResult,
} from '../types/labBooking.types';
import { isSlotExpired } from '../utils/labTimeUtils';

/**
 * ============================================================================
 * Lab Slot Service (Appwrite Database: `lab_slots`)
 * ============================================================================
 * Handles CRUD operations for physical laboratory time slots,
 * with automatic expiration & space optimization.
 */
export class LabSlotService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.LAB_SLOTS || 'lab_slots';
  }

  private static get requestsCollectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.LAB_REQUESTS || 'lab_requests';
  }

  private static getSlotPermissions(): string[] {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  private static mapDocumentToSlot(doc: LabSlotDocument): LabSlot {
    return {
      $id: doc.$id,
      date: doc.date,
      startTime: doc.startTime,
      endTime: doc.endTime,
      capacity: typeof doc.capacity === 'number' ? doc.capacity : 1,
      status: doc.status || 'available',
      notes: doc.notes || '',
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
    };
  }

  /**
   * Auto-Expiration & Storage Optimization:
   * Automatically deletes expired slots whose endTime on their date has already passed.
   * Also cascades and purges all associated requests for those expired slots.
   */
  static async cleanupExpiredSlots(options?: { bufferMinutes?: number }): Promise<LabBookingResult<{ deletedSlotsCount: number; deletedRequestsCount: number }>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const bufferMinutes = options?.bufferMinutes ?? 0;

      // Fetch slots to evaluate
      const response = await databases.listDocuments<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        [Query.limit(200), Query.orderAsc('date')]
      );

      const slots = response.documents.map(this.mapDocumentToSlot);
      const expiredSlots = slots.filter((slot) => isSlotExpired(slot.date, slot.endTime, bufferMinutes));

      if (expiredSlots.length === 0) {
        return {
          success: true,
          data: { deletedSlotsCount: 0, deletedRequestsCount: 0 },
          message: 'No expired slots found. Database is clean.',
        };
      }

      let deletedSlotsCount = 0;
      let deletedRequestsCount = 0;

      // Clean up each expired slot and its associated requests
      for (const slot of expiredSlots) {
        try {
          // 1. Find and delete all requests for this expired slot
          const reqRes = await databases.listDocuments(
            this.databaseId,
            this.requestsCollectionId,
            [Query.equal('slotId', slot.$id), Query.limit(100)]
          );

          for (const reqDoc of reqRes.documents) {
            try {
              await databases.deleteDocument(this.databaseId, this.requestsCollectionId, reqDoc.$id);
              deletedRequestsCount++;
            } catch (rErr) {
              console.warn(`[LabSlotService] Could not delete request ${reqDoc.$id}:`, rErr);
            }
          }

          // 2. Delete the slot document
          await databases.deleteDocument(this.databaseId, this.collectionId, slot.$id);
          deletedSlotsCount++;
        } catch (sErr) {
          console.warn(`[LabSlotService] Could not delete expired slot ${slot.$id}:`, sErr);
        }
      }

      console.log(`[LabSlotService] Auto-cleanup: Purged ${deletedSlotsCount} expired slot(s) and ${deletedRequestsCount} request(s).`);

      return {
        success: true,
        data: { deletedSlotsCount, deletedRequestsCount },
        message: `Auto-cleanup: Purged ${deletedSlotsCount} expired slot(s) to optimize space.`,
      };
    } catch (err: any) {
      console.error('[LabSlotService] Error during cleanupExpiredSlots:', err);
      return { success: false, error: err?.message || 'Failed to clean up expired slots.' };
    }
  }

  /**
   * Public & Admin: Fetch all slots for a given date (sorted by startTime ASC).
   * Automatically filters out and cleans up expired slots.
   */
  static async getSlotsByDate(date: string): Promise<LabBookingResult<LabSlot[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!date?.trim()) {
        return { success: false, error: 'Date is required.' };
      }

      // Background auto-cleanup
      this.cleanupExpiredSlots().catch(() => {});

      const response = await databases.listDocuments<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('date', date.trim()),
          Query.orderAsc('startTime'),
          Query.limit(100),
        ]
      );

      const slots = response.documents
        .map(this.mapDocumentToSlot)
        .filter((slot) => !isSlotExpired(slot.date, slot.endTime));

      return { success: true, data: slots };
    } catch (err: any) {
      console.error('[LabSlotService] Error fetching slots by date:', err);
      return { success: false, error: err?.message || 'Failed to fetch lab slots.' };
    }
  }

  /**
   * Public & Admin: Fetch upcoming slots starting from a specific date.
   * Automatically purges and filters out expired slots.
   */
  static async getUpcomingSlots(fromDate?: string, limit = 100): Promise<LabBookingResult<LabSlot[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      // Trigger cleanup
      await this.cleanupExpiredSlots().catch(() => {});

      const today = fromDate || new Date().toISOString().split('T')[0];
      const response = await databases.listDocuments<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.greaterThanEqual('date', today),
          Query.orderAsc('date'),
          Query.orderAsc('startTime'),
          Query.limit(limit),
        ]
      );

      const slots = response.documents
        .map(this.mapDocumentToSlot)
        .filter((slot) => !isSlotExpired(slot.date, slot.endTime));

      return { success: true, data: slots };
    } catch (err: any) {
      console.error('[LabSlotService] Error fetching upcoming slots:', err);
      return { success: false, error: err?.message || 'Failed to fetch upcoming slots.' };
    }
  }

  /**
   * Admin: Fetch all slots with optional filtering and pagination.
   * Automatically cleans up expired slots to maintain peak database performance.
   */
  static async getAllSlots(options?: { date?: string; status?: string; limit?: number; autoClean?: boolean }): Promise<LabBookingResult<LabSlot[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (options?.autoClean !== false) {
        await this.cleanupExpiredSlots().catch(() => {});
      }

      const queries: string[] = [Query.orderDesc('date'), Query.orderAsc('startTime'), Query.limit(options?.limit || 100)];
      if (options?.date) {
        queries.unshift(Query.equal('date', options.date));
      }
      if (options?.status) {
        queries.unshift(Query.equal('status', options.status));
      }

      const response = await databases.listDocuments<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      const slots = response.documents
        .map(this.mapDocumentToSlot)
        .filter((slot) => !isSlotExpired(slot.date, slot.endTime));

      return { success: true, data: slots };
    } catch (err: any) {
      console.error('[LabSlotService] Error fetching all slots:', err);
      return { success: false, error: err?.message || 'Failed to fetch slots.' };
    }
  }

  /**
   * Public & Admin: Get a single slot by ID
   */
  static async getSlotById(slotId: string): Promise<LabBookingResult<LabSlot>> {
    try {
      if (!isAppwriteReady() || !slotId?.trim()) {
        return { success: false, error: 'Valid Slot ID required.' };
      }

      const doc = await databases.getDocument<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        slotId.trim()
      );

      return { success: true, data: this.mapDocumentToSlot(doc) };
    } catch (err: any) {
      console.error('[LabSlotService] Error fetching slot by ID:', err);
      return { success: false, error: err?.message || 'Slot not found.' };
    }
  }

  /**
   * Admin: Create a new lab slot
   */
  static async createSlot(input: CreateLabSlotInput): Promise<LabBookingResult<LabSlot>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      // Basic validation
      if (!input.date || !input.startTime || !input.endTime) {
        return { success: false, error: 'Date, start time, and end time are required.' };
      }

      const capacity = Number(input.capacity) || 1;
      if (capacity < 1) {
        return { success: false, error: 'Capacity must be at least 1.' };
      }

      const payload = {
        date: input.date.trim(),
        startTime: input.startTime.trim(),
        endTime: input.endTime.trim(),
        capacity: capacity,
        status: input.status || 'available',
        notes: input.notes?.trim() || '',
      };

      const doc = await databases.createDocument<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        payload,
        this.getSlotPermissions()
      );

      return { success: true, data: this.mapDocumentToSlot(doc), message: 'Lab slot created successfully.' };
    } catch (err: any) {
      console.error('[LabSlotService] Error creating slot:', err);
      return { success: false, error: err?.message || 'Failed to create lab slot.' };
    }
  }

  /**
   * Admin: Update an existing lab slot
   */
  static async updateSlot(slotId: string, input: UpdateLabSlotInput): Promise<LabBookingResult<LabSlot>> {
    try {
      if (!isAppwriteReady() || !slotId?.trim()) {
        return { success: false, error: 'Slot ID is required.' };
      }

      const payload: Record<string, any> = {};
      if (input.date !== undefined) payload.date = input.date.trim();
      if (input.startTime !== undefined) payload.startTime = input.startTime.trim();
      if (input.endTime !== undefined) payload.endTime = input.endTime.trim();
      if (input.capacity !== undefined) payload.capacity = Math.max(1, Number(input.capacity));
      if (input.status !== undefined) payload.status = input.status;
      if (input.notes !== undefined) payload.notes = input.notes.trim();

      const doc = await databases.updateDocument<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        slotId.trim(),
        payload
      );

      return { success: true, data: this.mapDocumentToSlot(doc), message: 'Lab slot updated successfully.' };
    } catch (err: any) {
      console.error('[LabSlotService] Error updating slot:', err);
      return { success: false, error: err?.message || 'Failed to update lab slot.' };
    }
  }

  /**
   * Admin: Delete a lab slot
   */
  static async deleteSlot(slotId: string): Promise<LabBookingResult<void>> {
    try {
      if (!isAppwriteReady() || !slotId?.trim()) {
        return { success: false, error: 'Slot ID is required.' };
      }

      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        slotId.trim()
      );

      return { success: true, message: 'Lab slot deleted successfully.' };
    } catch (err: any) {
      console.error('[LabSlotService] Error deleting slot:', err);
      return { success: false, error: err?.message || 'Failed to delete lab slot.' };
    }
  }
}

export default LabSlotService;
