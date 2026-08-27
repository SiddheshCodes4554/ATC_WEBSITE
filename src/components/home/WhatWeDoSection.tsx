import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';

// Illustrated SVG Icons for the 5 Pillars
const BrainIcon: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
    <path
      d="M20 30 C12 30 8 22 14 14 C20 6 30 8 30 16 C30 8 40 6 46 14 C52 22 48 30 40 30 C48 34 50 44 42 50 C34 56 30 48 30 42 C30 48 26 56 18 50 C10 44 12 34 20 30 Z"
      fill="#D4F8E8"
      stroke="#121316"
      strokeWidth="2.5"
    />
    <path d="M30 16 L30 42" stroke="#10AC84" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 22 Q26 26 22 32" stroke="#10AC84" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 22 Q34 26 38 32" stroke="#10AC84" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CodeWindowIcon: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
    <rect x="6" y="10" width="48" height="40" rx="10" fill="#D6EEFF" stroke="#121316" strokeWidth="2.5" />
    <line x1="6" y1="22" x2="54" y2="22" stroke="#121316" strokeWidth="2" />
    <circle cx="14" cy="16" r="2.5" fill="#FF6B6B" />
    <circle cx="21" cy="16" r="2.5" fill="#FFD32A" />
    <circle cx="28" cy="16" r="2.5" fill="#2ED573" />
    <path d="M18 34 L12 40 L18 46" stroke="#2E86DE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 34 L38 40 L32 46" stroke="#2E86DE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="26" y1="32" x2="24" y2="48" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TrophyIcon: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
    <path d="M16 12 H44 V28 C44 36 38 42 30 42 C22 42 16 36 16 28 V12 Z" fill="#FFE8D6" stroke="#121316" strokeWidth="2.5" />
    <path d="M16 16 H8 C8 24 14 26 16 26" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M44 16 H52 C52 24 46 26 44 26" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 42 V50" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
    <rect x="20" y="50" width="20" height="6" rx="3" fill="#FF793F" stroke="#121316" strokeWidth="2" />
    <circle cx="30" cy="24" r="5" fill="#FFD32A" stroke="#121316" strokeWidth="1.5" />
  </svg>
);

const PeopleIcon: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
    <circle cx="22" cy="18" r="8" fill="#FFD9E8" stroke="#121316" strokeWidth="2.5" />
    <circle cx="38" cy="18" r="8" fill="#FFD9E8" stroke="#121316" strokeWidth="2.5" />
    <path d="M10 46 C10 36 16 32 24 32 C28 32 32 34 34 38" stroke="#121316" strokeWidth="2.5" fill="#FFD9E8" strokeLinecap="round" />
    <path d="M50 46 C50 36 44 32 36 32 C32 32 28 34 26 38" stroke="#121316" strokeWidth="2.5" fill="#FFD9E8" strokeLinecap="round" />
    <path d="M26 36 L34 36" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const LightningIcon: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" className="w-12 h-12">
    <polygon
      points="32,6 14,32 28,32 24,54 46,26 32,26"
      fill="#E1DCFF"
      stroke="#121316"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="42" cy="12" r="3" fill="#FFE600" stroke="#121316" strokeWidth="1.5" />
    <circle cx="16" cy="48" r="2.5" fill="#6C5CE7" stroke="#121316" strokeWidth="1.5" />
  </svg>
);

export const WhatWeDoSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pillars = [
    {
      title: 'LEARN',
      desc: 'Workshops, sessions and tech talks.',
      icon: <BrainIcon />,
      bg: 'bg-[#D4F8E8]',
      badge: 'bg-[#10AC84] text-white',
      shape: 'rounded-[32px_12px_28px_16px]',
      hiddenDetail: '📚 Masterclasses every Wed 5PM',
      stat: '40+ Sessions',
      rotation: '-rotate-1',
    },
    {
      title: 'BUILD',
      desc: 'Real-world projects and prototypes.',
      icon: <CodeWindowIcon />,
      bg: 'bg-[#D6EEFF]',
      badge: 'bg-[#2E86DE] text-white',
      shape: 'rounded-[16px_32px_14px_30px]',
      hiddenDetail: '🚀 Production repos & code audits',
      stat: '18+ Repos',
      rotation: 'rotate-1',
    },
    {
      title: 'COMPETE',
      desc: 'Hackathons, tech fests and challenges.',
      icon: <TrophyIcon />,
      bg: 'bg-[#FFE8D6]',
      badge: 'bg-[#FF793F] text-white',
      shape: 'rounded-[28px_16px_32px_12px]',
      hiddenDetail: '🏆 ₹5L+ in hackathon podium wins',
      stat: 'National Stage',
      rotation: '-rotate-1',
    },
    {
      title: 'COLLABORATE',
      desc: 'Work together. Grow together.',
      icon: <PeopleIcon />,
      bg: 'bg-[#FFD9E8]',
      badge: 'bg-[#FF6B6B] text-white',
      shape: 'rounded-[14px_28px_18px_32px]',
      hiddenDetail: '🤝 Open source & cross-club squads',
      stat: 'Active Community',
      rotation: 'rotate-1',
    },
    {
      title: 'INNOVATE',
      desc: 'Experiment, fail, learn, repeat.',
      icon: <LightningIcon />,
      bg: 'bg-[#E1DCFF]',
      badge: 'bg-[#6C5CE7] text-white',
      shape: 'rounded-[30px_14px_26px_20px]',
      hiddenDetail: '⚡ Hardware hacking in Lab 5.0',
      stat: 'Lab 5.0 R&D',
      rotation: '-rotate-2',
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">

      {/* Decorative Doodles */}
      <div className="absolute top-10 right-12 opacity-50 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#FFD32A" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="absolute -left-14 -top-6 hidden sm:block">
              <LoopyArrow className="w-14 h-14 text-[#121316]" />
            </div>

            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#FFD32A]" />
              WHAT WE DO
            </div>

            <div className="absolute -right-12 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FF6B6B" />
            </div>
          </div>

          <p className="mt-4 text-base sm:text-xl text-gray-700 max-w-xl font-medium">
            Five continuous learning loops powering our tech community:
          </p>
        </div>

        {/* 5 Unique Non-Rectangular Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {pillars.map((pillar, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={pillar.title}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative p-6 border-3 border-[#121316] transition-all duration-200 cursor-pointer ${pillar.bg
                  } ${pillar.shape} ${pillar.rotation} ${isHovered ? 'shadow-pop-xl -translate-y-3 scale-105 z-20' : 'shadow-pop hover:shadow-pop-lg'
                  }`}
              >
                {/* Top Icon and Stat Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                    {pillar.icon}
                  </div>
                  <span className="font-mono text-[11px] font-bold text-gray-700 bg-white/80 px-2 py-0.5 rounded-md border border-[#121316]/20">
                    {pillar.stat}
                  </span>
                </div>

                {/* Pill Title */}
                <div className="mb-2">
                  <span className={`inline-block text-xs font-black uppercase px-3 py-1 rounded-full border border-[#121316] ${pillar.badge}`}>
                    {pillar.title}
                  </span>
                </div>

                {/* Subtitle description */}
                <p className="text-sm sm:text-base font-bold text-[#121316] leading-snug">
                  {pillar.desc}
                </p>

                {/* Hidden Easter Egg Detail revealed on hover */}
                <div className={`mt-4 pt-3 border-t-2 border-[#121316]/20 text-xs font-hand font-bold text-[#121316] transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-75 sm:opacity-0'
                  }`}>
                  <span className="flex items-center gap-1">
                    {pillar.hiddenDetail}
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
