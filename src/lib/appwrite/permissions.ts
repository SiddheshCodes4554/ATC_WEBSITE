import { Permission, Role } from 'appwrite';
import { APPWRITE_CONFIG } from '../../services/appwrite';
import { AdminRole } from '../../types/appwrite.types';

/**
 * ============================================================================
 * Appwrite Permission & Role Utilities
 * ============================================================================
 */

/**
 * Creates permission array where any visitor can read, but only authenticated admins can update/delete.
 * Used for: public events, published projects, team directory, gallery, public website content.
 * Note: 'create' is a collection-level permission, not a document-level permission.
 */
export const createPublicReadAdminWritePermissions = (): string[] => {
  return [
    Permission.read(Role.any()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ];
};

/**
 * Creates permission array where ONLY authenticated users have read/update/delete access.
 * Used for: admin_profiles, private logs, sensitive metrics, internal notes.
 */
export const createAdminOnlyPermissions = (): string[] => {
  return [
    Permission.read(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ];
};

/**
 * Creates permission array for registrations.
 */
export const createRegistrationPermissions = (userId?: string): string[] => {
  const permissions = [
    Permission.read(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ];

  if (userId) {
    permissions.push(Permission.read(Role.user(userId)));
    permissions.push(Permission.update(Role.user(userId)));
  }

  return permissions;
};

/**
 * Role hierarchy checker
 */
export const hasAdminPrivilege = (role?: AdminRole | string | null): boolean => {
  if (!role) return false;
  return role === APPWRITE_CONFIG.ROLES.ADMIN || role === APPWRITE_CONFIG.ROLES.SUPER_ADMIN;
};

export const isSuperAdminRole = (role?: AdminRole | string | null): boolean => {
  if (!role) return false;
  return role === APPWRITE_CONFIG.ROLES.SUPER_ADMIN;
};
