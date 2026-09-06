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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { componentRequestService } from '../../services/componentRequestService';
import { ComponentRequest } from '../../types/componentRequest.types';
import { IconModule, ATCStatusBadge, ScrewHead } from '../../components/visual';

export const StudentComponentRequestDetailsPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState<ComponentRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = async () => {
    if (!requestId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await componentRequestService.getRequestById(requestId);
      if (res.success && res.data) {
        // Security check: ensure student owns this request
        if (user?.$id && res.data.userId !== user.$id) {
          setError('You do not have permission to view this component request.');
          setRequest(null);
        } else {
          setRequest(res.data);
        }
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
  }, [requestId, user?.$id]);

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
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Top Header */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b-3 border-[#121316] bg-white overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#FFE600]/30 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <Link
            to="/student/component-requests"
            className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase text-gray-600 hover:text-[#121316] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to All Requests</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
                <Package className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>REQUEST DETAILS #{requestId?.slice(-6)}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
                {request ? request.componentName : 'Component Request'}
              </h1>
            </div>

            {request && (
              <div className="flex-shrink-0">
                <ATCStatusBadge status={request.status} size="lg" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
              <Link
                to="/student/component-requests"
                className="px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm"
              >
                Back to Requests
              </Link>
            </div>
          </div>
        ) : request ? (
          <div className="space-y-6">
            {/* Approved Status Callout */}
            {request.status === 'approved' && (
              <div className="p-6 rounded-[32px] bg-[#D4F8E8] border-4 border-[#121316] shadow-pop-lg space-y-3 relative overflow-hidden">
                <div className="tape-strip bg-[#FFE600]" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] flex items-center justify-center shadow-pop-xs flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-700 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[#121316]">
                      READY FOR LAB COLLECTION!
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 mt-0.5">
                      Your request has been approved by the ATC Lab team.
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border-2 border-[#121316] text-xs font-bold text-gray-800 space-y-1">
                  <p className="flex items-center gap-2 font-mono text-[11px] text-[#6C5CE7] font-black uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    Collection Location: ATC Robotics & IoT Lab 5.0, ADYPU Pune
                  </p>
                  <p>
                    Please visit the lab during open hours and present your student ID to the lab administrator on duty.
                  </p>
                </div>
              </div>
            )}

            {/* Main Details Card */}
            <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg space-y-6 relative">
              <div className="absolute top-4 right-4">
                <ScrewHead rotation={45} />
              </div>

              {/* Grid of Key Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    Component Name
                  </span>
                  <div className="text-lg font-black text-[#121316]">{request.componentName}</div>
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
                    Submitted Date & Time
                  </span>
                  <div className="text-xs font-mono font-bold text-gray-800">
                    {formatDate(request.$createdAt)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    Last Status Update
                  </span>
                  <div className="text-xs font-mono font-bold text-gray-800">
                    {formatDate(request.$updatedAt || request.$createdAt)}
                  </div>
                </div>
              </div>

              {/* Reason / Purpose Section */}
              <div className="p-5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-gray-700">
                  <FileText className="w-4 h-4 text-[#6C5CE7]" />
                  <span>Reason & Project Purpose</span>
                </div>
                <p className="text-sm font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {request.reason}
                </p>
              </div>

              {/* Admin Notes Section (if any) */}
              {request.adminNotes && (
                <div className="p-5 rounded-2xl bg-[#FFF9DB] border-2 border-[#121316] space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Lab Administrator Notes & Feedback</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {request.adminNotes}
                  </p>
                </div>
              )}

              {/* Applicant Info */}
              <div className="pt-4 border-t-2 border-[#121316]/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#6C5CE7]" />
                  <span>Applicant: <strong>{request.studentName}</strong> ({request.studentEmail})</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Appwrite Verified</span>
                </div>
              </div>
            </div>

            {/* Footer Navigation Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                to="/student/component-requests"
                className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
                <span>All Requests</span>
              </Link>

              <Link
                to="/inventory"
                className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-2"
              >
                <Package className="w-4 h-4 stroke-[2.5]" />
                <span>Browse More Components</span>
              </Link>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default StudentComponentRequestDetailsPage;
