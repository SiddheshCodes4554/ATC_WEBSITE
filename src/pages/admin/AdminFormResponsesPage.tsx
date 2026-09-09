import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  RotateCw,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  X,
  Mail,
  User,
  Clock,
  Filter,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { customFormService } from '../../services/customFormService';
import { CustomForm, CustomFormResponse, FormFieldDefinition } from '../../types/customForm.types';
import { ATCStatusBadge, ATCEmptyState, ScrewHead } from '../../components/visual';
import { ResponseDetailModal } from '../../components/forms/responses/ResponseDetailModal';

type RespondentFilter = 'all' | 'with-email' | 'anonymous';

export const AdminFormResponsesPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  // Data State
  const [form, setForm] = useState<CustomForm | null>(null);
  const [responses, setResponses] = useState<CustomFormResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<RespondentFilter>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // Modals & Actions
  const [selectedResponse, setSelectedResponse] = useState<CustomFormResponse | null>(null);
  const [selectedResponseIndex, setSelectedResponseIndex] = useState<number | undefined>(undefined);
  const [responseToDelete, setResponseToDelete] = useState<CustomFormResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load Form & Responses Data
  const loadData = async (showRefreshIndicator = false) => {
    if (!formId?.trim()) {
      setError('Form ID is missing.');
      setLoading(false);
      return;
    }

    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // 1. Fetch Form definition
      const formRes = await customFormService.getForm(formId.trim());
      if (!formRes.success || !formRes.data) {
        setError(formRes.error || 'Form could not be found.');
        setLoading(false);
        setIsRefreshing(false);
        return;
      }
      setForm(formRes.data);

      // 2. Fetch Form responses (newest first)
      const responsesRes = await customFormService.getFormResponses(formId.trim(), {
        limit: 500,
      });

      if (responsesRes.success && responsesRes.data) {
        setResponses(responsesRes.data);
      } else {
        setResponses([]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load form responses.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [formId]);

  // Set document title
  useEffect(() => {
    if (form?.title) {
      document.title = `${form.title} Responses — ATC Admin`;
    } else {
      document.title = 'Form Responses — ATC Admin';
    }
    return () => {
      document.title = 'ATC Robotics Lab';
    };
  }, [form]);

  // Format Date Helper
  const formatDate = (isoDate?: string) => {
    if (!isoDate) return '—';
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return isoDate;
    }
  };

  // Determine Primary Dynamic Columns (up to 4 representative fields)
  const displayFields: FormFieldDefinition[] = useMemo(() => {
    if (!form?.fields) return [];
    // Filter out purely layout elements if any, pick first 4
    return form.fields.slice(0, 4);
  }, [form]);

  // Filtered Responses
  const filteredResponses = useMemo(() => {
    let result = [...responses];

    // Respondent Type Filter
    if (filterType === 'with-email') {
      result = result.filter((r) => Boolean(r.respondentEmail));
    } else if (filterType === 'anonymous') {
      result = result.filter((r) => !r.respondentEmail && !r.userId);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((r) => {
        // Match respondent email
        if (r.respondentEmail && r.respondentEmail.toLowerCase().includes(q)) {
          return true;
        }
        // Match user ID
        if (r.userId && r.userId.toLowerCase().includes(q)) {
          return true;
        }
        // Match any text in answers
        if (r.answers && typeof r.answers === 'object') {
          return Object.values(r.answers).some((val) => {
            if (val === null || val === undefined) return false;
            if (Array.isArray(val)) {
              return val.some((v) => String(v).toLowerCase().includes(q));
            }
            return String(val).toLowerCase().includes(q);
          });
        }
        return false;
      });
    }

    return result;
  }, [responses, filterType, searchQuery]);

  // Pagination Calculation
  const totalPages = Math.max(1, Math.ceil(filteredResponses.length / pageSize));
  const paginatedResponses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredResponses.slice(startIndex, startIndex + pageSize);
  }, [filteredResponses, currentPage, pageSize]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  // Delete Response Handler
  const confirmDeleteResponse = async () => {
    if (!responseToDelete) return;

    setIsDeleting(true);
    try {
      const res = await customFormService.deleteFormResponse(responseToDelete.id);
      if (res.success) {
        // Update local responses
        setResponses((prev) => prev.filter((r) => r.id !== responseToDelete.id));
        // Update form response count locally
        if (form) {
          setForm({
            ...form,
            responseCount: Math.max(0, (form.responseCount || 1) - 1),
          });
        }

        // Close detail modal if currently open with this response
        if (selectedResponse?.id === responseToDelete.id) {
          setSelectedResponse(null);
        }

        setResponseToDelete(null);
        setToastMessage({ type: 'success', text: 'Response deleted successfully.' });
      } else {
        setToastMessage({ type: 'error', text: res.error || 'Failed to delete response.' });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err?.message || 'Error occurred while deleting.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to format table answer cells
  const formatTableCell = (field: FormFieldDefinition, rawValue: unknown): string => {
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return '—';
    }
    if (Array.isArray(rawValue)) {
      return rawValue.join(', ');
    }
    const str = String(rawValue);
    if (str.length > 35) {
      return `${str.slice(0, 32)}...`;
    }
    return str;
  };

  // Summary Metrics
  const identifiedCount = useMemo(() => {
    return responses.filter((r) => Boolean(r.respondentEmail || r.userId)).length;
  }, [responses]);

  const anonymousCount = useMemo(() => {
    return responses.filter((r) => !r.respondentEmail && !r.userId).length;
  }, [responses]);

  const latestSubmission = useMemo(() => {
    if (responses.length === 0) return 'None yet';
    return formatDate(responses[0].submittedAt || responses[0].createdAt);
  }, [responses]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl border-3 border-[#121316] shadow-pop-lg flex items-center justify-between gap-3 max-w-md animate-slideDown ${
              toastMessage.type === 'success'
                ? 'bg-[#E8F8F0] text-emerald-950'
                : 'bg-[#FFE5E5] text-[#FF4757]'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black font-mono">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
              ) : (
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Master Navigation & Form Header Card */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-5 relative">
          <ScrewHead className="absolute top-4 left-4 w-3.5 h-3.5" rotation={45} />
          <ScrewHead className="absolute top-4 right-4 w-3.5 h-3.5" rotation={135} />

          {/* Top Breadcrumb & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Link
              to="/admin/forms"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-gray-200 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Back to Forms</span>
            </Link>

            {form && (
              <div className="flex items-center gap-2">
                <ATCStatusBadge status={form.status} size="sm" />
                <span className="px-3 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-xs font-black">
                  {responses.length} {responses.length === 1 ? 'RESPONSE' : 'TOTAL RESPONSES'}
                </span>
              </div>
            )}
          </div>

          {/* Form Title & Action Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFE600] text-[#121316] border border-[#121316] font-mono text-[10px] font-black uppercase">
                <Inbox className="w-3 h-3" />
                <span>FORM RESPONSES CONSOLE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#121316] tracking-tight">
                {form ? form.title : 'Loading Form Responses...'}
              </h1>
            </div>

            {form && (
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Open Live Form */}
                {form.status !== 'draft' && (
                  <Link
                    to={`/forms/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1.5"
                  >
                    <span>Open Form</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  </Link>
                )}

                {/* Edit Form */}
                <Link
                  to={`/admin/forms/${form.id}/edit`}
                  className="px-4 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE600] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Form</span>
                </Link>

                {/* Refresh Data Button */}
                <button
                  type="button"
                  onClick={() => loadData(true)}
                  disabled={isRefreshing}
                  className="px-4 py-2.5 rounded-2xl bg-[#E1DCFF] hover:bg-[#D4CEFF] text-[#6C5CE7] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Refresh response data"
                >
                  <RotateCw className={`w-3.5 h-3.5 stroke-[2.5] ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-gray-500 block">
              TOTAL RESPONSES
            </span>
            <div className="text-3xl font-black text-[#121316]">{responses.length}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-emerald-800 block">
              IDENTIFIED RESPONDENTS
            </span>
            <div className="text-3xl font-black text-emerald-950">{identifiedCount}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-amber-800 block">
              ANONYMOUS
            </span>
            <div className="text-3xl font-black text-amber-950">{anonymousCount}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-[#6C5CE7] block">
              LATEST SUBMISSION
            </span>
            <div className="text-xs sm:text-sm font-black text-[#121316] truncate font-mono pt-1.5">
              {latestSubmission}
            </div>
          </div>
        </div>

        {/* Search, Filter & Controls Bar */}
        <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input (7 Cols) */}
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search responses by email, name, or answer keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>

            {/* Filter Buttons (5 Cols) */}
            <div className="md:col-span-5 flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-2xl border-2 border-[#121316] overflow-x-auto scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All Responses' },
                  { id: 'with-email', label: 'With Email' },
                  { id: 'anonymous', label: 'Anonymous' },
                ] as const
              ).map((flt) => (
                <button
                  key={flt.id}
                  type="button"
                  onClick={() => setFilterType(flt.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-black uppercase transition-all whitespace-nowrap cursor-pointer flex-1 text-center ${
                    filterType === flt.id
                      ? 'bg-[#121316] text-white shadow-pop-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {flt.label}
                </button>
              ))}
            </div>

          </div>

          {/* Sub-bar Status */}
          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500 pt-1">
            <span>
              Showing {filteredResponses.length} of {responses.length} responses
            </span>
            {(searchQuery || filterType !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 rounded-[36px] bg-white border-4 border-gray-200 shadow-pop space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-2xl w-1/3" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-2xl border-2 border-gray-200" />
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-8 sm:p-10 rounded-[36px] bg-[#FFE5E5] border-4 border-[#FF4757] text-center space-y-4 max-w-lg mx-auto shadow-pop">
            <AlertTriangle className="w-12 h-12 text-[#FF4757] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-black text-xl text-[#121316]">RESPONSES UNAVAILABLE</h3>
              <p className="text-xs sm:text-sm font-bold text-gray-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => loadData()}
              className="px-6 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop hover:shadow-pop-md transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : responses.length === 0 ? (
          /* Empty Responses State */
          <div className="p-12 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
              <Inbox className="w-8 h-8 text-[#121316]" />
            </div>
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full bg-[#FFF9DB] text-amber-800 border border-[#121316] font-mono text-[11px] font-black uppercase">
                ZERO SUBMISSIONS
              </span>
              <h2 className="text-2xl font-black text-[#121316]">No Responses Yet</h2>
              <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-md mx-auto">
                Responses will appear here automatically once visitors fill out and submit your form.
              </p>
            </div>
            {form?.status !== 'draft' && (
              <div className="pt-2">
                <Link
                  to={`/forms/${form?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop transition-all cursor-pointer"
                >
                  <span>Open Public Form</span>
                  <ExternalLink className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>
            )}
          </div>
        ) : filteredResponses.length === 0 ? (
          /* Search Empty State */
          <div className="p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop text-center space-y-4">
            <Search className="w-10 h-10 text-gray-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-black text-lg text-[#121316]">No Matching Responses</h3>
              <p className="text-xs font-bold text-gray-600">
                No submissions matched "{searchQuery}". Try a different keyword.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="px-5 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs transition-all cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Main Tabular View Container */
          <div className="space-y-4">
            
            {/* Desktop Dynamic Table View (Hidden on mobile) */}
            <div className="hidden sm:block rounded-[32px] bg-white border-4 border-[#121316] shadow-pop-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-3 border-[#121316] bg-[#FAF7F0] font-mono text-[11px] font-black uppercase text-gray-700">
                      <th className="py-4 px-4 w-14 text-center">#</th>
                      <th className="py-4 px-4 min-w-[180px]">RESPONDENT</th>
                      
                      {/* Dynamic Form Question Columns */}
                      {displayFields.map((field) => (
                        <th key={field.id} className="py-4 px-4 min-w-[160px] max-w-[220px]">
                          <span className="line-clamp-1" title={field.label}>
                            {field.label}
                          </span>
                        </th>
                      ))}

                      <th className="py-4 px-4 min-w-[150px]">SUBMITTED</th>
                      <th className="py-4 px-4 w-28 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y-2 divide-gray-100 font-sans text-xs sm:text-sm">
                    {paginatedResponses.map((resp, idx) => {
                      const absoluteIndex = (currentPage - 1) * pageSize + idx + 1;
                      return (
                        <tr
                          key={resp.id}
                          onClick={() => {
                            setSelectedResponse(resp);
                            setSelectedResponseIndex(absoluteIndex);
                          }}
                          className="hover:bg-[#FFFDF5] transition-colors cursor-pointer group"
                        >
                          {/* 1. Sequence Number */}
                          <td className="py-3.5 px-4 font-mono font-black text-gray-400 text-center text-xs">
                            {String(absoluteIndex).padStart(2, '0')}
                          </td>

                          {/* 2. Respondent Identity */}
                          <td className="py-3.5 px-4">
                            {resp.respondentEmail ? (
                              <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#121316]">
                                <Mail className="w-3.5 h-3.5 text-[#6C5CE7] flex-shrink-0" />
                                <span className="truncate max-w-[160px]">{resp.respondentEmail}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-gray-500">
                                <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <span>Anonymous</span>
                              </div>
                            )}
                          </td>

                          {/* 3. Dynamic Field Answers */}
                          {displayFields.map((field) => (
                            <td
                              key={field.id}
                              className="py-3.5 px-4 font-bold text-gray-800 max-w-[220px] truncate"
                              title={String(resp.answers?.[field.id] || '')}
                            >
                              {formatTableCell(field, resp.answers?.[field.id])}
                            </td>
                          ))}

                          {/* 4. Submission Date */}
                          <td className="py-3.5 px-4 font-mono text-xs font-bold text-gray-600 whitespace-nowrap">
                            {formatDate(resp.submittedAt || resp.createdAt)}
                          </td>

                          {/* 5. Action Buttons */}
                          <td
                            className="py-3.5 px-4 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedResponse(resp);
                                  setSelectedResponseIndex(absoluteIndex);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#E1DCFF] hover:bg-[#D4CEFF] text-[#6C5CE7] font-mono text-xs font-black uppercase border border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1 cursor-pointer"
                                title="Inspect full response"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setResponseToDelete(resp)}
                                className="p-1.5 rounded-xl bg-[#FFE5E5] hover:bg-[#FFD2D2] text-[#FF4757] border border-[#121316] shadow-pop-xs transition-all cursor-pointer"
                                title="Delete response"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Responsive Cards View (Visible on mobile screens) */}
            <div className="sm:hidden space-y-3.5">
              {paginatedResponses.map((resp, idx) => {
                const absoluteIndex = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <div
                    key={resp.id}
                    onClick={() => {
                      setSelectedResponse(resp);
                      setSelectedResponseIndex(absoluteIndex);
                    }}
                    className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-3.5 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2.5">
                      <span className="font-mono text-xs font-black text-[#6C5CE7]">
                        RESPONSE #{String(absoluteIndex).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-gray-500">
                        {formatDate(resp.submittedAt || resp.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="font-mono text-xs font-black text-[#121316]">
                        {resp.respondentEmail || 'Anonymous Respondent'}
                      </div>

                      {/* Display primary answer snippet */}
                      {displayFields.slice(0, 2).map((field) => (
                        <div key={field.id} className="text-xs">
                          <span className="font-mono text-gray-500 text-[10px] font-bold uppercase mr-1.5">
                            {field.label}:
                          </span>
                          <span className="font-bold text-gray-800">
                            {formatTableCell(field, resp.answers?.[field.id])}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t-2 border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedResponse(resp);
                          setSelectedResponseIndex(absoluteIndex);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-[#E1DCFF] text-[#6C5CE7] font-mono text-xs font-black uppercase border border-[#121316] shadow-pop-xs flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Answers</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResponseToDelete(resp);
                        }}
                        className="p-1.5 rounded-xl bg-[#FFE5E5] text-[#FF4757] border border-[#121316] shadow-pop-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[3]" />
                  <span>Previous</span>
                </button>

                <div className="font-mono text-xs font-black text-[#121316]">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Response Detail Inspector Modal */}
      <ResponseDetailModal
        isOpen={Boolean(selectedResponse)}
        onClose={() => setSelectedResponse(null)}
        response={selectedResponse}
        form={form}
        responseIndex={selectedResponseIndex}
        onDeleteRequest={(resp) => {
          setResponseToDelete(resp);
        }}
      />

      {/* Delete Response Confirmation Modal */}
      {responseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
          <div
            className="bg-white w-full max-w-md rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 space-y-5 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop mx-auto flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-[#FF4757] stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-0.5 rounded-full bg-[#FFE5E5] text-[#FF4757] border border-[#121316] font-mono text-[11px] font-black uppercase">
                DANGER ACTION
              </span>
              <h3 className="text-2xl font-black text-[#121316]">
                Delete Response?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
                This response submission will be permanently removed from Appwrite. This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setResponseToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] hover:bg-gray-200 text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-xs hover:shadow-pop transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteResponse}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl bg-[#FF4757] hover:bg-[#E04050] text-white font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFormResponsesPage;
