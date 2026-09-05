import { Models } from 'appwrite';

/**
 * ============================================================================
 * ATC Project Idea Hub Types
 * ============================================================================
 */

export type ProjectIdeaStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'changes_requested'
  | 'rejected';

export type ProjectIdeaCategory =
  | 'Artificial Intelligence'
  | 'Robotics'
  | 'Internet of Things'
  | 'Web Development'
  | 'Mobile Development'
  | 'Cybersecurity'
  | 'Electronics'
  | 'Open Innovation'
  | 'Other';

export const PROJECT_IDEA_CATEGORIES: ProjectIdeaCategory[] = [
  'Artificial Intelligence',
  'Robotics',
  'Internet of Things',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Electronics',
  'Open Innovation',
  'Other',
];

export interface ProjectLinks {
  github?: string;
  demo?: string;
  figma?: string;
  other?: string;
}

/**
 * Appwrite raw document structure for project_ideas collection
 */
export interface ProjectIdeaDocument extends Models.Document {
  userId: string;
  title: string;
  category?: string;
  shortDescription: string;
  content: string;
  technologies?: string;
  links?: string;
  status: ProjectIdeaStatus;
  feedback?: string;
  submittedAt?: string;
  reviewedBy?: string;
}

/**
 * Application-level ProjectIdea object with helper parsed fields
 */
export interface ProjectIdea {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  title: string;
  category?: string;
  shortDescription: string;
  content: string;
  technologies?: string;
  links?: string;
  parsedLinks: ProjectLinks;
  status: ProjectIdeaStatus;
  feedback?: string;
  submittedAt?: string;
  reviewedBy?: string;
  authorName?: string;
}

export interface CreateProjectIdeaInput {
  title: string;
  category?: string;
  shortDescription: string;
  content: string;
  technologies?: string;
  links?: ProjectLinks | string;
  status?: ProjectIdeaStatus;
}

export interface UpdateProjectIdeaInput {
  title?: string;
  category?: string;
  shortDescription?: string;
  content?: string;
  technologies?: string;
  links?: ProjectLinks | string;
  status?: ProjectIdeaStatus;
  submittedAt?: string;
}

export interface ReviewProjectIdeaInput {
  status: 'approved' | 'changes_requested' | 'rejected';
  feedback?: string;
}

export interface ProjectIdeaFilterOptions {
  status?: ProjectIdeaStatus | ProjectIdeaStatus[] | 'all';
  category?: string;
  searchQuery?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ProjectIdeaStats {
  total: number;
  draft: number;
  submitted: number;
  under_review: number;
  approved: number;
  changes_requested: number;
  rejected: number;
  pendingReview: number;
}

/**
 * Serializes a ProjectLinks object to a safe JSON string
 */
export const serializeLinks = (links?: ProjectLinks | string | null): string => {
  if (!links) return '{}';
  if (typeof links === 'string') {
    try {
      const parsed = JSON.parse(links);
      return JSON.stringify(parsed);
    } catch {
      return '{}';
    }
  }
  const cleanObj: ProjectLinks = {};
  if (links.github?.trim()) cleanObj.github = links.github.trim();
  if (links.demo?.trim()) cleanObj.demo = links.demo.trim();
  if (links.figma?.trim()) cleanObj.figma = links.figma.trim();
  if (links.other?.trim()) cleanObj.other = links.other.trim();
  return JSON.stringify(cleanObj);
};

/**
 * Parses a JSON links string into a typed ProjectLinks object
 */
export const parseLinks = (linksJson?: string | null): ProjectLinks => {
  if (!linksJson || typeof linksJson !== 'string' || !linksJson.trim()) {
    return {};
  }
  try {
    const parsed = JSON.parse(linksJson);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        github: typeof parsed.github === 'string' ? parsed.github.trim() : undefined,
        demo: typeof parsed.demo === 'string' ? parsed.demo.trim() : undefined,
        figma: typeof parsed.figma === 'string' ? parsed.figma.trim() : undefined,
        other: typeof parsed.other === 'string' ? parsed.other.trim() : undefined,
      };
    }
    return {};
  } catch {
    return {};
  }
};
