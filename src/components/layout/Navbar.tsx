import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sparkles, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlayfulButton } from '../ui/PlayfulButton';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Projects', path: '/projects' },
    { name: 'Lab 5.0', path: '/lab' },
    { name: 'Lab Slots', path: '/lab-access', badge: 'SLOTS' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
  ];

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

          {/* Desktop Menu with Clean Proportions */}
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

          {/* Primary CTA / Auth on Right */}
          <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-xs font-black text-[#6C5CE7] bg-white px-3 py-1 rounded-full border-2 border-[#121316] shadow-pop-sm max-w-[130px] truncate"
                  title={user?.email || 'Logged in user'}
                >
                  {user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'User')}
                </span>
                <button
                  onClick={async () => {
                    await logout();
                  }}
                  className="p-1.5 rounded-full bg-white hover:bg-[#FFE5E5] text-gray-500 hover:text-[#FF4757] transition-colors border-2 border-[#121316] shadow-pop-sm cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                {isAdmin ? (
                  <PlayfulButton
                    to="/admin/dashboard"
                    variant="primary"
                    size="md"
                    withConfetti
                    icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
                  >
                    Dashboard
                  </PlayfulButton>
                ) : (
                  <PlayfulButton
                    to="/join"
                    variant="primary"
                    size="md"
                    withConfetti
                    icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
                  >
                    Let's Build
                  </PlayfulButton>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-black text-[#121316] hover:bg-[#FFE600]/30 transition-colors font-mono uppercase border-2 border-transparent hover:border-[#121316]"
                >
                  Sign In
                </Link>
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
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Drawer Menu with Playful Cascade */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-3 border-[#121316] bg-[#FAF7F0] px-5 py-6 space-y-4 animate-fadeIn">
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

          {/* Mobile User/Auth & CTA */}
          <div className="pt-2 space-y-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm">
                <span className="font-mono text-xs font-black text-[#6C5CE7] truncate">
                  👤 {user?.name || user?.email}
                </span>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#FFE5E5] text-[#FF4757] font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316] flex items-center justify-center gap-2 text-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Student Sign In / Register</span>
              </Link>
            )}

            <Link
              to={isAdmin ? '/admin/dashboard' : '/join'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop font-mono text-xs font-black text-[#121316] flex items-center justify-center gap-2 text-center"
            >
              <span>{isAdmin ? 'Admin Dashboard' : "Join ATC • Let's Build"}</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
