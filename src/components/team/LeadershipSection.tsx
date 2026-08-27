import { ArrowUpRight, Crown, Sparkles } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../common/SocialIcons';
import { StorageService } from '../../services/storage.service';
import { TeamMember } from '../../types/team.types';

interface LeadershipSectionProps {
  president?: TeamMember | null;
  vicePresident?: TeamMember | null;
  loading?: boolean;
}

const DefaultLeaderAvatar = ({ name, bg = '#FFE600' }: { name: string; bg?: string }) => (
  <div
    className="w-full h-full rounded-full flex items-center justify-center font-mono font-black text-4xl text-[#121316] border-2 border-[#121316]"
    style={{ backgroundColor: bg }}
  >
    {name ? name.charAt(0).toUpperCase() : '★'}
  </div>
);

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  president,
  vicePresident,
  loading = false,
}) => {
  const leaders = [
    {
      data: president,
      defaultRole: 'President',
      icon: <Crown className="w-4 h-4 fill-[#121316]" />,
      cardColor: 'bg-[#FFF9DB]',
      badgeBg: 'bg-[#FFE600] text-[#121316]',
      avatarBg: '#FFE600',
    },
    {
      data: vicePresident,
      defaultRole: 'Vice President',
      icon: <Sparkles className="w-4 h-4" />,
      cardColor: 'bg-[#FFEBF2]',
      badgeBg: 'bg-[#6C5CE7] text-white',
      avatarBg: '#FFD9E8',
    },
  ].filter((l) => l.data !== null && l.data !== undefined);

  if (!loading && leaders.length === 0) {
    return null; // Gracefully omit section if no leadership appointed yet
  }

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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop animate-pulse flex flex-col items-center gap-4"
              >
                <div className="w-36 h-36 rounded-full bg-gray-200" />
                <div className="w-24 h-6 bg-gray-200 rounded-full" />
                <div className="w-40 h-8 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-8 items-stretch ${leaders.length === 1 ? 'max-w-md mx-auto grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {leaders.map(({ data: leader, icon, cardColor, badgeBg, avatarBg }) => {
              if (!leader) return null;
              const avatarUrl = leader.imageId ? StorageService.getTeamMemberAvatarUrl(leader.imageId, 400) : null;

              return (
                <div
                  key={leader.$id || leader.name}
                  className={`p-6 sm:p-8 rounded-[36px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-200 flex flex-col items-center text-center justify-between ${cardColor} hover:-translate-y-1 select-none`}
                >
                  <div className="flex flex-col items-center w-full">
                    
                    {/* Avatar Picture */}
                    <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-[#121316] shadow-pop bg-white p-1.5 mb-6 overflow-hidden flex items-center justify-center">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={leader.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <DefaultLeaderAvatar name={leader.name} bg={avatarBg} />
                      )}
                    </div>

                    {/* Role Badge */}
                    <span className={`px-4 py-1 rounded-full font-mono font-black text-xs uppercase border-2 border-[#121316] shadow-pop-sm mb-2 flex items-center gap-1.5 ${badgeBg}`}>
                      {icon}
                      <span>{leader.role}</span>
                    </span>

                    {/* Name */}
                    <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mb-2">
                      {leader.name}
                    </h3>
                  </div>

                  {/* Social Buttons */}
                  <div className="w-full pt-4 border-t-2 border-[#121316]/15 flex flex-wrap items-center justify-center gap-2.5">
                    {leader.linkedinUrl && (
                      <a
                        href={leader.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all hover:scale-105"
                      >
                        <LinkedinIcon className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>LinkedIn</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                      </a>
                    )}

                    {leader.githubUrl && (
                      <a
                        href={leader.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#121316] hover:text-white text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all hover:scale-105"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
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

export default LeadershipSection;
