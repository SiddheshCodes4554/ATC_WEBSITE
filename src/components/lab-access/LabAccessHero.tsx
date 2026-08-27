import React from 'react';
import { Sparkles, Calendar, Clock, Users, ShieldCheck, Wrench, ArrowDown } from 'lucide-react';
import { SparkleDoodle, SpiralScribble } from '../doodles/DoodleSvgs';

interface LabAccessHeroProps {
  totalSlotsToday: number;
  availableSlotsToday: number;
  onScrollToSchedule: () => void;
}

export const LabAccessHero: React.FC<LabAccessHeroProps> = ({
  totalSlotsToday,
  availableSlotsToday,
  onScrollToSchedule,
}) => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-14 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      {/* Decorative Floating Doodles */}
      <div className="absolute top-10 left-8 opacity-40 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
      </div>
      <div className="absolute top-12 right-12 opacity-35 pointer-events-none hidden md:block">
        <SpiralScribble className="w-16 h-16" color="#FF793F" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#6C5CE7]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-ping" />
            <span>PUBLIC LAB ACCESS • NIAT PUNE LAB 5.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.08]">
            ATC LAB{' '}
            <span className="relative inline-block px-5 py-1.5 bg-[#FFE600] text-[#121316] rounded-3xl border-4 border-[#121316] shadow-pop rotate-[-1.5deg] mt-1">
              ACCESS.
              <Sparkles className="w-7 h-7 text-[#FF4757] absolute -top-4 -right-4 animate-bounce" />
            </span>
          </h1>

          <p className="text-lg sm:text-2xl font-black text-[#FF793F] font-display max-w-2xl">
            "A shared space for building, experimenting, and creating."
          </p>

          <p className="text-sm sm:text-base font-bold text-gray-700 max-w-2xl leading-relaxed">
            Reserve dedicated workbench time, 3D printers, ROS robotics hardware, and SMD soldering stations. No login required — simply pick an open slot and tell us what you're building!
          </p>
        </div>

        {/* Quick Highlights Bento Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-2">
          
          <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border-2 border-[#121316] flex items-center justify-center text-[#2E7D32] font-black flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-500 uppercase">Live Availability</div>
              <div className="text-sm font-black text-[#121316]">
                {availableSlotsToday > 0 ? `${availableSlotsToday} Slots Open Today` : 'Check Upcoming Days'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9DB] border-2 border-[#121316] flex items-center justify-center text-[#121316] font-black flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-500 uppercase">Smart Waitlist</div>
              <div className="text-sm font-black text-[#121316]">Auto-promotes when spots free up</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E1F5FE] border-2 border-[#121316] flex items-center justify-center text-[#0288D1] font-black flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-gray-500 uppercase">Privacy First</div>
              <div className="text-sm font-black text-[#121316]">Phone numbers never shown publicly</div>
            </div>
          </div>

        </div>

        {/* Scroll down trigger */}
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={onScrollToSchedule}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <span>View Live Lab Schedule</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default LabAccessHero;
