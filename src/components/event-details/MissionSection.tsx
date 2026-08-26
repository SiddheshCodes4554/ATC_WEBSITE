import React from 'react';
import { Users, Dices, Bomb, Code2, Trophy, ArrowRight, ArrowDown } from 'lucide-react';
import { MissionStage } from '../../data/eventsData';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';

interface MissionSectionProps {
  mission: MissionStage[];
}

export const MissionSection: React.FC<MissionSectionProps> = ({ mission }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <Users className="w-7 h-7 text-[#2E86DE]" />;
      case 'dices':
        return <Dices className="w-7 h-7 text-[#FF793F]" />;
      case 'bomb':
        return <Bomb className="w-7 h-7 text-[#FF6B6B]" />;
      case 'code':
        return <Code2 className="w-7 h-7 text-[#6C5CE7]" />;
      case 'trophy':
        return <Trophy className="w-7 h-7 text-[#FFE600]" />;
      default:
        return <Code2 className="w-7 h-7 text-[#10AC84]" />;
    }
  };

  const colors = [
    'bg-[#D6EEFF]',
    'bg-[#FFE8D6]',
    'bg-[#FFD9E8]',
    'bg-[#E1DCFF]',
    'bg-[#FFF3A8]',
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#2ED573" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <span>🎯</span>
              THE MISSION
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FF6B6B" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            How The 4-Hour Chaos Unfolded ⚡
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium">
            Five sequential stages of creative engineering:
          </p>
        </div>

        {/* 5-Stage Connected Path */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 items-stretch relative">
          {mission.map((stage, idx) => (
            <div key={stage.step} className="flex flex-col items-center relative group">
              
              {/* Card Body */}
              <div className={`w-full h-full p-6 rounded-[32px] border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col justify-between ${colors[idx % colors.length]} hover:-translate-y-2`}>
                
                <div>
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono font-black text-2xl sm:text-3xl text-[#121316] bg-white px-3 py-0.5 rounded-xl border-2 border-[#121316] shadow-pop-sm">
                      {stage.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center group-hover:rotate-12 transition-transform">
                      {getIcon(stage.iconName)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-[#121316] tracking-tight mb-2">
                    {stage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                    {stage.desc}
                  </p>
                </div>

                {/* Bottom Stage Tag */}
                <div className="mt-4 pt-3 border-t-2 border-[#121316]/20 text-[11px] font-mono font-extrabold text-gray-700">
                  PHASE {idx + 1} COMPLETE
                </div>
              </div>

              {/* Connecting Arrow for Desktop & Mobile */}
              {idx < mission.length - 1 && (
                <>
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20 text-[#121316] pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center font-bold">
                      →
                    </div>
                  </div>
                  <div className="lg:hidden my-2 text-[#121316]">
                    <ArrowDown className="w-6 h-6 animate-bounce" strokeWidth={3} />
                  </div>
                </>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
