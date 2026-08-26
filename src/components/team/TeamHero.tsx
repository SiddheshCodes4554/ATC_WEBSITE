import React from 'react';
import { Sparkles, Users, Heart, Zap, ArrowDown } from 'lucide-react';
import { SparkleDoodle, SpiralScribble, LoopyArrow } from '../doodles/DoodleSvgs';

export const TeamHero: React.FC = () => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-16 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Background Doodles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-12 h-12" color="#FF793F" />
      </div>
      <div className="absolute top-14 right-14 opacity-40 pointer-events-none hidden md:block">
        <SpiralScribble className="w-14 h-14" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE8D6] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#FF793F]">
            <Users className="w-4 h-4" />
            THE BUILDERS • CREATORS • OPERATORS
          </div>

          {/* Editorial Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.08] max-w-4xl">
            MEET THE<br />
            PEOPLE MAKING<br />
            <span className="relative inline-block px-5 py-1.5 bg-[#FFE600] text-[#121316] rounded-3xl border-4 border-[#121316] shadow-pop rotate-[-1.5deg] mt-1">
              IT HAPPEN.
              <Sparkles className="w-7 h-7 text-[#FF4757] absolute -top-4 -right-4 animate-bounce" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl font-bold text-gray-700 max-w-2xl leading-relaxed">
            Not a corporate directory. These are the student leads, hardware hackers, event runners, and creative minds driving Advanced Tech Club at NIAT Pune.
          </p>

          {/* Fun stats badge bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-black">
            <span className="px-3.5 py-1.5 bg-white rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5">
              <span>☕</span> 1,200+ Cups of Chai
            </span>
            <span className="px-3.5 py-1.5 bg-white rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5">
              <span>🚀</span> 100% Student-Run
            </span>
            <span className="px-3.5 py-1.5 bg-white rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5">
              <span>❤️</span> 0 Corporate Jargon
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
