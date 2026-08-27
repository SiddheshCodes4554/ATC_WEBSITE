import React, { useState } from 'react';
import { ProjectsHero } from '../components/projects/ProjectsHero';
import { SubmitProjectModal } from '../components/projects/SubmitProjectModal';
import { Sparkles, Plus, Rocket, Hammer, Lightbulb, Compass, Wrench, ArrowUpRight } from 'lucide-react';
import { SparkleDoodle, RetroRobotMascot } from '../components/doodles/DoodleSvgs';
import { PlayfulButton } from '../components/ui/PlayfulButton';

export const ProjectsPage: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<string>('idea');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION WITH PROCESS TRACKER */}
      <ProjectsHero
        currentStage={currentStage}
        onStageChange={(stage) => setCurrentStage(stage)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* 2. PLAYFUL "NO PROJECTS YET / INVENTIONS UNDER COOKING" SHOWCASE */}
      <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
        
        {/* Background Doodles */}
        <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
          <SparkleDoodle className="w-12 h-12" color="#FF793F" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-40 pointer-events-none hidden md:block">
          <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Empty State Container */}
          <div className="p-8 sm:p-14 rounded-[44px] bg-white border-4 border-[#121316] shadow-pop-xl text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            
            {/* Top Classified / Under Cooking Stamp */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9DB] text-[#121316] font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm rotate-[-2deg]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4757] animate-ping" />
              ⚡ INVENTIONS IN THE OVEN • COHORT 2026
            </div>

            {/* Mascot & Illustrated Blueprint */}
            <div className="relative my-4">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#FFE600] border-4 border-[#121316] shadow-pop-lg flex items-center justify-center animate-wiggle">
                <RetroRobotMascot className="w-20 sm:w-24 h-auto" />
              </div>

              {/* Floating Sticky Note */}
              <div className="absolute -top-3 -right-8 sm:-right-12 px-3 py-1.5 bg-[#FFD9E8] rounded-xl border-2 border-[#121316] shadow-pop-sm text-xs font-hand font-bold text-[#121316] rotate-6 hidden sm:block">
                "Soldering in progress! 🛠️"
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight leading-tight">
                NO PROJECTS YET.<br />
                <span className="text-[#FF793F]">SOMETHING BIG</span> IS BEING BUILT.
              </h2>
              
              <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                ATC Lab 5.0 student builders are currently engineering our first batch of autonomous rovers, edge AI vision models, and IoT telemetry stations.
              </p>
            </div>

            {/* 3 Steps to be the First Project */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              
              <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm space-y-1">
                <span className="w-7 h-7 rounded-xl bg-[#FFE600] border border-[#121316] font-mono text-xs font-black flex items-center justify-center">
                  01
                </span>
                <h4 className="font-black text-sm text-[#121316]">Got a Hardware Idea?</h4>
                <p className="text-xs font-bold text-gray-600">From PCB prototypes to autonomous drone software.</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm space-y-1">
                <span className="w-7 h-7 rounded-xl bg-[#6C5CE7] text-white border border-[#121316] font-mono text-xs font-black flex items-center justify-center">
                  02
                </span>
                <h4 className="font-black text-sm text-[#121316]">Get Lab 5.0 Grants</h4>
                <p className="text-xs font-bold text-gray-600">Access Jetson compute, 3D printing & component funding.</p>
              </div>

              <div className="p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm space-y-1">
                <span className="w-7 h-7 rounded-xl bg-[#2ED573] border border-[#121316] font-mono text-xs font-black flex items-center justify-center">
                  03
                </span>
                <h4 className="font-black text-sm text-[#121316]">Be Featured #01</h4>
                <p className="text-xs font-bold text-gray-600">Your build will be the inaugural project on this wall!</p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <PlayfulButton
                onClick={() => setIsSubmitModalOpen(true)}
                variant="primary"
                size="lg"
                withConfetti
                icon={<Plus className="w-5 h-5 stroke-[3]" />}
              >
                Submit Your Project ↗
              </PlayfulButton>

              <PlayfulButton
                to="/lab"
                variant="secondary"
                size="lg"
                icon={<ArrowUpRight className="w-5 h-5 stroke-[3]" />}
              >
                Explore ATC 5.0 Lab ↗
              </PlayfulButton>
            </div>

          </div>

        </div>
      </section>

      {/* SUBMIT PROJECT PITCH MODAL */}
      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

    </div>
  );
};
