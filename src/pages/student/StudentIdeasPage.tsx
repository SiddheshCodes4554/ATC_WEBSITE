import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  Plus,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Loader2,
  Trash2,
  Edit3,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProjectIdeaService } from '../../services/projectIdeaService';
import { ProjectIdea } from '../../types/projectIdea.types';
import { IdeaStatusBadge } from '../../components/ideas/IdeaStatusBadge';

export const StudentIdeasPage: React.FC = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeas();
  }, [user?.$id]);

  const fetchIdeas = async () => {
    if (!user?.$id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await ProjectIdeaService.getIdeasByUserId(user.$id);
      if (res.success && res.data) {
        setIdeas(res.data);
      } else {
        setError(res.error || 'Could not load your project ideas.');
      }
    } catch (err: any) {
      console.error('Failed to fetch user ideas:', err);
      setError(err?.message || 'Could not load your project ideas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ideaId: string, title: string) => {
    if (!user?.$id) return;
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(ideaId);
    try {
      const res = await ProjectIdeaService.deleteIdea(ideaId, user.$id);
      if (res.success) {
        setIdeas((prev) => prev.filter((i) => i.$id !== ideaId));
      } else {
        alert(res.error || 'Failed to delete the idea. Please try again.');
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

  // Stats calculation
  const totalCount = ideas.length;
  const draftCount = ideas.filter((i) => i.status === 'draft').length;
  const inReviewCount = ideas.filter((i) => i.status === 'submitted' || i.status === 'under_review').length;
  const approvedCount = ideas.filter((i) => i.status === 'approved').length;
  const changesCount = ideas.filter((i) => i.status === 'changes_requested').length;
  const rejectedCount = ideas.filter((i) => i.status === 'rejected').length;

  // Filter ideas
  const filteredIdeas = ideas.filter((idea) => {
    const techList = getTechList(idea.technologies);
    const matchesSearch =
      !searchQuery.trim() ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      techList.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (idea.category && idea.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || idea.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Header Banner */}
      <section className="bg-white border-b-3 border-[#121316] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs">
                <Lightbulb className="w-4 h-4" />
                <span>STUDENT INNOVATION SPACE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121316] tracking-tight">
                My Project Ideas 💡
              </h1>
              <p className="text-sm sm:text-base font-bold text-gray-700 max-w-2xl">
                Submit tech project proposals, track review status by club mentors, and revise your submissions to get approval and lab support.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-3">
              <Link
                to="/student/ideas/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-3 border-[#121316] shadow-pop font-mono text-xs font-black uppercase text-[#121316] hover:scale-105 active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Submit New Idea</span>
              </Link>
            </div>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-xs">
              <span className="font-mono text-[10px] font-black uppercase text-gray-500">Total Ideas</span>
              <div className="text-2xl font-black text-[#121316]">{totalCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-xs">
              <span className="font-mono text-[10px] font-black uppercase text-gray-500">Drafts</span>
              <div className="text-2xl font-black text-gray-600">{draftCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF9DB] border-2 border-[#121316] shadow-pop-xs">
              <span className="font-mono text-[10px] font-black uppercase text-[#FFA502]">In Review</span>
              <div className="text-2xl font-black text-[#FFA502]">{inReviewCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#E8F5E9] border-2 border-[#121316] shadow-pop-xs">
              <span className="font-mono text-[10px] font-black uppercase text-[#2ED573]">Approved</span>
              <div className="text-2xl font-black text-[#2ED573]">{approvedCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3E0] border-2 border-[#121316] shadow-pop-xs">
              <span className="font-mono text-[10px] font-black uppercase text-[#FF793F]">Action Needed</span>
              <div className="text-2xl font-black text-[#FF793F]">{changesCount}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFE5E5] border-2 border-[#121316] shadow-pop-xs">
              <span className="font-mono text-[10px] font-black uppercase text-[#FF4757]">Rejected</span>
              <div className="text-2xl font-black text-[#FF4757]">{rejectedCount}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border-3 border-[#121316] shadow-pop-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-[#121316] font-bold text-xs bg-[#FAF7F0] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-gray-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'draft', label: 'Drafts' },
              { id: 'submitted', label: 'Submitted' },
              { id: 'under_review', label: 'Under Review' },
              { id: 'approved', label: 'Approved' },
              { id: 'changes_requested', label: 'Changes Requested' },
              { id: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-full font-mono text-[11px] font-black border-2 transition-all ${
                  statusFilter === tab.id
                    ? 'bg-[#121316] text-[#FFE600] border-[#121316] shadow-pop-xs'
                    : 'bg-white hover:bg-gray-100 text-[#121316] border-[#121316]/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas List or States */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#6C5CE7] animate-spin mx-auto" />
            <p className="font-mono text-sm font-black text-[#121316]">
              Loading Your Project Ideas...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] text-center space-y-4 max-w-lg mx-auto shadow-pop">
            <AlertCircle className="w-10 h-10 text-[#FF4757] mx-auto" />
            <p className="font-bold text-sm text-[#121316]">{error}</p>
            <button
              onClick={fetchIdeas}
              className="px-4 py-2 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-black"
            >
              Try Again
            </button>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border-3 border-dashed border-[#121316]/30 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mx-auto text-3xl">
              💡
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-lg text-[#121316]">
                {searchQuery || statusFilter !== 'all' ? 'No Matching Ideas' : 'No Project Ideas Yet'}
              </h3>
              <p className="text-xs font-bold text-gray-600">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try clearing your filter or search query.'
                  : 'Start by writing down your dream engineering or robotics build!'}
              </p>
            </div>
            <div>
              <Link
                to="/student/ideas/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create First Idea</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIdeas.map((idea) => {
              const createdDate = new Date(idea.$createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const techList = getTechList(idea.technologies);

              return (
                <div
                  key={idea.$id}
                  className="bg-white rounded-3xl border-3 border-[#121316] p-5 sm:p-6 shadow-pop hover:shadow-pop-lg transition-all space-y-4 group"
                >
                  {/* Top Bar: Category, Status, Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#121316]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
                        {idea.category || 'General'}
                      </span>
                      <IdeaStatusBadge status={idea.status} size="sm" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-gray-500 hidden sm:inline">
                        Created {createdDate}
                      </span>
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-1.5">
                    <Link
                      to={`/student/ideas/${idea.$id}`}
                      className="block group-hover:text-[#6C5CE7] transition-colors"
                    >
                      <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight">
                        {idea.title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm font-bold text-gray-700 line-clamp-2">
                      {idea.shortDescription}
                    </p>
                  </div>

                  {/* Feedback Banner if Changes Requested */}
                  {idea.status === 'changes_requested' && idea.feedback && (
                    <div className="p-3.5 rounded-2xl bg-[#FFF3E0] border-2 border-[#FF793F] space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-black text-[#E65100]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>MENTOR FEEDBACK (ACTION REQUIRED)</span>
                      </div>
                      <p className="text-xs font-bold text-gray-800 line-clamp-2">
                        "{idea.feedback}"
                      </p>
                    </div>
                  )}

                  {/* Technologies tags */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
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

                  {/* Card Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#121316]/10">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/student/ideas/${idea.$id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs transition-all"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* Edit Button (Drafts or Changes Requested) */}
                      {(idea.status === 'draft' || idea.status === 'changes_requested' || idea.status === 'submitted') && (
                        <Link
                          to={`/student/ideas/${idea.$id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-xs transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          <span>{idea.status === 'changes_requested' ? 'Revise & Resubmit' : 'Edit'}</span>
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete Draft Option */}
                      {(idea.status === 'draft' || idea.status === 'rejected') && (
                        <button
                          onClick={() => handleDelete(idea.$id, idea.title)}
                          disabled={deletingId === idea.$id}
                          className="p-2 rounded-xl bg-[#FFE5E5] hover:bg-[#FFD2D2] border-2 border-[#FF4757] text-[#FF4757] shadow-pop-xs transition-all cursor-pointer disabled:opacity-50"
                          title="Delete Idea"
                        >
                          {deletingId === idea.$id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      {/* Public Link if Public */}
                      {(idea.status === 'approved' || idea.status === 'under_review' || idea.status === 'submitted') && (
                        <Link
                          to={`/ideas/${idea.$id}`}
                          className="inline-flex items-center gap-1 font-mono text-xs font-bold text-gray-500 hover:text-[#121316] underline"
                        >
                          <span>Public Page</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentIdeasPage;
