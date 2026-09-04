import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegistrationService } from '../../services/registrationService';
import { StorageService } from '../../services/storage.service';
import { EventRegistration, RegistrationStatus } from '../../types/form.types';
import { ATCEvent } from '../../types/event.types';
import {
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Ticket,
  AlertTriangle,
  RotateCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface StudentRegistrationItem {
  registration: EventRegistration;
  event: ATCEvent | null;
}

export const StudentEventsPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<StudentRegistrationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | RegistrationStatus>('ALL');

  const loadRegistrations = useCallback(async (isManualRefresh = false) => {
    if (!user?.$id) {
      setLoading(false);
      return;
    }

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await RegistrationService.getUserRegistrationsWithEvents(user.$id);
      if (result.success && result.data) {
        setItems(result.data);
      } else {
        setError(result.error || 'Failed to load your event registrations.');
      }
    } catch (err: any) {
      setError(err?.message || 'We could not load your event registrations right now.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  // Filtered registrations
  const filteredItems = useMemo(() => {
    if (statusFilter === 'ALL') return items;
    return items.filter((item) => item.registration.status === statusFilter);
  }, [items, statusFilter]);

  // Helper date formatter
  const formatEventDate = (isoString?: string | null) => {
    if (!isoString) return 'Date TBA';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
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

  const formatRegisteredDate = (isoString?: string | null) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Helper status badge renderer
  const renderStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1DCFF] border-2 border-[#121316] font-mono text-[10px] font-black uppercase text-[#6C5CE7] shadow-pop-sm">
            <CheckCircle2 className="w-3 h-3" />
            CHECKED IN
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5E5] border-2 border-[#121316] font-mono text-[10px] font-black uppercase text-[#FF4757] shadow-pop-sm">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
      case 'registered':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2ED573]/20 border-2 border-[#121316] font-mono text-[10px] font-black uppercase text-[#121316] shadow-pop-sm">
            <CheckCircle2 className="w-3 h-3 text-[#2ED573]" />
            REGISTERED
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Header / Hero Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b-3 border-[#121316] bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumb / Back Link */}
          <div className="mb-6">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center gap-2 font-mono text-xs font-black text-[#121316] hover:text-[#6C5CE7] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Dashboard</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
                <Ticket className="w-3.5 h-3.5" />
                <span>STUDENT PASSES & REGISTRATIONS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight leading-tight">
                MY EVENTS 🎟️
              </h1>

              <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                Your registered ATC hackathons, bootcamps, workshops, and participation passes.
              </p>
            </div>

            {/* Quick Actions / Refresh */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadRegistrations(true)}
                disabled={isRefreshing}
                className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
                title="Refresh your registrations"
              >
                <RotateCw className={`w-4 h-4 stroke-[2.5] ${isRefreshing ? 'animate-spin text-[#6C5CE7]' : ''}`} />
                <span>Refresh</span>
              </button>

              <Link
                to="/events"
                className="px-5 py-2.5 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5"
              >
                <span>Browse Events</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Filter Bar */}
        {!loading && !error && items.length > 0 && (
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-4 sm:p-5 shadow-pop flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-gray-700">
              <Ticket className="w-4 h-4 text-[#6C5CE7]" />
              <span>Status Filter:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(['ALL', 'registered', 'checked_in', 'cancelled'] as const).map((status) => {
                const isSelected = statusFilter === status;
                const label = status === 'ALL' ? 'All Registrations' : status.replace('_', ' ');

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all border-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#121316] text-[#FFE600] border-[#121316] shadow-pop-sm scale-105'
                        : 'bg-[#FAF7F0] hover:bg-white text-gray-700 border-[#121316]/20 hover:border-[#121316]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content States */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border-3 border-[#121316] p-6 shadow-pop animate-pulse space-y-4"
              >
                <div className="w-full h-40 rounded-2xl bg-gray-200" />
                <div className="w-3/4 h-6 rounded-lg bg-gray-200" />
                <div className="space-y-2">
                  <div className="w-1/2 h-4 rounded-md bg-gray-200" />
                  <div className="w-2/3 h-4 rounded-md bg-gray-200" />
                </div>
                <div className="pt-3 border-t-2 border-gray-100 flex items-center justify-between">
                  <div className="w-24 h-6 rounded-full bg-gray-200" />
                  <div className="w-20 h-8 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-3xl border-3 border-[#FF4757] p-8 sm:p-12 shadow-pop-xl text-center max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] mx-auto flex items-center justify-center shadow-pop-sm">
              <AlertTriangle className="w-8 h-8 text-[#FF4757]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#121316]">
                UNABLE TO LOAD REGISTRATIONS
              </h2>
              <p className="text-sm font-bold text-gray-600 max-w-md mx-auto">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadRegistrations(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4 stroke-[2.5]" />
              <span>Try Again</span>
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          /* Registrations Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(({ registration, event }) => {
              const coverUrl = event?.coverImageId
                ? StorageService.getEventImageUrl(event.coverImageId, 600)
                : '';

              const eventTitle = event?.title || 'ATC Event';
              const eventSlug = event?.slug || event?.$id || registration.eventId;
              const eventVenue = event?.venue || 'ATC Lab 5.0, NIAT Pune';
              const startDate = event?.startDate;

              return (
                <div
                  key={registration.$id || registration.passId}
                  className="bg-white rounded-3xl border-3 border-[#121316] shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none"
                >
                  <div>
                    {/* Event Cover Image / Top Banner */}
                    <div className="relative w-full h-44 bg-[#FAF7F0] border-b-3 border-[#121316] overflow-hidden">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={eventTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFE600]/30 via-[#6C5CE7]/20 to-[#2ED573]/20">
                          <Ticket className="w-12 h-12 text-[#121316]/40" />
                        </div>
                      )}

                      {/* Pass ID Pill on top image */}
                      {registration.passId && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#121316] text-[#FFE600] font-mono text-[10px] font-black border border-[#121316] shadow-pop-sm">
                          PASS #{registration.passId}
                        </div>
                      )}

                      {/* Status badge on top right */}
                      <div className="absolute top-3 right-3">
                        {renderStatusBadge(registration.status)}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Event Title */}
                      <h3 className="font-black text-xl text-[#121316] tracking-tight group-hover:text-[#6C5CE7] transition-colors line-clamp-2">
                        {eventTitle}
                      </h3>

                      {/* Details Meta */}
                      <div className="space-y-2 text-xs font-bold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#6C5CE7] flex-shrink-0" />
                          <span>{formatEventDate(startDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#FF4757] flex-shrink-0" />
                          <span className="truncate">{eventVenue}</span>
                        </div>

                        {registration.registeredAt && (
                          <div className="flex items-center gap-2 text-gray-500 font-mono text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>Registered on {formatRegisteredDate(registration.registeredAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-5 sm:p-6 pt-0 border-t-2 border-[#121316]/10 mt-2">
                    <div className="pt-3 flex items-center justify-between gap-2">
                      {/* Digital Pass Link if passId exists */}
                      {registration.passId ? (
                        <Link
                          to={`/pass/${registration.passId}`}
                          className="font-mono text-xs font-black text-[#6C5CE7] hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Pass</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="font-mono text-[11px] text-gray-400 font-bold">
                          Official Registration
                        </span>
                      )}

                      {/* View Event Page Link */}
                      <Link
                        to={`/events/${eventSlug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFE600] group-hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm group-hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all"
                      >
                        <span>View Event</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-10 sm:p-14 shadow-pop-lg text-center max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#FFE600] border-3 border-[#121316] mx-auto flex items-center justify-center shadow-pop-sm">
              <Ticket className="w-8 h-8 text-[#121316]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#121316]">
                NO EVENTS YET
              </h3>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                {statusFilter === 'ALL'
                  ? "You haven't registered for any ATC events or workshops yet. Join upcoming hackathons and lab sessions to get your passes!"
                  : `No registrations found with status "${statusFilter.replace('_', ' ')}".`}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {statusFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-100 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm cursor-pointer"
                >
                  Clear Status Filter
                </button>
              )}

              <Link
                to="/events"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all text-center"
              >
                Explore Upcoming Events
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentEventsPage;
