import React from 'react';
import { Bot, Eye, Radio, Printer, Sparkles, Wrench, Zap, Cpu } from 'lucide-react';

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
    <div className="relative w-full rounded-[44px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-10 paper-pattern overflow-hidden select-none">
      
      {/* Top Interactive Station Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b-3 border-[#121316]/15">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-[#121316] text-[#FFE600] font-mono font-black text-xs uppercase shadow-pop-sm flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-ping" />
            NIAT LAB 502 • LIVE BENCH SIMULATOR
          </span>
          <span className="text-xs font-mono font-bold text-gray-600 hidden md:inline">
            Click any station to trigger hardware diagnostics
          </span>
        </div>

        {/* 4 Interactive Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-full border-2 border-[#121316] shadow-pop-sm">
          {[
            { id: 'robotics', label: '🦾 Robotics Arm', icon: <Bot className="w-3.5 h-3.5" /> },
            { id: 'ai', label: '🖥️ AI Telemetry', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'prototyping', label: '🖨️ 3D & SMD', icon: <Printer className="w-3.5 h-3.5" /> },
            { id: 'iot', label: '🛸 Drone Mesh', icon: <Radio className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeDomain === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onDomainSelect(tab.id as LabDomain)}
                className={`px-3 sm:px-4 py-1.5 rounded-full font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-sm scale-105'
                    : 'text-gray-600 hover:text-[#121316] hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-STATION VIBRANT MAKER STUDIO GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* ========================================================= */}
        {/* STATION 1: ROBOTICS & ARTICULATED ARM */}
        {/* ========================================================= */}
        <div
          onClick={() => onDomainSelect('robotics')}
          className={`group relative p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
            activeDomain === 'robotics'
              ? 'bg-[#FFF9DB] shadow-pop-xl ring-4 ring-[#6C5CE7] -translate-y-1.5'
              : 'bg-white shadow-pop-md hover:shadow-pop-lg hover:-translate-y-1'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-[#6C5CE7] text-white font-mono font-black text-xs uppercase border-2 border-[#121316]">
              🦾 ROBOTICS & ROS BENCH
            </span>
            <span className="text-xs font-mono font-bold text-gray-500">
              {activeDomain === 'robotics' ? '● CALIBRATED' : 'BENCH #01'}
            </span>
          </div>

          {/* Large Vibrant Illustrated Scene */}
          <div className="relative w-full aspect-[16/10] bg-[#FAF7F0] rounded-2xl border-3 border-[#121316] p-4 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
            <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
              {/* Floor grid */}
              <line x1="20" y1="160" x2="300" y2="160" stroke="#121316" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.3" />
              
              {/* Articulated Robotic Arm */}
              <g transform="translate(110, 50)">
                {/* Heavy Base Turntable */}
                <rect x="-35" y="90" width="70" height="24" rx="6" fill="#121316" stroke="#121316" strokeWidth="2" />
                <rect x="-25" y="85" width="50" height="8" rx="2" fill="#FFE600" />
                {/* Joint 1 Base */}
                <circle cx="0" cy="80" r="18" fill="#6C5CE7" stroke="#121316" strokeWidth="3" />
                
                {/* Primary Arm (Yellow) */}
                <path d="M 0 80 L -30 20" stroke="#121316" strokeWidth="16" strokeLinecap="round" />
                <path d="M 0 80 L -30 20" stroke="#FFE600" strokeWidth="10" strokeLinecap="round" />
                
                {/* Joint 2 Elbow */}
                <circle cx="-30" cy="20" r="14" fill="#FF6B6B" stroke="#121316" strokeWidth="3" />
                
                {/* Forearm (Cyan) */}
                <path d="M -30 20 L 45 -25" stroke="#121316" strokeWidth="14" strokeLinecap="round" />
                <path d="M -30 20 L 45 -25" stroke="#00D2D3" strokeWidth="8" strokeLinecap="round" />
                
                {/* End Effector Wrist & Claw */}
                <circle cx="45" cy="-25" r="10" fill="#121316" stroke="#121316" strokeWidth="2" />
                <path d="M 45 -25 L 65 -35 M 45 -25 L 65 -15" stroke="#121316" strokeWidth="5" strokeLinecap="round" />
                
                {/* Laser Targeting Line */}
                <line x1="65" y1="-25" x2="110" y2="25" stroke="#FF4757" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
                
                {/* Target Sensor Cube */}
                <rect x="100" y="25" width="22" height="22" rx="4" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
                <text x="111" y="40" fontFamily="monospace" fontSize="9" fontWeight="900" textAnchor="middle" fill="#121316">AI</text>
              </g>

              {/* Ground Autonomous Rover */}
              <g transform="translate(190, 120)">
                <rect x="0" y="15" width="80" height="35" rx="10" fill="#121316" stroke="#121316" strokeWidth="2.5" />
                <rect x="5" y="20" width="70" height="10" fill="#FFE600" rx="2" />
                <rect x="-6" y="20" width="12" height="25" rx="4" fill="#636E72" stroke="#121316" strokeWidth="2" />
                <rect x="74" y="20" width="12" height="25" rx="4" fill="#636E72" stroke="#121316" strokeWidth="2" />
                {/* Spinning LiDAR Turret */}
                <circle cx="40" cy="8" r="12" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" />
                <circle cx="40" cy="8" r="4" fill="#2ED573" className="animate-ping" />
                {/* Headlights */}
                <circle cx="75" cy="40" r="4" fill="#00D2D3" />
              </g>
            </svg>

            {/* Sticker */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white rounded-lg border-2 border-[#121316] text-[10px] font-mono font-black shadow-pop-sm">
              ⚡ 6-DOF INVERSE KINEMATICS
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Articulated robotic arm testbed running Micro-ROS firmware & differential drive SLAM navigation.
          </p>
        </div>


        {/* ========================================================= */}
        {/* STATION 2: EDGE AI & VISION TELEMETRY */}
        {/* ========================================================= */}
        <div
          onClick={() => onDomainSelect('ai')}
          className={`group relative p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
            activeDomain === 'ai'
              ? 'bg-[#E1F5FE] shadow-pop-xl ring-4 ring-[#00D2D3] -translate-y-1.5'
              : 'bg-white shadow-pop-md hover:shadow-pop-lg hover:-translate-y-1'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-[#00D2D3] text-[#121316] font-mono font-black text-xs uppercase border-2 border-[#121316]">
              🖥️ AI & COMPUTER VISION HUB
            </span>
            <span className="text-xs font-mono font-bold text-gray-500">
              {activeDomain === 'ai' ? '● INFERENCE 60FPS' : 'BENCH #02'}
            </span>
          </div>

          {/* Large Vibrant Illustrated Scene */}
          <div className="relative w-full aspect-[16/10] bg-[#FAF7F0] rounded-2xl border-3 border-[#121316] p-4 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
            <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
              {/* Main Retro Monitor Frame */}
              <rect x="50" y="20" width="220" height="135" rx="14" fill="#121316" stroke="#121316" strokeWidth="3" />
              <rect x="60" y="30" width="200" height="115" rx="8" fill="#1E272E" />
              
              {/* Monitor Stand */}
              <line x1="160" y1="155" x2="160" y2="175" stroke="#121316" strokeWidth="10" strokeLinecap="round" />
              <rect x="120" y="172" width="80" height="10" rx="3" fill="#7F8C8D" stroke="#121316" strokeWidth="2" />

              {/* Neural Network Nodes & Tensor Graphs inside screen */}
              <g transform="translate(80, 45)">
                {/* Neural layers */}
                <circle cx="20" cy="20" r="7" fill="#00D2D3" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="20" cy="65" r="7" fill="#00D2D3" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="75" cy="42" r="9" fill="#FFE600" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="130" cy="20" r="7" fill="#FF6B6B" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="130" cy="65" r="7" fill="#2ED573" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Synapse Lines */}
                <line x1="20" y1="20" x2="75" y2="42" stroke="#00D2D3" strokeWidth="2" />
                <line x1="20" y1="65" x2="75" y2="42" stroke="#00D2D3" strokeWidth="2" />
                <line x1="75" y1="42" x2="130" y2="20" stroke="#FFE600" strokeWidth="2" />
                <line x1="75" y1="42" x2="130" y2="65" stroke="#FFE600" strokeWidth="2" />

                {/* Bounding Box on Target Object */}
                <rect x="105" y="10" width="48" height="30" rx="4" fill="none" stroke="#FF4757" strokeWidth="2" strokeDasharray="3 3" />
                <text x="108" y="8" fontFamily="monospace" fontSize="7" fontWeight="bold" fill="#FF4757">ROVER: 98%</text>
              </g>

              {/* Waveform Telemetry Graph on bottom of screen */}
              <path d="M 75 130 Q 110 110 145 130 T 215 130 T 245 130" stroke="#55EFC4" strokeWidth="2.5" fill="none" className="animate-pulse" />
              
              {/* Power LED */}
              <circle cx="250" cy="140" r="3" fill="#2ED573" className="animate-ping" />
            </svg>

            {/* Sticker */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#FFE600] rounded-lg border-2 border-[#121316] text-[10px] font-mono font-black shadow-pop-sm text-[#121316]">
              👁️ JETSON ORIN NANO 40 TOPS
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Real-time edge compute cluster executing YOLOv8 computer vision & spatial SLAM point clouds.
          </p>
        </div>


        {/* ========================================================= */}
        {/* STATION 3: 3D PRINTING & SMD REWORK BENCH */}
        {/* ========================================================= */}
        <div
          onClick={() => onDomainSelect('prototyping')}
          className={`group relative p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
            activeDomain === 'prototyping'
              ? 'bg-[#FFEBF2] shadow-pop-xl ring-4 ring-[#FF6B6B] -translate-y-1.5'
              : 'bg-white shadow-pop-md hover:shadow-pop-lg hover:-translate-y-1'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-[#FF6B6B] text-white font-mono font-black text-xs uppercase border-2 border-[#121316]">
              🖨️ 3D PRINT & SMD BENCH
            </span>
            <span className="text-xs font-mono font-bold text-gray-500">
              {activeDomain === 'prototyping' ? '● HEATED 350°C' : 'BENCH #03'}
            </span>
          </div>

          {/* Large Vibrant Illustrated Scene */}
          <div className="relative w-full aspect-[16/10] bg-[#FAF7F0] rounded-2xl border-3 border-[#121316] p-4 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
            <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
              {/* 3D Printer Enclosure */}
              <g transform="translate(45, 20)">
                <rect x="0" y="0" width="130" height="155" rx="14" fill="#121316" stroke="#121316" strokeWidth="3" />
                <rect x="10" y="15" width="110" height="125" rx="8" fill="#E1DCFF" />
                
                {/* Dual Gantry Rails */}
                <line x1="25" y1="25" x2="25" y2="125" stroke="#7F8C8D" strokeWidth="4" />
                <line x1="105" y1="25" x2="105" y2="125" stroke="#7F8C8D" strokeWidth="4" />
                
                {/* Heated Bed */}
                <rect x="25" y="110" width="80" height="14" rx="3" fill="#FF7675" stroke="#121316" strokeWidth="1.5" />
                
                {/* Printed Figurine Robot Part */}
                <polygon points="65,75 85,110 45,110" fill="#FFE600" stroke="#121316" strokeWidth="2" />
                
                {/* Extruder Gantry & Hotend */}
                <rect x="50" y="55" width="30" height="20" rx="4" fill="#0984E3" stroke="#121316" strokeWidth="2" />
                <polygon points="62,75 68,75 65,82" fill="#FF7675" />
                <circle cx="65" cy="85" r="5" fill="#FF4757" className="animate-ping" />

                {/* Top Filament Spool */}
                <circle cx="65" cy="-8" r="18" fill="#2ED573" stroke="#121316" strokeWidth="3" />
                <circle cx="65" cy="-8" r="6" fill="#FFFFFF" />
              </g>

              {/* SMD Soldering Station on Right */}
              <g transform="translate(200, 45)">
                {/* Soldering Base Station Unit */}
                <rect x="0" y="45" width="75" height="55" rx="10" fill="#E67E22" stroke="#121316" strokeWidth="3" />
                <rect x="10" y="55" width="55" height="22" rx="4" fill="#121316" />
                <text x="37" y="71" fontFamily="monospace" fontSize="12" fontWeight="900" textAnchor="middle" fill="#FFE600">350°C</text>
                
                {/* Soldering Iron Handle & Tip */}
                <line x1="20" y1="35" x2="55" y2="-10" stroke="#121316" strokeWidth="8" strokeLinecap="round" />
                <line x1="20" y1="35" x2="55" y2="-10" stroke="#00D2D3" strokeWidth="4" strokeLinecap="round" />
                <line x1="55" y1="-10" x2="68" y2="-25" stroke="#F1C40F" strokeWidth="3" />
                
                {/* Smoke Curling Up */}
                <path d="M 68 -28 Q 62 -45 75 -58" stroke="#7F8C8D" strokeWidth="2.5" strokeLinecap="round" fill="none" className="animate-pulse" />

                {/* PCB Board on Bench */}
                <rect x="-10" y="115" width="95" height="15" rx="3" fill="#27AE60" stroke="#121316" strokeWidth="2" />
                <circle cx="10" cy="122" r="3" fill="#FFE600" />
                <circle cx="30" cy="122" r="3" fill="#FFE600" />
                <circle cx="50" cy="122" r="3" fill="#FFE600" />
              </g>
            </svg>

            {/* Sticker */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white rounded-lg border-2 border-[#121316] text-[10px] font-mono font-black shadow-pop-sm">
              🔥 COREXY 500MM/S + SMD REWORK
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-700">
            High-speed rapid prototyping with Bambu CoreXY 3D printers and precision Hakko SMD rework tools.
          </p>
        </div>


        {/* ========================================================= */}
        {/* STATION 4: IOT & DRONE MESH */}
        {/* ========================================================= */}
        <div
          onClick={() => onDomainSelect('iot')}
          className={`group relative p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
            activeDomain === 'iot'
              ? 'bg-[#E8F5E9] shadow-pop-xl ring-4 ring-[#2ED573] -translate-y-1.5'
              : 'bg-white shadow-pop-md hover:shadow-pop-lg hover:-translate-y-1'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-[#2ED573] text-[#121316] font-mono font-black text-xs uppercase border-2 border-[#121316]">
              🛸 IOT & DRONE TESTBED
            </span>
            <span className="text-xs font-mono font-bold text-gray-500">
              {activeDomain === 'iot' ? '● MESH LINKED' : 'BENCH #04'}
            </span>
          </div>

          {/* Large Vibrant Illustrated Scene */}
          <div className="relative w-full aspect-[16/10] bg-[#FAF7F0] rounded-2xl border-3 border-[#121316] p-4 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
            <svg viewBox="0 0 320 200" fill="none" className="w-full h-full">
              
              {/* Radio wave telemetry arcs */}
              <circle cx="160" cy="80" r="50" stroke="#2ED573" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" className="animate-ping" />
              <circle cx="160" cy="80" r="85" stroke="#2ED573" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />

              {/* Floating Quadcopter Drone */}
              <g transform="translate(115, 45)" className="animate-float-slow">
                {/* Central Carbon Body */}
                <rect x="30" y="20" width="30" height="25" rx="8" fill="#121316" stroke="#121316" strokeWidth="2" />
                <circle cx="45" cy="32" r="6" fill="#FFE600" />
                
                {/* 4 Carbon Arms */}
                <line x1="0" y1="0" x2="90" y2="60" stroke="#6C5CE7" strokeWidth="6" strokeLinecap="round" />
                <line x1="0" y1="60" x2="90" y2="0" stroke="#6C5CE7" strokeWidth="6" strokeLinecap="round" />
                
                {/* Spinning Cyan Rotor Blurs */}
                <ellipse cx="0" cy="0" rx="20" ry="6" fill="#00D2D3" opacity="0.9" stroke="#121316" strokeWidth="1.5" />
                <ellipse cx="90" cy="0" rx="20" ry="6" fill="#00D2D3" opacity="0.9" stroke="#121316" strokeWidth="1.5" />
                <ellipse cx="0" cy="60" rx="20" ry="6" fill="#00D2D3" opacity="0.9" stroke="#121316" strokeWidth="1.5" />
                <ellipse cx="90" cy="60" rx="20" ry="6" fill="#00D2D3" opacity="0.9" stroke="#121316" strokeWidth="1.5" />

                {/* Strobe Beacon */}
                <circle cx="45" cy="20" r="4" fill="#FF4757" className="animate-ping" />
              </g>

              {/* LoRa Mesh Antenna & Solar Node on Bottom Left */}
              <g transform="translate(35, 120)">
                <rect x="0" y="20" width="50" height="35" rx="6" fill="#34495E" stroke="#121316" strokeWidth="2" />
                <line x1="25" y1="20" x2="25" y2="-15" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
                <circle cx="25" cy="-18" r="5" fill="#FFE600" />
                {/* Solar Cell Mini */}
                <polygon points="0,20 20,5 50,5 30,20" fill="#2980B9" stroke="#121316" strokeWidth="1.5" />
              </g>

              {/* ESP32 Breadboard Node on Bottom Right */}
              <g transform="translate(225, 130)">
                <rect x="0" y="10" width="65" height="30" rx="4" fill="#FFFFFF" stroke="#121316" strokeWidth="2" />
                <rect x="15" y="18" width="35" height="15" rx="2" fill="#121316" />
                <circle cx="5" cy="25" r="2.5" fill="#2ED573" className="animate-pulse" />
                <circle cx="58" cy="25" r="2.5" fill="#FF4757" />
              </g>

            </svg>

            {/* Sticker */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#2ED573] text-[#121316] rounded-lg border-2 border-[#121316] text-[10px] font-mono font-black shadow-pop-sm">
              📡 LORAWAN 1.2KM + ESP32 MESH
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Autonomous quadcopter waypoint flight testing arena and solar-powered campus environmental sensing mesh.
          </p>
        </div>

      </div>

    </div>
  );
};
