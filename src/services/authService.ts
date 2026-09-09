import { Models, ID } from 'appwrite';
import { account } from './appwrite';
import { StudentProfile, StudentSignupInput } from '../types/studentProfile.types';
import { StudentProfileService } from './studentProfileService';

/**
 * ============================================================================
 * ATC Authentication Service
 * ============================================================================
 * Handles student registration (with NIAT ID & Academic details), student login,
 * admin authentication, session persistence, and role verification.
 */

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export interface SignupSuccessData {
  user: Models.User<Models.Preferences>;
  session: Models.Session | null;
  profile?: StudentProfile | null;
}

export class AuthService {
  /**
   * Register a new student account, store NIAT ID + academic details in user profile,
   * update Appwrite user preferences, and auto-login session immediately.
   */
  static async signup(
    input: StudentSignupInput
  ): Promise<AuthResult<SignupSuccessData>> {
    try {
      const trimmedName = input.name.trim();
      const normalizedEmail = input.email.trim().toLowerCase();
      const trimmedNiatId = input.niatId.trim();
      const trimmedPhone = input.phone.trim();

      // 1. Validate required fields
      if (!trimmedName || trimmedName.length < 2) {
        return {
          success: false,
          error: 'Please enter your full name (at least 2 characters).',
        };
      }

      if (!trimmedNiatId) {
        return {
          success: false,
          error: 'NIAT ID is required.',
        };
      }

      if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return {
          success: false,
          error: 'Please enter a valid email address.',
        };
      }

      if (!trimmedPhone || trimmedPhone.length < 7) {
        return {
          success: false,
          error: 'Please enter a valid contact phone number.',
        };
      }

      if (!input.year || (input.year !== '1st Year' && input.year !== '2nd Year')) {
        return {
          success: false,
          error: 'Please select a valid academic year (1st Year or 2nd Year).',
        };
      }

      if (
        !input.section ||
        !['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07'].includes(input.section)
      ) {
        return {
          success: false,
          error: 'Please select a valid section (S01 to S07).',
        };
      }

      if (!input.password || input.password.length < 8) {
        return {
          success: false,
          error: 'Password must be at least 8 characters long.',
        };
      }

      // 2. Pre-check: Duplicate NIAT ID validation
      const niatCheck = await StudentProfileService.getProfileByNiatId(trimmedNiatId);
      if (niatCheck.success && niatCheck.data) {
        return {
          success: false,
          error: 'This NIAT ID is already registered.',
        };
      }

      // 3. Create Appwrite Auth user account
      let user: Models.User<Models.Preferences>;
      try {
        user = await account.create(
          ID.unique(),
          normalizedEmail,
          input.password,
          trimmedName
        );
      } catch (authError: unknown) {
        const err = authError as { code?: number; type?: string; message?: string };
        let friendlyMessage = 'Unable to create your account. Please try again.';

        if (err?.code === 409 || err?.type === 'user_already_exists') {
          friendlyMessage = 'An account with this email already exists. Please sign in.';
        } else if (
          err?.code === 400 ||
          err?.type === 'password_recently_used' ||
          err?.type === 'password_invalid'
        ) {
          friendlyMessage = err.message || 'Password must be at least 8 characters long.';
        } else if (err?.message) {
          friendlyMessage = err.message;
        }

        return {
          success: false,
          error: friendlyMessage,
          code: err?.code,
        };
      }

      // 4. Auto-login session immediately
      let session: Models.Session | null = null;
      try {
        const loginRes = await this.login(normalizedEmail, input.password);
        if (loginRes.success && loginRes.data) {
          session = loginRes.data;
        }
      } catch (loginErr) {
        console.warn('[AuthService] Automatic login warning:', loginErr);
      }

      // 5. Update user preferences for instant session hydration
      try {
        await account.updatePrefs({
          niatId: trimmedNiatId,
          phone: trimmedPhone,
          year: input.year,
          section: input.section,
        });
      } catch (prefErr) {
        console.warn('[AuthService] updatePrefs warning:', prefErr);
      }

      // 6. Create student profile database record
      let profile: StudentProfile | null = null;
      try {
        const profileRes = await StudentProfileService.createProfile({
          userId: user.$id,
          name: trimmedName,
          email: normalizedEmail,
          niatId: trimmedNiatId,
          phone: trimmedPhone,
          year: input.year,
          section: input.section,
        });

        if (profileRes.success && profileRes.data) {
          profile = profileRes.data;
        } else if (profileRes.error) {
          console.warn('[AuthService] Student profile creation notice:', profileRes.error);
        }
      } catch (dbErr) {
        console.error('[AuthService] Profile document creation error:', dbErr);
      }

      return {
        success: true,
        data: {
          user,
          session,
          profile,
        },
      };
    } catch (error: unknown) {
      const err = error as { message?: string; code?: number };
      return {
        success: false,
        error: err?.message || 'Unable to complete signup. Please try again.',
        code: err?.code,
      };
    }
  }

  /**
   * Authenticate an admin or student using email and password
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
    } catch (error: unknown) {
      const err = error as { code?: number; type?: string; message?: string };
      let friendlyMessage = 'Authentication failed. Please check your credentials.';

      if (err?.code === 401 || err?.type === 'user_invalid_credentials') {
        friendlyMessage = 'Invalid email or password. Please check your login details.';
      } else if (err?.code === 429) {
        friendlyMessage = 'Too many login attempts. Please wait a few minutes and try again.';
      } else if (err?.message) {
        friendlyMessage = err.message;
      }

      return {
        success: false,
        error: friendlyMessage,
        code: err?.code,
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
    } catch (error: unknown) {
      const err = error as { message?: string; code?: number };
      return {
        success: false,
        error: err?.message || 'Failed to terminate session.',
        code: err?.code,
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
