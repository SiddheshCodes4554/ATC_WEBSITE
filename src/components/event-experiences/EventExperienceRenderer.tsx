import React from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { EventVisualTheme } from '../../types/event.types';
import { PlayfulExperience } from './PlayfulExperience';
import { TerminalExperience } from './TerminalExperience';
import { FuturisticExperience } from './FuturisticExperience';
import { EnergeticExperience } from './EnergeticExperience';
import { EditorialExperience } from './EditorialExperience';
import { ExperimentalExperience } from './ExperimentalExperience';
import { DigitalExperience } from './DigitalExperience';

/**
 * Helper to determine or auto-infer the visual theme for an event
 */
export const resolveEventTheme = (
  explicitTheme?: string | null,
  slug?: string,
  eventType?: string
): EventVisualTheme => {
  if (explicitTheme && explicitTheme.trim()) {
    const normalized = explicitTheme.toLowerCase().trim();
    if (['playful', 'terminal', 'futuristic', 'energetic', 'editorial', 'experimental', 'digital'].includes(normalized)) {
      return normalized as EventVisualTheme;
    }
  }

  // Auto-inference based on slug
  const s = (slug || '').toLowerCase();
  if (s.includes('worst-ui') || s.includes('ui-ux') || s.includes('chaos') || s.includes('fun')) {
    return 'playful';
  }
  if (s.includes('git') || s.includes('gsoc') || s.includes('github') || s.includes('linux') || s.includes('cli')) {
    return 'terminal';
  }
  if (s.includes('blockchain') || s.includes('mst') || s.includes('web3') || s.includes('crypto') || s.includes('ai-system')) {
    return 'futuristic';
  }
  if (s.includes('hackathon') || s.includes('arena') || s.includes('wars') || s.includes('sprint') || s.includes('battle')) {
    return 'energetic';
  }
  if (s.includes('keynote') || s.includes('talk') || s.includes('panel') || s.includes('symposium') || s.includes('conference')) {
    return 'editorial';
  }
  if (s.includes('hardware') || s.includes('iot') || s.includes('embedded') || s.includes('circuit')) {
    return 'digital';
  }

  // Auto-inference based on eventType
  const t = (eventType || '').toLowerCase();
  if (t === 'hackathon' || t === 'competition') return 'energetic';
  if (t === 'tech_talk') return 'editorial';
  if (t === 'workshop') return 'terminal';
  if (t === 'experience') return 'playful';

  return 'playful';
};

export const EventExperienceRenderer: React.FC<EventExperienceProps> = (props) => {
  const activeTheme = resolveEventTheme(
    props.event.visualTheme,
    props.event.slug,
    props.event.eventType
  );

  switch (activeTheme) {
    case 'terminal':
      return <TerminalExperience {...props} />;
    case 'futuristic':
      return <FuturisticExperience {...props} />;
    case 'energetic':
      return <EnergeticExperience {...props} />;
    case 'editorial':
      return <EditorialExperience {...props} />;
    case 'experimental':
      return <ExperimentalExperience {...props} />;
    case 'digital':
      return <DigitalExperience {...props} />;
    case 'playful':
    default:
      return <PlayfulExperience {...props} />;
  }
};
