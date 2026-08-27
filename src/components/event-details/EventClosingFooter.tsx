import React from 'react';
import { ArrowUpRight, Sparkles, Rocket, Calendar, Code2 } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle, RetroRobotMascot } from '../doodles/DoodleSvgs';

export const EventClosingFooter: React.FC = () => {
  return (
    <section className="relative bg-[#FFE600] py-20 sm:py-24 border-b-4 border-[#121316] overflow-hidden select-none">
      
      {/* Decorative Doodles */}
      <div className="absolute top-8 left-8 opacity-40 pointer-events-none animate-wiggle">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>
      <div className="absolute bottom-8 right-12 opacity-50 pointer-events-none animate-float-slow">
        <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="p-8 sm:p-14 rounded-[44px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-xl grid lg:grid-cols-12 gap-8 items-center paper-pattern">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <span className="text-xs font-mono font-black text-[#6C5CE7] uppercase tracking-wider bg-[#EBE8FC] px-3.5 py-1 rounded-full border-2 border-[#121316]">
              ● THE BUILD CYCLE CONTINUES
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-tight">
              ONE EVENT DOWN.<br />
              <span className="text-[#FF6B6B]">MANY MORE IDEAS</span><br />
              <span className="text-[#121316]">TO BUILD.</span>
            </h2>

            <p className="text-base sm:text-lg text-gray-800 font-bold leading-relaxed max-w-xl">
              Don't miss the next campus sprint. Explore upcoming workshops, view student prototypes, or join the core builder squad today.
            </p>

            {/* Quick Navigation CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <PlayfulButton
                to="/events"
                variant="primary"
                size="md"
                icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
              >
                Explore More Events
              </PlayfulButton>

              <PlayfulButton
                to="/projects"
                variant="secondary"
                size="md"
                icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
              >
                View Our Projects
              </PlayfulButton>

              <PlayfulButton
                to="/join"
                variant="dark"
                size="md"
                withConfetti
                icon={<Rocket className="w-4 h-4 text-yellow-300" />}
              >
                Join ATC
              </PlayfulButton>
            </div>
          </div>

          {/* Right Mascot Column */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="p-6 rounded-full bg-[#FFE600] border-4 border-[#121316] shadow-pop-lg animate-wiggle">
              <RetroRobotMascot className="w-28 h-auto" />
            </div>
            <p className="mt-3 font-hand text-base text-[#121316] font-bold text-center">
              "See you at the next sprint! 🚀"
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
