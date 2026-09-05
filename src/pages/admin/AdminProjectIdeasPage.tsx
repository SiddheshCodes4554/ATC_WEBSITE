import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Eye,
  CheckSquare,
} from 'lucide-react';
import { ProjectIdeaService } from '../../services/projectIdeaService';
import { ProjectIdea, PROJECT_IDEA_CATEGORIES } from '../../types/projectIdea.types';
import { IdeaStatusBadge } from '../../components/ideas/IdeaStatusBadge';
import { useAuth } from '../../context/AuthContext';

export const AdminProjectIdeasPage: React.FC = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadAllIdeas();
  }, []);

  const loadAllIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProjectIdeaService.getAllIdeas();
      if (res.success && res.data) {
        setIdeas(res.data.ideas);
      } else {
        setError(res.error || 'Could not fetch project ideas for admin.');
      }
    } catch (err: any) {
      console.error('Failed to load admin ideas:', err);
      setError(err?.message || 'Could not fetch project ideas for admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ideaId: string, title: string) => {
    if (!confirm(`ADMIN ACTION: Are you sure you want to permanently delete idea "${title}"?`)) {
      return;
    }

    setDeletingId(ideaId);
    try {
      const res = await ProjectIdeaService.deleteIdea(ideaId, user?.$id, true);
      if (res.success) {
        setIdeas((prev) => prev.filter((i) => i.$id !== ideaId));
      } else {
        alert(res.error || 'Failed to delete idea.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting idea.');
    } finally {
      setDeletingId(null);
    }
  };

  const getTechList = (techString?: string): string[] => {
    if (!techString) return [];
    return techString.split(',').map((t) => t.trim()).filter(Boolean);
  };

  // Stats
  const totalCount = ideas.length;
  const pendingReviewCount = ideas.filter((i) => i.status === 'submitted' || i.status === 'under_review').length;
  const approvedCount = ideas.filter((i) => i.status === 'approved').length;
  const changesCount = ideas.filter((i) => i.status === 'changes_requested').length;
  const rejectedCount = ideas.filter((i) => i.status === 'rejected').length;
  const draftCount = ideas.filter((i) => i.status === 'draft').length;

  // Filtered ideas
  const filteredIdeas = ideas.filter((idea) => {
    const techList = getTechList(idea.technologies);
    const matchesSearch =
      !searchQuery.trim() ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      techList.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'all' || idea.status === selectedStatus;

    const matchesCategory =
      selectedCategory === 'All' ||
      (idea.category && idea.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center text-3xl flex-shrink-0">
              💡
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-[11px] font-black uppercase">
                  ● ADMIN MODERATION
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Project Ideas Moderation Hub
              </h1>
              <p className="text-xs sm:text-sm font-mono font-bold text-gray-600">
                Review student project pitches, provide mentor feedback, and approve hardware lab access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm transition-all"
            >
              <span>Back to Admin</span>
            </Link>
            <Link
              to="/ideas"
              target="_blank"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 transition-all"
            >
              <span>Public Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm">
            <span className="font-mono text-[10px] font-black uppercase text-gray-500">Total Submitted</span>
            <div className="text-2xl sm:text-3xl font-black text-[#121316]">{totalCount}</div>
          </div>
          <div className="p-4 rounded-3xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop-sm">
            <span className="font-mono text-[10px] font-black uppercase text-[#FFA502]">Needs Review</span>
            <div className="text-2xl sm:text-3xl font-black text-[#FFA502]">{pendingReviewCount}</div>
          </div>
          <div className="p-4 rounded-3xl bg-[#E8F5E9] border-3 border-[#121316] shadow-pop-sm">
            <span className="font-mono text-[10px] font-black uppercase text-[#2ED573]">Approved</span>
            <div className="text-2xl sm:text-3xl font-black text-[#2ED573]">{approvedCount}</div>
          </div>
          <div className="p-4 rounded-3xl bg-[#FFF3E0] border-3 border-[#121316] shadow-pop-sm">
            <span className="font-mono text-[10px] font-black uppercase text-[#FF793F]">Changes Asked</span>
            <div className="text-2xl sm:text-3xl font-black text-[#FF793F]">{changesCount}</div>
          </div>
          <div className="p-4 rounded-3xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop-sm">
            <span className="font-mono text-[10px] font-black uppercase text-[#FF4757]">Rejected</span>
            <div className="text-2xl sm:text-3xl font-black text-[#FF4757]">{rejectedCount}</div>
          </div>
          <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-sm">
            <span className="font-mono text-[10px] font-black uppercase text-gray-500">Student Drafts</span>
            <div className="text-2xl sm:text-3xl font-black text-gray-600">{draftCount}</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-5 rounded-3xl border-3 border-[#121316] shadow-pop space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ideas, author ID, tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#121316] font-bold text-xs bg-[#FAF7F0] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-gray-500">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border-2 border-[#121316] font-mono text-xs font-black bg-[#FAF7F0] focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {PROJECT_IDEA_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadAllIdeas}
                className="px-4 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs transition-all cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t-2 border-[#121316]/10">
            <span className="font-mono text-xs font-black uppercase text-gray-500 mr-1">Status:</span>
            {[
              { id: 'all', label: 'All', count: totalCount },
              { id: 'submitted', label: 'Submitted (New)', count: ideas.filter((i) => i.status === 'submitted').length },
              { id: 'under_review', label: 'Under Review', count: ideas.filter((i) => i.status === 'under_review').length },
              { id: 'approved', label: 'Approved', count: approvedCount },
              { id: 'changes_requested', label: 'Changes Requested', count: changesCount },
              { id: 'rejected', label: 'Rejected', count: rejectedCount },
              { id: 'draft', label: 'Drafts', count: draftCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-full font-mono text-xs font-black border-2 transition-all ${
                  selectedStatus === tab.id
                    ? 'bg-[#121316] text-[#FFE600] border-[#121316] shadow-pop-xs'
                    : 'bg-white hover:bg-gray-100 text-[#121316] border-[#121316]/30'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#6C5CE7] animate-spin mx-auto" />
            <p className="font-mono text-sm font-black text-[#121316]">
              Loading Project Submissions...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] text-center space-y-4 max-w-lg mx-auto shadow-pop">
            <AlertCircle className="w-10 h-10 text-[#FF4757] mx-auto" />
            <p className="font-bold text-sm text-[#121316]">{error}</p>
            <button
              onClick={loadAllIdeas}
              className="px-4 py-2 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-black"
            >
              Try Again
            </button>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border-3 border-dashed border-[#121316]/30 text-center space-y-3 max-w-md mx-auto">
            <p className="font-black text-lg text-[#121316]">No Submissions Found</p>
            <p className="text-xs font-bold text-gray-500">
              No ideas matched the current filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIdeas.map((idea) => {
              const createdDate = new Date(idea.$createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isPending = idea.status === 'submitted' || idea.status === 'under_review';
              const techList = getTechList(idea.technologies);

              return (
                <div
                  key={idea.$id}
                  className={`p-6 rounded-3xl border-3 border-[#121316] shadow-pop transition-all space-y-4 ${
                    isPending ? 'bg-[#FFFDF0] ring-2 ring-[#FFA502]/50' : 'bg-white'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#121316]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
                        {idea.category || 'General'}
                      </span>
                      <IdeaStatusBadge status={idea.status} size="sm" />
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px] font-bold text-gray-500">
                      <span>Author ID: <strong className="text-[#121316]">{idea.userId.slice(0, 10)}...</strong></span>
                      <span>•</span>
                      <span>Created {createdDate}</span>
                    </div>
                  </div>

                  {/* Title & Short Desc */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#121316] tracking-tight">
                      {idea.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-700 line-clamp-2">
                      {idea.shortDescription}
                    </p>
                  </div>

                  {/* Feedback Snippet if any */}
                  {idea.feedback && (
                    <div className="p-3 rounded-2xl bg-[#FAF7F0] border-2 border-gray-200 text-xs font-medium text-gray-800">
                      <span className="font-mono text-[10px] font-black uppercase text-gray-500 block mb-0.5">
                        Existing Mentor Feedback:
                      </span>
                      "{idea.feedback}"
                    </div>
                  )}

                  {/* Tech stack chips */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-300 font-mono text-[10px] font-bold text-gray-700"
                        >
                          #{tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#121316]/10">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/project-ideas/${idea.$id}`}
                        className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs hover:shadow-pop transition-all ${
                          isPending
                            ? 'bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316]'
                            : 'bg-white hover:bg-gray-100 text-[#121316]'
                        }`}
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>{isPending ? 'Review & Moderate →' : 'Review Decision'}</span>
                      </Link>

                      <Link
                        to={`/ideas/${idea.$id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-xs transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Public View</span>
                      </Link>
                    </div>

                    <button
                      onClick={() => handleDelete(idea.$id, idea.title)}
                      disabled={deletingId === idea.$id}
                      className="p-2 rounded-xl bg-[#FFE5E5] hover:bg-[#FFD2D2] border-2 border-[#FF4757] text-[#FF4757] shadow-pop-xs transition-all cursor-pointer disabled:opacity-50"
                      title="Permanently Delete Idea"
                    >
                      {deletingId === idea.$id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectIdeasPage;
