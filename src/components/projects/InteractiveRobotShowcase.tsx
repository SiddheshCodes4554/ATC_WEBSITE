import React from 'react';
import { ArrowUpRight, Cpu, Zap, Compass, Radio, CheckCircle, Sparkles, Lightbulb, Search, PenTool, Wrench, Rocket } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { projectStages, Stage } from './ProjectsHero';
import confetti from 'canvas-confetti';

interface InteractiveRobotShowcaseProps {
  currentStage: string;
  onStageChange: (stageId: string) => void;
}

export const InteractiveRobotShowcase: React.FC<InteractiveRobotShowcaseProps> = ({
  currentStage,
  onStageChange,
}) => {
  const currentStageObj = projectStages.find((s) => s.id === currentStage) || projectStages[0];

  const handleDeployClick = () => {
    onStageChange('deploy');
    confetti({
      particleCount: 60,
      spread: 80,
      colors: ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'],
    });
  };

  return (
    <section className="relative bg-[#FAF7F0] py-16 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading Banner */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FFE600] text-[#121316] font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm">
              ★ FEATURED PROTOTYPE
            </span>
            <span className="text-xs font-mono font-bold text-[#6C5CE7] hidden sm:inline">
              ATC LAB 5.0 FLAGSHIP HARDWARE
            </span>
          </div>
          <span className="text-xs font-mono font-extrabold text-gray-500">
            STAGE: <span className="text-[#FF793F] uppercase">{currentStage}</span>
          </span>
        </div>

        {/* Main Showcase Container (Split: Left Vertical Stages, Right Big Robot Interactive Canvas) */}
        <div className="relative p-6 sm:p-10 lg:p-12 rounded-[40px] bg-white border-4 border-[#121316] shadow-pop-xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Vertical Process Stages List + Metadata */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Category */}
            <div className="space-y-2">
              <span className="px-3 py-1 bg-[#EBE8FC] text-[#6C5CE7] rounded-full text-xs font-mono font-black uppercase border border-[#121316]">
                Robotics • ROS 2.0 • Edge AI
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight leading-tight">
                ROS ROBOT
              </h2>

              <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed">
                A smart robot designed for autonomous movement, real-time SLAM mapping, and edge computer vision experimentation.
              </p>
            </div>

            {/* Vertical Flow Stage Selector (Matching Inspiration Screen 4) */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono font-bold text-gray-500 uppercase">
                STEP THROUGH BUILD STAGES:
              </span>
              
              <div className="space-y-2">
                {projectStages.map((st, i) => {
                  const isCurrent = currentStage === st.id;
                  return (
                    <div
                      key={st.id}
                      onClick={() => onStageChange(st.id)}
                      className={`p-3 rounded-2xl border-2 border-[#121316] transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-[#FFE600] text-[#121316] shadow-pop translate-x-2 font-black ring-2 ring-[#121316]'
                          : 'bg-[#FAF7F0] text-gray-700 hover:bg-white hover:text-[#121316] font-bold shadow-pop-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white border border-[#121316] flex items-center justify-center text-xs font-mono font-bold">
                          0{i + 1}
                        </span>
                        <span className="text-sm font-display tracking-tight uppercase">
                          {st.label}
                        </span>
                      </div>

                      <span className="text-xs font-mono">
                        {isCurrent ? '● ACTIVE' : '○'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Explainer Box */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
              <span className="text-[10px] font-mono font-black text-gray-500 uppercase">
                CURRENT FOCUS ({currentStageObj.label}):
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#121316]">
                {currentStageObj.desc}
              </p>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <PlayfulButton
                to="/lab"
                variant="primary"
                size="md"
                icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
              >
                Explore the Lab
              </PlayfulButton>

              <button
                type="button"
                onClick={handleDeployClick}
                className="px-4 py-2 rounded-full bg-[#121316] text-[#FFE600] font-mono text-xs font-bold border-2 border-[#121316] shadow-pop-sm hover:scale-105 transition-transform"
              >
                🚀 Full Autonomous Mode
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic Progressive Vector Robot Canvas */}
          <div className="lg:col-span-7">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF7F0] border-4 border-[#121316] shadow-inner overflow-hidden flex flex-col items-center justify-center">
              
              {/* Blueprint Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#121316_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

              {/* Status Header inside canvas */}
              <div className="w-full flex items-center justify-between gap-2 mb-4 pb-2 border-b border-[#121316]/15 text-xs font-mono relative z-10">
                <span className="flex items-center gap-1.5 font-bold text-[#121316]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  TELEMETRY: {currentStage === 'deploy' ? 'ARMED & AUTONOMOUS' : 'TESTBENCH DIAGNOSTICS'}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FFE600] text-[#121316] font-bold border border-[#121316]">
                  FPS: 60 • ROS 2 HUMBLE
                </span>
              </div>

              {/* Progressive Dynamic Robot Vector Graphic */}
              <div className="relative z-10 w-full max-w-[420px] aspect-[4/3] flex items-center justify-center">
                <svg viewBox="0 0 360 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xl">
                  
                  {/* ========================================================= */}
                  {/* STAGE 1: IDEA (Blueprint Wireframe Outline & Nodes) */}
                  {/* ========================================================= */}
                  {currentStage === 'idea' && (
                    <g className="animate-fadeIn">
                      {/* Wireframe Outline */}
                      <rect x="70" y="90" width="220" height="90" rx="16" fill="none" stroke="#2E86DE" strokeWidth="2.5" strokeDasharray="6 4" />
                      <line x1="70" y1="135" x2="290" y2="135" stroke="#2E86DE" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="180" y1="90" x2="180" y2="180" stroke="#2E86DE" strokeWidth="1.5" strokeDasharray="4 4" />
                      
                      {/* Dimension lines */}
                      <line x1="60" y1="85" x2="60" y2="185" stroke="#FF6B6B" strokeWidth="1.5" />
                      <text x="45" y="140" fontFamily="monospace" fontSize="9" fill="#FF6B6B">240mm</text>
                      
                      {/* Brainstorm Nodes */}
                      <circle cx="180" cy="50" r="18" fill="#FFF9DB" stroke="#121316" strokeWidth="2" />
                      <text x="180" y="54" fontFamily="sans-serif" fontSize="14" textAnchor="middle">💡</text>
                      <text x="180" y="80" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#121316" textAnchor="middle">LiDAR Concept</text>
                    </g>
                  )}

                  {/* ========================================================= */}
                  {/* STAGE 2: RESEARCH (Pinouts & Sensor Layout) */}
                  {/* ========================================================= */}
                  {currentStage === 'research' && (
                    <g className="animate-fadeIn">
                      {/* PCB Substrate layout */}
                      <rect x="70" y="90" width="220" height="90" rx="16" fill="#0B0F19" stroke="#121316" strokeWidth="3" />
                      
                      {/* PCB Circuit Traces */}
                      <path d="M 100 110 H 160 V 150 H 260" stroke="#00D2D3" strokeWidth="2.5" strokeDasharray="4 3" />
                      <path d="M 120 160 H 200 V 110" stroke="#FFE600" strokeWidth="2" strokeDasharray="3 3" />
                      
                      {/* Sensor Pinout Points */}
                      <circle cx="100" cy="110" r="5" fill="#FF6B6B" stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="160" cy="150" r="5" fill="#FFE600" stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="260" cy="150" r="5" fill="#2ED573" stroke="#FFFFFF" strokeWidth="1.5" />
                      
                      {/* Component Chips */}
                      <rect x="150" y="105" width="60" height="40" rx="6" fill="#2C3E50" stroke="#00D2D3" strokeWidth="2" />
                      <text x="180" y="128" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#FFE600" textAnchor="middle">ESP32-S3</text>
                      
                      {/* LiDAR Field of view cone */}
                      <polygon points="180,45 130,10 230,10" fill="#6C5CE7" fillOpacity="0.2" stroke="#6C5CE7" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x="180" y="25" fontFamily="monospace" fontSize="8" fill="#6C5CE7" textAnchor="middle">360° FOV</text>
                    </g>
                  )}

                  {/* ========================================================= */}
                  {/* STAGE 3: DESIGN (CAD Chassis & Motor Geometry) */}
                  {/* ========================================================= */}
                  {currentStage === 'design' && (
                    <g className="animate-fadeIn">
                      {/* CAD Wireframe Isometric Base */}
                      <rect x="60" y="85" width="240" height="95" rx="14" fill="#D6EEFF" stroke="#121316" strokeWidth="3" />
                      <rect x="80" y="65" width="200" height="40" rx="10" fill="#E1DCFF" stroke="#121316" strokeWidth="2.5" />
                      
                      {/* Motor Mount brackets */}
                      <rect x="35" y="100" width="30" height="65" rx="8" fill="#FFFFFF" stroke="#121316" strokeWidth="2.5" />
                      <rect x="295" y="100" width="30" height="65" rx="8" fill="#FFFFFF" stroke="#121316" strokeWidth="2.5" />
                      
                      {/* Top LiDAR Turret Shell */}
                      <circle cx="180" cy="50" r="22" fill="#FFEAA7" stroke="#121316" strokeWidth="2.5" />
                      
                      {/* Engineering dimension tags */}
                      <text x="180" y="140" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#121316" textAnchor="middle">CAD MODEL v1.4</text>
                    </g>
                  )}

                  {/* ========================================================= */}
                  {/* STAGE 4: BUILD (Physical Assembled Hardware) */}
                  {/* ========================================================= */}
                  {currentStage === 'build' && (
                    <g className="animate-fadeIn">
                      {/* Lower Heavy Chassis */}
                      <rect x="60" y="90" width="240" height="95" rx="16" fill="#2D3436" stroke="#121316" strokeWidth="3.5" />
                      <rect x="80" y="70" width="200" height="40" rx="10" fill="#636E72" stroke="#121316" strokeWidth="3" />
                      
                      {/* Robust Rubber Tires */}
                      <rect x="35" y="100" width="30" height="75" rx="8" fill="#121316" stroke="#121316" strokeWidth="3" />
                      <rect x="295" y="100" width="30" height="75" rx="8" fill="#121316" stroke="#121316" strokeWidth="3" />
                      <circle cx="50" cy="138" r="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
                      <circle cx="310" cy="138" r="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
                      
                      {/* Turret Assembly */}
                      <rect x="160" y="45" width="40" height="30" rx="6" fill="#0984E3" stroke="#121316" strokeWidth="2.5" />
                      <circle cx="180" cy="38" r="20" fill="#6C5CE7" stroke="#121316" strokeWidth="3" />
                      
                      {/* Antenna */}
                      <line x1="230" y1="70" x2="245" y2="25" stroke="#121316" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="247" cy="23" r="4.5" fill="#FF7675" />
                      
                      <text x="180" y="145" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#FFE600" textAnchor="middle">SMD BOARD ASSEMBLED</text>
                    </g>
                  )}

                  {/* ========================================================= */}
                  {/* STAGE 5: TEST (LiDAR Laser Beams & Diagnostics) */}
                  {/* ========================================================= */}
                  {currentStage === 'test' && (
                    <g className="animate-fadeIn">
                      {/* Laser Radar Sweep Arc */}
                      <path d="M 90 40 Q 180 -10 270 40" stroke="#00D2D3" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse" />
                      <path d="M 60 60 Q 180 -30 300 60" stroke="#00D2D3" strokeWidth="2" strokeDasharray="5 5" fill="none" />
                      
                      {/* Robot Body */}
                      <rect x="60" y="90" width="240" height="95" rx="16" fill="#2D3436" stroke="#121316" strokeWidth="3.5" />
                      <rect x="80" y="70" width="200" height="40" rx="10" fill="#636E72" stroke="#121316" strokeWidth="3" />
                      
                      {/* Wheels */}
                      <rect x="35" y="100" width="30" height="75" rx="8" fill="#121316" stroke="#121316" strokeWidth="3" />
                      <rect x="295" y="100" width="30" height="75" rx="8" fill="#121316" stroke="#121316" strokeWidth="3" />
                      <circle cx="50" cy="138" r="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
                      <circle cx="310" cy="138" r="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />

                      {/* Headlights Glowing */}
                      <circle cx="85" cy="140" r="7" fill="#55EFC4" className="animate-ping" />
                      <circle cx="275" cy="140" r="7" fill="#55EFC4" className="animate-ping" />

                      {/* Active LiDAR Eye */}
                      <rect x="160" y="45" width="40" height="30" rx="6" fill="#0984E3" stroke="#121316" strokeWidth="2.5" />
                      <circle cx="180" cy="38" r="20" fill="#6C5CE7" stroke="#121316" strokeWidth="3" />
                      <circle cx="180" cy="38" r="8" fill="#FF4757" className="animate-pulse" />
                    </g>
                  )}

                  {/* ========================================================= */}
                  {/* STAGE 6: DEPLOY (Full High-Fidelity Autonomous Mode) */}
                  {/* ========================================================= */}
                  {currentStage === 'deploy' && (
                    <g className="animate-fadeIn">
                      {/* Telemetry HUD Circle */}
                      <circle cx="180" cy="130" r="115" stroke="#FFE600" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
                      
                      {/* Robot Main Chassis with Gold & Purple livery */}
                      <rect x="60" y="90" width="240" height="95" rx="16" fill="#121316" stroke="#121316" strokeWidth="3.5" />
                      <rect x="80" y="70" width="200" height="40" rx="10" fill="#6C5CE7" stroke="#121316" strokeWidth="3" />
                      
                      {/* ATC Gold Racing Stripe */}
                      <rect x="60" y="115" width="240" height="15" fill="#FFE600" />
                      
                      {/* Wheels */}
                      <rect x="35" y="100" width="30" height="75" rx="8" fill="#121316" stroke="#121316" strokeWidth="3" />
                      <rect x="295" y="100" width="30" height="75" rx="8" fill="#121316" stroke="#121316" strokeWidth="3" />
                      <circle cx="50" cy="138" r="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
                      <circle cx="310" cy="138" r="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />

                      {/* Headlights High Beam */}
                      <circle cx="85" cy="140" r="7" fill="#48DBFB" />
                      <circle cx="275" cy="140" r="7" fill="#48DBFB" />

                      {/* Active LiDAR Rotating Turret */}
                      <rect x="160" y="45" width="40" height="30" rx="6" fill="#FF793F" stroke="#121316" strokeWidth="2.5" />
                      <circle cx="180" cy="38" r="20" fill="#6C5CE7" stroke="#121316" strokeWidth="3" />
                      <circle cx="180" cy="38" r="8" fill="#FFE600" className="animate-ping" />

                      {/* Antenna */}
                      <line x1="230" y1="70" x2="245" y2="25" stroke="#121316" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="247" cy="23" r="5" fill="#2ED573" className="animate-pulse" />

                      {/* ATC Tag on Chassis */}
                      <text x="180" y="155" fontFamily="sans-serif" fontSize="13" fontWeight="900" fill="#FFE600" textAnchor="middle">
                        ATC ROVER 5.0
                      </text>
                    </g>
                  )}

                </svg>
              </div>

              {/* Bottom Specs HUD Ticker */}
              <div className="w-full mt-4 pt-3 border-t border-[#121316]/15 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-white rounded-xl border border-[#121316]/20">
                  <span className="text-[10px] text-gray-500 block">NAVIGATION</span>
                  <span className="font-black text-[#121316]">2D SLAM LiDAR</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#121316]/20">
                  <span className="text-[10px] text-gray-500 block">COMPUTE</span>
                  <span className="font-black text-[#6C5CE7]">Jetson + ESP32</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-[#121316]/20">
                  <span className="text-[10px] text-gray-500 block">TOP SPEED</span>
                  <span className="font-black text-emerald-600">1.8 m/s</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
