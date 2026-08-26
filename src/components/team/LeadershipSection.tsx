import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface LeaderMember {
  name: string;
  role: string;
  cardColor: string;
  badgeBg: string;
  linkedinUrl: string;
  avatar: React.ReactNode;
}

const PresidentAvatar = () => (
  <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
    <circle cx="80" cy="80" r="70" fill="#FFE600" stroke="#121316" strokeWidth="3.5" />
    <path d="M45 70 C45 35 115 35 115 70 Z" fill="#121316" />
    <circle cx="80" cy="85" r="35" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
    {/* Glasses */}
    <rect x="58" y="75" width="18" height="12" rx="3" fill="#121316" />
    <rect x="84" y="75" width="18" height="12" rx="3" fill="#121316" />
    <line x1="76" y1="81" x2="84" y2="81" stroke="#121316" strokeWidth="2" />
    <path d="M72 105 Q80 112 88 105" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const VPAvatar = () => (
  <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
    <circle cx="80" cy="80" r="70" fill="#FFD9E8" stroke="#121316" strokeWidth="3.5" />
    <path d="M42 90 C35 40 125 40 118 90 C110 110 50 110 42 90 Z" fill="#6C5CE7" />
    <circle cx="80" cy="80" r="32" fill="#FAD390" stroke="#121316" strokeWidth="2.5" />
    <circle cx="70" cy="78" r="3.5" fill="#121316" />
    <circle cx="90" cy="78" r="3.5" fill="#121316" />
    <circle cx="64" cy="88" r="4" fill="#FF7675" />
    <circle cx="96" cy="88" r="4" fill="#FF7675" />
    <path d="M72 94 Q80 102 88 94" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const LeadershipSection: React.FC = () => {
  const leaders: LeaderMember[] = [
    {
      name: 'Yeswin Sri Datta',
      role: 'President',
      cardColor: 'bg-[#FFF9DB]',
      badgeBg: 'bg-[#FFE600] text-[#121316]',
      linkedinUrl: 'https://linkedin.com',
      avatar: <PresidentAvatar />,
    },
    {
      name: 'Ayushi Srivastava',
      role: 'Vice President',
      cardColor: 'bg-[#FFEBF2]',
      badgeBg: 'bg-[#6C5CE7] text-white',
      linkedinUrl: 'https://linkedin.com',
      avatar: <VPAvatar />,
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-16 paper-pattern border-b-4 border-[#121316]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-3 border-[#121316] shadow-pop font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-[#121316]">
            <span>👑</span> CLUB LEADERSHIP
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
            President & Vice President
          </h2>
        </div>

        {/* 2 Clean Side-by-Side Leadership Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className={`p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-200 flex flex-col items-center text-center justify-between ${leader.cardColor} hover:-translate-y-1 select-none`}
            >
              <div className="flex flex-col items-center w-full">
                
                {/* Avatar Image Placeholder */}
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-[#121316] shadow-pop bg-white p-2 mb-6">
                  {leader.avatar}
                </div>

                {/* Role Badge */}
                <span className={`px-4 py-1 rounded-full font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm mb-2 ${leader.badgeBg}`}>
                  {leader.role}
                </span>

                {/* Name */}
                <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mb-4">
                  {leader.name}
                </h3>
              </div>

              {/* LinkedIn Button */}
              <div className="w-full pt-4 border-t-2 border-[#121316]/15 flex justify-center">
                <a
                  href={leader.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all hover:scale-105"
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
