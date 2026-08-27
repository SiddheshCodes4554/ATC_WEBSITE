import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  LabSlot,
  LabSlotDocument,
  CreateLabSlotInput,
  UpdateLabSlotInput,
  LabBookingResult,
} from '../types/labBooking.types';

/**
 * ============================================================================
 * Lab Slot Service (Appwrite Database: `lab_slots`)
 * ============================================================================
 * Handles CRUD operations for physical laboratory time slots.
 */
export class LabSlotService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.LAB_SLOTS || 'lab_slots';
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
   * Public & Admin: Fetch all slots for a given date (sorted by startTime ASC)
   */
  static async getSlotsByDate(date: string): Promise<LabBookingResult<LabSlot[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!date?.trim()) {
        return { success: false, error: 'Date is required.' };
      }

      const response = await databases.listDocuments<LabSlotDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('date', date.trim()),
          Query.orderAsc('startTime'),
          Query.limit(100),
        ]
      );

      const slots = response.documents.map(this.mapDocumentToSlot);
      return { success: true, data: slots };
    } catch (err: any) {
      console.error('[LabSlotService] Error fetching slots by date:', err);
      return { success: false, error: err?.message || 'Failed to fetch lab slots.' };
    }
  }

  /**
   * Public & Admin: Fetch upcoming slots starting from a specific date
   */
  static async getUpcomingSlots(fromDate?: string, limit = 100): Promise<LabBookingResult<LabSlot[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

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

      const slots = response.documents.map(this.mapDocumentToSlot);
      return { success: true, data: slots };
    } catch (err: any) {
      console.error('[LabSlotService] Error fetching upcoming slots:', err);
      return { success: false, error: err?.message || 'Failed to fetch upcoming slots.' };
    }
  }

  /**
   * Admin: Fetch all slots with optional filtering and pagination
   */
  static async getAllSlots(options?: { date?: string; status?: string; limit?: number }): Promise<LabBookingResult<LabSlot[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
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

      const slots = response.documents.map(this.mapDocumentToSlot);
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
