import React, { useState } from 'react';
import { Sparkles, Rocket, Flag, Calendar, Cpu, Zap, ArrowRight } from 'lucide-react';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';

export const JourneyTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2); // Default to 2026

  const milestones = [
    {
      year: 'Nov 2025',
      title: 'Club Foundation',
      subtitle: 'Founded on November 14, 2025 at NIAT Pune with a shared vision to build a practical, no-fluff student tech community.',
      icon: <Flag className="w-5 h-5 text-[#FF793F]" />,
      badge: 'Genesis (14 Nov 2025)',
      color: 'bg-[#FFE8D6]',
      borderColor: 'border-[#FF793F]',
    },
    {
      year: 'Dec 2025 – Feb 2026',
      title: 'Inaugural Events Sprints',
      subtitle: 'Hosted the Worst UI/UX Hackathon, Git & GitHub Road to GSoC, and MST Blockchain Workshop for NIAT students.',
      icon: <Calendar className="w-5 h-5 text-[#2E86DE]" />,
      badge: 'First Sprints',
      color: 'bg-[#D6EEFF]',
      borderColor: 'border-[#2E86DE]',
    },
    {
      year: '2026',
      title: 'Innovation Lab 5.0 Setup',
      subtitle: 'Secured dedicated Lab 5.0 at NIAT campus, equipped with ROS robotic testbeds, AI compute stations, 3D printers, and SMD solder benches.',
      icon: <Cpu className="w-5 h-5 text-[#6C5CE7]" />,
      badge: 'Current Era',
      color: 'bg-[#E1DCFF]',
      borderColor: 'border-[#6C5CE7]',
    },
    {
      year: 'Beyond...',
      title: 'Bigger Ideas & Ventures',
      subtitle: 'Incubating student hardware builds, open-source projects, and autonomous robotics prototypes.',
      icon: <Zap className="w-5 h-5 text-[#10AC84]" />,
      badge: 'The Future',
      color: 'bg-[#D4F8E8]',
      borderColor: 'border-[#10AC84]',
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#FFD32A" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#FF793F]" />
              OUR JOURNEY
            </div>

            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#6C5CE7" />
            </div>
          </div>

          <p className="mt-4 text-base sm:text-xl text-gray-700 max-w-xl font-medium">
            From late-night hostel whiteboard sketches to an official NIAT tech force:
          </p>
        </div>

        {/* Timeline Visualization with Connecting Cable & Moving Rocket */}
        <div className="relative mb-14">
          
          {/* Connecting Track Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-3 bg-white border-3 border-[#121316] rounded-full -translate-y-1/2 z-0 shadow-pop-sm">
            {/* Progress Fill Bar */}
            <div 
              className="h-full bg-[#FFE600] rounded-full transition-all duration-500 border-r-2 border-[#121316]"
              style={{ width: `${((activeStep + 1) / milestones.length) * 100}%` }}
            />
          </div>

          {/* Milestone Step Buttons Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {milestones.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={item.year}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative p-5 rounded-3xl border-3 border-[#121316] cursor-pointer transition-all duration-200 ${
                    item.color
                  } ${
                    isActive ? 'shadow-pop-lg -translate-y-2 scale-105 ring-4 ring-[#121316]/20' : 'shadow-pop hover:shadow-pop-lg hover:-translate-y-1'
                  }`}
                >
                  {/* Rocket Indicator hovering on active item */}
                  {isActive && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF6B6B] text-white px-2.5 py-0.5 rounded-full border-2 border-[#121316] shadow-pop-sm font-mono text-[10px] font-black flex items-center gap-1 animate-bounce">
                      <Rocket className="w-3.5 h-3.5" /> Active Era
                    </div>
                  )}

                  {/* Year Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-black text-2xl sm:text-3xl text-[#121316]">
                      {item.year}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="space-y-1 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase bg-white/80 px-2 py-0.5 rounded border border-[#121316]/20 text-gray-700">
                      {item.badge}
                    </span>
                    <h3 className="font-black text-base sm:text-lg text-[#121316] leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Milestone Deep-Dive Showcase Box */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop-lg grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-[#6C5CE7] uppercase">
              CHAPTER {activeStep + 1} OF 4
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-[#121316]">
              {milestones[activeStep].year}: {milestones[activeStep].title}
            </h4>
          </div>

          <div className="lg:col-span-8 text-sm sm:text-base font-bold text-gray-700 leading-relaxed border-t-2 lg:border-t-0 lg:border-l-2 border-[#121316]/15 pt-4 lg:pt-0 lg:pl-6">
            <p>
              {milestones[activeStep].subtitle}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-[#6C5CE7]">
              <span>⚡ Click any milestone above to step through our history</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
