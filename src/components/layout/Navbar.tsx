import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Projects', path: '/projects' },
    { name: 'Lab', path: '/lab', badge: '5.0' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Join Us', path: '/join' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md text-[#121316] border-b-3 border-[#121316] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ATC Brand Logo on Left */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none select-none">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE600] text-[#121316] border-3 border-[#121316] shadow-pop flex items-center justify-center font-black text-2xl tracking-tighter group-hover:rotate-6 transition-transform">
                ATC
              </div>
              <Sparkles className="w-4 h-4 text-[#FF6B6B] absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>
            
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-tight leading-none text-[#121316]">
                ADVANCED TECH CLUB
              </span>
              <span className="text-[11px] font-mono tracking-wider uppercase font-bold text-[#6C5CE7]">
                NIAT PUNE
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3.5 py-1.5 rounded-full text-sm font-extrabold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FFD32A] text-[#121316] border-2 border-[#121316] shadow-pop-sm'
                      : 'text-[#121316]/80 hover:text-[#121316] hover:bg-[#121316]/5'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-[#6C5CE7] text-white text-[10px] rounded-full font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA on Right: Let's Build ↗ */}
          <div className="hidden sm:flex items-center gap-3">
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

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#FFE600] border-2 border-[#121316] text-[#121316] shadow-pop-sm active:scale-95 transition-transform"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-3 border-[#121316] bg-[#FAF7F0] px-5 py-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between border-2 ${
                    isActive
                      ? 'bg-[#FFD32A] text-[#121316] border-[#121316] shadow-pop-sm'
                      : 'bg-white border-[#121316]/20 text-[#121316]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 bg-[#6C5CE7] text-white text-[10px] rounded-md font-mono">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3">
            <PlayfulButton
              to="/join"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              withConfetti
              onClick={() => setMobileMenuOpen(false)}
              icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
            >
              Let's Build ↗
            </PlayfulButton>
          </div>
        </div>
      )}
    </header>
  );
};
