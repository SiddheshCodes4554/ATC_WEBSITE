import React, { useState } from 'react';
import { Sparkles, Terminal, CheckSquare, Camera, Share2, DollarSign, Users, Award, ExternalLink } from 'lucide-react';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

export type TeamWingId = 'technical' | 'operations' | 'social' | 'outreach' | 'finance';

interface TeamMember {
  name: string;
  role: string;
  personality: string;
  avatarSeed: string;
  skills: string[];
}

interface TeamWingData {
  id: TeamWingId;
  label: string;
  headName: string;
  headRole: string;
  themeColor: string;
  cardBg: string;
  pillColor: string;
  tagline: string;
  desc: string;
  illustrationType: 'tech' | 'ops' | 'social' | 'outreach' | 'finance';
  members: TeamMember[];
}

// Vector Artwork for each team wing
const WingIllustration: React.FC<{ type: TeamWingData['illustrationType'] }> = ({ type }) => {
  if (type === 'ops') {
    return (
      <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
        {/* Clipboard */}
        <rect x="50" y="20" width="140" height="120" rx="12" fill="#FFFFFF" stroke="#121316" strokeWidth="3" />
        <rect x="90" y="10" width="60" height="20" rx="6" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
        {/* Checklist rows */}
        <rect x="70" y="45" width="14" height="14" rx="3" fill="#2ED573" stroke="#121316" strokeWidth="1.5" />
        <line x1="95" y1="52" x2="165" y2="52" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
        <rect x="70" y="70" width="14" height="14" rx="3" fill="#2ED573" stroke="#121316" strokeWidth="1.5" />
        <line x1="95" y1="77" x2="155" y2="77" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
        <rect x="70" y="95" width="14" height="14" rx="3" fill="#FFE600" stroke="#121316" strokeWidth="1.5" />
        <line x1="95" y1="102" x2="170" y2="102" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
        {/* Walkie-Talkie on Right */}
        <rect x="180" y="55" width="30" height="65" rx="6" fill="#121316" stroke="#121316" strokeWidth="2" />
        <line x1="190" y1="55" x2="190" y2="35" stroke="#121316" strokeWidth="3" strokeLinecap="round" />
        <circle cx="195" cy="80" r="6" fill="#FF4757" className="animate-ping" />
      </svg>
    );
  }

  if (type === 'social') {
    return (
      <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
        {/* Camera Enclosure */}
        <rect x="40" y="35" width="160" height="95" rx="18" fill="#FFD9E8" stroke="#121316" strokeWidth="3.5" />
        <rect x="60" y="20" width="40" height="18" rx="4" fill="#6C5CE7" stroke="#121316" strokeWidth="2" />
        <circle cx="120" cy="82" r="32" fill="#FFFFFF" stroke="#121316" strokeWidth="3" />
        <circle cx="120" cy="82" r="20" fill="#121316" />
        <circle cx="126" cy="76" r="6" fill="#00D2D3" />
        {/* Flash & Hearts */}
        <circle cx="165" cy="55" r="7" fill="#FFE600" stroke="#121316" strokeWidth="2" />
        <polygon points="120,8 126,20 114,20" fill="#FF4757" />
        {/* Floating Reels badge */}
        <g transform="translate(160, 100)">
          <rect x="0" y="0" width="55" height="24" rx="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
          <text x="27" y="16" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#121316">▶ REELS</text>
        </g>
      </svg>
    );
  }

  if (type === 'outreach') {
    return (
      <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
        {/* Network Connection Nodes */}
        <line x1="60" y1="80" x2="120" y2="40" stroke="#121316" strokeWidth="3.5" />
        <line x1="120" y1="40" x2="180" y2="80" stroke="#121316" strokeWidth="3.5" />
        <line x1="60" y1="80" x2="120" y2="120" stroke="#121316" strokeWidth="3.5" />
        <line x1="120" y1="120" x2="180" y2="80" stroke="#121316" strokeWidth="3.5" />
        {/* Node Circles */}
        <circle cx="60" cy="80" r="22" fill="#E1DCFF" stroke="#121316" strokeWidth="3" />
        <text x="60" y="85" fontFamily="sans-serif" fontSize="12" textAnchor="middle">🤝</text>
        <circle cx="120" cy="40" r="22" fill="#FFE600" stroke="#121316" strokeWidth="3" />
        <text x="120" y="45" fontFamily="sans-serif" fontSize="12" textAnchor="middle">💬</text>
        <circle cx="180" cy="80" r="22" fill="#D4F8E8" stroke="#121316" strokeWidth="3" />
        <text x="180" y="85" fontFamily="sans-serif" fontSize="12" textAnchor="middle">🌐</text>
        <circle cx="120" cy="120" r="22" fill="#FFD1E3" stroke="#121316" strokeWidth="3" />
        <text x="120" y="125" fontFamily="sans-serif" fontSize="12" textAnchor="middle">🏆</text>
      </svg>
    );
  }

  if (type === 'finance') {
    return (
      <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
        {/* Calculator Ledger */}
        <rect x="50" y="25" width="140" height="110" rx="14" fill="#D4F8E8" stroke="#121316" strokeWidth="3.5" />
        <rect x="65" y="40" width="110" height="30" rx="6" fill="#121316" />
        <text x="160" y="61" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="end" fill="#2ED573">₹5,00,000</text>
        {/* Coins Stack on Right */}
        <ellipse cx="160" cy="115" rx="20" ry="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
        <ellipse cx="160" cy="105" rx="20" ry="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
        <ellipse cx="160" cy="95" rx="20" ry="8" fill="#FFE600" stroke="#121316" strokeWidth="2" />
        {/* Keypad buttons */}
        <rect x="68" y="85" width="18" height="14" rx="3" fill="#FFFFFF" stroke="#121316" strokeWidth="1.5" />
        <rect x="92" y="85" width="18" height="14" rx="3" fill="#FFFFFF" stroke="#121316" strokeWidth="1.5" />
        <rect x="116" y="85" width="18" height="14" rx="3" fill="#FFFFFF" stroke="#121316" strokeWidth="1.5" />
      </svg>
    );
  }

  // Technical
  return (
    <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
      <rect x="35" y="20" width="170" height="120" rx="14" fill="#121316" stroke="#121316" strokeWidth="3.5" />
      <circle cx="55" cy="35" r="4" fill="#FF6B6B" />
      <circle cx="67" cy="35" r="4" fill="#FFE600" />
      <circle cx="79" cy="35" r="4" fill="#2ED573" />
      <text x="120" y="70" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#00D2D3" textAnchor="middle">
        $ cargo build --release
      </text>
      <text x="120" y="92" fontFamily="monospace" fontSize="9" fill="#2ED573" textAnchor="middle">
        ✓ Target: ROS 2 Humble [OK]
      </text>
      <path d="M 50 115 H 190" stroke="#FFE600" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
  );
};

export const TeamsExplorerSection: React.FC = () => {
  const [activeWing, setActiveWing] = useState<TeamWingId>('operations');

  const wingsData: Record<TeamWingId, TeamWingData> = {
    technical: {
      id: 'technical',
      label: 'Technical Wing',
      headName: 'Tech Lead & Squad',
      headRole: 'Technical Lead',
      themeColor: '#00D2D3',
      cardBg: 'bg-[#E1F5FE]',
      pillColor: 'bg-[#00D2D3]',
      tagline: 'Hardware, firmware, full-stack, and autonomous ROS systems.',
      desc: 'The engineering backbone of ATC. Building production robotics, deploying AI vision pipelines, and maintaining club software repos.',
      illustrationType: 'tech',
      members: [
        { name: 'Core Tech Squad', role: 'Robotics & Web3 Leads', personality: 'Turns caffeine into running code and soldering joints.', avatarSeed: 'tech', skills: ['ROS 2', 'PyTorch', 'Rust', 'React'] },
        { name: 'Firmware & CAD Bench', role: 'Hardware Leads', personality: 'Always has an ESP32 plugged into their USB port.', avatarSeed: 'hw', skills: ['ESP32', 'FreeCAD', 'KiCAD', 'Embedded C'] },
      ],
    },
    operations: {
      id: 'operations',
      label: 'Operations Wing',
      headName: 'Siddhesh Gawade',
      headRole: 'Operations Head',
      themeColor: '#FF793F',
      cardBg: 'bg-[#FFF3E0]',
      pillColor: 'bg-[#FF793F]',
      tagline: 'Logistics, event setups, venue flow, and rapid execution.',
      desc: 'The unstoppable engine making every hackathon, workshop, and lab session run flawlessly with zero downtime.',
      illustrationType: 'ops',
      members: [
        { name: 'Siddhesh Gawade', role: 'Operations Head', personality: 'Master of checklists, venue routing, and crisis prevention.', avatarSeed: 'opshead', skills: ['Event Flow', 'Logistics', 'Stage Production', 'Crisis Mgmt'] },
        { name: 'Ops & Venue Crew', role: 'Core Operations', personality: 'Can set up 150 power strips and projector links in 8 minutes.', avatarSeed: 'crew', skills: ['Lab Management', 'Hardware Inventory', 'Audio Setup'] },
      ],
    },
    social: {
      id: 'social',
      label: 'Social Media Wing',
      headName: 'Prem Sonar',
      headRole: 'Social Media Head',
      themeColor: '#FF6B6B',
      cardBg: 'bg-[#FFEBF2]',
      pillColor: 'bg-[#FF6B6B]',
      tagline: 'Visual storytelling, design identity, reels, and hype.',
      desc: 'Crafting the playful, punchy visual world of ATC across Instagram, LinkedIn, YouTube, and digital platforms.',
      illustrationType: 'social',
      members: [
        { name: 'Prem Sonar', role: 'Social Media Head', personality: 'Turns raw hackathon footage into cinematic Instagram magic.', avatarSeed: 'socialhead', skills: ['Motion Design', 'Video Editing', 'Content Strategy', 'Brand Visuals'] },
        { name: 'Media & Design Squad', role: 'Creative Leads', personality: 'Obsessed with bold typography, doodle borders, and humor.', avatarSeed: 'creative', skills: ['Figma', 'After Effects', 'Photography', 'Copywriting'] },
      ],
    },
    outreach: {
      id: 'outreach',
      label: 'Outreach Wing',
      headName: 'Aryan Deo',
      headRole: 'Outreach Head',
      themeColor: '#6C5CE7',
      cardBg: 'bg-[#F0EBFF]',
      pillColor: 'bg-[#6C5CE7]',
      tagline: 'Sponsorships, speaker lineups, inter-college relations, and partnerships.',
      desc: 'Connecting ATC with tech industry leaders, open-source organizations, campus partners, and hackathon sponsors.',
      illustrationType: 'outreach',
      members: [
        { name: 'Aryan Deo', role: 'Outreach Head', personality: 'The diplomatic dealmaker bringing top tech speakers to campus.', avatarSeed: 'outreachhead', skills: ['Sponsorships', 'Partner Relations', 'Speaker Curation', 'Public Relations'] },
        { name: 'Community Liaisons', role: 'Outreach Crew', personality: 'Connecting students across Pune engineering universities.', avatarSeed: 'liaison', skills: ['Networking', 'College Ambassadorship', 'DevRel'] },
      ],
    },
    finance: {
      id: 'finance',
      label: 'Finance Wing',
      headName: 'Amisha Patel',
      headRole: 'Finance Head',
      themeColor: '#10AC84',
      cardBg: 'bg-[#E8F5E9]',
      pillColor: 'bg-[#10AC84]',
      tagline: 'Budget management, prize disbursements, and grant allocation.',
      desc: 'Ensuring every single rupee is maximized for student hardware kits, prize pools, pizza nights, and lab equipment.',
      illustrationType: 'finance',
      members: [
        { name: 'Amisha Patel', role: 'Finance Head', personality: 'Guarding the club treasury with mathematical precision.', avatarSeed: 'financehead', skills: ['Budgeting', 'Grant Allocation', 'Prize Pooling', 'Vendor Invoicing'] },
        { name: 'Audit & Accounts Crew', role: 'Finance Associates', personality: 'Transparent balance sheets and rapid reimbursement speeds.', avatarSeed: 'audit', skills: ['Ledgers', 'Reimbursements', 'Financial Planning'] },
      ],
    },
  };

  const currentWing = wingsData[activeWing];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Users className="w-5 h-5 text-[#FF793F]" />
              CORE WINGS & HEADS
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFE600" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-[#121316] tracking-tight">
            Our Specialist Squads 🛠️
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            Select a wing below to explore who leads and builds each domain:
          </p>
        </div>

        {/* Interactive Colored Pills Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-12">
          {(Object.keys(wingsData) as TeamWingId[]).map((wingId) => {
            const isSelected = activeWing === wingId;
            const wing = wingsData[wingId];
            return (
              <button
                key={wingId}
                onClick={() => setActiveWing(wingId)}
                className={`px-5 sm:px-7 py-2.5 rounded-full font-mono text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer select-none border-3 border-[#121316] ${
                  isSelected
                    ? `${wing.pillColor} text-white shadow-pop scale-105 ring-2 ring-[#121316]`
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-pop-sm'
                }`}
              >
                {wing.label}
              </button>
            );
          })}
        </div>

        {/* Active Wing Showcase Display Container */}
        <div className={`p-8 sm:p-12 rounded-[44px] border-4 border-[#121316] shadow-pop-xl transition-all duration-300 ${currentWing.cardBg} grid lg:grid-cols-12 gap-8 lg:gap-12 items-center`}>
          
          {/* Left Column: Wing Info & Lead Profile */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#121316] font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm">
                <span>★</span> {currentWing.label}
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
                Led by {currentWing.headName}
              </h3>

              <p className="text-base sm:text-lg font-black text-[#6C5CE7] font-display">
                "{currentWing.tagline}"
              </p>

              <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed">
                {currentWing.desc}
              </p>
            </div>

            {/* Wing Members & Leads Cards Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-black uppercase text-gray-500 block">
                CORE ROSTER:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentWing.members.map((mem) => (
                  <div
                    key={mem.name}
                    className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-base text-[#121316]">{mem.name}</h4>
                      <span className="text-xs font-mono font-extrabold text-[#6C5CE7]">{mem.role}</span>
                    </div>

                    <p className="text-xs font-bold text-gray-600">
                      "{mem.personality}"
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {mem.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-bold text-[#121316]"
                        >
                          #{sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Custom Vector Wing Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm p-6 bg-white rounded-3xl border-4 border-[#121316] shadow-pop-lg flex items-center justify-center rotate-[1.5deg] hover:rotate-0 transition-transform">
              <WingIllustration type={currentWing.illustrationType} />
            </div>

            <div className="mt-4 px-4 py-1.5 bg-white/80 rounded-full border border-[#121316]/20 font-mono text-xs font-bold text-gray-600">
              ⚡ ACTIVE SQUAD • NIAT PUNE
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
