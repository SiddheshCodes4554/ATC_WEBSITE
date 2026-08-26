import React, { useState } from 'react';
import { LabHero } from '../components/lab/LabHero';
import { LabDomains } from '../components/lab/LabDomains';
import { LabStatusSection } from '../components/lab/LabStatusSection';
import { LabDomain } from '../components/lab/InteractiveLabScene';

export const LabPage: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<LabDomain>('robotics');

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION WITH DYNAMIC LAB SCENE */}
      <LabHero
        activeDomain={activeDomain}
        onDomainSelect={(domain) => setActiveDomain(domain)}
      />

      {/* 2. LAB DOMAINS (INTERACTIVE DOMAIN CARDS) */}
      <LabDomains
        activeDomain={activeDomain}
        onDomainSelect={(domain) => setActiveDomain(domain)}
      />

      {/* 3. LAB STATUS & PEEKING ROBOT MASCOT */}
      <LabStatusSection />
    </div>
  );
};
