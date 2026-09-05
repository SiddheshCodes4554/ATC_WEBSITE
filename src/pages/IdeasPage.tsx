import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  Plus,
  Sparkles,
  Layers,
  Loader2,
  AlertCircle,
  Calendar,
  Flame,
} from 'lucide-react';
import { ProjectIdeaService } from '../services/projectIdeaService';
import { ProjectIdea, PROJECT_IDEA_CATEGORIES } from '../types/projectIdea.types';
import { IdeaStatusBadge } from '../components/ideas/IdeaStatusBadge';
import { useAuth } from '../context/AuthContext';

export const IdeasPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProjectIdeaService.getPublicIdeas();
      if (res.success && res.data) {
        setIdeas(res.data);
      } else {
        setError(res.error || 'Failed to fetch project ideas.');
      }
    } catch (err: any) {
      console.error('Failed to load public ideas:', err);
      setError(err?.message || 'Failed to fetch project ideas. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get technologies array from comma string
  const getTechList = (techString?: string): string[] => {
    if (!techString) return [];
    return techString.split(',').map((t) => t.trim()).filter(Boolean);
  };

  // Filter ideas
  const filteredIdeas = ideas
    .filter((idea) => {
      const techList = getTechList(idea.technologies);

      // Search matching title, shortDescription, tech, category
      const matchesSearch =
        !searchQuery.trim() ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        techList.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (idea.category && idea.category.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category matching
      const matchesCategory =
        selectedCategory === 'All' ||
        (idea.category && idea.category.toLowerCase() === selectedCategory.toLowerCase());

      // Status matching
      const matchesStatus =
        selectedStatus === 'all' ||
        idea.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.$createdAt).getTime();
      const dateB = new Date(b.$createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const approvedCount = ideas.filter((i) => i.status === 'approved').length;
  const underReviewCount = ideas.filter((i) => i.status === 'under_review' || i.status === 'submitted').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F0] text-[#121316]">
      {/* 1. HERO SECTION */}
      <section className="relative py-16 sm:py-20 bg-[#FFE600] border-b-4 border-[#121316] overflow-hidden">
        {/* Decorative Grid / Background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#121316_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm">
                <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
                <span>ATC INNOVATION HUB</span>
                <span className="text-gray-400">•</span>
                <span className="text-[#2ED573]">COMMUNITY BRAINSTORM</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-[#121316] tracking-tight leading-none">
                PROJECT IDEA HUB 💡
              </h1>

              <p className="text-base sm:text-xl font-bold text-[#121316] max-w-2xl leading-relaxed">
                Got a bold idea for a robot, IoT device, AI tool, or web system? Ideate, pitch, get mentor feedback, and turn concepts into working prototypes at ATC!
              </p>

              {/* Stats badges */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#121316] shadow-pop-xs font-mono text-xs font-black">
                  🚀 <span className="text-[#6C5CE7]">{ideas.length}</span> Total Ideas
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#121316] shadow-pop-xs font-mono text-xs font-black">
                  ⭐ <span className="text-[#2ED573]">{approvedCount}</span> Approved Projects
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#121316] shadow-pop-xs font-mono text-xs font-black">
                  🔍 <span className="text-[#FFA502]">{underReviewCount}</span> Under Review
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="flex-shrink-0">
              <div className="p-6 rounded-3xl bg-white border-3 border-[#121316] shadow-pop-lg max-w-sm space-y-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#6C5CE7] text-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center font-black text-xl mx-auto sm:mx-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#121316]">
                    Have an Idea in Mind?
                  </h3>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed">
                    Submit your proposal today! Club mentors review every submission to assign lab resources.
                  </p>
                </div>
                <div>
                  <Link
                    to={isAuthenticated ? "/student/ideas/new" : "/login"}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-3 border-[#121316] shadow-pop font-mono text-sm font-black uppercase text-[#121316] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>{isAuthenticated ? 'Submit Your Idea' : 'Login to Submit Idea'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="py-8 bg-white border-b-3 border-[#121316]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ideas, tech, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#121316] font-bold text-sm bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all shadow-pop-xs"
              />
            </div>

            {/* Status & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-gray-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Status:
                </span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border-2 border-[#121316] font-mono text-xs font-black bg-[#FAF7F0] focus:outline-none cursor-pointer shadow-pop-xs"
                >
                  <option value="all">All Public</option>
                  <option value="approved">Approved</option>
                  <option value="under_review">Under Review</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-gray-500">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="px-3 py-2 rounded-xl border-2 border-[#121316] font-mono text-xs font-black bg-[#FAF7F0] focus:outline-none cursor-pointer shadow-pop-xs"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="font-mono text-xs font-black uppercase text-gray-500 mr-1 flex-shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-black transition-all flex-shrink-0 border-2 border-[#121316] ${
                selectedCategory === 'All'
                  ? 'bg-[#121316] text-[#FFE600] shadow-pop-xs'
                  : 'bg-white hover:bg-gray-100 text-[#121316]'
              }`}
            >
              All Categories ({ideas.length})
            </button>
            {PROJECT_IDEA_CATEGORIES.map((cat) => {
              const count = ideas.filter(
                (i) => i.category && i.category.toLowerCase() === cat.toLowerCase()
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-black transition-all flex-shrink-0 border-2 border-[#121316] ${
                    selectedCategory === cat
                      ? 'bg-[#6C5CE7] text-white shadow-pop-xs'
                      : 'bg-white hover:bg-gray-100 text-[#121316]'
                  }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT: IDEAS GRID */}
      <section className="py-12 flex-1 paper-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header count info */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#121316] tracking-tight">
              Community Submissions ({filteredIdeas.length})
            </h2>
            {isAuthenticated && !isAdmin && (
              <Link
                to="/student/ideas"
                className="font-mono text-xs font-black text-[#6C5CE7] hover:underline flex items-center gap-1"
              >
                <span>View My Submissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#6C5CE7] animate-spin mx-auto" />
              <p className="font-mono text-sm font-black text-[#121316]">
                Loading Idea Hub Catalog...
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="p-8 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] text-center space-y-4 shadow-pop max-w-lg mx-auto">
              <AlertCircle className="w-12 h-12 text-[#FF4757] mx-auto" />
              <div className="space-y-1">
                <h3 className="font-black text-lg text-[#121316]">
                  Unable to Load Ideas
                </h3>
                <p className="text-sm font-bold text-gray-700">{error}</p>
              </div>
              <button
                onClick={loadIdeas}
                className="px-5 py-2 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-black shadow-pop-xs hover:shadow-pop transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : filteredIdeas.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-white border-3 border-dashed border-[#121316]/30 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mx-auto text-3xl">
                💡
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-[#121316]">
                  No Ideas Found
                </h3>
                <p className="text-xs font-bold text-gray-600 max-w-xs mx-auto leading-relaxed">
                  {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'all'
                    ? 'Try clearing your filters or search query to find more ideas.'
                    : 'Be the first pioneer to post a project idea!'}
                </p>
              </div>
              <div>
                <Link
                  to={isAuthenticated ? "/student/ideas/new" : "/login"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-sm hover:shadow-pop transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Submit an Idea</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Ideas Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="bg-white rounded-3xl border-3 border-[#121316] shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-6 space-y-4">
                      {/* Card Top: Category & Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black uppercase text-[#6C5CE7]">
                          {idea.category || 'General'}
                        </span>
                        <IdeaStatusBadge status={idea.status} size="sm" />
                      </div>

                      {/* Title & Short Desc */}
                      <div className="space-y-2">
                        <Link to={`/ideas/${idea.$id}`}>
                          <h3 className="text-xl font-black text-[#121316] group-hover:text-[#6C5CE7] transition-colors line-clamp-2 leading-snug">
                            {idea.title}
                          </h3>
                        </Link>
                        <p className="text-xs font-bold text-gray-600 line-clamp-3 leading-relaxed">
                          {idea.shortDescription}
                        </p>
                      </div>

                      {/* Technologies Stack Tags */}
                      {techList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {techList.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-300 font-mono text-[10px] font-bold text-gray-700"
                            >
                              #{tech}
                            </span>
                          ))}
                          {techList.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-gray-100 font-mono text-[10px] font-bold text-gray-500">
                              +{techList.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 bg-[#FAF7F0] border-t-2 border-[#121316] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[11px] font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{createdDate}</span>
                      </div>

                      <Link
                        to={`/ideas/${idea.$id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black shadow-pop-xs hover:shadow-pop transition-all"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default IdeasPage;
