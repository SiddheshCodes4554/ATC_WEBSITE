import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  LabRequest,
  LabRequestDocument,
  PublicLabRequest,
  LabSlot,
  LabSlotDocument,
  PublicLabSlotWithDetails,
  LabSlotDisplayState,
  CreateLabRequestInput,
  LabBookingResult,
  AdminLabOverviewStats,
  LabRequestStatus,
} from '../types/labBooking.types';
import { LabSlotService } from './labSlotService';

/**
 * ============================================================================
 * Lab Request & Queue Management Service (Appwrite Database: `lab_requests`)
 * ============================================================================
 * Centralizes all slot booking logic, queue safety algorithms, auto-promotions,
 * capacity checks, and public data privacy shielding.
 */
export class LabRequestService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.LAB_REQUESTS || 'lab_requests';
  }

  private static get slotsCollectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.LAB_SLOTS || 'lab_slots';
  }

  /**
   * Helper: Standard permissions (Public create/read, Authenticated Admin update/delete)
   */
  private static getRequestPermissions(): string[] {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Helper: Parses raw Appwrite document into clean LabRequest
   */
  private static mapDocumentToRequest(doc: LabRequestDocument): LabRequest {
    return {
      $id: doc.$id,
      slotId: doc.slotId,
      requesterName: doc.requesterName || 'Anonymous Maker',
      requesterPhone: doc.requesterPhone || '',
      purpose: doc.purpose || '',
      status: doc.status || 'pending',
      queuePosition: typeof doc.queuePosition === 'number' ? doc.queuePosition : null,
      requestedAt: doc.requestedAt || doc.$createdAt,
      adminNotes: doc.adminNotes || '',
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
    };
  }

  /**
   * Privacy Layer: Strictly strips phone number and internal admin notes for public consumption
   */
  static mapToPublicRequest(req: LabRequest): PublicLabRequest {
    return {
      $id: req.$id,
      slotId: req.slotId,
      requesterName: req.requesterName,
      purpose: req.purpose,
      status: req.status,
      queuePosition: req.queuePosition,
      requestedAt: req.requestedAt,
    };
  }

  /**
   * Dynamic Status Evaluator: Calculates the display state for a slot based on capacity & requests
   */
  static calculateSlotDisplayState(
    slot: LabSlot,
    requests: LabRequest[]
  ): {
    displayState: LabSlotDisplayState;
    approvedRequests: LabRequest[];
    pendingRequests: LabRequest[];
    waitlistedRequests: LabRequest[];
    approvedCount: number;
    pendingCount: number;
    waitlistedCount: number;
    availableCapacity: number;
  } {
    const slotRequests = requests.filter((r) => r.slotId === slot.$id);

    const approvedRequests = slotRequests.filter((r) => r.status === 'approved');
    const pendingRequests = slotRequests.filter((r) => r.status === 'pending');
    const waitlistedRequests = slotRequests
      .filter((r) => r.status === 'waitlisted')
      .sort((a, b) => (a.queuePosition ?? 9999) - (b.queuePosition ?? 9999));

    const approvedCount = approvedRequests.length;
    const pendingCount = pendingRequests.length;
    const waitlistedCount = waitlistedRequests.length;
    const capacity = Math.max(1, slot.capacity);
    const availableCapacity = Math.max(0, capacity - approvedCount);

    let displayState: LabSlotDisplayState = 'AVAILABLE';

    if (slot.status === 'blocked') {
      displayState = 'BLOCKED';
    } else if (slot.status === 'closed') {
      displayState = 'CLOSED';
    } else if (approvedCount >= capacity) {
      displayState = waitlistedCount > 0 ? 'WAITLIST_ACTIVE' : 'FULL';
    } else if (approvedCount > 0) {
      displayState = 'OCCUPIED';
    } else if (pendingCount > 0) {
      displayState = 'REQUESTED';
    } else {
      displayState = 'AVAILABLE';
    }

    return {
      displayState,
      approvedRequests,
      pendingRequests,
      waitlistedRequests,
      approvedCount,
      pendingCount,
      waitlistedCount,
      availableCapacity,
    };
  }

  /* ======================================================================== */
  /* PUBLIC METHODS                                                           */
  /* ======================================================================== */

  /**
   * Public: Fetches all slots for a given date enriched with public request details & computed state
   */
  static async getPublicSlotsWithDetails(date: string): Promise<LabBookingResult<PublicLabSlotWithDetails[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      // 1. Fetch all slots for this date
      const slotsRes = await LabSlotService.getSlotsByDate(date);
      if (!slotsRes.success || !slotsRes.data) {
        return { success: false, error: slotsRes.error || 'Failed to fetch slots.' };
      }

      const slots = slotsRes.data;
      if (slots.length === 0) {
        return { success: true, data: [] };
      }

      const slotIds = slots.map((s) => s.$id);

      // 2. Fetch all requests for these slots
      let requests: LabRequest[] = [];
      try {
        const requestsRes = await databases.listDocuments<LabRequestDocument>(
          this.databaseId,
          this.collectionId,
          [Query.equal('slotId', slotIds), Query.limit(200)]
        );
        requests = requestsRes.documents.map(this.mapDocumentToRequest);
      } catch (reqErr) {
        console.warn('[LabRequestService] Notice: Could not fetch requests for date:', reqErr);
      }

      // 3. Assemble public slot details
      const enrichedSlots: PublicLabSlotWithDetails[] = slots.map((slot) => {
        const stats = this.calculateSlotDisplayState(slot, requests);

        return {
          slot,
          displayState: stats.displayState,
          approvedRequests: stats.approvedRequests.map(this.mapToPublicRequest),
          pendingRequests: stats.pendingRequests.map(this.mapToPublicRequest),
          waitlistedRequests: stats.waitlistedRequests.map(this.mapToPublicRequest),
          approvedCount: stats.approvedCount,
          pendingCount: stats.pendingCount,
          waitlistedCount: stats.waitlistedCount,
          availableCapacity: stats.availableCapacity,
          totalCapacity: slot.capacity,
        };
      });

      return { success: true, data: enrichedSlots };
    } catch (err: any) {
      console.error('[LabRequestService] Error in getPublicSlotsWithDetails:', err);
      return { success: false, error: err?.message || 'Failed to load public lab schedule.' };
    }
  }

  /**
   * Public: Submits a new slot request with automatic queue & capacity evaluation
   */
  static async submitPublicRequest(input: CreateLabRequestInput): Promise<LabBookingResult<LabRequest>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      // Validation
      const name = input.requesterName?.trim();
      const phone = input.requesterPhone?.trim();
      const purpose = input.purpose?.trim();
      const slotId = input.slotId?.trim();

      if (!name || name.length < 2) {
        return { success: false, error: 'Please provide your full name (at least 2 characters).' };
      }
      if (!phone || phone.length < 7) {
        return { success: false, error: 'Please enter a valid phone number.' };
      }
      if (!purpose || purpose.length < 3) {
        return { success: false, error: 'Please describe the project or purpose of your lab visit.' };
      }
      if (!slotId) {
        return { success: false, error: 'Slot ID is required.' };
      }

      // 1. Verify Slot Status Freshly Right Before Writing
      const slotRes = await LabSlotService.getSlotById(slotId);
      if (!slotRes.success || !slotRes.data) {
        return { success: false, error: 'The selected slot does not exist.' };
      }

      const slot = slotRes.data;
      if (slot.status === 'blocked') {
        return { success: false, error: 'This slot is currently blocked by administration and cannot accept requests.' };
      }
      if (slot.status === 'closed') {
        return { success: false, error: 'This slot is closed and no longer accepting requests.' };
      }

      // 2. Fetch all existing requests for this slot right before creating to handle concurrency
      const currentRequestsRes = await databases.listDocuments<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        [Query.equal('slotId', slotId), Query.limit(100)]
      );

      const currentRequests = currentRequestsRes.documents.map(this.mapDocumentToRequest);
      const approvedCount = currentRequests.filter((r) => r.status === 'approved').length;
      const waitlistedRequests = currentRequests.filter((r) => r.status === 'waitlisted');

      let assignedStatus: LabRequestStatus = 'pending';
      let queuePosition: number | null = null;

      // 3. Determine if slot has capacity for pending review or must join waitlist
      if (approvedCount >= slot.capacity) {
        // Slot is already fully booked -> Join Waitlist
        assignedStatus = 'waitlisted';
        const maxQueuePos = waitlistedRequests.reduce((max, r) => Math.max(max, r.queuePosition ?? 0), 0);
        queuePosition = maxQueuePos + 1;
      } else {
        // Slot has capacity available -> Awaiting Admin Approval
        assignedStatus = 'pending';
        queuePosition = null;
      }

      // 4. Create document in Appwrite
      const payload = {
        slotId: slotId,
        requesterName: name,
        requesterPhone: phone,
        purpose: purpose,
        status: assignedStatus,
        queuePosition: queuePosition,
        requestedAt: new Date().toISOString(),
        adminNotes: '',
      };

      const doc = await databases.createDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        payload,
        this.getRequestPermissions()
      );

      const createdRequest = this.mapDocumentToRequest(doc);

      const message =
        assignedStatus === 'waitlisted'
          ? `Slot is currently full. You have been added to the waitlist at position #${queuePosition}. You will be notified if a spot opens up!`
          : 'Your lab access request has been submitted successfully and is awaiting review!';

      return {
        success: true,
        data: createdRequest,
        assignedStatus,
        queuePosition,
        message,
      };
    } catch (err: any) {
      console.error('[LabRequestService] Error submitting request:', err);
      return { success: false, error: err?.message || 'Failed to submit lab slot request.' };
    }
  }

  /* ======================================================================== */
  /* ADMIN WORKFLOW & QUEUE SAFETY METHODS                                    */
  /* ======================================================================== */

  /**
   * Admin: Fetch all requests with enriched slot details and optional filters
   */
  static async getAdminRequests(options?: {
    slotId?: string;
    status?: LabRequestStatus;
    date?: string;
    limit?: number;
  }): Promise<LabBookingResult<LabRequest[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const queries: string[] = [Query.orderDesc('requestedAt'), Query.limit(options?.limit || 150)];

      if (options?.slotId) {
        queries.unshift(Query.equal('slotId', options.slotId));
      }
      if (options?.status) {
        queries.unshift(Query.equal('status', options.status));
      }

      const response = await databases.listDocuments<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      const requests = response.documents.map(this.mapDocumentToRequest);

      // Optionally enrich with Slot Info
      if (requests.length > 0) {
        const uniqueSlotIds = Array.from(new Set(requests.map((r) => r.slotId)));
        try {
          const slotsDocs = await databases.listDocuments<LabSlotDocument>(
            this.databaseId,
            this.slotsCollectionId,
            [Query.equal('$id', uniqueSlotIds), Query.limit(uniqueSlotIds.length)]
          );
          const slotsMap = new Map<string, LabSlotDocument>();
          slotsDocs.documents.forEach((s) => slotsMap.set(s.$id, s));

          requests.forEach((req) => {
            const slot = slotsMap.get(req.slotId);
            if (slot) {
              req.slotInfo = {
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                capacity: slot.capacity,
              };
            }
          });
        } catch (enrichErr) {
          console.warn('[LabRequestService] Notice: Could not enrich requests with slot info:', enrichErr);
        }
      }

      // Filter by slot date if requested
      const filtered = options?.date
        ? requests.filter((r) => r.slotInfo?.date === options.date)
        : requests;

      return { success: true, data: filtered };
    } catch (err: any) {
      console.error('[LabRequestService] Error in getAdminRequests:', err);
      return { success: false, error: err?.message || 'Failed to fetch requests.' };
    }
  }

  /**
   * Admin: Approve a request (with strict capacity check & queue normalization)
   */
  static async approveRequest(requestId: string): Promise<LabBookingResult<LabRequest>> {
    try {
      if (!isAppwriteReady() || !requestId?.trim()) {
        return { success: false, error: 'Request ID is required.' };
      }

      // 1. Fetch current request
      const reqDoc = await databases.getDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        requestId.trim()
      );
      const req = this.mapDocumentToRequest(reqDoc);

      // 2. Fetch slot to check capacity
      const slotRes = await LabSlotService.getSlotById(req.slotId);
      if (!slotRes.success || !slotRes.data) {
        return { success: false, error: 'Referenced slot does not exist.' };
      }
      const slot = slotRes.data;

      // 3. Count already approved requests for this slot
      const existingReqs = await databases.listDocuments<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        [Query.equal('slotId', slot.$id), Query.limit(100)]
      );
      const otherApproved = existingReqs.documents.filter(
        (d) => d.status === 'approved' && d.$id !== req.$id
      );

      if (otherApproved.length >= slot.capacity) {
        return {
          success: false,
          error: `Cannot approve: Slot has reached maximum capacity (${slot.capacity}/${slot.capacity} approved). Increase slot capacity or move to waitlist instead.`,
        };
      }

      // 4. Update status to approved
      const updatedDoc = await databases.updateDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        req.$id,
        {
          status: 'approved',
          queuePosition: null,
        }
      );

      // 5. If it was previously waitlisted, normalize remaining waitlist
      if (req.status === 'waitlisted') {
        await this.normalizeQueuePositions(slot.$id);
      }

      return {
        success: true,
        data: this.mapDocumentToRequest(updatedDoc),
        message: 'Request approved successfully.',
      };
    } catch (err: any) {
      console.error('[LabRequestService] Error approving request:', err);
      return { success: false, error: err?.message || 'Failed to approve request.' };
    }
  }

  /**
   * Admin: Reject a request (and normalize waitlist if it was waitlisted)
   */
  static async rejectRequest(requestId: string, adminNotes?: string): Promise<LabBookingResult<void>> {
    try {
      if (!isAppwriteReady() || !requestId?.trim()) {
        return { success: false, error: 'Request ID is required.' };
      }

      const reqDoc = await databases.getDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        requestId.trim()
      );
      const wasWaitlisted = reqDoc.status === 'waitlisted';
      const slotId = reqDoc.slotId;

      await databases.updateDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        requestId.trim(),
        {
          status: 'rejected',
          queuePosition: null,
          adminNotes: adminNotes?.trim() || reqDoc.adminNotes || '',
        }
      );

      if (wasWaitlisted) {
        await this.normalizeQueuePositions(slotId);
      }

      return { success: true, message: 'Request rejected.' };
    } catch (err: any) {
      console.error('[LabRequestService] Error rejecting request:', err);
      return { success: false, error: err?.message || 'Failed to reject request.' };
    }
  }

  /**
   * Admin: Cancel an approved or pending booking with Auto-Promotion of waitlisted requests!
   */
  static async cancelRequest(requestId: string, adminNotes?: string): Promise<LabBookingResult<void>> {
    try {
      if (!isAppwriteReady() || !requestId?.trim()) {
        return { success: false, error: 'Request ID is required.' };
      }

      const reqDoc = await databases.getDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        requestId.trim()
      );
      const slotId = reqDoc.slotId;
      const wasApproved = reqDoc.status === 'approved';

      // 1. Mark as cancelled
      await databases.updateDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        requestId.trim(),
        {
          status: 'cancelled',
          queuePosition: null,
          adminNotes: adminNotes?.trim() || reqDoc.adminNotes || '',
        }
      );

      // 2. If an approved request was cancelled, check if we should auto-promote waitlisted makers
      if (wasApproved) {
        await this.autoPromoteNextWaitlisted(slotId);
      } else {
        await this.normalizeQueuePositions(slotId);
      }

      return { success: true, message: 'Request cancelled.' };
    } catch (err: any) {
      console.error('[LabRequestService] Error cancelling request:', err);
      return { success: false, error: err?.message || 'Failed to cancel request.' };
    }
  }

  /**
   * Queue Engine: Auto-promotes the lowest queuePosition waitlisted requests into `pending` review
   */
  static async autoPromoteNextWaitlisted(slotId: string): Promise<void> {
    try {
      const slotRes = await LabSlotService.getSlotById(slotId);
      if (!slotRes.success || !slotRes.data) return;
      const slot = slotRes.data;

      // Fetch all requests for slot
      const allReqs = await databases.listDocuments<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        [Query.equal('slotId', slotId), Query.limit(100)]
      );

      const approvedCount = allReqs.documents.filter((d) => d.status === 'approved').length;
      const pendingCount = allReqs.documents.filter((d) => d.status === 'pending').length;
      const availableCapacity = Math.max(0, slot.capacity - (approvedCount + pendingCount));

      if (availableCapacity <= 0) {
        await this.normalizeQueuePositions(slotId);
        return;
      }

      // Find waitlisted requests sorted by queuePosition ASC
      const waitlisted = allReqs.documents
        .filter((d) => d.status === 'waitlisted')
        .sort((a, b) => (a.queuePosition ?? 9999) - (b.queuePosition ?? 9999));

      const toPromote = waitlisted.slice(0, availableCapacity);

      for (const reqToPromote of toPromote) {
        await databases.updateDocument<LabRequestDocument>(
          this.databaseId,
          this.collectionId,
          reqToPromote.$id,
          {
            status: 'pending',
            queuePosition: null,
            adminNotes: reqToPromote.adminNotes
              ? `${reqToPromote.adminNotes} (Promoted from waitlist queue)`
              : 'Auto-promoted from waitlist queue',
          }
        );
      }

      // Normalize remaining queue
      await this.normalizeQueuePositions(slotId);
    } catch (promoteErr) {
      console.error('[LabRequestService] Error during auto-promotion:', promoteErr);
    }
  }

  /**
   * Queue Engine: Re-indexes all waitlisted requests for a slot to 1, 2, 3...
   */
  static async normalizeQueuePositions(slotId: string): Promise<void> {
    try {
      const response = await databases.listDocuments<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('slotId', slotId),
          Query.equal('status', 'waitlisted'),
          Query.orderAsc('queuePosition'),
          Query.limit(100),
        ]
      );

      const waitlisted = response.documents;
      for (let i = 0; i < waitlisted.length; i++) {
        const expectedPos = i + 1;
        if (waitlisted[i].queuePosition !== expectedPos) {
          await databases.updateDocument<LabRequestDocument>(
            this.databaseId,
            this.collectionId,
            waitlisted[i].$id,
            { queuePosition: expectedPos }
          );
        }
      }
    } catch (normErr) {
      console.warn('[LabRequestService] Notice: Could not normalize queue positions:', normErr);
    }
  }

  /**
   * Admin: Move a request in the waitlist queue up or down
   */
  static async moveRequestInQueue(requestId: string, direction: 'up' | 'down'): Promise<LabBookingResult<void>> {
    try {
      if (!isAppwriteReady() || !requestId?.trim()) {
        return { success: false, error: 'Request ID required.' };
      }

      const reqDoc = await databases.getDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        requestId.trim()
      );

      if (reqDoc.status !== 'waitlisted') {
        return { success: false, error: 'Only waitlisted requests can be reordered in the queue.' };
      }

      const currentPos = reqDoc.queuePosition ?? 1;
      const targetPos = direction === 'up' ? currentPos - 1 : currentPos + 1;

      if (targetPos < 1) {
        return { success: false, error: 'Request is already at the front of the queue.' };
      }

      // Find neighbor
      const neighborRes = await databases.listDocuments<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('slotId', reqDoc.slotId),
          Query.equal('status', 'waitlisted'),
          Query.equal('queuePosition', targetPos),
          Query.limit(1),
        ]
      );

      if (neighborRes.documents.length === 0) {
        return { success: false, error: 'Cannot move beyond queue boundary.' };
      }

      const neighbor = neighborRes.documents[0];

      // Swap positions
      await databases.updateDocument(this.databaseId, this.collectionId, reqDoc.$id, {
        queuePosition: targetPos,
      });
      await databases.updateDocument(this.databaseId, this.collectionId, neighbor.$id, {
        queuePosition: currentPos,
      });

      return { success: true, message: `Moved queue position ${direction}.` };
    } catch (err: any) {
      console.error('[LabRequestService] Error moving request in queue:', err);
      return { success: false, error: err?.message || 'Failed to move in queue.' };
    }
  }

  /**
   * Admin: Explicitly promote a waitlisted request into `pending`
   */
  static async promoteWaitlistToPending(requestId: string): Promise<LabBookingResult<void>> {
    try {
      if (!isAppwriteReady() || !requestId?.trim()) {
        return { success: false, error: 'Request ID required.' };
      }

      const reqDoc = await databases.getDocument<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        requestId.trim()
      );

      await databases.updateDocument(this.databaseId, this.collectionId, requestId.trim(), {
        status: 'pending',
        queuePosition: null,
      });

      await this.normalizeQueuePositions(reqDoc.slotId);

      return { success: true, message: 'Request promoted to Pending review.' };
    } catch (err: any) {
      console.error('[LabRequestService] Error promoting waitlist request:', err);
      return { success: false, error: err?.message || 'Failed to promote request.' };
    }
  }

  /**
   * Admin: Overview Dashboard Stats calculation
   */
  static async getAdminOverviewStats(): Promise<LabBookingResult<AdminLabOverviewStats>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const today = new Date().toISOString().split('T')[0];

      // Fetch today's slots
      const todaySlotsRes = await LabSlotService.getSlotsByDate(today);
      const todaySlots = todaySlotsRes.data || [];

      // Fetch all requests
      const requestsRes = await databases.listDocuments<LabRequestDocument>(
        this.databaseId,
        this.collectionId,
        [Query.limit(500)]
      );

      const allReqs = requestsRes.documents.map(this.mapDocumentToRequest);

      const pendingRequests = allReqs.filter((r) => r.status === 'pending').length;
      const activeWaitlists = allReqs.filter((r) => r.status === 'waitlisted').length;
      const approvedBookings = allReqs.filter((r) => r.status === 'approved').length;

      // Available today
      let availableSlots = 0;
      todaySlots.forEach((slot) => {
        const stats = this.calculateSlotDisplayState(slot, allReqs);
        if (stats.displayState === 'AVAILABLE' || stats.displayState === 'OCCUPIED' || stats.displayState === 'REQUESTED') {
          if (stats.availableCapacity > 0) availableSlots++;
        }
      });

      return {
        success: true,
        data: {
          todaySlots: todaySlots.length,
          availableSlots,
          pendingRequests,
          activeWaitlists,
          approvedBookings,
        },
      };
    } catch (err: any) {
      console.error('[LabRequestService] Error calculating overview stats:', err);
      return {
        success: true,
        data: {
          todaySlots: 0,
          availableSlots: 0,
          pendingRequests: 0,
          activeWaitlists: 0,
          approvedBookings: 0,
        },
      };
    }
  }
}

export default LabRequestService;
