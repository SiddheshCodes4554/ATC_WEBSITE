import React, { useEffect, useState } from 'react';
import { TeamHero } from '../components/team/TeamHero';
import { LeadershipSection } from '../components/team/LeadershipSection';
import { CoreTeamSection } from '../components/team/CoreTeamSection';
import { JoinSquadCTA } from '../components/team/JoinSquadCTA';
import { TeamService } from '../services/teamService';
import { TeamMember } from '../types/team.types';

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadActiveTeam = async () => {
      setLoading(true);
      try {
        const res = await TeamService.getActiveMembers();
        if (isMounted && res.success && res.data) {
          setMembers(res.data);
        }
      } catch (err) {
        console.warn('Could not load active team from Appwrite:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadActiveTeam();

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Separate Leadership (President first, VP second)
  const president = members.find((m) => m.role === 'President') || null;
  const vicePresident = members.find((m) => m.role === 'Vice President') || null;

  // 2. Sort Core Members by displayOrder ASC
  const coreMembers = members
    .filter((m) => m.role !== 'President' && m.role !== 'Vice President')
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <TeamHero />

      {/* 2. LEADERSHIP SECTION (PRESIDENT & VICE PRESIDENT) */}
      <LeadershipSection
        president={president}
        vicePresident={vicePresident}
        loading={loading}
      />

      {/* 3. CORE TEAM HEADS (SORTED BY DISPLAY ORDER) */}
      <CoreTeamSection
        members={coreMembers}
        loading={loading}
      />

      {/* 4. JOIN THE SQUAD CLOSING CTA */}
      <JoinSquadCTA />
    </div>
  );
};

export default TeamPage;
