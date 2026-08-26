import React from 'react';
import { AboutHero } from '../components/about/AboutHero';
import { JourneyTimeline } from '../components/about/JourneyTimeline';
import { PillarsSection } from '../components/about/PillarsSection';
import { WhyATCSection } from '../components/about/WhyATCSection';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <AboutHero />

      {/* SECTION: OUR JOURNEY (TIMELINE) */}
      <JourneyTimeline />

      {/* SECTION: OUR PILLARS (4 INTERACTIVE BLOCKS) */}
      <PillarsSection />

      {/* SECTION: WHY ATC? (CURIOSITY FUNNEL & CTA) */}
      <WhyATCSection />
    </div>
  );
};
