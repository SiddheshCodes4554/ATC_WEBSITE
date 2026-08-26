import React from 'react';
import { Sparkles, Quote, Lightbulb } from 'lucide-react';
import { StickyNote } from '../ui/StickyNote';
import { SparkleDoodle, LoopyArrow, SpiralScribble } from '../doodles/DoodleSvgs';

interface AboutEventSectionProps {
  about: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    pullQuote: string;
    stickyNote: string;
  };
}

export const AboutEventSection: React.FC<AboutEventSectionProps> = ({ about }) => {
  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-12 left-8 opacity-40 pointer-events-none hidden md:block">
        <SpiralScribble className="w-14 h-14" color="#6C5CE7" />
      </div>
      <div className="absolute bottom-12 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
              {about.heading}
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFE600" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight max-w-2xl">
            {about.subheading}
          </h2>
        </div>

        {/* Editorial Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Narrative & Highlighted Paragraphs */}
          <div className="lg:col-span-7 space-y-6">
            
            {about.paragraphs.map((p, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border-3 border-[#121316] shadow-pop-sm text-base sm:text-lg font-bold leading-relaxed ${
                  idx === 0
                    ? 'bg-white text-[#121316]'
                    : idx === 1
                    ? 'bg-[#FFF9DB] text-[#121316]'
                    : 'bg-[#E1DCFF] text-[#121316]'
                }`}
              >
                {p}
              </div>
            ))}

            {/* Pull Quote Box */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FF6B6B] text-white border-4 border-[#121316] shadow-pop-lg rotate-[-1deg] space-y-3">
              <Quote className="w-10 h-10 text-yellow-300 opacity-80" />
              <p className="text-xl sm:text-2xl font-black font-display leading-tight tracking-tight">
                "{about.pullQuote}"
              </p>
              <span className="block text-xs font-mono font-bold text-yellow-200">
                — ATC HACKATHON BRIEFING • NIAT PUNE
              </span>
            </div>

          </div>

          {/* Right Column: Sticky Notes & Hand-drawn Annotations */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Sticky Note 1 */}
            <StickyNote color="yellow" rotation="rotate-2" className="p-6 text-lg sm:text-xl">
              <div className="space-y-2">
                <span className="text-2xl">💡</span>
                <p className="font-hand font-bold text-[#121316] leading-snug">
                  {about.stickyNote}
                </p>
              </div>
            </StickyNote>

            {/* Sticky Note 2: Designer Checklist */}
            <div className="p-6 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-3 rotate-[-1.5deg]">
              <h4 className="font-mono font-black text-xs uppercase tracking-wider text-[#6C5CE7] flex items-center gap-1.5">
                <span>📋</span> THE CURSED CHECKLIST:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-bold text-gray-800 font-mono">
                <li className="flex items-center gap-2 text-emerald-700">
                  <span>✓</span> Unreadable contrast ratios
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <span>✓</span> Running submit buttons
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <span>✓</span> 10-step audio volume puzzles
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <span>✓</span> Infinite spinning loading rings
                </li>
              </ul>
            </div>

            {/* Cute Mascot Bubble */}
            <div className="p-4 bg-[#D4F8E8] rounded-2xl border-2 border-[#121316] shadow-pop-sm flex items-center gap-3">
              <span className="text-3xl animate-bounce">🤖</span>
              <p className="text-xs font-hand text-gray-800 text-base leading-tight font-bold">
                "Our judges experienced maximum psychic damage and loved every second."
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
