import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Models } from 'appwrite';
import { AuthService, AuthResult, SignupSuccessData } from '../services/authService';
import { StudentProfile, StudentSignupInput, StudentYear, StudentSection } from '../types/studentProfile.types';
import { StudentProfileService } from '../services/studentProfileService';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  profile: StudentProfile | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResult<Models.Session>>;
  signup: (
    input: StudentSignupInput | {
      name: string;
      email: string;
      password: string;
      niatId?: string;
      phone?: string;
      year?: StudentYear;
      section?: StudentSection;
    }
  ) => Promise<AuthResult<SignupSuccessData>>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Derived state directly from the authenticated Appwrite user (source of truth)
  const isAdmin = AuthService.isAdminUser(user);

  // Fetch or hydrate student profile with auto-healing to database collection
  const hydrateProfile = async (currentUser: Models.User<Models.Preferences> | null) => {
    if (!currentUser?.$id) {
      setProfile(null);
      return;
    }

    try {
      const profileRes = await StudentProfileService.getProfileByUserId(currentUser.$id);
      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
        return;
      }

      // Fallback: If missing from database collection but present in user.prefs,
      // self-heal / create record in student_profiles table
      const prefs = (currentUser.prefs || {}) as Record<string, any>;
      if (prefs.niatId || prefs.studentId) {
        const niatId = (prefs.niatId || prefs.studentId || '').toString().trim();
        const year = (prefs.year || '1st Year') as StudentYear;
        const section = (prefs.section || 'S01') as StudentSection;
        const phone = (prefs.phone || '').toString().trim();

        try {
          const createRes = await StudentProfileService.createProfile({
            userId: currentUser.$id,
            name: currentUser.name || 'Student',
            email: currentUser.email || '',
            niatId: niatId,
            phone: phone,
            year: year,
            section: section,
          });

          if (createRes.success && createRes.data) {
            setProfile(createRes.data);
            return;
          }
        } catch (syncErr) {
          console.warn('[AuthContext] Auto-sync profile to student_profiles table:', syncErr);
        }

        setProfile({
          $id: currentUser.$id,
          $createdAt: currentUser.$createdAt || new Date().toISOString(),
          userId: currentUser.$id,
          name: currentUser.name || '',
          email: currentUser.email || '',
          niatId: niatId,
          studentId: niatId,
          phone: phone,
          year: year,
          section: section,
        });
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  };

  // Verify session on initial app mount
  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      await hydrateProfile(currentUser);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult<Models.Session>> => {
    setLoading(true);
    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        await hydrateProfile(currentUser);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    input: StudentSignupInput | {
      name: string;
      email: string;
      password: string;
      niatId?: string;
      phone?: string;
      year?: StudentYear;
      section?: StudentSection;
    }
  ): Promise<AuthResult<SignupSuccessData>> => {
    setLoading(true);
    try {
      const sanitizedInput: StudentSignupInput = {
        name: input.name,
        email: input.email,
        password: input.password,
        niatId: input.niatId || '',
        phone: input.phone || '',
        year: input.year || '1st Year',
        section: input.section || 'S01',
      };

      const result = await AuthService.signup(sanitizedInput);
      if (result.success && result.data) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser || result.data.user);
        if (result.data.profile) {
          setProfile(result.data.profile);
        } else {
          await hydrateProfile(currentUser || result.data.user);
        }
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isLoading: loading,
        isAuthenticated: Boolean(user),
        isAdmin,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
