import React from 'react';
import { Users, Crown, Handshake, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

interface ThreePathsSectionProps {
  onSelectPath: (path: 'community' | 'core' | 'partner') => void;
}

// Vector Illustration 1: Community Builders
const CommunityIllustration = () => (
  <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
    <rect x="25" y="20" width="190" height="120" rx="16" fill="#FFF9DB" stroke="#121316" strokeWidth="3" />
    {/* Student Avatar with Laptop */}
    <circle cx="120" cy="65" r="26" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
    <path d="M 95 125 C 95 95 145 95 145 125" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" />
    {/* Laptop */}
    <polygon points="100,128 140,128 135,115 105,115" fill="#121316" />
    {/* Lightbulb Idea on Top */}
    <circle cx="120" cy="26" r="10" fill="#FF4757" stroke="#121316" strokeWidth="1.5" />
    <text x="120" y="30" fontFamily="sans-serif" fontSize="10" textAnchor="middle">💡</text>
    {/* Floating Chat Bubbles */}
    <rect x="40" y="45" width="45" height="22" rx="6" fill="#FFFFFF" stroke="#121316" strokeWidth="2" />
    <text x="62" y="59" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#121316">LEARN</text>
    <rect x="155" y="45" width="45" height="22" rx="6" fill="#2ED573" stroke="#121316" strokeWidth="2" />
    <text x="177" y="59" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">BUILD</text>
  </svg>
);

// Vector Illustration 2: Core Team Leads
const CoreTeamIllustration = () => (
  <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
    <rect x="25" y="20" width="190" height="120" rx="16" fill="#F0EBFF" stroke="#121316" strokeWidth="3" />
    {/* Articulated Tools and Megaphone */}
    <rect x="60" y="50" width="40" height="30" rx="6" fill="#FF793F" stroke="#121316" strokeWidth="2" />
    <polygon points="100,50 125,40 125,90 100,80" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    {/* Soundwaves */}
    <path d="M 135 55 Q 145 65 135 75" stroke="#6C5CE7" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 145 45 Q 160 65 145 85" stroke="#6C5CE7" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Crown Badge */}
    <polygon points="175,100 185,85 195,100 190,110 180,110" fill="#FF4757" stroke="#121316" strokeWidth="2" />
    <rect x="45" y="105" width="150" height="22" rx="6" fill="#121316" />
    <text x="120" y="119" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFE600">
      ★ LEADERSHIP & SQUADS
    </text>
  </svg>
);

// Vector Illustration 3: Partners & Speakers
const PartnerIllustration = () => (
  <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
    <rect x="25" y="20" width="190" height="120" rx="16" fill="#E1F5FE" stroke="#121316" strokeWidth="3" />
    {/* Handshake Nodes */}
    <line x1="70" y1="80" x2="170" y2="80" stroke="#121316" strokeWidth="4" strokeDasharray="6 6" />
    <circle cx="70" cy="80" r="28" fill="#2E86DE" stroke="#121316" strokeWidth="3" />
    <text x="70" y="86" fontFamily="sans-serif" fontSize="16" textAnchor="middle">🏢</text>
    <circle cx="170" cy="80" r="28" fill="#2ED573" stroke="#121316" strokeWidth="3" />
    <text x="170" y="86" fontFamily="sans-serif" fontSize="16" textAnchor="middle">🎓</text>
    {/* Center Signal Spark */}
    <circle cx="120" cy="80" r="10" fill="#FFE600" stroke="#121316" strokeWidth="2" className="animate-ping" />
    <rect x="65" y="120" width="110" height="20" rx="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
    <text x="120" y="133" fontFamily="monospace" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#121316">
      SPONSORS & HUBS
    </text>
  </svg>
);

export const ThreePathsSection: React.FC<ThreePathsSectionProps> = ({ onSelectPath }) => {
  const paths = [
    {
      id: 'community' as const,
      title: 'JOIN THE COMMUNITY',
      tagline: 'Attend. Learn. Build.',
      cardColor: 'bg-[#FFF9DB]',
      badgeBg: 'bg-[#FFE600] text-[#121316]',
      buttonVariant: 'primary' as const,
      buttonText: 'Join as a Member',
      desc: 'For students who want to participate in workshops, compete in hackathons, use Lab 5.0 benches, and meet fellow tech enthusiasts.',
      perks: [
        'Free entry to all campus hackathons',
        'Access to workshop repos & slides',
        'Official WhatsApp & Discord community',
        'Lab 5.0 workbench access',
      ],
      illustration: <CommunityIllustration />,
    },
    {
      id: 'core' as const,
      title: 'JOIN THE CORE TEAM',
      tagline: 'Help shape ATC.',
      cardColor: 'bg-[#F0EBFF]',
      badgeBg: 'bg-[#6C5CE7] text-white',
      buttonVariant: 'secondary' as const,
      buttonText: 'Apply for Core Team',
      desc: 'For passionate builders, logistics leaders, video editors, and organizers who want to run events and shape the club culture.',
      perks: [
        'Lead major national tech events',
        'Direct mentorship from alumni & founders',
        'Hardware grant priority for projects',
        'Official Club Lead certificate & swag',
      ],
      illustration: <CoreTeamIllustration />,
    },
    {
      id: 'partner' as const,
      title: 'COLLABORATE WITH US',
      tagline: 'Clubs. Speakers. Partners.',
      cardColor: 'bg-[#E1F5FE]',
      badgeBg: 'bg-[#2E86DE] text-white',
      buttonVariant: 'dark' as const,
      buttonText: 'Partner With ATC',
      desc: 'For tech companies, student clubs, hackathon organizers, and guest speakers looking to collaborate with NIAT Pune.',
      perks: [
        'Direct access to active student engineers',
        'Hackathon sponsorship branding',
        'Keynote speech & workshop hosting',
        'Campus recruitment & project hiring',
      ],
      illustration: <PartnerIllustration />,
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-10 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Sparkles className="w-5 h-5 text-[#FF793F]" />
              CHOOSE YOUR PATH
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#6C5CE7" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-[#121316] tracking-tight">
            Three Ways to Get Involved 🚀
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            Pick the track that best fits your goals at NIAT Pune:
          </p>
        </div>

        {/* 3 Large Distinct Path Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {paths.map((path) => (
            <div
              key={path.id}
              className={`group relative p-8 rounded-[40px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-300 flex flex-col justify-between ${
                path.cardColor
              } hover:-translate-y-2 select-none`}
            >
              {/* Tape Strip on Top */}
              <div className="tape-strip pointer-events-none" />

              <div>
                {/* Top Badge */}
                <div className="mb-4">
                  <span className={`px-4 py-1 rounded-full font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm inline-block ${path.badgeBg}`}>
                    {path.tagline}
                  </span>
                </div>

                {/* Vector Artwork Showcase */}
                <div className="p-4 bg-white/80 rounded-2xl border-3 border-[#121316] shadow-inner mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full max-w-[240px]">
                    {path.illustration}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mb-2">
                  {path.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed mb-6">
                  {path.desc}
                </p>

                {/* Perks Checklist */}
                <div className="space-y-2 mb-8 p-4 bg-white/70 rounded-2xl border-2 border-[#121316]/20">
                  <span className="text-xs font-mono font-black text-[#121316] uppercase block">
                    WHAT YOU GET:
                  </span>
                  {path.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-2 text-xs sm:text-sm font-bold text-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4 border-t-2 border-[#121316]/15">
                <PlayfulButton
                  onClick={() => onSelectPath(path.id)}
                  variant={path.buttonVariant}
                  size="md"
                  withConfetti
                  className="w-full justify-center text-center"
                  icon={<ArrowUpRight className="w-4 h-4 stroke-[3]" />}
                >
                  {path.buttonText}
                </PlayfulButton>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
