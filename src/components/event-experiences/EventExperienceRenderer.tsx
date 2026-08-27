import React from 'react';
import { EventExperienceProps } from '../../types/experience.types';
import { PlayfulExperience } from './PlayfulExperience';

/**
 * EventExperienceRenderer
 * Renders all ATC event detail pages with the unified, vibrant playful neo-brutalist theme
 * with context-aware interactive widgets based on the event topics.
 */
export const EventExperienceRenderer: React.FC<EventExperienceProps> = (props) => {
  return <PlayfulExperience {...props} />;
};

export default EventExperienceRenderer;
