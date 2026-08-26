import React from 'react';
import { ArrowUpRight, Users } from 'lucide-react';

interface CoreMember {
  name: string;
  role: string;
  cardColor: string;
  badgeBg: string;
  linkedinUrl: string;
  avatar: React.ReactNode;
}

const SocialHeadAvatar = () => (
  <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
    <circle cx="80" cy="80" r="70" fill="#FFD9E8" stroke="#121316" strokeWidth="3.5" />
    <path d="M45 65 C45 30 115 30 115 65 Z" fill="#6C5CE7" />
    <circle cx="80" cy="85" r="34" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
    <circle cx="70" cy="80" r="3.5" fill="#121316" />
    <circle cx="90" cy="80" r="3.5" fill="#121316" />
    <path d="M72 98 Q80 106 88 98" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const OpsHeadAvatar = () => (
  <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
    <circle cx="80" cy="80" r="70" fill="#FFF3E0" stroke="#121316" strokeWidth="3.5" />
    <path d="M48 65 C48 30 112 30 112 65 Z" fill="#121316" />
    <circle cx="80" cy="85" r="34" fill="#FAD390" stroke="#121316" strokeWidth="2.5" />
    <circle cx="68" cy="80" r="3.5" fill="#121316" />
    <circle cx="92" cy="80" r="3.5" fill="#121316" />
    <path d="M72 100 Q80 107 88 100" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const OutreachHeadAvatar = () => (
  <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
    <circle cx="80" cy="80" r="70" fill="#F0EBFF" stroke="#121316" strokeWidth="3.5" />
    <path d="M42 65 C42 25 118 25 118 65 Z" fill="#2E86DE" />
    <circle cx="80" cy="85" r="34" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
    <circle cx="70" cy="80" r="3.5" fill="#121316" />
    <circle cx="90" cy="80" r="3.5" fill="#121316" />
    <path d="M72 98 Q80 106 88 98" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const FinanceHeadAvatar = () => (
  <svg viewBox="0 0 160 160" fill="none" className="w-full h-full">
    <circle cx="80" cy="80" r="70" fill="#E8F5E9" stroke="#121316" strokeWidth="3.5" />
    <path d="M40 85 C35 35 125 35 120 85 Z" fill="#10AC84" />
    <circle cx="80" cy="80" r="32" fill="#FAD390" stroke="#121316" strokeWidth="2.5" />
    <circle cx="70" cy="78" r="3.5" fill="#121316" />
    <circle cx="90" cy="78" r="3.5" fill="#121316" />
    <path d="M72 94 Q80 102 88 94" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const CoreTeamSection: React.FC = () => {
  const coreMembers: CoreMember[] = [
    {
      name: 'Prem Sonar',
      role: 'Social Media Head',
      cardColor: 'bg-[#FFEBF2]',
      badgeBg: 'bg-[#FF6B6B] text-white',
      linkedinUrl: 'https://linkedin.com',
      avatar: <SocialHeadAvatar />,
    },
    {
      name: 'Siddhesh Gawade',
      role: 'Operations Head',
      cardColor: 'bg-[#FFF3E0]',
      badgeBg: 'bg-[#FF793F] text-white',
      linkedinUrl: 'https://linkedin.com',
      avatar: <OpsHeadAvatar />,
    },
    {
      name: 'Aryan Deo',
      role: 'Outreach Head',
      cardColor: 'bg-[#F0EBFF]',
      badgeBg: 'bg-[#6C5CE7] text-white',
      linkedinUrl: 'https://linkedin.com',
      avatar: <OutreachHeadAvatar />,
    },
    {
      name: 'Amisha Patel',
      role: 'Finance Head',
      cardColor: 'bg-[#E8F5E9]',
      badgeBg: 'bg-[#10AC84] text-white',
      linkedinUrl: 'https://linkedin.com',
      avatar: <FinanceHeadAvatar />,
    },
  ];

  return (
    <section className="relative bg-[#FAF7F0] py-16 paper-pattern border-b-4 border-[#121316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-3 border-[#121316] shadow-pop font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-[#121316]">
            <Users className="w-4 h-4 text-[#6C5CE7]" />
            CORE TEAM HEADS
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
            The Department Leads
          </h2>
        </div>

        {/* 4 Clean Side-by-Side Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {coreMembers.map((member) => (
            <div
              key={member.name}
              className={`p-6 rounded-[32px] border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col items-center text-center justify-between ${member.cardColor} hover:-translate-y-1 select-none`}
            >
              <div className="flex flex-col items-center w-full">
                
                {/* Avatar Image Placeholder */}
                <div className="w-32 h-32 rounded-full border-3 border-[#121316] shadow-pop-sm bg-white p-2 mb-4">
                  {member.avatar}
                </div>

                {/* Role Badge */}
                <span className={`px-3 py-0.5 rounded-full font-mono font-black text-[11px] uppercase border-2 border-[#121316] shadow-pop-sm mb-2 ${member.badgeBg}`}>
                  {member.role}
                </span>

                {/* Name */}
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight mb-4">
                  {member.name}
                </h3>
              </div>

              {/* LinkedIn Button */}
              <div className="w-full pt-4 border-t-2 border-[#121316]/15 flex justify-center">
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all hover:scale-105"
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
