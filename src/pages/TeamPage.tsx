import React from 'react';
import { TeamHero } from '../components/team/TeamHero';
import { LeadershipSection } from '../components/team/LeadershipSection';
import { TeamsExplorerSection } from '../components/team/TeamsExplorerSection';
import { JoinSquadCTA } from '../components/team/JoinSquadCTA';

export const TeamPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <TeamHero />

      {/* 2. LEADERSHIP COLLECTIBLE CHARACTER CARDS */}
      <LeadershipSection />

      {/* 3. OUR SPECIALIST TEAMS & HEADS EXPLORER */}
      <TeamsExplorerSection />

      {/* 4. JOIN THE SQUAD CLOSING CTA */}
      <JoinSquadCTA />
    </div>
  );
};
