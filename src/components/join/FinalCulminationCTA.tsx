import React from 'react';
import { ArrowUpRight, Sparkles, Rocket, Zap, Heart } from 'lucide-react';
import { SparkleDoodle, RetroRobotMascot } from '../doodles/DoodleSvgs';
import confetti from 'canvas-confetti';

interface FinalCulminationCTAProps {
  onJoinClick: () => void;
}

export const FinalCulminationCTA: React.FC<FinalCulminationCTAProps> = ({ onJoinClick }) => {
  const handleCTAClick = () => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573', '#00D2D3'],
    });
    onJoinClick();
  };

  return (
    <section className="relative bg-[#121316] py-24 sm:py-36 border-b-4 border-[#121316] overflow-hidden select-none text-white">
      
      {/* ========================================================= */}
      {/* CONVERGING DOODLE LINES FROM ALL CORNERS TOWARDS THE CTA */}
      {/* ========================================================= */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1440 700" fill="none">
        {/* Top-Left to Center */}
        <path d="M 0 50 Q 400 100 720 380" stroke="#FFE600" strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
        <circle cx="200" cy="75" r="6" fill="#FFE600" />
        
        {/* Top-Right to Center */}
        <path d="M 1440 50 Q 1040 100 720 380" stroke="#FF6B6B" strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
        <circle cx="1240" cy="75" r="6" fill="#FF6B6B" />

        {/* Bottom-Left to Center */}
        <path d="M 0 650 Q 400 600 720 380" stroke="#00D2D3" strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
        <circle cx="200" cy="625" r="6" fill="#00D2D3" />

        {/* Bottom-Right to Center */}
        <path d="M 1440 650 Q 1040 600 720 380" stroke="#2ED573" strokeWidth="4" strokeDasharray="8 8" className="animate-pulse" />
        <circle cx="1240" cy="625" r="6" fill="#2ED573" />

        {/* Central Energy Rings */}
        <circle cx="720" cy="380" r="140" stroke="#FFE600" strokeWidth="2" strokeDasharray="6 6" opacity="0.5" className="animate-spin" />
        <circle cx="720" cy="380" r="200" stroke="#6C5CE7" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.3" />
      </svg>

      {/* Floating Sparkle Doodles */}
      <div className="absolute top-12 left-12 opacity-60 pointer-events-none hidden sm:block animate-wiggle">
        <SparkleDoodle className="w-16 h-16" color="#FFE600" />
      </div>
      <div className="absolute bottom-12 right-12 opacity-60 pointer-events-none hidden sm:block animate-float-slow">
        <SparkleDoodle className="w-16 h-16" color="#FF6B6B" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Culmination Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFE600] text-[#121316] font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-pop-sm rotate-[-2deg]">
          <Zap className="w-4 h-4 text-[#121316]" />
          THE GRAND CULMINATION • NIAT PUNE
        </div>

        {/* Massive Bold Heading */}
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.98] uppercase">
            DON'T JUST WATCH<br />
            <span className="text-[#FFE600]">THE FUTURE</span><br />
            <span className="text-white">HAPPEN.</span>
          </h2>

          <div className="pt-4">
            <span className="text-5xl sm:text-7xl lg:text-9xl font-black text-[#FF6B6B] tracking-tight leading-none drop-shadow-[4px_4px_0px_#FFFFFF]">
              BUILD IT.
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-2xl font-bold text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Advanced Tech Club, NIAT Pune — a playground built by students who love technology.
        </p>

        {/* Main Converging Giant CTA Button */}
        <div className="pt-6 flex flex-col items-center justify-center space-y-4">
          <button
            type="button"
            onClick={handleCTAClick}
            className="group px-10 sm:px-16 py-5 sm:py-6 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-black text-xl sm:text-3xl border-4 border-white shadow-[0_0_50px_rgba(255,230,0,0.5)] hover:shadow-[0_0_70px_rgba(255,230,0,0.8)] transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <span>JOIN ATC</span>
            <ArrowUpRight className="w-8 h-8 stroke-[3] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>

          <span className="text-xs font-mono font-bold text-gray-400">
            ⚡ Applications reviewed continuously • Cohort 2026
          </span>
        </div>

      </div>
    </section>
  );
};
