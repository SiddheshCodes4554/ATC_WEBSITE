import { Models } from 'appwrite';

/**
 * ============================================================================
 * Event Gallery Document & Model Definitions
 * ============================================================================
 */

export interface EventGalleryImageDocument extends Models.Document {
  eventId: string;
  fileId: string;
  caption?: string | null;
  displayOrder: number;
  isFeatured: boolean;
}

export interface EventGalleryImage {
  $id: string;
  eventId: string;
  fileId: string;
  caption?: string | null;
  displayOrder: number;
  isFeatured: boolean;
  $createdAt: string;
  $updatedAt: string;
  imageUrl?: string;
  previewUrl?: string;
}

export interface CreateGalleryImageInput {
  eventId: string;
  fileId: string;
  caption?: string | null;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface UpdateGalleryImageInput {
  caption?: string | null;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface GalleryBatchOrderItem {
  id: string;
  displayOrder: number;
}

export interface GalleryServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface UploadGalleryProgress {
  total: number;
  uploaded: number;
  currentFileName: string;
  percentage: number;
}
