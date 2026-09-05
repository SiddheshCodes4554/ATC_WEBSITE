import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Code2,
  ExternalLink,
  Globe,
  Link2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
  AlertTriangle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProjectIdeaService } from '../../services/projectIdeaService';
import { ProjectIdea, ProjectIdeaStatus, parseLinks } from '../../types/projectIdea.types';
import { IdeaStatusBadge } from '../../components/ideas/IdeaStatusBadge';
import { SafeHtmlRenderer } from '../../components/common/SafeHtmlRenderer';

// Simple Inline Icons for GitHub & Figma
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FigmaIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </svg>
);

export const AdminProjectIdeaReviewPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Review Form State
  const [selectedStatus, setSelectedStatus] = useState<'approved' | 'changes_requested' | 'rejected'>('approved');
  const [feedback, setFeedback] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!ideaId) {
      setError('Idea ID is missing.');
      setLoading(false);
      return;
    }

    const fetchIdea = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ProjectIdeaService.getIdeaById(ideaId, user?.$id, true);
        if (!res.success || !res.data) {
          setError(res.error || 'Project idea not found.');
        } else {
          setIdea(res.data);
          if (res.data.status === 'approved' || res.data.status === 'changes_requested' || res.data.status === 'rejected') {
            setSelectedStatus(res.data.status);
          } else {
            setSelectedStatus('approved');
          }
          setFeedback(res.data.feedback || '');
        }
      } catch (err: any) {
        console.error('Error loading idea for review:', err);
        setError(err?.message || 'Failed to fetch proposal details.');
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId, user?.$id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea || !user?.$id) return;

    // Validation
    if ((selectedStatus === 'changes_requested' || selectedStatus === 'rejected') && !feedback.trim()) {
      setFormError('Please provide explanatory feedback for the student when requesting changes or rejecting a proposal.');
      return;
    }

    setSaving(true);
    setFormError(null);
    setSaveSuccess(false);

    try {
      const res = await ProjectIdeaService.reviewIdea(
        idea.$id,
        {
          status: selectedStatus,
          feedback: feedback.trim(),
        },
        user.$id
      );

      if (res.success && res.data) {
        setIdea(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setFormError(res.error || 'Failed to update review status.');
      }
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setFormError(err?.message || 'Failed to submit review.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-12 h-12 text-[#6C5CE7] animate-spin mx-auto" />
          <p className="font-mono text-sm font-black text-[#121316]">
            Loading Project Idea Review Console...
          </p>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] py-16 px-4">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border-3 border-[#121316] shadow-pop text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#FF4757] mx-auto" />
          <h3 className="font-black text-lg text-[#121316]">Idea Not Found</h3>
          <p className="text-xs font-bold text-gray-600">{error || 'Could not find this submission.'}</p>
          <Link
            to="/admin/project-ideas"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Return to Ideas List</span>
          </Link>
        </div>
      </div>
    );
  }

  const techList = idea.technologies
    ? idea.technologies.split(',').map((t) => t.trim()).filter(Boolean)
    : [];
  const links = parseLinks(idea.links);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Top Header Bar */}
      <div className="bg-white border-b-3 border-[#121316] py-4 sticky top-0 z-30 shadow-pop-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/admin/project-ideas"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to Moderation List</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E1DCFF] text-[#6C5CE7] border border-[#121316] font-mono text-xs font-black">
              ADMIN REVIEW PANEL
            </span>
            <Link
              to={`/ideas/${idea.$id}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-xs"
            >
              <span>Public View</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left / Center: Idea Details & Proposal View (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Metadata Card */}
            <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-8 shadow-pop space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#121316]/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#6C5CE7] shadow-pop-xs">
                    {idea.category || 'General'}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-500">
                    ID: {idea.$id}
                  </span>
                </div>

                <IdeaStatusBadge status={idea.status} size="md" />
              </div>

              {/* Title & Short Desc */}
              <div className="space-y-3">
                <h1 className="text-3xl font-black text-[#121316] tracking-tight leading-tight">
                  {idea.title}
                </h1>
                <p className="text-base font-bold text-gray-700 leading-relaxed">
                  {idea.shortDescription}
                </p>
              </div>

              {/* Author & Timestamps */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-black text-[#121316]">
                  <UserCheck className="w-4 h-4 text-[#6C5CE7]" />
                  <span>Student Submitter Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-bold text-gray-600">
                  <div>Author Appwrite ID: <strong className="text-[#121316]">{idea.userId}</strong></div>
                  <div>Created: <strong className="text-[#121316]">{new Date(idea.$createdAt).toLocaleString()}</strong></div>
                  {idea.submittedAt && (
                    <div>Submitted: <strong className="text-[#121316]">{new Date(idea.submittedAt).toLocaleString()}</strong></div>
                  )}
                  {idea.reviewedBy && (
                    <div>Last Reviewed By: <strong className="text-[#121316]">{idea.reviewedBy}</strong></div>
                  )}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <span className="font-mono text-[11px] font-black uppercase text-gray-500 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  Target Technologies / Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {techList.length > 0 ? (
                    techList.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#121316] font-mono text-xs font-bold text-[#121316]"
                      >
                        #{tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 font-bold">No technologies listed</span>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2 pt-2 border-t border-[#121316]/10">
                <span className="font-mono text-[11px] font-black uppercase text-gray-500 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#2ED573]" />
                  Attached Resources
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {links.github && (
                    <a
                      href={links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-xs font-black shadow-pop-xs"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {links.demo && (
                    <a
                      href={links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black shadow-pop-xs"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {links.figma && (
                    <a
                      href={links.figma}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E1DCFF] border-2 border-[#121316] font-mono text-xs font-black text-[#6C5CE7] shadow-pop-xs"
                    >
                      <FigmaIcon className="w-3.5 h-3.5" />
                      <span>Figma</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {links.other && (
                    <a
                      href={links.other}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-[#121316] font-mono text-xs font-black shadow-pop-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Other Link</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Proposal Content Markdown View */}
            <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-8 shadow-pop space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-[#121316]/10 pb-3">
                <span className="text-xl">📝</span>
                <h2 className="text-xl font-black text-[#121316]">
                  Full Proposal Content
                </h2>
              </div>

              <div className="pt-2">
                <SafeHtmlRenderer html={idea.content} />
              </div>
            </div>
          </div>

          {/* Right: Moderation & Decision Control Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border-4 border-[#121316] p-6 sm:p-7 shadow-pop-xl space-y-6 sticky top-24">
              <div className="space-y-1 border-b-2 border-[#121316]/10 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>MODERATION ACTIONS</span>
                </div>
                <h3 className="text-2xl font-black text-[#121316] tracking-tight">
                  Review & Assign Status
                </h3>
                <p className="text-xs font-bold text-gray-600">
                  Select a moderation decision and provide feedback to guide the student.
                </p>
              </div>

              {/* Success Notification */}
              {saveSuccess && (
                <div className="p-4 rounded-2xl bg-[#E8F5E9] border-2 border-[#2ED573] flex items-center gap-3 text-xs font-black text-[#2E7D32] animate-fadeIn shadow-pop-xs">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Review successfully saved and status updated!</span>
                </div>
              )}

              {/* Form Error */}
              {formError && (
                <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] flex items-center gap-3 text-xs font-bold text-[#FF4757] shadow-pop-xs">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* 1. Status Selection Grid */}
                <div className="space-y-2">
                  <label className="font-mono text-xs font-black uppercase text-[#121316]">
                    Decision Status <span className="text-[#FF4757]">*</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Approved */}
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('approved')}
                      className={`p-3 rounded-2xl border-2 font-mono text-xs font-black uppercase flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedStatus === 'approved'
                          ? 'bg-[#2ED573] text-[#121316] border-[#121316] shadow-pop-sm scale-105'
                          : 'bg-[#FAF7F0] text-gray-700 border-gray-300 hover:border-[#121316]'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Approve</span>
                    </button>

                    {/* Request Changes */}
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('changes_requested')}
                      className={`p-3 rounded-2xl border-2 font-mono text-xs font-black uppercase flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedStatus === 'changes_requested'
                          ? 'bg-[#FF793F] text-white border-[#121316] shadow-pop-sm scale-105'
                          : 'bg-[#FAF7F0] text-gray-700 border-gray-300 hover:border-[#121316]'
                      }`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Changes</span>
                    </button>

                    {/* Rejected */}
                    <button
                      type="button"
                      onClick={() => setSelectedStatus('rejected')}
                      className={`p-3 rounded-2xl border-2 font-mono text-xs font-black uppercase flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedStatus === 'rejected'
                          ? 'bg-[#FF4757] text-white border-[#121316] shadow-pop-sm scale-105'
                          : 'bg-[#FAF7F0] text-gray-700 border-gray-300 hover:border-[#121316]'
                      }`}
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* 2. Feedback Textarea */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-black uppercase text-[#121316] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#6C5CE7]" />
                      Mentor Feedback & Guidance
                      {(selectedStatus === 'changes_requested' || selectedStatus === 'rejected') && (
                        <span className="text-[#FF4757]">*</span>
                      )}
                    </label>
                    <span className="font-mono text-[10px] text-gray-500 font-bold">
                      Private to Student
                    </span>
                  </div>

                  <textarea
                    rows={5}
                    placeholder={
                      selectedStatus === 'changes_requested'
                        ? 'Explain what needs to be improved or clarified in the architecture/hardware list before approval...'
                        : selectedStatus === 'rejected'
                        ? 'Explain why this proposal cannot be supported at this time...'
                        : 'Provide constructive tips, recommended mentors, or lab workbench assignments (optional)...'
                    }
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#121316] font-bold text-xs sm:text-sm bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] shadow-pop-xs leading-relaxed"
                  />
                </div>

                {/* Helper Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500">
                    Quick Suggestion Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Approved! Please contact the lab manager for hardware components.',
                      'Please specify the microcontroller and sensor pin mapping.',
                      'Great concept! Needs a clearer system block diagram.',
                      'Please reserve a workbench slot on the Lab Access page.',
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFeedback(preset)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 font-mono text-[10px] font-bold text-gray-700 text-left cursor-pointer"
                      >
                        + "{preset.slice(0, 32)}..."
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Decision Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-3 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Save & Publish Decision</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProjectIdeaReviewPage;
