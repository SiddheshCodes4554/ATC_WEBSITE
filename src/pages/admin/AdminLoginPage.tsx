import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldAlert, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to dashboard immediately
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const destination = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
        });

        const destination = (location.state as any)?.from?.pathname || '/admin/dashboard';
        navigate(destination, { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F0] flex flex-col items-center justify-center p-4 sm:p-8 paper-pattern select-none">
      
      {/* Back to website link */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ATC Website</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-8 sm:p-10 relative">
        
        {/* Tape Accent on Top */}
        <div className="tape-strip pointer-events-none bg-[#FFE600]" />

        {/* Header Badge & Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#6C5CE7]">
            <Lock className="w-3.5 h-3.5" />
            ADMIN PORTAL • NIAT PUNE
          </div>

          <div className="flex items-center justify-center gap-2">
            <img
              src="/atc-shield-logo.png"
              alt="ATC Logo"
              className="h-10 w-auto object-contain drop-shadow-[1px_2px_0px_#121316]"
            />
            <h1 className="text-3xl font-black text-[#121316] tracking-tight">
              Admin Login
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-600">
            Sign in with your authorized ATC admin credentials.
          </p>
        </div>

        {/* Error Alert Message */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] text-[#121316] flex items-start gap-3 animate-fadeIn shadow-pop-sm">
            <ShieldAlert className="w-5 h-5 text-[#FF4757] flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-bold leading-snug">
              {error}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-black uppercase text-[#121316]">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@atc.niat.edu.in"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-black uppercase text-[#121316]">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !email || !password}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] disabled:opacity-60 text-[#121316] font-black text-base border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </>
            )}
          </button>

        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-4 border-t-2 border-[#121316]/10 text-center">
          <p className="font-mono text-[11px] font-bold text-gray-500">
            🔒 Protected by Appwrite Authentication • ATC Admin Only
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdminLoginPage;
