import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Layers,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  FileText,
  User,
  Mail,
  MapPin,
  Sparkles,
  Info,
  ShieldCheck,
  XCircle,
  Check,
  Loader2,
  Save,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { componentRequestService } from '../../services/componentRequestService';
import { ComponentRequest, ComponentRequestStatus } from '../../types/componentRequest.types';
import { IconModule, ATCStatusBadge, ScrewHead } from '../../components/visual';

export const AdminComponentRequestDetailsPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState<ComponentRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Admin note state
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  const fetchRequest = async () => {
    if (!requestId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await componentRequestService.getRequestById(requestId);
      if (res.success && res.data) {
        setRequest(res.data);
        setAdminNotes(res.data.adminNotes || '');
      } else {
        setError(res.error || 'Component request not found.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const handleStatusUpdate = async (newStatus: ComponentRequestStatus) => {
    if (!requestId) return;

    setActionSuccessMessage(null);
    setActionErrorMessage(null);

    // Validate rejection note
    if (newStatus === 'rejected' && !adminNotes.trim()) {
      setActionErrorMessage('Please provide an admin note or reason when rejecting a request.');
      return;
    }

    setIsUpdating(true);

    try {
      const res = await componentRequestService.updateRequestStatus(
        requestId,
        newStatus,
        adminNotes.trim()
      );

      if (res.success && res.data) {
        setRequest(res.data);
        setActionSuccessMessage(`Request status updated to "${newStatus.toUpperCase()}".`);
      } else {
        setActionErrorMessage(res.error || 'Failed to update request status.');
      }
    } catch (err: any) {
      setActionErrorMessage(err?.message || 'An error occurred while updating status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotesOnly = async () => {
    if (!requestId || !request) return;

    setActionSuccessMessage(null);
    setActionErrorMessage(null);
    setIsUpdating(true);

    try {
      const res = await componentRequestService.updateRequestStatus(
        requestId,
        request.status,
        adminNotes.trim()
      );

      if (res.success && res.data) {
        setRequest(res.data);
        setActionSuccessMessage('Admin notes saved successfully.');
      } else {
        setActionErrorMessage(res.error || 'Failed to save admin notes.');
      }
    } catch (err: any) {
      setActionErrorMessage(err?.message || 'An error occurred while saving notes.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (isoString?: string) => {
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

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-4">
          <Link
            to="/admin/component-requests"
            className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-gray-600 hover:text-[#121316] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to All Component Requests</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                <Package className="w-3.5 h-3.5" />
                <span>HARDWARE REQUISITION #{requestId?.slice(-6)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                {request ? request.componentName : 'Component Request Review'}
              </h1>
            </div>

            {request && (
              <div className="flex-shrink-0">
                <ATCStatusBadge status={request.status} size="lg" />
              </div>
            )}
          </div>
        </div>

        {/* Feedback alerts */}
        {actionSuccessMessage && (
          <div className="p-4 rounded-2xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop-sm flex items-center gap-3 text-xs sm:text-sm font-black text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {actionErrorMessage && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] shadow-pop-sm flex items-center gap-3 text-xs sm:text-sm font-black text-[#FF4757]">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{actionErrorMessage}</span>
          </div>
        )}

        {/* Main Content Layout */}
        {loading ? (
          <div className="p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg animate-pulse space-y-6">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
        ) : error ? (
          <div className="p-8 rounded-[36px] bg-[#FFE5E5] border-4 border-[#FF4757] shadow-pop-lg text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-[#FF4757] mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#121316]">COULD NOT LOAD REQUEST</h2>
              <p className="text-xs font-bold text-gray-700">{error}</p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={fetchRequest}
                className="px-5 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : request ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Request Details (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 relative">
                <div className="absolute top-4 right-4">
                  <ScrewHead rotation={75} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[#121316] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#6C5CE7]" />
                    <span>Specification & Purpose</span>
                  </h3>

                  {/* Property Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                      <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                        Component Title
                      </span>
                      <div className="text-base font-black text-[#121316]">{request.componentName}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                      <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                        Requested Quantity
                      </span>
                      <div className="text-lg font-black text-[#121316]">
                        {request.requestedQuantity} {request.requestedQuantity === 1 ? 'unit' : 'units'}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                      <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                        Submission Timestamp
                      </span>
                      <div className="text-xs font-mono font-bold text-gray-800">
                        {formatDate(request.$createdAt)}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                      <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                        Storage / Location
                      </span>
                      <div className="text-xs font-mono font-bold text-gray-800">
                        {request.category || 'ATC Lab 5.0'}
                      </div>
                    </div>
                  </div>

                  {/* Student Reason */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-gray-700">
                      <FileText className="w-4 h-4 text-[#6C5CE7]" />
                      <span>Student Justification & Reason</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {request.reason}
                    </p>
                  </div>

                  {/* Student Profile Info */}
                  <div className="p-5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-3">
                    <span className="font-mono text-xs font-black uppercase text-gray-700 block">
                      Applicant Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono font-bold text-gray-800">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#6C5CE7]" />
                        <span>Name: {request.studentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#6C5CE7]" />
                        <span className="truncate">{request.studentEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Admin Moderation Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 relative">
                <div className="absolute top-4 right-4">
                  <ScrewHead rotation={120} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[#121316] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FFE600] fill-[#FFE600]" />
                    <span>Lab Review Actions</span>
                  </h3>

                  {/* Admin Note Box */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                      Admin Feedback / Notes for Student
                    </label>
                    <textarea
                      rows={4}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g., Approved! Please pick up from Bin #4 in Lab 5.0. Or reason for rejection..."
                      className="w-full p-3.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all resize-none shadow-pop-xs"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveNotesOnly}
                        disabled={isUpdating}
                        className="px-4 py-1.5 rounded-full bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-[11px] font-black uppercase text-[#121316] shadow-pop-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Note Only</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Transition Action Buttons */}
                  <div className="pt-4 border-t-2 border-[#121316]/10 space-y-3">
                    <span className="font-mono text-xs font-black uppercase text-gray-500 block">
                      Transition Status
                    </span>

                    {/* Button 1: Approve */}
                    <button
                      type="button"
                      disabled={isUpdating || request.status === 'approved'}
                      onClick={() => handleStatusUpdate('approved')}
                      className="w-full px-5 py-3 rounded-2xl bg-[#2ED573] hover:bg-[#26af5f] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Approve (Ready for Collection)</span>
                      </span>
                      {request.status === 'approved' && <span className="text-[10px]">CURRENT</span>}
                    </button>

                    {/* Button 2: Mark as Collected */}
                    <button
                      type="button"
                      disabled={isUpdating || request.status === 'collected'}
                      onClick={() => handleStatusUpdate('collected')}
                      className="w-full px-5 py-3 rounded-2xl bg-[#E1DCFF] hover:bg-[#6C5CE7] text-[#6C5CE7] hover:text-white font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Mark as Collected by Student</span>
                      </span>
                      {request.status === 'collected' && <span className="text-[10px]">CURRENT</span>}
                    </button>

                    {/* Button 3: Reject */}
                    <button
                      type="button"
                      disabled={isUpdating || request.status === 'rejected'}
                      onClick={() => handleStatusUpdate('rejected')}
                      className="w-full px-5 py-3 rounded-2xl bg-[#FFE5E5] hover:bg-[#FF4757] text-[#FF4757] hover:text-white font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-between cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>Reject Request</span>
                      </span>
                      {request.status === 'rejected' && <span className="text-[10px]">CURRENT</span>}
                    </button>

                    {/* Button 4: Reset to Pending */}
                    {request.status !== 'pending' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate('pending')}
                        className="w-full px-5 py-2.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-700 font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Reset to Pending Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminComponentRequestDetailsPage;
