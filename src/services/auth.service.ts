import { ID, Models, Query } from 'appwrite';
import { account, databases, APPWRITE_CONFIG, isAppwriteReady } from './appwrite';
import { AdminProfileDocument, AdminRole, ServiceResponse } from '../types/appwrite.types';
import { createAdminOnlyPermissions, hasAdminPrivilege } from '../lib/appwrite/permissions';

/**
 * ============================================================================
 * ATC Admin Authentication Service
 * ============================================================================
 */
export class AuthService {
  /**
   * Logs in an admin with email and password
   */
  static async loginWithEmail(
    email: string,
    password: string
  ): Promise<ServiceResponse<Models.Session>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite is not configured in environment.' };
      }

      // Check if session already exists and remove it to avoid session conflicts
      try {
        await account.deleteSession('current');
      } catch {
        // No active session, safe to proceed
      }

      const session = await account.createEmailPasswordSession(email, password);
      return { success: true, data: session };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Authentication failed. Please check credentials.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Retrieves the currently authenticated Appwrite user account
   */
  static async getCurrentUser(): Promise<ServiceResponse<Models.User<Models.Preferences>>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }
      const user = await account.get();
      return { success: true, data: user };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'No authenticated user session found.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Retrieves the active admin profile document for a given user ID
   */
  static async getAdminProfile(
    userId: string
  ): Promise<ServiceResponse<AdminProfileDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const response = await databases.listDocuments<AdminProfileDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.ADMIN_PROFILES,
        [Query.equal('user_id', userId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return { success: false, error: 'Admin profile not found for this user.' };
      }

      const profile = response.documents[0];
      if (!profile.is_active) {
        return { success: false, error: 'This admin account has been deactivated.' };
      }

      return { success: true, data: profile };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to fetch admin profile document.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Verifies if the current session user has verified admin status
   */
  static async checkIsAdmin(): Promise<boolean> {
    try {
      const userRes = await this.getCurrentUser();
      if (!userRes.success || !userRes.data) return false;

      const profileRes = await this.getAdminProfile(userRes.data.$id);
      if (!profileRes.success || !profileRes.data) return false;

      return hasAdminPrivilege(profileRes.data.role);
    } catch {
      return false;
    }
  }

  /**
   * Logs out the current admin session
   */
  static async logout(): Promise<ServiceResponse<void>> {
    try {
      if (!isAppwriteReady()) {
        return { success: true };
      }
      await account.deleteSession('current');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to log out session.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Sends password recovery email
   */
  static async sendPasswordRecovery(
    email: string,
    redirectUrl: string
  ): Promise<ServiceResponse<Models.Token>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }
      const token = await account.createRecovery(email, redirectUrl);
      return { success: true, data: token };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to dispatch password recovery email.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Completes password reset recovery
   */
  static async completePasswordRecovery(
    userId: string,
    secret: string,
    password: string
  ): Promise<ServiceResponse<Models.Token>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }
      const result = await account.updateRecovery(userId, secret, password);
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to update account password.',
        statusCode: error?.code,
      };
    }
  }

  /**
   * Helper to create an initial admin profile record in database (Admin-only)
   */
  static async createAdminProfile(data: {
    user_id: string;
    email: string;
    name: string;
    role: AdminRole;
    wing?: AdminProfileDocument['wing'];
  }): Promise<ServiceResponse<AdminProfileDocument>> {
    try {
      if (!isAppwriteReady()) {
        return { success: false, error: 'Appwrite not configured.' };
      }

      const document = await databases.createDocument<AdminProfileDocument>(
        APPWRITE_CONFIG.DATABASE_ID,
        APPWRITE_CONFIG.COLLECTIONS.ADMIN_PROFILES,
        ID.unique(),
        {
          user_id: data.user_id,
          email: data.email,
          name: data.name,
          role: data.role,
          wing: data.wing || 'general',
          is_active: true,
          last_login: new Date().toISOString(),
        },
        createAdminOnlyPermissions()
      );

      return { success: true, data: document };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to create admin profile.',
        statusCode: error?.code,
      };
    }
  }
}
