import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  Layers,
  ExternalLink,
  Code,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { MembershipApplicationService } from '../../services/membershipApplicationService';
import {
  MembershipApplication,
  MembershipApplicationStatus,
} from '../../types/membershipApplication.types';
import { ATCStatusBadge } from '../../components/visual';

export const AdminMembershipApplicationDetailsPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  // Data State
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Action State
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Confirmation Dialog State
  const [pendingAction, setPendingAction] = useState<MembershipApplicationStatus | null>(null);

  const fetchApplication = async () => {
    if (!applicationId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await MembershipApplicationService.getApplicationById(applicationId);
      if (res.success && res.data) {
        setApplication(res.data);
      } else {
        setError(res.error || 'Application not found.');
      }
    } catch (err: any) {
      console.error('Error fetching application details:', err);
      setError(err?.message || 'Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const handleStatusChange = async (newStatus: MembershipApplicationStatus) => {
    if (!applicationId) return;

    setUpdatingStatus(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await MembershipApplicationService.updateApplicationStatus(applicationId, newStatus);
      if (res.success && res.data) {
        setApplication(res.data);
        setActionSuccess(`Application status updated to "${newStatus.replace('_', ' ').toUpperCase()}".`);
      } else {
        setActionError(res.error || 'Failed to update status.');
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      setActionError(err?.message || 'An error occurred while updating status.');
    } finally {
      setUpdatingStatus(false);
      setPendingAction(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-4 paper-pattern">
        <div className="p-8 rounded-3xl bg-white border-4 border-[#121316] shadow-pop flex flex-col items-center gap-4 text-center max-w-sm">
          <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
          <h3 className="font-black text-lg text-[#121316]">Loading Application Details...</h3>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-4 paper-pattern">
        <div className="p-8 rounded-3xl bg-[#FFE5E5] border-4 border-[#FF4757] shadow-pop text-center space-y-4 max-w-md">
          <AlertCircle className="w-10 h-10 text-[#FF4757] mx-auto" />
          <h3 className="font-black text-xl text-[#121316]">Application Not Found</h3>
          <p className="text-xs sm:text-sm font-bold text-gray-700">{error || 'This application does not exist or was deleted.'}</p>
          <Link
            to="/admin/membership-applications"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Applications</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ============================================================= */}
        {/* 1. TOP HEADER & BACK NAVIGATION                               */}
        {/* ============================================================= */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/admin/membership-applications"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-gray-600 hover:text-[#121316] hover:underline mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO ALL APPLICATIONS</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight uppercase">
              {application.name}
            </h1>
            <p className="font-mono text-xs text-gray-500">
              Submitted on {formatDate(application.$createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ATCStatusBadge status={application.status} size="lg" />
          </div>
        </div>

        {/* Feedback alerts */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-[#D4F8E8] border-3 border-emerald-600 text-emerald-900 font-mono text-xs font-black flex items-center gap-2 animate-fadeIn shadow-pop-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-3 border-[#FF4757] text-[#FF4757] font-mono text-xs font-black flex items-center gap-2 animate-fadeIn shadow-pop-xs">
            <AlertCircle className="w-4 h-4 text-[#FF4757] flex-shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* ============================================================= */}
        {/* 2. APPLICANT DETAILS CARD                                     */}
        {/* ============================================================= */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-8">
          
          {/* SECTION: APPLICANT INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-3 border-[#121316]">
              <User className="w-5 h-5 text-[#6C5CE7]" />
              <h3 className="font-black text-lg text-[#121316] uppercase tracking-tight">
                APPLICANT INFORMATION
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Full Name
                </span>
                <div className="text-base font-black text-[#121316]">
                  {application.name}
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Email Address
                </span>
                <div className="text-sm font-mono font-bold text-[#6C5CE7] break-all">
                  <a href={`mailto:${application.email}`} className="hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{application.email}</span>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Phone Number
                </span>
                <div className="text-sm font-mono font-bold text-[#121316]">
                  <a href={`tel:${application.phone}`} className="hover:underline flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span>{application.phone}</span>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Academic Details
                </span>
                <div className="text-sm font-bold text-[#121316] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#FF793F]" />
                  <span>{application.year} • Section {application.section}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: WORK & EXPERIENCE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-3 border-[#121316]">
              <Code className="w-5 h-5 text-[#2ED573]" />
              <h3 className="font-black text-lg text-[#121316] uppercase tracking-tight">
                WORK & EXPERIENCE
              </h3>
            </div>

            <div className="space-y-4">
              {/* Resume Link */}
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Resume / Portfolio / Work Link
                </span>
                <div>
                  {application.resumeLink ? (
                    <a
                      href={application.resumeLink.startsWith('http') ? application.resumeLink : `https://${application.resumeLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#6C5CE7] hover:bg-[#E1DCFF] shadow-pop-xs transition-all"
                    >
                      <span>Open Link ↗</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-gray-500 italic">No link provided</span>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Skills & Interests
                </span>
                <div className="text-sm font-bold text-[#121316]">
                  {application.skills || <span className="text-gray-400 italic">None specified</span>}
                </div>
              </div>

              {/* Previous Experience */}
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
                <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                  Previous Projects & Experience
                </span>
                <div className="text-sm font-bold text-[#121316] whitespace-pre-wrap leading-relaxed">
                  {application.experience || <span className="text-gray-400 italic">No previous experience notes provided</span>}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: AVAILABILITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-3 border-[#121316]">
              <Clock className="w-5 h-5 text-[#FF793F]" />
              <h3 className="font-black text-lg text-[#121316] uppercase tracking-tight">
                WEEKLY AVAILABILITY
              </h3>
            </div>

            <div className="p-4 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/20 space-y-1">
              <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                Hours available per week
              </span>
              <div className="text-base font-black text-[#121316]">
                {application.availability}
              </div>
            </div>
          </div>

          {/* SECTION: ADMIN ACTIONS */}
          <div className="pt-6 border-t-3 border-[#121316] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase text-[#121316]">
                MODERATION ACTIONS
              </span>
              <span className="font-mono text-[11px] text-gray-500">
                Current Status: <strong className="text-[#121316] uppercase">{application.status.replace('_', ' ')}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Mark Under Review */}
              <button
                type="button"
                disabled={updatingStatus || application.status === 'under_review'}
                onClick={() => handleStatusChange('under_review')}
                className="px-5 py-2.5 rounded-full bg-[#FFF9DB] hover:bg-[#FFF3B0] disabled:opacity-50 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {updatingStatus ? 'Updating...' : 'MARK UNDER REVIEW'}
              </button>

              {/* Approve Button */}
              <button
                type="button"
                disabled={updatingStatus || application.status === 'approved'}
                onClick={() => setPendingAction('approved')}
                className="px-6 py-2.5 rounded-full bg-[#2ED573] hover:bg-[#26af5f] disabled:opacity-50 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                APPROVE APPLICATION
              </button>

              {/* Reject Button */}
              <button
                type="button"
                disabled={updatingStatus || application.status === 'rejected'}
                onClick={() => setPendingAction('rejected')}
                className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#FF3838] disabled:opacity-50 text-white font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                REJECT APPLICATION
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 3. CONFIRMATION DIALOG MODAL                                  */}
        {/* ============================================================= */}
        {pendingAction && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setPendingAction(null)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl border-2 border-[#121316] shadow-pop-sm flex items-center justify-center ${
                    pendingAction === 'approved' ? 'bg-[#D4F8E8]' : 'bg-[#FFE5E5]'
                  }`}
                >
                  <AlertTriangle
                    className={`w-6 h-6 ${
                      pendingAction === 'approved' ? 'text-emerald-700' : 'text-[#FF4757]'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#121316]">
                    Confirm {pendingAction === 'approved' ? 'Approval' : 'Rejection'}
                  </h3>
                  <p className="font-mono text-xs text-gray-500">
                    Applicant: {application.name}
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold text-gray-700 leading-relaxed">
                {pendingAction === 'approved'
                  ? `Are you sure you want to approve ${application.name} as a community member? This will update their membership status to APPROVED.`
                  : `Are you sure you want to reject this application? This will update their membership status to REJECTED.`}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] shadow-pop-xs hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => handleStatusChange(pendingAction)}
                  className={`px-6 py-2 rounded-full border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop hover:shadow-pop-lg flex items-center gap-2 cursor-pointer ${
                    pendingAction === 'approved'
                      ? 'bg-[#2ED573] hover:bg-[#26af5f] text-[#121316]'
                      : 'bg-[#FF4757] hover:bg-[#FF3838] text-white'
                  }`}
                >
                  {updatingStatus && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm {pendingAction === 'approved' ? 'Approve' : 'Reject'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMembershipApplicationDetailsPage;
