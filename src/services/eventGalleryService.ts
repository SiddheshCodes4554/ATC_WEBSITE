import { ID, Query, Permission, Role, ImageGravity } from 'appwrite';
import { databases, storage, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  EventGalleryImage,
  EventGalleryImageDocument,
  CreateGalleryImageInput,
  UpdateGalleryImageInput,
  GalleryBatchOrderItem,
  GalleryServiceResult,
  UploadGalleryProgress,
} from '../types/eventGallery.types';
import { StorageService, ALLOWED_IMAGE_TYPES, MAX_EVENT_IMAGE_BYTES } from './storage.service';

/**
 * ============================================================================
 * Event Gallery Service (Appwrite Database & Storage)
 * ============================================================================
 * Manages event gallery images, ordering, captions, and featured statuses
 * for the dedicated `event_gallery` collection and `event_gallery_images` bucket.
 */
export class EventGalleryService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.EVENT_GALLERY || 'event_gallery';
  }

  private static get bucketId(): string {
    return APPWRITE_CONFIG.BUCKETS.EVENT_GALLERY || 'event_gallery_images';
  }

  /**
   * Helper: Standard permissions for public read and authenticated admin write
   */
  private static getGalleryPermissions(): string[] {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Helper: Transforms Appwrite Document to typed EventGalleryImage
   */
  private static mapDocumentToGalleryImage(doc: EventGalleryImageDocument): EventGalleryImage {
    return {
      $id: doc.$id,
      eventId: doc.eventId,
      fileId: doc.fileId,
      caption: doc.caption || '',
      displayOrder: typeof doc.displayOrder === 'number' ? doc.displayOrder : 0,
      isFeatured: Boolean(doc.isFeatured),
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      imageUrl: this.getGalleryImageUrl(doc.fileId, 1600),
      previewUrl: this.getGalleryImageUrl(doc.fileId, 800),
    };
  }

  /**
   * Resolves public preview / full view URL for a gallery image file
   */
  static getGalleryImageUrl(fileId?: string, width = 800, height?: number, quality = 85): string {
    if (!fileId?.trim()) return '';
    const cleanId = fileId.trim();

    if (cleanId.startsWith('http://') || cleanId.startsWith('https://') || cleanId.startsWith('data:')) {
      return cleanId;
    }

    const bucket = this.bucketId;

    if (!isAppwriteReady()) return '';

    try {
      if (width > 0) {
        return String(
          storage.getFilePreview(
            bucket,
            cleanId,
            width,
            height,
            ImageGravity.Center,
            quality
          )
        );
      }
      return String(storage.getFileView(bucket, cleanId));
    } catch {
      return String(storage.getFileView(bucket, cleanId));
    }
  }

  /**
   * Fetches all gallery images across all events
   */
  static async getAllGalleryImages(limit = 100): Promise<GalleryServiceResult<EventGalleryImage[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const response = await databases.listDocuments<EventGalleryImageDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
        ]
      );

      const items = response.documents.map((doc) => this.mapDocumentToGalleryImage(doc));
      return { success: true, data: items };
    } catch (error: any) {
      console.warn('[EventGalleryService.getAllGalleryImages] Warning:', error?.message);
      return {
        success: false,
        error: error?.message || 'Failed to fetch gallery images.',
        code: error?.code,
      };
    }
  }

  /**
   * Fetches all gallery images for an event ordered by `displayOrder` ascending
   */
  static async getEventGallery(eventId: string): Promise<GalleryServiceResult<EventGalleryImage[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!eventId?.trim()) {
        return { success: false, error: 'Event ID is required to fetch gallery.' };
      }

      const cleanEventId = eventId.trim();

      const response = await databases.listDocuments<EventGalleryImageDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('eventId', cleanEventId),
          Query.orderAsc('displayOrder'),
          Query.limit(100),
        ]
      );

      const items = response.documents.map((doc) => this.mapDocumentToGalleryImage(doc));

      return { success: true, data: items };
    } catch (error: any) {
      console.warn(`[EventGalleryService.getEventGallery] Warning fetching gallery for event ${eventId}:`, error?.message);
      return {
        success: false,
        error: error?.message || 'Failed to fetch event gallery.',
        code: error?.code,
      };
    }
  }

  /**
   * Uploads multiple image files to Appwrite Storage and creates corresponding `event_gallery` records
   */
  static async uploadGalleryImages(
    eventId: string,
    files: File[],
    onProgress?: (progress: UploadGalleryProgress) => void
  ): Promise<GalleryServiceResult<EventGalleryImage[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!eventId?.trim()) {
        return { success: false, error: 'Event ID is required for gallery upload.' };
      }

      if (!files || files.length === 0) {
        return { success: false, error: 'No image files provided for upload.' };
      }

      const cleanEventId = eventId.trim();

      // 1. Fetch current max displayOrder for this event
      let currentMaxOrder = 0;
      try {
        const existingDocs = await databases.listDocuments<EventGalleryImageDocument>(
          this.databaseId,
          this.collectionId,
          [Query.equal('eventId', cleanEventId), Query.orderDesc('displayOrder'), Query.limit(1)]
        );
        if (existingDocs.documents.length > 0) {
          currentMaxOrder = (existingDocs.documents[0].displayOrder ?? 0) + 1;
        }
      } catch (orderErr) {
        console.warn('[EventGalleryService] Notice: Could not read existing display order:', orderErr);
      }

      const uploadedImages: EventGalleryImage[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];

        // Validate individual file format and size
        if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
          console.warn(`[EventGalleryService] Skipping non-image file "${file.name}" (${file.type})`);
          continue;
        }

        if (file.size > MAX_EVENT_IMAGE_BYTES) {
          console.warn(`[EventGalleryService] Skipping oversized file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
          continue;
        }

        try {
          if (onProgress) {
            onProgress({
              total: totalFiles,
              uploaded: i,
              currentFileName: file.name,
              percentage: Math.round((i / totalFiles) * 100),
            });
          }

          // Upload image to Storage bucket
          const fileId = ID.unique();
          const storageFile = await storage.createFile(
            this.bucketId,
            fileId,
            file,
            this.getGalleryPermissions()
          );

          // Create document in Database
          const docId = ID.unique();
          const documentData = {
            eventId: cleanEventId,
            fileId: storageFile.$id,
            caption: '',
            displayOrder: currentMaxOrder + i,
            isFeatured: false,
          };

          const doc = await databases.createDocument<EventGalleryImageDocument>(
            this.databaseId,
            this.collectionId,
            docId,
            documentData,
            this.getGalleryPermissions()
          );

          uploadedImages.push(this.mapDocumentToGalleryImage(doc));
        } catch (uploadErr: any) {
          console.error(`[EventGalleryService] Error uploading file "${file.name}":`, uploadErr);
          // Continue with remaining images so successfully uploaded files are preserved
        }
      }

      if (onProgress) {
        onProgress({
          total: totalFiles,
          uploaded: totalFiles,
          currentFileName: 'Done',
          percentage: 100,
        });
      }

      if (uploadedImages.length === 0) {
        return {
          success: false,
          error: 'Could not upload any of the selected image files. Please check formats and sizes.',
        };
      }

      return {
        success: true,
        data: uploadedImages,
      };
    } catch (error: any) {
      console.error('[EventGalleryService.uploadGalleryImages] Critical error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to upload event gallery images.',
        code: error?.code,
      };
    }
  }

  /**
   * Creates a single gallery image document record
   */
  static async createGalleryImage(
    input: CreateGalleryImageInput
  ): Promise<GalleryServiceResult<EventGalleryImage>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const payload = {
        eventId: input.eventId.trim(),
        fileId: input.fileId.trim(),
        caption: input.caption?.trim() || '',
        displayOrder: typeof input.displayOrder === 'number' ? input.displayOrder : 0,
        isFeatured: Boolean(input.isFeatured),
      };

      const doc = await databases.createDocument<EventGalleryImageDocument>(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        payload,
        this.getGalleryPermissions()
      );

      return { success: true, data: this.mapDocumentToGalleryImage(doc) };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create gallery item.',
        code: error?.code,
      };
    }
  }

  /**
   * Updates caption, displayOrder, or isFeatured flag on an existing gallery image
   */
  static async updateGalleryImage(
    id: string,
    data: UpdateGalleryImageInput
  ): Promise<GalleryServiceResult<EventGalleryImage>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!id?.trim()) {
        return { success: false, error: 'Gallery item ID is required for update.' };
      }

      const updateData: Record<string, any> = {};
      if (data.caption !== undefined) updateData.caption = data.caption ? data.caption.trim() : '';
      if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
      if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);

      const doc = await databases.updateDocument<EventGalleryImageDocument>(
        this.databaseId,
        this.collectionId,
        id.trim(),
        updateData
      );

      return { success: true, data: this.mapDocumentToGalleryImage(doc) };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update gallery item.',
        code: error?.code,
      };
    }
  }

  /**
   * Toggles the featured status of a gallery image
   */
  static async toggleFeaturedGalleryImage(
    id: string,
    isFeatured: boolean
  ): Promise<GalleryServiceResult<EventGalleryImage>> {
    return this.updateGalleryImage(id, { isFeatured });
  }

  /**
   * Batch updates the display order for multiple gallery images
   */
  static async updateGalleryOrder(
    orderedItems: GalleryBatchOrderItem[]
  ): Promise<GalleryServiceResult<boolean>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!orderedItems || orderedItems.length === 0) {
        return { success: true, data: true };
      }

      await Promise.allSettled(
        orderedItems.map((item) =>
          databases.updateDocument(this.databaseId, this.collectionId, item.id, {
            displayOrder: item.displayOrder,
          })
        )
      );

      return { success: true, data: true };
    } catch (error: any) {
      console.warn('[EventGalleryService.updateGalleryOrder] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to update gallery ordering.',
        code: error?.code,
      };
    }
  }

  /**
   * Deletes a gallery image document and its corresponding file in storage
   */
  static async deleteGalleryImage(
    id: string,
    fileId?: string
  ): Promise<GalleryServiceResult<boolean>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!id?.trim()) {
        return { success: false, error: 'Gallery ID is required for delete.' };
      }

      const cleanId = id.trim();
      let targetFileId = fileId?.trim();

      // If fileId not provided, read the document first to get the fileId
      if (!targetFileId) {
        try {
          const doc = await databases.getDocument<EventGalleryImageDocument>(
            this.databaseId,
            this.collectionId,
            cleanId
          );
          targetFileId = doc.fileId;
        } catch {
          // Document may already be removed
        }
      }

      // 1. Delete document from database
      await databases.deleteDocument(this.databaseId, this.collectionId, cleanId);

      // 2. Delete file from storage bucket
      if (targetFileId) {
        try {
          await storage.deleteFile(this.bucketId, targetFileId);
        } catch (storageErr) {
          console.warn(`[EventGalleryService] Notice: Could not remove file ${targetFileId} from storage:`, storageErr);
        }
      }

      return { success: true, data: true };
    } catch (error: any) {
      console.error('[EventGalleryService.deleteGalleryImage] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to delete gallery image.',
        code: error?.code,
      };
    }
  }

  /**
   * Deletes all gallery images and storage files associated with an event (used on event deletion)
   */
  static async deleteEventGallery(eventId: string): Promise<GalleryServiceResult<number>> {
    try {
      if (!isAppwriteReady() || !eventId?.trim()) {
        return { success: true, data: 0 };
      }

      const galleryResult = await this.getEventGallery(eventId);
      if (!galleryResult.success || !galleryResult.data) {
        return { success: true, data: 0 };
      }

      let deletedCount = 0;
      for (const item of galleryResult.data) {
        await this.deleteGalleryImage(item.$id, item.fileId);
        deletedCount++;
      }

      return { success: true, data: deletedCount };
    } catch (error: any) {
      console.warn(`[EventGalleryService] Warning deleting gallery for event ${eventId}:`, error);
      return { success: false, error: error?.message, data: 0 };
    }
  }
}

export default EventGalleryService;
