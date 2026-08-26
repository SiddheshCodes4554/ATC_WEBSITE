import React, { useState } from 'react';
import { ProjectsHero } from '../components/projects/ProjectsHero';
import { InteractiveRobotShowcase } from '../components/projects/InteractiveRobotShowcase';
import { ProjectCard, StudentProject } from '../components/projects/ProjectCard';
import { SubmitProjectModal } from '../components/projects/SubmitProjectModal';
import { Sparkles, Plus, Cpu, Brain, CloudSun, Eye, Navigation, Terminal, Zap } from 'lucide-react';
import { SparkleDoodle, LoopyArrow } from '../components/doodles/DoodleSvgs';

// Custom Project Illustrations
const AIJournalArt = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    <rect x="40" y="20" width="120" height="90" rx="14" fill="#E1DCFF" stroke="#121316" strokeWidth="3" />
    <circle cx="100" cy="65" r="26" fill="#6C5CE7" stroke="#121316" strokeWidth="2" />
    <path d="M88 65 Q100 45 112 65 T100 85" stroke="#FFE600" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse" />
    <circle cx="100" cy="65" r="4" fill="#FFFFFF" />
    <rect x="110" y="15" width="45" height="18" rx="6" fill="#FFD32A" stroke="#121316" strokeWidth="2" />
    <text x="132" y="28" fontFamily="sans-serif" fontSize="9" fontWeight="900" textAnchor="middle" fill="#121316">NLP</text>
  </svg>
);

const IoTWeatherArt = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    <rect x="60" y="35" width="80" height="70" rx="14" fill="#D4F8E8" stroke="#121316" strokeWidth="3" />
    <polygon points="50,35 150,35 140,15 60,15" fill="#2E86DE" stroke="#121316" strokeWidth="2.5" />
    <circle cx="85" cy="65" r="12" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <ellipse cx="105" cy="72" rx="16" ry="10" fill="#48DBFB" stroke="#121316" strokeWidth="2" />
    <line x1="100" y1="105" x2="100" y2="125" stroke="#121316" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const CVLabArt = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    <rect x="40" y="20" width="120" height="90" rx="12" fill="#FFD9E8" stroke="#121316" strokeWidth="3" />
    <path d="M50 35 H45 V40" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
    <path d="M150 35 H155 V40" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 95 H45 V90" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
    <path d="M150 95 H155 V90" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
    <circle cx="100" cy="65" r="24" fill="#121316" stroke="#121316" strokeWidth="2" />
    <circle cx="100" cy="65" r="14" fill="#FF6B6B" />
    <circle cx="100" cy="65" r="6" fill="#FFE600" className="animate-ping" />
  </svg>
);

const DroneArt = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    <rect x="75" y="55" width="50" height="35" rx="8" fill="#121316" stroke="#121316" strokeWidth="2.5" />
    {/* Arms */}
    <line x1="40" y1="35" x2="160" y2="105" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round" />
    <line x1="40" y1="105" x2="160" y2="35" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round" />
    {/* Rotors */}
    <ellipse cx="40" cy="35" rx="16" ry="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <ellipse cx="160" cy="35" rx="16" ry="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <ellipse cx="40" cy="105" rx="16" ry="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <ellipse cx="160" cy="105" rx="16" ry="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <circle cx="100" cy="72" r="5" fill="#2ED573" className="animate-pulse" />
  </svg>
);

const KeyboardFirmwareArt = () => (
  <svg viewBox="0 0 200 130" fill="none" className="w-full h-auto">
    <rect x="35" y="35" width="130" height="65" rx="12" fill="#2D3436" stroke="#121316" strokeWidth="3" />
    <rect x="45" y="45" width="18" height="18" rx="4" fill="#FFE600" stroke="#121316" strokeWidth="1.5" />
    <rect x="68" y="45" width="18" height="18" rx="4" fill="#FF7675" stroke="#121316" strokeWidth="1.5" />
    <rect x="91" y="45" width="18" height="18" rx="4" fill="#74B9FF" stroke="#121316" strokeWidth="1.5" />
    <rect x="114" y="45" width="18" height="18" rx="4" fill="#55EFC4" stroke="#121316" strokeWidth="1.5" />
    <rect x="137" y="45" width="18" height="18" rx="4" fill="#A29BFE" stroke="#121316" strokeWidth="1.5" />
    <rect x="68" y="70" width="64" height="18" rx="4" fill="#FAF7F0" stroke="#121316" strokeWidth="1.5" />
  </svg>
);

export const ProjectsPage: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<string>('build');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const studentProjects: StudentProject[] = [
    {
      id: 'ai-journal',
      title: 'AI Journal Analyzer',
      category: 'AI & Natural Language Processing',
      tags: ['PyTorch', 'Transformers', 'Next.js', 'FastAPI'],
      desc: 'Semantic reflection analysis pipeline running locally to extract emotional nuance, recurring thought patterns, and sentiment over time.',
      specs: [
        { label: 'Latency', value: '45ms Local' },
        { label: 'Parameters', value: '7B Quantized' },
        { label: 'Privacy', value: '100% Offline' },
        { label: 'License', value: 'MIT Open' },
      ],
      builders: ['Ishaan Verma', 'Rhea Sen'],
      repoUrl: 'https://github.com/SiddheshCodes4554/ATC_WEBSITE',
      status: 'Shipped v2.0',
      statusColor: 'bg-[#D4F8E8]',
      cardColor: 'bg-[#F0EBFF]',
      illustration: <AIJournalArt />,
    },
    {
      id: 'iot-weather-station',
      title: 'IoT Micro-Climate Station',
      category: 'Embedded & Environmental Sensing',
      tags: ['ESP32', 'MQTT', 'BME680', 'Grafana'],
      desc: 'Solar-harvesting telemetry station deployed across NIAT campus measuring air quality index, solar radiation, humidity, and barometric pressure.',
      specs: [
        { label: 'Battery Life', value: 'Infinite (Solar)' },
        { label: 'Range', value: '1.2 km LoRa' },
        { label: 'Sensors', value: '6 Channels' },
        { label: 'Uptime', value: '99.8%' },
      ],
      builders: ['Kavya Rao', 'Nikhil Patil'],
      repoUrl: 'https://github.com/SiddheshCodes4554/ATC_WEBSITE',
      status: 'Campus Live',
      statusColor: 'bg-[#FFE600]',
      cardColor: 'bg-[#E3FAEE]',
      illustration: <IoTWeatherArt />,
    },
    {
      id: 'cv-lab-drone-tracker',
      title: 'Edge AI Drone Vision Tracker',
      category: 'Computer Vision & Edge Computing',
      tags: ['OpenCV', 'Google Coral TPU', 'Python', 'C++'],
      desc: 'High-speed 60fps real-time visual gesture tracker enabling hands-free flight navigation and obstacle vector calculation on micro-drones.',
      specs: [
        { label: 'Frame Rate', value: '60 FPS' },
        { label: 'Compute', value: 'Coral TPU 4 TOPS' },
        { label: 'Detection', value: 'YOLOv8-Nano' },
        { label: 'Power', value: '2.5W' },
      ],
      builders: ['Tanmay Roy', 'Aarav Sharma'],
      repoUrl: 'https://github.com/SiddheshCodes4554/ATC_WEBSITE',
      status: 'Active Prototype',
      statusColor: 'bg-[#FFD1E3]',
      cardColor: 'bg-[#FFEBF2]',
      illustration: <CVLabArt />,
    },
    {
      id: 'autonomous-delivery-drone',
      title: 'Autonomous Campus Quadcopter',
      category: 'Aerospace & Autonomous Vehicles',
      tags: ['ArduPilot', 'PX4', 'Jetson Nano', 'ROS 2'],
      desc: 'Precision GPS waypoint payload delivery drone with automated optical landing pad detection and failsafe return-to-home protocols.',
      specs: [
        { label: 'Flight Time', value: '24 mins' },
        { label: 'Payload', value: '800 grams' },
        { label: 'Autonomy', value: 'Full Waypoint' },
        { label: 'Sensors', value: 'Optical Flow' },
      ],
      builders: ['Rohan Kulkarni', 'Aditya Joshi'],
      repoUrl: 'https://github.com/SiddheshCodes4554/ATC_WEBSITE',
      status: 'Flight Testing',
      statusColor: 'bg-[#FFE8D6]',
      cardColor: 'bg-[#FFF9DB]',
      illustration: <DroneArt />,
    },
    {
      id: 'custom-keyboard-firmware',
      title: 'Rust Mechanical Keyboard Engine',
      category: 'Embedded Firmware & Systems',
      tags: ['Rust', 'RP2040', 'QMK', 'Hardware'],
      desc: 'Ultra low-latency 8000Hz polling mechanical keyboard firmware written in embedded Rust with per-key dynamic capacitive actuation.',
      specs: [
        { label: 'Polling Rate', value: '8000 Hz' },
        { label: 'Debounce', value: '0.1ms' },
        { label: 'Chip', value: 'RP2040 Dual Core' },
        { label: 'Language', value: 'Embedded Rust' },
      ],
      builders: ['Manish Verma'],
      repoUrl: 'https://github.com/SiddheshCodes4554/ATC_WEBSITE',
      status: 'Shipped v1.0',
      statusColor: 'bg-[#D4F8E8]',
      cardColor: 'bg-[#E1F5FE]',
      illustration: <KeyboardFirmwareArt />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION WITH PROCESS TRACKER */}
      <ProjectsHero
        currentStage={currentStage}
        onStageChange={(stage) => setCurrentStage(stage)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* 2. FEATURED PROJECT SHOWCASE (ROS ROBOT PROGRESSIVE BUILD) */}
      <InteractiveRobotShowcase
        currentStage={currentStage}
        onStageChange={(stage) => setCurrentStage(stage)}
      />

      {/* 3. STUDENT INVENTION WALL (OTHER NOTABLE PROJECTS) */}
      <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
        
        {/* Decorative Doodles & Connected Wires */}
        <div className="absolute top-10 right-10 opacity-40 pointer-events-none hidden md:block">
          <SparkleDoodle className="w-12 h-12" color="#6C5CE7" />
        </div>

        {/* Connected Circuit Wire SVG Path running behind cards */}
        <svg className="absolute inset-0 w-full h-full -z-0 opacity-20 pointer-events-none hidden lg:block" viewBox="0 0 1440 900" fill="none">
          <path d="M 100 200 H 400 V 500 H 800 V 300 H 1300" stroke="#121316" strokeWidth="4" strokeDasharray="8 8" />
          <circle cx="400" cy="500" r="8" fill="#FFE600" stroke="#121316" strokeWidth="3" />
          <circle cx="800" cy="300" r="8" fill="#FF6B6B" stroke="#121316" strokeWidth="3" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Heading */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="relative inline-block">
              <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
                <Sparkles className="w-5 h-5 text-[#FF793F]" />
                OTHER NOTABLE INVENTIONS
              </div>
              
              <div className="absolute -right-10 -bottom-4 hidden sm:block">
                <SparkleDoodle className="w-8 h-8" color="#FFE600" />
              </div>
            </div>

            <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
              Student Lab Notebook & Repos 📓
            </h2>
            <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
              All projects are engineered in Lab 502 and maintained in public open-source repositories:
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {studentProjects.map((proj, idx) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                idx={idx}
              />
            ))}
          </div>

          {/* Submit Callout Banner at bottom of Invention Wall */}
          <div className="mt-16 p-8 sm:p-10 rounded-[36px] bg-[#6C5CE7] border-4 border-[#121316] shadow-pop-lg text-white grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Building something cool at NIAT? 🚀
              </h3>
              <p className="text-purple-100 text-sm sm:text-base font-medium">
                Get hardware components, compute credits, and a dedicated project bench in Lab 502.
              </p>
            </div>

            <div className="md:col-span-4 flex justify-start md:justify-end">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono font-black text-sm border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all cursor-pointer select-none"
              >
                Submit Your Project ↗
              </button>
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
