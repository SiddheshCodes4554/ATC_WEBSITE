import { Client, Account, Databases, Storage, Functions, ID, Query, Permission, Role } from 'appwrite';

/**
 * ============================================================================
 * Central Appwrite Client & Services Configuration
 * ============================================================================
 * Initializes Appwrite using Vite environment variables:
 * - VITE_APPWRITE_ENDPOINT
 * - VITE_APPWRITE_PROJECT_ID
 *
 * Appwrite SDK version ^26.2.0 compatible.
 * No hardcoded credentials or server secrets.
 */

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

/**
 * Appwrite Constants for Database Collections, Storage Buckets, and Functions
 */
export const APPWRITE_CONFIG = {
  ENDPOINT: endpoint,
  PROJECT_ID: projectId,
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'atc_main_database',

  COLLECTIONS: {
    ADMIN_PROFILES: import.meta.env.VITE_APPWRITE_COLLECTION_ADMIN_PROFILES || 'admin_profiles',
    EVENTS: import.meta.env.VITE_APPWRITE_COLLECTION_EVENTS || 'events',
    REGISTRATIONS: import.meta.env.VITE_APPWRITE_COLLECTION_REGISTRATIONS || 'registrations',
    TEAM_MEMBERS: import.meta.env.VITE_APPWRITE_COLLECTION_TEAM_MEMBERS || 'team_members',
    PROJECTS: import.meta.env.VITE_APPWRITE_COLLECTION_PROJECTS || 'projects',
    GALLERY: import.meta.env.VITE_APPWRITE_COLLECTION_GALLERY || 'gallery',
    WEBSITE_CONTENT: import.meta.env.VITE_APPWRITE_COLLECTION_WEBSITE_CONTENT || 'website_content',
  },

  BUCKETS: {
    EVENT_COVERS: import.meta.env.VITE_APPWRITE_BUCKET_EVENT_COVERS || 'event-covers',
    EVENT_GALLERY: import.meta.env.VITE_APPWRITE_BUCKET_EVENT_GALLERY || 'event-gallery',
    TEAM_IMAGES: import.meta.env.VITE_APPWRITE_BUCKET_TEAM_IMAGES || 'team-images',
    PROJECT_IMAGES: import.meta.env.VITE_APPWRITE_BUCKET_PROJECT_IMAGES || 'project-images',
    WEBSITE_ASSETS: import.meta.env.VITE_APPWRITE_BUCKET_WEBSITE_ASSETS || 'website-assets',
  },

  FUNCTIONS: {
    TICKET_GENERATOR: import.meta.env.VITE_APPWRITE_FUNCTION_TICKET_GENERATOR || 'ticket-generator',
    EMAIL_NOTIFIER: import.meta.env.VITE_APPWRITE_FUNCTION_EMAIL_NOTIFIER || 'email-notifier',
  },

  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    MEMBER: 'member',
  },
} as const;

/**
 * Checks if Appwrite connection details are configured in environment
 */
export const isAppwriteReady = (): boolean => {
  return Boolean(
    endpoint &&
    projectId &&
    projectId !== 'placeholder_project_id' &&
    projectId !== 'your_appwrite_project_id_here'
  );
};

// Initialize the Appwrite Client
const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
} else if (endpoint) {
  client.setEndpoint(endpoint);
}

// Appwrite Core Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export utilities
export { client, ID, Query, Permission, Role };
export default client;
