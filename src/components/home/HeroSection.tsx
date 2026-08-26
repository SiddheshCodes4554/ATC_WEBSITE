import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Terminal, Lightbulb } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle, PlanetDoodle } from '../doodles/DoodleSvgs';
import confetti from 'canvas-confetti';

// Custom Hand-crafted Original Hero Vector Scene
const OriginalHeroIllustration: React.FC = () => {
  const [antennaWiggle, setAntennaWiggle] = useState(false);
  const [bulbLit, setBulbLit] = useState(true);

  const handleMascotClick = () => {
    setAntennaWiggle(true);
    confetti({
      particleCount: 35,
      spread: 60,
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#48DBFB'],
    });
    setTimeout(() => setAntennaWiggle(false), 1200);
  };

  return (
    <div className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none">
      
      {/* Dynamic Ambient Background Flow Shapes */}
      <svg className="absolute inset-0 w-full h-full -z-0 overflow-visible" viewBox="0 0 500 500" fill="none">
        {/* Soft Colorful Backdrop Blobs with hand-drawn black outlines */}
        <path
          d="M 120 80 C 220 20, 380 40, 440 140 C 500 240, 460 380, 360 440 C 260 500, 80 460, 40 340 C 0 220, 20 140, 120 80 Z"
          fill="#6C5CE7"
          fillOpacity="0.12"
          stroke="#121316"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        <path
          d="M 180 120 C 320 80, 420 160, 400 280 C 380 400, 220 440, 140 380 C 60 320, 40 160, 180 120 Z"
          fill="#FFE600"
          fillOpacity="0.15"
        />

        {/* Interconnecting Circuit & Wire Paths */}
        <path
          d="M 90 280 Q 140 340 220 320 T 360 350 T 430 260"
          stroke="#121316"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 140 140 Q 240 180 270 240 T 390 190"
          stroke="#FF6B6B"
          strokeWidth="3"
          strokeDasharray="4 4"
          fill="none"
        />
        {/* Connection node dots */}
        <circle cx="90" cy="280" r="5" fill="#FFD32A" stroke="#121316" strokeWidth="2.5" />
        <circle cx="220" cy="320" r="6" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" />
        <circle cx="430" cy="260" r="5" fill="#48DBFB" stroke="#121316" strokeWidth="2.5" />
      </svg>

      {/* Floating Saturn Planet Doodle (Top Right) */}
      <div className="absolute top-4 right-4 sm:right-8 animate-float-slow">
        <PlanetDoodle className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md" />
      </div>

      {/* Interactive Glowing Light Bulb / Idea Symbol (Top Left) */}
      <div 
        onClick={() => setBulbLit(!bulbLit)}
        className="absolute top-6 left-6 sm:left-10 p-3 rounded-2xl bg-[#FFF385] border-3 border-[#121316] shadow-pop transition-transform duration-200 hover:scale-110 hover:-rotate-6 cursor-pointer animate-float-fast"
        title="Click to toggle idea spark!"
      >
        <Lightbulb className={`w-8 h-8 ${bulbLit ? 'text-[#121316] fill-[#FFE600] animate-pulse' : 'text-gray-400'}`} />
        <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 bg-[#FF6B6B] text-white text-[9px] font-black rounded-md border border-[#121316]">
          IDEA
        </div>
      </div>

      {/* Floating Code Window Widget (Bottom Left) */}
      <div className="absolute bottom-6 left-2 sm:left-4 z-20 bg-[#121316] text-[#48DBFB] p-3.5 sm:p-4 rounded-2xl border-3 border-[#121316] shadow-pop-lg max-w-[190px] sm:max-w-[210px] animate-float-slow">
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/20">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573]" />
          </div>
          <span className="text-[10px] font-mono text-gray-400">future.ts</span>
        </div>
        <p className="text-[11px] font-mono leading-tight text-purple-200">
          <span className="text-[#FF6B6B]">const</span> <span className="text-[#FFE600]">atc</span> = <span className="text-[#48DBFB]">build</span>();<br />
          <span className="text-emerald-400">atc.innovate</span>();
        </p>
      </div>

      {/* Small Robot Mascot with moving antenna (Bottom Right) */}
      <div 
        onClick={handleMascotClick}
        className={`absolute bottom-2 right-4 sm:right-8 z-20 cursor-pointer group transition-transform hover:scale-110 ${antennaWiggle ? 'animate-wiggle' : ''}`}
        title="Click me!"
      >
        <div className="relative p-3 rounded-2xl bg-[#A29BFE] border-3 border-[#121316] shadow-pop flex flex-col items-center">
          {/* Antenna */}
          <div className="relative flex flex-col items-center -mt-6 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#FFE600] border-2 border-[#121316] animate-ping" />
            <span className="w-1 h-3 bg-[#121316]" />
          </div>
          {/* Robot Head */}
          <div className="w-12 h-9 bg-[#6C5CE7] rounded-lg border-2 border-[#121316] flex items-center justify-center gap-1.5 px-1">
            <span className="w-2 h-2 rounded-full bg-[#48DBFB] animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-[#48DBFB] animate-pulse" />
          </div>
          <span className="mt-1 text-[9px] font-mono font-bold text-[#121316]">BOT-5.0</span>
        </div>
      </div>

      {/* Central Hero Character: Student Builder at Laptop */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 sm:w-80 h-auto drop-shadow-xl">
          
          {/* Student Body / Hoodie */}
          <path
            d="M 80 230 C 80 180, 110 160, 140 160 C 170 160, 200 180, 200 230 Z"
            fill="#FF793F"
            stroke="#121316"
            strokeWidth="3.5"
          />
          {/* Hoodie strings */}
          <path d="M 125 180 L 125 205" stroke="#FFE600" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 155 180 L 155 205" stroke="#FFE600" strokeWidth="2.5" strokeLinecap="round" />

          {/* Student Head */}
          <circle cx="140" cy="115" r="38" fill="#F8C291" stroke="#121316" strokeWidth="3.5" />
          
          {/* Spiky Creative Hair */}
          <path
            d="M 102 110 C 95 80, 115 55, 140 55 C 165 55, 185 80, 178 110 C 170 100, 160 95, 145 95 C 130 95, 115 100, 102 110 Z"
            fill="#2E86DE"
            stroke="#121316"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Glasses */}
          <rect x="112" y="105" width="22" height="16" rx="4" fill="#FFFFFF" stroke="#121316" strokeWidth="2.5" />
          <rect x="146" y="105" width="22" height="16" rx="4" fill="#FFFFFF" stroke="#121316" strokeWidth="2.5" />
          <line x1="134" y1="112" x2="146" y2="112" stroke="#121316" strokeWidth="2.5" />
          
          {/* Eyes & Smile */}
          <circle cx="123" cy="113" r="2.5" fill="#121316" />
          <circle cx="157" cy="113" r="2.5" fill="#121316" />
          <path d="M 132 130 Q 140 138 148 130" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Hands Typing on Laptop */}
          <circle cx="98" cy="210" r="10" fill="#F8C291" stroke="#121316" strokeWidth="3" />
          <circle cx="182" cy="210" r="10" fill="#F8C291" stroke="#121316" strokeWidth="3" />

          {/* Laptop Base & Screen */}
          <polygon points="65,240 215,240 200,215 80,215" fill="#2D3436" stroke="#121316" strokeWidth="3.5" />
          {/* Glowing Laptop Screen */}
          <polygon points="80,215 200,215 190,150 90,150" fill="#48DBFB" stroke="#121316" strokeWidth="3.5" />
          
          {/* ATC Logo on Laptop screen glow */}
          <rect x="118" y="168" width="44" height="24" rx="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
          <text x="140" y="184" fontFamily="sans-serif" fontWeight="900" fontSize="11" textAnchor="middle" fill="#121316">
            ATC 🚀
          </text>
        </svg>

        {/* Workbench Base Table line */}
        <div className="w-64 sm:w-72 h-3.5 bg-[#FFE600] rounded-full border-3 border-[#121316] shadow-pop-sm -mt-2" />
      </div>

    </div>
  );
};

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden paper-pattern border-b-4 border-[#121316]">
      
      {/* Decorative Twinkling Sparkles */}
      <div className="absolute top-12 left-8 opacity-60 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-8 h-8" color="#6C5CE7" />
      </div>
      <div className="absolute top-20 right-1/3 opacity-50 pointer-events-none hidden sm:block animate-float-slow">
        <SparkleDoodle className="w-6 h-6" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Strong Editorial Typography */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Club Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm">
              <div className="w-6 h-6 rounded-lg bg-[#8B1E22] p-0.5 border border-[#121316] flex items-center justify-center overflow-hidden">
                <img
                  src="/atc-shield-logo.png"
                  alt="ATC Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs sm:text-sm font-mono font-black uppercase text-[#121316] tracking-wider">
                ADVANCED TECH CLUB • NIAT PUNE
              </span>
            </div>

            {/* Main Editorial Heading */}
            <div className="space-y-4">
              
              {/* Part 1: THINK. CODE. BUILD. */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#121316]">
                <span>THINK.</span>
                <span>CODE.</span>
                <span className="relative inline-block px-3 py-0.5 bg-[#FFD32A] rounded-xl border-3 border-[#121316] shadow-pop-sm rotate-[-2deg]">
                  BUILD.
                </span>
              </div>

              {/* Part 2: WE TURN IDEAS INTO IMPACT */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04] text-[#121316]">
                WE TURN{' '}
                <span className="relative inline-block text-[#6C5CE7] bg-[#EBE8FC] px-3 py-0.5 rounded-2xl border-3 border-[#121316] shadow-pop-sm rotate-1">
                  IDEAS
                </span>{' '}
                INTO{' '}
                <span className="relative inline-block text-[#FF6B6B]">
                  IMPACT.
                  <svg className="absolute -bottom-3 left-0 w-full h-4 overflow-visible" viewBox="0 0 200 16" fill="none">
                    <path d="M 5 10 Q 100 0 195 12" stroke="#FFD32A" strokeWidth="6" strokeLinecap="round" />
                    <path d="M 12 13 Q 110 5 185 11" stroke="#121316" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed max-w-2xl">
              Advanced Tech Club, NIAT Pune — a community of curious minds building, breaking and exploring technology together.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <PlayfulButton
                to="/events"
                variant="primary"
                size="lg"
                withConfetti
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Explore ATC ↗
              </PlayfulButton>

              <PlayfulButton
                to="/join"
                variant="secondary"
                size="lg"
              >
                Join the Community
              </PlayfulButton>
            </div>

            {/* Live Student Stats Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono font-bold text-gray-600">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border-2 border-[#121316] shadow-pop-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                400+ Active Builders
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border-2 border-[#121316] shadow-pop-sm">
                ⚡ 18+ Projects Shipped
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border-2 border-[#121316] shadow-pop-sm">
                📍 Lab 502
              </span>
            </div>

          </div>

          {/* Right Column: Original Illustrated Hero Scene */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <OriginalHeroIllustration />
          </div>

        </div>
      </div>
    </section>
  );
};
