import React from 'react';
import { ATCEvent, EventVisualTheme } from './event.types';
import { EventForm, FormField, EventRegistration } from './form.types';

export interface ThemeMetadata {
  id: EventVisualTheme;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  accentColor: string;
  bgPreview: string;
  textColor: string;
  borderStyle: string;
  iconName: string;
  idealFor: string;
}

export const THEME_PRESETS: Record<string, ThemeMetadata> = {
  playful: {
    id: 'playful',
    name: 'Playful Chaos',
    badge: 'PLAYFUL',
    tagline: 'Comic stickers, wobbly badges & pastel vibes',
    description: 'Unconventional layouts with interactive stickers, comic doodles, confetti, and playful retro polaroids.',
    accentColor: '#FF6B6B',
    bgPreview: 'bg-[#FFF9DB]',
    textColor: 'text-[#121316]',
    borderStyle: 'border-[#121316]',
    iconName: 'Smile',
    idealFor: 'Worst UI/UX, Creative Jams, Icebreakers',
  },
  terminal: {
    id: 'terminal',
    name: 'Developer Terminal',
    badge: 'CLI / DEV',
    tagline: 'Shell prompts, Git graphs & code diffs',
    description: 'Dark terminal window with typing cursor, interactive branch nodes, commit histories, and IDE-styled forms.',
    accentColor: '#2ED573',
    bgPreview: 'bg-[#0F172A]',
    textColor: 'text-emerald-400',
    borderStyle: 'border-emerald-500/40',
    iconName: 'Terminal',
    idealFor: 'Git & GitHub, GSoC, Open Source, Linux',
  },
  futuristic: {
    id: 'futuristic',
    name: 'Futuristic Cyber',
    badge: 'WEB3 / AI',
    tagline: 'Holographic grids, floating block nodes & depth',
    description: 'Deep cyber space, perspective blueprint grids, animated 3D block hashes, and glassmorphic telemetry cards.',
    accentColor: '#00D2D3',
    bgPreview: 'bg-[#0B0F19]',
    textColor: 'text-cyan-300',
    borderStyle: 'border-cyan-500/40',
    iconName: 'Cpu',
    idealFor: 'Blockchain, Web3, Edge AI, Cryptography',
  },
  energetic: {
    id: 'energetic',
    name: 'High Voltage',
    badge: 'HACKATHON',
    tagline: 'Electric speed lines, neon vibes & countdowns',
    description: 'High-voltage hackathon aesthetic with bold athletic typography, power-up badges, and arena stage brackets.',
    accentColor: '#FFE600',
    bgPreview: 'bg-[#18181B]',
    textColor: 'text-yellow-300',
    borderStyle: 'border-yellow-400',
    iconName: 'Zap',
    idealFor: '24-48hr Hackathons, Robot Wars, Arena Contests',
  },
  editorial: {
    id: 'editorial',
    name: 'Tech Editorial',
    badge: 'KEYNOTE',
    tagline: 'Magazine typography, clean grid & pull quotes',
    description: 'High-fashion editorial layout with refined typography, prominent pull quotes, speaker keynotes, and curated gallery.',
    accentColor: '#6C5CE7',
    bgPreview: 'bg-[#FDFBF7]',
    textColor: 'text-gray-900',
    borderStyle: 'border-gray-900',
    iconName: 'BookOpen',
    idealFor: 'Tech Talks, Panel Discussions, Research Symposiums',
  },
  experimental: {
    id: 'experimental',
    name: 'Brutalist Raw',
    badge: 'BRUTALIST',
    tagline: 'Hazard tape, glitch badges & stamped cards',
    description: 'Raw high-contrast brutalist design with hazard stripes, glitch stickers, physical stamps, and bold monospace.',
    accentColor: '#FF4757',
    bgPreview: 'bg-[#FAF7F0]',
    textColor: 'text-black',
    borderStyle: 'border-black',
    iconName: 'Flame',
    idealFor: 'Hardware Hacks, Chaos Sprints, Extreme Coding',
  },
  digital: {
    id: 'digital',
    name: 'Retro Digital',
    badge: 'CIRCUIT / CRT',
    tagline: 'CRT scanlines, green phosphor & PCB traces',
    description: 'Retro hardware aesthetic with phosphor scanlines, circuit board traces, glowing chip pinouts, and hardware HUD.',
    accentColor: '#10AC84',
    bgPreview: 'bg-[#05130E]',
    textColor: 'text-emerald-300',
    borderStyle: 'border-emerald-600',
    iconName: 'Layers',
    idealFor: 'Hardware Engineering, IoT, Embedded Systems, Firmware',
  },
};

/**
 * Shared props delivered to each specialized Theme Experience component
 */
export interface EventExperienceProps {
  event: ATCEvent;
  eventForm: EventForm | null;
  displayedFields: FormField[];
  formValues: Record<string, any>;
  onFieldChange: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submissionResult: EventRegistration | null;
  formErrorMessage: string | null;
  fieldErrors: Record<string, string>;
  formLoading: boolean;
  coverUrl: string;
  accentColor: string;
  isRegistrationActive: boolean;
  formatDate: (iso?: string | null) => string;
  handleShare: () => void;
  copied: boolean;
  legacyData?: any;
  galleryImages?: import('./eventGallery.types').EventGalleryImage[];
}
