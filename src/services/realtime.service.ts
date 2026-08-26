import { client } from '../lib/appwrite/client';
import { APPWRITE_CONFIG, isAppwriteReady } from '../lib/appwrite/config';

/**
 * ============================================================================
 * ATC Realtime Event Subscription Service
 * ============================================================================
 * Wrapper for Appwrite WebSocket subscriptions (e.g. live registration counts, QR scan events).
 */
export class RealtimeService {
  /**
   * Subscribes to live registrations for a specific event
   */
  static subscribeToEventRegistrations(
    eventId: string,
    callback: (payload: any) => void
  ): () => void {
    if (!isAppwriteReady()) {
      return () => {};
    }

    const channel = `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${APPWRITE_CONFIG.COLLECTIONS.REGISTRATIONS}.documents`;

    const unsubscribe = client.subscribe(channel, (response) => {
      // Filter for the specific event if matching
      const doc = response.payload as any;
      if (!eventId || doc?.event_id === eventId) {
        callback(response);
      }
    });

    return unsubscribe;
  }

  /**
   * Subscribes to any collection document changes
   */
  static subscribeToCollection(
    collectionId: string,
    callback: (payload: any) => void
  ): () => void {
    if (!isAppwriteReady()) {
      return () => {};
    }

    const channel = `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${collectionId}.documents`;
    return client.subscribe(channel, callback);
  }

  /**
   * Subscribes to a single specific document
   */
  static subscribeToDocument(
    collectionId: string,
    documentId: string,
    callback: (payload: any) => void
  ): () => void {
    if (!isAppwriteReady()) {
      return () => {};
    }

    const channel = `databases.${APPWRITE_CONFIG.DATABASE_ID}.collections.${collectionId}.documents.${documentId}`;
    return client.subscribe(channel, callback);
  }
}
