import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { WhatWeDoSection } from '../components/home/WhatWeDoSection';
import { LabSection } from '../components/home/LabSection';
import { JourneySection } from '../components/home/JourneySection';
import { JoinSection } from '../components/home/JoinSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1 — HERO */}
      <HeroSection />

      {/* SECTION 2 — WHAT WE DO */}
      <WhatWeDoSection />

      {/* SECTION 3 — ATC 5.0 LAB FEATURE */}
      <LabSection />

      {/* SECTION 4 — OUR JOURNEY SO FAR */}
      <JourneySection />

      {/* SECTION 5 — JOIN THE MOVEMENT */}
      <JoinSection />
    </div>
  );
};
