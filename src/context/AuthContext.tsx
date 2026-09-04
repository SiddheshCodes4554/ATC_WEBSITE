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
