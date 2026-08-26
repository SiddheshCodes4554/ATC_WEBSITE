import React from 'react';
import { Sparkles } from 'lucide-react';
import { EventStat } from '../../data/eventsData';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

interface EventAtAGlanceProps {
  stats: EventStat[];
}

export const EventAtAGlance: React.FC<EventAtAGlanceProps> = ({ stats }) => {
  return (
    <section className="relative bg-[#FAF7F0] py-16 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-8 right-8 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-3 border-[#121316] shadow-pop font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-[#121316]">
            <Sparkles className="w-4 h-4 text-[#FFD32A]" />
            EVENT AT A GLANCE
          </div>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            The Numbers Behind The Madness 📊
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map((st, i) => (
            <div
              key={st.label}
              className={`p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 text-center flex flex-col items-center justify-between space-y-2 ${
                i % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'
              } hover:rotate-0 hover:scale-105`}
            >
              {/* Illustrated Emoji Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9DB] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-2xl">
                {st.emoji}
              </div>

              {/* Value Number */}
              <div className="font-black text-2xl sm:text-3xl text-[#121316] tracking-tight font-display">
                {st.value}
              </div>

              {/* Label */}
              <p className="text-xs font-mono font-bold text-gray-600 leading-tight">
                {st.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
