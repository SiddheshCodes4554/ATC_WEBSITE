import { Models } from 'appwrite';

/**
 * Common Appwrite Document Base Interface
 */
export interface AppwriteBaseDocument extends Models.Document {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

/**
 * Standard Service Result Envelope
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Standard Paginated Response
 */
export interface PaginatedResponse<T> {
  documents: T[];
  total: number;
}

/* ========================================================================== */
/* ADMIN PROFILES SCHEMA                                                      */
/* ========================================================================== */
export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'lead';

export interface AdminProfileDocument extends AppwriteBaseDocument {
  user_id: string;
  email: string;
  name: string;
  role: AdminRole;
  wing?: 'technical' | 'operations' | 'social' | 'outreach' | 'finance' | 'general';
  avatar_image_id?: string;
  is_active: boolean;
  last_login?: string;
}

/* ========================================================================== */
/* EVENTS SCHEMA                                                              */
/* ========================================================================== */
export type { EventStatus, EventType, ATCEvent, EventDocument, CreateEventInput, UpdateEventInput } from './event.types';

/* ========================================================================== */
/* REGISTRATIONS SCHEMA                                                       */
/* ========================================================================== */
export type CheckInStatus = 'registered' | 'checked_in' | 'cancelled' | 'waitlisted';

export interface RegistrationDocument extends AppwriteBaseDocument {
  event_id: string;
  event_title: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  student_id?: string;
  college_name?: string;
  branch?: string;
  year_of_study?: string;
  ticket_code: string;
  qr_code_id?: string;
  check_in_status: CheckInStatus;
  check_in_time?: string;
  checked_in_by?: string;
  custom_answers?: string; // JSON stringified custom form responses
}

/* ========================================================================== */
/* TEAM MEMBERS SCHEMA                                                        */
/* ========================================================================== */
export type TeamWing = 'leadership' | 'technical' | 'operations' | 'social' | 'outreach' | 'finance';

export interface TeamMemberDocument extends AppwriteBaseDocument {
  name: string;
  role: string;
  wing: TeamWing;
  is_lead: boolean;
  personality_quote?: string;
  avatar_image_id?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  skills?: string[];
  order_index: number;
  is_active: boolean;
}

/* ========================================================================== */
/* PROJECTS SCHEMA                                                            */
/* ========================================================================== */
export type ProjectStage = 'idea' | 'research' | 'design' | 'build' | 'test' | 'deployed';

export interface ProjectDocument extends AppwriteBaseDocument {
  title: string;
  slug: string;
  category: string;
  stage: ProjectStage;
  tagline?: string;
  description: string;
  long_description?: string;
  lead_name: string;
  team_members?: string[];
  cover_image_id?: string;
  gallery_image_ids?: string[];
  repo_url?: string;
  live_demo_url?: string;
  hardware_components?: string[];
  tags?: string[];
  is_featured: boolean;
  order_index: number;
}

/* ========================================================================== */
/* GALLERY / MEMORY WALL SCHEMA                                               */
/* ========================================================================== */
export type GalleryItemCategory = 'Events' | 'Workshops' | 'Behind the Scenes' | 'Projects';
export type GalleryItemFormat = 'polaroid' | 'pinned' | 'ticket' | 'torn-paper' | 'screenshot' | 'sticky';

export interface GalleryDocument extends AppwriteBaseDocument {
  title: string;
  caption: string;
  category: GalleryItemCategory;
  format: GalleryItemFormat;
  image_id?: string;
  date_label: string;
  location_label: string;
  rotation_class?: string;
  tape_color?: string;
  order_index: number;
  is_published: boolean;
}

/* ========================================================================== */
/* WEBSITE CONTENT / CMS SCHEMA                                               */
/* ========================================================================== */
export interface WebsiteContentDocument extends AppwriteBaseDocument {
  section_key: string; // e.g. "home_hero", "lab_status", "about_timeline"
  title?: string;
  subtitle?: string;
  content_json: string; // Structured JSON payload for dynamic content
  is_published: boolean;
  updated_by_admin_id?: string;
}

/* ========================================================================== */
/* STORAGE FILE METADATA                                                      */
/* ========================================================================== */
export interface AppwriteFileMetadata {
  file_id: string;
  bucket_id: string;
  name: string;
  mime_type: string;
  size_original: number;
  view_url: string;
  preview_url: string;
  download_url: string;
}
