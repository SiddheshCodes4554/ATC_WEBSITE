import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, Search, PenTool, Wrench, Zap, Rocket, Plus } from 'lucide-react';
import { SparkleDoodle, LoopyArrow, SpiralScribble } from '../doodles/DoodleSvgs';
import { PlayfulButton } from '../ui/PlayfulButton';

export interface Stage {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
}

export const projectStages: Stage[] = [
  { id: 'idea', label: 'IDEA', icon: <Lightbulb className="w-4 h-4" />, color: 'bg-[#FFF9DB] text-[#D48806]', desc: 'Hostel dorm brainstorming & feasibility study' },
  { id: 'research', label: 'RESEARCH', icon: <Search className="w-4 h-4" />, color: 'bg-[#E1F5FE] text-[#0288D1]', desc: 'Literature review, sensor selection & component sourcing' },
  { id: 'design', label: 'DESIGN', icon: <PenTool className="w-4 h-4" />, color: 'bg-[#FFD9E8] text-[#FF4757]', desc: '3D CAD modeling & custom PCB schematic routing' },
  { id: 'build', label: 'BUILD', icon: <Wrench className="w-4 h-4" />, color: 'bg-[#E1DCFF] text-[#6C5CE7]', desc: 'SMD soldering, chassis 3D printing & firmware flashing' },
  { id: 'test', label: 'TEST', icon: <Zap className="w-4 h-4" />, color: 'bg-[#FFE8D6] text-[#FF793F]', desc: 'LiDAR calibration, stress testing & sensor tuning' },
  { id: 'deploy', label: 'DEPLOY', icon: <Rocket className="w-4 h-4" />, color: 'bg-[#D4F8E8] text-[#10AC84]', desc: 'Campus autonomous run & open-source repo release' },
];

interface ProjectsHeroProps {
  currentStage: string;
  onStageChange: (stageId: string) => void;
  onSubmitClick: () => void;
}

export const ProjectsHero: React.FC<ProjectsHeroProps> = ({
  currentStage,
  onStageChange,
  onSubmitClick,
}) => {
  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-12 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-10 h-10" color="#FF793F" />
      </div>
      <div className="absolute top-14 right-1/4 opacity-40 pointer-events-none hidden sm:block">
        <SpiralScribble className="w-12 h-12" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FFE8D6] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#FF793F]">
              <span>🛠️</span> LAB NOTEBOOK & INVENTIONS
            </div>
            
            <div className="flex items-center gap-3 font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#121316]">
              <span>OUR</span>
              <span className="relative inline-block px-4 py-1 bg-[#FF793F] text-white rounded-2xl border-4 border-[#121316] shadow-pop rotate-[-2deg]">
                PROJECTS
                <Sparkles className="w-6 h-6 text-[#FFE600] absolute -top-3 -right-3 animate-pulse" />
              </span>
            </div>
          </div>

          {/* Submit Your Project CTA on Right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <PlayfulButton
              onClick={onSubmitClick}
              variant="primary"
              size="md"
              withConfetti
              icon={<Plus className="w-5 h-5 stroke-[3]" />}
            >
              Submit Your Project
            </PlayfulButton>
          </div>

        </div>

        {/* Supporting Narrative */}
        <div className="max-w-3xl mb-10">
          <p className="text-base sm:text-xl font-bold text-gray-700 leading-relaxed">
            From back-of-the-napkin sketches to functional hardware and production AI. Explore the active invention wall of NIAT Pune student builders.
          </p>
        </div>

        {/* Interactive Progression Tracker Bar */}
        <div className="p-4 sm:p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop-lg">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-[#121316]/10">
            <span className="font-mono text-xs font-black uppercase text-[#6C5CE7] flex items-center gap-1.5">
              <span>⚡</span> THE ATC BUILD LIFECYCLE (CLICK TO STEP THROUGH):
            </span>
            <span className="text-[11px] font-mono font-bold text-gray-500 hidden sm:inline">
              Watch the robot visual evolve below ↓
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {projectStages.map((stage, idx) => {
              const isActive = currentStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => onStageChange(stage.id)}
                  className={`p-3 rounded-2xl border-2 border-[#121316] flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#FFE600] text-[#121316] shadow-pop -translate-y-1 scale-105 font-black ring-2 ring-[#121316]'
                      : 'bg-[#FAF7F0] text-gray-700 hover:bg-white hover:text-[#121316] font-bold shadow-pop-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-xs">
                    <span className="font-mono text-[10px] text-gray-500">0{idx + 1}.</span>
                    {stage.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-display tracking-tight">
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
