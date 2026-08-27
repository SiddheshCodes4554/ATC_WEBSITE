import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventService } from '../../services/eventService';
import { FormService } from '../../services/formService';
import { RegistrationService } from '../../services/registrationService';
import { StorageService } from '../../services/storage.service';
import { ATCEvent } from '../../types/event.types';
import {
  EventRegistration,
  FormField,
  RegistrationStats,
  RegistrationStatus,
  RegistrationAnswer,
} from '../../types/form.types';
import {
  Calendar,
  ArrowLeft,
  Search,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  RefreshCw,
  Eye,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  X,
  UserCheck,
  Mail,
  Phone,
  Link as LinkIcon,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminEventRegistrationsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<ATCEvent | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [stats, setStats] = useState<RegistrationStats>({
    total: 0,
    registered: 0,
    cancelled: 0,
    checkedIn: 0,
    activeCount: 0,
    capacityLimit: null,
    remainingSeats: null,
    isCapacityReached: false,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Participant details drawer / modal state
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<RegistrationAnswer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState<boolean>(false);

  // Cancellation confirm modal state
  const [regToCancel, setRegToCancel] = useState<EventRegistration | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isExportingCSV, setIsExportingCSV] = useState<boolean>(false);

  // Load event, form fields, and registrations
  const loadDashboardData = async () => {
    if (!eventId?.trim()) {
      setError('Event ID missing from URL.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Event details
      const eventRes = await EventService.getEventById(eventId.trim());
      if (!eventRes.success || !eventRes.data) {
        setError(eventRes.error || 'Event could not be found in Appwrite.');
        setLoading(false);
        return;
      }
      setEvent(eventRes.data);

      // 2. Fetch Form Fields for dynamic headers and answers mapping
      try {
        const formRes = await FormService.getFormByEventId(eventId.trim());
        if (formRes.success && formRes.data?.fields) {
          setFormFields(formRes.data.fields);
        }
      } catch (fErr) {
        console.warn('Notice: Form fields could not be fetched:', fErr);
      }

      // 3. Fetch Registrations
      const regRes = await RegistrationService.getRegistrationsByEvent(eventId.trim());
      if (regRes.success && regRes.data) {
        setRegistrations(regRes.data);
      } else {
        setError(regRes.error || 'Failed to fetch registrations.');
      }

      // 4. Compute Registration Stats
      const computedStats = await RegistrationService.getRegistrationStats(
        eventId.trim(),
        eventRes.data.registrationLimit
      );
      setStats(computedStats);
    } catch (err: any) {
      console.error('Error loading registration dashboard:', err);
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [eventId]);

  // Open participant detail modal and fetch answers
  const handleOpenParticipantDetails = async (reg: EventRegistration) => {
    setSelectedRegistration(reg);
    setLoadingAnswers(true);
    try {
      const ansRes = await RegistrationService.getRegistrationAnswers(reg.$id!);
      if (ansRes.success && ansRes.data) {
        setSelectedAnswers(ansRes.data);
      } else {
        setSelectedAnswers([]);
      }
    } catch (ansErr) {
      console.warn('Could not load participant answers:', ansErr);
      setSelectedAnswers([]);
    } finally {
      setLoadingAnswers(false);
    }
  };

  // Change status (registered, cancelled, checked_in)
  const handleStatusChange = async (reg: EventRegistration, newStatus: RegistrationStatus) => {
    if (!event || !reg.$id) return;

    setIsUpdatingStatus(true);
    try {
      const updateRes = await RegistrationService.updateRegistrationStatus(
        reg.$id,
        event.$id,
        newStatus,
        event.registrationLimit
      );

      if (updateRes.success && updateRes.data) {
        // Update local state
        setRegistrations((prev) =>
          prev.map((r) => (r.$id === reg.$id ? { ...r, status: newStatus } : r))
        );

        if (selectedRegistration && selectedRegistration.$id === reg.$id) {
          setSelectedRegistration((prev) => (prev ? { ...prev, status: newStatus } : null));
        }

        // Recompute stats
        const computedStats = await RegistrationService.getRegistrationStats(
          event.$id,
          event.registrationLimit
        );
        setStats(computedStats);
        setRegToCancel(null);
      } else {
        alert(updateRes.error || 'Failed to update registration status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error updating status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Filter registrations by search and tab
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : reg.status === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        reg.name?.toLowerCase().includes(q) ||
        reg.email?.toLowerCase().includes(q) ||
        reg.phone?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [registrations, statusFilter, searchQuery]);

  // Export registrations to CSV with dynamic columns
  const handleExportCSV = async () => {
    if (!event || registrations.length === 0 || isExportingCSV) return;

    setIsExportingCSV(true);
    try {
      // 1. Batch fetch all answers for these registrations
      const regIds = registrations.map((r) => r.$id!).filter(Boolean);
      const batchRes = await RegistrationService.getBatchAnswersForRegistrations(regIds);
      const answersMap = batchRes.data || {};

      // 2. Identify custom columns (excluding system fields if already covered)
      const customHeaders = formFields
        .filter((f) => !f.systemKey)
        .map((f) => ({ key: f.$id || f.label, label: f.label }));

      // CSV Header Row
      const headers = [
        'Registration ID',
        'Participant Name',
        'Email Address',
        'Phone Number',
        'Status',
        'Registered At',
        ...customHeaders.map((h) => h.label),
      ];

      // Helper to escape CSV values
      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return '""';
        let str = String(val);
        // Clean multi-line arrays if stored as JSON
        if (str.startsWith('[') && str.endsWith(']')) {
          try {
            const arr = JSON.parse(str);
            if (Array.isArray(arr)) str = arr.join('; ');
          } catch {}
        }
        return `"${str.replace(/"/g, '""')}"`;
      };

      // Build data rows
      const rows = registrations.map((reg) => {
        const regAnswers = answersMap[reg.$id!] || {};

        const customValues = customHeaders.map((h) => {
          const ans = regAnswers[h.key] ?? regAnswers[h.label] ?? '';
          return escapeCSV(ans);
        });

        return [
          escapeCSV(reg.$id),
          escapeCSV(reg.name),
          escapeCSV(reg.email),
          escapeCSV(reg.phone || ''),
          escapeCSV(reg.status),
          escapeCSV(new Date(reg.registeredAt).toLocaleString()),
          ...customValues,
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${event.slug || 'event'}-registrations.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (csvErr) {
      console.error('Error generating CSV:', csvErr);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExportingCSV(false);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'registered':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#E8F8F0] border border-[#2ED573] font-mono text-[10px] font-black uppercase text-[#2ED573]">
            ● Registered
          </span>
        );
      case 'checked_in':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] border border-[#6C5CE7] font-mono text-[10px] font-black uppercase text-[#6C5CE7] flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            Checked In
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-0.5 rounded-full bg-[#FFE5E5] border border-[#FF4757] font-mono text-[10px] font-black uppercase text-[#FF4757]">
            ✕ Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'TBA';
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

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center gap-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center animate-bounce">
            <Users className="w-8 h-8 text-[#121316]" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[#121316]">Loading Registrations</h3>
            <p className="font-mono text-xs font-bold text-gray-600 mt-1">Retrieving attendees from Appwrite...</p>
          </div>
          <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mt-2" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F0] paper-pattern select-none">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-[#FFE5E5] border-4 border-[#FF4757] shadow-pop-xl space-y-4">
          <AlertCircle className="w-12 h-12 text-[#FF4757] mx-auto" />
          <h3 className="text-xl font-black text-[#121316]">Unable to Load Registrations</h3>
          <p className="text-xs sm:text-sm font-bold text-gray-700">{error || 'Event record not found.'}</p>
          <div className="pt-2">
            <Link
              to="/admin/events"
              className="px-6 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black shadow-pop-sm inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/events"
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Events"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#6C5CE7]">
                ATTENDEE MANAGEMENT • REGISTRATIONS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight truncate max-w-lg">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm transition-all text-[#121316] cursor-pointer"
              title="Refresh registrations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to={`/events/${event.slug}`}
              target="_blank"
              className="px-4 py-2 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Page</span>
            </Link>

            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0 || isExportingCSV}
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 text-[#121316] disabled:opacity-50 cursor-pointer transition-all"
            >
              {isExportingCSV ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
                  <span>Export CSV</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* EVENT SUMMARY BANNER */}
        <div
          className="p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          style={{ borderTopColor: event.accentColor || '#FFE600', borderTopWidth: '8px' }}
        >
          <div className="flex items-center gap-4">
            {event.coverImageId && (
              <div className="w-20 h-20 rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 flex-shrink-0 hidden sm:block">
                <img
                  src={StorageService.getEventImageUrl(event.coverImageId, 200)}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase text-[#121316]">
                  {event.eventType}
                </span>
                <span className="font-mono text-xs text-gray-500 font-bold">
                  slug: /{event.slug}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight mt-1">
                {event.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 font-mono text-xs font-bold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  {formatDate(event.startDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B6B]" />
                  {event.venue}
                </span>
              </div>
            </div>
          </div>

          {stats.capacityLimit && (
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1 sm:text-right flex-shrink-0">
              <span className="font-mono text-[10px] font-black uppercase text-gray-500 block">
                CAPACITY TRACKER
              </span>
              <p className="font-mono text-lg font-black text-[#121316]">
                {stats.activeCount} / {stats.capacityLimit}{' '}
                <span className="text-xs font-bold text-gray-600">Seats</span>
              </p>
              <span
                className={`font-mono text-[11px] font-bold block ${
                  stats.isCapacityReached ? 'text-[#FF4757]' : 'text-[#2ED573]'
                }`}
              >
                {stats.isCapacityReached
                  ? '⚠️ Capacity Full'
                  : `${stats.remainingSeats} seats remaining`}
              </span>
            </div>
          )}
        </div>

        {/* REGISTRATION METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-gray-500">
              TOTAL SIGNUPS
            </span>
            <h3 className="text-3xl font-black text-[#121316]">{stats.total}</h3>
            <p className="font-mono text-[10px] text-gray-400 font-bold">All-time submissions</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#2ED573]">
              CONFIRMED
            </span>
            <h3 className="text-3xl font-black text-[#2ED573]">{stats.registered}</h3>
            <p className="font-mono text-[10px] text-gray-400 font-bold">Active attendee seats</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
              CHECKED IN
            </span>
            <h3 className="text-3xl font-black text-[#6C5CE7]">{stats.checkedIn}</h3>
            <p className="font-mono text-[10px] text-gray-400 font-bold">Attended at venue</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
            <span className="font-mono text-[10px] font-black uppercase text-[#FF4757]">
              CANCELLED
            </span>
            <h3 className="text-3xl font-black text-[#FF4757]">{stats.cancelled}</h3>
            <p className="font-mono text-[10px] text-gray-400 font-bold">Seats released</p>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All (${registrations.length})` },
              { id: 'registered', label: `Registered (${stats.registered})` },
              { id: 'checked_in', label: `Checked In (${stats.checkedIn})` },
              { id: 'cancelled', label: `Cancelled (${stats.cancelled})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-2xl font-mono text-xs font-black border-2 border-[#121316] transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#121316] text-white shadow-pop-sm'
                    : 'bg-[#FAF7F0] text-[#121316] hover:bg-[#E1DCFF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* PARTICIPANTS TABLE */}
        <div className="rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl overflow-hidden">
          {filteredRegistrations.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-[#121316]" />
              </div>
              <h3 className="text-xl font-black text-[#121316]">
                {searchQuery || statusFilter !== 'all'
                  ? 'No matching participants found'
                  : 'No registrations yet'}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try changing your search query or selecting a different status filter tab.'
                  : 'When students submit registration on the public event page, their entries will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b-3 border-[#121316] text-[#121316] font-mono text-xs font-black uppercase">
                    <th className="py-4 px-6">Participant</th>
                    <th className="py-4 px-6">Contact Details</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Registration Time</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#121316]/10 text-xs font-bold">
                  {filteredRegistrations.map((reg) => (
                    <tr
                      key={reg.$id}
                      className="hover:bg-[#FFF9DB]/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenParticipantDetails(reg)}
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center font-mono font-black text-sm text-[#121316] flex-shrink-0">
                            {reg.name ? reg.name.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div>
                            <span className="font-black text-sm text-[#121316] block group-hover:text-[#6C5CE7] transition-colors">
                              {reg.name}
                            </span>
                            <span className="font-mono text-[10px] text-gray-400 block truncate max-w-[140px]">
                              ID: {reg.$id?.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-800">
                          <Mail className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          <span>{reg.email || '—'}</span>
                        </div>
                        {reg.phone && (
                          <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-[#2ED573]" />
                            <span>{reg.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(reg.status)}
                          <select
                            value={reg.status}
                            disabled={isUpdatingStatus}
                            onChange={(e) => {
                              const newStat = e.target.value as RegistrationStatus;
                              if (newStat === 'cancelled') {
                                setRegToCancel(reg);
                              } else {
                                handleStatusChange(reg, newStat);
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-white border border-[#121316] font-mono text-[10px] font-bold text-gray-700 cursor-pointer"
                          >
                            <option value="registered">Registered</option>
                            <option value="checked_in">Checked In</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-4 px-6 font-mono text-gray-600 text-[11px]">
                        {formatDate(reg.registeredAt)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenParticipantDetails(reg)}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* =================================================================== */}
      {/* PARTICIPANT DETAILS MODAL / DRAWER                                  */}
      {/* =================================================================== */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl paper-pattern overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-[#FAF7F0] border-b-3 border-[#121316] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center font-mono font-black text-xl text-[#121316]">
                  {selectedRegistration.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
                      ATTENDEE PROFILE
                    </span>
                    {getStatusBadge(selectedRegistration.status)}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
                    {selectedRegistration.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE5E5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[#121316]" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Primary Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    EMAIL ADDRESS
                  </span>
                  <p className="font-bold text-sm text-[#121316] select-all">
                    {selectedRegistration.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    PHONE NUMBER
                  </span>
                  <p className="font-bold text-sm text-[#121316] select-all">
                    {selectedRegistration.phone || 'Not provided'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    REGISTRATION TIMESTAMP
                  </span>
                  <p className="font-mono text-xs font-bold text-gray-700">
                    {formatDate(selectedRegistration.registeredAt)}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    REGISTRATION ID
                  </span>
                  <p className="font-mono text-[11px] font-bold text-[#6C5CE7] select-all truncate">
                    {selectedRegistration.$id}
                  </p>
                </div>
              </div>

              {/* Dynamic Registration Form Responses */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-[#121316]/10">
                  <ShieldCheck className="w-4 h-4 text-[#6C5CE7]" />
                  <h4 className="font-black text-sm text-[#121316] uppercase tracking-wide">
                    Custom Form Responses
                  </h4>
                </div>

                {loadingAnswers ? (
                  <div className="p-8 text-center space-y-2">
                    <Loader2 className="w-6 h-6 text-[#6C5CE7] animate-spin mx-auto" />
                    <p className="font-mono text-xs text-gray-500">Retrieving answers from Appwrite...</p>
                  </div>
                ) : selectedAnswers.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-center text-xs font-bold text-gray-500">
                    No additional custom question answers recorded for this entry.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedAnswers.map((ans, aIdx) => {
                      // Look up matching FormField
                      const fieldMatch = formFields.find(
                        (f) => f.$id === ans.fieldId || f.label === ans.fieldId
                      );

                      const label = fieldMatch?.label || ans.fieldId;
                      const fieldType = fieldMatch?.fieldType || 'short_text';
                      const rawValue = ans.value;

                      // Parse array JSON (checkbox answers)
                      let parsedArray: string[] | null = null;
                      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
                        try {
                          const p = JSON.parse(rawValue);
                          if (Array.isArray(p)) parsedArray = p;
                        } catch {}
                      }

                      // Check URL
                      const isUrl =
                        fieldType === 'url' ||
                        rawValue.startsWith('http://') ||
                        rawValue.startsWith('https://');

                      return (
                        <div
                          key={ans.$id || aIdx}
                          className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1.5 shadow-pop-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-black uppercase text-[#121316]">
                              {label}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white border border-[#121316] font-mono text-[9px] font-bold text-gray-600">
                              {fieldType}
                            </span>
                          </div>

                          {parsedArray ? (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {parsedArray.map((item, iIdx) => (
                                <span
                                  key={iIdx}
                                  className="px-2.5 py-0.5 rounded-lg bg-white border border-[#121316] font-mono text-xs font-bold text-[#121316]"
                                >
                                  ✓ {item}
                                </span>
                              ))}
                            </div>
                          ) : isUrl ? (
                            <a
                              href={rawValue.startsWith('http') ? rawValue : `https://${rawValue}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-[#6C5CE7] hover:underline inline-flex items-center gap-1 break-all"
                            >
                              <span>{rawValue}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          ) : (
                            <p className="text-xs sm:text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed">
                              {rawValue || <span className="text-gray-400 italic">Not provided</span>}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-6 bg-[#FAF7F0] border-t-3 border-[#121316] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-gray-600">Status:</span>
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedRegistration.status === 'checked_in'}
                  onClick={() => handleStatusChange(selectedRegistration, 'checked_in')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E1DCFF] hover:bg-[#6C5CE7] hover:text-white border-2 border-[#6C5CE7] font-mono text-xs font-black text-[#6C5CE7] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  ✓ Mark Checked In
                </button>

                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedRegistration.status === 'registered'}
                  onClick={() => handleStatusChange(selectedRegistration, 'registered')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E8F8F0] hover:bg-[#2ED573] hover:text-[#121316] border-2 border-[#2ED573] font-mono text-xs font-black text-[#2ED573] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  ● Set Registered
                </button>

                {selectedRegistration.status !== 'cancelled' && (
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => setRegToCancel(selectedRegistration)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FFE5E5] hover:bg-[#FF4757] hover:text-white border-2 border-[#FF4757] font-mono text-xs font-black text-[#FF4757] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    ✕ Cancel Entry
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="px-6 py-2 rounded-full bg-[#121316] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm cursor-pointer hover:bg-gray-800"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CANCELLATION CONFIRMATION MODAL                                    */}
      {/* =================================================================== */}
      {regToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 space-y-5 paper-pattern">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop flex items-center justify-center mx-auto text-[#FF4757]">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[#121316]">
                Cancel Registration?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Cancel registration for <span className="text-[#FF4757] font-black">"{regToCancel.name}"</span>? This will free their attendee seat and mark the record as cancelled.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setRegToCancel(null)}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F0] font-mono text-xs font-black border-2 border-[#121316] cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => handleStatusChange(regToCancel, 'cancelled')}
                className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#FF3838] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isUpdatingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEventRegistrationsPage;
