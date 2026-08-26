import React from 'react';

export type LabDomain = 'robotics' | 'ai' | 'iot' | 'prototyping';

interface InteractiveLabSceneProps {
  activeDomain: LabDomain;
  onDomainSelect: (domain: LabDomain) => void;
}

export const InteractiveLabScene: React.FC<InteractiveLabSceneProps> = ({
  activeDomain,
  onDomainSelect,
}) => {
  return (
    <div className="relative w-full rounded-[40px] bg-[#121316] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-10 overflow-hidden select-none text-white">
      
      {/* Background Lab Neon Gradients */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#6C5CE7]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#00D2D3]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Lab Station Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-white/10 relative z-10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#2ED573] animate-ping" />
          <span className="font-black text-[#FFE600] uppercase tracking-wider">
            NIAT LAB 502 • LIVE WORKSPACE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400">ACTIVE BENCH:</span>
          <span className="px-2.5 py-0.5 rounded bg-[#6C5CE7] text-white font-black uppercase text-[11px] border border-white/20">
            {activeDomain === 'robotics' && '🤖 ROBOTICS & ROS ARM'}
            {activeDomain === 'ai' && '👁️ AI & VISION TELEMETRY'}
            {activeDomain === 'iot' && '📡 IOT & EMBEDDED SENSORS'}
            {activeDomain === 'prototyping' && '🖨️ 3D PRINTING & SMD BENCH'}
          </span>
        </div>
      </div>

      {/* Large Dynamic SVG Lab Environment */}
      <div className="relative z-10 w-full aspect-[16/9] max-h-[500px] flex items-center justify-center">
        <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          
          {/* ========================================================= */}
          {/* LAB ROOM GRID & FLOOR PERSPECTIVE */}
          {/* ========================================================= */}
          {/* Grid floor */}
          <line x1="50" y1="360" x2="750" y2="360" stroke="#2D3436" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="100" y1="390" x2="700" y2="390" stroke="#2D3436" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50" y1="360" x2="0" y2="450" stroke="#2D3436" strokeWidth="2" />
          <line x1="750" y1="360" x2="800" y2="450" stroke="#2D3436" strokeWidth="2" />

          {/* Pegboard on Wall */}
          <rect x="50" y="40" width="700" height="120" rx="12" fill="#1E272E" stroke="#2D3436" strokeWidth="2" />
          {/* Pegboard holes */}
          {[100, 160, 220, 280, 340, 400, 460, 520, 580, 640, 700].map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy="70" r="2" fill="#485460" />
              <circle cx={x} cy="100" r="2" fill="#485460" />
              <circle cx={x} cy="130" r="2" fill="#485460" />
            </React.Fragment>
          ))}

          {/* Hanging Tools on Wall */}
          <rect x="120" y="60" width="10" height="50" rx="3" fill="#FFE600" />
          <polygon points="120,60 130,60 125,45" fill="#FF7675" />
          {/* Wire Spools on Wall */}
          <circle cx="280" cy="90" r="16" fill="#FF4757" stroke="#121316" strokeWidth="2" />
          <circle cx="320" cy="90" r="16" fill="#2ED573" stroke="#121316" strokeWidth="2" />
          <circle cx="360" cy="90" r="16" fill="#0984E3" stroke="#121316" strokeWidth="2" />


          {/* ========================================================= */}
          {/* STATION 1: ROBOTICS & ROS ARM (Left Workbench) */}
          {/* ========================================================= */}
          <g 
            onClick={() => onDomainSelect('robotics')}
            className="cursor-pointer transition-all duration-300 group"
          >
            {/* Workbench Table */}
            <rect x="50" y="240" width="220" height="120" rx="10" fill="#2C3E50" stroke="#121316" strokeWidth="3" />
            <rect x="60" y="230" width="200" height="18" rx="4" fill="#34495E" stroke="#121316" strokeWidth="2" />
            
            {/* Active Glow Ring if active */}
            {activeDomain === 'robotics' && (
              <circle cx="160" cy="200" r="85" stroke="#FFE600" strokeWidth="3" strokeDasharray="8 6" className="animate-spin" />
            )}

            {/* Articulated Robotic Arm */}
            <g transform="translate(140, 140)">
              {/* Heavy Base Turntable */}
              <rect x="-25" y="70" width="50" height="20" rx="4" fill="#121316" stroke="#FFE600" strokeWidth="2" />
              {/* Joint 1 */}
              <circle cx="0" cy="65" r="14" fill="#6C5CE7" stroke="#FFFFFF" strokeWidth="2" />
              {/* Lower Arm Segment */}
              <line x1="0" y1="65" x2="-25" y2="10" stroke="#FFE600" strokeWidth="10" strokeLinecap="round" />
              {/* Joint 2 */}
              <circle cx="-25" cy="10" r="12" fill="#FF4757" stroke="#FFFFFF" strokeWidth="2" />
              {/* Upper Arm Segment */}
              <line x1="-25" y1="10" x2="30" y2="-30" stroke="#00D2D3" strokeWidth="8" strokeLinecap="round" />
              {/* End Effector Gripper */}
              <circle cx="30" cy="-30" r="8" fill="#FFFFFF" />
              <path d="M 30 -30 L 45 -40 M 30 -30 L 45 -20" stroke="#FFE600" strokeWidth="4" strokeLinecap="round" />
              {/* Laser Beacon */}
              <line x1="45" y1="-30" x2="80" y2="10" stroke="#FF4757" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
            </g>

            {/* Mini Autonomous Ground Rover on Floor */}
            <g transform="translate(90, 360)">
              <rect x="0" y="0" width="65" height="30" rx="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
              <rect x="-5" y="5" width="10" height="20" rx="4" fill="#121316" />
              <rect x="60" y="5" width="10" height="20" rx="4" fill="#121316" />
              <circle cx="32" cy="-5" r="8" fill="#6C5CE7" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="32" y="18" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#121316">ROV-01</text>
            </g>

            {/* Label Badge */}
            <rect x="80" y="270" width="140" height="24" rx="6" fill="#121316" stroke="#FFE600" strokeWidth="2" />
            <text x="150" y="286" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#FFE600" textAnchor="middle">
              ROBOTICS & ROS BENCH
            </text>
          </g>


          {/* ========================================================= */}
          {/* STATION 2: AI & COMPUTER VISION TELEMETRY (Center Monitors) */}
          {/* ========================================================= */}
          <g 
            onClick={() => onDomainSelect('ai')}
            className="cursor-pointer transition-all duration-300 group"
          >
            {/* Center Desk */}
            <rect x="290" y="230" width="220" height="130" rx="10" fill="#2C3E50" stroke="#121316" strokeWidth="3" />
            <rect x="280" y="220" width="240" height="18" rx="4" fill="#34495E" stroke="#121316" strokeWidth="2" />

            {/* Active Glow Ring if active */}
            {activeDomain === 'ai' && (
              <circle cx="400" cy="170" r="95" stroke="#00D2D3" strokeWidth="3" strokeDasharray="8 6" className="animate-spin" />
            )}

            {/* Monitor 1 (Main Large Display) */}
            <rect x="330" y="110" width="140" height="95" rx="8" fill="#0B0F19" stroke="#121316" strokeWidth="3" />
            <line x1="400" y1="205" x2="400" y2="225" stroke="#121316" strokeWidth="6" />
            <rect x="375" y="222" width="50" height="6" rx="2" fill="#7F8C8D" />

            {/* AI Screen Content: Bounding Boxes & Neural Nodes */}
            <g transform="translate(340, 120)">
              {/* Neural network nodes */}
              <circle cx="20" cy="20" r="4" fill="#00D2D3" />
              <circle cx="20" cy="50" r="4" fill="#00D2D3" />
              <circle cx="60" cy="35" r="5" fill="#FFE600" />
              <circle cx="100" cy="25" r="4" fill="#FF4757" />
              <circle cx="100" cy="55" r="4" fill="#2ED573" />
              <line x1="20" y1="20" x2="60" y2="35" stroke="#00D2D3" strokeWidth="1.5" />
              <line x1="20" y1="50" x2="60" y2="35" stroke="#00D2D3" strokeWidth="1.5" />
              <line x1="60" y1="35" x2="100" y2="25" stroke="#FFE600" strokeWidth="1.5" />
              <line x1="60" y1="35" x2="100" y2="55" stroke="#FFE600" strokeWidth="1.5" />
              {/* Waveform graph */}
              <path d="M 10 70 Q 30 55 50 70 T 90 70 T 110 70" stroke="#55EFC4" strokeWidth="2" fill="none" className="animate-pulse" />
            </g>

            {/* Monitor 2 (Vertical Code Screen on Left of Desk) */}
            <rect x="295" y="130" width="30" height="75" rx="4" fill="#1E272E" stroke="#121316" strokeWidth="2" />
            <line x1="300" y1="145" x2="320" y2="145" stroke="#00D2D3" strokeWidth="1.5" />
            <line x1="300" y1="155" x2="315" y2="155" stroke="#2ED573" strokeWidth="1.5" />
            <line x1="300" y1="165" x2="322" y2="165" stroke="#FFE600" strokeWidth="1.5" />

            {/* Keyboard & Mouse on desk */}
            <rect x="360" y="225" width="60" height="12" rx="3" fill="#121316" />
            <circle cx="435" cy="231" r="4" fill="#FFE600" />

            {/* Label Badge */}
            <rect x="330" y="270" width="140" height="24" rx="6" fill="#121316" stroke="#00D2D3" strokeWidth="2" />
            <text x="400" y="286" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#00D2D3" textAnchor="middle">
              AI & VISION HUB
            </text>
          </g>


          {/* ========================================================= */}
          {/* STATION 3: RAPID PROTOTYPING & 3D PRINTER (Right Bench) */}
          {/* ========================================================= */}
          <g 
            onClick={() => onDomainSelect('prototyping')}
            className="cursor-pointer transition-all duration-300 group"
          >
            {/* Right Desk */}
            <rect x="530" y="240" width="220" height="120" rx="10" fill="#2C3E50" stroke="#121316" strokeWidth="3" />
            <rect x="520" y="230" width="240" height="18" rx="4" fill="#34495E" stroke="#121316" strokeWidth="2" />

            {/* Active Glow Ring if active */}
            {activeDomain === 'prototyping' && (
              <circle cx="640" cy="180" r="90" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="8 6" className="animate-spin" />
            )}

            {/* 3D Printer Frame */}
            <g transform="translate(560, 110)">
              {/* Outer Frame */}
              <rect x="0" y="0" width="90" height="110" rx="8" fill="#121316" stroke="#FFFFFF" strokeWidth="2.5" />
              {/* Heated Bed */}
              <rect x="15" y="80" width="60" height="12" rx="2" fill="#D63031" />
              {/* Active 3D Printed Part */}
              <polygon points="45,55 60,80 30,80" fill="#FFE600" stroke="#121316" strokeWidth="1.5" />
              {/* Gantry Rails */}
              <line x1="15" y1="15" x2="15" y2="90" stroke="#7F8C8D" strokeWidth="3" />
              <line x1="75" y1="15" x2="75" y2="90" stroke="#7F8C8D" strokeWidth="3" />
              {/* Extruder Head & Nozzle */}
              <rect x="35" y="45" width="20" height="15" rx="3" fill="#0984E3" />
              <polygon points="43,60 47,60 45,64" fill="#FF7675" />
              {/* Laser / Heat Glow */}
              <circle cx="45" cy="65" r="4" fill="#FF4757" className="animate-ping" />
              {/* Top Filament Spool */}
              <circle cx="45" cy="-8" r="14" fill="#2ED573" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>

            {/* Soldering Iron Station on Right Bench */}
            <g transform="translate(670, 180)">
              <rect x="0" y="20" width="45" height="25" rx="4" fill="#E67E22" stroke="#121316" strokeWidth="1.5" />
              <text x="22" y="36" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">350°C</text>
              {/* Iron Pen */}
              <line x1="10" y1="15" x2="35" y2="-10" stroke="#BDC3C7" strokeWidth="4" strokeLinecap="round" />
              <line x1="35" y1="-10" x2="42" y2="-18" stroke="#F1C40F" strokeWidth="2" />
              {/* Smoke curling up */}
              <path d="M 42 -20 Q 40 -35 48 -45" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
            </g>

            {/* Label Badge */}
            <rect x="570" y="270" width="140" height="24" rx="6" fill="#121316" stroke="#FF6B6B" strokeWidth="2" />
            <text x="640" y="286" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#FF6B6B" textAnchor="middle">
              3D PRINT & SMD BENCH
            </text>
          </g>


          {/* ========================================================= */}
          {/* STATION 4: IOT & DRONE TESTBED (Floating Top Center Drone & Sensors) */}
          {/* ========================================================= */}
          <g 
            onClick={() => onDomainSelect('iot')}
            className="cursor-pointer transition-all duration-300 group"
          >
            {/* Active Glow Ring for Drone */}
            {activeDomain === 'iot' && (
              <circle cx="400" cy="65" r="55" stroke="#2ED573" strokeWidth="3" strokeDasharray="8 6" className="animate-spin" />
            )}

            {/* Floating Quadcopter Drone */}
            <g transform="translate(365, 45)" className="animate-float-slow">
              <rect x="25" y="15" width="20" height="15" rx="4" fill="#FFE600" stroke="#121316" strokeWidth="2" />
              {/* Drone Arms */}
              <line x1="0" y1="0" x2="70" y2="40" stroke="#6C5CE7" strokeWidth="3" />
              <line x1="0" y1="40" x2="70" y2="0" stroke="#6C5CE7" strokeWidth="3" />
              {/* Spinning Rotors */}
              <ellipse cx="0" cy="0" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
              <ellipse cx="70" cy="0" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
              <ellipse cx="0" cy="40" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
              <ellipse cx="70" cy="40" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
              {/* Blinking Signal Beacon */}
              <circle cx="35" cy="22" r="3" fill="#FF4757" className="animate-ping" />
            </g>

            {/* Radio Signal Waves radiating from drone */}
            <path d="M 370 20 Q 400 5 430 20" stroke="#2ED573" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.8" />
            <path d="M 355 10 Q 400 -10 445 10" stroke="#2ED573" strokeWidth="2" strokeDasharray="3 3" fill="none" opacity="0.6" />
          </g>

        </svg>
      </div>

      {/* Domain Quick Select Pills at bottom */}
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 relative z-10">
        {[
          { id: 'robotics', label: '🤖 Robotics & ROS', color: 'hover:bg-[#FFE600] hover:text-[#121316]' },
          { id: 'ai', label: '👁️ AI & Vision', color: 'hover:bg-[#00D2D3] hover:text-[#121316]' },
          { id: 'iot', label: '📡 IoT & Drone Mesh', color: 'hover:bg-[#2ED573] hover:text-[#121316]' },
          { id: 'prototyping', label: '🖨️ Rapid Prototyping', color: 'hover:bg-[#FF6B6B] hover:text-white]' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onDomainSelect(item.id as LabDomain)}
            className={`px-4 py-2 rounded-full font-mono text-xs font-black transition-all cursor-pointer border-2 ${
              activeDomain === item.id
                ? 'bg-[#FFE600] text-[#121316] border-[#FFE600] shadow-pop-sm scale-105'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

    </div>
  );
};
