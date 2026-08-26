import React from 'react';
import { Crown, Star, ShieldCheck, Zap, Sparkles, ExternalLink, ArrowUpRight, MessageCircle } from 'lucide-react';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

interface LeaderProfile {
  name: string;
  role: string;
  archetype: string;
  tagline: string;
  quote: string;
  cardColor: string;
  badgeBg: string;
  stats: { label: string; score: string }[];
  avatarBg: string;
  avatarType: 'president' | 'vp' | 'techlead';
}

const AvatarIllustration: React.FC<{ type: LeaderProfile['avatarType'] }> = ({ type }) => {
  if (type === 'president') {
    return (
      <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
        <circle cx="80" cy="80" r="70" fill="#FFE600" stroke="#121316" strokeWidth="3.5" />
        {/* Hair */}
        <path d="M45 70 C45 35 115 35 115 70 Z" fill="#121316" />
        {/* Face */}
        <circle cx="80" cy="85" r="35" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
        {/* Cool Vision Glasses */}
        <rect x="58" y="75" width="18" height="12" rx="3" fill="#121316" />
        <rect x="84" y="75" width="18" height="12" rx="3" fill="#121316" />
        <line x1="76" y1="81" x2="84" y2="81" stroke="#121316" strokeWidth="2" />
        {/* Smile */}
        <path d="M72 105 Q80 112 88 105" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Gold Crown Sticker on Top */}
        <polygon points="70,30 80,18 90,30 85,38 75,38" fill="#FF4757" stroke="#121316" strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'vp') {
    return (
      <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
        <circle cx="80" cy="80" r="70" fill="#FFD9E8" stroke="#121316" strokeWidth="3.5" />
        {/* Hair */}
        <path d="M42 90 C35 40 125 40 118 90 C110 110 50 110 42 90 Z" fill="#6C5CE7" />
        {/* Face */}
        <circle cx="80" cy="80" r="32" fill="#FAD390" stroke="#121316" strokeWidth="2.5" />
        {/* Sparkle Eyes */}
        <circle cx="70" cy="78" r="3.5" fill="#121316" />
        <circle cx="90" cy="78" r="3.5" fill="#121316" />
        <circle cx="72" cy="76" r="1.5" fill="#FFFFFF" />
        <circle cx="92" cy="76" r="1.5" fill="#FFFFFF" />
        {/* Cheeks */}
        <circle cx="64" cy="88" r="4" fill="#FF7675" />
        <circle cx="96" cy="88" r="4" fill="#FF7675" />
        {/* Warm Smile */}
        <path d="M72 94 Q80 102 88 94" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Star Pin */}
        <polygon points="50,45 54,35 64,35 56,41 59,50 50,45" fill="#FFE600" stroke="#121316" strokeWidth="1.5" />
      </svg>
    );
  }

  // Tech Lead
  return (
    <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
      <circle cx="80" cy="80" r="70" fill="#D6EEFF" stroke="#121316" strokeWidth="3.5" />
      {/* Hoodie */}
      <path d="M40 120 C40 60 120 60 120 120 Z" fill="#2D3436" stroke="#121316" strokeWidth="3" />
      {/* Face */}
      <circle cx="80" cy="82" r="30" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
      {/* Cyber/Dev Goggles */}
      <rect x="62" y="74" width="36" height="14" rx="4" fill="#00D2D3" stroke="#121316" strokeWidth="2" />
      <circle cx="71" cy="81" r="3" fill="#121316" />
      <circle cx="89" cy="81" r="3" fill="#121316" />
      {/* Smirk */}
      <path d="M75 98 Q82 102 88 97" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Lightning Bolt Sticker */}
      <polygon points="110,40 125,40 118,52 126,52 110,70 114,56 106,56" fill="#FFE600" stroke="#121316" strokeWidth="1.5" />
    </svg>
  );
};

export const LeadershipSection: React.FC = () => {
  const leaders: LeaderProfile[] = [
    {
      name: 'Yeswin Sri Datta',
      role: 'President',
      archetype: 'CHIEF VISIONARY',
      tagline: 'Lead. Innovate. Make it happen.',
      quote: 'Building the playground where crazy student ideas turn into campus-wide impact.',
      cardColor: 'bg-[#FFF9DB]',
      badgeBg: 'bg-[#FF6B6B]',
      avatarBg: 'bg-[#FFE600]',
      avatarType: 'president',
      stats: [
        { label: 'Vision Power', score: '99' },
        { label: 'Execution', score: '95' },
        { label: 'Midnight Chai', score: '100' },
      ],
    },
    {
      name: 'Ayushi Srivastava',
      role: 'Vice President',
      archetype: 'MASTER STRATEGIST',
      tagline: 'Support. Organize. Execute.',
      quote: 'Keeping all the gears turning and making sure every hackathon runs like clockwork.',
      cardColor: 'bg-[#FFEBF2]',
      badgeBg: 'bg-[#6C5CE7]',
      avatarBg: 'bg-[#FFD9E8]',
      avatarType: 'vp',
      stats: [
        { label: 'Organization', score: '98' },
        { label: 'Team Harmony', score: '99' },
        { label: 'Sprint Speed', score: '94' },
      ],
    },
    {
      name: 'Technical Lead',
      role: 'Technical Lead',
      archetype: 'CHAOS & CODE ENGINEER',
      tagline: 'Code. Build. Break things.',
      quote: 'If it compiles on the first try without warnings, you probably did something wrong.',
      cardColor: 'bg-[#E1F5FE]',
      badgeBg: 'bg-[#00D2D3]',
      avatarBg: 'bg-[#D6EEFF]',
      avatarType: 'techlead',
      stats: [
        { label: 'Hardware SLAM', score: '96' },
        { label: 'ROS 2 Plumbing', score: '99' },
        { label: 'Bug Fixing', score: '97' },
      ],
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-10 right-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Crown className="w-5 h-5 text-[#FFD32A]" />
              CLUB LEADERSHIP
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#6C5CE7" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-black text-[#121316] tracking-tight">
            The Executive Helms 👑
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            Character cards of the leaders shaping the vision and execution of ATC:
          </p>
        </div>

        {/* 3 Large Collectible Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {leaders.map((leader, index) => (
            <div
              key={leader.name}
              className={`group relative p-7 sm:p-8 rounded-[40px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-300 flex flex-col justify-between ${
                leader.cardColor
              } hover:-translate-y-2 select-none`}
            >
              {/* Tape Strip on Top */}
              <div className="tape-strip pointer-events-none" />

              <div>
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-white font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm ${leader.badgeBg}`}>
                    ★ {leader.archetype}
                  </span>
                  <span className="font-mono text-xs font-black text-gray-500 bg-white/80 px-2 py-0.5 rounded border border-[#121316]/20">
                    CARD #0{index + 1}
                  </span>
                </div>

                {/* Avatar Portrait Box */}
                <div className="relative mb-6 flex items-center justify-center">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#121316] shadow-pop bg-white p-2 group-hover:scale-105 transition-transform duration-300">
                    <AvatarIllustration type={leader.avatarType} />
                  </div>
                </div>

                {/* Name & Role */}
                <div className="text-center space-y-1 mb-4">
                  <span className="text-xs font-mono font-black uppercase text-[#6C5CE7]">
                    {leader.role}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                    {leader.name}
                  </h3>
                  <p className="text-sm font-black text-[#FF793F] font-display">
                    "{leader.tagline}"
                  </p>
                </div>

                {/* Quote Bubble */}
                <div className="p-4 bg-white/80 rounded-2xl border-2 border-[#121316] shadow-pop-sm mb-6 text-xs sm:text-sm font-hand font-bold text-gray-800 text-center leading-snug">
                  "{leader.quote}"
                </div>

                {/* RPG Stats Bar */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-2xl border-2 border-[#121316] mb-6 text-center font-mono">
                  {leader.stats.map((st) => (
                    <div key={st.label} className="space-y-0.5">
                      <span className="text-[10px] text-gray-500 block">{st.label}</span>
                      <span className="font-black text-[#121316] text-sm">{st.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Socials & Seal */}
              <div className="pt-4 border-t-2 border-[#121316]/15 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-gray-500">
                  NIAT PUNE CORE
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#121316] hover:bg-[#FFE600] transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#121316] hover:bg-[#FFE600] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
