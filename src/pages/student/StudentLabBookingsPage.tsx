import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LabRequestService } from '../../services/labRequestService';
import {
  StudentLabRequestWithSlot,
  LabRequestStatus,
} from '../../types/labBooking.types';
import { getSlotTimeRemaining } from '../../utils/labTimeUtils';
import {
  Calendar,
  Clock,
  FlaskConical,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Hourglass,
  ListOrdered,
  Plus,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const StudentLabBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<StudentLabRequestWithSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | LabRequestStatus>('ALL');

  const loadBookings = useCallback(async (isManualRefresh = false) => {
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
      const result = await LabRequestService.getUserRequestsWithSlots(user.$id);
      if (result.success && result.data) {
        setItems(result.data);
      } else {
        setError(result.error || 'Failed to load your lab requests.');
      }
    } catch (err: any) {
      setError(err?.message || 'We could not load your lab requests right now.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Filtered requests
  const filteredItems = useMemo(() => {
    if (statusFilter === 'ALL') return items;
    return items.filter((item) => item.request.status === statusFilter);
  }, [items, statusFilter]);

  // Waitlisted requests highlight
  const waitlistedItems = useMemo(() => {
    return items.filter((item) => item.request.status === 'waitlisted');
  }, [items]);

  // Format Date Helper
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

  const formatRequestedDate = (isoString?: string | null) => {
    if (!isoString) return '';
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
      return '';
    }
  };

  // Status Badge Renderer
  const renderStatusBadge = (status: LabRequestStatus, queuePosition?: number | null) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2ED573] text-[#121316] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ✓ APPROVED
          </span>
        );
      case 'waitlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] text-[#E65100] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
            <ListOrdered className="w-3.5 h-3.5" />
            WAITLISTED {queuePosition ? `(#${queuePosition})` : ''}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5E5] text-[#D63031] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
            <XCircle className="w-3.5 h-3.5" />
            REJECTED
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-200 text-gray-700 border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
            <XCircle className="w-3.5 h-3.5" />
            CANCELLED
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EBFF] text-[#6C5CE7] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm">
            <Hourglass className="w-3.5 h-3.5" />
            PENDING REVIEW
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>STUDENT LAB SESSIONS & ACCESS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight leading-tight">
                MY LAB BOOKINGS 🧪
              </h1>

              <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed">
                Track your ATC Lab Access requests, workbench reservations, and queue positions.
              </p>
            </div>

            {/* Quick Actions / Refresh */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadBookings(true)}
                disabled={isRefreshing}
                className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
                title="Refresh your lab bookings"
              >
                <RotateCw className={`w-4 h-4 stroke-[2.5] ${isRefreshing ? 'animate-spin text-[#6C5CE7]' : ''}`} />
                <span>Refresh</span>
              </button>

              <Link
                to="/lab-access"
                className="px-5 py-2.5 rounded-2xl bg-[#2ED573] hover:bg-[#26af5f] border-2 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Book New Slot</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Waitlist Spotlight Card (If user has waitlisted requests) */}
        {!loading && waitlistedItems.length > 0 && (
          <div className="p-6 sm:p-7 rounded-[32px] bg-[#FFF3E0] border-3 border-[#FF793F] shadow-pop flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#FF793F] shadow-pop-sm flex items-center justify-center flex-shrink-0 text-[#E65100]">
                <ListOrdered className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase text-[#E65100]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ACTIVE WAITLIST QUEUE</span>
                </div>
                <h3 className="text-xl font-black text-[#121316]">
                  You have {waitlistedItems.length} request(s) on the waitlist queue
                </h3>
                <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed max-w-xl">
                  If an approved maker cancels their booking, our automated queue engine will immediately promote the next maker in line!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {waitlistedItems.map((item) => (
                <div
                  key={item.request.$id}
                  className="px-4 py-2.5 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316]"
                >
                  <span className="text-[#E65100]">YOUR POSITION: </span>
                  <span className="text-base font-black">#{item.request.queuePosition ?? 1}</span>
                  <span className="text-gray-400 ml-1">({item.slot?.date || 'Slot'})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        {!loading && !error && items.length > 0 && (
          <div className="bg-white rounded-3xl border-3 border-[#121316] p-4 sm:p-5 shadow-pop flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-gray-700">
              <FlaskConical className="w-4 h-4 text-[#2ED573]" />
              <span>Status Filter:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(['ALL', 'approved', 'pending', 'waitlisted', 'rejected', 'cancelled'] as const).map((status) => {
                const isSelected = statusFilter === status;
                const label = status === 'ALL' ? 'ALL' : status.toUpperCase();

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all border-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#121316] text-[#2ED573] border-[#121316] shadow-pop-sm scale-105'
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
                <div className="w-2/3 h-6 rounded-lg bg-gray-200" />
                <div className="space-y-2">
                  <div className="w-1/2 h-4 rounded-md bg-gray-200" />
                  <div className="w-3/4 h-4 rounded-md bg-gray-200" />
                </div>
                <div className="pt-3 border-t-2 border-gray-100 flex items-center justify-between">
                  <div className="w-24 h-6 rounded-full bg-gray-200" />
                  <div className="w-20 h-6 rounded-full bg-gray-200" />
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
                WE COULDN'T LOAD YOUR LAB ACTIVITY
              </h2>
              <p className="text-sm font-bold text-gray-600 max-w-md mx-auto">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadBookings(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4 stroke-[2.5]" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          /* Lab Bookings Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(({ request, slot }) => {
              const labDate = formatLabDate(slot?.date || request.requestedAt);
              const timeBlock = slot ? `${slot.startTime} — ${slot.endTime}` : 'Time TBA';
              const isApproved = request.status === 'approved';
              const isWaitlisted = request.status === 'waitlisted';
              const timeRemaining = slot ? getSlotTimeRemaining(slot.date, slot.endTime) : null;

              return (
                <div
                  key={request.$id}
                  className={`rounded-3xl border-3 border-[#121316] shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group select-none ${
                    isApproved ? 'bg-[#E8F5E9]/50' : isWaitlisted ? 'bg-[#FFF3E0]/40' : 'bg-white'
                  }`}
                >
                  {/* Top Color Banner Strip */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-xs">
                        <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>{timeBlock}</span>
                      </div>

                      {renderStatusBadge(request.status, request.queuePosition)}
                    </div>

                    {/* Date & Title */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>{labDate}</span>
                        {timeRemaining && !timeRemaining.isExpired && isApproved && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            {timeRemaining.label}
                          </span>
                        )}
                      </div>

                      <h3 className="font-black text-lg sm:text-xl text-[#121316] tracking-tight leading-snug">
                        {request.purpose || 'Laboratory Workbench Session'}
                      </h3>
                    </div>

                    {/* Slot Station Notes if available */}
                    {slot?.notes && (
                      <div className="p-3 rounded-2xl bg-white border-2 border-[#121316] text-xs font-bold text-gray-800 flex items-start gap-2 shadow-pop-xs">
                        <Info className="w-3.5 h-3.5 text-[#6C5CE7] flex-shrink-0 mt-0.5" />
                        <span className="font-mono text-[11px] leading-tight text-gray-700">
                          {slot.notes}
                        </span>
                      </div>
                    )}

                    {/* Safe Promotion Notice if promoted */}
                    {request.adminNotes && request.adminNotes.toLowerCase().includes('promoted') && (
                      <div className="p-2.5 rounded-xl bg-[#E8F5E9] border border-[#2ED573] text-[11px] font-mono font-bold text-[#2E7D32] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0" />
                        <span>Auto-promoted from waitlist queue!</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 sm:p-6 pt-0 border-t-2 border-[#121316]/10 mt-2">
                    <div className="pt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-500 font-bold text-[11px]">
                        Requested {formatRequestedDate(request.requestedAt)}
                      </span>

                      <Link
                        to="/lab-access"
                        className="font-mono text-xs font-black text-[#6C5CE7] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Schedule</span>
                        <ArrowRight className="w-3 h-3" />
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
            <div className="w-16 h-16 rounded-3xl bg-[#2ED573] border-3 border-[#121316] mx-auto flex items-center justify-center shadow-pop-sm text-2xl">
              🧪
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#121316]">
                NO LAB BOOKINGS YET
              </h3>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                {statusFilter === 'ALL'
                  ? "You haven't requested any Lab 5.0 workbench slots yet. Reserve time blocks to build robotics, IoT, and hardware projects!"
                  : `No lab requests found with status "${statusFilter}".`}
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
                to="/lab-access"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2ED573] hover:bg-[#26af5f] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all text-center"
              >
                REQUEST LAB ACCESS →
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default StudentLabBookingsPage;
