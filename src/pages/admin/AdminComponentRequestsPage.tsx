import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ExternalLink,
  ShieldCheck,
  User,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { componentRequestService } from '../../services/componentRequestService';
import { ComponentRequest, ComponentRequestStatus } from '../../types/componentRequest.types';
import { IconModule, ATCStatusBadge, ATCEmptyState, ScrewHead } from '../../components/visual';

export const AdminComponentRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ComponentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ComponentRequestStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await componentRequestService.getAllRequests();
      if (res.success && res.data) {
        setRequests(res.data.requests);
      } else {
        setError(res.error || 'Failed to retrieve component requests.');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while loading requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return requests.filter((req) => {
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchesSearch =
        !query ||
        req.componentName.toLowerCase().includes(query) ||
        req.studentName.toLowerCase().includes(query) ||
        req.studentEmail.toLowerCase().includes(query) ||
        req.reason.toLowerCase().includes(query) ||
        req.$id.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === 'pending').length,
      approved: requests.filter((r) => r.status === 'approved').length,
      collected: requests.filter((r) => r.status === 'collected').length,
      rejected: requests.filter((r) => r.status === 'rejected').length,
    };
  }, [requests]);

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
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center p-1.5 flex-shrink-0">
              <Package className="w-8 h-8 text-[#121316] stroke-[2.5]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                  ● HARDWARE LAB MANAGEMENT
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Component Requests
              </h1>
              <p className="text-xs sm:text-sm font-mono font-bold text-gray-600">
                Review, approve, and track student hardware requisitions for Lab 5.0.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Admin Dashboard</span>
            </Link>

            <Link
              to="/inventory"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
            >
              <span>Live Inventory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border-3 border-[#121316] shadow-pop transition-all text-left ${
              statusFilter === 'all' ? 'bg-[#FFE600] scale-102 ring-2 ring-[#121316]' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="font-mono text-[10px] font-black uppercase text-gray-500">Total Requests</span>
            <div className="text-2xl sm:text-3xl font-black text-[#121316] mt-1">{stats.total}</div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-2xl border-3 border-[#121316] shadow-pop transition-all text-left ${
              statusFilter === 'pending' ? 'bg-[#F0EBFF] scale-102 ring-2 ring-[#121316]' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">Pending Review</span>
            <div className="text-2xl sm:text-3xl font-black text-[#121316] mt-1">{stats.pending}</div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={`p-4 rounded-2xl border-3 border-[#121316] shadow-pop transition-all text-left ${
              statusFilter === 'approved' ? 'bg-[#D4F8E8] scale-102 ring-2 ring-[#121316]' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="font-mono text-[10px] font-black uppercase text-emerald-800">Approved / Ready</span>
            <div className="text-2xl sm:text-3xl font-black text-[#121316] mt-1">{stats.approved}</div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('collected')}
            className={`p-4 rounded-2xl border-3 border-[#121316] shadow-pop transition-all text-left ${
              statusFilter === 'collected' ? 'bg-[#E1DCFF] scale-102 ring-2 ring-[#121316]' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="font-mono text-[10px] font-black uppercase text-[#6C5CE7]">Collected</span>
            <div className="text-2xl sm:text-3xl font-black text-[#121316] mt-1">{stats.collected}</div>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`p-4 rounded-2xl border-3 border-[#121316] shadow-pop transition-all text-left col-span-2 sm:col-span-1 ${
              statusFilter === 'rejected' ? 'bg-[#FFE5E5] scale-102 ring-2 ring-[#121316]' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="font-mono text-[10px] font-black uppercase text-[#FF4757]">Rejected</span>
            <div className="text-2xl sm:text-3xl font-black text-[#121316] mt-1">{stats.rejected}</div>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, component, ID, email..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="font-mono text-xs font-black text-gray-500">
              Showing {filteredRequests.length} of {requests.length}
            </span>

            <button
              type="button"
              onClick={fetchRequests}
              className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] shadow-pop-xs transition-all cursor-pointer"
              title="Refresh requests"
            >
              <RotateCw className={`w-4 h-4 text-[#121316] ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Request Items List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border-3 border-gray-200 h-28" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] text-center space-y-4 max-w-lg mx-auto shadow-pop">
            <AlertTriangle className="w-10 h-10 text-[#FF4757] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-black text-lg text-[#121316]">FAILED TO LOAD REQUESTS</h3>
              <p className="text-xs font-bold text-gray-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchRequests}
              className="px-5 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm hover:shadow-pop transition-all"
            >
              Try Again
            </button>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isCollected = req.status === 'collected';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.$id}
                  className={`p-5 sm:p-6 rounded-[28px] border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative group select-none ${
                    isPending
                      ? 'bg-white'
                      : isApproved
                      ? 'bg-[#E8F5E9]/50'
                      : isCollected
                      ? 'bg-[#F0EBFF]/40'
                      : 'bg-[#FFE5E5]/40'
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      <IconModule
                        icon={<Package className="w-6 h-6 stroke-[2.5]" />}
                        size="md"
                        variant={isApproved ? 'green' : isCollected ? 'purple' : isRejected ? 'coral' : 'yellow'}
                      />
                    </div>

                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <ATCStatusBadge status={req.status} size="sm" />
                        <span className="font-mono text-[11px] font-bold text-gray-500">
                          ID: #{req.$id.slice(-6)}
                        </span>
                        <span className="font-mono text-[11px] text-gray-400">•</span>
                        <span className="font-mono text-[11px] font-bold text-gray-500">
                          {formatDate(req.$createdAt)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-[#121316] tracking-tight group-hover:text-[#6C5CE7] transition-colors truncate">
                          {req.componentName}
                        </h3>
                        <p className="text-xs font-bold text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                          {req.reason}
                        </p>
                      </div>

                      {/* Student info pill */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono font-bold text-gray-700">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          <span>{req.studentName}</span>
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{req.studentEmail}</span>
                        </span>
                      </div>

                      {/* Admin Note if present */}
                      {req.adminNotes && (
                        <div className="p-2.5 rounded-xl bg-white border border-[#121316]/20 text-xs text-[#121316] space-y-0.5 max-w-xl">
                          <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                            Admin Note:
                          </span>
                          <p className="font-bold">{req.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Quantity & Action Button */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#121316]/10 flex-shrink-0">
                    <div className="flex flex-col lg:items-end">
                      <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                        Requested Quantity
                      </span>
                      <span className="font-mono text-xl font-black text-[#121316]">
                        {req.requestedQuantity} {req.requestedQuantity === 1 ? 'UNIT' : 'UNITS'}
                      </span>
                    </div>

                    <Link
                      to={`/admin/component-requests/${req.$id}`}
                      className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5"
                    >
                      <span>Review Request</span>
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-lg mx-auto py-8">
            <ATCEmptyState
              type="storage"
              title="NO REQUESTS MATCH"
              description={
                statusFilter === 'all'
                  ? 'No component requests found in the database.'
                  : `No component requests found matching status "${statusFilter}".`
              }
              actionLabel="Clear Filter"
              onAction={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComponentRequestsPage;
