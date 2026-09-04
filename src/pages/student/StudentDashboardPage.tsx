import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegistrationService } from '../../services/registrationService';
import { StorageService } from '../../services/storage.service';
import { EventRegistration, RegistrationStatus } from '../../types/form.types';
import { ATCEvent } from '../../types/event.types';
import {
  Sparkles,
  Calendar,
  FlaskConical,
  Package,
  User as UserIcon,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Compass,
  Ticket,
  AlertTriangle,
  RotateCw,
  XCircle,
  ExternalLink,
  MapPin
} from 'lucide-react';

interface StudentRegistrationItem {
  registration: EventRegistration;
  event: ATCEvent | null;
}

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<StudentRegistrationItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Derive first name safely from user.name
  const firstName =
    user?.name && user.name.trim()
      ? user.name.trim().split(/\s+/)[0].toUpperCase()
      : 'STUDENT';

  const fullName = user?.name?.trim() || 'Student Builder';
  const email = user?.email || 'No email attached';

  const fetchRegistrations = async () => {
    if (!user?.$id) {
      setEventsLoading(false);
      return;
    }

    setEventsLoading(true);
    setEventsError(null);

    try {
      const result = await RegistrationService.getUserRegistrationsWithEvents(user.$id);
      if (result.success && result.data) {
        setRegistrations(result.data);
      } else {
        setEventsError(result.error || 'Unable to fetch your registrations.');
      }
    } catch (err: any) {
      setEventsError(err?.message || 'Could not load your registered events.');
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user?.$id]);

  const renderStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'checked_in':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E1DCFF] border border-[#121316] font-mono text-[9px] font-black uppercase text-[#6C5CE7]">
            <CheckCircle2 className="w-2.5 h-2.5" />
            CHECKED IN ✓
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE5E5] border border-[#121316] font-mono text-[9px] font-black uppercase text-[#FF4757]">
            <XCircle className="w-2.5 h-2.5" />
            CANCELLED
          </span>
        );
      case 'registered':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2ED573]/20 border border-[#121316] font-mono text-[9px] font-black uppercase text-[#121316]">
            <CheckCircle2 className="w-2.5 h-2.5 text-[#2ED573]" />
            REGISTERED ✓
          </span>
        );
    }
  };

  const formatEventDate = (isoString?: string | null) => {
    if (!isoString) return 'Date TBA';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Dashboard Hero / Welcome Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b-3 border-[#121316] bg-white overflow-hidden">
        {/* Subtle Decorative Background Blurs */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#FFE600]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#6C5CE7]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Left: Greeting & Taglines */}
            <div className="space-y-3 max-w-2xl">
              {/* Authenticated Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-pulse" />
                <span>SIGNED IN</span>
                <span className="text-gray-400">•</span>
                <span className="text-[#6C5CE7]">STUDENT MEMBER</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-none">
                HEY, {firstName}! 👋
              </h1>

              <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                Welcome back to your ATC Space. Everything you need for your tech club journey, workshops, and lab bookings—all in one place.
              </p>
            </div>

            {/* Right: Quick Badge Banner */}
            <div className="flex-shrink-0">
              <div className="p-5 rounded-3xl bg-[#FFE600] border-3 border-[#121316] shadow-pop space-y-2 text-center sm:text-left max-w-xs">
                <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-xs font-black text-[#121316]">
                  <Sparkles className="w-4 h-4 text-[#121316]" />
                  <span>ATC NIAT PUNE</span>
                </div>
                <div className="text-xl font-black text-[#121316] leading-snug">
                  Build • Hack • Innovate
                </div>
                <p className="text-xs font-bold text-gray-800 leading-normal">
                  Stay active in workshops and collaborate on robotics, IoT, and AI projects.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* ============================================================= */}
        {/* 1. QUICK ACTIONS SECTION                                      */}
        {/* ============================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#6C5CE7]" />
              <span>Quick Actions</span>
            </h2>
            <span className="font-mono text-xs font-bold text-gray-500">
              EXPLORE ATC TOOLS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            
            {/* Card 1: My Events */}
            <Link
              to="/student/events"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <Ticket className="w-6 h-6 text-[#121316] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  My Events
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  View your registered hackathons, workshop passes, and attendance.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>My Passes</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Lab Access */}
            <Link
              to="/lab-access"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <FlaskConical className="w-6 h-6 text-[#121316] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  Lab Access
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Reserve workbench slots and request access to Lab 5.0 robotics stations.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>Book Slots</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Inventory */}
            <Link
              to="/inventory"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                  <Package className="w-6 h-6 text-[#6C5CE7] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  Inventory
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Explore microcontrollers, sensor modules, and equipment in stock.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: My Profile */}
            <div className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop flex flex-col justify-between relative group select-none">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mb-4">
                  <UserIcon className="w-6 h-6 text-[#121316] stroke-[2.5]" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-lg text-[#121316]">
                    My Profile
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-mono text-[9px] font-bold">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Manage your student credentials, club badges, and project contributions.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-bold text-gray-400">
                <span>Profile Management</span>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================= */}
        {/* 2. PROFILE SUMMARY & INVENTORY HIGHLIGHT GRID                 */}
        {/* ============================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Profile Summary Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2ED573]" />
                  <span>STUDENT PROFILE</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573]" title="Session Verified" />
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                    Full Name
                  </span>
                  <div className="text-lg font-black text-[#121316] break-words">
                    {fullName}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                    Email Address
                  </span>
                  <div className="text-sm font-mono font-bold text-[#6C5CE7] break-all">
                    {email}
                  </div>
                </div>

                {/* Account Type */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                    Account Classification
                  </span>
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-[#E1DCFF] border border-[#121316] font-mono text-xs font-black text-[#6C5CE7]">
                      STUDENT MEMBER
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Action Note */}
            <div className="pt-4 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-bold text-gray-500">
              <span>Appwrite Session Active</span>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px]">v1.0</span>
            </div>
          </div>

          {/* Right: Lab Inventory Callout Highlight (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FFE600] rounded-3xl border-3 border-[#121316] p-6 sm:p-8 shadow-pop flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm">
                <Package className="w-3.5 h-3.5 text-[#121316]" />
                <span>LAB INVENTORY SPOTLIGHT</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight leading-snug">
                Need Hardware for Your Next Big Project?
              </h3>

              <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed max-w-xl">
                Explore the live inventory catalog of microcontrollers, IoT sensors, cameras, and robotics components available in Lab 5.0.
              </p>
            </div>

            <div className="pt-2 relative z-10">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#121316] text-[#FFE600] hover:bg-[#121316]/90 font-mono text-xs sm:text-sm font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <span>EXPLORE INVENTORY</span>
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>

        </section>

        {/* ============================================================= */}
        {/* 3. DYNAMIC DASHBOARD ACTIVITY SECTIONS                        */}
        {/* ============================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section A: Event Activity (Dynamic) */}
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-[#121316] flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[#6C5CE7]" />
                    <span>MY EVENTS 🎟️</span>
                  </h3>
                  <p className="text-xs font-bold text-gray-600 mt-0.5">
                    Your registrations and upcoming ATC experiences.
                  </p>
                </div>
                {registrations.length > 0 && (
                  <Link
                    to="/student/events"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#6C5CE7] hover:underline flex-shrink-0"
                  >
                    <span>VIEW ALL →</span>
                  </Link>
                )}
              </div>

              {eventsLoading ? (
                /* Skeleton Loader */
                <div className="space-y-3 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-gray-200 flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="w-2/3 h-4 bg-gray-200 rounded" />
                        <div className="w-1/2 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : eventsError ? (
                /* Error State */
                <div className="p-6 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-[#FF4757] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-[#121316]">
                      WE COULDN'T LOAD YOUR EVENT ACTIVITY
                    </h4>
                    <p className="text-xs font-bold text-gray-600">{eventsError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchRegistrations}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>TRY AGAIN</span>
                  </button>
                </div>
              ) : registrations.length > 0 ? (
                /* Top Registrations List (Max 3) */
                <div className="space-y-3">
                  {registrations.slice(0, 3).map(({ registration, event }) => {
                    const eventTitle = event?.title || 'ATC Event';
                    const eventDate = formatEventDate(event?.startDate);
                    const eventVenue = event?.venue || 'ATC Lab 5.0, NIAT Pune';
                    const eventSlug = event?.slug || event?.$id || registration.eventId;
                    const coverUrl = event?.coverImageId
                      ? StorageService.getEventImageUrl(event.coverImageId, 200)
                      : '';

                    return (
                      <div
                        key={registration.$id || registration.passId}
                        className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Event Thumbnail */}
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border-2 border-[#121316] overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={eventTitle}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <Ticket className="w-6 h-6 text-[#6C5CE7]" />
                            )}
                          </div>

                          {/* Event Details */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {renderStatusBadge(registration.status)}
                            </div>
                            <h4 className="font-black text-sm text-[#121316] truncate group-hover:text-[#6C5CE7] transition-colors">
                              {eventTitle}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-gray-600">
                              <span className="flex items-center gap-1 font-mono text-[11px]">
                                <Calendar className="w-3 h-3 text-[#6C5CE7]" />
                                {eventDate}
                              </span>
                              <span className="flex items-center gap-1 truncate text-[11px]">
                                <MapPin className="w-3 h-3 text-[#FF4757]" />
                                <span className="truncate max-w-[130px]">{eventVenue}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Event Button */}
                        <div className="flex items-center justify-end sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#121316]/10">
                          <Link
                            to={`/events/${eventSlug}`}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all"
                          >
                            <span>View Event</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="p-6 rounded-2xl bg-[#FAF7F0] border-2 border-dashed border-[#121316]/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm mx-auto flex items-center justify-center text-xl">
                    🎟️
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-[#121316]">
                      NO EVENTS YET
                    </h4>
                    <p className="text-xs text-gray-600 font-bold max-w-xs mx-auto leading-relaxed">
                      You haven't registered for any ATC events yet.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                    >
                      <span>EXPLORE EVENTS →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {registrations.length > 0 && (
              <div className="pt-3 border-t-2 border-[#121316]/10">
                <Link
                  to="/student/events"
                  className="w-full py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition-all shadow-pop-sm"
                >
                  <span>Go to My Events Archive</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            )}
          </div>

          {/* Section B: Lab Activity */}
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#121316] flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#2ED573]" />
                  <span>Lab Activity</span>
                </h3>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px] font-bold">
                  PREVIEW
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF7F0] border-2 border-dashed border-[#121316]/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm mx-auto flex items-center justify-center">
                  <FlaskConical className="w-6 h-6 text-[#2ED573]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-[#121316]">
                    Lab Bookings Coming Soon
                  </h4>
                  <p className="text-xs text-gray-600 font-bold max-w-xs mx-auto leading-relaxed">
                    Your workstation reservations, component issue requests, and access logs will synchronize here.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/lab-access"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2ED573] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer"
                  >
                    <span>Book a Lab Slot</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-[#121316]/10 text-xs font-mono font-bold text-gray-500 text-center">
              <span>Robotics & IoT Workstation Integration</span>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
};

export default StudentDashboardPage;

