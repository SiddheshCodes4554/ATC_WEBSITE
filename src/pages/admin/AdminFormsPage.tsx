import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  RotateCw,
  ArrowLeft,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Inbox,
  AlertTriangle,
  X,
  Clock,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
} from 'lucide-react';
import { customFormService } from '../../services/customFormService';
import { CustomForm, FormStatus } from '../../types/customForm.types';
import { IconModule, ATCStatusBadge, ATCEmptyState, ScrewHead } from '../../components/visual';

type SortOption = 'updated-desc' | 'created-desc' | 'created-asc' | 'responses-desc' | 'title-asc';

export const AdminFormsPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [forms, setForms] = useState<CustomForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter & Sort
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<FormStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated-desc');

  // Notifications / Feedback Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Modals
  const [formToClose, setFormToClose] = useState<CustomForm | null>(null);
  const [formToDelete, setFormToDelete] = useState<CustomForm | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Load Forms
  const loadForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await customFormService.listForms();
      if (res.success && res.data) {
        setForms(res.data);
      } else {
        setError(res.error || 'Unable to load forms right now.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  // Filtered & Sorted Forms
  const filteredForms = useMemo(() => {
    let result = [...forms];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((f) => f.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.slug.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'updated-desc': {
          const dateA = new Date(a.updatedAt || a.createdAt).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt).getTime();
          return dateB - dateA;
        }
        case 'created-desc': {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        case 'created-asc': {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        case 'responses-desc': {
          return (b.responseCount || 0) - (a.responseCount || 0);
        }
        case 'title-asc': {
          return a.title.localeCompare(b.title);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [forms, statusFilter, searchQuery, sortBy]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    return {
      total: forms.length,
      published: forms.filter((f) => f.status === 'published').length,
      drafts: forms.filter((f) => f.status === 'draft').length,
      closed: forms.filter((f) => f.status === 'closed').length,
      totalResponses: forms.reduce((acc, curr) => acc + (curr.responseCount || 0), 0),
    };
  }, [forms]);

  // Actions
  const handlePublish = async (form: CustomForm) => {
    if (!form.fields || form.fields.length === 0) {
      setToastMessage({
        type: 'error',
        text: 'Add at least one field before publishing.',
      });
      return;
    }

    setIsProcessingAction(true);
    try {
      const res = await customFormService.updateForm(form.id, { status: 'published' });
      if (res.success) {
        setToastMessage({ type: 'success', text: `"${form.title}" is now published!` });
        await loadForms();
      } else {
        setToastMessage({ type: 'error', text: res.error || 'Failed to publish form.' });
      }
    } catch {
      setToastMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmClose = async () => {
    if (!formToClose) return;
    setIsProcessingAction(true);
    try {
      const res = await customFormService.updateForm(formToClose.id, { status: 'closed' });
      if (res.success) {
        setToastMessage({ type: 'info', text: `"${formToClose.title}" has been closed.` });
        setFormToClose(null);
        await loadForms();
      } else {
        setToastMessage({ type: 'error', text: res.error || 'Failed to close form.' });
      }
    } catch {
      setToastMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!formToDelete) return;
    setIsProcessingAction(true);
    try {
      const res = await customFormService.deleteForm(formToDelete.id);
      if (res.success) {
        setToastMessage({ type: 'success', text: `Form "${formToDelete.title}" deleted.` });
        setFormToDelete(null);
        await loadForms();
      } else {
        setToastMessage({ type: 'error', text: res.error || 'Failed to delete form.' });
      }
    } catch {
      setToastMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDuplicate = async (form: CustomForm) => {
    setIsProcessingAction(true);
    try {
      const res = await customFormService.duplicateForm(form.id);
      if (res.success && res.data) {
        setToastMessage({ type: 'success', text: `Duplicated as "${res.data.title}".` });
        await loadForms();
      } else {
        setToastMessage({ type: 'error', text: res.error || 'Failed to duplicate form.' });
      }
    } catch {
      setToastMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'TBA';
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
              <FileText className="w-8 h-8 text-[#121316] stroke-[2.5]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                  ● FORM CONTROL CENTER
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                ATC FORMS
              </h1>
              <p className="text-xs sm:text-sm font-mono font-bold text-gray-600">
                BUILD. PUBLISH. COLLECT. Create surveys, registrations, and feedback forms.
              </p>
            </div>
          </div>

          {/* Header Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Admin Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={loadForms}
              className="p-2.5 rounded-xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] shadow-pop-xs transition-all cursor-pointer"
              title="Refresh forms list"
            >
              <RotateCw className={`w-4 h-4 text-[#121316] ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to="/admin/forms/create"
              className="px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>CREATE FORM</span>
            </Link>
          </div>
        </div>

        {/* Feedback Toast Notification Banner */}
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl border-3 border-[#121316] shadow-pop flex items-center justify-between gap-3 animate-fadeIn ${
              toastMessage.type === 'success'
                ? 'bg-[#E8F8F0] text-emerald-900'
                : toastMessage.type === 'error'
                ? 'bg-[#FFE5E5] text-[#FF4757]'
                : 'bg-[#E1DCFF] text-[#6C5CE7]'
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

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-gray-500 block">
              TOTAL FORMS
            </span>
            <div className="text-3xl font-black text-[#121316]">{stats.total}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#D4F8E8] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-emerald-800 block">
              PUBLISHED
            </span>
            <div className="text-3xl font-black text-emerald-950">{stats.published}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-amber-800 block">
              DRAFTS
            </span>
            <div className="text-3xl font-black text-amber-950">{stats.drafts}</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#E1DCFF] border-3 border-[#121316] shadow-pop space-y-1">
            <span className="font-mono text-[11px] font-black uppercase text-[#6C5CE7] block">
              RESPONSES
            </span>
            <div className="text-3xl font-black text-[#6C5CE7]">{stats.totalResponses}</div>
          </div>
        </div>

        {/* Search, Filter & Sort Controls Bar */}
        <div className="p-5 rounded-3xl bg-white border-3 border-[#121316] shadow-pop space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input (6 Cols) */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms by Title, Slug, or Description..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
              />
            </div>

            {/* Status Filter Buttons (3 Cols) */}
            <div className="md:col-span-3 flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-2xl border-2 border-[#121316] overflow-x-auto scrollbar-none">
              {(['all', 'published', 'draft', 'closed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-black uppercase transition-all whitespace-nowrap cursor-pointer flex-1 text-center ${
                    statusFilter === st
                      ? 'bg-[#121316] text-white shadow-pop-xs'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Sort Dropdown (3 Cols) */}
            <div className="md:col-span-3 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] appearance-none cursor-pointer"
              >
                <option value="updated-desc">Sort: Recently Updated</option>
                <option value="created-desc">Sort: Newest First</option>
                <option value="created-asc">Sort: Oldest First</option>
                <option value="responses-desc">Sort: Most Responses</option>
                <option value="title-asc">Sort: Title (A–Z)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500 font-mono text-xs font-black">
                ▼
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-500 pt-1">
            <span>
              Showing {filteredForms.length} of {forms.length} forms
            </span>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-7 rounded-[32px] bg-white border-4 border-gray-200 h-64 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] text-center space-y-4 max-w-lg mx-auto shadow-pop">
            <AlertTriangle className="w-10 h-10 text-[#FF4757] mx-auto" />
            <div className="space-y-1">
              <h3 className="font-black text-lg text-[#121316]">FORM DATA OFFLINE</h3>
              <p className="text-xs font-bold text-gray-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={loadForms}
              className="px-5 py-2.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredForms.length > 0 ? (
          /* Forms Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredForms.map((form) => {
              const responsesCount = form.responseCount || 0;
              const responsesLabel =
                responsesCount === 1 ? '1 RESPONSE' : `${responsesCount} RESPONSES`;

              return (
                <div
                  key={form.id}
                  className="p-6 sm:p-7 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all flex flex-col justify-between space-y-5 relative group"
                >
                  <ScrewHead className="absolute top-3.5 left-3.5 w-3.5 h-3.5" rotation={45} />
                  <ScrewHead className="absolute top-3.5 right-3.5 w-3.5 h-3.5" rotation={135} />

                  {/* Card Content Top */}
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <ATCStatusBadge status={form.status} size="sm" />
                      
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black text-[#121316]">
                          {responsesLabel}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#E1DCFF] border border-[#121316] font-mono text-[10px] font-black text-[#6C5CE7]">
                          {form.fields.length} {form.fields.length === 1 ? 'FIELD' : 'FIELDS'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-black text-xl text-[#121316] tracking-tight group-hover:text-[#6C5CE7] transition-colors line-clamp-1">
                        {form.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1 line-clamp-2 min-h-[2.5rem]">
                        {form.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Slug URL Pill */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-[11px] font-bold text-gray-700 max-w-full truncate">
                      <span className="text-[#6C5CE7] font-black">/forms/</span>
                      <span className="truncate">{form.slug}</span>
                    </div>
                  </div>

                  {/* Card Content Bottom & Actions */}
                  <div className="pt-4 border-t-2 border-[#121316]/10 space-y-3">
                    <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 font-bold">
                      <span>Created: {formatDate(form.createdAt)}</span>
                      <span>Updated: {formatDate(form.updatedAt || form.createdAt)}</span>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      
                      {/* Left Side: Primary Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Edit Button */}
                        <Link
                          to={`/admin/forms/${form.id}/edit`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-[11px] font-black text-[#121316] shadow-pop-xs transition-all flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        {/* Open Public Form (if published or closed) */}
                        {form.status !== 'draft' && (
                          <Link
                            to={`/forms/${form.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-[11px] font-black text-[#121316] shadow-pop-xs transition-all flex items-center gap-1.5"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3 text-[#6C5CE7]" />
                          </Link>
                        )}

                        {/* View Responses */}
                        <Link
                          to={`/admin/forms/${form.id}/responses`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#E1DCFF] hover:bg-[#D4CEFF] border-2 border-[#121316] font-mono text-[11px] font-black text-[#6C5CE7] shadow-pop-xs transition-all flex items-center gap-1.5"
                        >
                          <Inbox className="w-3.5 h-3.5" />
                          <span>Responses ({responsesCount})</span>
                        </Link>
                      </div>

                      {/* Right Side: Status & Secondary Actions */}
                      <div className="flex items-center gap-1.5">
                        
                        {/* Publish (if draft or closed) */}
                        {form.status !== 'published' ? (
                          <button
                            type="button"
                            onClick={() => handlePublish(form)}
                            disabled={isProcessingAction}
                            className="p-1.5 rounded-xl bg-[#D4F8E8] hover:bg-[#A8F2CC] border-2 border-[#121316] text-emerald-800 shadow-pop-xs transition-all cursor-pointer"
                            title="Publish form"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : (
                          /* Close (if published) */
                          <button
                            type="button"
                            onClick={() => setFormToClose(form)}
                            disabled={isProcessingAction}
                            className="p-1.5 rounded-xl bg-[#FFE5E5] hover:bg-[#FFD1D1] border-2 border-[#121316] text-[#FF4757] shadow-pop-xs transition-all cursor-pointer"
                            title="Close form submissions"
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(form)}
                          disabled={isProcessingAction}
                          className="p-1.5 rounded-xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] text-gray-700 shadow-pop-xs transition-all cursor-pointer"
                          title="Duplicate form"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setFormToDelete(form)}
                          disabled={isProcessingAction}
                          className="p-1.5 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE5E5] text-gray-700 hover:text-[#FF4757] border-2 border-[#121316] shadow-pop-xs transition-all cursor-pointer"
                          title="Delete form"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-lg mx-auto py-8">
            <ATCEmptyState
              type={searchQuery || statusFilter !== 'all' ? 'search' : 'storage'}
              title={
                searchQuery || statusFilter !== 'all'
                  ? 'NO MATCHING FORMS FOUND'
                  : 'NO FORMS BUILT YET'
              }
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search query or clear your status filters.'
                  : 'Create your first dynamic ATC form to collect registrations, workshop RSVPs, or team feedback.'
              }
              actionLabel={
                searchQuery || statusFilter !== 'all' ? 'Clear Filters' : '+ CREATE FIRST FORM'
              }
              onAction={() => {
                if (searchQuery || statusFilter !== 'all') {
                  setSearchQuery('');
                  setStatusFilter('all');
                } else {
                  navigate('/admin/forms/create');
                }
              }}
            />
          </div>
        )}

      </div>

      {/* Confirmation Modal: Close Form */}
      {formToClose && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessingAction) setFormToClose(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 animate-scaleUp overflow-hidden"
          >
            <div className="tape-strip pointer-events-none bg-[#FFE600]" />

            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE5E5] border-2 border-[#121316] font-mono font-black text-xs uppercase text-[#FF4757] shadow-pop-sm">
                <Lock className="w-3.5 h-3.5" />
                CLOSE SUBMISSIONS
              </div>

              <button
                type="button"
                onClick={() => setFormToClose(null)}
                disabled={isProcessingAction}
                className="p-1.5 rounded-xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-black text-xl text-[#121316]">
                Close "{formToClose.title}"?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
                Closing this form will immediately stop new responses from being submitted. Existing responses will remain safe and accessible to admins. You can re-open it at any time.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#121316]/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormToClose(null)}
                disabled={isProcessingAction}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-200 font-mono text-xs font-black uppercase text-[#121316] border-2 border-[#121316] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmClose}
                disabled={isProcessingAction}
                className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#E03646] font-mono text-xs font-black uppercase text-white border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer"
              >
                {isProcessingAction ? 'Closing...' : 'Close Form'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Form */}
      {formToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessingAction) setFormToDelete(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 animate-scaleUp overflow-hidden"
          >
            <div className="tape-strip pointer-events-none bg-[#FF4757]" />

            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE5E5] border-2 border-[#121316] font-mono font-black text-xs uppercase text-[#FF4757] shadow-pop-sm">
                <Trash2 className="w-3.5 h-3.5" />
                DESTRUCTIVE ACTION
              </div>

              <button
                type="button"
                onClick={() => setFormToDelete(null)}
                disabled={isProcessingAction}
                className="p-1.5 rounded-xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-black text-xl text-[#121316]">
                Delete "{formToDelete.title}"?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
                This will permanently remove the form definition and all associated response records ({formToDelete.responseCount || 0} responses). This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#121316]/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormToDelete(null)}
                disabled={isProcessingAction}
                className="px-5 py-2.5 rounded-full bg-[#FAF7F0] hover:bg-gray-200 font-mono text-xs font-black uppercase text-[#121316] border-2 border-[#121316] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isProcessingAction}
                className="px-6 py-2.5 rounded-full bg-[#FF4757] hover:bg-[#E03646] font-mono text-xs font-black uppercase text-white border-2 border-[#121316] shadow-pop-sm hover:shadow-pop transition-all cursor-pointer"
              >
                {isProcessingAction ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFormsPage;
