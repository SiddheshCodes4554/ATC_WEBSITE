import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { StorageService } from './storage.service';
import {
  ATCProject,
  ProjectDocument,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilterOptions,
  ProjectServiceResult,
  serializeTechStack,
  parseTechStack,
  serializeGalleryImages,
  parseGalleryImages,
} from '../types/project.types';

/**
 * ============================================================================
 * ATC Project Management Service (Appwrite Database & Storage)
 * ============================================================================
 * Handles CRUD operations, ordering, tech stack serialization, and cover images
 * for the ATC Projects showcase system.
 */
export class ProjectService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get collectionId(): string {
    return APPWRITE_CONFIG.COLLECTIONS.PROJECTS || 'projects';
  }

  /**
   * Permissions: Public can read, authenticated admins can update/delete
   */
  private static getProjectPermissions(): string[] {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /**
   * Helper: Transforms raw Appwrite ProjectDocument to typed ATCProject
   */
  private static mapDocumentToProject(doc: ProjectDocument): ATCProject {
    const rawDescription = doc.description || '';
    const galleryImageIds = parseGalleryImages(doc.galleryImageIds, rawDescription);
    const cleanDescription = rawDescription.replace(/<!--\s*ATC_GALLERY:\s*\[.*?\]\s*-->/gs, '').trim();

    return {
      $id: doc.$id,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      title: doc.title,
      slug: doc.slug,
      shortDescription: doc.shortDescription || '',
      description: cleanDescription,
      coverImageId: doc.coverImageId || undefined,
      galleryImageIds,
      techStack: parseTechStack(doc.techStack),
      githubUrl: doc.githubUrl || undefined,
      liveUrl: doc.liveUrl || undefined,
      featured: Boolean(doc.featured),
      status: doc.status || 'draft',
      displayOrder: typeof doc.displayOrder === 'number' ? doc.displayOrder : 0,
    };
  }

  /* ======================================================================== */
  /* DATA RETRIEVAL (PUBLIC & ADMIN)                                          */
  /* ======================================================================== */

  /**
   * Admin: Fetch all projects with optional status, search, and pagination filters
   */
  static async getProjects(
    options: ProjectFilterOptions = {}
  ): Promise<ProjectServiceResult<ATCProject[]>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in the environment.' };
      }

      const queries: string[] = [];

      // Sort by displayOrder ascending by default
      if (options.order === 'desc') {
        queries.push(Query.orderDesc('displayOrder'));
      } else {
        queries.push(Query.orderAsc('displayOrder'));
      }

      // Status filter
      if (options.status) {
        if (Array.isArray(options.status)) {
          queries.push(Query.equal('status', options.status));
        } else {
          queries.push(Query.equal('status', options.status));
        }
      }

      // Featured filter
      if (options.featuredOnly) {
        queries.push(Query.equal('featured', true));
      }

      // Pagination
      queries.push(Query.limit(options.limit ?? 100));
      queries.push(Query.offset(options.offset ?? 0));

      const response = await databases.listDocuments<ProjectDocument>(
        this.databaseId,
        this.collectionId,
        queries
      );

      let projects = response.documents.map(this.mapDocumentToProject);

      // In-memory search if specified
      if (options.search?.trim()) {
        const query = options.search.toLowerCase().trim();
        projects = projects.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.slug.toLowerCase().includes(query) ||
            p.shortDescription.toLowerCase().includes(query) ||
            p.techStack.some((t) => t.toLowerCase().includes(query))
        );
      }

      return {
        success: true,
        data: projects,
        total: response.total,
      };
    } catch (error: any) {
      console.error('[ProjectService.getProjects] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to fetch projects from Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Public: Fetch published projects (excludes drafts and archived projects)
   */
  static async getPublishedProjects(
    options: ProjectFilterOptions = {}
  ): Promise<ProjectServiceResult<ATCProject[]>> {
    return this.getProjects({
      ...options,
      status: 'published',
      order: options.order || 'asc',
    });
  }

  /**
   * Public: Fetch featured + published projects for the flagship hero section
   */
  static async getFeaturedProjects(): Promise<ProjectServiceResult<ATCProject[]>> {
    return this.getProjects({
      status: 'published',
      featuredOnly: true,
      order: 'asc',
    });
  }

  /**
   * Public & Admin: Fetch a project document by its unique URL slug
   */
  static async getProjectBySlug(
    slug: string
  ): Promise<ProjectServiceResult<ATCProject>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!slug?.trim()) {
        return { success: false, error: 'Project slug is required.' };
      }

      const response = await databases.listDocuments<ProjectDocument>(
        this.databaseId,
        this.collectionId,
        [Query.equal('slug', slug.trim().toLowerCase()), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: `Project not found for slug "${slug}".` };
      }

      return {
        success: true,
        data: this.mapDocumentToProject(response.documents[0]),
      };
    } catch (error: any) {
      console.error('[ProjectService.getProjectBySlug] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to retrieve project by slug.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Fetch a project document by its Appwrite Document ID
   */
  static async getProjectById(
    id: string
  ): Promise<ProjectServiceResult<ATCProject>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!id?.trim()) {
        return { success: false, error: 'Project ID is required.' };
      }

      const document = await databases.getDocument<ProjectDocument>(
        this.databaseId,
        this.collectionId,
        id.trim()
      );

      return {
        success: true,
        data: this.mapDocumentToProject(document),
      };
    } catch (error: any) {
      console.error('[ProjectService.getProjectById] Error:', error);
      return {
        success: false,
        error: error?.message || 'Project not found.',
        code: error?.code,
      };
    }
  }

  /* ======================================================================== */
  /* VALIDATION & ORDERING HELPERS                                            */
  /* ======================================================================== */

  /**
   * Check whether a slug is available
   */
  static async isSlugAvailable(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      if (!isAppwriteReady() || !slug?.trim()) return true;

      const normalized = slug.trim().toLowerCase();
      const response = await databases.listDocuments<ProjectDocument>(
        this.databaseId,
        this.collectionId,
        [Query.equal('slug', normalized), Query.limit(5)]
      );

      const conflicting = response.documents.find(
        (doc) => !excludeId || doc.$id !== excludeId
      );

      return !conflicting;
    } catch {
      return true;
    }
  }

  /**
   * Helper: Calculate next available displayOrder for new projects
   */
  static async getNextDisplayOrder(): Promise<number> {
    try {
      if (!isAppwriteReady()) return 1;

      const response = await databases.listDocuments<ProjectDocument>(
        this.databaseId,
        this.collectionId,
        [Query.orderDesc('displayOrder'), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        return (response.documents[0].displayOrder ?? 0) + 1;
      }
      return 1;
    } catch {
      return 1;
    }
  }

  /* ======================================================================== */
  /* MUTATION OPERATIONS (ADMIN ONLY)                                         */
  /* ======================================================================== */

  /**
   * Admin: Create a new project document
   */
  static async createProject(
    input: CreateProjectInput
  ): Promise<ProjectServiceResult<ATCProject>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!input.title?.trim()) {
        return { success: false, error: 'Project title is required.' };
      }

      // Generate or normalize slug
      const generatedSlug = (
        input.slug?.trim() ||
        input.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      ).toLowerCase();

      // Check slug uniqueness
      const isAvailable = await this.isSlugAvailable(generatedSlug);
      if (!isAvailable) {
        return {
          success: false,
          error: `Slug "${generatedSlug}" is already in use by another project. Please choose a unique slug.`,
        };
      }

      // Determine display order
      const displayOrder =
        typeof input.displayOrder === 'number'
          ? input.displayOrder
          : await this.getNextDisplayOrder();

      // Encode gallery images in description comment as safe universal fallback
      const rawDesc = input.description?.trim() || '';
      const gallerySerialized = serializeGalleryImages(input.galleryImageIds);
      const descriptionWithGallery = gallerySerialized !== '[]'
        ? `${rawDesc}\n\n<!-- ATC_GALLERY: ${gallerySerialized} -->`
        : rawDesc;

      const documentData: Record<string, any> = {
        title: input.title.trim(),
        slug: generatedSlug,
        shortDescription: input.shortDescription?.trim() || '',
        description: descriptionWithGallery,
        coverImageId: input.coverImageId?.trim() || undefined,
        techStack: serializeTechStack(input.techStack),
        githubUrl: input.githubUrl?.trim() || undefined,
        liveUrl: input.liveUrl?.trim() || undefined,
        featured: Boolean(input.featured),
        status: input.status || 'draft',
        displayOrder,
      };

      // Try adding galleryImageIds attribute directly if supported by Appwrite collection
      if (input.galleryImageIds) {
        documentData.galleryImageIds = gallerySerialized;
      }

      let document: ProjectDocument;
      try {
        document = await databases.createDocument<ProjectDocument>(
          this.databaseId,
          this.collectionId,
          ID.unique(),
          documentData as any,
          this.getProjectPermissions()
        );
      } catch (attrError: any) {
        // If galleryImageIds attribute does not exist in Appwrite schema, remove and retry
        if (documentData.galleryImageIds && attrError?.message?.includes('galleryImageIds')) {
          delete documentData.galleryImageIds;
          document = await databases.createDocument<ProjectDocument>(
            this.databaseId,
            this.collectionId,
            ID.unique(),
            documentData as any,
            this.getProjectPermissions()
          );
        } else {
          throw attrError;
        }
      }

      return {
        success: true,
        data: this.mapDocumentToProject(document),
      };
    } catch (error: any) {
      console.error('[ProjectService.createProject] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to create project in Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Update an existing project document
   */
  static async updateProject(
    id: string,
    input: UpdateProjectInput
  ): Promise<ProjectServiceResult<ATCProject>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!id?.trim()) {
        return { success: false, error: 'Project ID is required for update.' };
      }

      // Check slug uniqueness if slug is being updated
      if (input.slug?.trim()) {
        const normalizedSlug = input.slug.trim().toLowerCase();
        const isAvailable = await this.isSlugAvailable(normalizedSlug, id.trim());
        if (!isAvailable) {
          return {
            success: false,
            error: `Slug "${normalizedSlug}" is already taken.`,
          };
        }
      }

      const updateData: Record<string, any> = {};

      if (input.title !== undefined) updateData.title = input.title.trim();
      if (input.slug !== undefined) updateData.slug = input.slug.trim().toLowerCase();
      if (input.shortDescription !== undefined) updateData.shortDescription = input.shortDescription.trim();
      
      // Update description with gallery metadata if provided
      if (input.description !== undefined || input.galleryImageIds !== undefined) {
        const baseDesc = input.description !== undefined ? input.description.trim() : '';
        const cleanBase = baseDesc.replace(/<!--\s*ATC_GALLERY:\s*\[.*?\]\s*-->/gs, '').trim();
        const gallerySerialized = input.galleryImageIds !== undefined
          ? serializeGalleryImages(input.galleryImageIds)
          : '[]';

        updateData.description = gallerySerialized !== '[]'
          ? `${cleanBase}\n\n<!-- ATC_GALLERY: ${gallerySerialized} -->`
          : cleanBase;

        if (input.galleryImageIds !== undefined) {
          updateData.galleryImageIds = gallerySerialized;
        }
      }

      if (input.coverImageId !== undefined) updateData.coverImageId = input.coverImageId?.trim() || null;
      if (input.techStack !== undefined) updateData.techStack = serializeTechStack(input.techStack);
      if (input.githubUrl !== undefined) updateData.githubUrl = input.githubUrl?.trim() || null;
      if (input.liveUrl !== undefined) updateData.liveUrl = input.liveUrl?.trim() || null;
      if (input.featured !== undefined) updateData.featured = Boolean(input.featured);
      if (input.status !== undefined) updateData.status = input.status;
      if (input.displayOrder !== undefined) updateData.displayOrder = input.displayOrder;

      let document: ProjectDocument;
      try {
        document = await databases.updateDocument<ProjectDocument>(
          this.databaseId,
          this.collectionId,
          id.trim(),
          updateData
        );
      } catch (attrError: any) {
        // If galleryImageIds attribute does not exist in schema, remove and retry
        if (updateData.galleryImageIds && attrError?.message?.includes('galleryImageIds')) {
          delete updateData.galleryImageIds;
          document = await databases.updateDocument<ProjectDocument>(
            this.databaseId,
            this.collectionId,
            id.trim(),
            updateData
          );
        } else {
          throw attrError;
        }
      }

      return {
        success: true,
        data: this.mapDocumentToProject(document),
      };
    } catch (error: any) {
      console.error('[ProjectService.updateProject] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to update project in Appwrite.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Delete a project document and clean up associated cover & gallery images
   */
  static async deleteProject(
    id: string,
    coverImageId?: string,
    galleryImageIds?: string[]
  ): Promise<ProjectServiceResult<void>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!id?.trim()) {
        return { success: false, error: 'Project ID is required for deletion.' };
      }

      // 1. Delete document from Appwrite Database
      await databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        id.trim()
      );

      // 2. Clean up cover image if present
      if (coverImageId?.trim()) {
        try {
          await StorageService.deleteProjectImage(coverImageId.trim());
        } catch (imgErr) {
          console.warn('[ProjectService.deleteProject] Storage cleanup notice:', imgErr);
        }
      }

      // 3. Clean up gallery images if present
      if (galleryImageIds && Array.isArray(galleryImageIds)) {
        for (const gId of galleryImageIds) {
          if (gId?.trim()) {
            try {
              await StorageService.deleteProjectImage(gId.trim());
            } catch (gErr) {
              console.warn('[ProjectService.deleteProject] Gallery storage cleanup notice:', gErr);
            }
          }
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('[ProjectService.deleteProject] Error:', error);
      return {
        success: false,
        error: error?.message || 'Failed to delete project.',
        code: error?.code,
      };
    }
  }

  /**
   * Admin: Update display order of a single project
   */
  static async updateProjectOrder(
    id: string,
    newOrder: number
  ): Promise<ProjectServiceResult<ATCProject>> {
    return this.updateProject(id, { displayOrder: Math.max(0, newOrder) });
  }

  /**
   * Admin: Move a project up or down in display order by swapping with neighboring project
   */
  static async moveProjectOrder(
    projectId: string,
    direction: 'up' | 'down'
  ): Promise<ProjectServiceResult<ATCProject[]>> {
    try {
      const allProjectsResult = await this.getProjects({ order: 'asc' });
      if (!allProjectsResult.success || !allProjectsResult.data) {
        return { success: false, error: 'Failed to fetch project list for reordering.' };
      }

      const projects = [...allProjectsResult.data];
      const currentIndex = projects.findIndex((p) => p.$id === projectId);

      if (currentIndex === -1) {
        return { success: false, error: 'Target project not found in list.' };
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= projects.length) {
        // Already at edge
        return { success: true, data: projects };
      }

      const currentProject = projects[currentIndex];
      const targetProject = projects[targetIndex];

      const currentOrder = currentProject.displayOrder;
      const targetOrder = targetProject.displayOrder;

      // Handle equal orders by generating clean sequence
      const newCurrentOrder = currentOrder === targetOrder
        ? (direction === 'up' ? targetOrder - 1 : targetOrder + 1)
        : targetOrder;
      const newTargetOrder = currentOrder;

      await Promise.all([
        this.updateProject(currentProject.$id, { displayOrder: newCurrentOrder }),
        this.updateProject(targetProject.$id, { displayOrder: newTargetOrder }),
      ]);

      const refreshed = await this.getProjects({ order: 'asc' });
      return { success: true, data: refreshed.data || [] };
    } catch (err: any) {
      console.error('[ProjectService.moveProjectOrder] Error:', err);
      return { success: false, error: err?.message || 'Failed to reorder projects.' };
    }
  }

  /**
   * Admin: Quick toggle featured status
   */
  static async toggleFeatured(
    id: string,
    currentFeatured: boolean
  ): Promise<ProjectServiceResult<ATCProject>> {
    return this.updateProject(id, { featured: !currentFeatured });
  }

  /**
   * Admin: Quick publish a project
   */
  static async publishProject(id: string): Promise<ProjectServiceResult<ATCProject>> {
    return this.updateProject(id, { status: 'published' });
  }

  /**
   * Admin: Quick archive a project
   */
  static async archiveProject(id: string): Promise<ProjectServiceResult<ATCProject>> {
    return this.updateProject(id, { status: 'archived' });
  }
}

export default ProjectService;
