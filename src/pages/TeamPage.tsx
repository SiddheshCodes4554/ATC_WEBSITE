import React from 'react';
import { TeamHero } from '../components/team/TeamHero';
import { LeadershipSection } from '../components/team/LeadershipSection';
import { CoreTeamSection } from '../components/team/CoreTeamSection';
import { JoinSquadCTA } from '../components/team/JoinSquadCTA';

export const TeamPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <TeamHero />

      {/* 2. LEADERSHIP SECTION (PRESIDENT & VICE PRESIDENT) */}
      <LeadershipSection />

      {/* 3. CORE TEAM HEADS (SIDE BY SIDE 4 CARDS) */}
      <CoreTeamSection />

      {/* 4. JOIN THE SQUAD CLOSING CTA */}
      <JoinSquadCTA />
    </div>
  );
};
