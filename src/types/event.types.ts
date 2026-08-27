import { Models } from 'appwrite';

/**
 * Supported Event Lifecycle States
 */
export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Standard ATC Event Categories / Types
 */
export type EventType =
  | 'hackathon'
  | 'workshop'
  | 'tech_talk'
  | 'competition'
  | 'experience'
  | string;

/**
 * Creative Experience Themes for Event Detail Pages
 */
export type EventVisualTheme =
  | 'playful'
  | 'terminal'
  | 'futuristic'
  | 'energetic'
  | 'editorial'
  | 'experimental'
  | 'digital'
  | string;

/**
 * ============================================================================
 * Application-level ATC Event Model
 * ============================================================================
 */
export interface ATCEvent {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  
  // Core Information
  title: string;
  slug: string;
  shortDescription: string;
  description: string;

  // Event Details
  eventType: EventType;
  startDate: string; // ISO 8601 string
  endDate?: string | null; // ISO 8601 string
  venue: string;

  // Display & Visuals
  coverImageId?: string | null;
  accentColor?: string | null;
  visualTheme?: EventVisualTheme | null;
  featured: boolean;

  // Publication State
  status: EventStatus;

  // Registration Settings
  registrationEnabled: boolean;
  registrationLimit?: number | null;
  registrationDeadline?: string | null; // ISO 8601 string

  // Audit / System
  createdBy?: string | null;
}

/**
 * Appwrite Document mapping for the Events Table
 */
export type EventDocument = ATCEvent & Models.Document;

/**
 * DTO for creating a new Event
 */
export interface CreateEventInput {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  eventType: EventType;
  startDate: string;
  endDate?: string | null;
  venue: string;
  coverImageId?: string | null;
  accentColor?: string | null;
  visualTheme?: EventVisualTheme | null;
  featured?: boolean;
  status?: EventStatus;
  registrationEnabled?: boolean;
  registrationLimit?: number | null;
  registrationDeadline?: string | null;
  createdBy?: string | null;
}

/**
 * DTO for updating an existing Event
 */
export type UpdateEventInput = Partial<CreateEventInput>;

/**
 * Query & Filter options for retrieving events
 */
export interface EventFilterOptions {
  status?: EventStatus | EventStatus[];
  eventType?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
}

/**
 * Standard Result Envelope for Event Service Operations
 */
export interface EventServiceResult<T = any> {
  success: boolean;
  data?: T;
  total?: number;
  error?: string;
  code?: number;
}
