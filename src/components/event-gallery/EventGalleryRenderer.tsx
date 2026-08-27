import React from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { EventVisualTheme } from '../../types/event.types';
import { PlayfulGallery } from './PlayfulGallery';
import { TerminalGallery } from './TerminalGallery';
import { FuturisticGallery } from './FuturisticGallery';
import { DigitalGallery } from './DigitalGallery';
import { EnergeticGallery } from './EnergeticGallery';
import { ExperimentalGallery } from './ExperimentalGallery';
import { EditorialGallery } from './EditorialGallery';

interface EventGalleryRendererProps {
  images: EventGalleryImage[];
  visualTheme?: EventVisualTheme | string | null;
  isCompleted?: boolean;
}

/**
 * EventGalleryRenderer
 * Theme-aware gallery dispatcher that selects the presentation component
 * based on event.visualTheme while sharing the unified Appwrite event gallery data.
 */
export const EventGalleryRenderer: React.FC<EventGalleryRendererProps> = ({
  images,
  visualTheme = 'playful',
  isCompleted = false,
}) => {
  // If no images exist in the gallery, do not render an empty section
  if (!images || images.length === 0) {
    return null;
  }

  const themeKey = (visualTheme || 'playful').toLowerCase().trim();

  switch (themeKey) {
    case 'terminal':
      return <TerminalGallery images={images} isCompleted={isCompleted} />;
    case 'futuristic':
      return <FuturisticGallery images={images} isCompleted={isCompleted} />;
    case 'digital':
      return <DigitalGallery images={images} isCompleted={isCompleted} />;
    case 'energetic':
      return <EnergeticGallery images={images} isCompleted={isCompleted} />;
    case 'experimental':
      return <ExperimentalGallery images={images} isCompleted={isCompleted} />;
    case 'editorial':
      return <EditorialGallery images={images} isCompleted={isCompleted} />;
    case 'playful':
    default:
      return <PlayfulGallery images={images} isCompleted={isCompleted} />;
  }
};

export default EventGalleryRenderer;
