import React from 'react';
import { Bot, Eye, Radio, Printer, ArrowRight, Sparkles, Cpu, Layers } from 'lucide-react';
import { LabDomain } from './InteractiveLabScene';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

interface LabDomainsProps {
  activeDomain: LabDomain;
  onDomainSelect: (domain: LabDomain) => void;
}

interface DomainInfo {
  id: LabDomain;
  title: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
  accent: string;
  desc: string;
  highlights: string[];
  equipment: string[];
}

export const LabDomains: React.FC<LabDomainsProps> = ({ activeDomain, onDomainSelect }) => {
  const domains: DomainInfo[] = [
    {
      id: 'robotics',
      title: 'Robotics & ROS',
      badge: 'AUTONOMOUS SYSTEMS',
      icon: <Bot className="w-8 h-8 text-[#6C5CE7]" />,
      color: 'bg-[#F0EBFF]',
      accent: 'border-[#6C5CE7]',
      desc: 'Building autonomous rovers, robotic manipulator arms, and kinematics controllers powered by ROS 2 Humble and Micro-ROS.',
      highlights: ['Differential drive kinematics', '2D LiDAR SLAM mapping', 'RViz & Gazebo simulation'],
      equipment: ['Custom Rover Kits', '6-DOF Articulated Arm', 'RPLiDAR A1/A2 Sensors'],
    },
    {
      id: 'ai',
      title: 'AI & Computer Vision',
      badge: 'EDGE INTELLIGENCE',
      icon: <Eye className="w-8 h-8 text-[#00D2D3]" />,
      color: 'bg-[#E1F5FE]',
      accent: 'border-[#00D2D3]',
      desc: 'Running real-time object detection, gesture estimation, and quantized neural networks on edge compute accelerators.',
      highlights: ['60 FPS YOLO inference', 'Spatial optical flow tracking', 'TensorRT quantization'],
      equipment: ['NVIDIA Jetson Orin Nano', 'Google Coral TPU USB', 'Intel RealSense D435'],
    },
    {
      id: 'iot',
      title: 'IoT & Embedded Systems',
      badge: 'TELEMETRY & MESH',
      icon: <Radio className="w-8 h-8 text-[#2ED573]" />,
      color: 'bg-[#E8F5E9]',
      accent: 'border-[#2ED573]',
      desc: 'Designing wireless sensor networks, LoRa long-range campus mesh nodes, and real-time MQTT telemetry dashboards.',
      highlights: ['LoRaWAN 1.2km mesh', 'Ultra low-power sleep modes', 'Solar energy harvesting'],
      equipment: ['ESP32-S3 Dev Boards', 'SX1262 LoRa Transceivers', 'BME680 Environmental Sensors'],
    },
    {
      id: 'prototyping',
      title: 'Rapid Prototyping',
      badge: 'HARDWARE FABRICATION',
      icon: <Printer className="w-8 h-8 text-[#FF6B6B]" />,
      color: 'bg-[#FFEBF2]',
      accent: 'border-[#FF6B6B]',
      desc: 'Turning CAD sketches into functional physical parts via high-speed CoreXY 3D printing and precision SMD soldering.',
      highlights: ['Custom PCB schematic routing', 'High-temp PETG & TPU printing', 'Hot air SMD reflow'],
      equipment: ['CoreXY 3D Printer Farm', 'Hakko Soldering Station', 'Rigol 100MHz Oscilloscope'],
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FF793F" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Layers className="w-5 h-5 text-[#6C5CE7]" />
              LAB DOMAINS
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFE600" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            Four Core Maker Disciplines 🔬
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            Click any domain to focus the central lab telemetry bench above:
          </p>
        </div>

        {/* 4 Interactive Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {domains.map((dom) => {
            const isActive = activeDomain === dom.id;
            return (
              <div
                key={dom.id}
                onClick={() => onDomainSelect(dom.id)}
                className={`group relative p-8 rounded-[36px] border-4 border-[#121316] transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  dom.color
                } ${
                  isActive
                    ? 'shadow-pop-xl -translate-y-2 ring-4 ring-[#121316] scale-[1.02]'
                    : 'shadow-pop-lg hover:shadow-pop-xl hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
                      {dom.icon}
                    </div>

                    <span className="px-3.5 py-1 bg-white text-[#121316] rounded-full border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
                      {dom.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mb-2">
                    {dom.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed mb-6">
                    {dom.desc}
                  </p>

                  {/* Key Highlights Checklist */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-xs font-mono font-black text-[#121316] uppercase block">
                      CORE CAPABILITIES:
                    </span>
                    {dom.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-800">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Hardware Tag Bar */}
                <div className="pt-4 border-t-2 border-[#121316]/15 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {dom.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="px-2.5 py-0.5 rounded-lg bg-white border border-[#121316] font-mono text-[11px] font-bold text-[#121316] shadow-pop-sm"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-mono font-black text-[#121316]">
                    {isActive ? '● BENCH ACTIVE' : 'CLICK TO FOCUS →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
