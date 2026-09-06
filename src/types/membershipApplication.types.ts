import { Models } from 'appwrite';

/**
 * ============================================================================
 * ATC Membership Application Types
 * ============================================================================
 */

export type MembershipApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected';

export type MembershipYear = '1st Year' | '2nd Year';

export type MembershipSection =
  | 'S01'
  | 'S02'
  | 'S03'
  | 'S04'
  | 'S05'
  | 'S06'
  | 'S07';

export type MembershipAvailability =
  | '1–2 hours/week'
  | '3–5 hours/week'
  | '6–8 hours/week'
  | '8–10 hours/week'
  | '10+ hours/week';

export const MEMBERSHIP_YEARS: readonly MembershipYear[] = [
  '1st Year',
  '2nd Year',
] as const;

export const MEMBERSHIP_SECTIONS: readonly MembershipSection[] = [
  'S01',
  'S02',
  'S03',
  'S04',
  'S05',
  'S06',
  'S07',
] as const;

export const MEMBERSHIP_AVAILABILITY_OPTIONS: readonly MembershipAvailability[] = [
  '1–2 hours/week',
  '3–5 hours/week',
  '6–8 hours/week',
  '8–10 hours/week',
  '10+ hours/week',
] as const;

/**
 * Appwrite raw document structure for membership_applications collection
 */
export interface MembershipApplicationDocument extends Models.Document {
  name: string;
  email: string;
  phone: string;
  year: string;
  section: string;
  resumeLink?: string;
  skills?: string;
  experience?: string;
  availability: string;
  status: MembershipApplicationStatus;
}

/**
 * Application-level typed representation of a Membership Application
 */
export interface MembershipApplication {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  phone: string;
  year: string;
  section: string;
  resumeLink?: string;
  skills?: string;
  experience?: string;
  availability: string;
  status: MembershipApplicationStatus;
}

/**
 * Payload for submitting a new membership application
 */
export interface CreateMembershipApplicationInput {
  name: string;
  email: string;
  phone: string;
  year: string;
  section: string;
  resumeLink?: string;
  skills?: string;
  experience?: string;
  availability: string;
}

/**
 * Options for filtering and searching applications in Admin View
 */
export interface MembershipApplicationFilterOptions {
  status?: MembershipApplicationStatus | 'all';
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

/**
 * Aggregated statistics for the admin dashboard
 */
export interface MembershipApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
}
