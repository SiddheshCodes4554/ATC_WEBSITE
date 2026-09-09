import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegistrationService } from '../../services/registrationService';
import { StorageService } from '../../services/storage.service';
import { LabRequestService } from '../../services/labRequestService';
import { EventRegistration, RegistrationStatus } from '../../types/form.types';
import { ATCEvent } from '../../types/event.types';
import {
  StudentLabRequestWithSlot,
  LabRequestStatus,
} from '../../types/labBooking.types';
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
  MapPin,
  ListOrdered,
  Hourglass,
  Lightbulb,
} from 'lucide-react';
import { projectIdeaService } from '../../services/projectIdeaService';
import { ProjectIdea } from '../../types/projectIdea.types';
import { componentRequestService } from '../../services/componentRequestService';
import { ComponentRequest } from '../../types/componentRequest.types';
import { MembershipApplicationService } from '../../services/membershipApplicationService';
import { MembershipApplication } from '../../types/membershipApplication.types';
import {
  IconModule,
  ATCStatusBadge,
  ATCEmptyState,
  ScrewHead,
} from '../../components/visual';

interface StudentRegistrationItem {
  registration: EventRegistration;
  event: ATCEvent | null;
}

export const StudentDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  
  // Event Registrations State
  const [registrations, setRegistrations] = useState<StudentRegistrationItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Lab Bookings State
  const [labRequests, setLabRequests] = useState<StudentLabRequestWithSlot[]>([]);
  const [labLoading, setLabLoading] = useState<boolean>(true);
  const [labError, setLabError] = useState<string | null>(null);

  // Project Ideas State
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState<boolean>(true);

  // Component Requests State
  const [componentRequests, setComponentRequests] = useState<ComponentRequest[]>([]);
  const [componentRequestsLoading, setComponentRequestsLoading] = useState<boolean>(true);

  // Membership Application State
  const [membershipApplication, setMembershipApplication] = useState<MembershipApplication | null>(null);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(true);

  // Derive first name safely from user.name
  const firstName =
    user?.name && user.name.trim()
      ? user.name.trim().split(/\s+/)[0].toUpperCase()
      : 'STUDENT';

  const fullName = user?.name?.trim() || 'Student Builder';
  const email = user?.email || 'No email attached';

  const fetchMembership = async () => {
    if (!user?.email) {
      setMembershipLoading(false);
      return;
    }

    setMembershipLoading(true);
    try {
      const res = await MembershipApplicationService.getApplicationByEmail(user.email);
      if (res.success && res.data) {
        setMembershipApplication(res.data);
      } else {
        setMembershipApplication(null);
      }
    } catch (err) {
      console.error('Error fetching membership application:', err);
    } finally {
      setMembershipLoading(false);
    }
  };

  const fetchComponentRequests = async () => {
    if (!user?.$id) {
      setComponentRequestsLoading(false);
      return;
    }

    setComponentRequestsLoading(true);
    try {
      const res = await componentRequestService.getStudentRequests(user.$id);
      if (res.success && res.data) {
        setComponentRequests(res.data);
      }
    } catch (err) {
      console.error('Error fetching student component requests:', err);
    } finally {
      setComponentRequestsLoading(false);
    }
  };

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

  const fetchLabRequests = async () => {
    if (!user?.$id) {
      setLabLoading(false);
      return;
    }

    setLabLoading(true);
    setLabError(null);

    try {
      const result = await LabRequestService.getUserRequestsWithSlots(user.$id);
      if (result.success && result.data) {
        setLabRequests(result.data);
      } else {
        setLabError(result.error || 'Unable to fetch your lab bookings.');
      }
    } catch (err: any) {
      setLabError(err?.message || 'Could not load your lab bookings.');
    } finally {
      setLabLoading(false);
    }
  };

  const fetchIdeas = async () => {
    if (!user?.$id) {
      setIdeasLoading(false);
      return;
    }

    setIdeasLoading(true);
    try {
      const res = await projectIdeaService.getIdeasByUserId(user.$id);
      if (res.success && res.data) {
        setIdeas(res.data);
      }
    } catch (err) {
      console.error('Error fetching student project ideas:', err);
    } finally {
      setIdeasLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchLabRequests();
    fetchIdeas();
    fetchComponentRequests();
    fetchMembership();
  }, [user?.$id, user?.email]);

  // Note: All status badges are standardized via ATCStatusBadge

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

  const formatLabDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Date TBA';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
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
        
        {/* Ready for Collection Banner if approved components exist */}
        {componentRequests.some((r) => r.status === 'approved') && (
          <div className="p-5 sm:p-6 rounded-[28px] bg-[#D4F8E8] border-3 border-[#121316] shadow-pop flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-xs flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-700 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-[#121316]">
                  {componentRequests.filter((r) => r.status === 'approved').length}{' '}
                  {componentRequests.filter((r) => r.status === 'approved').length === 1
                    ? 'HARDWARE COMPONENT IS'
                    : 'HARDWARE COMPONENTS ARE'}{' '}
                  APPROVED & READY FOR PICKUP!
                </h3>
                <p className="text-xs font-bold text-gray-700 mt-0.5">
                  Visit Lab 5.0 with your student ID to collect your allocated parts.
                </p>
              </div>
            </div>
            <Link
              to="/student/component-requests"
              className="px-5 py-2.5 rounded-full bg-[#121316] text-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs hover:shadow-pop flex-shrink-0 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>View Component Passes</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </div>
        )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
            
            {/* Card 1: My Events */}
            <Link
              to="/student/events"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <ScrewHead rotation={25} />
              </div>
              <div>
                <div className="mb-4">
                  <IconModule
                    icon={<Ticket className="w-6 h-6 stroke-[2.5]" />}
                    size="lg"
                    variant="yellow"
                    hoverEffect="rotate"
                  />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  My Events
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  View registered hackathons, workshop passes & QR tickets.
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
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <ScrewHead rotation={65} />
              </div>
              <div>
                <div className="mb-4">
                  <IconModule
                    icon={<FlaskConical className="w-6 h-6 stroke-[2.5]" />}
                    size="lg"
                    variant="green"
                    hoverEffect="bounce"
                  />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  Lab Access
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Reserve workbench slots & prototyping stations in Lab 5.0.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>Book Slots</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Component Requests */}
            <Link
              to="/student/component-requests"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <ScrewHead rotation={90} />
              </div>
              <div>
                <div className="mb-4">
                  <IconModule
                    icon={<Package className="w-6 h-6 stroke-[2.5]" />}
                    size="lg"
                    variant="purple"
                    hoverEffect="bounce"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                    Hardware Requests
                  </h3>
                  {componentRequests.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[10px] font-black">
                      {componentRequests.length}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Track microcontrollers, sensor requisitions & collection status.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>My Requests</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Inventory */}
            <Link
              to="/inventory"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <ScrewHead rotation={110} />
              </div>
              <div>
                <div className="mb-4">
                  <IconModule
                    icon={<Package className="w-6 h-6 stroke-[2.5]" />}
                    size="lg"
                    variant="yellow"
                    hoverEffect="rotate"
                  />
                </div>
                <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                  Inventory
                </h3>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Explore microcontrollers, sensor modules & parts in stock.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: My Project Ideas */}
            <Link
              to="/student/ideas"
              className="bg-white rounded-3xl border-3 border-[#121316] p-5 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <ScrewHead rotation={145} />
              </div>
              <div>
                <div className="mb-4">
                  <IconModule
                    icon={<Lightbulb className="w-6 h-6 stroke-[2.5]" />}
                    size="lg"
                    variant="coral"
                    hoverEffect="rotate"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-lg text-[#121316] group-hover:text-[#6C5CE7] transition-colors">
                    Project Ideas
                  </h3>
                  {ideas.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFEBF2] text-[#FF4757] border border-[#121316] font-mono text-[10px] font-black">
                      {ideas.length}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">
                  Pitch hardware & software ideas, track review feedback & mentor notes.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-xs font-mono font-black text-[#121316]">
                <span>Manage Ideas</span>
                <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

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

                {/* NIAT ID & Academic Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316]">
                    <span className="font-mono text-[9px] font-black uppercase text-gray-500">
                      NIAT ID
                    </span>
                    <div className="text-xs sm:text-sm font-mono font-black text-[#121316] truncate">
                      {profile?.niatId || (user?.prefs as any)?.niatId || (user?.prefs as any)?.studentId || '—'}
                    </div>
                  </div>

                  <div className="space-y-1 p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316]">
                    <span className="font-mono text-[9px] font-black uppercase text-gray-500">
                      Year & Section
                    </span>
                    <div className="text-xs sm:text-sm font-mono font-black text-[#6C5CE7] truncate">
                      {profile?.year || (user?.prefs as any)?.year || '1st Year'} • {profile?.section || (user?.prefs as any)?.section || 'S01'}
                    </div>
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

                {/* Phone (if available) */}
                {(profile?.phone || (user?.prefs as any)?.phone) && (
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                      Contact Phone
                    </span>
                    <div className="text-xs font-mono font-bold text-gray-800">
                      {profile?.phone || (user?.prefs as any)?.phone}
                    </div>
                  </div>
                )}

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

                {/* ATC Membership Application Status */}
                <div className="space-y-2 pt-3 border-t-2 border-[#121316]/10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase text-gray-400">
                      ATC Membership
                    </span>
                  </div>

                  {membershipLoading ? (
                    <div className="h-7 w-36 bg-gray-200 rounded-full animate-pulse" />
                  ) : membershipApplication ? (
                    <div className="space-y-1.5">
                      <div>
                        <ATCStatusBadge status={membershipApplication.status} size="md" />
                        <p className="text-xs font-bold text-gray-700 mt-1">
                          {membershipApplication.status === 'pending' && 'Your application is waiting for review.'}
                          {membershipApplication.status === 'under_review' && 'The ATC team is reviewing your application.'}
                          {membershipApplication.status === 'approved' && 'Welcome to the ATC community!'}
                          {membershipApplication.status === 'rejected' && 'Application review completed.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 flex items-center justify-between gap-3">
                      <div className="text-xs font-black text-[#121316] uppercase">
                        READY TO JOIN ATC?
                      </div>
                      <Link
                        to="/join"
                        className="px-3.5 py-1.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] border-2 border-[#121316] font-mono text-[11px] font-black uppercase shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1"
                      >
                        <span>APPLY NOW</span>
                        <ArrowRight className="w-3 h-3 stroke-[3]" />
                      </Link>
                    </div>
                  )}
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
                    <span>MY EVENTS</span>
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
                              <IconModule
                                icon={<Ticket className="w-6 h-6 stroke-[2.5]" />}
                                size="md"
                                variant="purple"
                              />
                            )}
                          </div>

                          {/* Event Details */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <ATCStatusBadge status={registration.status} size="sm" />
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
                <ATCEmptyState
                  type="calendar"
                  title="NO EVENTS YET"
                  description="You haven't registered for any ATC events yet. Explore upcoming hackathons and workshops."
                  actionLabel="EXPLORE EVENTS"
                  actionHref="/events"
                />
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

          {/* Section B: Lab Activity (Dynamic) */}
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-[#121316] flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-[#2ED573]" />
                    <span>MY LAB ACTIVITY</span>
                  </h3>
                  <p className="text-xs font-bold text-gray-600 mt-0.5">
                    Your lab access requests and upcoming sessions.
                  </p>
                </div>
                {labRequests.length > 0 && (
                  <Link
                    to="/student/lab-bookings"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#2ED573] hover:text-[#26af5f] hover:underline flex-shrink-0"
                  >
                    <span>VIEW ALL →</span>
                  </Link>
                )}
              </div>

              {labLoading ? (
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
              ) : labError ? (
                /* Error State */
                <div className="p-6 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-[#FF4757] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-[#121316]">
                      WE COULDN'T LOAD YOUR LAB ACTIVITY
                    </h4>
                    <p className="text-xs font-bold text-gray-600">{labError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchLabRequests}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>TRY AGAIN</span>
                  </button>
                </div>
              ) : labRequests.length > 0 ? (
                /* Top Lab Requests List (Max 3) */
                <div className="space-y-3">
                  {labRequests.slice(0, 3).map(({ request, slot }) => {
                    const labDate = formatLabDate(slot?.date || request.requestedAt);
                    const timeBlock = slot ? `${slot.startTime} — ${slot.endTime}` : 'Scheduled Time';
                    const isApproved = request.status === 'approved';

                    return (
                      <div
                        key={request.$id}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                          isApproved ? 'bg-[#E8F5E9]/60' : 'bg-[#FAF7F0]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Slot Icon Thumbnail */}
                          <div className="flex-shrink-0">
                            <IconModule
                              icon={<FlaskConical className="w-5 h-5 stroke-[2.5]" />}
                              size="md"
                              variant={isApproved ? "green" : "white"}
                            />
                          </div>

                          {/* Request Details */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <ATCStatusBadge status={request.status} queuePosition={request.queuePosition} size="sm" />
                            </div>
                            <h4 className="font-black text-sm text-[#121316] truncate group-hover:text-[#6C5CE7] transition-colors">
                              {request.purpose || 'Lab Access Session'}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-gray-600">
                              <span className="flex items-center gap-1 font-mono text-[11px]">
                                <Calendar className="w-3 h-3 text-[#6C5CE7]" />
                                {labDate}
                              </span>
                              <span className="flex items-center gap-1 font-mono text-[11px] text-gray-700">
                                <Clock className="w-3 h-3 text-[#FF793F]" />
                                <span>{timeBlock}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="flex items-center justify-end sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#121316]/10">
                          <Link
                            to="/student/lab-bookings"
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#2ED573] hover:bg-[#26af5f] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <ATCEmptyState
                  type="workbench"
                  title="NO LAB BOOKINGS YET"
                  description="Need space to build something? Reserve workbench slots in Lab 5.0 to prototype your ideas."
                  actionLabel="REQUEST LAB ACCESS"
                  actionHref="/lab-access"
                />
              )}
            </div>

            {labRequests.length > 0 && (
              <div className="pt-3 border-t-2 border-[#121316]/10">
                <Link
                  to="/student/lab-bookings"
                  className="w-full py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#2ED573] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition-all shadow-pop-sm"
                >
                  <span>Go to My Lab Bookings Archive</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            )}
          </div>

          {/* Section C: Hardware Component Requests (Dynamic) */}
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-7 shadow-pop flex flex-col justify-between space-y-6 md:col-span-2">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-[#121316] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#6C5CE7]" />
                    <span>MY HARDWARE REQUISITIONS</span>
                  </h3>
                  <p className="text-xs font-bold text-gray-600 mt-0.5">
                    Your requested sensors, microcontrollers & equipment from Lab 5.0.
                  </p>
                </div>
                {componentRequests.length > 0 && (
                  <Link
                    to="/student/component-requests"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#6C5CE7] hover:underline flex-shrink-0"
                  >
                    <span>VIEW ALL →</span>
                  </Link>
                )}
              </div>

              {componentRequestsLoading ? (
                /* Skeleton Loader */
                <div className="space-y-3 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-gray-200 flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="w-2/3 h-4 bg-gray-200 rounded" />
                        <div className="w-1/2 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : componentRequests.length > 0 ? (
                /* Top Component Requests List (Max 3) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {componentRequests.slice(0, 3).map((req) => {
                    const isApproved = req.status === 'approved';
                    const isCollected = req.status === 'collected';
                    const isRejected = req.status === 'rejected';

                    return (
                      <div
                        key={req.$id}
                        className={`p-4 rounded-2xl border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all flex flex-col justify-between gap-3 group ${
                          isApproved
                            ? 'bg-[#E8F5E9]/60'
                            : isCollected
                            ? 'bg-[#F0EBFF]/40'
                            : isRejected
                            ? 'bg-[#FFE5E5]/40'
                            : 'bg-[#FAF7F0]'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <ATCStatusBadge status={req.status} size="xs" />
                            <span className="font-mono text-[10px] font-bold text-gray-500">
                              #{req.$id.slice(-6)}
                            </span>
                          </div>

                          <h4 className="font-black text-sm text-[#121316] truncate group-hover:text-[#6C5CE7] transition-colors">
                            {req.componentName}
                          </h4>

                          <p className="text-xs font-bold text-gray-600 line-clamp-2 leading-relaxed">
                            {req.reason}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#121316]/10 flex items-center justify-between text-xs">
                          <span className="font-mono font-black text-[#121316]">
                            Qty: {req.requestedQuantity}
                          </span>
                          <Link
                            to={`/student/component-requests/${req.$id}`}
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-black text-[#6C5CE7] hover:underline"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3 stroke-[3]" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="p-6 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] mx-auto flex items-center justify-center shadow-pop-xs">
                    <Package className="w-6 h-6 text-[#6C5CE7]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-[#121316]">
                      NO HARDWARE REQUESTS YET
                    </h4>
                    <p className="text-xs font-bold text-gray-600 max-w-sm mx-auto">
                      Need sensors, microcontrollers, or robotics parts for a project?
                    </p>
                  </div>
                  <Link
                    to="/inventory"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs transition-all"
                  >
                    <span>Browse Lab Inventory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {componentRequests.length > 0 && (
              <div className="pt-3 border-t-2 border-[#121316]/10">
                <Link
                  to="/student/component-requests"
                  className="w-full py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase flex items-center justify-center gap-2 transition-all shadow-pop-sm"
                >
                  <span>Go to My Hardware Requests</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Link>
              </div>
            )}
          </div>

        </section>

      </main>
    </div>
  );
};

export default StudentDashboardPage;

