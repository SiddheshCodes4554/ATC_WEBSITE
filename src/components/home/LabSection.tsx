import React, { useState } from 'react';
import { ArrowUpRight, Cpu, Bot, Eye, Wifi, Wrench, Sparkles } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';

// Detailed Interactive Isometric Lab Illustration
const AnimatedLabScene: React.FC = () => {
  const [activeLED, setActiveLED] = useState(true);

  return (
    <div className="relative w-full bg-[#181145] rounded-3xl border-4 border-[#121316] shadow-pop-xl p-4 sm:p-6 overflow-hidden text-white">
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

      {/* Floating Drone with gentle hover animation */}
      <div className="absolute top-4 right-6 z-20 animate-float-slow select-none">
        <div className="relative p-2 bg-[#121316] rounded-xl border-2 border-[#48DBFB] shadow-pop-sm flex items-center gap-1.5">
          {/* Drone Rotors */}
          <span className="w-4 h-1 bg-[#48DBFB] animate-spin inline-block rounded-full" />
          <span className="text-[10px] font-mono text-cyan-300 font-bold">DRONE-01</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* Live Lab Status Pill */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-ping" />
          <span className="text-xs font-mono font-bold text-yellow-300 uppercase tracking-wider">
            LIVE LAB ENVIRONMENT
          </span>
        </div>
        <span className="text-xs font-mono bg-black/40 px-2.5 py-1 rounded-md border border-white/15 text-purple-200">
          NIAT LAB 5.0 • PUNE
        </span>
      </div>

      {/* Main Isometric Lab Vector Art */}
      <div className="relative z-10 bg-[#0f092b] rounded-2xl border-3 border-[#121316] p-4 sm:p-6">
        <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-lg">
          
          {/* Isometric Blueprint Floor Grid */}
          <g stroke="#2d1f6b" strokeWidth="1.5" opacity="0.7">
            <line x1="0" y1="210" x2="300" y2="310" />
            <line x1="60" y1="180" x2="360" y2="280" />
            <line x1="120" y1="150" x2="420" y2="250" />
            <line x1="180" y1="120" x2="480" y2="220" />
            <line x1="600" y1="210" x2="300" y2="310" />
            <line x1="540" y1="180" x2="240" y2="280" />
            <line x1="480" y1="150" x2="180" y2="250" />
            <line x1="420" y1="120" x2="120" y2="220" />
          </g>

          {/* Workbench Table Top */}
          <polygon points="180,180 340,130 470,170 310,225" fill="#2d3436" stroke="#121316" strokeWidth="3.5" />
          <polygon points="180,180 310,225 310,245 180,200" fill="#1e272e" stroke="#121316" strokeWidth="3.5" />
          <polygon points="310,225 470,170 470,190 310,245" fill="#485460" stroke="#121316" strokeWidth="3.5" />
          
          {/* Table Legs */}
          <line x1="185" y1="200" x2="185" y2="285" stroke="#121316" strokeWidth="5" strokeLinecap="round" />
          <line x1="310" y1="245" x2="310" y2="310" stroke="#121316" strokeWidth="5" strokeLinecap="round" />
          <line x1="465" y1="190" x2="465" y2="275" stroke="#121316" strokeWidth="5" strokeLinecap="round" />

          {/* Dual Monitors on Workbench */}
          {/* Left Monitor (Terminal Code) */}
          <polygon points="230,130 280,115 280,150 230,165" fill="#0984e3" stroke="#121316" strokeWidth="2.5" />
          <line x1="240" y1="135" x2="270" y2="126" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="240" y1="145" x2="260" y2="139" stroke="#55efc4" strokeWidth="2" strokeLinecap="round" />
          {/* Animated blinking cursor on monitor */}
          <circle cx="264" cy="138" r="2" fill="#FFE600" className="animate-ping" />

          {/* Right Monitor (AI Vision Feed) */}
          <polygon points="285,113 335,100 335,135 285,148" fill="#6c5ce7" stroke="#121316" strokeWidth="2.5" />
          <rect x="295" y="112" width="28" height="18" fill="#121316" rx="2" />
          <circle cx="309" cy="121" r="5" fill="#00d2d3" className="animate-pulse" />

          {/* Robotic Arm with subtle animated joint */}
          <g className="transition-transform duration-500">
            <circle cx="390" cy="165" r="10" fill="#d63031" stroke="#121316" strokeWidth="2.5" />
            <line x1="390" y1="165" x2="410" y2="115" stroke="#fdcb6e" strokeWidth="6" strokeLinecap="round" />
            <circle cx="410" cy="115" r="6" fill="#e17055" stroke="#121316" strokeWidth="2" />
            <line x1="410" y1="115" x2="375" y2="80" stroke="#fdcb6e" strokeWidth="5" strokeLinecap="round" />
            <circle cx="375" cy="80" r="5" fill="#e17055" stroke="#121316" strokeWidth="2" />
            <line x1="375" y1="80" x2="355" y2="92" stroke="#00cec9" strokeWidth="4" strokeLinecap="round" />
            {/* Laser Guidance Beam */}
            <line x1="355" y1="92" x2="335" y2="175" stroke="#00d2d3" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="335" cy="175" r="3" fill="#55efc4" className="animate-ping" />
          </g>

          {/* Server Rack & IoT Station on Left */}
          <polygon points="60,110 130,85 130,225 60,250" fill="#2d3436" stroke="#121316" strokeWidth="3" />
          <polygon points="130,85 180,105 180,245 130,225" fill="#636e72" stroke="#121316" strokeWidth="3" />
          <polygon points="60,110 110,90 180,105 130,85" fill="#b2bec3" stroke="#121316" strokeWidth="3" />
          {/* Blinking LEDs on Server */}
          <circle cx="80" cy="130" r="3.5" fill="#00b894" className="animate-pulse" />
          <circle cx="95" cy="130" r="3.5" fill="#0984e3" className="animate-pulse" />
          <circle cx="110" cy="130" r="3.5" fill="#fdcb6e" className="animate-pulse" />
          <line x1="80" y1="150" x2="120" y2="135" stroke="#00b894" strokeWidth="2" />
          <line x1="80" y1="170" x2="120" y2="155" stroke="#ff7675" strokeWidth="2" />
          <line x1="80" y1="190" x2="120" y2="175" stroke="#74b9ff" strokeWidth="2" />

          {/* Floating Hologram Code Window on Top Right */}
          <rect x="420" y="35" width="110" height="65" rx="10" fill="#121316" fillOpacity="0.85" stroke="#a29bfe" strokeWidth="2" />
          <line x1="432" y1="50" x2="485" y2="50" stroke="#ffeaa7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="432" y1="60" x2="515" y2="60" stroke="#55efc4" strokeWidth="2" strokeLinecap="round" />
          <line x1="432" y1="70" x2="475" y2="70" stroke="#ff7675" strokeWidth="2" strokeLinecap="round" />
          <line x1="432" y1="80" x2="505" y2="80" stroke="#74b9ff" strokeWidth="2" strokeLinecap="round" />

          {/* Small Cute ATC Floor Mascot Robot */}
          <g transform="translate(140, 230)">
            <ellipse cx="25" cy="40" rx="18" ry="8" fill="#121316" opacity="0.4" />
            <rect x="8" y="8" width="34" height="28" rx="8" fill="#fd79a8" stroke="#121316" strokeWidth="2.5" />
            <circle cx="18" cy="20" r="3.5" fill="#ffffff" />
            <circle cx="32" cy="20" r="3.5" fill="#ffffff" />
            <line x1="25" y1="8" x2="25" y2="0" stroke="#121316" strokeWidth="2.5" />
            <circle cx="25" cy="0" r="3" fill="#ffeaa7" />
          </g>
        </svg>
      </div>

      {/* Lab Stats Bar */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-white/10 font-mono text-purple-200 border border-white/10">
            ROS 2.0 • NVIDIA Jetson • ESP32 • 3D Printing
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-300 font-mono">Build Progress:</span>
          <div className="w-24 bg-black/50 h-3 rounded-full border border-white/20 overflow-hidden">
            <div className="bg-[#FFE600] h-full w-[72%] rounded-full animate-pulse" />
          </div>
          <span className="font-mono text-yellow-300 font-bold">72%</span>
        </div>
      </div>
    </div>
  );
};

export const LabSection: React.FC = () => {
  return (
    <section className="relative bg-[#4834D4] py-20 text-white border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Texture & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#686de0]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Status, Description & CTA */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600] text-[#121316] border-3 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-ping" />
              IN PROGRESS
            </div>

            {/* Large Heading */}
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                ATC 5.0 LAB
              </h2>
              <p className="text-base sm:text-lg text-purple-100 font-medium leading-relaxed">
                Our innovation space is coming to life — a place for Robotics, AI, Computer Vision, IoT and rapid prototyping.
              </p>
            </div>

            {/* Domain Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-300">
                  <Cpu className="w-4 h-4" /> Robotics & ROS
                </div>
                <p className="text-[11px] text-purple-200">Autonomous rovers & quadrupeds</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                  <Eye className="w-4 h-4" /> AI & Computer Vision
                </div>
                <p className="text-[11px] text-purple-200">Edge ML & Coral TPUs</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Wifi className="w-4 h-4" /> IoT & Embedded
                </div>
                <p className="text-[11px] text-purple-200">Custom PCB & Sensor telemetry</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-sm space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                  <Wrench className="w-4 h-4" /> Rapid Prototyping
                </div>
                <p className="text-[11px] text-purple-200">3D printing & SMD soldering</p>
              </div>
            </div>

            {/* CTA Button: Explore the Lab ↗ */}
            <div className="pt-2 flex items-center gap-4">
              <PlayfulButton
                to="/lab"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Explore the Lab ↗
              </PlayfulButton>

              <span className="text-xs font-mono text-purple-200">
                📍 NIAT Campus, Lab 5.0
              </span>
            </div>

          </div>

          {/* Right Column: Animated Isometric Lab Scene */}
          <div className="lg:col-span-7">
            <AnimatedLabScene />
          </div>

        </div>

      </div>
    </section>
  );
};
