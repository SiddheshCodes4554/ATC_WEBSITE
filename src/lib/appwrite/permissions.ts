import { Permission, Role } from 'appwrite';
import { APPWRITE_CONFIG } from './config';
import { AdminRole } from '../../types/appwrite.types';

/**
 * ============================================================================
 * Appwrite Permission & Role Utilities
 * ============================================================================
 */

/**
 * Creates permission array where any visitor can read, but only authenticated admins can write/update/delete.
 * Used for: public events, published projects, team directory, gallery, public website content.
 */
export const createPublicReadAdminWritePermissions = (): string[] => {
  return [
    Permission.read(Role.any()),
    Permission.create(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.update(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.delete(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.create(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
    Permission.update(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
    Permission.delete(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
  ];
};

/**
 * Creates permission array where ONLY authenticated admins have any access.
 * Used for: admin_profiles, private logs, sensitive metrics, internal notes.
 */
export const createAdminOnlyPermissions = (): string[] => {
  return [
    Permission.read(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.create(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.update(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.delete(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.read(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
    Permission.create(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
    Permission.update(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
    Permission.delete(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
  ];
};

/**
 * Creates permission array where a student can create/read their own registration,
 * and admins have full management access.
 */
export const createRegistrationPermissions = (userId?: string): string[] => {
  const permissions = [
    Permission.create(Role.any()),
    Permission.read(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.update(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.delete(Role.label(APPWRITE_CONFIG.ROLES.ADMIN)),
    Permission.read(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
    Permission.update(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
    Permission.delete(Role.label(APPWRITE_CONFIG.ROLES.SUPER_ADMIN)),
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
