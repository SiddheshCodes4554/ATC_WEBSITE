import React from 'react';
import { Sparkles, ArrowUpRight, Cpu, Brain, CloudSun, Eye } from 'lucide-react';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';
import { PlayfulButton } from '../ui/PlayfulButton';

// Bespoke Project Vector Illustrations
const ROSRobotIllustration: React.FC = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    {/* Rover Chassis */}
    <rect x="40" y="55" width="120" height="40" rx="10" fill="#2d3436" stroke="#121316" strokeWidth="3" />
    <rect x="50" y="45" width="100" height="20" rx="6" fill="#636e72" stroke="#121316" strokeWidth="2.5" />
    
    {/* Wheels with treads */}
    <rect x="25" y="65" width="25" height="35" rx="6" fill="#121316" stroke="#121316" strokeWidth="2" />
    <rect x="150" y="65" width="25" height="35" rx="6" fill="#121316" stroke="#121316" strokeWidth="2" />
    <circle cx="37" cy="82" r="6" fill="#FFE600" />
    <circle cx="162" cy="82" r="6" fill="#FFE600" />

    {/* LiDAR Turret & Camera Mast */}
    <rect x="90" y="25" width="20" height="22" rx="4" fill="#0984e3" stroke="#121316" strokeWidth="2" />
    <circle cx="100" cy="20" r="14" fill="#6c5ce7" stroke="#121316" strokeWidth="2.5" />
    <circle cx="100" cy="20" r="6" fill="#FFE600" className="animate-pulse" />
    
    {/* Antenna */}
    <line x1="130" y1="45" x2="140" y2="18" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
    <circle cx="142" cy="16" r="3.5" fill="#FF6B6B" />

    {/* Front LED Headlights */}
    <circle cx="55" cy="75" r="4.5" fill="#55efc4" className="animate-pulse" />
    <circle cx="145" cy="75" r="4.5" fill="#55efc4" className="animate-pulse" />
  </svg>
);

const AIJournalIllustration: React.FC = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    {/* Notebook Base */}
    <rect x="45" y="20" width="110" height="90" rx="12" fill="#E1DCFF" stroke="#121316" strokeWidth="3" />
    {/* Spiral Binding */}
    <line x1="60" y1="20" x2="60" y2="110" stroke="#121316" strokeWidth="2" strokeDasharray="4 4" />
    
    {/* AI Brain Wave */}
    <circle cx="105" cy="65" r="28" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" />
    <path d="M92 65 Q105 45 118 65 T105 85" stroke="#FFE600" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse" />
    <circle cx="105" cy="65" r="4" fill="#FFFFFF" />

    {/* Floating Tag */}
    <rect x="110" y="15" width="45" height="18" rx="6" fill="#FFD32A" stroke="#121316" strokeWidth="2" />
    <text x="132" y="28" fontFamily="sans-serif" fontSize="9" fontWeight="900" textAnchor="middle" fill="#121316">NLP</text>
  </svg>
);

const IoTWeatherIllustration: React.FC = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    {/* Weather Node Enclosure */}
    <rect x="60" y="35" width="80" height="70" rx="14" fill="#D4F8E8" stroke="#121316" strokeWidth="3" />
    
    {/* Solar Mini Panel */}
    <polygon points="50,35 150,35 140,15 60,15" fill="#2E86DE" stroke="#121316" strokeWidth="2.5" />
    <line x1="75" y1="15" x2="80" y2="35" stroke="#ffffff" strokeWidth="1.5" />
    <line x1="100" y1="15" x2="100" y2="35" stroke="#ffffff" strokeWidth="1.5" />
    <line x1="125" y1="15" x2="120" y2="35" stroke="#ffffff" strokeWidth="1.5" />

    {/* Sun Cloud Icon on Enclosure */}
    <circle cx="85" cy="65" r="12" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <ellipse cx="105" cy="72" rx="16" ry="10" fill="#48DBFB" stroke="#121316" strokeWidth="2" />

    {/* Sensor probe */}
    <line x1="100" y1="105" x2="100" y2="125" stroke="#121316" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const CVLabIllustration: React.FC = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    {/* Lens Target Bounding Box */}
    <rect x="40" y="20" width="120" height="90" rx="12" fill="#FFD9E8" stroke="#121316" strokeWidth="3" />
    
    {/* Bounding Corner Brackets */}
    <path d="M50 35 H45 V40" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
    <path d="M150 35 H155 V40" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 95 H45 V90" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
    <path d="M150 95 H155 V90" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />

    {/* Center Eye / Lens */}
    <circle cx="100" cy="65" r="24" fill="#121316" stroke="#121316" strokeWidth="2" />
    <circle cx="100" cy="65" r="14" fill="#FF6B6B" />
    <circle cx="100" cy="65" r="6" fill="#FFE600" className="animate-ping" />
    <circle cx="105" cy="60" r="3" fill="#FFFFFF" />
  </svg>
);

export const ProjectsSection: React.FC = () => {
  const projects = [
    {
      title: 'ROS Robot',
      desc: 'A smart autonomous navigation rover equipped with LiDAR mapping, SLAM, and computer vision obstacle detection.',
      tags: ['Robotics', 'ROS 2', 'AI', 'Python'],
      bg: 'bg-[#FFF9DB]',
      illustration: <ROSRobotIllustration />,
      status: 'Live Prototype',
      statusColor: 'bg-emerald-400 text-[#121316]',
    },
    {
      title: 'AI Journal Analyzer',
      desc: 'Deep semantic sentiment analysis and psychological reflection tracking powered by localized LLM pipelines.',
      tags: ['AI / ML', 'NLP', 'Next.js', 'PyTorch'],
      bg: 'bg-[#F0EBFF]',
      illustration: <AIJournalIllustration />,
      status: 'Shipped v2.0',
      statusColor: 'bg-purple-400 text-white',
    },
    {
      title: 'IoT Weather Station',
      desc: 'Solar-powered campus telemetry station broadcasting live micro-climate sensor metrics across NIAT Pune.',
      tags: ['IoT', 'ESP32', 'MQTT', 'Hardware'],
      bg: 'bg-[#E3FAEE]',
      illustration: <IoTWeatherIllustration />,
      status: 'Campus Deployed',
      statusColor: 'bg-teal-400 text-[#121316]',
    },
    {
      title: 'Computer Vision Lab',
      desc: 'Real-time gesture recognition drone controller and automated workspace safety tracking with Edge AI.',
      tags: ['OpenCV', 'Edge AI', 'Coral TPU', 'C++'],
      bg: 'bg-[#FFEBF2]',
      illustration: <CVLabIllustration />,
      status: 'Active R&D',
      statusColor: 'bg-pink-400 text-white',
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-10 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-10 h-10" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#2E86DE]" />
              FEATURED PROJECTS
            </div>

            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFD32A" />
            </div>
          </div>

          <p className="mt-4 text-base sm:text-xl text-gray-700 max-w-xl font-medium">
            Ideas turned into code, hardware prototypes, and real-world impact:
          </p>
        </div>

        {/* Invention Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`group relative p-6 sm:p-8 rounded-[32px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-200 flex flex-col justify-between ${project.bg}`}
            >
              {/* Top Meta: Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[11px] font-mono font-extrabold px-3 py-1 rounded-full border-2 border-[#121316] shadow-pop-sm uppercase ${project.statusColor}`}>
                  ● {project.status}
                </span>
                <span className="text-xs font-mono font-bold text-gray-500">
                  ATC BUILDS 2026
                </span>
              </div>

              {/* Illustration Preview Area */}
              <div className="p-4 bg-white/70 rounded-2xl border-2 border-[#121316] shadow-inner mb-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                {project.illustration}
              </div>

              {/* Content */}
              <div className="space-y-3 mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed">
                  {project.desc}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-lg bg-white border border-[#121316] font-mono text-xs font-bold text-[#121316] shadow-pop-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action CTA: View Project */}
              <div className="pt-4 border-t-2 border-[#121316]/20 flex items-center justify-between">
                <PlayfulButton
                  to="/projects"
                  variant="primary"
                  size="sm"
                  icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
                >
                  View Project
                </PlayfulButton>

                <span className="text-xs font-hand font-bold text-gray-600">
                  Built by student squad ⚡
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="mt-14 flex justify-center">
          <PlayfulButton
            to="/projects"
            variant="dark"
            size="lg"
            icon={<ArrowUpRight className="w-5 h-5 text-yellow-300 stroke-[3]" />}
          >
            Explore All Repos & Prototypes ↗
          </PlayfulButton>
        </div>

      </div>
    </section>
  );
};
