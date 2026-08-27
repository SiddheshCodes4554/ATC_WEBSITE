import React from 'react';
import { ArrowUpRight, Cpu, Eye, Wifi, Wrench, Sparkles, MapPin, Maximize2 } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { Link } from 'react-router-dom';

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
              <span className="w-2 h-2 rounded-full bg-[#2ED573] animate-ping" />
              PHYSICAL INNOVATION SPACE
            </div>

            {/* Large Heading */}
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                ATC 5.0 LAB
              </h2>
              <p className="text-base sm:text-lg text-purple-100 font-medium leading-relaxed">
                Our dedicated physical lab space at NIAT Pune — where student ideas take shape through Robotics, AI, Computer Vision, IoT, and rapid hardware prototyping.
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
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <PlayfulButton
                to="/lab"
                variant="primary"
                size="lg"
                icon={<ArrowUpRight className="w-5 h-5 text-[#121316] stroke-[3]" />}
              >
                Explore the Lab
              </PlayfulButton>

              <span className="text-xs font-mono text-purple-200 flex items-center gap-1.5 font-bold">
                <MapPin className="w-4 h-4 text-[#FFE600]" />
                NIAT Campus, Lab 5.0
              </span>
            </div>
          </div>

          {/* Right Column: Real ATC 5.0 Lab Build Space Showcase */}
          <div className="lg:col-span-7">
            <Link
              to="/lab"
              className="block group relative rounded-[32px] sm:rounded-[36px] bg-[#121316] border-4 border-[#121316] shadow-pop-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300 cursor-pointer"
            >
              {/* Top Status Bar */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-[#1C1635] border-b-2 border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-ping" />
                  <span className="font-bold text-[#FFE600] uppercase tracking-wider">
                    OUR BUILD SPACE • NIAT PUNE
                  </span>
                </div>
                <span className="text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/10 font-bold text-[11px]">
                  ATC LAB 5.0
                </span>
              </div>

              {/* Real Lab Photo Container */}
              <div className="relative overflow-hidden bg-black/40 aspect-[16/10] sm:aspect-[16/10.5]">
                <img
                  src="/atc-lab-5.0.jpg"
                  alt="ATC Lab 5.0 Physical Build Space - NIAT Pune"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle Hover Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                  <span className="px-4 py-2 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                    <span>View Lab Details ↗</span>
                  </span>
                  <span className="text-xs font-mono text-white/90 font-bold hidden sm:inline-block">
                    Built for Builders • Equipped & Organised
                  </span>
                </div>
              </div>

              {/* Bottom Metadata & Specs Bar */}
              <div className="px-5 sm:px-6 py-3 bg-[#1C1635] border-t-2 border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-bold">FOCUS:</span>
                  <span className="text-white font-bold">BUILD • TEST • ITERATE</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-purple-200">
                  <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 font-bold text-[#2ED573]">
                    ● ACTIVE & EQUIPPED
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabSection;
