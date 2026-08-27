import React, { useState, useEffect } from 'react';
import { EventsHero } from '../components/events/EventsHero';
import { EventCard, WorstUIUXIllustration, GitHubGSoCIllustration, BlockchainIllustration, RoboticsBootcampIllustration, CodeSprintIllustration } from '../components/events/EventCard';
import { EventItem } from '../components/events/EventDetailsModal';
import { UpcomingTeaser } from '../components/events/UpcomingTeaser';
import { EventService } from '../services/eventService';
import { StorageService } from '../services/storage.service';
import { ATCEvent } from '../types/event.types';
import { Sparkles, Calendar, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Events');
  const [dbEvents, setDbEvents] = useState<ATCEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All Events', 'Workshops', 'Hackathons', 'Tech Talks', 'Competitions'];

  // Static showcase items with matching slugs
  const defaultShowcaseEvents: EventItem[] = [
    {
      id: 'worst-ui-ux',
      title: 'Worst UI/UX Hackathon',
      category: 'Hackathons',
      date: 'Dec 13, 2025',
      location: 'NIAT Pune • Lab 5.0',
      status: 'Completed',
      tagline: 'Break every UX rule possible.',
      description: 'A deliberately chaotic 24-hour design jam where builders competed to create the most infuriating, hilarious, and absurdly creative user interfaces.',
      stats: [
        { label: 'Participants', value: '120+' },
        { label: 'Broken UIs', value: '28' },
        { label: 'Prize Pool', value: '₹30,000' },
      ],
      highlights: [
        'Comic Sans supremacy rule enforced',
        'Inverted scroll speed obstacle',
        'Live judge rage-quit score multiplier',
        'Pizza & late-night debugging session',
      ],
      color: 'bg-[#FFF9DB]',
      badgeBg: 'bg-[#FF6B6B]',
      illustration: <WorstUIUXIllustration />,
    },
    {
      id: 'git-github-road-to-gsoc',
      title: 'Git & GitHub: Road to GSoC',
      category: 'Workshops',
      date: 'Feb 07, 2026',
      location: 'NIAT Pune • Tech Audi',
      status: 'Completed',
      tagline: 'Learn. Contribute. Build in public.',
      description: 'A hands-on deep dive from zero Git knowledge to landing your first open-source pull requests and crafting winning Google Summer of Code proposals.',
      stats: [
        { label: 'Attendees', value: '180+' },
        { label: 'PRs Merged', value: '45' },
        { label: 'GSoC Mentors', value: '3' },
      ],
      highlights: [
        'Live interactive merge conflict wars',
        'Open-source licensing breakdown',
        'GSoC proposal review clinic',
        'Official GitHub swag pack giveaways',
      ],
      color: 'bg-[#E1F5FE]',
      badgeBg: 'bg-[#2E86DE]',
      illustration: <GitHubGSoCIllustration />,
    },
    {
      id: 'mst-blockchain-workshop',
      title: 'MST Blockchain Workshop',
      category: 'Workshops',
      date: 'Feb 27, 2026',
      location: 'NIAT Pune • Computer Wing',
      status: 'Completed',
      tagline: 'Exploring decentralized technology.',
      description: 'Demystifying cryptographic primitives, consensus mechanisms, smart contracts in Solidity, and zero-knowledge proofs from the ground up.',
      stats: [
        { label: 'Builders', value: '140+' },
        { label: 'Smart Contracts', value: '60+' },
        { label: 'Testnet TXs', value: '1,200+' },
      ],
      highlights: [
        'Solidity smart contract live coding',
        'Remix IDE & Hardhat deployment',
        'Gas optimization challenge',
        'Web3 developer toolkit setup',
      ],
      color: 'bg-[#E8F5E9]',
      badgeBg: 'bg-[#10AC84]',
      illustration: <BlockchainIllustration />,
    },
    {
      id: 'ros-robotics-bootcamp',
      title: 'ROS 2.0 Autonomous Robotics Bootcamp',
      category: 'Workshops',
      date: 'Apr 18, 2026',
      location: 'NIAT Pune • ATC 5.0 Lab',
      status: 'Completed',
      tagline: 'Where hardware meets autonomous perception.',
      description: 'Building differential drive autonomous rovers with LiDAR mapping, SLAM navigation, and real-time obstacle avoidance in ROS 2 Humble.',
      stats: [
        { label: 'Rovers Built', value: '8' },
        { label: 'Lab Hours', value: '16' },
        { label: 'Hardware Kits', value: '8' },
      ],
      highlights: [
        'LiDAR 2D SLAM mapping live demo',
        'Micro-ROS firmware flashing',
        'Autonomous maze navigation test',
        'Custom PCB sensor integration',
      ],
      color: 'bg-[#F0EBFF]',
      badgeBg: 'bg-[#6C5CE7]',
      illustration: <RoboticsBootcampIllustration />,
    },
    {
      id: 'national-codesprint',
      title: 'National CodeSprint 2026',
      category: 'Competitions',
      date: 'Apr 24, 2026',
      location: 'Online & NIAT Pune Arena',
      status: 'Completed',
      tagline: 'Algorithmic speed, concurrency, and architecture.',
      description: 'Competitive programming and rapid prototype challenge pitting engineering teams across universities against tough algorithmic problem sets.',
      stats: [
        { label: 'Teams', value: '95' },
        { label: 'Submissions', value: '1,420' },
        { label: 'Winners', value: 'Top 3' },
      ],
      highlights: [
        'Live dynamic scoreboard ticker',
        'Automated test runner benchmarks',
        'Speed round bonus multipliers',
        'National tech trophy awarded',
      ],
      color: 'bg-[#FFF3A8]',
      badgeBg: 'bg-[#FF793F]',
      illustration: <CodeSprintIllustration />,
    },
  ];

  // Fetch real Appwrite events
  useEffect(() => {
    const fetchAppwriteEvents = async () => {
      try {
        setLoading(true);
        const result = await EventService.getPublicEvents({ limit: 50 });
        if (result.success && result.data && result.data.length > 0) {
          setDbEvents(result.data);
        }
      } catch (err) {
        console.error('Error fetching public events from Appwrite:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppwriteEvents();
  }, []);

  // Map Appwrite events to EventItem interface
  const mapDbEventToItem = (evt: ATCEvent): EventItem => {
    const categoryMap: Record<string, string> = {
      workshop: 'Workshops',
      hackathon: 'Hackathons',
      tech_talk: 'Tech Talks',
      competition: 'Competitions',
      experience: 'Experiences',
    };

    const statusMap: Record<string, string> = {
      upcoming: 'Upcoming',
      ongoing: 'Live Now',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    const coverUrl = evt.coverImageId ? StorageService.getEventCoverUrl(evt.coverImageId, 600) : '';

    return {
      id: evt.slug, // Use unique slug as routing key
      title: evt.title,
      category: categoryMap[evt.eventType] || evt.eventType || 'Workshops',
      date: new Date(evt.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      location: evt.venue,
      status: statusMap[evt.status] || evt.status,
      tagline: evt.shortDescription,
      description: evt.description,
      stats: [
        { label: 'Status', value: evt.status },
        { label: 'Type', value: evt.eventType },
      ],
      highlights: [
        `Venue: ${evt.venue}`,
        `Registration: ${evt.registrationEnabled ? 'Open' : 'Closed'}`,
      ],
      color: 'bg-white',
      badgeBg: 'bg-[#6C5CE7]',
      coverImageUrl: coverUrl,
      illustration: (
        <div className="w-full h-32 rounded-xl flex items-center justify-center border-2 border-[#121316] shadow-pop-sm" style={{ backgroundColor: evt.accentColor || '#FFE600' }}>
          <Calendar className="w-12 h-12 text-[#121316]" />
        </div>
      ),
    };
  };

  // Combine database events (priority) with default showcase events
  const displayedItems: EventItem[] = dbEvents.length > 0
    ? dbEvents.map(mapDbEventToItem)
    : defaultShowcaseEvents;

  const filteredEvents = selectedCategory === 'All Events'
    ? displayedItems
    : displayedItems.filter((ev) => ev.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <EventsHero />

      {/* FILTER TABS & EVENTS GRID SECTION */}
      <section className="relative bg-[#FAF7F0] py-16 paper-pattern">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Tabs Bar */}
          <div className="flex flex-col items-center mb-14">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 bg-white rounded-full border-3 border-[#121316] shadow-pop max-w-3xl">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 sm:px-6 py-2 rounded-full font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-sm scale-105'
                        : 'text-gray-700 hover:text-[#121316] hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
              <span>Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}</span>
              <span>•</span>
              <span className="text-[#6C5CE7]">Click "View Details ↗" on any event to view its landing page</span>
            </div>
          </div>

          {/* Event Cards Grid */}
          {loading ? (
            <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
              <p className="text-xs font-mono font-bold text-gray-600">Loading events from Appwrite...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* WHAT'S NEXT? UPCOMING EVENTS TEASER */}
      <UpcomingTeaser />

    </div>
  );
};

export default EventsPage;
