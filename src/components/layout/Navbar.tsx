import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon,
  UserPlus,
  ChevronDown,
  Shield,
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlayfulButton } from '../ui/PlayfulButton';

/**
 * Generate safe 2-letter uppercase initials for avatar badge
 */
const getInitials = (name?: string, email?: string): string => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.trim().slice(0, 2).toUpperCase();
  }
  return 'ST';
};

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin, loading } = useAuth();

  // Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Projects', path: '/projects' },
    { name: 'Lab 5.0', path: '/lab' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Lab Slots', path: '/lab-access', badge: 'SLOTS' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
  ];

  // Derived user name with safe fallbacks
  const displayName =
    user?.name?.trim() ||
    (user?.email ? user.email.split('@')[0] : (isAdmin ? 'Administrator' : 'Student'));

  // Close menus on route navigation
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside and Escape key handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

  // Handle user logout and clean redirect
  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md text-[#121316] border-b-3 border-[#121316] transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ATC Brand Logo on Left */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
            <div className="relative flex items-center justify-center">
              <img
                src="/atc-shield-logo.png"
                alt="ATC NIAT Pune Logo"
                className="h-11 sm:h-12 w-auto object-contain drop-shadow-[2px_2px_0px_#121316] group-hover:scale-105 group-hover:rotate-3 transition-transform duration-200"
              />
              <Sparkles className="w-4 h-4 text-[#FF6B6B] absolute -top-1 -right-1 animate-twinkle pointer-events-none" />
            </div>
            
            <div className="flex flex-col justify-center">
              <span className="font-black text-base sm:text-lg tracking-tight leading-tight text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                ADVANCED TECH CLUB
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold text-[#6C5CE7]">
                NIAT PUNE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group relative px-2.5 xl:px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-extrabold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-sm font-black'
                      : 'text-[#121316]/80 hover:text-[#121316] hover:bg-[#121316]/5'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.name}
                    {link.badge && (
                      <span className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] font-black ${
                        isActive
                          ? 'bg-[#121316] text-[#FFE600]'
                          : 'bg-[#6C5CE7] text-white'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Controls & Actions on Right */}
          <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
            {loading ? (
              /* Loading Skeleton (Prevents auth UI flicker) */
              <div className="flex items-center gap-2">
                <div className="w-16 h-8 bg-gray-200/80 rounded-full animate-pulse border-2 border-transparent" />
                <div className="w-24 h-9 bg-gray-200/80 rounded-full animate-pulse border-2 border-transparent" />
              </div>
            ) : isAuthenticated ? (
              /* AUTHENTICATED USER MENU (Student or Admin) */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#121316] transition-all cursor-pointer select-none ${
                    isAdmin
                      ? 'bg-[#FFE600] hover:bg-[#FFD32A]'
                      : 'bg-white hover:bg-[#FAF7F0]'
                  } ${
                    userDropdownOpen
                      ? 'shadow-pop-sm ring-2 ring-[#121316]'
                      : 'shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px]'
                  }`}
                >
                  {/* User Avatar / Initials */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs border border-[#121316] flex-shrink-0 ${
                      isAdmin
                        ? 'bg-[#121316] text-[#FFE600]'
                        : 'bg-[#6C5CE7] text-white'
                    }`}
                  >
                    {isAdmin ? (
                      <Shield className="w-3.5 h-3.5" />
                    ) : (
                      getInitials(user?.name, user?.email)
                    )}
                  </div>

                  {/* Display Name */}
                  <span className="font-mono text-xs font-black text-[#121316] max-w-[100px] xl:max-w-[130px] truncate">
                    {displayName}
                  </span>

                  {/* Badge for Admin */}
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#121316] text-[#FFE600] font-mono text-[9px] font-black">
                      ADMIN
                    </span>
                  )}

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#121316] transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border-3 border-[#121316] shadow-pop-xl p-3 z-50 animate-fadeIn select-none"
                  >
                    {/* User Profile Header Card */}
                    <div className="p-3 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316] mb-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono font-black text-xs text-[#121316] truncate">
                          {displayName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full border border-[#121316] font-mono text-[9px] font-black ${
                            isAdmin
                              ? 'bg-[#FFE600] text-[#121316]'
                              : 'bg-[#E1DCFF] text-[#6C5CE7]'
                          }`}
                        >
                          {isAdmin ? 'ADMINISTRATOR' : 'STUDENT'}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-gray-500 font-bold truncate">
                        {user?.email || (isAdmin ? 'Admin Session' : 'Student Account')}
                      </p>
                    </div>

                    {/* Actions Menu */}
                    <div className="space-y-1">
                      {isAdmin ? (
                        /* Admin Dashboard Link */
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-[#121316] hover:bg-[#FFE600]/40 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-[#121316]" />
                            <span>Admin Dashboard</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                        </Link>
                      ) : (
                        /* Student: Dashboard & My Account */
                        <>
                          <Link
                            to="/student/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-[#121316] hover:bg-[#FFE600]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <LayoutDashboard className="w-4 h-4 text-[#6C5CE7]" />
                              <span>My Dashboard</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                          </Link>

                          <div
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-400 bg-gray-50/80 border border-dashed border-gray-300 cursor-not-allowed select-none"
                            title="Student account management coming soon"
                          >
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-gray-400" />
                              <span>My Account</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-mono text-[9px] font-bold">
                              Coming Soon
                            </span>
                          </div>
                        </>
                      )}

                      {/* Divider */}
                      <div className="h-px bg-[#121316]/10 my-1.5" />

                      {/* Logout Action */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black text-[#FF4757] hover:bg-[#FFE5E5] transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* GUEST STATE: Login & Sign Up Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-black text-[#121316] hover:bg-[#FFE600]/30 transition-colors font-mono uppercase border-2 border-transparent hover:border-[#121316]"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Let's Build CTA */}
            <PlayfulButton
              to="/join"
              variant="primary"
              size="md"
              withConfetti
              icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
            >
              Let's Build
            </PlayfulButton>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#FFE600] border-2 border-[#121316] text-[#121316] shadow-pop-sm active:scale-95 transition-transform cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-3 border-[#121316] bg-[#FAF7F0] px-5 py-6 space-y-4 animate-fadeIn">
          {/* Mobile Nav Links Grid */}
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between border-2 transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-[#FFE600] text-[#121316] border-[#121316] shadow-pop-sm font-black'
                      : 'bg-white border-[#121316]/20 text-[#121316] hover:bg-gray-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 bg-[#6C5CE7] text-white text-[9px] rounded-full font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Authentication & User Section */}
          <div className="pt-2 space-y-2">
            {loading ? (
              <div className="h-12 bg-gray-200/70 rounded-2xl animate-pulse" />
            ) : isAuthenticated ? (
              <div className="p-3.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm space-y-3">
                {/* User Info Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs border border-[#121316] flex-shrink-0 ${
                        isAdmin
                          ? 'bg-[#121316] text-[#FFE600]'
                          : 'bg-[#6C5CE7] text-white'
                      }`}
                    >
                      {isAdmin ? (
                        <Shield className="w-4 h-4" />
                      ) : (
                        getInitials(user?.name, user?.email)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-black text-[#121316] truncate">
                        {displayName}
                      </p>
                      <p className="font-mono text-[10px] text-gray-500 font-bold truncate">
                        {user?.email || (isAdmin ? 'Admin Session' : 'Student Account')}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full border border-[#121316] font-mono text-[9px] font-black flex-shrink-0 ${
                      isAdmin
                        ? 'bg-[#FFE600] text-[#121316]'
                        : 'bg-[#E1DCFF] text-[#6C5CE7]'
                    }`}
                  >
                    {isAdmin ? 'ADMIN' : 'STUDENT'}
                  </span>
                </div>

                {/* Contextual Action: Admin Dashboard or Student Dashboard */}
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border-2 border-[#121316] text-xs font-black text-[#121316] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-[#121316]" />
                      <span>Admin Dashboard</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </Link>
                ) : (
                  <div className="space-y-1.5">
                    <Link
                      to="/student/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border-2 border-[#121316] text-xs font-black text-[#121316] transition-colors shadow-pop-sm"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-[#6C5CE7]" />
                        <span>My Dashboard</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </Link>

                    <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-400 bg-gray-50 border border-dashed border-gray-300 select-none">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>My Account</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-mono text-[9px] font-bold">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )}

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-xl bg-[#FFE5E5] hover:bg-[#FFD2D2] text-[#FF4757] font-mono text-xs font-black flex items-center justify-center gap-1.5 border border-[#FF4757]/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* Mobile Guest Actions */
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#121316] font-mono text-xs font-black text-[#121316] flex items-center justify-center gap-1.5 text-center shadow-pop-sm transition-transform active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] flex items-center justify-center gap-1.5 text-center shadow-pop-sm transition-transform active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Primary CTA */}
            <Link
              to="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#121316] text-[#FFE600] hover:bg-[#121316]/90 border-3 border-[#121316] shadow-pop font-mono text-xs font-black flex items-center justify-center gap-2 text-center transition-transform active:scale-95"
            >
              <span>Join ATC • Let's Build</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
