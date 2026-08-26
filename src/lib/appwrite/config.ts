/**
 * ============================================================================
 * ADVANCED TECH CLUB (ATC) - NIAT PUNE
 * Appwrite Backend Configuration & Constants
 * ============================================================================
 * Reads configuration strictly from Vite environment variables.
 * Safe for client-side inclusion (no server master API keys or secrets).
 */

export const APPWRITE_CONFIG = {
  // Server Connection
  ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID || '',

  // Database
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'atc_main_database',

  // Collections / Tables
  COLLECTIONS: {
    ADMIN_PROFILES: import.meta.env.VITE_APPWRITE_COLLECTION_ADMIN_PROFILES || 'admin_profiles',
    EVENTS: import.meta.env.VITE_APPWRITE_COLLECTION_EVENTS || 'events',
    REGISTRATIONS: import.meta.env.VITE_APPWRITE_COLLECTION_REGISTRATIONS || 'registrations',
    TEAM_MEMBERS: import.meta.env.VITE_APPWRITE_COLLECTION_TEAM_MEMBERS || 'team_members',
    PROJECTS: import.meta.env.VITE_APPWRITE_COLLECTION_PROJECTS || 'projects',
    GALLERY: import.meta.env.VITE_APPWRITE_COLLECTION_GALLERY || 'gallery',
    WEBSITE_CONTENT: import.meta.env.VITE_APPWRITE_COLLECTION_WEBSITE_CONTENT || 'website_content',
  },

  // Storage Buckets
  BUCKETS: {
    EVENT_COVERS: import.meta.env.VITE_APPWRITE_BUCKET_EVENT_COVERS || 'event-covers',
    EVENT_GALLERY: import.meta.env.VITE_APPWRITE_BUCKET_EVENT_GALLERY || 'event-gallery',
    TEAM_IMAGES: import.meta.env.VITE_APPWRITE_BUCKET_TEAM_IMAGES || 'team-images',
    PROJECT_IMAGES: import.meta.env.VITE_APPWRITE_BUCKET_PROJECT_IMAGES || 'project-images',
    WEBSITE_ASSETS: import.meta.env.VITE_APPWRITE_BUCKET_WEBSITE_ASSETS || 'website-assets',
  },

  // Cloud Functions (Serverless tasks for sensitive operations)
  FUNCTIONS: {
    TICKET_GENERATOR: import.meta.env.VITE_APPWRITE_FUNCTION_TICKET_GENERATOR || 'ticket-generator',
    EMAIL_NOTIFIER: import.meta.env.VITE_APPWRITE_FUNCTION_EMAIL_NOTIFIER || 'email-notifier',
  },

  // Roles & Access Control identifiers
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    MEMBER: 'member',
    GUEST: 'guest',
  },
} as const;

/**
 * Checks whether valid Appwrite credentials are provided in the environment
 */
export const isAppwriteReady = (): boolean => {
  const isConfigured = Boolean(
    APPWRITE_CONFIG.ENDPOINT &&
    APPWRITE_CONFIG.PROJECT_ID &&
    APPWRITE_CONFIG.PROJECT_ID !== 'placeholder_project_id' &&
    APPWRITE_CONFIG.PROJECT_ID !== 'your_appwrite_project_id_here'
  );
  return isConfigured;
};
