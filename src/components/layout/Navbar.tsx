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
  ArrowRight,
  Lightbulb,
  FolderGit2,
  Calendar,
  FlaskConical,
  Package,
  Clock,
  Users,
  Image,
  Info,
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
  const [openNavDropdown, setOpenNavDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin, loading } = useAuth();

  // Navigation Structure (Organized into high-level categories)
  const navSections = [
    {
      id: 'events',
      name: 'Events',
      path: '/events',
      type: 'link' as const,
    },
    {
      id: 'projects',
      name: 'Projects',
      type: 'dropdown' as const,
      badge: 'NEW',
      items: [
        {
          name: 'Projects Showcase',
          desc: 'Hardware builds, robotics & apps',
          path: '/projects',
          icon: <FolderGit2 className="w-4 h-4 text-[#0288D1]" />,
        },
        {
          name: 'Project Idea Hub',
          desc: 'Pitch & brainstorm tech concepts',
          path: '/ideas',
          badge: 'NEW',
          icon: <Lightbulb className="w-4 h-4 text-[#FFA502]" />,
        },
      ],
    },
    {
      id: 'lab',
      name: 'Lab 5.0',
      type: 'dropdown' as const,
      items: [
        {
          name: 'Lab Facilities',
          desc: 'Explore workbenches & stations',
          path: '/lab',
          icon: <FlaskConical className="w-4 h-4 text-[#2ED573]" />,
        },
        {
          name: 'Book Lab Slots',
          desc: 'Reserve maker bench hours',
          path: '/lab-access',
          badge: 'SLOTS',
          icon: <Clock className="w-4 h-4 text-[#FF793F]" />,
        },
        {
          name: 'Hardware Inventory',
          desc: 'Live sensor & MCU catalog',
          path: '/inventory',
          icon: <Package className="w-4 h-4 text-[#6C5CE7]" />,
        },
      ],
    },
    {
      id: 'about',
      name: 'About',
      type: 'dropdown' as const,
      items: [
        {
          name: 'About ATC',
          desc: 'Mission, domains & club vision',
          path: '/about',
          icon: <Info className="w-4 h-4 text-[#6C5CE7]" />,
        },
        {
          name: 'Leadership & Team',
          desc: 'Meet core department leads',
          path: '/team',
          icon: <Users className="w-4 h-4 text-[#2ED573]" />,
        },
        {
          name: 'Memory Wall & Gallery',
          desc: 'Hackathons & club moments',
          path: '/gallery',
          icon: <Image className="w-4 h-4 text-[#FF4757]" />,
        },
      ],
    },
  ];

  // Derived user name with safe fallbacks
  const displayName =
    user?.name?.trim() ||
    (user?.email ? user.email.split('@')[0] : (isAdmin ? 'Administrator' : 'Student'));

  // Close menus on route navigation
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setOpenNavDropdown(null);
  }, [location.pathname]);

  // Click outside and Escape key handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      // Close nav dropdowns if click is outside header
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-dropdown-container')) {
        setOpenNavDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setOpenNavDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavDropdownEnter = (id: string) => {
    if (navDropdownTimeoutRef.current) {
      clearTimeout(navDropdownTimeoutRef.current);
    }
    setOpenNavDropdown(id);
  };

  const handleNavDropdownLeave = () => {
    navDropdownTimeoutRef.current = setTimeout(() => {
      setOpenNavDropdown(null);
    }, 150);
  };

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
        <div className="flex items-center justify-between h-20 gap-4">
          
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

          {/* Desktop Navigation Links (Spacious & Cleanly Grouped) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-4">
            {navSections.map((section) => {
              if (section.type === 'link') {
                const isActive = location.pathname === section.path;
                return (
                  <Link
                    key={section.id}
                    to={section.path!}
                    className={`px-3.5 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all duration-150 whitespace-nowrap ${
                      isActive
                        ? 'bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-xs font-black'
                        : 'text-[#121316]/80 hover:text-[#121316] hover:bg-[#121316]/5'
                    }`}
                  >
                    <span>{section.name}</span>
                  </Link>
                );
              }

              // Dropdown Group
              const isChildActive = section.items?.some((item) => location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)));
              const isDropdownOpen = openNavDropdown === section.id;

              return (
                <div
                  key={section.id}
                  className="relative nav-dropdown-container"
                  onMouseEnter={() => handleNavDropdownEnter(section.id)}
                  onMouseLeave={handleNavDropdownLeave}
                >
                  <button
                    type="button"
                    onClick={() => setOpenNavDropdown(isDropdownOpen ? null : section.id)}
                    aria-expanded={isDropdownOpen}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs lg:text-sm font-extrabold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      isChildActive
                        ? 'bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-xs font-black'
                        : isDropdownOpen
                        ? 'bg-[#121316]/5 text-[#121316]'
                        : 'text-[#121316]/80 hover:text-[#121316] hover:bg-[#121316]/5'
                    }`}
                  >
                    <span>{section.name}</span>
                    {section.badge && !isChildActive && (
                      <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] font-black bg-[#6C5CE7] text-white">
                        {section.badge}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 text-[#121316]' : 'text-gray-500'
                      }`}
                    />
                  </button>

                  {/* Dropdown Popup Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-3xl border-3 border-[#121316] shadow-pop-lg p-2 z-50 animate-fadeIn space-y-1">
                      {section.items?.map((item) => {
                        const isItemActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpenNavDropdown(null)}
                            className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all ${
                              isItemActive
                                ? 'bg-[#FFE600]/40 border border-[#121316]/20'
                                : 'hover:bg-[#FAF7F0]'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#121316] shadow-pop-xs flex items-center justify-center flex-shrink-0">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-xs text-[#121316] truncate">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] font-black bg-[#6C5CE7] text-white">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-bold text-gray-500 truncate leading-tight">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Auth Controls & CTA on Right */}
          <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            {loading ? (
              /* Loading Skeleton */
              <div className="flex items-center gap-2">
                <div className="w-16 h-8 bg-gray-200/80 rounded-full animate-pulse" />
                <div className="w-24 h-9 bg-gray-200/80 rounded-full animate-pulse" />
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
                  <span className="font-mono text-xs font-black text-[#121316] max-w-[90px] lg:max-w-[120px] truncate">
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

                {/* User Dropdown Menu */}
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
                          {isAdmin ? 'ADMIN' : 'STUDENT'}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-gray-500 font-bold truncate">
                        {user?.email || (isAdmin ? 'Admin Session' : 'Student Account')}
                      </p>
                    </div>

                    {/* Actions Menu */}
                    <div className="space-y-1">
                      {isAdmin ? (
                        <>
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

                          <Link
                            to="/admin/project-ideas"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-[#121316] hover:bg-[#FFE600]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-[#FFA502]" />
                              <span>Moderate Ideas</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                          </Link>

                          <Link
                            to="/admin/membership-applications"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-[#121316] hover:bg-[#FFE600]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-[#6C5CE7]" />
                              <span>Member Applications</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                          </Link>
                        </>
                      ) : (
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

                          <Link
                            to="/student/ideas"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-[#121316] hover:bg-[#FFE600]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-[#FFA502]" />
                              <span>My Project Ideas</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                          </Link>
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
              /* GUEST STATE */
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
          <div className="flex md:hidden">
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

      {/* Mobile Drawer Menu (Structured Categories) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-3 border-[#121316] bg-[#FAF7F0] px-5 py-6 space-y-5 animate-fadeIn max-h-[85vh] overflow-y-auto">
          {/* Mobile Navigation List */}
          <div className="space-y-4">
            {/* Events Direct Link */}
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between font-black text-sm transition-all ${
                location.pathname === '/events'
                  ? 'bg-[#FFE600] border-[#121316] shadow-pop-xs'
                  : 'bg-white border-[#121316]/20'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#6C5CE7]" />
                <span>Events & Hackathons</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Projects Category */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-xs space-y-2">
              <span className="font-mono text-[10px] font-black uppercase text-gray-500 tracking-wider">
                Projects & Innovation
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col gap-1"
                >
                  <FolderGit2 className="w-4 h-4 text-[#0288D1]" />
                  <span className="font-black text-xs text-[#121316]">Showcase</span>
                </Link>
                <Link
                  to="/ideas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col gap-1 relative"
                >
                  <div className="flex items-center justify-between">
                    <Lightbulb className="w-4 h-4 text-[#FFA502]" />
                    <span className="px-1.5 py-0.2 bg-[#6C5CE7] text-white text-[8px] rounded font-mono font-bold">
                      NEW
                    </span>
                  </div>
                  <span className="font-black text-xs text-[#121316]">Idea Hub</span>
                </Link>
              </div>
            </div>

            {/* Lab Category */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-xs space-y-2">
              <span className="font-mono text-[10px] font-black uppercase text-gray-500 tracking-wider">
                Lab 5.0 & Hardware
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  to="/lab"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col items-center text-center gap-1"
                >
                  <FlaskConical className="w-4 h-4 text-[#2ED573]" />
                  <span className="font-black text-[11px] text-[#121316]">Overview</span>
                </Link>
                <Link
                  to="/lab-access"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col items-center text-center gap-1"
                >
                  <Clock className="w-4 h-4 text-[#FF793F]" />
                  <span className="font-black text-[11px] text-[#121316]">Book Slots</span>
                </Link>
                <Link
                  to="/inventory"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col items-center text-center gap-1"
                >
                  <Package className="w-4 h-4 text-[#6C5CE7]" />
                  <span className="font-black text-[11px] text-[#121316]">Inventory</span>
                </Link>
              </div>
            </div>

            {/* About & Community */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-xs space-y-2">
              <span className="font-mono text-[10px] font-black uppercase text-gray-500 tracking-wider">
                Club & Community
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col items-center text-center gap-1"
                >
                  <Info className="w-4 h-4 text-[#6C5CE7]" />
                  <span className="font-black text-[11px] text-[#121316]">About</span>
                </Link>
                <Link
                  to="/team"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col items-center text-center gap-1"
                >
                  <Users className="w-4 h-4 text-[#2ED573]" />
                  <span className="font-black text-[11px] text-[#121316]">Team</span>
                </Link>
                <Link
                  to="/gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border border-[#121316]/20 flex flex-col items-center text-center gap-1"
                >
                  <Image className="w-4 h-4 text-[#FF4757]" />
                  <span className="font-black text-[11px] text-[#121316]">Gallery</span>
                </Link>
              </div>
            </div>
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
                  <div className="space-y-1.5">
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

                    <Link
                      to="/admin/project-ideas"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border-2 border-[#121316] text-xs font-black text-[#121316] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-[#FFA502]" />
                        <span>Moderate Project Ideas</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </Link>
                  </div>
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

                    <Link
                      to="/student/ideas"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600]/30 border-2 border-[#121316] text-xs font-black text-[#121316] transition-colors shadow-pop-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-[#FFA502]" />
                        <span>My Project Ideas</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </Link>
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
