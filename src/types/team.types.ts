import { Models } from 'appwrite';

export type TeamMemberRole = 'President' | 'Vice President' | 'Core Member' | string;
export type TeamMemberStatus = 'active' | 'inactive' | 'alumni';

/**
 * Team Member Document Schema in Appwrite
 * Strictly matches: name, role, imageId, linkedinUrl, githubUrl, displayOrder, status
 */
export interface TeamMember {
  $id?: string;
  name: string;
  role: TeamMemberRole;
  imageId?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  displayOrder: number;
  status: TeamMemberStatus;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface TeamMemberDocument extends Models.Document {
  name: string;
  role: string;
  imageId?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  displayOrder: number;
  status: TeamMemberStatus;
}

export interface CreateTeamMemberInput {
  name: string;
  role: TeamMemberRole;
  imageId?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  displayOrder?: number;
  status?: TeamMemberStatus;
}

export interface UpdateTeamMemberInput {
  name?: string;
  role?: TeamMemberRole;
  imageId?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  displayOrder?: number;
  status?: TeamMemberStatus;
}

export interface LeadershipAvailabilityResult {
  available: boolean;
  currentLeader?: TeamMember;
  error?: string;
}
