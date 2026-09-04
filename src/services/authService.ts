import { Models } from 'appwrite';
import { account } from './appwrite';

/**
 * ============================================================================
 * ATC Admin Authentication Service
 * ============================================================================
 * Uses the Appwrite SDK v26 APIs to provide simple, secure ADMIN-ONLY authentication.
 * No public signups, no student accounts, no participant login.
 */

export interface AuthResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export class AuthService {
  /**
   * Authenticate an admin using email and password
   */
  static async login(
    email: string,
    password: string
  ): Promise<AuthResult<Models.Session>> {
    try {
      // Clear any stale local session before creating a new one to prevent collision
      try {
        await account.deleteSession('current');
      } catch {
        // No existing active session, safe to continue
      }

      // Create new Email & Password session using Appwrite SDK v26 API
      const session = await account.createEmailPasswordSession(email.trim(), password);
      return { success: true, data: session };
    } catch (error: any) {
      let friendlyMessage = 'Authentication failed. Please check your credentials.';
      
      if (error?.code === 401 || error?.type === 'user_invalid_credentials') {
        friendlyMessage = 'Invalid email or password. Please check your login details.';
      } else if (error?.code === 429) {
        friendlyMessage = 'Too many login attempts. Please wait a few minutes and try again.';
      } else if (error?.message) {
        friendlyMessage = error.message;
      }

      return {
        success: false,
        error: friendlyMessage,
        code: error?.code,
      };
    }
  }

  /**
   * Retrieve the currently authenticated Appwrite user account
   */
  static async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      const user = await account.get();
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Evaluates if a given Appwrite user account has the "admin" label.
   * Returns true ONLY if the user exists and their labels array contains "admin".
   */
  static isAdminUser(user: Models.User<Models.Preferences> | null): boolean {
    if (!user || !Array.isArray(user.labels)) {
      return false;
    }
    return user.labels.includes('admin');
  }

  /**
   * Check whether a valid Appwrite session currently exists
   */
  static async hasActiveSession(): Promise<boolean> {
    try {
      const user = await account.get();
      return Boolean(user && user.$id);
    } catch {
      return false;
    }
  }

  /**
   * Log out the current active session
   */
  static async logout(): Promise<AuthResult<void>> {
    try {
      await account.deleteSession('current');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Failed to terminate session.',
        code: error?.code,
      };
    }
  }

  /**
   * Get active session details
   */
  static async getActiveSession(): Promise<Models.Session | null> {
    try {
      const session = await account.getSession('current');
      return session;
    } catch {
      return null;
    }
  }
}

export default AuthService;
