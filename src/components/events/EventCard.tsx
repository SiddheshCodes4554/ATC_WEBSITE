import React from 'react';
import { Calendar, MapPin, ArrowUpRight, CheckCircle2, AlertTriangle, GitBranch, Blocks, Sparkles } from 'lucide-react';
import { EventItem } from './EventDetailsModal';
import { PlayfulButton } from '../ui/PlayfulButton';

// 1. Worst UI/UX Vector Art (Chaotic & Funny)
export const WorstUIUXIllustration: React.FC = () => (
  <svg viewBox="0 0 240 150" fill="none" className="w-full h-auto">
    {/* Background Comic Chaos Window */}
    <rect x="20" y="15" width="200" height="120" rx="14" fill="#FFFFFF" stroke="#121316" strokeWidth="3.5" />
    
    {/* Window Header */}
    <rect x="20" y="15" width="200" height="26" rx="14" fill="#FF7675" stroke="#121316" strokeWidth="3" />
    <circle cx="34" cy="28" r="4" fill="#FFE600" />
    <circle cx="46" cy="28" r="4" fill="#55EFC4" />
    <text x="125" y="32" fontFamily="Comic Sans MS, cursive, sans-serif" fontWeight="900" fontSize="10" textAnchor="middle" fill="#121316">
      WINDOWS 93 ERROR.EXE
    </text>

    {/* Chaotic Warning Sign */}
    <g transform="translate(35, 52) rotate(-8)">
      <rect x="0" y="0" width="80" height="32" rx="8" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
      <text x="40" y="21" fontFamily="Comic Sans MS, cursive, sans-serif" fontWeight="bold" fontSize="9" textAnchor="middle" fill="#121316">
        ⚠️ 100% BUGGY
      </text>
    </g>

    {/* Inverted / Broken Button */}
    <g transform="translate(130, 50) rotate(12)">
      <rect x="0" y="0" width="75" height="30" rx="8" fill="#FF4757" stroke="#121316" strokeWidth="2.5" />
      <text x="37" y="19" fontFamily="sans-serif" fontWeight="900" fontSize="8" textAnchor="middle" fill="#FFFFFF">
        DO NOT SUBMIT
      </text>
    </g>

    {/* Upside Down 404 Label */}
    <g transform="translate(120, 108) rotate(180)">
      <rect x="-40" y="-12" width="80" height="24" rx="6" fill="#A29BFE" stroke="#121316" strokeWidth="2" />
      <text x="0" y="4" fontFamily="monospace" fontWeight="bold" fontSize="9" textAnchor="middle" fill="#121316">
        ERROR: 404
      </text>
    </g>

    {/* Comic Cursor Arrow */}
    <polygon points="105,75 118,105 110,105 106,118 98,115 102,102 92,102" fill="#FFE600" stroke="#121316" strokeWidth="2" />
  </svg>
);

// 2. Git & GitHub Vector Art (Contribution Graph & Mascot)
export const GitHubGSoCIllustration: React.FC = () => (
  <svg viewBox="0 0 240 150" fill="none" className="w-full h-auto">
    {/* Dark Terminal Frame */}
    <rect x="15" y="15" width="210" height="120" rx="16" fill="#121316" stroke="#121316" strokeWidth="3.5" />
    
    {/* Terminal Header */}
    <circle cx="32" cy="28" r="3.5" fill="#FF6B6B" />
    <circle cx="42" cy="28" r="3.5" fill="#FFD32A" />
    <circle cx="52" cy="28" r="3.5" fill="#2ED573" />
    <text x="125" y="32" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#A29BFE">
      git@github:atc/gsoc.git
    </text>

    {/* Green Contribution Graph Matrix */}
    <g transform="translate(30, 48)">
      {/* Row 1 */}
      <rect x="0" y="0" width="12" height="12" rx="3" fill="#2ECC71" />
      <rect x="16" y="0" width="12" height="12" rx="3" fill="#27AE60" />
      <rect x="32" y="0" width="12" height="12" rx="3" fill="#2ECC71" />
      <rect x="48" y="0" width="12" height="12" rx="3" fill="#1E8449" />
      <rect x="64" y="0" width="12" height="12" rx="3" fill="#2ECC71" />

      {/* Row 2 */}
      <rect x="0" y="16" width="12" height="12" rx="3" fill="#27AE60" />
      <rect x="16" y="16" width="12" height="12" rx="3" fill="#2ECC71" />
      <rect x="32" y="16" width="12" height="12" rx="3" fill="#58D68D" />
      <rect x="48" y="16" width="12" height="12" rx="3" fill="#27AE60" />
      <rect x="64" y="16" width="12" height="12" rx="3" fill="#2ECC71" />

      {/* Row 3 */}
      <rect x="0" y="32" width="12" height="12" rx="3" fill="#2ECC71" />
      <rect x="16" y="32" width="12" height="12" rx="3" fill="#1E8449" />
      <rect x="32" y="32" width="12" height="12" rx="3" fill="#2ECC71" />
      <rect x="48" y="32" width="12" height="12" rx="3" fill="#2ECC71" />
      <rect x="64" y="32" width="12" height="12" rx="3" fill="#58D68D" />
    </g>

    {/* Abstract Friendly Octo Developer Mascot Silhouette */}
    <g transform="translate(135, 45)">
      {/* Cat Head */}
      <circle cx="45" cy="40" r="30" fill="#2E86DE" stroke="#FFFFFF" strokeWidth="2.5" />
      {/* Cat Ears */}
      <polygon points="25,20 18,2 38,14" fill="#2E86DE" stroke="#FFFFFF" strokeWidth="2" />
      <polygon points="65,20 72,2 52,14" fill="#2E86DE" stroke="#FFFFFF" strokeWidth="2" />
      {/* Terminal Goggles */}
      <rect x="25" y="32" width="18" height="12" rx="3" fill="#FFE600" />
      <rect x="47" y="32" width="18" height="12" rx="3" fill="#FFE600" />
      <circle cx="34" cy="38" r="2.5" fill="#121316" />
      <circle cx="56" cy="38" r="2.5" fill="#121316" />
      {/* Cute Whiskers */}
      <line x1="20" y1="46" x2="10" y2="44" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="70" y1="46" x2="80" y2="44" stroke="#FFFFFF" strokeWidth="1.5" />
    </g>

    {/* Git Branch Pill Tag */}
    <g transform="translate(30, 102)">
      <rect x="0" y="0" width="85" height="18" rx="6" fill="#FFD32A" />
      <text x="42" y="13" fontFamily="monospace" fontWeight="900" fontSize="9" textAnchor="middle" fill="#121316">
        #PR MERGED ✓
      </text>
    </g>
  </svg>
);

// 3. MST Blockchain Vector Art (Connected Isometric Block Network)
export const BlockchainIllustration: React.FC = () => (
  <svg viewBox="0 0 240 150" fill="none" className="w-full h-auto">
    {/* Network Connection Lines */}
    <line x1="60" y1="75" x2="120" y2="45" stroke="#121316" strokeWidth="3.5" />
    <line x1="120" y1="45" x2="180" y2="75" stroke="#121316" strokeWidth="3.5" />
    <line x1="60" y1="75" x2="120" y2="105" stroke="#121316" strokeWidth="3.5" />
    <line x1="120" y1="105" x2="180" y2="75" stroke="#121316" strokeWidth="3.5" />
    
    {/* Block 1 (Left - Blue Block) */}
    <g transform="translate(35, 50)">
      <polygon points="25,0 50,14 25,28 0,14" fill="#54A0FF" stroke="#121316" strokeWidth="2.5" />
      <polygon points="0,14 25,28 25,50 0,36" fill="#2E86DE" stroke="#121316" strokeWidth="2.5" />
      <polygon points="25,28 50,14 50,36 25,50" fill="#1B4F72" stroke="#121316" strokeWidth="2.5" />
      <text x="25" y="42" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#FFFFFF">#01</text>
    </g>

    {/* Block 2 (Top - Yellow Block) */}
    <g transform="translate(95, 20)">
      <polygon points="25,0 50,14 25,28 0,14" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
      <polygon points="0,14 25,28 25,50 0,36" fill="#FFD32A" stroke="#121316" strokeWidth="2.5" />
      <polygon points="25,28 50,14 50,36 25,50" fill="#D4AC0D" stroke="#121316" strokeWidth="2.5" />
      <text x="25" y="42" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#121316">#02</text>
    </g>

    {/* Block 3 (Right - Emerald Block) */}
    <g transform="translate(155, 50)">
      <polygon points="25,0 50,14 25,28 0,14" fill="#2ED573" stroke="#121316" strokeWidth="2.5" />
      <polygon points="0,14 25,28 25,50 0,36" fill="#26AF5F" stroke="#121316" strokeWidth="2.5" />
      <polygon points="25,28 50,14 50,36 25,50" fill="#1E8449" stroke="#121316" strokeWidth="2.5" />
      <text x="25" y="42" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#FFFFFF">#03</text>
    </g>

    {/* Block 4 (Bottom - Purple Block) */}
    <g transform="translate(95, 80)">
      <polygon points="25,0 50,14 25,28 0,14" fill="#A29BFE" stroke="#121316" strokeWidth="2.5" />
      <polygon points="0,14 25,28 25,50 0,36" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" />
      <polygon points="25,28 50,14 50,36 25,50" fill="#4834D4" stroke="#121316" strokeWidth="2.5" />
      <text x="25" y="42" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#FFFFFF">#04</text>
    </g>

    {/* Center Signal Pulse */}
    <circle cx="120" cy="75" r="7" fill="#FF6B6B" stroke="#121316" strokeWidth="2" className="animate-ping" />
  </svg>
);

// 4. ROS Robotics Bootcamp Vector Art
export const RoboticsBootcampIllustration: React.FC = () => (
  <svg viewBox="0 0 240 150" fill="none" className="w-full h-auto">
    {/* PCB Workbench Base */}
    <rect x="25" y="20" width="190" height="110" rx="14" fill="#0B0F19" stroke="#121316" strokeWidth="3.5" />
    <path d="M40 40 H100 V90 H180" stroke="#00D2D3" strokeWidth="2.5" strokeDasharray="4 4" />
    <circle cx="40" cy="40" r="5" fill="#FFE600" />
    <circle cx="100" cy="90" r="5" fill="#FF6B6B" />
    <circle cx="180" cy="90" r="5" fill="#2ED573" />
    
    {/* Microcontroller Chip */}
    <rect x="90" y="45" width="60" height="50" rx="8" fill="#2C3E50" stroke="#FFFFFF" strokeWidth="2" />
    <text x="120" y="74" fontFamily="monospace" fontWeight="bold" fontSize="10" textAnchor="middle" fill="#FFE600">
      ROS 2.0
    </text>

    {/* LiDAR Laser Scan Arc */}
    <path d="M 60 110 Q 120 70 180 110" stroke="#FF7675" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse" />
  </svg>
);

// 5. National CodeSprint Vector Art
export const CodeSprintIllustration: React.FC = () => (
  <svg viewBox="0 0 240 150" fill="none" className="w-full h-auto">
    <rect x="25" y="20" width="190" height="110" rx="14" fill="#FFF3A8" stroke="#121316" strokeWidth="3.5" />
    {/* Big Trophy */}
    <path d="M 85 45 H 155 V 80 C 155 100 135 108 120 108 C 105 108 85 100 85 80 Z" fill="#FFE600" stroke="#121316" strokeWidth="3" />
    <path d="M 85 52 H 70 C 70 68 82 72 85 72" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M 155 52 H 170 C 170 68 158 72 155 72" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <rect x="105" y="108" width="30" height="14" fill="#FF793F" stroke="#121316" strokeWidth="2" />
    <text x="120" y="75" fontFamily="sans-serif" fontWeight="900" fontSize="16" textAnchor="middle" fill="#121316">1st</text>
  </svg>
);

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  return (
    <div className={`group relative p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-200 flex flex-col justify-between ${event.color}`}>
      
      <div>
        {/* Top Header Row: Category Badge & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase text-white border-2 border-[#121316] shadow-pop-sm ${event.badgeBg}`}>
            {event.category}
          </span>

          {/* Playful Completed Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-[#FFD1E3] text-[#121316] border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 rotate-[-2deg] group-hover:rotate-0 transition-transform">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {event.status}
          </span>
        </div>

        {/* Large Expressive Vector Illustration Showcase */}
        <div className="p-4 bg-white/80 rounded-2xl border-3 border-[#121316] shadow-inner mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <div className="w-full max-w-[260px]">
            {event.illustration}
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2 mb-4">
          <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight leading-tight group-hover:text-[#6C5CE7] transition-colors">
            {event.title}
          </h3>
          <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
            {event.tagline}
          </p>
        </div>

        {/* Date & Location Pill */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-gray-700 p-2.5 bg-white/60 rounded-xl border border-[#121316]/20 mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#FF793F]" />
            <span>{event.date}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#2E86DE]" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action: View Details ↗ */}
      <div className="pt-4 border-t-2 border-[#121316]/20 flex items-center justify-between">
        <PlayfulButton
          onClick={() => onSelect(event)}
          variant="primary"
          size="md"
          icon={<ArrowUpRight className="w-4 h-4 text-[#121316] stroke-[3]" />}
        >
          View Details ↗
        </PlayfulButton>

        <span className="text-xs font-hand font-bold text-gray-600">
          Recap & photos ready 📸
        </span>
      </div>

    </div>
  );
};
