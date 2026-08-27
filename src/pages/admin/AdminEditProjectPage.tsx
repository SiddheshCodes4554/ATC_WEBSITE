import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProjectService } from '../../services/projectService';
import { StorageService } from '../../services/storage.service';
import { ATCProject, ProjectStatus } from '../../types/project.types';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Plus,
  Sparkles,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Send,
  Eye,
  Edit3,
  Check,
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

export const AdminEditProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [activeStoryTab, setActiveStoryTab] = useState<'write' | 'preview'>('write');

  // Tech Stack & Links
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  // Visuals & Cover Image
  const [existingCoverImageId, setExistingCoverImageId] = useState<string | undefined>(undefined);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [shouldRemoveExistingImage, setShouldRemoveExistingImage] = useState(false);

  // Additional Photo Gallery Images
  const [existingGalleryImageIds, setExistingGalleryImageIds] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  // Publishing
  const [status, setStatus] = useState<ProjectStatus>('draft');
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  // Fetch Project on Mount
  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('Missing project ID in URL.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await ProjectService.getProjectById(id);
        if (result.success && result.data) {
          const p = result.data;
          setTitle(p.title);
          setSlug(p.slug);
          setShortDescription(p.shortDescription || '');
          setDescription(p.description || '');
          setTechStack(p.techStack || []);
          setGithubUrl(p.githubUrl || '');
          setLiveUrl(p.liveUrl || '');
          setStatus(p.status);
          setFeatured(p.featured);
          setDisplayOrder(p.displayOrder);
          setExistingCoverImageId(p.coverImageId);
          setExistingGalleryImageIds(p.galleryImageIds || []);

          if (p.coverImageId) {
            setCoverPreview(StorageService.getProjectImageUrl(p.coverImageId, 600));
          }
        } else {
          setError(result.error || 'Project not found in Appwrite.');
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err?.message || 'Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // Tech Stack Chip Handlers
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
    setShouldRemoveExistingImage(false);

    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setShouldRemoveExistingImage(true);
  };

  // Gallery Handlers
  const handleNewGalleryFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = StorageService.validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'One or more files have an invalid format.');
        return;
      }
      newFiles.push(file);
    }

    setError(null);
    setNewGalleryFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewGalleryPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(f);
    });
  };

  const handleRemoveNewGalleryFile = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingGalleryImage = async (imageId: string) => {
    setExistingGalleryImageIds((prev) => prev.filter((id) => id !== imageId));
    try {
      await StorageService.deleteProjectImage(imageId);
    } catch (delErr) {
      console.warn('Storage cleanup notice:', delErr);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!title.trim()) {
      setError('Please provide a project title.');
      return;
    }

    if (!shortDescription.trim()) {
      setError('Please provide a short description.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let finalCoverImageId = existingCoverImageId;

      // 1. Upload new cover image if provided
      if (coverFile) {
        setUploadProgress('Uploading new cover image...');
        const uploadRes = await StorageService.uploadProjectImage(coverFile);
        if (!uploadRes.success || !uploadRes.data) {
          setError(uploadRes.error || 'Failed to upload replacement cover image.');
          setSubmitting(false);
          setUploadProgress(null);
          return;
        }

        finalCoverImageId = uploadRes.data.file_id;

        // Clean up old image from storage if replaced
        if (existingCoverImageId && existingCoverImageId !== uploadRes.data.file_id) {
          try {
            await StorageService.deleteProjectImage(existingCoverImageId);
          } catch (delErr) {
            console.warn('Storage cleanup notice:', delErr);
          }
        }
      } else if (shouldRemoveExistingImage) {
        // Clean up old image if removed
        if (existingCoverImageId) {
          try {
            await StorageService.deleteProjectImage(existingCoverImageId);
          } catch (delErr) {
            console.warn('Storage cleanup notice:', delErr);
          }
        }
        finalCoverImageId = undefined;
      }

      // 2. Upload any new gallery photos
      const uploadedGalleryIds: string[] = [];
      if (newGalleryFiles.length > 0) {
        for (let i = 0; i < newGalleryFiles.length; i++) {
          setUploadProgress(`Uploading gallery photo ${i + 1} of ${newGalleryFiles.length}...`);
          const galRes = await StorageService.uploadProjectImage(newGalleryFiles[i]);
          if (galRes.success && galRes.data) {
            uploadedGalleryIds.push(galRes.data.file_id);
          } else {
            console.warn('Failed to upload gallery image:', galRes.error);
          }
        }
      }

      const finalGalleryImageIds = [...existingGalleryImageIds, ...uploadedGalleryIds];

      // 3. Update Project Document in Appwrite
      setUploadProgress('Updating project in Appwrite Database...');
      const updateResult = await ProjectService.updateProject(id, {
        title: title.trim(),
        slug: slug.trim() || undefined,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        coverImageId: finalCoverImageId || undefined,
        galleryImageIds: finalGalleryImageIds,
        techStack,
        githubUrl: githubUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        featured,
        status,
        displayOrder,
      });

      if (!updateResult.success) {
        setError(updateResult.error || 'Failed to update project.');
        setSubmitting(false);
        setUploadProgress(null);
        return;
      }

      // Success
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      navigate('/admin/projects');
    } catch (err: any) {
      console.error('Error updating project:', err);
      setError(err?.message || 'An unexpected error occurred.');
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] py-16 px-4 flex flex-col items-center justify-center paper-pattern">
        <div className="p-10 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-[#FF793F] animate-spin" />
          <p className="font-mono text-sm font-black text-[#121316]">
            Loading project data from Appwrite...
          </p>
        </div>
      </div>
    );
  }

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
                APPWRITE DATABASE • EDIT PROJECT
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight truncate max-w-xl">
                Edit: {title || 'Project'}
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
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-sm font-bold text-[#121316] focus:outline-none focus:bg-white"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-1.5">
                  URL Slug * <span className="text-gray-500 lowercase">(/projects/{slug})</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]+/g, '-')
                    )
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] focus:outline-none focus:bg-white"
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-bold text-[#121316] focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROJECT STORY */}
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] text-xs font-medium leading-relaxed text-[#121316] focus:outline-none focus:bg-white"
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
                    No description written.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: VISUALS */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b-2 border-[#121316]/10">
              <div className="w-8 h-8 rounded-xl bg-[#2ED573] border-2 border-[#121316] flex items-center justify-center font-mono text-xs font-black">
                03
              </div>
              <div>
                <h3 className="font-black text-lg text-[#121316]">Cover Visual</h3>
                <p className="font-mono text-xs text-gray-500 font-bold">
                  High-res banner or prototype screenshot
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Main Cover Image */}
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#121316] mb-2">
                  Main Cover Image (Banner)
                </label>
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
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white border-2 border-[#121316] shadow-pop-sm text-[#FF4757] hover:bg-[#FFE5E5] transition-all cursor-pointer"
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
                      Upload Replacement Cover Image
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

              {/* Additional Photo Gallery */}
              <div className="pt-4 border-t-2 border-[#121316]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-mono text-xs font-black uppercase text-[#121316]">
                      Additional Build Photos & Prototypes ({existingGalleryImageIds.length + newGalleryPreviews.length})
                    </label>
                    <span className="text-[11px] font-mono text-gray-500">
                      Upload lab photos, schematics, PCB screenshots, or demo snapshots
                    </span>
                  </div>

                  <label className="px-4 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5 cursor-pointer transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleNewGalleryFilesSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Grid of Existing & New Photos */}
                {(existingGalleryImageIds.length > 0 || newGalleryPreviews.length > 0) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {/* Existing Photos from Appwrite Storage */}
                    {existingGalleryImageIds.map((imgId) => (
                      <div
                        key={imgId}
                        className="relative rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 shadow-pop-sm group h-32"
                      >
                        <img
                          src={StorageService.getProjectImageUrl(imgId, 400)}
                          alt="Existing Gallery"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingGalleryImage(imgId)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-[#121316] shadow-pop-sm text-[#FF4757] hover:bg-[#FFE5E5] transition-all cursor-pointer"
                          title="Delete Photo from Project"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#121316]/70 text-white font-mono text-[9px] font-bold">
                          Saved
                        </span>
                      </div>
                    ))}

                    {/* Newly Selected Photos */}
                    {newGalleryPreviews.map((previewUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-2xl border-2 border-[#2ED573] overflow-hidden bg-gray-100 shadow-pop-sm group h-32"
                      >
                        <img
                          src={previewUrl}
                          alt={`New preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewGalleryFile(idx)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-[#121316] shadow-pop-sm text-[#FF4757] hover:bg-[#FFE5E5] transition-all cursor-pointer"
                          title="Cancel Upload"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#2ED573] text-[#121316] font-mono text-[9px] font-black">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] focus:outline-none focus:bg-white"
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
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] focus:outline-none focus:bg-white"
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
                  <option value="published">Published (Public)</option>
                  <option value="draft">Draft (Private)</option>
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
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-bold text-[#121316] focus:outline-none focus:bg-white"
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
                  <span>{uploadProgress || 'Saving Changes...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProjectPage;
