import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Lightbulb,
  Save,
  Send,
  Layers,
  Code2,
  Globe,
  Link2,
  AlertCircle,
  Loader2,
  MessageSquare,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProjectIdeaService } from '../../services/projectIdeaService';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import { PROJECT_IDEA_CATEGORIES, ProjectIdea, ProjectLinks, parseLinks } from '../../types/projectIdea.types';

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

export const SubmitIdeaPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId?: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const isEditMode = Boolean(ideaId);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(PROJECT_IDEA_CATEGORIES[0]);
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [links, setLinks] = useState<ProjectLinks>({
    github: '',
    demo: '',
    figma: '',
    other: '',
  });

  // Loaded idea for edit mode
  const [existingIdea, setExistingIdea] = useState<ProjectIdea | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<'draft' | 'submit' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && ideaId) {
      loadExistingIdea(ideaId);
    }
  }, [ideaId, isEditMode]);

  const loadExistingIdea = async (id: string) => {
    setLoadingInitial(true);
    setErrorMessage(null);
    try {
      const res = await ProjectIdeaService.getIdeaById(id, user?.$id, isAdmin);
      if (!res.success || !res.data) {
        setErrorMessage(res.error || 'Idea not found.');
        return;
      }

      const data = res.data;
      // Check ownership
      if (data.userId !== user?.$id && !isAdmin) {
        setErrorMessage('You do not have permission to edit this idea.');
        return;
      }

      setExistingIdea(data);
      setTitle(data.title || '');
      setCategory(data.category || PROJECT_IDEA_CATEGORIES[0]);
      setShortDescription(data.shortDescription || '');
      setContent(data.content || '');

      const parsedTech = data.technologies
        ? data.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
      setTechnologies(parsedTech);

      const parsed = parseLinks(data.links);
      setLinks({
        github: parsed.github || '',
        demo: parsed.demo || '',
        figma: parsed.figma || '',
        other: parsed.other || '',
      });
    } catch (err: any) {
      console.error('Error loading idea for edit:', err);
      setErrorMessage(err?.message || 'Failed to load idea data.');
    } finally {
      setLoadingInitial(false);
    }
  };

  // Tech stack chip handlers
  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (indexToRemove: number) => {
    setTechnologies(technologies.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTech();
    }
  };

  // Validate form
  const validateForm = (isDraft: boolean): boolean => {
    if (!title.trim()) {
      setErrorMessage('Please provide a project title.');
      return false;
    }
    if (title.trim().length > 255) {
      setErrorMessage('Project title cannot exceed 255 characters.');
      return false;
    }

    if (!isDraft) {
      if (!shortDescription.trim()) {
        setErrorMessage('Please provide a short summary of your project.');
        return false;
      }
      if (shortDescription.trim().length > 500) {
        setErrorMessage('Short summary cannot exceed 500 characters.');
        return false;
      }
      if (!content || content.trim() === '<p></p>' || content.trim().length < 20) {
        setErrorMessage('Please write a detailed proposal (at least a paragraph explaining your idea).');
        return false;
      }
    }

    setErrorMessage(null);
    return true;
  };

  // Handle Save / Submit
  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (!user?.$id) {
      setErrorMessage('You must be signed in to perform this action.');
      return;
    }

    if (!validateForm(action === 'draft')) {
      return;
    }

    setSubmitting(true);
    setSubmitAction(action);
    setErrorMessage(null);

    const techString = technologies.join(', ');

    try {
      if (isEditMode && ideaId) {
        // Edit mode
        if (action === 'submit') {
          // If status was changes_requested, use resubmit
          if (existingIdea?.status === 'changes_requested') {
            const res = await ProjectIdeaService.resubmitIdea(
              ideaId,
              {
                title: title.trim(),
                category,
                shortDescription: shortDescription.trim(),
                content,
                technologies: techString,
                links,
              },
              user.$id
            );
            if (!res.success) throw new Error(res.error || 'Failed to resubmit idea.');
          } else {
            const res = await ProjectIdeaService.submitIdea(
              {
                title: title.trim(),
                category,
                shortDescription: shortDescription.trim(),
                content,
                technologies: techString,
                links,
              },
              user.$id,
              ideaId
            );
            if (!res.success) throw new Error(res.error || 'Failed to submit idea.');
          }
        } else {
          // Save draft or update
          const res = await ProjectIdeaService.saveDraft(
            {
              title: title.trim(),
              category,
              shortDescription: shortDescription.trim(),
              content,
              technologies: techString,
              links,
            },
            user.$id,
            ideaId
          );
          if (!res.success) throw new Error(res.error || 'Failed to save draft.');
        }
      } else {
        // New idea
        if (action === 'submit') {
          const res = await ProjectIdeaService.createIdea(
            {
              title: title.trim(),
              category,
              shortDescription: shortDescription.trim(),
              content,
              technologies: techString,
              links,
              status: 'submitted',
            },
            user.$id
          );
          if (!res.success) throw new Error(res.error || 'Failed to create idea.');
        } else {
          const res = await ProjectIdeaService.createIdea(
            {
              title: title.trim(),
              category,
              shortDescription: shortDescription.trim(),
              content,
              technologies: techString,
              links,
              status: 'draft',
            },
            user.$id
          );
          if (!res.success) throw new Error(res.error || 'Failed to save draft.');
        }
      }

      // Success redirect
      navigate('/student/ideas');
    } catch (err: any) {
      console.error('Error saving idea:', err);
      setErrorMessage(err?.message || 'Failed to save project idea.');
    } finally {
      setSubmitting(false);
      setSubmitAction(null);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-12 h-12 text-[#6C5CE7] animate-spin mx-auto" />
          <p className="font-mono text-sm font-black text-[#121316]">
            Loading Project Idea Form...
          </p>
        </div>
      </div>
    );
  }

  const isResubmission = existingIdea?.status === 'changes_requested';

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Top Header Navigation */}
      <div className="bg-white border-b-3 border-[#121316] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/student/ideas"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>Back to My Ideas</span>
          </Link>

          <span className="font-mono text-xs font-black uppercase text-gray-500">
            {isEditMode ? 'Edit Mode' : 'New Submission'}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Mentor Feedback Banner (If changes were requested) */}
        {isResubmission && existingIdea?.feedback && (
          <div className="p-6 rounded-3xl bg-[#FFF3E0] border-3 border-[#FF793F] shadow-pop space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-black text-[#E65100]">
              <MessageSquare className="w-4 h-4" />
              <span>MENTOR REVIEW FEEDBACK — REVISION NEEDED</span>
            </div>
            <p className="text-sm font-bold text-gray-900 leading-relaxed bg-white/70 p-3 rounded-2xl border border-[#FF793F]/40">
              "{existingIdea.feedback}"
            </p>
            <p className="text-xs font-bold text-gray-600">
              Please address the mentor's notes in your proposal below, then click "Resubmit for Review".
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] flex items-center gap-3 shadow-pop-xs">
            <AlertCircle className="w-5 h-5 text-[#FF4757] flex-shrink-0" />
            <span className="text-xs font-bold text-[#FF4757]">{errorMessage}</span>
          </div>
        )}

        {/* Main Idea Editor Card */}
        <div className="bg-white rounded-3xl border-3 border-[#121316] p-6 sm:p-8 shadow-pop space-y-8">
          {/* Header Title */}
          <div className="space-y-1 border-b-2 border-[#121316]/10 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-xs">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{isResubmission ? 'REVISE PROJECT IDEA' : isEditMode ? 'EDIT PROPOSAL' : 'PITCH A PROJECT IDEA'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
              {isResubmission ? 'Update & Resubmit Your Proposal' : isEditMode ? 'Edit Your Project Proposal' : 'Propose a New Project Idea'}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-600">
              Share your project vision with ATC mentors and the student community.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* 1. Project Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-black uppercase text-[#121316]">
                  Project Title <span className="text-[#FF4757]">*</span>
                </label>
                <span className="font-mono text-[10px] text-gray-500 font-bold">
                  {title.length}/255
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. Autonomous Maze Solving Rover with LiDAR"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#121316] font-bold text-sm bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all shadow-pop-xs"
              />
            </div>

            {/* 2. Category */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-black uppercase text-[#121316] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6C5CE7]" />
                Primary Category <span className="text-[#FF4757]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#121316] font-mono text-xs font-black bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] cursor-pointer shadow-pop-xs"
              >
                {PROJECT_IDEA_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Short Summary / Pitch */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-black uppercase text-[#121316]">
                  Short Summary / Elevator Pitch <span className="text-[#FF4757]">*</span>
                </label>
                <span className="font-mono text-[10px] text-gray-500 font-bold">
                  {shortDescription.length}/500
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Briefly describe what this project does and the problem it solves (2-3 sentences)..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                maxLength={500}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#121316] font-bold text-xs sm:text-sm bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all shadow-pop-xs"
              />
            </div>

            {/* 4. Full Detailed Proposal (TipTap WYSIWYG) */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-black uppercase text-[#121316]">
                Detailed Proposal & Architecture <span className="text-[#FF4757]">*</span>
              </label>
              <p className="text-xs font-bold text-gray-500 pb-1">
                Use headings, lists, code blocks, or links to describe the hardware components, software stack, implementation phases, and lab requirements.
              </p>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your comprehensive technical proposal here..."
              />
            </div>

            {/* 5. Technologies Stack (Tags) */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-black uppercase text-[#121316] flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                Key Technologies / Hardware (Press Enter to add)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ESP32, ROS2, Python, OpenCV, React..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-[#121316] font-mono text-xs bg-[#FAF7F0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] shadow-pop-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2.5 rounded-2xl bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-pop-xs hover:shadow-pop transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>

              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] shadow-pop-xs"
                    >
                      <span>#{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(idx)}
                        className="hover:text-[#FF4757] ml-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 6. External Links & Repositories */}
            <div className="space-y-3 pt-2 border-t-2 border-[#121316]/10">
              <label className="font-mono text-xs font-black uppercase text-[#121316] flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#2ED573]" />
                External Resources & Links (Optional)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GitHub */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500 flex items-center gap-1">
                    <GithubIcon className="w-3 h-3" /> GitHub Repository
                  </span>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={links.github || ''}
                    onChange={(e) => setLinks({ ...links, github: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#121316] font-mono text-xs bg-[#FAF7F0] focus:outline-none shadow-pop-xs"
                  />
                </div>

                {/* Live Demo */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Live Demo URL
                  </span>
                  <input
                    type="url"
                    placeholder="https://my-demo-app.com"
                    value={links.demo || ''}
                    onChange={(e) => setLinks({ ...links, demo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#121316] font-mono text-xs bg-[#FAF7F0] focus:outline-none shadow-pop-xs"
                  />
                </div>

                {/* Figma */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500 flex items-center gap-1">
                    <FigmaIcon className="w-3 h-3" /> Figma / Design Link
                  </span>
                  <input
                    type="url"
                    placeholder="https://figma.com/file/..."
                    value={links.figma || ''}
                    onChange={(e) => setLinks({ ...links, figma: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#121316] font-mono text-xs bg-[#FAF7F0] focus:outline-none shadow-pop-xs"
                  />
                </div>

                {/* Other Link */}
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-black uppercase text-gray-500 flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> Other Document / Video
                  </span>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={links.other || ''}
                    onChange={(e) => setLinks({ ...links, other: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#121316] font-mono text-xs bg-[#FAF7F0] focus:outline-none shadow-pop-xs"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t-3 border-[#121316] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                to="/student/ideas"
                className="px-5 py-3 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] text-center shadow-pop-xs"
              >
                Cancel
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                {/* Draft Button */}
                <button
                  type="button"
                  onClick={() => handleSubmit('draft')}
                  disabled={submitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FAF7F0] hover:bg-gray-200 border-2 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop-sm active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting && submitAction === 'draft' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Draft</span>
                </button>

                {/* Submit for Review Button */}
                <button
                  type="button"
                  onClick={() => handleSubmit('submit')}
                  disabled={submitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-3 border-[#121316] font-mono text-xs font-black uppercase text-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting && submitAction === 'submit' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isResubmission ? 'Resubmit for Review' : 'Submit Idea for Review'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdeaPage;
