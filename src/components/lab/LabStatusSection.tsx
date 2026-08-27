import React from 'react';
import { Sparkles, ArrowUpRight, CheckCircle2, Hammer, Rocket, Wrench, Heart } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle, RetroRobotMascot } from '../doodles/DoodleSvgs';

export const LabStatusSection: React.FC = () => {
  const milestones = [
    { label: 'Space Allocated', percent: '25%', done: true },
    { label: 'Power & ESD Benches', percent: '50%', done: true },
    { label: '3D Printer & Tool Calibrated', percent: '72%', done: true, current: true },
    { label: 'Official Grand Opening', percent: '100%', done: false },
  ];

  return (
    <section id="lab-status" className="relative bg-[#FFE600] py-20 sm:py-28 border-b-4 border-[#121316] overflow-hidden select-none">
      
      {/* Background Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-40 pointer-events-none animate-wiggle">
        <SparkleDoodle className="w-14 h-14" color="#FF6B6B" />
      </div>
      <div className="absolute top-16 right-16 opacity-40 pointer-events-none animate-float-slow">
        <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Status Container */}
        <div className="p-8 sm:p-14 lg:p-16 rounded-[44px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-xl paper-pattern relative overflow-hidden">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#FF4757] text-white font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                UNDER DEVELOPMENT
              </span>
              <span className="font-mono text-xs font-black text-[#121316]">
                NIAT LAB 5.0 SPRINT
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-600">
              <span>TARGET LAUNCH:</span>
              <span className="text-[#6C5CE7] font-black">MAY 2026</span>
            </div>
          </div>

          {/* Section Heading & Numbers */}
          <div className="grid lg:grid-cols-12 gap-8 items-center mb-10">
            
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-4xl sm:text-6xl font-black text-[#121316] tracking-tight leading-tight">
                LAB STATUS:<br />
                <span className="text-[#6C5CE7]">72% COMPLETE.</span>
              </h2>

              <p className="text-xl sm:text-2xl font-black text-[#121316] font-display">
                "Built by students. For students."
              </p>

              <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed max-w-xl">
                Lab 5.0 is being assembled piece-by-piece by ATC members. Soldering stations are wired, 3D printers are calibrated, and the ROS 2 autonomous testing track is being marked out.
              </p>
            </div>

            {/* Big 72% Metric Badge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-[#FFE600] border-4 border-[#121316] shadow-pop-lg flex flex-col items-center justify-center text-center rotate-[-3deg] hover:rotate-0 transition-transform">
                <span className="text-5xl sm:text-6xl font-black text-[#121316] tracking-tight">
                  72%
                </span>
                <span className="text-xs font-mono font-black uppercase text-[#121316] tracking-wider">
                  CALIBRATED
                </span>
              </div>
            </div>

          </div>

          {/* Playful Animated Progress Bar */}
          <div className="space-y-4 mb-12">
            <div className="w-full bg-white h-8 sm:h-10 rounded-full border-3 border-[#121316] shadow-pop-sm p-1 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6B6B] via-[#FFE600] to-[#2ED573] border-r-2 border-[#121316] transition-all duration-1000 relative overflow-hidden"
                style={{ width: '72%' }}
              >
                {/* Diagonal striping */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] [background-size:24px_24px] animate-pulse" />
              </div>
            </div>

            {/* Milestones Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              {milestones.map((m) => (
                <div
                  key={m.label}
                  className={`p-3 rounded-2xl border-2 border-[#121316] flex flex-col justify-between ${
                    m.current
                      ? 'bg-[#FFE600] font-black shadow-pop-sm'
                      : m.done
                      ? 'bg-white text-gray-800 font-bold'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <span className="text-[10px] text-gray-500 block mb-1">
                    {m.percent} {m.done ? '✓' : '○'}
                  </span>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Callout & CTA */}
          <div className="pt-6 border-t-2 border-[#121316]/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
              <Heart className="w-4 h-4 text-[#FF4757] fill-[#FF4757]" />
              <span>100% student-managed & funded by NIAT Innovation Cell</span>
            </div>

            <PlayfulButton
              to="/join"
              variant="dark"
              size="lg"
              withConfetti
              icon={<ArrowUpRight className="w-5 h-5 text-yellow-300 stroke-[3]" />}
            >
              Step Inside the Future ↗
            </PlayfulButton>
          </div>

        </div>

        {/* ========================================================= */}
        {/* LARGE ILLUSTRATED ROBOT PARTIALLY ENTERING NEXT SECTION */}
        {/* ========================================================= */}
        <div className="relative mt-8 -mb-28 sm:-mb-36 flex flex-col items-center z-20 pointer-events-none">
          
          {/* Playful Speech Bubble */}
          <div className="mb-4 px-6 py-2.5 bg-white rounded-full border-3 border-[#121316] shadow-pop text-sm font-hand font-bold text-[#121316] animate-bounce pointer-events-auto">
            "The future is made with solder & code. See you at Lab 5.0! 🤖⚡"
          </div>

          {/* Peeking Robot Mascot Vector */}
          <div className="w-48 sm:w-64 h-auto pointer-events-auto hover:scale-105 transition-transform">
            <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
              {/* Antenna */}
              <line x1="100" y1="20" x2="100" y2="45" stroke="#121316" strokeWidth="4" strokeLinecap="round" />
              <circle cx="100" cy="18" r="7" fill="#FF4757" stroke="#121316" strokeWidth="2.5" className="animate-ping" />

              {/* Head Shell */}
              <rect x="30" y="45" width="140" height="95" rx="24" fill="#6C5CE7" stroke="#121316" strokeWidth="4" />
              {/* Ears */}
              <rect x="18" y="70" width="14" height="30" rx="4" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
              <rect x="168" y="70" width="14" height="30" rx="4" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />

              {/* Face Visor Screen */}
              <rect x="45" y="60" width="110" height="55" rx="14" fill="#121316" stroke="#121316" strokeWidth="2" />
              
              {/* Glowing Cyan Goggle Eyes */}
              <circle cx="75" cy="88" r="14" fill="#00D2D3" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="125" cy="88" r="14" fill="#00D2D3" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="78" cy="85" r="4" fill="#FFFFFF" />
              <circle cx="128" cy="85" r="4" fill="#FFFFFF" />

              {/* Cheerful Mouth */}
              <path d="M 90 102 Q 100 108 110 102" stroke="#FFE600" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Cheeks */}
              <circle cx="56" cy="98" r="5" fill="#FF7675" />
              <circle cx="144" cy="98" r="5" fill="#FF7675" />

              {/* Partially Visible Hands waving on top of border */}
              <circle cx="35" cy="135" r="16" fill="#FFE600" stroke="#121316" strokeWidth="3" />
              <circle cx="165" cy="135" r="16" fill="#FFE600" stroke="#121316" strokeWidth="3" />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
};
