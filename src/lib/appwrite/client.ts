import { Client, Account, Databases, Storage, Functions } from 'appwrite';
import { APPWRITE_CONFIG, isAppwriteReady } from './config';

/**
 * ============================================================================
 * Centralized Appwrite Client Instance
 * ============================================================================
 */
const client = new Client();

if (isAppwriteReady()) {
  client
    .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
    .setProject(APPWRITE_CONFIG.PROJECT_ID);
} else {
  // Graceful initialization in local dev / before env vars are populated
  client
    .setEndpoint(APPWRITE_CONFIG.ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(APPWRITE_CONFIG.PROJECT_ID || 'placeholder_project_id');
}

// Appwrite Core Service Instances
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { client };
export default client;
