import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProjectService } from '../../services/projectService';
import { StorageService } from '../../services/storage.service';
import { ATCProject, ProjectStatus } from '../../types/project.types';
import {
  FolderGit2,
  Plus,
  Search,
  ArrowLeft,
  ExternalLink,
  Edit,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Star,
  ArrowUp,
  ArrowDown,
  Globe,
  Sparkles,
  Eye,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ATCProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Deletion modal state
  const [projectToDelete, setProjectToDelete] = useState<ATCProject | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await ProjectService.getProjects({ limit: 100, order: 'asc' });
      if (result.success && result.data) {
        setProjects(result.data);
      } else {
        setError(result.error || 'Failed to load projects.');
      }
    } catch (err: any) {
      console.error('Error fetching admin projects:', err);
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleQuickStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    setStatusUpdatingId(projectId);
    try {
      const result = await ProjectService.updateProject(projectId, { status: newStatus });
      if (result.success && result.data) {
        setProjects((prev) =>
          prev.map((p) => (p.$id === projectId ? { ...p, status: newStatus } : p))
        );
      } else {
        alert(result.error || 'Failed to update project status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error updating status.');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (project: ATCProject) => {
    try {
      const result = await ProjectService.toggleFeatured(project.$id, project.featured);
      if (result.success && result.data) {
        setProjects((prev) =>
          prev.map((p) =>
            p.$id === project.$id ? { ...p, featured: !project.featured } : p
          )
        );
        if (!project.featured) {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        }
      } else {
        alert(result.error || 'Failed to toggle featured status.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error toggling featured status.');
    }
  };

  const handleMoveOrder = async (projectId: string, direction: 'up' | 'down') => {
    setReorderingId(projectId);
    try {
      const result = await ProjectService.moveProjectOrder(projectId, direction);
      if (result.success && result.data) {
        setProjects(result.data);
      } else {
        alert(result.error || 'Failed to reorder projects.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error reordering projects.');
    } finally {
      setReorderingId(null);
    }
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);

    try {
      const result = await ProjectService.deleteProject(
        projectToDelete.$id,
        projectToDelete.coverImageId
      );
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.$id !== projectToDelete.$id));
        setProjectToDelete(null);
      } else {
        alert(result.error || 'Failed to delete project.');
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting project.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-[#2ED573] text-[#121316] border border-[#121316]">
            ● Published
          </span>
        );
      case 'draft':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-gray-200 text-gray-700 border border-gray-400">
            ○ Draft
          </span>
        );
      case 'archived':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-[#FFE5E5] text-[#FF4757] border border-[#FF4757]">
            ✕ Archived
          </span>
        );
      default:
        return null;
    }
  };

  // Tab counts
  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;
  const archivedCount = projects.filter((p) => p.status === 'archived').length;
  const featuredCount = projects.filter((p) => p.featured).length;

  // Filter projects by active tab & search query
  const filteredProjects = projects.filter((p) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'published'
        ? p.status === 'published'
        : activeTab === 'draft'
        ? p.status === 'draft'
        : activeTab === 'archived'
        ? p.status === 'archived'
        : activeTab === 'featured'
        ? p.featured
        : true;

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#FF793F]">
                APPWRITE PROJECTS DATABASE • DYNAMIC SHOWCASE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Manage Projects
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={fetchProjects}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] shadow-pop-sm transition-all text-[#121316] disabled:opacity-50 cursor-pointer"
              title="Refresh project list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to="/admin/projects/new"
              className="px-5 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] font-mono text-xs font-black border-2 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-2 text-[#121316] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Create Project</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All (${projects.length})` },
              { id: 'published', label: `Published (${publishedCount})` },
              { id: 'featured', label: `★ Featured (${featuredCount})` },
              { id: 'draft', label: `Drafts (${draftCount})` },
              { id: 'archived', label: `Archived (${archivedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-2xl font-mono text-xs font-black border-2 border-[#121316] transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#121316] text-white shadow-pop-sm'
                    : 'bg-[#FAF7F0] text-[#121316] hover:bg-[#FFE8D6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tech, slug..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-[#FF793F] animate-spin" />
            <p className="font-mono text-sm font-black text-[#121316]">
              Loading projects from Appwrite...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-[36px] bg-[#FFE5E5] border-4 border-[#121316] shadow-pop flex flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="w-8 h-8 text-[#FF4757]" />
            <p className="font-bold text-sm text-[#FF4757]">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-2 px-4 py-2 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316]"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop flex items-center justify-center">
              <FolderGit2 className="w-8 h-8 text-gray-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#121316]">No Projects Found</h3>
              <p className="text-xs font-bold text-gray-500">
                {searchQuery
                  ? `No project matches search "${searchQuery}" in this tab.`
                  : 'Start showcasing student builds by creating the first project.'}
              </p>
            </div>
            <Link
              to="/admin/projects/new"
              className="mt-2 px-6 py-2.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm hover:shadow-pop"
            >
              + Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredProjects.map((proj, idx) => (
              <div
                key={proj.$id}
                className="p-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-200 flex flex-col justify-between relative group"
                style={{
                  borderTopColor: proj.featured ? '#FFE600' : '#121316',
                  borderTopWidth: proj.featured ? '8px' : '4px',
                }}
              >
                {/* Card Top Meta */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-[#FAF7F0] px-2 py-0.5 rounded-md border border-[#121316]/20">
                        #{proj.displayOrder}
                      </span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFE600] border border-[#121316] font-mono text-[9px] font-black uppercase flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-[#121316]" /> Featured
                        </span>
                      )}
                    </div>
                    {getStatusBadge(proj.status)}
                  </div>

                  {/* Cover Image Thumbnail */}
                  {proj.coverImageId ? (
                    <div className="w-full h-36 rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 mb-2">
                      <img
                        src={StorageService.getProjectImageUrl(proj.coverImageId, 400)}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-2xl border-2 border-[#121316]/20 bg-[#FAF7F0] mb-2 flex items-center justify-center">
                      <Layers className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <h3 className="text-xl font-black text-[#121316] tracking-tight leading-tight line-clamp-1">
                    {proj.title}
                  </h3>

                  <p className="text-xs font-bold text-gray-600 line-clamp-2 leading-relaxed">
                    {proj.shortDescription || proj.description}
                  </p>

                  {/* Tech Stack Chips */}
                  {proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-[#FAF7F0] border border-[#121316]/20 font-mono text-[10px] font-bold text-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                      {proj.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-gray-100 font-mono text-[10px] font-bold text-gray-500">
                          +{proj.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* External Links */}
                  <div className="flex items-center gap-3 pt-2 text-xs font-mono font-bold text-gray-600">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-[#121316] transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-[#121316] transition-colors"
                        title="Live Demo"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#2ED573]" />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Controls & Actions */}
                <div className="pt-4 mt-4 border-t-2 border-[#121316]/10 space-y-3">
                  {/* Status & Featured Switcher */}
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={proj.status}
                      disabled={statusUpdatingId === proj.$id}
                      onChange={(e) =>
                        handleQuickStatusChange(proj.$id, e.target.value as ProjectStatus)
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-black text-[#121316] cursor-pointer"
                    >
                      <option value="published">Published (Public)</option>
                      <option value="draft">Draft (Private)</option>
                      <option value="archived">Archived</option>
                    </select>

                    <button
                      onClick={() => handleToggleFeatured(proj)}
                      className={`px-2.5 py-1 rounded-lg border border-[#121316] font-mono text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                        proj.featured
                          ? 'bg-[#FFE600] text-[#121316]'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Toggle Featured on Public Showcase"
                    >
                      <Star className={`w-3 h-3 ${proj.featured ? 'fill-[#121316]' : ''}`} />
                      <span>{proj.featured ? 'Featured' : 'Feature'}</span>
                    </button>
                  </div>

                  {/* Reorder and Edit / View / Delete Row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Order Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(proj.$id, 'up')}
                        disabled={reorderingId === proj.$id || idx === 0}
                        className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#FFE600] border border-[#121316] transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[#121316]" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(proj.$id, 'down')}
                        disabled={reorderingId === proj.$id || idx === filteredProjects.length - 1}
                        className="p-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#FFE600] border border-[#121316] transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-[#121316]" />
                      </button>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/projects/${proj.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-[#121316] transition-colors"
                        title="Preview Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#121316]" />
                      </Link>

                      <Link
                        to={`/admin/projects/${proj.$id}/edit`}
                        className="p-2 rounded-xl bg-[#FFE600] hover:bg-[#FFD32A] border border-[#121316] transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#121316]" />
                      </Link>

                      <button
                        onClick={() => setProjectToDelete(proj)}
                        className="p-2 rounded-xl bg-[#FFE5E5] hover:bg-[#FF4757] hover:text-white border border-[#121316] transition-colors cursor-pointer text-[#FF4757]"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FFE5E5] border-3 border-[#121316] shadow-pop flex items-center justify-center text-[#FF4757] mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-[#121316] tracking-tight">
                Delete Project?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <span className="font-black text-[#121316]">"{projectToDelete.title}"</span>?
                This will remove the project from Appwrite and clean up its cover image.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl bg-[#FAF7F0] hover:bg-gray-100 border-2 border-[#121316] font-mono text-xs font-black text-[#121316] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProject}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-2xl bg-[#FF4757] hover:bg-[#FF3838] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-white flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsPage;
