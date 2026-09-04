import { Models } from 'appwrite';

/**
 * ============================================================================
 * Lab Slot & Request Type Definitions
 * ============================================================================
 */

export type LabSlotStatus = 'available' | 'blocked' | 'closed';

export type LabRequestStatus = 'pending' | 'approved' | 'waitlisted' | 'rejected' | 'cancelled';

export type LabSlotDisplayState =
  | 'AVAILABLE'        // Has capacity, no pending/approved restrictions
  | 'REQUESTED'        // Has pending requests awaiting review
  | 'OCCUPIED'         // Partially filled with approved bookings
  | 'FULL'             // Approved bookings reach capacity, no waitlist
  | 'WAITLIST_ACTIVE'  // Full and has active waitlisted users
  | 'BLOCKED'          // Admin manually blocked this slot
  | 'CLOSED';          // Admin closed this slot

/**
 * Raw Appwrite Document for Lab Slot
 */
export interface LabSlotDocument extends Models.Document {
  date: string;       // YYYY-MM-DD
  startTime: string;  // e.g. "09:00" or "09:00 AM"
  endTime: string;    // e.g. "11:00" or "11:00 AM"
  capacity: number;   // e.g. 1, 2, 3...
  status: LabSlotStatus;
  notes?: string;
}

/**
 * Parsed Clean Lab Slot
 */
export interface LabSlot {
  $id: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  status: LabSlotStatus;
  notes?: string;
  $createdAt: string;
  $updatedAt: string;
}

/**
 * Raw Appwrite Document for Lab Request
 */
export interface LabRequestDocument extends Models.Document {
  slotId: string;
  requesterName: string;
  requesterPhone: string;
  purpose: string;
  status: LabRequestStatus;
  queuePosition?: number | null;
  requestedAt: string;
  adminNotes?: string;
  userId?: string | null;
}

/**
 * Parsed Clean Lab Request (Admin view with phone & notes)
 */
export interface LabRequest {
  $id: string;
  slotId: string;
  requesterName: string;
  requesterPhone: string;
  purpose: string;
  status: LabRequestStatus;
  queuePosition: number | null;
  requestedAt: string;
  adminNotes?: string;
  userId?: string | null;
  $createdAt: string;
  $updatedAt: string;
  // Enriched slot info for admin views
  slotInfo?: {
    date: string;
    startTime: string;
    endTime: string;
    capacity: number;
  };
}

/**
 * Public-Safe Lab Request View (Strictly Omits Phone & Admin Notes)
 */
export interface PublicLabRequest {
  $id: string;
  slotId: string;
  requesterName: string;
  purpose: string;
  status: LabRequestStatus;
  queuePosition: number | null;
  requestedAt: string;
  userId?: string | null;
}

/**
 * Student Request with Resolved Slot Details
 */
export interface StudentLabRequestWithSlot {
  request: LabRequest;
  slot: LabSlot | null;
}

/**
 * Enriched Public Slot Object for UI Schedules & Timelines
 */
export interface PublicLabSlotWithDetails {
  slot: LabSlot;
  displayState: LabSlotDisplayState;
  approvedRequests: PublicLabRequest[];
  pendingRequests: PublicLabRequest[];
  waitlistedRequests: PublicLabRequest[];
  approvedCount: number;
  pendingCount: number;
  waitlistedCount: number;
  availableCapacity: number;
  totalCapacity: number;
}

/**
 * Creation / Mutation Inputs
 */
export interface CreateLabSlotInput {
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  status?: LabSlotStatus;
  notes?: string;
}

export interface UpdateLabSlotInput {
  date?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  status?: LabSlotStatus;
  notes?: string;
}

export interface CreateLabRequestInput {
  slotId: string;
  requesterName: string;
  requesterPhone: string;
  purpose: string;
  userId?: string | null;
}

export interface AdminUpdateLabRequestInput {
  status?: LabRequestStatus;
  queuePosition?: number | null;
  adminNotes?: string;
  userId?: string | null;
}

export interface LabBookingResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  assignedStatus?: LabRequestStatus;
  queuePosition?: number | null;
}

export interface AdminLabOverviewStats {
  todaySlots: number;
  availableSlots: number;
  pendingRequests: number;
  activeWaitlists: number;
  approvedBookings: number;
}

