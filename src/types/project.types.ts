import { Models } from 'appwrite';

/**
 * ============================================================================
 * Project Management System Types & Interfaces
 * ============================================================================
 * Aligned with Appwrite collection: projects
 * Bucket: project_images
 */

export type ProjectStatus = 'draft' | 'published' | 'archived';

/**
 * Appwrite raw document structure for projects
 */
export interface ProjectDocument extends Models.Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImageId?: string;
  techStack: string; // JSON-serialized string of string[]
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  displayOrder: number;
}

/**
 * Frontend ATCProject Entity (with parsed techStack array)
 */
export interface ATCProject {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImageId?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  displayOrder: number;
}

/**
 * Payload for creating a new project
 */
export interface CreateProjectInput {
  title: string;
  slug?: string;
  shortDescription: string;
  description: string;
  coverImageId?: string;
  techStack: string[] | string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status?: ProjectStatus;
  displayOrder?: number;
}

/**
 * Payload for updating an existing project
 */
export interface UpdateProjectInput {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  coverImageId?: string;
  techStack?: string[] | string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status?: ProjectStatus;
  displayOrder?: number;
}

/**
 * Query filter options for project listings
 */
export interface ProjectFilterOptions {
  status?: ProjectStatus | ProjectStatus[];
  featuredOnly?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
}

/**
 * Generic result wrapper for ProjectService operations
 */
export interface ProjectServiceResult<T = any> {
  success: boolean;
  data?: T;
  total?: number;
  error?: string;
  code?: number;
}

/* ============================================================================ */
/* TECH STACK SERIALIZATION HELPERS                                             */
/* ============================================================================ */

/**
 * Serializes a string array into a safe JSON string for Appwrite storage
 */
export function serializeTechStack(techStack: string[] | string | undefined | null): string {
  if (!techStack) return '[]';
  if (typeof techStack === 'string') {
    // If it's already JSON string, validate and return
    try {
      const parsed = JSON.parse(techStack);
      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed.map((item) => String(item).trim()).filter(Boolean));
      }
    } catch {
      // If it's comma-separated plain text
      const items = techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return JSON.stringify(items);
    }
  }
  if (Array.isArray(techStack)) {
    const cleaned = techStack
      .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
      .filter(Boolean);
    return JSON.stringify(cleaned);
  }
  return '[]';
}

/**
 * Parses raw techStack string from Appwrite into a clean string array
 */
export function parseTechStack(raw: string | string[] | undefined | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
      if (typeof parsed === 'string') {
        return [parsed.trim()].filter(Boolean);
      }
    } catch {
      // Fallback for legacy comma-separated values
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}
