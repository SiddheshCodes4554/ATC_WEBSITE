import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventService } from '../../services/eventService';
import { FormService } from '../../services/formService';
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
  ExternalLink,
  Edit,
  Trash2,
  AlertTriangle,
  Send,
  Archive,
  Ban,
  Users,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<ATCEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Deletion modal state
  const [eventToDelete, setEventToDelete] = useState<ATCEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await EventService.getAllEvents({ limit: 100 });
      if (result.success && result.data && result.data.length > 0) {
        setEvents(result.data);
      } else {
        // If Appwrite events collection is empty, auto-sync official ATC events
        const syncRes = await EventService.syncDefaultEventsToAppwrite();
        if (syncRes.success && syncRes.data && syncRes.data.length > 0) {
          setEvents(syncRes.data);
        } else if (result.data) {
          setEvents(result.data);
        } else {
          setError(result.error || 'Failed to fetch events.');
        }
      }
    } catch (err: any) {
      console.error('Error fetching admin events:', err);
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncOfficialEvents = async () => {
    setIsSyncing(true);
    try {
      const res = await EventService.syncDefaultEventsToAppwrite();
      if (res.success && res.data) {
        setEvents(res.data);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        alert(res.error || 'Failed to sync events to Appwrite.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error syncing events.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleQuickStatusChange = async (eventId: string, newStatus: EventStatus) => {
    setStatusUpdatingId(eventId);
    try {
      const result = await EventService.updateEvent(eventId, { status: newStatus });
      if (result.success && result.data) {
        setEvents((prev) => prev.map((ev) => ev.$id === eventId ? { ...ev, status: newStatus } : ev));
      } else {
        alert(result.error || 'Failed to update status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error updating event status.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);

    try {
      const result = await FormService.deleteCompleteEvent(eventToDelete.$id, eventToDelete.coverImageId);
      if (result.success) {
        setEvents((prev) => prev.filter((ev) => ev.$id !== eventToDelete.$id));
        setEventToDelete(null);
      } else {
        alert(result.error || 'Failed to delete event.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting event.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-[#2ED573] text-[#121316] border border-[#121316]">
            ● Upcoming
          </span>
        );
      case 'ongoing':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-[#FFE600] text-[#121316] border border-[#121316] animate-pulse">
            🔥 Live Now
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-gray-200 text-gray-700 border border-gray-400">
            ○ Draft (Private)
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-[#E1DCFF] text-[#6C5CE7] border border-[#6C5CE7]">
            ✓ Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-[#FFE5E5] text-[#FF4757] border border-[#FF4757]">
            ✕ Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
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

  // Filter events by tab & search query
  const filteredEvents = events.filter((evt) => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'upcoming' ? evt.status === 'upcoming' || evt.status === 'ongoing' :
      activeTab === 'draft' ? evt.status === 'draft' :
      activeTab === 'completed' ? evt.status === 'completed' : true;

    const matchesSearch = 
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.slug?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Breadcrumb */}
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
              <span className="font-mono text-xs font-black uppercase text-[#6C5CE7]">
                APPWRITE DATABASE • CRUD CONTROL
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Manage All Events
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm transition-all text-[#121316] disabled:opacity-50 cursor-pointer"
              title="Refresh events list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleSyncOfficialEvents}
              disabled={isSyncing || loading}
              className="px-4 py-2.5 rounded-full bg-[#E1DCFF] hover:bg-[#6C5CE7] hover:text-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Ensure all 3 official ATC events are populated in Appwrite"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              )}
              <span>Sync ATC Events</span>
            </button>

            <Link
              to="/admin/events/create"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 text-[#121316] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Create Event</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All (${events.length})` },
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
              placeholder="Search by title, venue, slug..."
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
              <p className="text-xs font-mono font-bold text-gray-500">Querying database collection...</p>
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
              className="px-6 py-3 rounded-full bg-[#FFE600] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all"
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

                  {/* Cover Image Thumbnail */}
                  {evt.coverImageId && (
                    <div className="w-full h-32 rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 mb-2">
                      <img
                        src={StorageService.getEventImageUrl(evt.coverImageId, 400)}
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

                {/* Quick Status Control & Action Bar */}
                <div className="pt-4 mt-4 border-t-2 border-[#121316]/10 space-y-3">
                  
                  {/* Status Switcher Selector */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">Status:</span>
                    <select
                      value={evt.status}
                      disabled={statusUpdatingId === evt.$id}
                      onChange={(e) => handleQuickStatusChange(evt.$id, e.target.value as EventStatus)}
                      className="px-2 py-1 rounded-lg bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black text-[#121316] cursor-pointer"
                    >
                      <option value="upcoming">Upcoming (Public)</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="draft">Draft (Private)</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Actions: Registrations, Check-In, Edit, Public View, Delete */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/admin/events/${evt.$id}/registrations`}
                        className="py-2 px-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono text-[11px] font-black text-[#121316] flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <Users className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>Registrations</span>
                      </Link>

                      <Link
                        to={`/admin/events/${evt.$id}/check-in`}
                        className="py-2 px-2.5 rounded-xl bg-[#E8F8F0] hover:bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm font-mono text-[11px] font-black text-[#121316] flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#2ED573]" />
                        <span>Check-In</span>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="font-mono text-[11px] text-gray-500 font-bold truncate max-w-[100px]">
                        /{evt.slug}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/events/${evt.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm text-[#121316] transition-colors"
                          title="View public landing page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/events/edit/${evt.$id}`}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-1 transition-colors"
                          title="Edit event"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          <span>Edit</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setEventToDelete(evt)}
                          className="p-2 rounded-xl bg-[#FFE5E5] hover:bg-[#FF4757] hover:text-white border-2 border-[#FF4757] text-[#FF4757] shadow-pop-sm transition-colors cursor-pointer"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 space-y-5 paper-pattern">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop flex items-center justify-center mx-auto text-[#FF4757]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[#121316]">
                Delete Event Permanently?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Are you sure you want to delete <span className="text-[#FF4757] font-black">"{eventToDelete.title}"</span>? This will permanently remove the event, its registration form questions, and cover image from Appwrite.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setEventToDelete(null)}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F0] font-mono text-xs font-black border-2 border-[#121316] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteEvent}
                className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#FF3838] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Event</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEventsPage;
