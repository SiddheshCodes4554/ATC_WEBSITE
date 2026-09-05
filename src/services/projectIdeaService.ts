import { ID, Query, Permission, Role, Models } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import {
  ProjectIdea,
  ProjectIdeaDocument,
  ProjectIdeaStatus,
  CreateProjectIdeaInput,
  UpdateProjectIdeaInput,
  ReviewProjectIdeaInput,
  ProjectIdeaFilterOptions,
  ProjectIdeaStats,
  serializeLinks,
  parseLinks,
} from '../types/projectIdea.types';

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

/**
 * ============================================================================
 * ATC Appwrite Project Idea Hub Database Service
 * ============================================================================
 * Handles creation, draft saving, community submission, public exploration,
 * and administrator review workflow for student project ideas.
 */
export class ProjectIdeaService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.PROJECT_IDEAS;
  }

  /**
   * Helper: Standard permissions for project ideas
   */
  private static getIdeaPermissions(userId: string): string[] {
    return [
      Permission.read(Role.any()), // Public can read if document status is public
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
      Permission.update(Role.users()), // Authenticated admins can update
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Resilient document creator that removes unknown attributes if the collection schema lacks them
   */
  private static async createDocumentResilient<T extends Models.Document = Models.Document>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, any>,
    permissions?: string[]
  ): Promise<T> {
    const payload = { ...data };
    let currentPermissions = permissions;
    const maxRetries = 10;

    for (let i = 0; i < maxRetries; i++) {
      try {
        if (currentPermissions && currentPermissions.length > 0) {
          return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any, currentPermissions);
        } else {
          return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any);
        }
      } catch (err: any) {
        if (currentPermissions && (err?.code === 401 || err?.code === 403 || /permission/i.test(err?.message || ''))) {
          currentPermissions = undefined;
          continue;
        }

        const match =
          err?.message?.match(/Unknown attribute:\s*"([^"]+)"/i) ||
          err?.message?.match(/Attribute not found.*?:\s*"([^"]+)"/i) ||
          err?.message?.match(/attribute\s+"([^"]+)"\s+is unknown/i);

        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(`[ProjectIdeaService] Stripping unknown attribute "${match[1]}" from payload and retrying...`);
          delete payload[match[1]];
          continue;
        }

        throw err;
      }
    }

    return await databases.createDocument<T>(databaseId, collectionId, documentId, payload as any);
  }

  /**
   * Resilient document update that removes unknown attributes if needed
   */
  private static async updateDocumentResilient<T extends Models.Document = Models.Document>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, any>
  ): Promise<T> {
    const payload = { ...data };
    const maxRetries = 10;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await databases.updateDocument<T>(databaseId, collectionId, documentId, payload as any);
      } catch (err: any) {
        const match =
          err?.message?.match(/Unknown attribute:\s*"([^"]+)"/i) ||
          err?.message?.match(/Attribute not found.*?:\s*"([^"]+)"/i) ||
          err?.message?.match(/attribute\s+"([^"]+)"\s+is unknown/i);

        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(`[ProjectIdeaService] Stripping unknown attribute "${match[1]}" from payload and retrying update...`);
          delete payload[match[1]];
          continue;
        }

        throw err;
      }
    }

    return await databases.updateDocument<T>(databaseId, collectionId, documentId, payload as any);
  }

  /**
   * Helper to map an Appwrite ProjectIdeaDocument into a clean ProjectIdea
   */
  private static mapDocumentToIdea(doc: ProjectIdeaDocument): ProjectIdea {
    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      userId: doc.userId,
      title: doc.title,
      category: doc.category,
      shortDescription: doc.shortDescription,
      content: doc.content,
      technologies: doc.technologies,
      links: doc.links,
      parsedLinks: parseLinks(doc.links),
      status: doc.status,
      feedback: doc.feedback,
      submittedAt: doc.submittedAt,
      reviewedBy: doc.reviewedBy,
    };
  }

  /**
   * Student: Creates a new project idea (as draft or submitted)
   */
  static async createIdea(
    input: CreateProjectIdeaInput,
    userId: string
  ): Promise<ServiceResult<ProjectIdea>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in the environment.' };
      }

      if (!userId?.trim()) {
        return { success: false, error: 'Authenticated user ID is required to create an idea.' };
      }

      if (!input.title?.trim()) {
        return { success: false, error: 'Project title is required.' };
      }

      if (input.title.trim().length > 255) {
        return { success: false, error: 'Project title cannot exceed 255 characters.' };
      }

      if (!input.shortDescription?.trim()) {
        return { success: false, error: 'Short description is required.' };
      }

      if (input.shortDescription.trim().length > 500) {
        return { success: false, error: 'Short description cannot exceed 500 characters.' };
      }

      if (!input.content?.trim()) {
        return { success: false, error: 'Project details are required.' };
      }

      const status: ProjectIdeaStatus = input.status || 'draft';
      const submittedAt = status === 'submitted' ? new Date().toISOString() : undefined;
      const linksString = serializeLinks(input.links);

      const payload: Record<string, any> = {
        userId: userId.trim(),
        title: input.title.trim(),
        shortDescription: input.shortDescription.trim(),
        content: input.content.trim(),
        status,
        links: linksString,
      };

      if (input.category?.trim()) payload.category = input.category.trim();
      if (input.technologies?.trim()) payload.technologies = input.technologies.trim();
      if (submittedAt) payload.submittedAt = submittedAt;

      const docId = ID.unique();
      const document = await this.createDocumentResilient<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        docId,
        payload,
        this.getIdeaPermissions(userId.trim())
      );

      return { success: true, data: this.mapDocumentToIdea(document) };
    } catch (error: any) {
      console.error('[ProjectIdeaService.createIdea] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to create project idea.',
        code: error?.code,
      };
    }
  }

  /**
   * Student: Saves an idea as a Draft (creates new or updates existing)
   */
  static async saveDraft(
    input: CreateProjectIdeaInput | UpdateProjectIdeaInput,
    userId: string,
    ideaId?: string
  ): Promise<ServiceResult<ProjectIdea>> {
    if (ideaId && ideaId.trim()) {
      return this.updateIdea(ideaId.trim(), { ...input, status: 'draft' }, userId);
    }
    return this.createIdea({
      title: input.title || 'Untitled Idea Draft',
      shortDescription: input.shortDescription || 'Draft in progress...',
      content: input.content || '<p></p>',
      category: input.category,
      technologies: input.technologies,
      links: input.links,
      status: 'draft',
    }, userId);
  }

  /**
   * Student: Submits an idea for Review (creates new or updates existing)
   */
  static async submitIdea(
    input: CreateProjectIdeaInput | UpdateProjectIdeaInput,
    userId: string,
    ideaId?: string
  ): Promise<ServiceResult<ProjectIdea>> {
    const submittedAt = new Date().toISOString();
    if (ideaId && ideaId.trim()) {
      return this.updateIdea(ideaId.trim(), { ...input, status: 'submitted', submittedAt }, userId);
    }
    return this.createIdea({
      title: input.title || '',
      shortDescription: input.shortDescription || '',
      content: input.content || '',
      category: input.category,
      technologies: input.technologies,
      links: input.links,
      status: 'submitted',
    }, userId);
  }

  /**
   * Student: Resubmits an idea after Changes Requested (retains feedback history)
   */
  static async resubmitIdea(
    ideaId: string,
    input: UpdateProjectIdeaInput,
    userId: string
  ): Promise<ServiceResult<ProjectIdea>> {
    try {
      const existing = await this.getIdeaById(ideaId, userId);
      if (!existing.success || !existing.data) {
        return { success: false, error: 'Project idea not found.' };
      }

      if (existing.data.userId !== userId) {
        return { success: false, error: 'You are not authorized to resubmit this idea.' };
      }

      if (existing.data.status !== 'changes_requested') {
        return { success: false, error: 'Only ideas with changes requested can be resubmitted.' };
      }

      const submittedAt = new Date().toISOString();
      return this.updateIdea(ideaId, { ...input, status: 'submitted', submittedAt }, userId);
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to resubmit project idea.',
      };
    }
  }

  /**
   * Student: Updates an editable idea (Draft or Changes Requested only)
   */
  static async updateIdea(
    ideaId: string,
    input: UpdateProjectIdeaInput,
    userId: string
  ): Promise<ServiceResult<ProjectIdea>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!ideaId?.trim() || !userId?.trim()) {
        return { success: false, error: 'Idea ID and User ID are required.' };
      }

      // 1. Fetch current document to verify ownership and editable status
      const existingDoc = await databases.getDocument<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        ideaId.trim()
      );

      if (existingDoc.userId !== userId.trim()) {
        return { success: false, error: 'You do not have permission to modify this idea.' };
      }

      const editableStatuses: ProjectIdeaStatus[] = ['draft', 'changes_requested'];
      if (!editableStatuses.includes(existingDoc.status)) {
        return {
          success: false,
          error: `Ideas with status "${existingDoc.status.toUpperCase()}" cannot be edited.`,
        };
      }

      // 2. Prepare update payload (prevent manual injection of protected fields)
      const payload: Record<string, any> = {};

      if (input.title !== undefined) {
        if (!input.title.trim()) return { success: false, error: 'Project title cannot be empty.' };
        if (input.title.trim().length > 255) return { success: false, error: 'Title cannot exceed 255 characters.' };
        payload.title = input.title.trim();
      }

      if (input.shortDescription !== undefined) {
        if (!input.shortDescription.trim()) return { success: false, error: 'Short description cannot be empty.' };
        if (input.shortDescription.trim().length > 500) return { success: false, error: 'Short description cannot exceed 500 characters.' };
        payload.shortDescription = input.shortDescription.trim();
      }

      if (input.content !== undefined) {
        if (!input.content.trim()) return { success: false, error: 'Project details cannot be empty.' };
        payload.content = input.content.trim();
      }

      if (input.category !== undefined) {
        payload.category = input.category.trim();
      }

      if (input.technologies !== undefined) {
        payload.technologies = input.technologies.trim();
      }

      if (input.links !== undefined) {
        payload.links = serializeLinks(input.links);
      }

      // Handled status transition (student can switch draft <-> submitted)
      if (input.status) {
        if (input.status === 'submitted' || input.status === 'draft') {
          payload.status = input.status;
        }
      }

      if (input.submittedAt) {
        payload.submittedAt = input.submittedAt;
      }

      const updated = await this.updateDocumentResilient<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        ideaId.trim(),
        payload
      );

      return { success: true, data: this.mapDocumentToIdea(updated) };
    } catch (error: any) {
      console.error('[ProjectIdeaService.updateIdea] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to update project idea.',
        code: error?.code,
      };
    }
  }

  /**
   * Public: Fetches all publicly visible project ideas with search, category filtering & sorting
   */
  static async getPublicIdeas(
    filters: ProjectIdeaFilterOptions = {}
  ): Promise<ServiceResult<ProjectIdea[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const publicStatuses: ProjectIdeaStatus[] = [
        'submitted',
        'under_review',
        'approved',
        'changes_requested',
      ];

      const queries: string[] = [];

      // Filter by specific public status if selected, otherwise all public statuses
      if (filters.status && filters.status !== 'all') {
        if (Array.isArray(filters.status)) {
          const valid = filters.status.filter((s) => publicStatuses.includes(s));
          queries.push(Query.equal('status', valid.length > 0 ? valid : publicStatuses));
        } else if (publicStatuses.includes(filters.status)) {
          queries.push(Query.equal('status', filters.status));
        } else {
          queries.push(Query.equal('status', publicStatuses));
        }
      } else {
        queries.push(Query.equal('status', publicStatuses));
      }

      if (filters.category && filters.category !== 'All') {
        queries.push(Query.equal('category', filters.category.trim()));
      }

      if (filters.order === 'asc') {
        queries.push(Query.orderAsc('$createdAt'));
      } else {
        queries.push(Query.orderDesc('$createdAt'));
      }

      queries.push(Query.limit(filters.limit ?? 100));
      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      let ideas = response.documents.map((doc) => {
        const mapped = this.mapDocumentToIdea(doc);
        // Clean feedback from public view
        mapped.feedback = undefined;
        return mapped;
      });

      // In-memory search for query match across title, shortDescription, and technologies
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.trim().toLowerCase();
        ideas = ideas.filter(
          (idea) =>
            idea.title.toLowerCase().includes(q) ||
            idea.shortDescription.toLowerCase().includes(q) ||
            (idea.technologies && idea.technologies.toLowerCase().includes(q)) ||
            (idea.category && idea.category.toLowerCase().includes(q))
        );
      }

      return { success: true, data: ideas };
    } catch (error: any) {
      console.warn('[ProjectIdeaService.getPublicIdeas] Warning/Error:', error?.message);
      // If collection is not yet created in Appwrite, return empty list gracefully so page doesn't crash
      if (error?.code === 404 || /could not be found|not found/i.test(error?.message || '')) {
        return { success: true, data: [] };
      }
      return {
        success: false,
        error: error?.message || 'Failed to fetch public ideas.',
        code: error?.code,
      };
    }
  }

  /**
   * Retrieves an individual idea by ID with strict privacy & security controls
   */
  static async getIdeaById(
    ideaId: string,
    currentUserId?: string | null,
    isAdmin?: boolean
  ): Promise<ServiceResult<ProjectIdea>> {
    try {
      if (!isAppwriteReady() || !ideaId?.trim()) {
        return { success: false, error: 'Invalid idea ID.' };
      }

      const document = await databases.getDocument<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        ideaId.trim()
      );

      const isOwner = Boolean(currentUserId && document.userId === currentUserId);
      const isPrivileged = Boolean(isOwner || isAdmin);

      // Privacy Check: Drafts and Rejected ideas are strictly visible only to owner and admins
      if ((document.status === 'draft' || document.status === 'rejected') && !isPrivileged) {
        return {
          success: false,
          error: 'Idea not found or you do not have permission to view it.',
          code: 404,
        };
      }

      const mapped = this.mapDocumentToIdea(document);

      // Feedback Privacy: Only owner and admins can view feedback text
      if (!isPrivileged) {
        mapped.feedback = undefined;
      }

      return { success: true, data: mapped };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Project idea not found.',
        code: error?.code || 404,
      };
    }
  }

  /**
   * Student: Retrieves all ideas belonging to a specific student
   */
  static async getIdeasByUserId(userId: string): Promise<ServiceResult<ProjectIdea[]>> {
    try {
      if (!isAppwriteReady() || !userId?.trim()) {
        return { success: false, error: 'User ID is required.' };
      }

      const response = await databases.listDocuments<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('userId', userId.trim()),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ]
      );

      const ideas = response.documents.map((doc) => this.mapDocumentToIdea(doc));
      return { success: true, data: ideas };
    } catch (error: any) {
      console.warn('[ProjectIdeaService.getIdeasByUserId] Warning/Error:', error?.message);
      if (error?.code === 404 || /could not be found|not found/i.test(error?.message || '')) {
        return { success: true, data: [] };
      }
      return {
        success: false,
        error: error?.message || 'Failed to fetch your ideas.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Retrieves all project ideas with computed stats
   */
  static async getAllIdeas(
    filters: ProjectIdeaFilterOptions = {}
  ): Promise<ServiceResult<{ ideas: ProjectIdea[]; stats: ProjectIdeaStats }>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      const queries: string[] = [];

      if (filters.status && filters.status !== 'all') {
        if (Array.isArray(filters.status)) {
          queries.push(Query.equal('status', filters.status));
        } else {
          queries.push(Query.equal('status', filters.status));
        }
      }

      if (filters.category && filters.category !== 'All') {
        queries.push(Query.equal('category', filters.category.trim()));
      }

      queries.push(Query.orderDesc('$createdAt'));
      queries.push(Query.limit(filters.limit ?? 200));

      const response = await databases.listDocuments<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      let ideas = response.documents.map((doc) => this.mapDocumentToIdea(doc));

      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.trim().toLowerCase();
        ideas = ideas.filter(
          (idea) =>
            idea.title.toLowerCase().includes(q) ||
            idea.shortDescription.toLowerCase().includes(q) ||
            (idea.technologies && idea.technologies.toLowerCase().includes(q))
        );
      }

      // Also fetch un-filtered summary counts for stats cards
      const allDocsRes = await databases.listDocuments<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        [Query.limit(500)]
      );

      const stats: ProjectIdeaStats = {
        total: allDocsRes.total,
        draft: 0,
        submitted: 0,
        under_review: 0,
        approved: 0,
        changes_requested: 0,
        rejected: 0,
        pendingReview: 0,
      };

      for (const doc of allDocsRes.documents) {
        if (stats[doc.status] !== undefined) {
          stats[doc.status]++;
        }
      }
      stats.pendingReview = stats.submitted + stats.under_review;

      return { success: true, data: { ideas, stats } };
    } catch (error: any) {
      console.warn('[ProjectIdeaService.getAllIdeas] Warning/Error:', error?.message);
      if (error?.code === 404 || /could not be found|not found/i.test(error?.message || '')) {
        return {
          success: true,
          data: {
            ideas: [],
            stats: {
              total: 0,
              draft: 0,
              submitted: 0,
              under_review: 0,
              approved: 0,
              changes_requested: 0,
              rejected: 0,
              pendingReview: 0,
            },
          },
        };
      }
      return {
        success: false,
        error: error?.message || 'Failed to fetch all ideas.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Reviews an idea (Approve, Request Changes, Reject) with feedback and audit stamp
   */
  static async reviewIdea(
    ideaId: string,
    reviewInput: ReviewProjectIdeaInput,
    adminUserId: string
  ): Promise<ServiceResult<ProjectIdea>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!ideaId?.trim() || !adminUserId?.trim()) {
        return { success: false, error: 'Idea ID and Admin ID are required.' };
      }

      const { status, feedback } = reviewInput;

      if (status === 'changes_requested' && (!feedback || !feedback.trim())) {
        return { success: false, error: 'Feedback is required when requesting changes.' };
      }

      if (status === 'rejected' && (!feedback || !feedback.trim())) {
        return { success: false, error: 'Feedback is required when rejecting an idea.' };
      }

      const payload: Record<string, any> = {
        status,
        reviewedBy: adminUserId.trim(),
      };

      if (feedback !== undefined) {
        payload.feedback = feedback.trim();
      }

      const updated = await this.updateDocumentResilient<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        ideaId.trim(),
        payload
      );

      return { success: true, data: this.mapDocumentToIdea(updated) };
    } catch (error: any) {
      console.error('[ProjectIdeaService.reviewIdea] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to submit review.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin/Student: Deletes an idea (students can only delete their own drafts)
   */
  static async deleteIdea(
    ideaId: string,
    userId?: string,
    isAdmin?: boolean
  ): Promise<ServiceResult<void>> {
    try {
      if (!isAppwriteReady() || !ideaId?.trim()) {
        return { success: false, error: 'Invalid idea ID.' };
      }

      const existingDoc = await databases.getDocument<ProjectIdeaDocument>(
        this.databaseId,
        this.collectionId,
        ideaId.trim()
      );

      if (!isAdmin) {
        if (!userId || existingDoc.userId !== userId) {
          return { success: false, error: 'You can only delete your own ideas.' };
        }
        if (existingDoc.status !== 'draft') {
          return { success: false, error: 'Only draft ideas can be deleted by students.' };
        }
      }

      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        ideaId.trim()
      );

      return { success: true };
    } catch (error: any) {
      console.error('[ProjectIdeaService.deleteIdea] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to delete idea.',
        code: error?.code,
      };
    }
  }
}

export const projectIdeaService = ProjectIdeaService;
export default ProjectIdeaService;
