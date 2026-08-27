import { ID, Query, Permission, Role } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { StorageService } from './storage.service';
import {
  TeamMember,
  TeamMemberDocument,
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
  TeamMemberStatus,
  LeadershipAvailabilityResult,
} from '../types/team.types';

/**
 * ============================================================================
 * ATC Team Management Service (Appwrite Database & Storage)
 * ============================================================================
 * Manages Club Leadership (President, Vice President) and Core Team Members.
 * Enforces single active President/VP rule, displayOrder sorting, and image cleanups.
 */
export class TeamService {
  private static get databaseId(): string {
    return APPWRITE_CONFIG.DATABASE_ID;
  }

  private static get teamCollection(): string {
    return APPWRITE_CONFIG.COLLECTIONS.TEAM_MEMBERS || 'team_members';
  }

  /**
   * Permissions: Public can read, authenticated admins can update/delete
   */
  private static getTeamMemberPermissions(): string[] {
    return [
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
  }

  /* ======================================================================== */
  /* LEADERSHIP AVAILABILITY & VALIDATION                                     */
  /* ======================================================================== */

  /**
   * Checks if an active President or Vice President already exists in Appwrite
   */
  static async checkLeadershipAvailability(
    role: string,
    excludeMemberId?: string
  ): Promise<LeadershipAvailabilityResult> {
    if (role !== 'President' && role !== 'Vice President') {
      return { available: true };
    }

    try {
      if (!isAppwriteReady()) return { available: true };

      const response = await databases.listDocuments<TeamMemberDocument>(
        this.databaseId,
        this.teamCollection,
        [
          Query.equal('role', role),
          Query.equal('status', 'active'),
          Query.limit(5),
        ]
      );

      const conflicting = response.documents.find(
        (doc) => !excludeMemberId || doc.$id !== excludeMemberId
      );

      if (conflicting) {
        return {
          available: false,
          currentLeader: {
            $id: conflicting.$id,
            name: conflicting.name,
            role: conflicting.role,
            imageId: conflicting.imageId,
            linkedinUrl: conflicting.linkedinUrl,
            githubUrl: conflicting.githubUrl,
            displayOrder: conflicting.displayOrder,
            status: conflicting.status,
          },
          error: `An active ${role} ("${conflicting.name}") already exists. Please reassign or deactivate the current ${role} before appointing a new one.`,
        };
      }

      return { available: true };
    } catch (err: any) {
      console.warn('[TeamService] Leadership check notice:', err);
      return { available: true };
    }
  }

  /* ======================================================================== */
  /* DATA RETRIEVAL (PUBLIC & ADMIN)                                          */
  /* ======================================================================== */

  /**
   * Public: Fetches all active team members sorted by displayOrder
   */
  static async getActiveMembers(): Promise<{ success: boolean; data?: TeamMember[]; error?: string }> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite database is not configured.' };
      }

      const response = await databases.listDocuments<TeamMemberDocument>(
        this.databaseId,
        this.teamCollection,
        [
          Query.equal('status', 'active'),
          Query.orderAsc('displayOrder'),
          Query.limit(100),
        ]
      );

      const members: TeamMember[] = response.documents.map((doc) => ({
        $id: doc.$id,
        name: doc.name,
        role: doc.role,
        imageId: doc.imageId || null,
        linkedinUrl: doc.linkedinUrl || null,
        githubUrl: doc.githubUrl || null,
        displayOrder: doc.displayOrder || 0,
        status: doc.status || 'active',
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
      }));

      return { success: true, data: members };
    } catch (error: any) {
      console.error('[TeamService] Error fetching active team members:', error);
      return {
        success: false,
        error: error?.message || 'Failed to load active team members.',
      };
    }
  }

  /**
   * Admin: Fetches all team members (active, inactive, alumni)
   */
  static async getAllMembers(): Promise<{ success: boolean; data?: TeamMember[]; error?: string }> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite database is not configured.' };
      }

      const response = await databases.listDocuments<TeamMemberDocument>(
        this.databaseId,
        this.teamCollection,
        [Query.orderAsc('displayOrder'), Query.limit(200)]
      );

      const members: TeamMember[] = response.documents.map((doc) => ({
        $id: doc.$id,
        name: doc.name,
        role: doc.role,
        imageId: doc.imageId || null,
        linkedinUrl: doc.linkedinUrl || null,
        githubUrl: doc.githubUrl || null,
        displayOrder: doc.displayOrder || 0,
        status: doc.status || 'active',
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
      }));

      return { success: true, data: members };
    } catch (error: any) {
      console.error('[TeamService] Error fetching all team members:', error);
      return {
        success: false,
        error: error?.message || 'Failed to load team members.',
      };
    }
  }

  /**
   * Admin: Fetches a single member by ID
   */
  static async getMemberById(
    memberId: string
  ): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
    try {
      if (!isAppwriteReady() || !memberId?.trim()) {
        return { success: false, error: 'Member ID is missing.' };
      }

      const doc = await databases.getDocument<TeamMemberDocument>(
        this.databaseId,
        this.teamCollection,
        memberId.trim()
      );

      return {
        success: true,
        data: {
          $id: doc.$id,
          name: doc.name,
          role: doc.role,
          imageId: doc.imageId || null,
          linkedinUrl: doc.linkedinUrl || null,
          githubUrl: doc.githubUrl || null,
          displayOrder: doc.displayOrder || 0,
          status: doc.status || 'active',
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Team member not found.',
      };
    }
  }

  /* ======================================================================== */
  /* ADMIN MUTATIONS (CREATE, UPDATE, DELETE, REORDER)                         */
  /* ======================================================================== */

  /**
   * Admin: Adds a new team member with leadership validation and cleanup
   */
  static async createMember(
    input: CreateTeamMemberInput
  ): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured.' };
      }

      if (!input.name?.trim()) {
        return { success: false, error: 'Member name is required.' };
      }

      if (!input.role?.trim()) {
        return { success: false, error: 'Member role is required.' };
      }

      const status: TeamMemberStatus = input.status || 'active';

      // 1. Leadership Check
      if (status === 'active' && (input.role === 'President' || input.role === 'Vice President')) {
        const check = await this.checkLeadershipAvailability(input.role);
        if (!check.available) {
          return { success: false, error: check.error };
        }
      }

      // 2. Compute display order if not provided
      let displayOrder = input.displayOrder ?? 0;
      if (input.displayOrder === undefined || input.displayOrder === null) {
        try {
          const allRes = await this.getAllMembers();
          if (allRes.success && allRes.data && allRes.data.length > 0) {
            const maxOrder = Math.max(...allRes.data.map((m) => m.displayOrder || 0));
            displayOrder = maxOrder + 1;
          } else {
            displayOrder = 1;
          }
        } catch {
          displayOrder = 1;
        }
      }

      const memberId = ID.unique();

      const doc = await databases.createDocument<TeamMemberDocument>(
        this.databaseId,
        this.teamCollection,
        memberId,
        {
          name: input.name.trim(),
          role: input.role.trim(),
          imageId: input.imageId?.trim() || null,
          linkedinUrl: input.linkedinUrl?.trim() || null,
          githubUrl: input.githubUrl?.trim() || null,
          displayOrder,
          status,
        },
        this.getTeamMemberPermissions()
      );

      return {
        success: true,
        data: {
          $id: doc.$id,
          name: doc.name,
          role: doc.role,
          imageId: doc.imageId,
          linkedinUrl: doc.linkedinUrl,
          githubUrl: doc.githubUrl,
          displayOrder: doc.displayOrder,
          status: doc.status,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
        },
      };
    } catch (error: any) {
      console.error('[TeamService] Error creating team member:', error);

      // Clean up uploaded image if member document failed to create
      if (input.imageId) {
        try {
          await StorageService.deleteTeamImage(input.imageId);
        } catch {}
      }

      return {
        success: false,
        error: error?.message || 'Failed to create team member.',
      };
    }
  }

  /**
   * Admin: Updates an existing team member
   */
  static async updateMember(
    memberId: string,
    input: UpdateTeamMemberInput,
    previousImageId?: string | null
  ): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
    try {
      if (!isAppwriteReady() || !memberId?.trim()) {
        return { success: false, error: 'Member ID is missing.' };
      }

      // 1. Leadership Check
      if (
        input.role &&
        input.status !== 'inactive' &&
        input.status !== 'alumni' &&
        (input.role === 'President' || input.role === 'Vice President')
      ) {
        const check = await this.checkLeadershipAvailability(input.role, memberId);
        if (!check.available) {
          return { success: false, error: check.error };
        }
      }

      const updatePayload: Record<string, any> = {};
      if (input.name !== undefined) updatePayload.name = input.name.trim();
      if (input.role !== undefined) updatePayload.role = input.role.trim();
      if (input.imageId !== undefined) updatePayload.imageId = input.imageId?.trim() || null;
      if (input.linkedinUrl !== undefined) updatePayload.linkedinUrl = input.linkedinUrl?.trim() || null;
      if (input.githubUrl !== undefined) updatePayload.githubUrl = input.githubUrl?.trim() || null;
      if (input.displayOrder !== undefined) updatePayload.displayOrder = input.displayOrder;
      if (input.status !== undefined) updatePayload.status = input.status;

      const doc = await databases.updateDocument<TeamMemberDocument>(
        this.databaseId,
        this.teamCollection,
        memberId.trim(),
        updatePayload
      );

      // 2. Clean up replaced old image if new image was provided
      if (input.imageId && previousImageId && input.imageId !== previousImageId) {
        try {
          await StorageService.deleteTeamImage(previousImageId);
        } catch (cleanupErr) {
          console.warn('[TeamService] Replaced image cleanup notice:', cleanupErr);
        }
      }

      return {
        success: true,
        data: {
          $id: doc.$id,
          name: doc.name,
          role: doc.role,
          imageId: doc.imageId,
          linkedinUrl: doc.linkedinUrl,
          githubUrl: doc.githubUrl,
          displayOrder: doc.displayOrder,
          status: doc.status,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
        },
      };
    } catch (error: any) {
      console.error('[TeamService] Error updating team member:', error);
      return {
        success: false,
        error: error?.message || 'Failed to update team member.',
      };
    }
  }

  /**
   * Admin: Deletes a team member and deletes their avatar image from Storage
   */
  static async deleteMember(
    memberId: string,
    imageId?: string | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isAppwriteReady() || !memberId?.trim()) {
        return { success: false, error: 'Member ID is missing.' };
      }

      await databases.deleteDocument(this.databaseId, this.teamCollection, memberId.trim());

      // Storage cleanup
      if (imageId?.trim()) {
        try {
          await StorageService.deleteTeamImage(imageId.trim());
        } catch (storageErr) {
          console.warn('[TeamService] Notice: Could not remove avatar from storage:', storageErr);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('[TeamService] Error deleting team member:', error);
      return {
        success: false,
        error: error?.message || 'Failed to delete team member.',
      };
    }
  }

  /**
   * Admin: Quick status toggle (active, inactive, alumni)
   */
  static async updateMemberStatus(
    memberId: string,
    newStatus: TeamMemberStatus,
    role?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isAppwriteReady() || !memberId?.trim()) {
        return { success: false, error: 'Member ID is missing.' };
      }

      // If activating a President or VP, ensure single leader rule
      if (newStatus === 'active' && role && (role === 'President' || role === 'Vice President')) {
        const check = await this.checkLeadershipAvailability(role, memberId);
        if (!check.available) {
          return { success: false, error: check.error };
        }
      }

      await databases.updateDocument(
        this.databaseId,
        this.teamCollection,
        memberId.trim(),
        { status: newStatus }
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update member status.',
      };
    }
  }

  /**
   * Admin: Updates displayOrder for a list of core members
   */
  static async updateDisplayOrders(
    memberOrders: Array<{ id: string; displayOrder: number }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isAppwriteReady() || memberOrders.length === 0) {
        return { success: true };
      }

      await Promise.all(
        memberOrders.map((item) =>
          databases.updateDocument(
            this.databaseId,
            this.teamCollection,
            item.id,
            { displayOrder: item.displayOrder }
          )
        )
      );

      return { success: true };
    } catch (error: any) {
      console.error('[TeamService] Error updating member display orders:', error);
      return {
        success: false,
        error: error?.message || 'Failed to save new member order.',
      };
    }
  }
}

export default TeamService;
