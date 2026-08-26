import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { LearningItem } from '../../data/eventsData';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

interface LearningsSectionProps {
  learnings: LearningItem[];
}

export const LearningsSection: React.FC<LearningsSectionProps> = ({ learnings }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#10AC84" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#10AC84]" />
              MORE THAN JUST CHAOS
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FF6B6B" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            What Builders Actually Learned 🎓
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            Satirical hacking with serious, lasting engineering takeaways:
          </p>
        </div>

        {/* Interactive Learnings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {learnings.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={item.title}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`group relative p-8 rounded-[36px] border-4 border-[#121316] transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  item.color
                } ${isHovered ? 'shadow-pop-xl -translate-y-2 scale-[1.02]' : 'shadow-pop-lg hover:shadow-pop-xl'}`}
              >
                <div>
                  {/* Top Row: Emoji & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                      {item.emoji}
                    </div>
                    <span className="px-3 py-1 bg-white text-[#121316] rounded-full border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-black text-[#6C5CE7] mb-3">
                    {item.tagline}
                  </p>

                  {/* Narrative description */}
                  <p className="text-sm sm:text-base font-bold text-gray-800 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="mt-6 pt-4 border-t-2 border-[#121316]/20 flex items-center justify-between text-xs font-mono font-bold text-gray-700">
                  <span className="font-hand text-base text-[#121316]">✨ Practical takeaway</span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Skill Unlocked ✓
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
