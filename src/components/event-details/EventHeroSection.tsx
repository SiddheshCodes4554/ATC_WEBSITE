import React from 'react';
import { Calendar, MapPin, Building, Tag, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DetailedEvent } from '../../data/eventsData';
import { WorstUIUXHeroCover } from './WorstUIUXHeroCover';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';

interface EventHeroSectionProps {
  event: DetailedEvent;
}

export const EventHeroSection: React.FC<EventHeroSectionProps> = ({ event }) => {
  return (
    <section className="relative bg-[#FAF7F0] pt-8 sm:pt-12 pb-16 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Sparkle Doodles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-10 h-10" color={event.heroTheme.accentColor} />
      </div>
      <div className="absolute top-14 right-14 opacity-50 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FFE600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Link Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] hover:bg-[#FFE600] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>BACK TO ALL EVENTS</span>
          </Link>
        </div>

        {/* Category & Title Header Area */}
        <div className="space-y-4 max-w-4xl mb-10">
          
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-black uppercase text-white border-3 border-[#121316] shadow-pop-sm bg-[#FF6B6B]">
            <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
            {event.category} ARCHIVE
          </div>

          {/* Large Striking Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.04]">
            {event.title}
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-3xl font-black text-[#6C5CE7] font-display">
            "{event.tagline}"
          </p>

          {/* Event Metadata Badges Grid */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-mono font-bold text-gray-800">
            
            <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm space-y-1">
              <span className="text-[10px] text-gray-500 font-extrabold flex items-center gap-1 uppercase">
                <Calendar className="w-3.5 h-3.5 text-[#FF793F]" /> Date
              </span>
              <p className="text-[#121316] font-black">{event.date}</p>
            </div>

            <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm space-y-1">
              <span className="text-[10px] text-gray-500 font-extrabold flex items-center gap-1 uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#2E86DE]" /> Venue
              </span>
              <p className="text-[#121316] font-black">{event.venue}</p>
            </div>

            <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm space-y-1">
              <span className="text-[10px] text-gray-500 font-extrabold flex items-center gap-1 uppercase">
                <Building className="w-3.5 h-3.5 text-[#6C5CE7]" /> Organized By
              </span>
              <p className="text-[#121316] font-black">{event.organizedBy}</p>
            </div>

            <div className="p-3 bg-white rounded-2xl border-2 border-[#121316] shadow-pop-sm space-y-1">
              <span className="text-[10px] text-gray-500 font-extrabold flex items-center gap-1 uppercase">
                <Tag className="w-3.5 h-3.5 text-[#10AC84]" /> Event Type
              </span>
              <p className="text-[#121316] font-black">{event.eventType}</p>
            </div>

          </div>

        </div>

        {/* Large Custom Event Cover Illustration Showcase */}
        <div className="relative">
          <WorstUIUXHeroCover />
        </div>

      </div>
    </section>
  );
};
