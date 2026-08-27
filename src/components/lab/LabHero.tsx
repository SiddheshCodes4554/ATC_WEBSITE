import React from 'react';
import { Sparkles, ArrowUpRight, Wrench, Cpu, Rocket } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';
import { InteractiveLabScene, LabDomain } from './InteractiveLabScene';

interface LabHeroProps {
  activeDomain: LabDomain;
  onDomainSelect: (domain: LabDomain) => void;
}

export const LabHero: React.FC<LabHeroProps> = ({ activeDomain, onDomainSelect }) => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-16 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-10 h-10" color="#6C5CE7" />
      </div>
      <div className="absolute top-14 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FFE600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#6C5CE7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-ping" />
              PHYSICAL INNOVATION HUB • NIAT PUNE LAB 5.0
            </div>

            {/* Editorial Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.05]">
              ATC{' '}
              <span className="relative inline-block px-4 py-1 bg-[#6C5CE7] text-white rounded-3xl border-4 border-[#121316] shadow-pop rotate-[-1.5deg]">
                5.0 LAB
                <Sparkles className="w-6 h-6 text-[#FFE600] absolute -top-3 -right-3 animate-pulse" />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl sm:text-4xl font-black text-[#FF793F] font-display">
              "Where ideas become hardware."
            </p>

            <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed max-w-2xl">
              An active, student-built hardware playground at NIAT Pune. From PCB soldering and 3D printing to autonomous rovers, edge AI clusters, and IoT mesh networks.
            </p>
          </div>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <PlayfulButton
              href="#lab-status"
              variant="primary"
              size="md"
              icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
            >
              Lab Status (72%)
            </PlayfulButton>

            <PlayfulButton
              to="/projects"
              variant="secondary"
              size="md"
              icon={<Wrench className="w-4 h-4 text-[#121316]" />}
            >
              View Lab Builds
            </PlayfulButton>
          </div>

        </div>

        {/* Large Interactive Illustrated Lab Environment */}
        <div className="relative">
          <InteractiveLabScene
            activeDomain={activeDomain}
            onDomainSelect={onDomainSelect}
          />
        </div>

      </div>
    </section>
  );
};
