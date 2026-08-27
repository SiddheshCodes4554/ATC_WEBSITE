import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventService } from '../../services/eventService';
import { StorageService } from '../../services/storage.service';
import { ATCEvent, EventStatus } from '../../types/event.types';
import { 
  Calendar, 
  Plus, 
  Search, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<ATCEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await EventService.getAllEvents({
        order: 'desc',
        limit: 100,
      });

      if (result.success && result.data) {
        setEvents(result.data);
      } else {
        setError(result.error || 'Failed to load events from Appwrite.');
      }
    } catch (err: any) {
      console.error('Error fetching admin events:', err);
      setError('An unexpected network error occurred while connecting to Appwrite.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on active tab and search query
  const filteredEvents = events.filter((evt) => {
    const matchesSearch = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.slug.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'draft') return evt.status === 'draft';
    if (activeTab === 'upcoming') return evt.status === 'upcoming' || evt.status === 'ongoing';
    if (activeTab === 'completed') return evt.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
            ● Upcoming
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#D4EDDA] text-[#2ED573] border border-[#121316] font-mono text-[11px] font-black uppercase animate-pulse">
            ● Live Now
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#FFF3CD] text-[#856404] border border-[#121316] font-mono text-[11px] font-black uppercase">
            ○ Draft
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#E2E3E5] text-[#383D41] border border-[#121316] font-mono text-[11px] font-black uppercase">
            ✓ Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#F8D7DA] text-[#721C24] border border-[#121316] font-mono text-[11px] font-black uppercase">
            ✕ Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-[#6C5CE7]">
                  ADMINISTRATION
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#121316] tracking-tight flex items-center gap-2">
                <Calendar className="w-8 h-8 text-[#6C5CE7]" />
                <span>Events Management</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Refresh events list from Appwrite"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/admin/events/create"
              className="px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'draft', label: 'Drafts' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-2xl font-mono text-xs font-black border-2 border-[#121316] transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#121316] text-white shadow-pop-sm'
                    : 'bg-[#FAF7F0] text-[#121316] hover:bg-[#E1DCFF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title or venue..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-[#6C5CE7] animate-spin" />
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#121316]">Fetching Events from Appwrite</h3>
              <p className="text-xs font-mono font-bold text-gray-500">Querying collection: events...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 rounded-[36px] bg-[#FFE5E5] border-4 border-[#FF4757] shadow-pop-lg text-[#121316] space-y-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-[#FF4757]" />
              <h3 className="text-lg font-black">Unable to Load Events</h3>
            </div>
            <p className="text-sm font-bold text-gray-700">{error}</p>
            <div className="pt-2">
              <button
                onClick={fetchEvents}
                className="px-5 py-2 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black shadow-pop-sm hover:bg-gray-100 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[#121316]" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-2xl font-black text-[#121316] tracking-tight">
                {searchQuery || activeTab !== 'all' ? 'No Matching Events Found' : 'No Events Created Yet'}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                {searchQuery || activeTab !== 'all'
                  ? 'Try clearing your search filters or selecting another tab.'
                  : 'Start by creating your first workshop, hackathon, or tech talk in Appwrite!'}
              </p>
            </div>

            <Link
              to="/admin/events/create"
              className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all"
            >
              + Create First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.$id}
                className="p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col justify-between relative group"
                style={{
                  borderTopColor: evt.accentColor || '#121316',
                  borderTopWidth: '8px',
                }}
              >
                {/* Event Top Meta */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase text-[#121316]">
                      {evt.eventType}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {evt.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE600] border border-[#121316] font-mono text-[9px] font-black uppercase">
                          ★ Featured
                        </span>
                      )}
                      {getStatusBadge(evt.status)}
                    </div>
                  </div>

                  {evt.coverImageId && (
                    <div className="w-full h-32 rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 mb-2">
                      <img
                        src={StorageService.getEventCoverUrl(evt.coverImageId, 400)}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <h3 className="text-xl font-black text-[#121316] tracking-tight leading-tight line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs font-bold text-gray-600 line-clamp-2 leading-relaxed">
                    {evt.shortDescription || evt.description}
                  </p>

                  <div className="pt-3 space-y-1.5 border-t border-[#121316]/10 text-xs font-mono font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#6C5CE7] flex-shrink-0" />
                      <span className="truncate">{formatDate(evt.startDate)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B6B] flex-shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Event Footer Info */}
                <div className="pt-4 mt-4 border-t-2 border-[#121316]/10 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-gray-500 font-bold">
                    slug: <span className="text-[#121316]">{evt.slug}</span>
                  </div>

                  <Link
                    to={`/events/${evt.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm text-[#121316] transition-colors"
                    title="View public page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminEventsPage;
