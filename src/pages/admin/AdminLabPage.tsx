import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LabSlotService } from '../../services/labSlotService';
import { LabRequestService } from '../../services/labRequestService';
import {
  LabSlot,
  LabRequest,
  LabRequestStatus,
  LabSlotStatus,
  CreateLabSlotInput,
  UpdateLabSlotInput,
  AdminLabOverviewStats,
} from '../../types/labBooking.types';
import { getSlotTimeRemaining } from '../../utils/labTimeUtils';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hourglass,
  ListOrdered,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Loader2,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const AdminLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'slots' | 'requests' | 'waitlist'>('overview');

  // Stats
  const [stats, setStats] = useState<AdminLabOverviewStats>({
    todaySlots: 0,
    availableSlots: 0,
    pendingRequests: 0,
    activeWaitlists: 0,
    approvedBookings: 0,
  });

  // Slots State
  const [slots, setSlots] = useState<LabSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(true);
  const [slotDateFilter, setSlotDateFilter] = useState<string>('');
  const [isCleaningUp, setIsCleaningUp] = useState<boolean>(false);

  // Requests State
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState<boolean>(true);
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  const [requestSearchQuery, setRequestSearchQuery] = useState<string>('');

  // Modals State
  const [isCreateSlotModalOpen, setIsCreateSlotModalOpen] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<LabSlot | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<LabRequest | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');

  // Slot Form State
  const [slotForm, setSlotForm] = useState<CreateLabSlotInput>({
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    capacity: 2,
    status: 'available',
    notes: '',
  });

  // Notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 6000);
  };

  // Manual Trigger for Storage Cleanup & Purging Expired Slots
  const handleCleanExpiredSlots = async () => {
    setIsCleaningUp(true);
    try {
      const res = await LabSlotService.cleanupExpiredSlots();
      if (res.success && res.data) {
        if (res.data.deletedSlotsCount > 0) {
          showSuccess(`⚡ Storage Optimized: Purged ${res.data.deletedSlotsCount} expired slot(s) and ${res.data.deletedRequestsCount} past booking request(s)!`);
        } else {
          showSuccess('Database already optimized: No expired slots found.');
        }
        loadSlots();
        loadRequests();
        loadOverview();
      } else {
        showError(res.error || 'Failed to clean up expired slots.');
      }
    } catch (err: any) {
      showError('Error during slot cleanup.');
    } finally {
      setIsCleaningUp(false);
    }
  };

  // Load Overview Data
  const loadOverview = async () => {
    const res = await LabRequestService.getAdminOverviewStats();
    if (res.success && res.data) {
      setStats(res.data);
    }
  };

  // Load Slots
  const loadSlots = async () => {
    setSlotsLoading(true);
    try {
      const res = await LabSlotService.getAllSlots({
        date: slotDateFilter || undefined,
      });
      if (res.success && res.data) {
        setSlots(res.data);
      }
    } catch (err: any) {
      showError('Failed to load slots.');
    } finally {
      setSlotsLoading(false);
    }
  };

  // Load Requests
  const loadRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await LabRequestService.getAdminRequests({
        status: requestStatusFilter === 'all' ? undefined : (requestStatusFilter as LabRequestStatus),
      });
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err: any) {
      showError('Failed to load requests.');
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    loadSlots();
    loadRequests();
  }, []);

  useEffect(() => {
    loadSlots();
  }, [slotDateFilter]);

  useEffect(() => {
    loadRequests();
  }, [requestStatusFilter]);

  // Handle Create / Edit Slot
  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoadingId('save-slot');

    try {
      if (editingSlot) {
        const res = await LabSlotService.updateSlot(editingSlot.$id, slotForm);
        if (res.success) {
          showSuccess('Slot updated successfully.');
          setEditingSlot(null);
          setIsCreateSlotModalOpen(false);
          loadSlots();
          loadOverview();
        } else {
          showError(res.error || 'Failed to update slot.');
        }
      } else {
        const res = await LabSlotService.createSlot(slotForm);
        if (res.success) {
          showSuccess('Lab slot created successfully.');
          setIsCreateSlotModalOpen(false);
          loadSlots();
          loadOverview();
        } else {
          showError(res.error || 'Failed to create slot.');
        }
      }
    } catch (err: any) {
      showError(err?.message || 'Error saving slot.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete Slot
  const handleDeleteSlot = async (slot: LabSlot) => {
    if (!window.confirm(`Are you sure you want to delete the slot on ${slot.date} (${slot.startTime} - ${slot.endTime})?`)) {
      return;
    }
    setActionLoadingId(slot.$id);
    try {
      const res = await LabSlotService.deleteSlot(slot.$id);
      if (res.success) {
        showSuccess('Slot deleted.');
        loadSlots();
        loadOverview();
      } else {
        showError(res.error || 'Could not delete slot.');
      }
    } catch (err: any) {
      showError('Error deleting slot.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Toggle Block / Close
  const handleToggleSlotStatus = async (slot: LabSlot, newStatus: LabSlotStatus) => {
    setActionLoadingId(slot.$id);
    try {
      const res = await LabSlotService.updateSlot(slot.$id, { status: newStatus });
      if (res.success) {
        showSuccess(`Slot status changed to ${newStatus}.`);
        loadSlots();
      } else {
        showError(res.error || 'Could not update status.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Approve Request
  const handleApproveRequest = async (req: LabRequest) => {
    setActionLoadingId(req.$id);
    try {
      const res = await LabRequestService.approveRequest(req.$id);
      if (res.success) {
        showSuccess(`Approved booking for ${req.requesterName}!`);
        loadRequests();
        loadOverview();
      } else {
        showError(res.error || 'Could not approve request.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject Request
  const handleConfirmReject = async () => {
    if (!rejectingRequest) return;
    setActionLoadingId(rejectingRequest.$id);
    try {
      const res = await LabRequestService.rejectRequest(rejectingRequest.$id, adminNoteInput);
      if (res.success) {
        showSuccess('Request rejected.');
        setRejectingRequest(null);
        setAdminNoteInput('');
        loadRequests();
        loadOverview();
      } else {
        showError(res.error || 'Could not reject request.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Cancel Request
  const handleCancelRequest = async (req: LabRequest) => {
    if (!window.confirm(`Cancel booking for ${req.requesterName}? Next waitlisted maker will be automatically promoted.`)) {
      return;
    }
    setActionLoadingId(req.$id);
    try {
      const res = await LabRequestService.cancelRequest(req.$id, 'Cancelled by Admin');
      if (res.success) {
        showSuccess('Booking cancelled. Next waitlisted request promoted if spots opened up!');
        loadRequests();
        loadOverview();
      } else {
        showError(res.error || 'Could not cancel request.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Queue Move
  const handleMoveQueue = async (req: LabRequest, direction: 'up' | 'down') => {
    setActionLoadingId(req.$id);
    try {
      const res = await LabRequestService.moveRequestInQueue(req.$id, direction);
      if (res.success) {
        showSuccess(`Moved #${req.queuePosition} ${direction}.`);
        loadRequests();
      } else {
        showError(res.error || 'Could not reorder queue.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Promote Waitlist to Pending
  const handlePromoteWaitlist = async (req: LabRequest) => {
    setActionLoadingId(req.$id);
    try {
      const res = await LabRequestService.promoteWaitlistToPending(req.$id);
      if (res.success) {
        showSuccess(`Promoted ${req.requesterName} to Pending review!`);
        loadRequests();
        loadOverview();
      } else {
        showError(res.error || 'Could not promote request.');
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered Requests for Search
  const filteredRequests = requests.filter((r) => {
    if (!requestSearchQuery.trim()) return true;
    const query = requestSearchQuery.toLowerCase();
    return (
      r.requesterName.toLowerCase().includes(query) ||
      r.purpose.toLowerCase().includes(query) ||
      r.requesterPhone.includes(query)
    );
  });

  // Group Waitlisted requests by Slot for Waitlist Tab
  const waitlistedRequests = requests.filter((r) => r.status === 'waitlisted');
  const waitlistBySlot = waitlistedRequests.reduce((acc, req) => {
    if (!acc[req.slotId]) acc[req.slotId] = [];
    acc[req.slotId].push(req);
    return acc;
  }, {} as Record<string, LabRequest[]>);

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-500 mb-1">
            <Link to="/admin/dashboard" className="hover:text-[#121316]">
              Admin Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#6C5CE7]">Lab Access & Slots</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
            Lab Access & Slot Management ⚡
          </h1>
          <p className="text-xs sm:text-sm font-bold text-gray-600">
            Schedule laboratory slots, manage capacity, approve maker visits, and supervise the auto-promoting waitlist queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCleanExpiredSlots}
            disabled={isCleaningUp}
            className="px-4 py-2.5 rounded-full bg-[#E8F5E9] hover:bg-[#c8e6c9] text-[#2E7D32] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Clean up all slots whose date and end time have passed"
          >
            {isCleaningUp ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-[#2E7D32]" />
            )}
            <span>Purge Expired</span>
          </button>

          <Link
            to="/lab-access"
            target="_blank"
            className="px-4 py-2.5 rounded-full bg-white hover:bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
          >
            <span>View Public Schedule</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setEditingSlot(null);
              setSlotForm({
                date: new Date().toISOString().split('T')[0],
                startTime: '10:00',
                endTime: '12:00',
                capacity: 2,
                status: 'available',
                notes: '',
              });
              setIsCreateSlotModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Slot</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="max-w-7xl mx-auto p-4 rounded-2xl bg-[#E8F5E9] border-2 border-[#2ED573] text-[#2E7D32] text-xs font-bold flex items-center justify-between shadow-pop-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="p-1 hover:bg-emerald-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="max-w-7xl mx-auto p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#D63031] text-xs font-bold flex items-center justify-between shadow-pop-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-red-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-1">
          <div className="text-[11px] font-mono font-bold text-gray-500 uppercase">Today's Slots</div>
          <div className="text-2xl sm:text-3xl font-black text-[#121316]">{stats.todaySlots}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#E8F5E9] border-3 border-[#121316] shadow-pop-sm space-y-1">
          <div className="text-[11px] font-mono font-bold text-[#2E7D32] uppercase">Spots Open Today</div>
          <div className="text-2xl sm:text-3xl font-black text-[#2E7D32]">{stats.availableSlots}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#F0EBFF] border-3 border-[#121316] shadow-pop-sm space-y-1">
          <div className="text-[11px] font-mono font-bold text-[#6C5CE7] uppercase">Pending Reviews</div>
          <div className="text-2xl sm:text-3xl font-black text-[#6C5CE7]">{stats.pendingRequests}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#FFF3E0] border-3 border-[#121316] shadow-pop-sm space-y-1">
          <div className="text-[11px] font-mono font-bold text-[#E65100] uppercase">Active Waitlist</div>
          <div className="text-2xl sm:text-3xl font-black text-[#E65100]">{stats.activeWaitlists}</div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#E1F5FE] border-3 border-[#121316] shadow-pop-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono font-bold text-[#0288D1] uppercase">Approved Total</div>
          <div className="text-2xl sm:text-3xl font-black text-[#0288D1]">{stats.approvedBookings}</div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-full border-3 border-[#121316] shadow-pop max-w-xl">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2 rounded-full font-mono text-xs font-black transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#121316] text-white shadow-pop-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('slots')}
            className={`px-5 py-2 rounded-full font-mono text-xs font-black transition-all cursor-pointer ${
              activeTab === 'slots'
                ? 'bg-[#121316] text-white shadow-pop-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Slots ({slots.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-2 rounded-full font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-[#121316] text-white shadow-pop-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>Requests</span>
            {stats.pendingRequests > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#FF4757] text-white text-[10px]">
                {stats.pendingRequests}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('waitlist')}
            className={`px-5 py-2 rounded-full font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'waitlist'
                ? 'bg-[#121316] text-white shadow-pop-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>Waitlist</span>
            {stats.activeWaitlists > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#FF793F] text-white text-[10px]">
                {stats.activeWaitlists}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="max-w-7xl mx-auto">
        
        {/* ============================================================= */}
        {/* TAB 1: OVERVIEW                                               */}
        {/* ============================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Action Shortcuts Banner */}
            <div className="p-6 sm:p-8 rounded-[36px] bg-[#121316] text-white border-4 border-[#121316] shadow-pop-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFE600] text-[#121316] font-mono text-[10px] font-black uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>ADMIN WORKFLOW</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Ready to manage Lab 5.0 bookings?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold">
                  {stats.pendingRequests} maker requests are waiting for your approval.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRequestStatusFilter('pending');
                    setActiveTab('requests');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
                >
                  <Hourglass className="w-3.5 h-3.5" />
                  <span>Review Pending ({stats.pendingRequests})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSlot(null);
                    setIsCreateSlotModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#121316] font-mono text-xs font-black border-2 border-white/20 hover:border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Time Block</span>
                </button>
              </div>
            </div>

            {/* Pending Requests Needing Attention */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight flex items-center gap-2">
                  <Hourglass className="w-5 h-5 text-[#6C5CE7]" />
                  <span>Requests Needing Review</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('requests')}
                  className="text-xs font-mono font-bold text-[#6C5CE7] hover:underline"
                >
                  View All Requests →
                </button>
              </div>

              {requests.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm text-center font-mono text-xs font-bold text-gray-500">
                  🎉 No pending requests! All maker submissions have been reviewed.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests
                    .filter((r) => r.status === 'pending')
                    .slice(0, 6)
                    .map((req) => (
                      <div
                        key={req.$id}
                        className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-base text-[#121316]">
                                {req.requesterName}
                              </span>
                              {req.userId && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#2E86DE] text-[9px] font-mono font-bold border border-blue-300" title="Verified Student Account">
                                  STUDENT
                                </span>
                              )}
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#F0EBFF] text-[#6C5CE7] font-mono text-[10px] font-black border border-[#6C5CE7]/30">
                              PENDING
                            </span>
                          </div>

                          <p className="text-xs font-bold text-gray-700 leading-relaxed bg-[#FAF7F0] p-2.5 rounded-xl border border-[#121316]/10">
                            "{req.purpose}"
                          </p>

                          <div className="text-xs font-mono text-gray-600 space-y-1">
                            {req.slotInfo && (
                              <div className="flex items-center gap-1.5 font-bold text-[#121316]">
                                <Clock className="w-3.5 h-3.5 text-[#6C5CE7]" />
                                <span>
                                  {req.slotInfo.date} • {req.slotInfo.startTime} - {req.slotInfo.endTime}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 pt-1">
                              <a
                                href={`tel:${req.requesterPhone}`}
                                className="inline-flex items-center gap-1 text-[11px] text-[#2E86DE] hover:underline font-bold"
                              >
                                <Phone className="w-3 h-3" /> {req.requesterPhone}
                              </a>
                              <a
                                href={`https://wa.me/${req.requesterPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black hover:bg-emerald-200"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#121316]/10">
                          <button
                            type="button"
                            onClick={() => handleApproveRequest(req)}
                            disabled={actionLoadingId === req.$id}
                            className="flex-1 py-2 rounded-xl bg-[#2ED573] hover:bg-[#26af5f] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-105"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Approve</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectingRequest(req);
                              setAdminNoteInput('');
                            }}
                            className="px-3 py-2 rounded-xl bg-[#FF4757] hover:bg-[#e0404f] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center justify-center gap-1 cursor-pointer transition-transform hover:scale-105"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: SLOTS MANAGEMENT                                       */}
        {/* ============================================================= */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            {/* Auto-Expire & Optimization Status Banner */}
            <div className="p-4 rounded-3xl bg-[#E8F5E9] border-3 border-[#2ED573] shadow-pop-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#2E7D32]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-[#2ED573] shadow-pop-xs">
                  <ShieldCheck className="w-5 h-5 text-[#2ED573]" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-[#1B5E20]">
                    Auto-Expire & Space Optimization Active ⚡
                  </h4>
                  <p className="text-xs font-bold text-[#2E7D32]">
                    Slots and booking requests automatically delete once their scheduled time ends to preserve Appwrite database limits.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCleanExpiredSlots}
                disabled={isCleaningUp}
                className="px-4 py-2 rounded-2xl bg-[#2ED573] hover:bg-[#26af5f] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
              >
                {isCleaningUp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                <span>Purge Expired Slots Now</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 font-mono text-xs font-bold text-gray-700">
                  <Calendar className="w-4 h-4 text-[#6C5CE7]" />
                  <span>Filter Date:</span>
                  <input
                    type="date"
                    value={slotDateFilter}
                    onChange={(e) => setSlotDateFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border-2 border-[#121316] font-mono text-xs font-bold"
                  />
                </label>

                {slotDateFilter && (
                  <button
                    type="button"
                    onClick={() => setSlotDateFilter('')}
                    className="text-xs font-mono font-bold text-[#FF4757] hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gray-500">
                  Showing {slots.length} active slots
                </span>
                <button
                  type="button"
                  onClick={loadSlots}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-[#121316]"
                  title="Refresh Slots"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slots Grid */}
            {slotsLoading ? (
              <div className="p-12 text-center font-mono text-xs font-bold text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6C5CE7]" />
                Loading slots...
              </div>
            ) : slots.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border-3 border-[#121316] shadow-pop text-center space-y-3">
                <Clock className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-mono text-xs font-bold text-gray-600">
                  No active slots found. Expired slots have been automatically purged.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateSlotModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316]"
                >
                  + Create Slot
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slots.map((slot) => {
                  const timeRemaining = getSlotTimeRemaining(slot.date, slot.endTime);
                  return (
                    <div
                      key={slot.$id}
                      className={`p-6 rounded-[32px] bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-md transition-all flex flex-col justify-between space-y-4 ${
                        slot.status === 'blocked' ? 'opacity-70 bg-gray-50' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-gray-500">
                            {slot.date}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2E86DE] font-mono text-[10px] font-black border border-blue-200">
                              {timeRemaining.label}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase border ${
                                slot.status === 'available'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : slot.status === 'blocked'
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : 'bg-gray-200 text-gray-800 border-gray-400'
                              }`}
                            >
                              {slot.status}
                            </span>
                          </div>
                        </div>

                        <div className="text-xl font-black text-[#121316] flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[#6C5CE7]" />
                          <span>
                            {slot.startTime} — {slot.endTime}
                          </span>
                        </div>

                        <div className="text-xs font-mono font-bold text-gray-600 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>Capacity: {slot.capacity} {slot.capacity === 1 ? 'maker' : 'makers'}</span>
                        </div>

                        {slot.notes && (
                          <p className="text-xs font-bold text-gray-600 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#121316]/10">
                            {slot.notes}
                          </p>
                        )}
                      </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#121316]/10 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSlot(slot);
                            setSlotForm({
                              date: slot.date,
                              startTime: slot.startTime,
                              endTime: slot.endTime,
                              capacity: slot.capacity,
                              status: slot.status,
                              notes: slot.notes || '',
                            });
                            setIsCreateSlotModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-[#121316] text-[#121316]"
                          title="Edit Slot"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSlotStatus(
                              slot,
                              slot.status === 'blocked' ? 'available' : 'blocked'
                            )
                          }
                          className={`p-2 rounded-xl border border-[#121316] ${
                            slot.status === 'blocked'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title={slot.status === 'blocked' ? 'Unblock Slot' : 'Block Slot'}
                        >
                          {slot.status === 'blocked' ? (
                            <Unlock className="w-3.5 h-3.5" />
                          ) : (
                            <Lock className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot)}
                          className="p-2 rounded-xl bg-red-100 hover:bg-red-200 border border-red-400 text-red-700"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setRequestSearchQuery('');
                          setRequestStatusFilter('all');
                          setActiveTab('requests');
                        }}
                        className="text-[11px] font-mono font-bold text-[#6C5CE7] hover:underline"
                      >
                        View Requests →
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: REQUESTS MANAGEMENT                                    */}
        {/* ============================================================= */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'pending', 'approved', 'waitlisted', 'rejected', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRequestStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-black uppercase transition-all ${
                      requestStatusFilter === st
                        ? 'bg-[#121316] text-white shadow-pop-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, purpose..."
                    value={requestSearchQuery}
                    onChange={(e) => setRequestSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border-2 border-[#121316] text-xs font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={loadRequests}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-[#121316]"
                  title="Refresh Requests"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Requests List */}
            {requestsLoading ? (
              <div className="p-12 text-center font-mono text-xs font-bold text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6C5CE7]" />
                Loading requests...
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border-3 border-[#121316] shadow-pop text-center space-y-2">
                <Hourglass className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-mono text-xs font-bold text-gray-600">
                  No requests matching "{requestStatusFilter}".
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((req) => (
                  <div
                    key={req.$id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Maker info & purpose */}
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-base sm:text-lg text-[#121316]">
                          {req.requesterName}
                        </span>
                        {req.userId && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[#2E86DE] text-[9px] font-mono font-bold border border-blue-300" title="Verified Student Account">
                            STUDENT
                          </span>
                        )}

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase border ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : req.status === 'pending'
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : req.status === 'waitlisted'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : req.status === 'rejected'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}
                        >
                          {req.status === 'waitlisted' ? `WAITLIST #${req.queuePosition}` : req.status}
                        </span>

                        {req.slotInfo && (
                          <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                            {req.slotInfo.date} • {req.slotInfo.startTime} - {req.slotInfo.endTime}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-gray-700 leading-snug">
                        <span className="text-gray-500 font-normal">Purpose: </span>
                        {req.purpose}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono">
                        <a
                          href={`tel:${req.requesterPhone}`}
                          className="inline-flex items-center gap-1 text-[#2E86DE] hover:underline font-bold"
                        >
                          <Phone className="w-3 h-3" /> {req.requesterPhone}
                        </a>
                        <a
                          href={`https://wa.me/${req.requesterPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black hover:bg-emerald-200"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" /> WhatsApp
                        </a>

                        {req.adminNotes && (
                          <span className="text-gray-500 italic">
                            Note: {req.adminNotes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                      {req.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveRequest(req)}
                            disabled={actionLoadingId === req.$id}
                            className="px-4 py-2 rounded-xl bg-[#2ED573] hover:bg-[#26af5f] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Approve</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectingRequest(req);
                              setAdminNoteInput('');
                            }}
                            className="px-3 py-2 rounded-xl bg-[#FF4757] hover:bg-[#e0404f] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {req.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(req)}
                          className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-red-600 font-mono text-xs font-bold border border-[#121316]"
                        >
                          Cancel Booking
                        </button>
                      )}

                      {req.status === 'waitlisted' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handlePromoteWaitlist(req)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm"
                          >
                            Promote to Pending
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectingRequest(req);
                              setAdminNoteInput('');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-red-600 font-mono text-xs font-bold border border-[#121316]"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: WAITLIST QUEUE MANAGER                                 */}
        {/* ============================================================= */}
        {activeTab === 'waitlist' && (
          <div className="space-y-6">
            <div className="p-6 rounded-[36px] bg-[#121316] text-white border-4 border-[#121316] shadow-pop-xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FF793F] text-white font-mono text-[10px] font-black uppercase">
                <ListOrdered className="w-3 h-3" />
                <span>ACTIVE WAITLIST QUEUE</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Queue Supervised Auto-Promotion
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-2xl">
                When an approved maker cancels, the system auto-promotes Position #1 into Pending review and normalizes queue positions. You can also manually reorder or promote makers below.
              </p>
            </div>

            {Object.keys(waitlistBySlot).length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border-3 border-[#121316] shadow-pop text-center font-mono text-xs font-bold text-gray-500">
                ✨ No active waitlisted makers at this time.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(waitlistBySlot).map(([slotId, queuedReqs]) => {
                  const sorted = [...queuedReqs].sort(
                    (a, b) => (a.queuePosition ?? 999) - (b.queuePosition ?? 999)
                  );
                  const sample = sorted[0];

                  return (
                    <div
                      key={slotId}
                      className="p-6 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#121316]/10">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#FF793F]" />
                          <h4 className="font-black text-base text-[#121316]">
                            {sample.slotInfo
                              ? `${sample.slotInfo.date} • ${sample.slotInfo.startTime} - ${sample.slotInfo.endTime}`
                              : `Slot ID: ${slotId}`}
                          </h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#FFF3E0] text-[#E65100] font-mono text-xs font-black border border-[#FF793F]/30">
                          {sorted.length} Makers Queued
                        </span>
                      </div>

                      <div className="space-y-3">
                        {sorted.map((req, idx) => (
                          <div
                            key={req.$id}
                            className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] font-mono font-black text-xs flex items-center justify-center flex-shrink-0 shadow-pop-sm">
                                #{req.queuePosition || idx + 1}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-sm text-[#121316]">
                                    {req.requesterName}
                                  </span>
                                  {req.userId && (
                                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[#2E86DE] text-[9px] font-mono font-bold border border-blue-300" title="Verified Student Account">
                                      STUDENT
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-bold text-gray-600">
                                  {req.purpose}
                                </div>
                                <div className="text-[11px] font-mono text-gray-500">
                                  <a
                                    href={`tel:${req.requesterPhone}`}
                                    className="text-[#2E86DE] hover:underline mr-2"
                                  >
                                    {req.requesterPhone}
                                  </a>
                                  <span>Requested: {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            </div>

                            {/* Queue Reorder & Promote Actions */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <button
                                type="button"
                                disabled={idx === 0 || actionLoadingId === req.$id}
                                onClick={() => handleMoveQueue(req, 'up')}
                                className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-[#121316] disabled:opacity-40"
                                title="Move Up in Queue"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                disabled={idx === sorted.length - 1 || actionLoadingId === req.$id}
                                onClick={() => handleMoveQueue(req, 'down')}
                                className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-[#121316] disabled:opacity-40"
                                title="Move Down in Queue"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePromoteWaitlist(req)}
                                className="px-3 py-1.5 rounded-xl bg-[#2ED573] hover:bg-[#26af5f] text-[#121316] font-mono text-xs font-black border border-[#121316] shadow-pop-sm"
                              >
                                Promote
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================= */}
      {/* MODAL 1: CREATE / EDIT SLOT MODAL                             */}
      {/* ============================================================= */}
      {isCreateSlotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-[36px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-2xl overflow-hidden p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#121316]/10">
              <h3 className="text-xl font-black text-[#121316]">
                {editingSlot ? 'Edit Lab Slot' : 'Create New Lab Slot'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateSlotModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                  Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  required
                  value={slotForm.date}
                  onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                    Capacity (Makers)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={slotForm.capacity}
                    onChange={(e) => setSlotForm({ ...slotForm, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                    Status
                  </label>
                  <select
                    value={slotForm.status}
                    onChange={(e) => setSlotForm({ ...slotForm, status: e.target.value as LabSlotStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-bold"
                  >
                    <option value="available">Available</option>
                    <option value="blocked">Blocked</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                  Admin Notes / Workbench Guidance (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3D printer maintenance, Soldering bench reserved..."
                  value={slotForm.notes}
                  onChange={(e) => setSlotForm({ ...slotForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] font-bold text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 font-mono text-xs font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === 'save-slot'}
                  className="px-5 py-2 rounded-xl bg-[#FFE600] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:bg-[#FFD32A]"
                >
                  {actionLoadingId === 'save-slot' ? 'Saving...' : editingSlot ? 'Update Slot' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: REJECT REASON MODAL                                  */}
      {/* ============================================================= */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-[36px] bg-[#FAF7F0] border-4 border-[#121316] shadow-pop-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-xl font-black text-[#121316]">
              Reject Request from {rejectingRequest.requesterName}
            </h3>
            <p className="text-xs font-bold text-gray-600">
              Provide an optional note explaining the reason (e.g. conflict, equipment unavailable).
            </p>

            <textarea
              rows={3}
              placeholder="e.g. The requested equipment is undergoing maintenance during this window."
              value={adminNoteInput}
              onChange={(e) => setAdminNoteInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#121316] text-xs font-bold resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 font-mono text-xs font-bold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionLoadingId === rejectingRequest.$id}
                className="px-5 py-2 rounded-xl bg-[#FF4757] text-white font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:bg-[#e0404f]"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLabPage;
