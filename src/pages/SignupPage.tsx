import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to the home page immediately
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // 1. Client-side Name validation
    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    // 2. Client-side Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // 3. Client-side Password validation
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // 4. Confirm Password Match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // 5. Appwrite Account Registration & Auto-login
      const result = await signup(trimmedName, trimmedEmail, password);

      if (result.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
        });

        // Navigate directly to Home
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Unable to create your account. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#FAF7F0] flex flex-col items-center justify-center p-4 sm:p-8 paper-pattern select-none">
      
      {/* Top Bar Navigation Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="font-mono text-[11px] font-bold text-gray-500">
          NIAT PUNE
        </span>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-8 sm:p-10 relative">
        
        {/* Playful Tape Accent on Top */}
        <div className="tape-strip pointer-events-none bg-[#6C5CE7]" />

        {/* Header Badge & Title */}
        <div className="text-center space-y-3 mb-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#121316]">
            <Sparkles className="w-3.5 h-3.5" />
            STUDENT REGISTRATION
          </div>

          <div className="flex items-center justify-center gap-3">
            <img
              src="/atc-shield-logo.png"
              alt="ATC Logo"
              className="h-11 w-auto object-contain drop-shadow-[2px_2px_0px_#121316]"
            />
            <h1 className="text-3xl font-black text-[#121316] tracking-tight">
              Create Account
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-600">
            Join the Advanced Tech Club community at NIAT Pune
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-black uppercase text-[#121316]">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivers"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-black uppercase text-[#121316]">
              Email Address
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
                placeholder="alex@niat.edu.in"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                Password
              </label>
              <span className="font-mono text-[10px] font-bold text-gray-500">
                Min. 8 chars
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-[#121316] transition-colors focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-mono font-black uppercase text-[#121316]">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                disabled={isSubmitting}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] disabled:opacity-60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-[#121316] transition-colors focus:outline-none cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !email.trim() || !password || !confirmPassword}
            className="w-full mt-3 py-3.5 px-6 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] disabled:opacity-60 disabled:cursor-not-allowed text-[#121316] font-black text-base border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Signup</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </>
            )}
          </button>

        </form>

        {/* Benefits Note */}
        <div className="mt-6 pt-4 border-t-2 border-[#121316]/10 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-[#2ED573]" />
            <span>Instant event passes & lab slots booking</span>
          </div>

          <p className="font-mono text-[11px] font-bold text-gray-500">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-[#6C5CE7] hover:underline font-black">
              Sign In
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default SignupPage;
