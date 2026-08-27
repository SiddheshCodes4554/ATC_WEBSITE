import React from 'react';
import { X, Calendar, MapPin, Trophy, Users, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { PlayfulButton } from '../ui/PlayfulButton';

export interface EventItem {
  id: string;
  title: string;
  category: 'Workshops' | 'Hackathons' | 'Tech Talks' | 'Competitions' | 'Experiences' | string;
  date: string;
  location: string;
  status: 'Completed' | 'Upcoming' | 'Registration Open' | 'Live Now' | 'Cancelled' | 'Draft' | string;
  tagline: string;
  description: string;
  fullRecap?: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  color: string;
  badgeBg: string;
  illustration: React.ReactNode;
  coverImageUrl?: string;
  startDate?: string;
}

interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-[#FAF7F0] rounded-[36px] border-4 border-[#121316] shadow-pop-xl overflow-hidden p-6 sm:p-8 paper-pattern my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#121316] hover:bg-[#FF6B6B] hover:text-white transition-all active:scale-95 z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Category & Status Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-black uppercase text-white border-2 border-[#121316] ${event.badgeBg}`}>
            {event.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFD1E3] text-[#121316] border-2 border-[#121316] flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {event.status}
          </span>
        </div>

        {/* Title & Tagline */}
        <h2 className="text-2xl sm:text-4xl font-black text-[#121316] tracking-tight leading-tight mb-2">
          {event.title}
        </h2>
        <p className="text-base sm:text-lg font-bold text-[#6C5CE7] mb-4">
          {event.tagline}
        </p>

        {/* Event Meta Bar */}
        <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-gray-700 p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#FF793F]" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#2E86DE]" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Illustration Preview Area */}
        <div className={`p-6 rounded-2xl border-3 border-[#121316] mb-6 flex items-center justify-center ${event.color}`}>
          <div className="max-w-[280px] w-full">
            {event.illustration}
          </div>
        </div>

        {/* Full Narrative Recap */}
        <div className="space-y-4 text-sm sm:text-base font-bold text-gray-800 leading-relaxed mb-6">
          <p>{event.description}</p>
          {event.fullRecap && (
            <p className="p-4 rounded-2xl bg-white border-2 border-[#121316] text-xs sm:text-sm font-medium text-gray-700 leading-normal">
              {event.fullRecap}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {event.stats.map((st) => (
            <div key={st.label} className="p-3 bg-white rounded-xl border-2 border-[#121316] shadow-pop-sm text-center">
              <div className="font-black text-xl sm:text-2xl text-[#121316]">{st.value}</div>
              <div className="text-[11px] font-mono text-gray-600 font-bold">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Key Highlights */}
        <div className="mb-6 space-y-2">
          <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-600">
            EVENT HIGHLIGHTS & OUTCOMES:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-bold text-gray-800">
            {event.highlights.map((hl, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-[#121316]/20">
                <Sparkles className="w-4 h-4 text-[#FFE600] flex-shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <PlayfulButton
            onClick={onClose}
            variant="primary"
            size="md"
          >
            Close Recap
          </PlayfulButton>
        </div>
      </div>
    </div>
  );
};
