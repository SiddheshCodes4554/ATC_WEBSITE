import React from 'react';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requireAdmin = true 
}) => {
  const { isAuthenticated, isAdmin, loading, isLoading } = useAuth();
  const location = useLocation();
  const isAuthChecking = loading ?? isLoading;

  // CASE 1: Show clean loading spinner while checking Appwrite session to prevent flash of content
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-4 paper-pattern">
        <div className="p-8 rounded-3xl bg-white border-4 border-[#121316] shadow-pop flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <ShieldCheck className="w-8 h-8 text-[#121316]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316] tracking-tight">Verifying Session</h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">Connecting to Appwrite...</p>
          </div>
          <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  // CASE 2: Guest / Unauthenticated -> Redirect to admin login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // CASE 3: Authenticated but Non-Admin attempting to access admin route
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-4 paper-pattern select-none">
        <div className="p-8 sm:p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl flex flex-col items-center gap-5 text-center max-w-md">
          <div className="w-16 h-16 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop-sm flex items-center justify-center text-[#FF4757]">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#FFE5E5] text-[#FF4757] font-mono text-xs font-black uppercase border border-[#FF4757]/30">
              403 • ACCESS FORBIDDEN
            </span>
            <h2 className="font-black text-2xl sm:text-3xl text-[#121316] tracking-tight">
              Admin Privileges Required
            </h2>
            <p className="font-mono text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
              Your account is authenticated, but does not possess verified administrator permissions in Appwrite.
            </p>
          </div>
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    );
  }

  // CASE 4: Authorized Admin -> Render children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
