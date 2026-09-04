import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Models } from 'appwrite';
import { AuthService, AuthResult } from '../services/authService';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResult<Models.Session>>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult<{ user: Models.User<Models.Preferences>; session: Models.Session | null }>>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Derived state directly from the authenticated Appwrite user (source of truth)
  const isAdmin = AuthService.isAdminUser(user);

  // Verify session on initial app mount
  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
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
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult<{ user: Models.User<Models.Preferences>; session: Models.Session | null }>> => {
    setLoading(true);
    try {
      // 1. Create the Appwrite account
      const signupResult = await AuthService.signup(name, email, password);
      if (!signupResult.success || !signupResult.data) {
        return {
          success: false,
          error: signupResult.error || 'Failed to create account.',
          code: signupResult.code,
        };
      }

      // 2. Automatically log in the newly registered user
      const loginResult = await AuthService.login(email, password);
      if (loginResult.success) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        return {
          success: true,
          data: {
            user: currentUser || signupResult.data,
            session: loginResult.data || null,
          },
        };
      }

      // If auto-login fails, return success for creation with a warning note
      return {
        success: true,
        data: {
          user: signupResult.data,
          session: null,
        },
        error: 'Account created successfully! Please sign in with your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
