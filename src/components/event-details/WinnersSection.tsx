import React from 'react';
import { Trophy, Award, Sparkles, Users, Code, Crown } from 'lucide-react';
import { WinnerProject } from '../../data/eventsData';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

interface WinnersSectionProps {
  winners: WinnerProject[];
}

export const WinnersSection: React.FC<WinnersSectionProps> = ({ winners }) => {
  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-12 right-12 opacity-50 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FFD32A" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Crown className="w-5 h-5 text-[#FFE600]" />
              THE BEST OF THE WORST
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FF6B6B" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            Winning Chaos & Standout Teams 🏆
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            Selected projects that broke UX rules with unmatched creativity:
          </p>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {winners.map((win, idx) => (
            <div
              key={win.title}
              className="group relative p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Trophy */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className={`px-3.5 py-1 text-white font-mono font-black text-xs rounded-full border-2 border-[#121316] shadow-pop-sm uppercase ${win.badgeColor}`}>
                    ★ {win.badge}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-500">
                    PODIUM #{idx + 1}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mb-2">
                  {win.title}
                </h3>

                {/* Team Members Pill */}
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6C5CE7] bg-[#EBE8FC] px-3 py-1 rounded-xl border border-[#121316]/20 mb-4 inline-flex">
                  <Users className="w-3.5 h-3.5" />
                  <span>Team: {win.team.join(', ')}</span>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed mb-6">
                  {win.desc}
                </p>
              </div>

              {/* Tech Tags */}
              <div className="pt-4 border-t-2 border-[#121316]/15 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {win.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-lg bg-[#FAF7F0] border border-[#121316] font-mono text-[11px] font-bold text-[#121316]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-hand font-bold text-emerald-700">
                  🎉 Certified Disaster
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
