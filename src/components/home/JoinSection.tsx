import React from 'react';
import { ArrowUpRight, Sparkles, Heart, Rocket, Users, ShieldCheck } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle, RetroRobotMascot } from '../doodles/DoodleSvgs';

export const JoinSection: React.FC = () => {
  return (
    <section className="relative bg-[#FFE600] py-20 sm:py-24 border-b-4 border-[#121316] overflow-hidden select-none">
      
      {/* Decorative Background Doodles */}
      <div className="absolute top-8 left-8 opacity-40 pointer-events-none animate-wiggle">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>
      <div className="absolute bottom-8 right-12 opacity-50 pointer-events-none animate-float-slow">
        <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main High-Energy CTA Box */}
        <div className="relative p-8 sm:p-14 lg:p-16 rounded-[40px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-xl grid lg:grid-cols-12 gap-10 items-center overflow-hidden paper-pattern">
          
          {/* Top Floating Badge */}
          <div className="absolute -top-3 right-8 sm:right-16 rotate-6 bg-[#FF6B6B] text-white px-4 py-1.5 rounded-full border-3 border-[#121316] font-mono font-black text-xs sm:text-sm shadow-pop-sm flex items-center gap-1.5">
            <span>🔥</span> COHORT 2026 NOW OPEN
          </div>

          {/* Left Column: High-Energy Copy & CTA */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-mono font-black text-[#6C5CE7] uppercase tracking-wider bg-[#EBE8FC] px-3.5 py-1 rounded-full border-2 border-[#121316]">
                NIAT PUNE STUDENT RECRUITMENT
              </span>

              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.05]">
                DON’T JUST WATCH<br />
                <span className="text-[#FF6B6B]">WHAT WE BUILD.</span><br />
                <span className="relative inline-block text-[#121316] bg-[#FFE600] px-3 py-0.5 rounded-2xl border-3 border-[#121316] shadow-pop-sm mt-1">
                  BUILD WITH US.
                </span>
              </h2>
            </div>

            <p className="text-lg sm:text-xl text-gray-800 font-bold leading-relaxed max-w-2xl">
              Be part of a community where ideas turn into experiments, projects and real experiences. Open to all branches and years at NIAT Pune.
            </p>

            {/* CTA Button: Join ATC Today ↗ */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <PlayfulButton
                to="/join"
                variant="primary"
                size="lg"
                withConfetti
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Join ATC Today ↗
              </PlayfulButton>

              <PlayfulButton
                to="/about"
                variant="secondary"
                size="lg"
              >
                Read Our Story
              </PlayfulButton>
            </div>

            {/* Perks List */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-bold text-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>24/7 Access to Lab 502</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Hardware & GPU Compute</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Mentorship & Hackathon Teams</span>
              </div>
            </div>

          </div>

          {/* Right Column: Expressive Mascot & Cheering Graphics */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            
            {/* Robot Mascot in Energy Bubble */}
            <div className="relative p-8 rounded-full bg-[#FFE600] border-4 border-[#121316] shadow-pop-lg animate-wiggle">
              <RetroRobotMascot className="w-28 sm:w-36 h-auto drop-shadow-md" />
              
              <div className="absolute -top-3 -left-3 bg-[#6C5CE7] text-white p-2 rounded-xl border-2 border-[#121316] shadow-pop-sm font-hand font-bold text-sm -rotate-12">
                <span>⚡ LET'S GO!</span>
              </div>

              <div className="absolute -bottom-2 -right-2 bg-white text-[#121316] p-2 rounded-xl border-2 border-[#121316] shadow-pop-sm font-hand font-bold text-sm rotate-12">
                <span>🤖 100% Student Run</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
