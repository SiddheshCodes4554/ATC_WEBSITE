import React from 'react';
import { Sparkles, Heart, Rocket, Users } from 'lucide-react';
import { SparkleDoodle, SpiralScribble } from '../doodles/DoodleSvgs';

export const JoinHero: React.FC = () => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-14 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-12 h-12" color="#FF793F" />
      </div>
      <div className="absolute top-14 right-14 opacity-40 pointer-events-none hidden md:block">
        <SpiralScribble className="w-14 h-14" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE8D6] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#FF793F]">
            <Rocket className="w-4 h-4" />
            MEMBERSHIP & COLLABORATION • COHORT 2026
          </div>

          {/* Large Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.06]">
            THE NEXT<br />
            GREAT IDEA<br />
            MIGHT START<br />
            <span className="relative inline-block px-5 py-1.5 bg-[#FFE600] text-[#121316] rounded-3xl border-4 border-[#121316] shadow-pop rotate-[-1.5deg] mt-1">
              WITH YOU.
              <Sparkles className="w-7 h-7 text-[#FF4757] absolute -top-4 -right-4 animate-bounce" />
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl font-bold text-gray-700 max-w-2xl leading-relaxed pt-2">
            Whether you want to learn, build, organize, create content, connect with people or simply explore technology — there's a place for you at ATC.
          </p>

          {/* Perks Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-black">
            <span className="px-3.5 py-1.5 bg-white rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5">
              <span>⚡</span> Free for all NIAT students
            </span>
            <span className="px-3.5 py-1.5 bg-white rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5">
              <span>🛠️</span> 24/7 Lab 502 Hardware Access
            </span>
            <span className="px-3.5 py-1.5 bg-white rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5">
              <span>🍕</span> Community Hackathons & Pizza
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
