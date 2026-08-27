import React from 'react';
import { ArrowUpRight, Cpu, Eye, Wifi, Wrench, Sparkles, MapPin, CheckCircle2, Zap } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';

export const LabSection: React.FC = () => {
  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] text-white border-b-4 border-[#121316] overflow-hidden flex items-center">
      {/* Full-bleed Background Image with Premium Multi-layer Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/atc-lab-5.0.jpg"
          alt="ATC Lab 5.0 Workspace Background"
          className="w-full h-full object-cover object-center scale-105"
        />

        {/* Cinematic Gradient Overlays for High Legibility & Vibrant Theme Alignment */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121316]/95 via-[#121316]/80 to-[#121316]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-[#121316]/60" />
        <div className="absolute inset-0 bg-[#301c80]/30 mix-blend-multiply" />
        
        {/* Playful Dot Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Focus Statement & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE600] text-[#121316] border-3 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-ping" />
              <span>ATC LAB 5.0 • NIAT PUNE</span>
            </div>

            {/* Bold Headline */}
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                OUR BUILD
                <br />
                <span className="relative inline-block px-5 py-1 bg-[#FFE600] text-[#121316] rounded-3xl border-4 border-[#121316] shadow-pop rotate-[-1.5deg] mt-1">
                  SPACE.
                  <Sparkles className="w-7 h-7 text-[#FF4757] absolute -top-4 -right-4 animate-bounce" />
                </span>
              </h2>
              
              <p className="text-lg sm:text-2xl font-black text-[#FFE600] font-display pt-1">
                Where ideas take shape and innovation begins.
              </p>

              <p className="text-sm sm:text-base text-gray-300 font-bold leading-relaxed max-w-xl">
                An active, physical hardware sandbox at NIAT Pune designed for makers, coders, and engineers. From autonomous robotics and AI vision to custom PCB design and high-speed prototypes.
              </p>
            </div>

            {/* Focus & Value Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 font-mono text-xs font-black text-yellow-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-yellow-300" />
                FOCUS: BUILD • TEST • ITERATE
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2ED573]" />
                EQUIPPED & ORGANISED
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <PlayfulButton
                to="/lab"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Explore Lab 5.0
              </PlayfulButton>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-sm border-2 border-white/15 text-xs font-mono font-bold text-purple-200">
                <MapPin className="w-4 h-4 text-[#FFE600]" />
                <span>NIAT Campus, Lab 5.0</span>
              </div>
            </div>

          </div>

          {/* Right Column: Lab Capabilities Grid */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* 4-Bento Domain Matrix */}
            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Robotics */}
              <div className="p-5 rounded-3xl bg-[#121316]/80 backdrop-blur-md border-3 border-[#121316] hover:border-[#FFE600] shadow-pop transition-all hover:scale-[1.02] space-y-2 group">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#121316]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-[#FFE600] transition-colors">
                  Robotics & ROS 2
                </h3>
                <p className="text-xs font-bold text-gray-300">
                  Autonomous rovers, quadruped kinematics, robotic arms & sensor fusion.
                </p>
              </div>

              {/* AI & Computer Vision */}
              <div className="p-5 rounded-3xl bg-[#121316]/80 backdrop-blur-md border-3 border-[#121316] hover:border-[#00D2D3] shadow-pop transition-all hover:scale-[1.02] space-y-2 group">
                <div className="w-10 h-10 rounded-2xl bg-[#00D2D3] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#121316]">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-[#00D2D3] transition-colors">
                  AI & Computer Vision
                </h3>
                <p className="text-xs font-bold text-gray-300">
                  Edge ML on Coral TPUs, NVIDIA Jetson pipelines & real-time visual tracking.
                </p>
              </div>

              {/* IoT & Embedded */}
              <div className="p-5 rounded-3xl bg-[#121316]/80 backdrop-blur-md border-3 border-[#121316] hover:border-[#2ED573] shadow-pop transition-all hover:scale-[1.02] space-y-2 group">
                <div className="w-10 h-10 rounded-2xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#121316]">
                  <Wifi className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-[#2ED573] transition-colors">
                  IoT & Embedded
                </h3>
                <p className="text-xs font-bold text-gray-300">
                  ESP32 firmware, custom PCB milling & wireless MQTT telemetry clusters.
                </p>
              </div>

              {/* Rapid Prototyping */}
              <div className="p-5 rounded-3xl bg-[#121316]/80 backdrop-blur-md border-3 border-[#121316] hover:border-[#FF6B6B] shadow-pop transition-all hover:scale-[1.02] space-y-2 group">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B6B] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-white">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-[#FF6B6B] transition-colors">
                  Rapid Prototyping
                </h3>
                <p className="text-xs font-bold text-gray-300">
                  Precision 3D printing, SMD rework station, power benches & laser cutting.
                </p>
              </div>

            </div>

            {/* Bottom Builder Philosophy Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#121316]/90 backdrop-blur-md border-3 border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-yellow-300 font-black tracking-wider uppercase block">
                  CLEAN SPACE. CLEAR MIND. BETTER BUILDS.
                </span>
                <span className="text-gray-400 font-bold">
                  Every tool has a purpose in ATC Lab 5.0.
                </span>
              </div>

              <span className="px-3 py-1 rounded-xl bg-white/10 text-emerald-400 border border-emerald-400/40 font-bold self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>BUILDING 24/7</span>
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default LabSection;
