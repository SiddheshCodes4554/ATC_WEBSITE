import React from 'react';
import { ArrowUpRight, Users } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../common/SocialIcons';
import { StorageService } from '../../services/storage.service';
import { TeamMember } from '../../types/team.types';

interface CoreTeamSectionProps {
  members: TeamMember[];
  loading?: boolean;
}

const colorThemes = [
  { card: 'bg-[#FFEBF2]', badge: 'bg-[#FF6B6B] text-white', avatarBg: '#FFD9E8' },
  { card: 'bg-[#FFF3E0]', badge: 'bg-[#FF793F] text-white', avatarBg: '#FFEAA7' },
  { card: 'bg-[#F0EBFF]', badge: 'bg-[#6C5CE7] text-white', avatarBg: '#E1DCFF' },
  { card: 'bg-[#E8F5E9]', badge: 'bg-[#10AC84] text-white', avatarBg: '#C8F7DC' },
  { card: 'bg-[#E1F5FE]', badge: 'bg-[#0984E3] text-white', avatarBg: '#DFF9FB' },
  { card: 'bg-[#FFF9DB]', badge: 'bg-[#FFE600] text-[#121316]', avatarBg: '#FFF9DB' },
];

const DefaultCoreAvatar = ({ name, bg }: { name: string; bg: string }) => (
  <div
    className="w-full h-full rounded-full flex items-center justify-center font-mono font-black text-2xl text-[#121316] border-2 border-[#121316]"
    style={{ backgroundColor: bg }}
  >
    {name ? name.charAt(0).toUpperCase() : '★'}
  </div>
);

export const CoreTeamSection: React.FC<CoreTeamSectionProps> = ({
  members,
  loading = false,
}) => {
  if (!loading && members.length === 0) {
    return null; // Don't render empty placeholder cards if no core members exist
  }

  return (
    <section className="relative bg-[#FAF7F0] py-16 paper-pattern border-b-4 border-[#121316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-3 border-[#121316] shadow-pop font-mono font-black text-xs sm:text-sm uppercase tracking-wider text-[#121316]">
            <Users className="w-4 h-4 text-[#6C5CE7]" />
            CORE TEAM
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
            The Core Department Leads
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop animate-pulse flex flex-col items-center gap-3"
              >
                <div className="w-28 h-28 rounded-full bg-gray-200" />
                <div className="w-20 h-5 bg-gray-200 rounded-full" />
                <div className="w-32 h-6 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {members.map((member, index) => {
              const theme = colorThemes[index % colorThemes.length];
              const avatarUrl = member.imageId ? StorageService.getTeamMemberAvatarUrl(member.imageId, 300) : null;

              return (
                <div
                  key={member.$id || member.name}
                  className={`p-6 rounded-[32px] border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col items-center text-center justify-between ${theme.card} hover:-translate-y-1 select-none`}
                >
                  <div className="flex flex-col items-center w-full">
                    
                    {/* Avatar Image Placeholder */}
                    <div className="w-32 h-32 rounded-full border-3 border-[#121316] shadow-pop-sm bg-white p-1 mb-4 overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <DefaultCoreAvatar name={member.name} bg={theme.avatarBg} />
                      )}
                    </div>

                    {/* Role Badge */}
                    <span className={`px-3 py-0.5 rounded-full font-mono font-black text-[11px] uppercase border-2 border-[#121316] shadow-pop-sm mb-2 truncate max-w-[200px] ${theme.badge}`}>
                      {member.role}
                    </span>

                    {/* Name */}
                    <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight mb-4">
                      {member.name}
                    </h3>
                  </div>

                  {/* Social Buttons */}
                  <div className="w-full pt-4 border-t-2 border-[#121316]/15 flex flex-wrap items-center justify-center gap-2">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all hover:scale-105"
                      >
                        <LinkedinIcon className="w-3 h-3 text-[#6C5CE7]" />
                        <span>LinkedIn</span>
                        <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                      </a>
                    )}

                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#121316] hover:text-white text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all hover:scale-105"
                      >
                        <GithubIcon className="w-3 h-3" />
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default CoreTeamSection;
