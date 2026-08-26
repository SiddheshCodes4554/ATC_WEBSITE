import React from 'react';

// Twinkling Star / Sparkle Doodle
export const SparkleDoodle: React.FC<{ className?: string; color?: string }> = ({ 
  className = "w-6 h-6", 
  color = "#FFD32A" 
}) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M20 2 C20 12 28 20 38 20 C28 20 20 28 20 38 C20 28 12 20 2 20 C12 20 20 12 20 2 Z" 
      fill={color} 
      stroke="#121316" 
      strokeWidth="2.5" 
      strokeLinejoin="round"
    />
  </svg>
);

// Spiral Scribble
export const SpiralScribble: React.FC<{ className?: string; color?: string }> = ({ 
  className = "w-10 h-10", 
  color = "#121316" 
}) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M30 30 C30 25 35 23 37 26 C40 31 35 38 27 37 C17 36 17 21 27 15 C38 9 51 17 48 32 C45 47 25 54 12 42" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeDasharray="1 1"
    />
  </svg>
);

// Hand-drawn Underline
export const HandDrawnUnderline: React.FC<{ className?: string; color?: string }> = ({ 
  className = "w-32 h-4", 
  color = "#FF6B6B" 
}) => (
  <svg viewBox="0 0 160 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M3 14 C40 6 90 17 155 8 M10 17 C55 12 115 11 148 16" 
      stroke={color} 
      strokeWidth="3.5" 
      strokeLinecap="round"
    />
  </svg>
);

// Hand-drawn Loopy Arrow
export const LoopyArrow: React.FC<{ className?: string; color?: string }> = ({ 
  className = "w-16 h-16", 
  color = "#121316" 
}) => (
  <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M15 65 C25 20 60 15 65 35 C70 55 45 60 40 45 C35 25 70 10 90 25 M80 18 L92 25 L88 38" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Planet Doodle with Ring
export const PlanetDoodle: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ring Back */}
    <path d="M12 46 C15 35 65 20 72 32" stroke="#FF8ED4" strokeWidth="4" strokeLinecap="round" />
    {/* Planet Body */}
    <circle cx="40" cy="40" r="24" fill="#FF6B6B" stroke="#121316" strokeWidth="3" />
    {/* Crater / Spots */}
    <circle cx="32" cy="34" r="4" fill="#E84118" />
    <circle cx="48" cy="48" r="6" fill="#E84118" />
    {/* Ring Front */}
    <path d="M8 48 C18 62 62 48 70 34" stroke="#FFE600" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Retro Robot Mascot Character
export const RetroRobotMascot: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Antenna */}
    <path d="M60 22 L60 8" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="8" r="5" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
    
    {/* Ears */}
    <rect x="18" y="40" width="8" height="16" rx="4" fill="#54A0FF" stroke="#121316" strokeWidth="2.5" />
    <rect x="94" y="40" width="8" height="16" rx="4" fill="#54A0FF" stroke="#121316" strokeWidth="2.5" />
    
    {/* Head */}
    <rect x="24" y="24" width="72" height="52" rx="14" fill="#6C5CE7" stroke="#121316" strokeWidth="3.5" />
    
    {/* Face Screen */}
    <rect x="34" y="34" width="52" height="32" rx="8" fill="#121316" />
    
    {/* Glowing Eyes */}
    <circle cx="48" cy="48" r="5" fill="#48DBFB" className="animate-pulse" />
    <circle cx="72" cy="48" r="5" fill="#48DBFB" className="animate-pulse" />
    
    {/* Smile */}
    <path d="M52 56 Q60 62 68 56" stroke="#48DBFB" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {/* Body */}
    <rect x="32" y="80" width="56" height="34" rx="10" fill="#A29BFE" stroke="#121316" strokeWidth="3.5" />
    
    {/* Chest meter */}
    <circle cx="48" cy="94" r="5" fill="#FF6B6B" stroke="#121316" strokeWidth="1.5" />
    <line x1="60" y1="90" x2="76" y2="90" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="60" y1="96" x2="72" y2="96" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Little hands */}
    <path d="M28 88 L14 96" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
    <circle cx="14" cy="96" r="4" fill="#FFD32A" stroke="#121316" strokeWidth="2" />
    
    <path d="M92 88 L106 96" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
    <circle cx="106" cy="96" r="4" fill="#FFD32A" stroke="#121316" strokeWidth="2" />
  </svg>
);

// Rocket Kid Builder Mascot (faithful to the reference hero image)
export const RocketKidHero: React.FC<{ className?: string }> = ({ className = "w-72 h-72" }) => (
  <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Rocket Smoke Rings */}
    <g className="animate-pulse opacity-90">
      <ellipse cx="65" cy="245" rx="20" ry="14" fill="#FAF7F0" stroke="#121316" strokeWidth="3" />
      <ellipse cx="42" cy="265" rx="14" ry="10" fill="#FAF7F0" stroke="#121316" strokeWidth="2.5" />
      <ellipse cx="85" cy="260" rx="12" ry="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    </g>

    {/* Flame / Thruster */}
    <path 
      d="M75 220 Q40 250 25 290 Q70 275 95 240 Z" 
      fill="#FF7675" 
      stroke="#121316" 
      strokeWidth="3" 
    />
    <path 
      d="M70 225 Q50 248 40 270 Q68 260 85 238 Z" 
      fill="#FFE600" 
      stroke="#121316" 
      strokeWidth="2" 
    />

    {/* Main Rocket Body (Purple & Yellow with Handcrafted Outlines) */}
    {/* Fins */}
    <path d="M100 240 L70 265 L105 200 Z" fill="#FF6B6B" stroke="#121316" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M175 160 L220 185 L155 215 Z" fill="#FF6B6B" stroke="#121316" strokeWidth="3.5" strokeLinejoin="round" />

    {/* Rocket Fuselage */}
    <path 
      d="M85 230 C120 240 180 190 230 110 C210 70 170 60 140 85 C90 130 75 195 85 230 Z" 
      fill="#6C5CE7" 
      stroke="#121316" 
      strokeWidth="4" 
      strokeLinejoin="round" 
    />

    {/* Yellow Nose Cone */}
    <path 
      d="M205 135 C225 105 250 75 260 55 C240 68 210 90 180 110 Z" 
      fill="#FFE600" 
      stroke="#121316" 
      strokeWidth="3.5" 
      strokeLinejoin="round" 
    />

    {/* Rocket Porthole Window */}
    <circle cx="160" cy="145" r="22" fill="#48DBFB" stroke="#121316" strokeWidth="3.5" />
    <circle cx="155" cy="140" r="17" fill="#54A0FF" />
    <path d="M150 135 Q158 130 168 135" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

    {/* Student / Kid Riding On Top */}
    {/* Body / Orange Hoodie */}
    <path 
      d="M170 110 C165 95 180 80 200 80 C215 80 225 95 220 115 C215 130 190 135 170 110 Z" 
      fill="#FF793F" 
      stroke="#121316" 
      strokeWidth="3.5" 
    />

    {/* Arm Waving with excitement */}
    <path 
      d="M210 90 Q235 70 245 45" 
      stroke="#121316" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    <circle cx="247" cy="43" r="7" fill="#F8C291" stroke="#121316" strokeWidth="3" />

    {/* Head & Blue Hair */}
    <circle cx="195" cy="65" r="16" fill="#F8C291" stroke="#121316" strokeWidth="3.5" />
    
    {/* Spiky Blue Anime Hair */}
    <path 
      d="M180 62 C175 45 185 30 205 32 C218 35 225 45 220 60 C215 55 210 52 202 52 C194 52 188 56 180 62 Z" 
      fill="#2E86DE" 
      stroke="#121316" 
      strokeWidth="3.5" 
      strokeLinejoin="round" 
    />

    {/* Happy Face */}
    <circle cx="198" cy="64" r="2.5" fill="#121316" />
    <path d="M192 70 Q198 75 204 70" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {/* Speed Lines */}
    <line x1="260" y1="120" x2="295" y2="105" stroke="#FFE600" strokeWidth="3" strokeLinecap="round" />
    <line x1="245" y1="145" x2="280" y2="130" stroke="#48DBFB" strokeWidth="3" strokeLinecap="round" />
    <line x1="220" y1="170" x2="265" y2="155" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Wavy Rainbow Trail Background divider
export const RainbowWaveTransition: React.FC<{ className?: string }> = ({ className = "w-full" }) => (
  <div className={`relative overflow-hidden leading-none select-none ${className}`}>
    <svg 
      viewBox="0 0 1440 220" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-full h-auto block"
      preserveAspectRatio="none"
    >
      {/* Background Top Dark */}
      <path d="M0 0 H1440 V120 Q1100 200 720 110 Q360 20 0 120 Z" fill="#0B0F19" />
      
      {/* Rainbow Ribbon Bands */}
      {/* Pink Band */}
      <path 
        d="M0 120 Q360 20 720 110 Q1100 200 1440 120 L1440 145 Q1100 225 720 135 Q360 45 0 145 Z" 
        fill="#FF6B6B" 
        stroke="#121316" 
        strokeWidth="2" 
      />
      {/* Yellow Band */}
      <path 
        d="M0 145 Q360 45 720 135 Q1100 225 1440 145 L1440 170 Q1100 250 720 160 Q360 70 0 170 Z" 
        fill="#FFE600" 
        stroke="#121316" 
        strokeWidth="2" 
      />
      {/* Blue / Turquoise Band */}
      <path 
        d="M0 170 Q360 70 720 160 Q1100 250 1440 170 L1440 195 Q1100 275 720 185 Q360 95 0 195 Z" 
        fill="#48DBFB" 
        stroke="#121316" 
        strokeWidth="2" 
      />
      {/* Lavender Band transitioning to cream */}
      <path 
        d="M0 195 Q360 95 720 185 Q1100 275 1440 195 L1440 220 L0 220 Z" 
        fill="#FAF7F0" 
      />
    </svg>
  </div>
);

// Isometric ATC 5.0 Lab Illustration Widget
export const IsometricLabPreview: React.FC<{ className?: string }> = ({ className = "w-full" }) => (
  <div className={`relative bg-[#5543CA] rounded-[24px] border-4 border-[#121316] p-4 sm:p-6 overflow-hidden text-white ${className}`}>
    {/* Grid pattern background */}
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

    {/* Lab header inside container */}
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 bg-[#FFE600] text-[#121316] font-bold text-xs rounded-full border-2 border-[#121316] shadow-pop-sm uppercase tracking-wider">
          Live Studio
        </span>
        <span className="text-xs text-purple-200 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Hardware & AI Workbench
        </span>
      </div>
      <span className="text-xs font-mono bg-[#121316]/40 px-2.5 py-1 rounded border border-white/10 text-yellow-300">
        NIAT LAB 5.0 • PUNE
      </span>
    </div>

    {/* Hand-drawn Isometric Vector Scene */}
    <div className="relative z-10 bg-[#1e1452] rounded-xl border-3 border-[#121316] p-4 sm:p-6 shadow-inner">
      <svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
        {/* Isometric Grid Floor */}
        <g stroke="#392b87" strokeWidth="1.5" opacity="0.6">
          <line x1="0" y1="200" x2="300" y2="300" />
          <line x1="60" y1="170" x2="360" y2="270" />
          <line x1="120" y1="140" x2="420" y2="240" />
          <line x1="180" y1="110" x2="480" y2="210" />
          <line x1="600" y1="200" x2="300" y2="300" />
          <line x1="540" y1="170" x2="240" y2="270" />
          <line x1="480" y1="140" x2="180" y2="240" />
        </g>

        {/* Central Workbench Table */}
        {/* Table Top */}
        <polygon points="180,180 340,130 460,170 300,225" fill="#2d3436" stroke="#121316" strokeWidth="3" />
        <polygon points="180,180 300,225 300,240 180,195" fill="#1e272e" stroke="#121316" strokeWidth="3" />
        <polygon points="300,225 460,170 460,185 300,240" fill="#485460" stroke="#121316" strokeWidth="3" />
        
        {/* Table Legs */}
        <line x1="185" y1="195" x2="185" y2="270" stroke="#121316" strokeWidth="5" strokeLinecap="round" />
        <line x1="300" y1="240" x2="300" y2="295" stroke="#121316" strokeWidth="5" strokeLinecap="round" />
        <line x1="455" y1="185" x2="455" y2="260" stroke="#121316" strokeWidth="5" strokeLinecap="round" />
        <line x1="340" y1="135" x2="340" y2="190" stroke="#121316" strokeWidth="4" strokeLinecap="round" />

        {/* Dual Monitors on Desk */}
        <polygon points="230,130 280,115 280,150 230,165" fill="#0984e3" stroke="#121316" strokeWidth="2.5" />
        <polygon points="285,113 335,100 335,135 285,148" fill="#6c5ce7" stroke="#121316" strokeWidth="2.5" />
        <line x1="280" y1="150" x2="280" y2="165" stroke="#121316" strokeWidth="3" />
        {/* Glow on screen */}
        <line x1="240" y1="135" x2="270" y2="126" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="240" y1="145" x2="265" y2="137" stroke="#55efc4" strokeWidth="2" strokeLinecap="round" />

        {/* Robotic Arm on Workbench */}
        <g className="transition-transform duration-700">
          <circle cx="380" cy="165" r="10" fill="#d63031" stroke="#121316" strokeWidth="2.5" />
          <line x1="380" y1="165" x2="400" y2="120" stroke="#ffeaa7" strokeWidth="6" strokeLinecap="round" />
          <circle cx="400" cy="120" r="6" fill="#e17055" stroke="#121316" strokeWidth="2" />
          <line x1="400" y1="120" x2="370" y2="85" stroke="#fdcb6e" strokeWidth="5" strokeLinecap="round" />
          <circle cx="370" cy="85" r="5" fill="#e17055" stroke="#121316" strokeWidth="2" />
          <line x1="370" y1="85" x2="350" y2="95" stroke="#00cec9" strokeWidth="4" strokeLinecap="round" />
          {/* Laser beam */}
          <line x1="350" y1="95" x2="330" y2="175" stroke="#00d2d3" strokeWidth="2" strokeDasharray="3 3" opacity="0.85" />
          <circle cx="330" cy="175" r="3" fill="#55efc4" className="animate-ping" />
        </g>

        {/* Left Side: Server Rack & 3D Printer */}
        <polygon points="60,110 130,85 130,220 60,245" fill="#2d3436" stroke="#121316" strokeWidth="3" />
        <polygon points="130,85 180,105 180,240 130,220" fill="#636e72" stroke="#121316" strokeWidth="3" />
        <polygon points="60,110 110,90 180,105 130,85" fill="#b2bec3" stroke="#121316" strokeWidth="3" />
        {/* Server LEDs */}
        <circle cx="80" cy="130" r="3" fill="#00b894" />
        <circle cx="95" cy="130" r="3" fill="#0984e3" />
        <circle cx="110" cy="130" r="3" fill="#fdcb6e" />
        <line x1="80" y1="150" x2="120" y2="135" stroke="#00b894" strokeWidth="2" />
        <line x1="80" y1="170" x2="120" y2="155" stroke="#ff7675" strokeWidth="2" />
        <line x1="80" y1="190" x2="120" y2="175" stroke="#74b9ff" strokeWidth="2" />

        {/* Floating Code & Hologram Windows */}
        <rect x="420" y="40" width="100" height="60" rx="8" fill="#121316" fillOpacity="0.8" stroke="#a29bfe" strokeWidth="2" />
        <line x1="430" y1="55" x2="480" y2="55" stroke="#ffeaa7" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="430" y1="65" x2="505" y2="65" stroke="#55efc4" strokeWidth="2" strokeLinecap="round" />
        <line x1="430" y1="75" x2="465" y2="75" stroke="#ff7675" strokeWidth="2" strokeLinecap="round" />
        <line x1="430" y1="85" x2="495" y2="85" stroke="#74b9ff" strokeWidth="2" strokeLinecap="round" />

        {/* Cute floor robot assistant */}
        <g transform="translate(130, 220)">
          <ellipse cx="25" cy="40" rx="16" ry="7" fill="#121316" opacity="0.4" />
          <rect x="10" y="10" width="30" height="25" rx="6" fill="#fd79a8" stroke="#121316" strokeWidth="2.5" />
          <circle cx="20" cy="22" r="3" fill="#ffffff" />
          <circle cx="30" cy="22" r="3" fill="#ffffff" />
          <line x1="25" y1="10" x2="25" y2="3" stroke="#121316" strokeWidth="2" />
          <circle cx="25" cy="3" r="2.5" fill="#ffeaa7" />
        </g>
      </svg>
    </div>

    {/* Bottom Badges */}
    <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15 text-xs">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-md bg-white/10 font-mono text-purple-200 border border-white/10">
          ROS 2.0 • AI • IoT • PCB Design
        </span>
        <span className="hidden sm:inline-block text-purple-300">
          📍 NIAT Innovation Wing
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-24 bg-black/40 h-3 rounded-full border border-white/20 overflow-hidden">
          <div className="bg-[#FFE600] h-full w-[72%] rounded-full animate-pulse" />
        </div>
        <span className="font-mono text-yellow-300 font-bold">72% Ready</span>
      </div>
    </div>
  </div>
);
