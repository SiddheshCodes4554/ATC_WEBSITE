import React from 'react';
import { Sparkles, Calendar, Ticket, Mic, Laptop, Radio } from 'lucide-react';
import { SparkleDoodle, LoopyArrow, SpiralScribble } from '../doodles/DoodleSvgs';

// Custom Illustrated Event Elements Vector Composition
const EventIllustrationScene: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center select-none">

      {/* Background Soft Blobs */}
      <svg className="absolute inset-0 w-full h-full -z-0 overflow-visible" viewBox="0 0 460 340" fill="none">
        <path
          d="M 60 80 C 180 20, 360 40, 420 120 C 480 200, 440 300, 340 340 C 240 380, 80 340, 40 240 C 0 140, -60 140, 60 80 Z"
          fill="#FF793F"
          fillOpacity="0.12"
          stroke="#121316"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Floating Sparkle & Doodles */}
      <div className="absolute -top-3 left-4 animate-float-slow">
        <SparkleDoodle className="w-8 h-8" color="#FFE600" />
      </div>
      <div className="absolute top-1/2 -right-4 animate-float-fast">
        <SparkleDoodle className="w-10 h-10" color="#6C5CE7" />
      </div>

      {/* Main Illustrated Composition (Calendar + Ticket + Mic + Laptop) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 460 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xl">

          {/* ========================================================= */}
          {/* 1. Large Illustrated Event Calendar (Center Back) */}
          {/* ========================================================= */}
          {/* Calendar Shadow & Base */}
          <rect x="70" y="45" width="220" height="210" rx="24" fill="#FFFFFF" stroke="#121316" strokeWidth="4" />

          {/* Calendar Red Header Strip */}
          <path d="M 70 69 C 70 55.7 80.7 45 94 45 L 266 45 C 279.3 45 290 55.7 290 69 L 290 95 L 70 95 Z" fill="#FF6B6B" stroke="#121316" strokeWidth="4" />

          {/* Spiral Bindings on Top */}
          <rect x="100" y="32" width="10" height="24" rx="4" fill="#121316" />
          <rect x="135" y="32" width="10" height="24" rx="4" fill="#121316" />
          <rect x="175" y="32" width="10" height="24" rx="4" fill="#121316" />
          <rect x="215" y="32" width="10" height="24" rx="4" fill="#121316" />
          <rect x="250" y="32" width="10" height="24" rx="4" fill="#121316" />

          {/* Calendar Header Text */}
          <text x="180" y="78" fontFamily="sans-serif" fontWeight="900" fontSize="15" textAnchor="middle" fill="#FFFFFF">
            ATC CALENDAR 📅
          </text>

          {/* Date Grid Matrix */}
          {/* Row 1 */}
          <circle cx="105" cy="125" r="12" fill="#E1DCFF" stroke="#121316" strokeWidth="2" />
          <text x="105" y="130" fontFamily="sans-serif" fontWeight="800" fontSize="11" textAnchor="middle" fill="#121316">05</text>

          <circle cx="145" cy="125" r="12" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
          <text x="145" y="130" fontFamily="sans-serif" fontWeight="800" fontSize="11" textAnchor="middle" fill="#121316">12</text>

          <circle cx="185" cy="125" r="12" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
          <text x="185" y="130" fontFamily="sans-serif" fontWeight="900" fontSize="11" textAnchor="middle" fill="#121316">18</text>

          <circle cx="225" cy="125" r="12" fill="#D4F8E8" stroke="#121316" strokeWidth="2" />
          <text x="225" y="130" fontFamily="sans-serif" fontWeight="800" fontSize="11" textAnchor="middle" fill="#121316">24</text>

          <circle cx="265" cy="125" r="12" fill="#FAF7F0" stroke="#121316" strokeWidth="2" />
          <text x="265" y="130" fontFamily="sans-serif" fontWeight="800" fontSize="11" textAnchor="middle" fill="#121316">30</text>

          {/* Row 2 (Hackathon Highlight Day) */}
          <rect x="90" y="155" width="180" height="40" rx="10" fill="#FFF3A8" stroke="#121316" strokeWidth="2.5" />
          <text x="180" y="180" fontFamily="sans-serif" fontWeight="900" fontSize="12" textAnchor="middle" fill="#121316">
            ⚡ HACKATHON WEEKEND
          </text>

          {/* Push Pin on Calendar */}
          <circle cx="85" cy="60" r="7" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
          <circle cx="275" cy="60" r="7" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />


          {/* ========================================================= */}
          {/* 2. Golden Event VIP Pass Ticket Stub (Rotated Right) */}
          {/* ========================================================= */}
          <g transform="translate(250, 140) rotate(14)">
            {/* Ticket Body */}
            <rect x="0" y="0" width="160" height="90" rx="14" fill="#FFE600" stroke="#121316" strokeWidth="3.5" />
            {/* Cutout Notches */}
            <circle cx="0" cy="45" r="10" fill="#FAF7F0" stroke="#121316" strokeWidth="3" />
            <circle cx="160" cy="45" r="10" fill="#FAF7F0" stroke="#121316" strokeWidth="3" />
            {/* Dashed Tear Line */}
            <line x1="115" y1="0" x2="115" y2="90" stroke="#121316" strokeWidth="2" strokeDasharray="5 4" />
            {/* Ticket Text */}
            <text x="20" y="32" fontFamily="sans-serif" fontWeight="900" fontSize="14" fill="#121316">
              VIP ENTRY
            </text>
            <text x="20" y="52" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#6C5CE7">
              ATC-NIAT-2026
            </text>
            <text x="20" y="72" fontFamily="sans-serif" fontWeight="800" fontSize="10" fill="#FF6B6B">
              ★ ALL ACCESS PASS
            </text>
            {/* Mini Barcode */}
            <line x1="128" y1="20" x2="128" y2="70" stroke="#121316" strokeWidth="3" />
            <line x1="135" y1="20" x2="135" y2="70" stroke="#121316" strokeWidth="2" />
            <line x1="140" y1="20" x2="140" y2="70" stroke="#121316" strokeWidth="4" />
            <line x1="148" y1="20" x2="148" y2="70" stroke="#121316" strokeWidth="2" />
          </g>


          {/* ========================================================= */}
          {/* 3. Stage Microphone & Soundwaves (Left Bottom) */}
          {/* ========================================================= */}
          <g transform="translate(30, 160) rotate(-12)">
            {/* Mic Head Grid */}
            <rect x="25" y="15" width="28" height="40" rx="14" fill="#A29BFE" stroke="#121316" strokeWidth="3" />
            <line x1="25" y1="28" x2="53" y2="28" stroke="#121316" strokeWidth="2" />
            <line x1="25" y1="42" x2="53" y2="42" stroke="#121316" strokeWidth="2" />
            <line x1="39" y1="15" x2="39" y2="55" stroke="#121316" strokeWidth="2" />

            {/* Mic Body / Handle */}
            <path d="M 32 55 L 46 55 L 44 95 L 34 95 Z" fill="#121316" stroke="#121316" strokeWidth="2" />
            {/* Mic Stand Cradle */}
            <path d="M 18 35 C 18 55 60 55 60 35" stroke="#121316" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <line x1="39" y1="55" x2="39" y2="75" stroke="#121316" strokeWidth="3.5" />

            {/* Sound Waves */}
            <path d="M 68 20 Q 76 35 68 50" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 76 12 Q 88 35 76 58" stroke="#FFE600" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>

        </svg>
      </div>

    </div>
  );
};

export const EventsHero: React.FC = () => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-14 paper-pattern border-b-4 border-[#121316] overflow-hidden">

      {/* Decorative Twinkling Sparkles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-10 h-10" color="#FF793F" />
      </div>
      <div className="absolute top-16 right-1/4 opacity-40 pointer-events-none hidden sm:block">
        <SpiralScribble className="w-12 h-12" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Big Editorial Heading & Tagline */}
          <div className="lg:col-span-6 space-y-6">

            {/* Club Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE8D6] border-3 border-[#121316] shadow-pop-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF793F] animate-ping" />
              <span className="text-xs sm:text-sm font-mono font-black uppercase text-[#FF793F] tracking-wider">
                COMMUNITY GATHERINGS • NIAT PUNE
              </span>
            </div>

            {/* Main Title: ATC EVENTS with bold orange marker styling */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#121316]">
                <span>ATC</span>
                <span className="relative inline-block px-4 py-1 bg-[#FF793F] text-white rounded-2xl border-4 border-[#121316] shadow-pop rotate-[-2deg]">
                  EVENTS
                  <Sparkles className="w-6 h-6 text-[#FFE600] absolute -top-3 -right-3 animate-pulse" />
                </span>
              </div>

              {/* Subtitle */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#121316] tracking-tight leading-snug">
                Workshops. Hackathons.<br />
                <span className="text-[#6C5CE7] underline decoration-wavy decoration-3">
                  Tech Talks. Experiences.
                </span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-base sm:text-xl text-gray-700 font-medium leading-relaxed">
              Where curious minds collide. From 48-hour overnight hackathons and hands-on ROS hardware bootcamps to live open-source teardowns.
            </p>

            {/* Event Stats Counter */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono font-bold text-gray-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-xl border-2 border-[#121316] shadow-pop-sm">
                <Calendar className="w-4 h-4 text-[#FF793F]" />
                4+ Events Hosted
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-xl border-2 border-[#121316] shadow-pop-sm">
                ⚡ 100% Free for Students
              </span>
            </div>

          </div>

          {/* Right Column: Illustrated Event Scene */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <EventIllustrationScene />
          </div>

        </div>
      </div>
    </section>
  );
};
