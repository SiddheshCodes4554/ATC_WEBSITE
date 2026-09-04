import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Loader2 } from 'lucide-react';

interface StudentProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * Route protection wrapper for Student-only areas.
 * - Redirects guests to /login (preserving return location)
 * - Redirects admins to /admin/dashboard
 * - Allows authenticated students (isAuthenticated === true && isAdmin === false)
 */
export const StudentProtectedRoute: React.FC<StudentProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, isLoading } = useAuth();
  const location = useLocation();
  const isAuthChecking = loading ?? isLoading;

  // CASE 1: Show ATC loading screen while checking Appwrite session to prevent content flash
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-4 paper-pattern select-none">
        <div className="p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <Sparkles className="w-8 h-8 text-[#6C5CE7]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316] tracking-tight">
              Loading Student Space
            </h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">
              Verifying your ATC student session...
            </p>
          </div>
          <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // CASE 2: Guest / Unauthenticated -> Redirect to student login page with preserved return state
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // CASE 3: Authenticated Admin -> Safely redirect to Admin Dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // CASE 4: Authenticated Student -> Render child routes or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default StudentProtectedRoute;
