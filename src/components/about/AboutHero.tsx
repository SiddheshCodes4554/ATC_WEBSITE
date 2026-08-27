import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Heart, Laptop, Code2, Lightbulb } from 'lucide-react';
import { SparkleDoodle, LoopyArrow, SpiralScribble } from '../doodles/DoodleSvgs';
import { StickyNote } from '../ui/StickyNote';
import confetti from 'canvas-confetti';

// Vector Illustration of Student Trio Gathered Around Laptop
const StudentGroupIllustration: React.FC = () => {
  const [activeReaction, setActiveReaction] = useState(false);

  const handleGroupClick = () => {
    setActiveReaction(true);
    confetti({
      particleCount: 40,
      spread: 70,
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
    });
    setTimeout(() => setActiveReaction(false), 1200);
  };

  return (
    <div className="relative w-full max-w-[560px] aspect-[4/3] flex items-center justify-center select-none">
      
      {/* Background Scribble & Flow Shapes */}
      <svg className="absolute inset-0 w-full h-full -z-0 overflow-visible" viewBox="0 0 500 380" fill="none">
        <path
          d="M 60 120 C 140 40, 360 30, 440 100 C 500 180, 460 300, 380 340 C 260 380, 100 360, 40 280 C -10 200, 0 160, 60 120 Z"
          fill="#FFE600"
          fillOpacity="0.12"
          stroke="#121316"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        {/* Loopy connecting scribble behind group */}
        <path
          d="M 80 80 Q 250 20 420 80 T 260 340"
          stroke="#6C5CE7"
          strokeWidth="3"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Floating Sticky Note 1 (Top Left) */}
      <div className="absolute -top-3 -left-2 sm:left-2 z-20 animate-float-slow">
        <StickyNote color="yellow" rotation="-rotate-6" className="p-3 text-sm max-w-[150px]">
          <span className="font-hand font-bold">💡 Ideas turn into prototypes here!</span>
        </StickyNote>
      </div>

      {/* Floating Sticky Note 2 (Top Right) */}
      <div className="absolute -top-4 -right-2 sm:right-4 z-20 animate-float-fast">
        <StickyNote color="pink" rotation="rotate-6" className="p-3 text-sm max-w-[140px]">
          <span className="font-hand font-bold">☕ 100% Student-Powered</span>
        </StickyNote>
      </div>

      {/* Floating Tech Doodle Sparkles */}
      <div className="absolute top-1/2 -left-6 hidden sm:block">
        <SparkleDoodle className="w-8 h-8" color="#FF6B6B" />
      </div>
      <div className="absolute bottom-4 -right-4 hidden sm:block">
        <SparkleDoodle className="w-10 h-10" color="#48DBFB" />
      </div>

      {/* Main Student Trio Vector Group (Purple, Yellow, Green hoodies) */}
      <div 
        onClick={handleGroupClick}
        className={`relative z-10 cursor-pointer group transition-transform duration-300 hover:scale-105 ${activeReaction ? 'animate-wiggle' : ''}`}
        title="Click the squad for celebration!"
      >
        <svg viewBox="0 0 440 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xl">
          
          {/* ========================================================= */}
          {/* Student 1 (Left - Purple Hoodie with Glasses) */}
          {/* ========================================================= */}
          {/* Body */}
          <path d="M 60 260 C 60 200, 90 170, 130 170 C 155 170, 175 190, 175 260 Z" fill="#6C5CE7" stroke="#121316" strokeWidth="3.5" />
          {/* Head */}
          <circle cx="120" cy="130" r="30" fill="#F8C291" stroke="#121316" strokeWidth="3" />
          {/* Dark Brown Hair */}
          <path d="M 95 125 C 90 95, 110 80, 140 85 C 155 90, 150 110, 145 125 C 135 115, 115 115, 95 125 Z" fill="#2C3E50" stroke="#121316" strokeWidth="3" />
          {/* Glasses */}
          <rect x="102" y="122" width="16" height="12" rx="3" fill="#FFFFFF" stroke="#121316" strokeWidth="2" />
          <rect x="124" y="122" width="16" height="12" rx="3" fill="#FFFFFF" stroke="#121316" strokeWidth="2" />
          <line x1="118" y1="128" x2="124" y2="128" stroke="#121316" strokeWidth="2" />
          {/* Smile */}
          <path d="M 115 145 Q 122 150 128 145" stroke="#121316" strokeWidth="2" strokeLinecap="round" />

          {/* ========================================================= */}
          {/* Student 2 (Center - Yellow Hoodie & Long Hair) */}
          {/* ========================================================= */}
          {/* Long Hair Back */}
          <path d="M 180 120 C 160 170, 170 230, 260 230 C 275 180, 260 130, 240 120 Z" fill="#D35400" stroke="#121316" strokeWidth="3" />
          {/* Body */}
          <path d="M 160 260 C 160 190, 185 160, 220 160 C 255 160, 280 190, 280 260 Z" fill="#FFD32A" stroke="#121316" strokeWidth="3.5" />
          {/* Head */}
          <circle cx="220" cy="120" r="30" fill="#F8C291" stroke="#121316" strokeWidth="3" />
          {/* Hair Front Bangs */}
          <path d="M 192 115 C 195 85, 245 85, 248 115 C 235 105, 205 105, 192 115 Z" fill="#E67E22" stroke="#121316" strokeWidth="3" />
          {/* Eyes & Big Happy Smile */}
          <circle cx="210" cy="118" r="2.5" fill="#121316" />
          <circle cx="230" cy="118" r="2.5" fill="#121316" />
          <path d="M 213 132 Q 220 140 227 132" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* ========================================================= */}
          {/* Student 3 (Right - Lime Green Hoodie & Curly Hair) */}
          {/* ========================================================= */}
          {/* Body */}
          <path d="M 265 260 C 265 190, 290 170, 330 170 C 370 170, 395 200, 395 260 Z" fill="#2ED573" stroke="#121316" strokeWidth="3.5" />
          {/* Head */}
          <circle cx="330" cy="130" r="30" fill="#F8C291" stroke="#121316" strokeWidth="3" />
          {/* Spiky / Curly Hair */}
          <path d="M 302 120 C 300 80, 360 80, 358 120 C 350 110, 310 110, 302 120 Z" fill="#1E272E" stroke="#121316" strokeWidth="3" />
          {/* Eyes & Wink */}
          <circle cx="320" cy="128" r="2.5" fill="#121316" />
          <path d="M 336 128 Q 342 124 346 128" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 324 144 Q 332 150 340 144" stroke="#121316" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* ========================================================= */}
          {/* Shared Laptop on Workbench Table */}
          {/* ========================================================= */}
          {/* Table Surface */}
          <polygon points="50,275 390,275 360,250 80,250" fill="#FFEAA7" stroke="#121316" strokeWidth="3.5" />
          {/* Laptop Base */}
          <polygon points="150,270 290,270 275,250 165,250" fill="#2D3436" stroke="#121316" strokeWidth="3" />
          {/* Laptop Screen with glowing code */}
          <polygon points="165,250 275,250 268,190 172,190" fill="#0B0F19" stroke="#121316" strokeWidth="3" />
          {/* ATC Logo on Laptop Back / Screen Glow */}
          <rect x="195" y="205" width="50" height="28" rx="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
          <text x="220" y="224" fontFamily="sans-serif" fontWeight="900" fontSize="13" textAnchor="middle" fill="#121316">
            ATC
          </text>

          {/* High Five / Thumbs up arm from right */}
          <path d="M 360 210 Q 380 180 395 160" stroke="#121316" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="398" cy="157" r="7" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
        </svg>
      </div>

    </div>
  );
};

export const AboutHero: React.FC = () => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-16 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-12 left-12 opacity-50 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#6C5CE7" />
      </div>
      <div className="absolute top-20 right-1/4 opacity-40 pointer-events-none hidden sm:block">
        <SpiralScribble className="w-12 h-12" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial About Content */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            {/* Club Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBE8FC] border-3 border-[#121316] shadow-pop-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7] animate-ping" />
              <span className="text-xs sm:text-sm font-mono font-black uppercase text-[#6C5CE7] tracking-wider">
                WHO WE ARE • NIAT PUNE
              </span>
            </div>

            {/* Main Heading: ABOUT ATC with Marker-style Accent */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#121316]">
                <span>ABOUT</span>
                <span className="relative inline-block px-4 py-1 bg-[#FFE600] rounded-2xl border-4 border-[#121316] shadow-pop rotate-[-2deg]">
                  ATC
                  <Sparkles className="w-6 h-6 text-[#FF6B6B] absolute -top-3 -right-3 animate-pulse" />
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-4xl font-black text-[#121316] tracking-tight leading-snug">
                More than a club.<br />
                <span className="text-[#6C5CE7] underline decoration-wavy decoration-3">
                  A community of builders.
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-base sm:text-xl text-gray-700 font-medium leading-relaxed">
              Advanced Tech Club, NIAT Pune is a student-run community where students explore emerging technologies, build real-world projects, learn together and turn curiosity into action.
            </p>

            {/* Quick Community Highlights */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs sm:text-sm font-extrabold text-[#121316]">
              <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-[#6C5CE7]">Nov 2025</span>
                <span className="text-gray-600 font-sans text-xs">Founded at NIAT</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-[#FF6B6B]">Lab 5.0</span>
                <span className="text-gray-600 font-sans text-xs">Innovation Space</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm flex flex-col col-span-2 sm:col-span-1">
                <span className="text-xl sm:text-2xl font-black text-[#2ED573]">100%</span>
                <span className="text-gray-600 font-sans text-xs">Student Powered</span>
              </div>
            </div>

          </div>

          {/* Right Column: Group Illustration */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <StudentGroupIllustration />
          </div>

        </div>
      </div>
    </section>
  );
};
