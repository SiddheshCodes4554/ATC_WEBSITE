import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Heart } from 'lucide-react';
import { SparkleDoodle, RetroRobotMascot } from '../doodles/DoodleSvgs';
import confetti from 'canvas-confetti';

// Bespoke Social Icons
const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const Footer: React.FC = () => {
  const [robotSpin, setRobotSpin] = useState(false);
  const [robotSpeech, setRobotSpeech] = useState(false);

  const handleRobotClick = () => {
    setRobotSpin(true);
    setRobotSpeech(true);
    confetti({
      particleCount: 50,
      spread: 70,
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
    });

    setTimeout(() => setRobotSpin(false), 800);
    setTimeout(() => setRobotSpeech(false), 4000);
  };

  return (
    <footer className="relative bg-[#0B0F19] text-white border-t-4 border-[#121316] pt-16 pb-12 overflow-hidden dots-pattern-dark select-none">
      {/* Decorative Sparkle Doodles */}
      <div className="absolute top-10 left-10 opacity-30 pointer-events-none animate-twinkle">
        <SparkleDoodle className="w-10 h-10" color="#FFE600" />
      </div>
      <div className="absolute top-12 right-12 opacity-30 pointer-events-none animate-twinkle">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Impact Heading */}
        <div className="pb-12 border-b-2 border-white/10 grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/atc-shield-logo.png"
                alt="ATC Logo"
                className="h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
              />
              <span className="text-xs font-mono font-bold tracking-widest text-[#FFE600] uppercase bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
                ● ADVANCED TECH CLUB • NIAT PUNE
              </span>
            </div>
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
              NIAT Campus, Lab 5.0 • Pune, MH
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
                  <span>ATC Lab 5.0</span>
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

          {/* Col 3: Socials & Interactive Mascot */}
          <div className="col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
              CONNECT ON INSTAGRAM
            </h4>
            <p className="text-xs text-gray-400">
              Follow our latest builds, hackathon highlights, event drops, and lab stories.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <a
                href="https://www.instagram.com/adv_tech.niatpune?utm_source=qr&igsi=dzJhcDB6c2NyNngy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#833ab4]/30 via-[#fd1d1d]/30 to-[#fcb045]/30 hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white border-2 border-[#FFE600]/40 text-xs font-black text-white transition-all duration-300 hover:scale-105 shadow-pop-sm"
                title="Follow ATC on Instagram (@adv_tech.niatpune)"
              >
                <InstagramIcon className="w-4 h-4 text-[#FFE600] group-hover:text-white" />
                <span>@adv_tech.niatpune</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3] ml-0.5 opacity-80" />
              </a>
            </div>

            {/* Interactive Tiny Mascot Easter Egg */}
            <div className="pt-2 flex items-center gap-3">
              <div 
                onClick={handleRobotClick}
                className={`p-2 rounded-2xl bg-[#FFE600] border-2 border-white/30 text-[#121316] cursor-pointer hover:scale-110 active:scale-95 transition-all ${
                  robotSpin ? 'rotate-[360deg] duration-700' : ''
                }`}
                title="Click me!"
              >
                <RetroRobotMascot className="w-8 h-auto" />
              </div>
              
              {robotSpeech ? (
                <div className="px-3 py-1.5 bg-white text-[#121316] rounded-xl font-hand font-bold text-sm animate-bounce shadow-pop-sm">
                  "You found me! Keep building great things! 🤖🚀"
                </div>
              ) : (
                <span className="text-[11px] font-mono text-gray-400">
                  (Click the robot for a secret hello!)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>© 2025–2026 Advanced Tech Club (ATC), NIAT Pune. Founded 14 Nov 2025.</span>
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
