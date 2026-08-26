import React, { useState } from 'react';
import { JoinHero } from '../components/join/JoinHero';
import { ThreePathsSection } from '../components/join/ThreePathsSection';
import { FinalCulminationCTA } from '../components/join/FinalCulminationCTA';
import { JoinModals } from '../components/join/JoinModals';

export const JoinPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'community' | 'core' | 'partner' | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <JoinHero />

      {/* 2. THE THREE PATHS (COMMUNITY, CORE TEAM, COLLABORATE) */}
      <ThreePathsSection onSelectPath={(path) => setActiveModal(path)} />

      {/* 3. FINAL GRAND CULMINATION CTA (CONVERGING DOODLES) */}
      <FinalCulminationCTA onJoinClick={() => setActiveModal('community')} />

      {/* 4. INTERACTIVE APPLICATION MODALS */}
      <JoinModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
