import React from 'react';
import { ArrowUpRight, Sparkles, Heart, Rocket } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle, RetroRobotMascot } from '../doodles/DoodleSvgs';

export const JoinSquadCTA: React.FC = () => {
  return (
    <section className="relative bg-[#6C5CE7] py-20 sm:py-24 border-b-4 border-[#121316] overflow-hidden select-none">
      
      {/* Decorative Doodles */}
      <div className="absolute top-8 left-8 opacity-40 pointer-events-none animate-wiggle">
        <SparkleDoodle className="w-12 h-12" color="#FFE600" />
      </div>
      <div className="absolute bottom-8 right-12 opacity-50 pointer-events-none animate-float-slow">
        <SparkleDoodle className="w-14 h-14" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="p-8 sm:p-14 rounded-[44px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-xl grid lg:grid-cols-12 gap-8 items-center paper-pattern">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <span className="text-xs font-mono font-black text-[#FF793F] uppercase tracking-wider bg-[#FFF3E0] px-3.5 py-1 rounded-full border-2 border-[#121316]">
              ● RECRUITMENT OPEN • COHORT 2026
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-tight">
              WANT TO SHAPE THE<br />
              <span className="text-[#6C5CE7]">FUTURE WITH US?</span><br />
              <span className="text-[#121316]">JOIN THE SQUAD. →</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-800 font-bold leading-relaxed max-w-xl">
              Whether you write code, design visuals, shoot cinematic reels, run logistics, or love managing events—there's a spot for you in ATC NIAT Pune.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <PlayfulButton
                to="/join"
                variant="primary"
                size="lg"
                withConfetti
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Apply to Join ATC ↗
              </PlayfulButton>

              <PlayfulButton
                to="/events"
                variant="secondary"
                size="lg"
                icon={<Sparkles className="w-5 h-5 text-[#121316]" />}
              >
                Attend Next Event ↗
              </PlayfulButton>
            </div>
          </div>

          {/* Right Mascot Column */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="p-6 rounded-full bg-[#FFE600] border-4 border-[#121316] shadow-pop-lg animate-wiggle">
              <RetroRobotMascot className="w-28 h-auto" />
            </div>
            <p className="mt-3 font-hand text-base text-[#121316] font-bold text-center">
              "We're saving a seat for you at Lab 502! 🚀"
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
