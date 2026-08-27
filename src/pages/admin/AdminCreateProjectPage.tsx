import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProjectService } from '../../services/projectService';
import { StorageService } from '../../services/storage.service';
import { ProjectStatus } from '../../types/project.types';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Plus,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  FolderGit2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Send,
  Eye,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_TECH_TAGS = [
  'React',
  'TypeScript',
  'Python',
  'ROS 2',
  'C++',
  'Solidity',
  'Tailwind CSS',
  'Node.js',
  'OpenCV',
  'PyTorch',
  'Appwrite',
  'ESP32',
  'Arduino',
  'Raspberry Pi',
  'Next.js',
  'Docker',
];

export const AdminCreateProjectPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [activeStoryTab, setActiveStoryTab] = useState<'write' | 'preview'>('write');

  // Tech Stack & Links
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  // Visuals & Cover Image
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Publishing
  const [status, setStatus] = useState<ProjectStatus>('draft');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number | undefined>(undefined);

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
    );
  };

  // Tech Stack Chip Management
  const handleAddTech = (techToAdd?: string) => {
    const value = (techToAdd || techInput).trim();
    if (!value) return;
    if (!techStack.includes(value)) {
      setTechStack([...techStack, value]);
    }
    setTechInput('');
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== techToRemove));
  };

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTech();
    }
  };

  // Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = StorageService.validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid image file.');
      return;
    }

    setError(null);
    setCoverFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a project title.');
      return;
    }

    if (!shortDescription.trim()) {
      setError('Please provide a short description for cards.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // 1. Upload Cover Image if selected
      let uploadedImageId: string | undefined = undefined;
      if (coverFile) {
        setUploadProgress('Uploading cover image to Appwrite Storage...');
        const uploadRes = await StorageService.uploadProjectImage(coverFile);
        if (!uploadRes.success || !uploadRes.data) {
          setError(uploadRes.error || 'Failed to upload cover image.');
          setSubmitting(false);
          setUploadProgress(null);
          return;
        }
        uploadedImageId = uploadRes.data.file_id;
      }

      // 2. Create Project in Database
      setUploadProgress('Saving project to Appwrite Database...');
      const createResult = await ProjectService.createProject({
        title: title.trim(),
        slug: slug.trim() || undefined,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        coverImageId: uploadedImageId,
        techStack,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        featured,
        status,
        displayOrder,
      });

      if (!createResult.success) {
        // Clean up uploaded image if project creation fails
        if (uploadedImageId) {
          await StorageService.deleteProjectImage(uploadedImageId);
        }
        setError(createResult.error || 'Failed to save project.');
        setSubmitting(false);
        setUploadProgress(null);
        return;
      }

      // Success
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      navigate('/admin/projects');
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err?.message || 'An unexpected error occurred while saving.');
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4 sm:px-6 lg:px-8 paper-pattern select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/projects"
              className="w-10 h-10 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center hover:bg-[#FFE600] transition-colors"
              title="Back to Projects"
            >
              <ArrowLeft className="w-5 h-5 text-[#121316]" />
            </Link>
            <div>
              <span className="font-mono text-xs font-black uppercase text-[#FF793F]">
                NEW PROJECT BUILDER
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
                Create Project
              </h1>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#FF4757] font-bold text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                01
              </div>
              <div>
                <h3 className="font-black text-lg text-[#121316]">Basic Information</h3>
                <p className="font-mono text-xs text-gray-500 font-bold">
                  Identity and URL routing for the project showcase
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Title */}
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Autonomous Campus Rover ROS 2"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-sm font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  URL Slug * <span className="text-gray-500 lowercase">(/projects/{slug || 'my-project'})</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. autonomous-campus-rover"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  Short Description (Card Teaser) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A one or two-sentence hook displayed on project cards..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROJECT STORY & ARCHITECTURE */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop space-y-6">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#121316]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                  02
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#121316]">Project Story & Architecture</h3>
                  <p className="font-mono text-xs text-gray-500 font-bold">
                    Full long-form breakdown for the project details page
                  </p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-[#FAF7F0] rounded-xl border border-[#121316]">
                <button
                  type="button"
                  onClick={() => setActiveStoryTab('write')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-black transition-all ${
                    activeStoryTab === 'write'
                      ? 'bg-[#121316] text-white'
                      : 'text-gray-600 hover:text-[#121316]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryTab('preview')}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-black transition-all ${
                    activeStoryTab === 'preview'
                      ? 'bg-[#121316] text-white'
                      : 'text-gray-600 hover:text-[#121316]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Preview
                </button>
              </div>
            </div>

            {activeStoryTab === 'write' ? (
              <div>
                <textarea
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the background problem, hardware/software design decisions, sensor integration, challenges solved, and results..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-medium leading-relaxed text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] min-h-[180px] prose prose-sm max-w-none text-xs leading-relaxed text-gray-800">
                {description ? (
                  description.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-3 whitespace-pre-line font-medium">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400 italic font-mono text-center pt-8">
                    No description written yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: VISUALS & COVER IMAGE */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#2ED573] border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                03
              </div>
              <div>
                <h3 className="font-black text-lg text-[#121316]">Cover Visual</h3>
                <p className="font-mono text-xs text-gray-500 font-bold">
                  High-res banner or prototype screenshot (stored in project_images bucket)
                </p>
              </div>
            </div>

            <div>
              {coverPreview ? (
                <div className="relative rounded-3xl border-3 border-[#121316] overflow-hidden bg-gray-100 shadow-pop-sm max-w-xl">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white border-2 border-[#121316] shadow-pop-sm text-[#FF4757] hover:bg-[#FFE5E5] transition-all"
                    title="Remove Cover Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[#FAF7F0] border-3 border-dashed border-[#121316]/40 hover:border-[#121316] transition-all cursor-pointer text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center text-[#FF793F] group-hover:scale-110 transition-transform mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <span className="font-mono text-xs font-black uppercase text-[#121316] block">
                    Upload Project Cover Image
                  </span>
                  <span className="font-mono text-[11px] text-gray-500 block mt-1">
                    JPG, PNG, WebP or AVIF up to 10 MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* SECTION 4: TECH STACK & LINKS */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#00D2D3] border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                04
              </div>
              <div>
                <h3 className="font-black text-lg text-[#121316]">Tech Stack & Source Links</h3>
                <p className="font-mono text-xs text-gray-500 font-bold">
                  Technologies, GitHub repository, and live web demo
                </p>
              </div>
            </div>

            {/* Tech Stack Chip Editor */}
            <div className="space-y-3">
              <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                Tech Stack Tags
              </label>

              {/* Existing Chips */}
              <div className="flex flex-wrap gap-2 min-h-[38px] p-2 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316]">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#121316] shadow-pop-sm font-mono text-xs font-bold text-[#121316]"
                  >
                    #{tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="text-gray-400 hover:text-[#FF4757] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                <div className="flex-1 flex items-center min-w-[140px]">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    placeholder="Type technology & press Enter..."
                    className="w-full bg-transparent px-2 py-1 text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTech()}
                    className="p-1 rounded-lg bg-white border border-[#121316] text-[#121316] hover:bg-[#FFE600] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-gray-500">Quick Add:</span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TECH_TAGS.map((tag) => {
                    const isSelected = techStack.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTech(tag)}
                        disabled={isSelected}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border border-[#121316] transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                            : 'bg-white text-gray-700 hover:bg-[#FFE600] hover:text-[#121316]'
                        }`}
                      >
                        +{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Source & Live Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  Live Demo / Deployment URL
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://myproject.atc.club"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: PUBLISHING & VISIBILITY */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#FF793F] text-white border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                05
              </div>
              <div>
                <h3 className="font-black text-lg text-[#121316]">Publishing & Showcase Status</h3>
                <p className="font-mono text-xs text-gray-500 font-bold">
                  Visibility on the public /projects directory
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              {/* Status Selector */}
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] cursor-pointer focus:outline-none"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Display Order */}
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={displayOrder ?? ''}
                  onChange={(e) =>
                    setDisplayOrder(e.target.value ? parseInt(e.target.value, 10) : undefined)
                  }
                  placeholder="Auto (Next available)"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="pt-5 sm:pt-4">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] cursor-pointer hover:bg-[#FFF9DB] transition-colors">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-[#121316] text-[#FFE600] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-black text-xs text-[#121316] block">
                      ★ Featured Project
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 block">
                      Prominently showcases in hero grid
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              to="/admin/projects"
              className="px-6 py-3.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] border-3 border-[#121316] shadow-pop hover:shadow-pop-lg active:translate-x-[1px] active:translate-y-[1px] font-mono text-sm font-black text-[#121316] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploadProgress || 'Creating Project...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProjectPage;
