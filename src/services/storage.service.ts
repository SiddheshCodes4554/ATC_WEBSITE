import { ID, ImageGravity, ImageFormat } from 'appwrite';
import { storage, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { AppwriteFileMetadata, ServiceResponse } from '../types/appwrite.types';
import { createPublicReadAdminWritePermissions } from '../lib/appwrite/permissions';

/**
 * Supported Event Image MIME types
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const MAX_EVENT_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB limit

/**
 * ============================================================================
 * ATC Storage Service (Appwrite Storage)
 * ============================================================================
 * Manages event covers, gallery images, team avatars, project visuals, and assets.
 */
export class StorageService {

  /* ======================================================================== */
  /* VALIDATION HELPERS                                                       */
  /* ======================================================================== */

  /**
   * Validates an event cover image file before uploading
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No image file provided.' };
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: 'Invalid file format. Please upload a JPG, PNG, WebP, or AVIF image.',
      };
    }

    if (file.size > MAX_EVENT_IMAGE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${sizeMB} MB) exceeds maximum allowed limit of 10 MB.`,
      };
    }

    return { valid: true };
  }

  /* ======================================================================== */
  /* PUBLIC URL ACCESS GENERATORS                                             */
  /* ======================================================================== */

  /**
   * Generates public view URL for a file in any bucket
   */
  static getFileViewUrl(bucketId: string, fileId: string): string {
    if (!isAppwriteReady() || !fileId?.trim()) return '';
    try {
      return String(storage.getFileView(bucketId, fileId.trim()));
    } catch (err) {
      console.warn(`[StorageService] Notice: Could not generate view URL for file ${fileId} in bucket ${bucketId}:`, err);
      return '';
    }
  }

  /**
   * Generates an optimized responsive image preview URL with cropping/compression
   */
  static getFilePreviewUrl(
    bucketId: string,
    fileId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      gravity?: ImageGravity;
      format?: ImageFormat;
    }
  ): string {
    if (!isAppwriteReady() || !fileId?.trim()) return '';
    try {
      return String(
        storage.getFilePreview(
          bucketId,
          fileId.trim(),
          options?.width || 800,
          options?.height,
          options?.gravity || ImageGravity.Center,
          options?.quality || 85,
          undefined, // borderWidth
          undefined, // borderColor
          undefined, // borderRadius
          undefined, // opacity
          undefined, // rotation
          undefined, // background
          options?.format || ImageFormat.Webp
        )
      );
    } catch (err) {
      console.warn(`[StorageService] Notice: Could not generate preview URL for file ${fileId} in bucket ${bucketId}:`, err);
      return '';
    }
  }

  /**
   * Generates direct download URL for a file
   */
  static getFileDownloadUrl(bucketId: string, fileId: string): string {
    if (!isAppwriteReady() || !fileId?.trim()) return '';
    try {
      return String(storage.getFileDownload(bucketId, fileId.trim()));
    } catch {
      return '';
    }
  }

  /* ======================================================================== */
  /* EVENT IMAGE CONVENIENCE HELPERS                                          */
  /* ======================================================================== */

  /**
   * Resolves the full URL for an event cover image (handles direct URL or Appwrite file ID)
   */
  static getEventImageUrl(fileId?: string, width = 800): string {
    if (!fileId?.trim()) return '';
    const cleanId = fileId.trim();

    // If already an absolute web URL or base64 data URI
    if (cleanId.startsWith('http://') || cleanId.startsWith('https://') || cleanId.startsWith('data:')) {
      return cleanId;
    }

    const bucketId = APPWRITE_CONFIG.BUCKETS.EVENT_IMAGES || 'atc_event_images';

    return (
      this.getFilePreviewUrl(bucketId, cleanId, { width }) ||
      this.getFileViewUrl(bucketId, cleanId)
    );
  }

  /**
   * Alias for backwards compatibility with existing event components
   */
  static getEventCoverUrl(fileId?: string, width = 800): string {
    return this.getEventImageUrl(fileId, width);
  }

  static getGalleryImageUrl(fileId?: string, width = 600): string {
    if (!fileId?.trim()) return '';
    const cleanId = fileId.trim();
    if (cleanId.startsWith('http://') || cleanId.startsWith('https://') || cleanId.startsWith('data:')) {
      return cleanId;
    }
    return (
      this.getFilePreviewUrl(APPWRITE_CONFIG.BUCKETS.EVENT_GALLERY, cleanId, { width }) ||
      this.getFileViewUrl(APPWRITE_CONFIG.BUCKETS.EVENT_GALLERY, cleanId)
    );
  }

  static getTeamMemberAvatarUrl(fileId?: string, size = 300): string {
    if (!fileId?.trim()) return '';
    const cleanId = fileId.trim();
    return this.getFilePreviewUrl(APPWRITE_CONFIG.BUCKETS.TEAM_IMAGES, cleanId, {
      width: size,
      height: size,
      gravity: ImageGravity.Center,
    });
  }

  static getProjectImageUrl(fileId?: string, width = 800): string {
    if (!fileId?.trim()) return '';
    const cleanId = fileId.trim();
    return this.getFilePreviewUrl(APPWRITE_CONFIG.BUCKETS.PROJECT_IMAGES, cleanId, { width });
  }

  /* ======================================================================== */
  /* ADMIN-ONLY UPLOAD & FILE MUTATION METHODS                                */
  /* ======================================================================== */

  /**
   * Admin: Uploads an event cover image to Appwrite Storage (atc_event_images bucket)
   */
  static async uploadEventImage(
    file: File,
    customFileId?: string
  ): Promise<ServiceResponse<AppwriteFileMetadata>> {
    // 1. Validate file format and size limits
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const bucketId = APPWRITE_CONFIG.BUCKETS.EVENT_IMAGES || 'atc_event_images';

    if (!APPWRITE_CONFIG.BUCKETS.EVENT_IMAGES) {
      console.warn(`[StorageService] Warning: VITE_APPWRITE_BUCKET_EVENT_IMAGES environment variable is not defined. Defaulting to 'atc_event_images'.`);
    }

    // 2. Upload file to Appwrite storage bucket
    return this.uploadFile(bucketId, file, customFileId);
  }

  /**
   * Admin: Deletes an event cover image from Appwrite Storage
   */
  static async deleteEventImage(fileId: string): Promise<ServiceResponse<void>> {
    const bucketId = APPWRITE_CONFIG.BUCKETS.EVENT_IMAGES || 'atc_event_images';
    return this.deleteFile(bucketId, fileId);
  }

  /**
   * Admin: Uploads a team member avatar to Appwrite Storage (team_images bucket)
   */
  static async uploadTeamImage(
    file: File,
    customFileId?: string
  ): Promise<ServiceResponse<AppwriteFileMetadata>> {
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const bucketId = APPWRITE_CONFIG.BUCKETS.TEAM_IMAGES || 'team_images';
    return this.uploadFile(bucketId, file, customFileId);
  }

  /**
   * Admin: Deletes a team member avatar from Appwrite Storage
   */
  static async deleteTeamImage(fileId: string): Promise<ServiceResponse<void>> {
    const bucketId = APPWRITE_CONFIG.BUCKETS.TEAM_IMAGES || 'team_images';
    return this.deleteFile(bucketId, fileId);
  }

  /**
   * Admin: Uploads a project cover image to Appwrite Storage (project_images bucket)
   */
  static async uploadProjectImage(
    file: File,
    customFileId?: string
  ): Promise<ServiceResponse<AppwriteFileMetadata>> {
    const validation = this.validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const bucketId = APPWRITE_CONFIG.BUCKETS.PROJECT_IMAGES || 'project_images';
    return this.uploadFile(bucketId, file, customFileId);
  }

  /**
   * Admin: Deletes a project cover image from Appwrite Storage
   */
  static async deleteProjectImage(fileId: string): Promise<ServiceResponse<void>> {
    if (!fileId?.trim()) return { success: true };
    const bucketId = APPWRITE_CONFIG.BUCKETS.PROJECT_IMAGES || 'project_images';
    return this.deleteFile(bucketId, fileId);
  }

  /**
   * Admin: General file upload method into any configured bucket
   */
  static async uploadFile(
    bucketId: string,
    file: File,
    customFileId?: string
  ): Promise<ServiceResponse<AppwriteFileMetadata>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in the environment.' };
      }

      const fileId = customFileId || ID.unique();

      const uploaded = await storage.createFile(
        bucketId,
        fileId,
        file,
        createPublicReadAdminWritePermissions()
      );

      const metadata: AppwriteFileMetadata = {
        file_id: uploaded.$id,
        bucket_id: uploaded.bucketId,
        name: uploaded.name,
        mime_type: uploaded.mimeType,
        size_original: uploaded.sizeOriginal,
        view_url: this.getFileViewUrl(bucketId, uploaded.$id),
        preview_url: this.getFilePreviewUrl(bucketId, uploaded.$id),
        download_url: this.getFileDownloadUrl(bucketId, uploaded.$id),
      };

      return { success: true, data: metadata };
    } catch (error: any) {
      console.error(`[StorageService] Upload failed for bucket '${bucketId}':`, error);
      return {
        success: false,
        error: error?.message || 'Failed to upload image file to storage.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: General file delete method
   */
  static async deleteFile(
    bucketId: string,
    fileId: string
  ): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady() || !fileId?.trim()) {
        return { success: false, error: 'Appwrite is not configured or file ID is missing.' };
      }

      await storage.deleteFile(bucketId, fileId.trim());
      return { success: true };
    } catch (error: any) {
      console.warn(`[StorageService] Cleanup notice: Could not delete file '${fileId}' from bucket '${bucketId}':`, error);
      return {
        success: false,
        error: error?.message || 'Failed to delete file from storage.',
        statusCode: error?.code,
      };
    }
  }
}

export default StorageService;
