import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsArchive } from '../data/eventsData';
import { EventHeroSection } from '../components/event-details/EventHeroSection';
import { EventAtAGlance } from '../components/event-details/EventAtAGlance';
import { AboutEventSection } from '../components/event-details/AboutEventSection';
import { MissionSection } from '../components/event-details/MissionSection';
import { EventHighlightsSection } from '../components/event-details/EventHighlightsSection';
import { EventGalleryScrapbook } from '../components/event-details/EventGalleryScrapbook';
import { LearningsSection } from '../components/event-details/LearningsSection';
import { WinnersSection } from '../components/event-details/WinnersSection';
import { EventQuotesSection } from '../components/event-details/EventQuotesSection';
import { EventClosingFooter } from '../components/event-details/EventClosingFooter';
import { ArrowLeft, Construction } from 'lucide-react';
import { PlayfulButton } from '../components/ui/PlayfulButton';

export const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  // Fetch event by id or default to 'worst-ui-ux'
  const event = eventId && eventsArchive[eventId] ? eventsArchive[eventId] : eventsArchive['worst-ui-ux'];

  if (!event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center paper-pattern">
        <div className="p-4 bg-[#FFE600] rounded-full border-3 border-[#121316] mb-4">
          <Construction className="w-8 h-8 text-[#121316]" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-[#121316] mb-2">Event Archive Not Found</h2>
        <p className="text-gray-700 font-bold mb-6">The requested event archive could not be located.</p>
        <PlayfulButton to="/events" variant="primary" size="md">
          Back to Events ↗
        </PlayfulButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1 — EVENT HERO */}
      <EventHeroSection event={event} />

      {/* SECTION 2 — EVENT AT A GLANCE */}
      <EventAtAGlance stats={event.stats} />

      {/* SECTION 3 — ABOUT THE EVENT */}
      <AboutEventSection about={event.about} />

      {/* SECTION 4 — THE MISSION */}
      <MissionSection mission={event.mission} />

      {/* SECTION 5 — EVENT HIGHLIGHTS */}
      <EventHighlightsSection highlights={event.highlights} />

      {/* SECTION 6 — EVENT GALLERY (SCRAPBOOK & LIGHTBOX) */}
      <EventGalleryScrapbook gallery={event.gallery} />

      {/* SECTION 7 — WHAT PARTICIPANTS LEARNED */}
      <LearningsSection learnings={event.learnings} />

      {/* SECTION 8 — WINNERS & FEATURED PROJECTS */}
      <WinnersSection winners={event.winners} />

      {/* SECTION 9 — EVENT MOMENTS & QUOTES */}
      <EventQuotesSection quotes={event.quotes} />

      {/* SECTION 10 — EVENT FOOTER */}
      <EventClosingFooter />
    </div>
  );
};
