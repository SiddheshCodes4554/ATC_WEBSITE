import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Heart } from 'lucide-react';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

// Bespoke Social Icons
const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.96 0-1.74.78-1.74 1.74s.78 1.74 1.74 1.74 1.74-.78 1.74-1.74-.78-1.74-1.74-1.74Z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0B0F19] text-white border-t-4 border-[#121316] pt-16 pb-12 overflow-hidden dots-pattern-dark">
      {/* Decorative Sparkle Doodles */}
      <div className="absolute top-10 left-10 opacity-30 pointer-events-none">
        <SparkleDoodle className="w-10 h-10" color="#FFE600" />
      </div>
      <div className="absolute top-12 right-12 opacity-30 pointer-events-none">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Impact Heading */}
        <div className="pb-12 border-b-2 border-white/10 grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FFE600] uppercase bg-white/10 px-3 py-1 rounded-full border border-white/15">
              ● ADVANCED TECH CLUB • NIAT PUNE
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
              LET’S BUILD THE FUTURE.<br />
              <span className="text-[#FFE600] drop-shadow-[0_4px_12px_rgba(255,230,0,0.3)]">
                TOGETHER.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-start lg:items-end">
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-black text-sm sm:text-base border-3 border-[#121316] shadow-pop transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Join ATC Today</span>
              <ArrowUpRight className="w-5 h-5 stroke-[3]" />
            </Link>
            <span className="text-xs font-mono text-gray-400">
              NIAT Campus, Lab 502 • Pune, MH
            </span>
          </div>
        </div>

        {/* Links & Socials Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b-2 border-white/10">
          {/* Col 1: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-sm font-bold text-gray-300">
              <li>
                <Link to="/" className="hover:text-[#FFE600] transition-colors">Home Playground</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FFE600] transition-colors">About ATC</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#FFE600] transition-colors">Events & Hackathons</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#FFE600] transition-colors">Student Projects</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
              LAB & TEAM
            </h4>
            <ul className="space-y-2 text-sm font-bold text-gray-300">
              <li>
                <Link to="/lab" className="hover:text-[#FFE600] transition-colors flex items-center gap-1.5">
                  <span>ATC 5.0 Lab</span>
                  <span className="px-1.5 py-0.2 bg-[#6C5CE7] text-white text-[9px] font-mono rounded">LIVE</span>
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-[#FFE600] transition-colors">Core Leadership</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#FFE600] transition-colors">Event Gallery</Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-[#FFE600] transition-colors text-[#FFE600]">Join Us ↗</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Socials */}
          <div className="col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
              CONNECT & CODE
            </h4>
            <p className="text-xs text-gray-400">
              Follow our latest builds, open-source repositories, tutorials and hackathon streams.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#FF6B6B] hover:text-white border border-white/20 text-xs font-bold transition-all hover:-translate-y-0.5"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#2E86DE] hover:text-white border border-white/20 text-xs font-bold transition-all hover:-translate-y-0.5"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-[#121316] border border-white/20 text-xs font-bold transition-all hover:-translate-y-0.5"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#FF0000] hover:text-white border border-white/20 text-xs font-bold transition-all hover:-translate-y-0.5"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>© Advanced Tech Club, NIAT Pune. All rights reserved.</span>
          </div>

          <div className="font-hand text-base text-gray-300 flex items-center gap-1.5">
            <span>Built with passion & code by ATC student builders</span>
            <Heart className="w-4 h-4 text-[#FF6B6B] fill-[#FF6B6B] inline animate-pulse" />
          </div>
        </div>

      </div>
    </footer>
  );
};
