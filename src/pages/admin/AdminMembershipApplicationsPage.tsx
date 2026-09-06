import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { MembershipApplicationService } from '../../services/membershipApplicationService';
import {
  MembershipApplication,
  MembershipApplicationStatus,
  MembershipApplicationStats,
} from '../../types/membershipApplication.types';
import { ATCStatusBadge, ATCEmptyState } from '../../components/visual';

export const AdminMembershipApplicationsPage: React.FC = () => {
  const navigate = useNavigate();

  // Data State
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState<MembershipApplicationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Load applications
  const loadApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await MembershipApplicationService.getApplications({
        status: statusFilter,
        searchQuery,
        sortBy,
      });

      if (res.success && res.data) {
        setApplications(res.data.applications);
      } else {
        setError(res.error || 'Failed to load membership applications.');
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err?.message || 'A network error occurred while fetching applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter, sortBy]);

  // Compute live stats from real data
  const stats: MembershipApplicationStats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    underReview: applications.filter((a) => a.status === 'under_review').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  // Filtered applications by local search (if search submitted)
  const filteredApplications = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      app.name.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.section.toLowerCase().includes(q) ||
      (app.skills && app.skills.toLowerCase().includes(q))
    );
  });

  const formatDate = (isoString?: string) => {
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
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ============================================================= */}
        {/* 1. TOP HEADER & BREADCRUMBS                                   */}
        {/* ============================================================= */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center p-2 flex-shrink-0">
              <Users className="w-8 h-8 text-[#121316]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                  ● RECRUITMENT MODERATION
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight uppercase">
                MEMBERSHIP APPLICATIONS
              </h1>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Review student membership submissions, academic details, and manage onboarding status.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadApplications}
              disabled={loading}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <Link
              to="/admin/dashboard"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
            >
              <span>Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 2. SUMMARY METRICS CARDS                                      */}
        {/* ============================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total */}
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-gray-500">
              TOTAL
            </span>
            <div className="text-3xl font-black text-[#121316]">
              {loading ? '...' : stats.total}
            </div>
            <p className="text-[11px] font-bold text-gray-600">All submissions</p>
          </div>

          {/* Pending */}
          <div className="p-5 rounded-3xl bg-[#F0EBFF] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-[#6C5CE7]">
              PENDING
            </span>
            <div className="text-3xl font-black text-[#6C5CE7]">
              {loading ? '...' : stats.pending}
            </div>
            <p className="text-[11px] font-bold text-gray-600">Awaiting initial check</p>
          </div>

          {/* Under Review */}
          <div className="p-5 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-amber-700">
              UNDER REVIEW
            </span>
            <div className="text-3xl font-black text-amber-700">
              {loading ? '...' : stats.underReview}
            </div>
            <p className="text-[11px] font-bold text-gray-600">Being evaluated</p>
          </div>

          {/* Approved */}
          <div className="p-5 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-emerald-700">
              APPROVED
            </span>
            <div className="text-3xl font-black text-emerald-700">
              {loading ? '...' : stats.approved}
            </div>
            <p className="text-[11px] font-bold text-gray-600">Accepted members</p>
          </div>

          {/* Rejected */}
          <div className="p-5 rounded-3xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop space-y-1 col-span-2 sm:col-span-1">
            <span className="font-mono text-[11px] font-black uppercase text-[#FF4757]">
              REJECTED
            </span>
            <div className="text-3xl font-black text-[#FF4757]">
              {loading ? '...' : stats.rejected}
            </div>
            <p className="text-[11px] font-bold text-gray-600">Not accepted</p>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 3. SEARCH, FILTERS & SORT CONTROLS                            */}
        {/* ============================================================= */}
        <div className="p-6 rounded-[32px] bg-white border-3 border-[#121316] shadow-pop space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Email, Section, or Skills..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-xs text-xs sm:text-sm font-bold text-[#121316] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-black uppercase text-gray-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-black uppercase text-gray-500 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 4. APPLICATIONS TABLE / LIST                                  */}
        {/* ============================================================= */}
        {loading ? (
          <div className="p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
            <div>
              <h3 className="font-black text-lg text-[#121316]">Loading Applications...</h3>
              <p className="font-mono text-xs text-gray-500 mt-0.5">Fetching from Appwrite Database</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 rounded-[36px] bg-[#FFE5E5] border-4 border-[#FF4757] shadow-pop text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#FF4757] mx-auto" />
            <h3 className="font-black text-lg text-[#121316]">Failed to Load Applications</h3>
            <p className="text-xs sm:text-sm font-bold text-gray-700">{error}</p>
            <button
              onClick={loadApplications}
              className="px-5 py-2 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="max-w-lg mx-auto">
            <ATCEmptyState
              type="robot"
              title="NO MEMBERSHIP APPLICATIONS"
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'No applications match your current filters. Try changing your search query or status filter.'
                  : 'Submitted applications from students will show up here automatically.'
              }
              actionLabel={searchQuery || statusFilter !== 'all' ? 'Clear Filters' : undefined}
              onAction={
                searchQuery || statusFilter !== 'all'
                  ? () => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b-3 border-[#121316] font-mono text-xs font-black uppercase text-[#121316]">
                    <th className="py-4 px-6">Applicant</th>
                    <th className="py-4 px-4">Academic</th>
                    <th className="py-4 px-4">Skills & Availability</th>
                    <th className="py-4 px-4 text-center">Status</th>
                    <th className="py-4 px-4 text-right">Submitted</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100 text-sm">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.$id}
                      onClick={() => navigate(`/admin/membership-applications/${app.$id}`)}
                      className="hover:bg-[#FFF9DB]/40 transition-colors cursor-pointer group"
                    >
                      {/* Applicant Name & Email */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <div className="font-black text-[#121316] group-hover:text-[#6C5CE7] transition-colors flex items-center gap-1.5">
                            <span>{app.name}</span>
                          </div>
                          <div className="font-mono text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{app.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Academic Year & Section */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#121316] block">{app.year}</span>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] font-mono text-[10px] font-black border border-[#121316]/20">
                            Section {app.section}
                          </span>
                        </div>
                      </td>

                      {/* Skills & Availability */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-gray-800 truncate" title={app.skills || 'No skills listed'}>
                            {app.skills || <span className="text-gray-400 italic">No skills listed</span>}
                          </div>
                          <div className="font-mono text-[11px] text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#FF793F]" />
                            <span>{app.availability}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <ATCStatusBadge status={app.status} size="sm" />
                      </td>

                      {/* Submitted Date */}
                      <td className="py-4 px-4 text-right font-mono text-xs text-gray-500">
                        {formatDate(app.$createdAt)}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white group-hover:bg-[#FFE600] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs transition-all">
                          <span>View</span>
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards */}
            <div className="lg:hidden space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.$id}
                  onClick={() => navigate(`/admin/membership-applications/${app.$id}`)}
                  className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all space-y-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="font-black text-base text-[#121316]">
                        {app.name}
                      </h4>
                      <p className="font-mono text-xs text-gray-500">{app.email}</p>
                    </div>
                    <ATCStatusBadge status={app.status} size="sm" />
                  </div>

                  <div className="p-3 bg-[#FAF7F0] rounded-2xl border-2 border-[#121316]/15 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Academic:</span>
                      <span className="font-black text-[#121316]">{app.year} • {app.section}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Availability:</span>
                      <span className="font-bold text-[#121316]">{app.availability}</span>
                    </div>
                    {app.skills && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Skills:</span>
                        <span className="font-bold text-[#121316] truncate max-w-[180px]">{app.skills}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t-2 border-gray-100 text-xs font-mono text-gray-500">
                    <span>Submitted {formatDate(app.$createdAt)}</span>
                    <span className="font-black text-[#6C5CE7] flex items-center gap-1">
                      <span>Review Details</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMembershipApplicationsPage;
