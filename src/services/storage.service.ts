import { ID, ImageGravity, ImageFormat } from 'appwrite';
import { storage, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { AppwriteFileMetadata, ServiceResponse } from '../types/appwrite.types';
import { createPublicReadAdminWritePermissions } from '../lib/appwrite/permissions';

/**
 * ============================================================================
 * ATC Storage Service (Appwrite Storage)
 * ============================================================================
 * Manages event covers, gallery images, team avatars, project visuals, and assets.
 */
export class StorageService {

  /* ======================================================================== */
  /* PUBLIC URL ACCESS GENERATORS                                             */
  /* ======================================================================== */

  /**
   * Generates public view URL for a file in any bucket
   */
  static getFileViewUrl(bucketId: string, fileId: string): string {
    if (!isAppwriteReady() || !fileId) return '';
    try {
      return storage.getFileView(bucketId, fileId).toString();
    } catch {
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
    if (!isAppwriteReady() || !fileId) return '';
    try {
      return storage
        .getFilePreview(
          bucketId,
          fileId,
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
        .toString();
    } catch {
      return '';
    }
  }

  /**
   * Generates direct download URL for a file
   */
  static getFileDownloadUrl(bucketId: string, fileId: string): string {
    if (!isAppwriteReady() || !fileId) return '';
    try {
      return storage.getFileDownload(bucketId, fileId).toString();
    } catch {
      return '';
    }
  }

  /* Convenience Public Helpers by Bucket */

  static getEventCoverUrl(fileId?: string, width = 800): string {
    if (!fileId) return '';
    return this.getFilePreviewUrl(APPWRITE_CONFIG.BUCKETS.EVENT_COVERS, fileId, { width });
  }

  static getGalleryImageUrl(fileId?: string, width = 600): string {
    if (!fileId) return '';
    return this.getFilePreviewUrl(APPWRITE_CONFIG.BUCKETS.EVENT_GALLERY, fileId, { width });
  }

  static getTeamMemberAvatarUrl(fileId?: string, size = 300): string {
    if (!fileId) return '';
    return this.getFilePreviewUrl(APPWRITE_CONFIG.BUCKETS.TEAM_IMAGES, fileId, {
      width: size,
      height: size,
      gravity: ImageGravity.Center,
    });
  }

  static getProjectImageUrl(fileId?: string, width = 800): string {
    if (!fileId) return '';
    return this.getFilePreviewUrl(APPWRITE_CONFIG.BUCKETS.PROJECT_IMAGES, fileId, { width });
  }

  /* ======================================================================== */
  /* ADMIN-ONLY UPLOAD & FILE MUTATION METHODS                                */
  /* ======================================================================== */

  /**
   * Admin: Upload a file into a specified storage bucket
   */
  static async uploadFile(
    bucketId: string,
    file: File,
    customFileId?: string
  ): Promise<ServiceResponse<AppwriteFileMetadata>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      // Max file size check (15 MB default limit)
      const MAX_BYTES = 15 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        return { success: false, error: 'File size exceeds maximum allowed limit of 15MB.' };
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
      return {
        success: false,
        error: error?.message || 'Failed to upload file to storage bucket.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Admin: Delete a file from storage bucket
   */
  static async deleteFile(
    bucketId: string,
    fileId: string
  ): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      await storage.deleteFile(bucketId, fileId);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to delete file from storage.',
        statusCode: error?.code,
      };
    }
  }
}
