import React, { useState } from 'react';
import { Sparkles, BookOpen, Wrench, Share2, Sprout, ArrowRight } from 'lucide-react';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

// Animated Vector Icons for the 4 Pillars
const LearnAnimatedIcon: React.FC<{ isHovered: boolean }> = ({ isHovered }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 sm:w-20 sm:h-20">
    {/* Open Book */}
    <rect x="10" y="25" width="28" height="38" rx="4" fill="#FFFFFF" stroke="#121316" strokeWidth="3" />
    <rect x="42" y="25" width="28" height="38" rx="4" fill="#FFFFFF" stroke="#121316" strokeWidth="3" />
    {/* Binding */}
    <line x1="40" y1="20" x2="40" y2="65" stroke="#10AC84" strokeWidth="4" strokeLinecap="round" />
    {/* Page Lines */}
    <line x1="16" y1="36" x2="32" y2="36" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="44" x2="30" y2="44" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="52" x2="28" y2="52" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
    {/* Right Page Lines */}
    <line x1="48" y1="36" x2="64" y2="36" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
    <line x1="48" y1="44" x2="62" y2="44" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
    {/* Floating Sparkle on Learn */}
    <circle cx="58" cy="18" r="5" fill="#FFE600" stroke="#121316" strokeWidth="2" className={isHovered ? 'animate-ping' : ''} />
  </svg>
);

const BuildAnimatedIcon: React.FC<{ isHovered: boolean }> = ({ isHovered }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 sm:w-20 sm:h-20">
    {/* Crossed Wrench & Screwdriver */}
    <g className={`transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} style={{ transformOrigin: '40px 40px' }}>
      {/* Screwdriver */}
      <rect x="36" y="15" width="8" height="35" rx="2" fill="#54A0FF" stroke="#121316" strokeWidth="2.5" transform="rotate(45 40 32)" />
      <polygon points="62,18 68,24 60,32 54,26" fill="#A29BFE" stroke="#121316" strokeWidth="2" />
      {/* Wrench */}
      <rect x="36" y="15" width="8" height="35" rx="2" fill="#FFE600" stroke="#121316" strokeWidth="2.5" transform="rotate(-45 40 32)" />
      <circle cx="20" cy="20" r="8" fill="#FF7675" stroke="#121316" strokeWidth="2.5" />
      <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
    </g>
    {/* Gear Base */}
    <circle cx="40" cy="58" r="12" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" className={isHovered ? 'animate-spin-slow' : ''} />
    <circle cx="40" cy="58" r="5" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
  </svg>
);

const ShareAnimatedIcon: React.FC<{ isHovered: boolean }> = ({ isHovered }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 sm:w-20 sm:h-20">
    {/* Connecting Node Graph */}
    <line x1="40" y1="20" x2="20" y2="55" stroke="#121316" strokeWidth="3" />
    <line x1="40" y1="20" x2="60" y2="55" stroke="#121316" strokeWidth="3" />
    <line x1="20" y1="55" x2="60" y2="55" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="3 3" />
    {/* Nodes */}
    <circle cx="40" cy="20" r="10" fill="#FF6B6B" stroke="#121316" strokeWidth="3" className={isHovered ? 'animate-pulse' : ''} />
    <circle cx="20" cy="55" r="9" fill="#48DBFB" stroke="#121316" strokeWidth="3" />
    <circle cx="60" cy="55" r="9" fill="#FFE600" stroke="#121316" strokeWidth="3" />
    {/* Center signal pulse */}
    <circle cx="40" cy="42" r="4" fill="#6C5CE7" className={isHovered ? 'animate-ping' : ''} />
  </svg>
);

const GrowAnimatedIcon: React.FC<{ isHovered: boolean }> = ({ isHovered }) => (
  <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 sm:w-20 sm:h-20">
    {/* Plant Pot */}
    <polygon points="26,50 54,50 50,70 30,70" fill="#E67E22" stroke="#121316" strokeWidth="3" />
    <rect x="22" y="46" width="36" height="6" rx="2" fill="#D35400" stroke="#121316" strokeWidth="2.5" />
    {/* Stem */}
    <path d="M40 46 Q40 28 40 20" stroke="#10AC84" strokeWidth="4" strokeLinecap="round" />
    {/* Leaves with animated tilt on hover */}
    <g className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} style={{ transformOrigin: '40px 46px' }}>
      <path d="M40 32 C30 25 22 30 25 38 C32 38 38 36 40 32 Z" fill="#2ED573" stroke="#121316" strokeWidth="2.5" />
      <path d="M40 24 C50 18 58 22 55 30 C48 30 42 28 40 24 Z" fill="#2ED573" stroke="#121316" strokeWidth="2.5" />
      <circle cx="40" cy="16" r="6" fill="#FFE600" stroke="#121316" strokeWidth="2" className={isHovered ? 'animate-bounce' : ''} />
    </g>
  </svg>
);

export const PillarsSection: React.FC = () => {
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  const pillars = [
    {
      id: 0,
      title: 'LEARN',
      tagline: 'New skills. New tools.',
      desc: 'Workshops, hackathon bootcamps, architecture breakdowns, and direct mentorship from experienced student leaders.',
      bg: 'bg-[#D4F8E8]',
      badgeBg: 'bg-[#10AC84]',
      icon: (hovered: boolean) => <LearnAnimatedIcon isHovered={hovered} />,
      tag: '01 • KNOWLEDGE',
    },
    {
      id: 1,
      title: 'BUILD',
      tagline: 'Create. Test. Iterate.',
      desc: 'Turning raw ideas into production code and physical hardware. We build autonomous robots, AI apps, and campus IoT networks.',
      bg: 'bg-[#E1DCFF]',
      badgeBg: 'bg-[#6C5CE7]',
      icon: (hovered: boolean) => <BuildAnimatedIcon isHovered={hovered} />,
      tag: '02 • EXECUTION',
    },
    {
      id: 2,
      title: 'SHARE',
      tagline: 'Open source. Open minds.',
      desc: 'Everything we craft is open source. We contribute to GSoC, publish research papers, and document tutorials for all students.',
      bg: 'bg-[#FFD9E8]',
      badgeBg: 'bg-[#FF6B6B]',
      icon: (hovered: boolean) => <ShareAnimatedIcon isHovered={hovered} />,
      tag: '03 • COMMUNITY',
    },
    {
      id: 3,
      title: 'GROW',
      tagline: 'Students today. Innovators tomorrow.',
      desc: 'Developing technical leadership, collaborative instincts, and real engineering confidence that lasts far beyond graduation.',
      bg: 'bg-[#FFF3A8]',
      badgeBg: 'bg-[#E5B800]',
      icon: (hovered: boolean) => <GrowAnimatedIcon isHovered={hovered} />,
      tag: '04 • IMPACT',
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-12 right-12 opacity-50 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
              OUR PILLARS
            </div>

            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#2ED573" />
            </div>
          </div>

          <p className="mt-4 text-base sm:text-xl text-gray-700 max-w-xl font-medium">
            Four core values guiding every sprint, event, and experiment at ATC:
          </p>
        </div>

        {/* 4 Large Colorful Interactive Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {pillars.map((pillar) => {
            const isHovered = hoveredPillar === pillar.id;
            return (
              <div
                key={pillar.title}
                onMouseEnter={() => setHoveredPillar(pillar.id)}
                onMouseLeave={() => setHoveredPillar(null)}
                className={`group relative p-8 sm:p-10 rounded-[36px] border-4 border-[#121316] transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  pillar.bg
                } ${
                  isHovered ? 'shadow-pop-xl -translate-y-2 scale-[1.02]' : 'shadow-pop-lg hover:shadow-pop-xl'
                }`}
              >
                {/* Top Row: Category tag and Illustrated Animated Icon */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold text-gray-700 bg-white px-3 py-1 rounded-full border-2 border-[#121316] shadow-pop-sm">
                      {pillar.tag}
                    </span>
                    <h3 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight">
                      {pillar.title}
                    </h3>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border-3 border-[#121316] shadow-pop-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
                    {pillar.icon(isHovered)}
                  </div>
                </div>

                {/* Tagline & Detailed Narrative */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-lg sm:text-xl font-black text-[#121316] font-display">
                    {pillar.tagline}
                  </h4>
                  <p className="text-sm sm:text-base font-bold text-gray-800 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom Interactive Indicator */}
                <div className="pt-4 border-t-2 border-[#121316]/20 flex items-center justify-between text-xs font-mono font-bold text-gray-700">
                  <span className="flex items-center gap-1.5 font-hand text-base text-[#121316]">
                    ✨ Core community belief
                  </span>
                  <span className="group-hover:translate-x-1.5 transition-transform flex items-center gap-1 font-bold">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
