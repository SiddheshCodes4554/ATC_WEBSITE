import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventService } from '../../services/eventService';
import { EventGalleryService } from '../../services/eventGalleryService';
import { ATCEvent } from '../../types/event.types';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { AdminEventGalleryManager } from '../../components/admin/AdminEventGalleryManager';
import {
  Image as ImageIcon,
  ArrowLeft,
  Calendar,
  Sparkles,
  ExternalLink,
  Plus,
  Loader2,
  AlertCircle,
  FolderPlus,
  CheckCircle2,
  Filter,
  Eye,
} from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const [events, setEvents] = useState<ATCEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [allImages, setAllImages] = useState<EventGalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load events and global gallery count on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch events
        const eventsRes = await EventService.getAllEvents();
        if (!isMounted) return;

        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data);
          if (eventsRes.data.length > 0 && !selectedEventId) {
            setSelectedEventId(eventsRes.data[0].$id);
          }
        }

        // 2. Fetch all gallery images count
        const galleryRes = await EventGalleryService.getAllGalleryImages(100);
        if (isMounted && galleryRes.success && galleryRes.data) {
          setAllImages(galleryRes.data);
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Failed to load gallery data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedEvent = events.find((e) => e.$id === selectedEventId);
  const featuredCount = allImages.filter((img) => img.isFeatured).length;

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
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
                GALLERY MANAGEMENT
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Event Photo & Memory Wall Manager
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/gallery"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
            >
              <span>View Public Gallery</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/admin/events/create"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-xs font-bold text-gray-500 uppercase">Total Event Photos</span>
            <div className="text-3xl font-black text-[#121316]">{allImages.length}</div>
            <p className="text-[11px] font-mono font-bold text-gray-600">Stored in Appwrite event_gallery</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-xs font-bold text-gray-500 uppercase">Featured Highlights</span>
            <div className="text-3xl font-black text-[#121316]">{featuredCount}</div>
            <p className="text-[11px] font-mono font-bold text-gray-600">Pinned across event pages</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F0EBFF] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-xs font-bold text-gray-500 uppercase">Events Catalog</span>
            <div className="text-3xl font-black text-[#6C5CE7]">{events.length}</div>
            <p className="text-[11px] font-mono font-bold text-gray-600">Live & archived club events</p>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#FF4757] text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Area */}
        {loading ? (
          <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
            <p className="font-mono text-xs font-black text-[#121316]">
              Loading Appwrite event gallery records...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center mx-auto text-[#121316]">
              <Calendar className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-xl font-black text-[#121316]">No Events Created Yet</h3>
              <p className="text-xs font-bold text-gray-600">
                Gallery photos are organized by events. Create your first event to start uploading stage photos and memories.
              </p>
            </div>
            <Link
              to="/admin/events/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:bg-[#FFD32A]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create First Event</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Event Selector Bar */}
            <div className="p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center flex-shrink-0">
                  <Filter className="w-5 h-5 text-[#121316]" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-[#121316]">
                    Select Event to Manage Photos
                  </label>
                  <span className="text-[11px] font-bold text-gray-500">
                    Switch events to view, upload, caption, and reorder photo memories
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-3 border-[#121316] font-mono text-xs font-black text-[#121316] focus:outline-none focus:bg-white shadow-pop-sm cursor-pointer"
                >
                  {events.map((evt) => (
                    <option key={evt.$id} value={evt.$id}>
                      {evt.title} ({evt.eventType || 'event'})
                    </option>
                  ))}
                </select>

                {selectedEvent && (
                  <Link
                    to={`/admin/events/edit/${selectedEvent.$id}`}
                    className="p-2.5 rounded-2xl bg-white hover:bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm text-[#121316] transition-all"
                    title="Edit Full Event"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Dedicated Event Gallery Manager Card */}
            {selectedEventId && (
              <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6">
                <div className="flex items-center justify-between pb-4 border-b-2 border-[#121316]/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-[#FFE600] border border-[#121316] font-mono text-[10px] font-black uppercase text-[#121316]">
                        {selectedEvent?.eventType || 'EVENT'}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
                        {selectedEvent?.title}
                      </h2>
                    </div>
                    <p className="text-xs font-mono font-bold text-gray-500 mt-1">
                      Event ID: <span className="text-[#6C5CE7]">{selectedEventId}</span>
                    </p>
                  </div>
                </div>

                <AdminEventGalleryManager
                  eventId={selectedEventId}
                  onGalleryChange={(updated) => {
                    // Update allImages snapshot
                    const otherImages = allImages.filter((img) => img.eventId !== selectedEventId);
                    setAllImages([...otherImages, ...updated]);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryPage;
