import React, { useState, useEffect, useRef } from 'react';
import { EventGalleryImage, UploadGalleryProgress } from '../../types/eventGallery.types';
import { EventGalleryService } from '../../services/eventGalleryService';
import { StorageService, ALLOWED_IMAGE_TYPES, MAX_EVENT_IMAGE_BYTES } from '../../services/storage.service';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle,
  Plus,
  Edit3,
  X,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { GalleryLightbox } from '../event-gallery/GalleryLightbox';
import { OptimizedImage } from '../common/OptimizedImage';

interface AdminEventGalleryManagerProps {
  eventId: string;
  onGalleryChange?: (images: EventGalleryImage[]) => void;
}

export const AdminEventGalleryManager: React.FC<AdminEventGalleryManagerProps> = ({
  eventId,
  onGalleryChange,
}) => {
  const [images, setImages] = useState<EventGalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<UploadGalleryProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active preview lightbox
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // In-line caption editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState<string>('');
  const [isSavingCaption, setIsSavingCaption] = useState<boolean>(false);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load gallery images on mount / eventId change
  const loadGallery = async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await EventGalleryService.getEventGallery(eventId);
      if (result.success && result.data) {
        setImages(result.data);
        if (onGalleryChange) onGalleryChange(result.data);
      } else {
        setErrorMessage(result.error || 'Failed to load event gallery.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error fetching gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [eventId]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle files selection & upload
  const handleFiles = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (!files.length) return;

    if (!eventId) {
      setErrorMessage('Please save the event first before uploading gallery photos.');
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    for (const f of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type.toLowerCase())) {
        setErrorMessage(`"${f.name}" is not a supported image format.`);
        return;
      }
      if (f.size > MAX_EVENT_IMAGE_BYTES) {
        setErrorMessage(`"${f.name}" exceeds the 10 MB limit.`);
        return;
      }
      validFiles.push(f);
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const result = await EventGalleryService.uploadGalleryImages(
        eventId,
        validFiles,
        (progress) => setUploadProgress(progress)
      );

      if (result.success && result.data) {
        const updatedList = [...images, ...result.data].sort((a, b) => a.displayOrder - b.displayOrder);
        setImages(updatedList);
        if (onGalleryChange) onGalleryChange(updatedList);
        showSuccess(`Successfully uploaded ${result.data.length} photo(s)!`);
      } else {
        setErrorMessage(result.error || 'Upload failed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error uploading photos.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Featured toggle
  const handleToggleFeatured = async (item: EventGalleryImage) => {
    const nextState = !item.isFeatured;
    // Optimistic update
    const updated = images.map((img) =>
      img.$id === item.$id ? { ...img, isFeatured: nextState } : img
    );
    setImages(updated);

    try {
      const res = await EventGalleryService.toggleFeaturedGalleryImage(item.$id, nextState);
      if (!res.success) {
        // Rollback
        setImages(images);
        setErrorMessage(res.error || 'Could not update featured status.');
      } else {
        showSuccess(nextState ? 'Marked as Featured!' : 'Removed Featured status.');
        if (onGalleryChange) onGalleryChange(updated);
      }
    } catch (err: any) {
      setImages(images);
      setErrorMessage(err?.message || 'Error updating featured status.');
    }
  };

  // Reorder Left / Right
  const handleMove = async (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;

    // Recalculate sequential displayOrder
    const reordered = newImages.map((img, i) => ({ ...img, displayOrder: i }));
    setImages(reordered);
    if (onGalleryChange) onGalleryChange(reordered);

    try {
      await EventGalleryService.updateGalleryOrder(
        reordered.map((img) => ({ id: img.$id, displayOrder: img.displayOrder }))
      );
    } catch (err: any) {
      console.warn('Reorder sync error:', err);
    }
  };

  // Delete Image
  const handleDelete = async (item: EventGalleryImage) => {
    if (!window.confirm('Are you sure you want to delete this gallery photo?')) return;

    const filtered = images.filter((img) => img.$id !== item.$id);
    setImages(filtered);
    if (onGalleryChange) onGalleryChange(filtered);

    try {
      const res = await EventGalleryService.deleteGalleryImage(item.$id, item.fileId);
      if (res.success) {
        showSuccess('Photo deleted successfully.');
      } else {
        setErrorMessage(res.error || 'Failed to delete photo from Appwrite.');
        loadGallery(); // Reload on failure
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error deleting photo.');
      loadGallery();
    }
  };

  // Caption inline editing
  const startEditCaption = (item: EventGalleryImage) => {
    setEditingId(item.$id);
    setEditingCaption(item.caption || '');
  };

  const saveCaption = async (id: string) => {
    setIsSavingCaption(true);
    try {
      const res = await EventGalleryService.updateGalleryImage(id, { caption: editingCaption });
      if (res.success) {
        const updated = images.map((img) =>
          img.$id === id ? { ...img, caption: editingCaption } : img
        );
        setImages(updated);
        if (onGalleryChange) onGalleryChange(updated);
        setEditingId(null);
        showSuccess('Caption updated!');
      } else {
        setErrorMessage(res.error || 'Failed to save caption.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error saving caption.');
    } finally {
      setIsSavingCaption(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#121316]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center font-mono text-xs font-black text-[#121316]">
              📸
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#121316]">
              Event Gallery & Photo Memories ({images.length})
            </h3>
          </div>
          <p className="text-xs font-bold text-gray-500 mt-1">
            Stored in Appwrite <span className="font-mono font-black text-[#6C5CE7]">event_gallery</span> & <span className="font-mono font-black text-[#6C5CE7]">event_gallery_images</span>
          </p>
        </div>

        <label className="px-4 py-2 rounded-2xl bg-[#FFE600] hover:bg-[#FFD32A] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black text-[#121316] flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload Photos</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Error & Success Banners */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#FFE5E5] border-2 border-[#FF4757] text-[#FF4757] text-xs font-bold flex items-center justify-between gap-3 animate-shake">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 rounded-lg hover:bg-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-2xl bg-[#EAFBF1] border-2 border-[#2ED573] text-[#2ED573] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-10 rounded-[32px] border-3 border-dashed text-center cursor-pointer transition-all ${
          isDragOver
            ? 'bg-[#FFF9DB] border-[#121316] scale-[1.01]'
            : 'bg-[#FAF7F0] hover:bg-[#FFF9DB] border-[#121316]/40 hover:border-[#121316]'
        }`}
      >
        <div className="max-w-md mx-auto space-y-2 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#121316] shadow-pop-sm flex items-center justify-center mx-auto text-[#6C5CE7]">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-black text-[#121316]">
            Drag & drop multiple event photos here, or click to browse
          </p>
          <p className="text-xs font-mono font-bold text-gray-500">
            JPG, PNG, WebP, AVIF up to 10 MB each • Multi-file selection supported
          </p>
        </div>
      </div>

      {/* Upload Progress Indicator */}
      {isUploading && uploadProgress && (
        <div className="p-5 rounded-2xl bg-white border-3 border-[#121316] shadow-pop-sm space-y-2">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-[#121316]">
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#6C5CE7]" />
              Uploading {uploadProgress.uploaded + 1} of {uploadProgress.total}: {uploadProgress.currentFileName}
            </span>
            <span>{uploadProgress.percentage}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-gray-100 border-2 border-[#121316] overflow-hidden">
            <div
              className="h-full bg-[#2ED573] transition-all duration-300"
              style={{ width: `${uploadProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-500 font-mono text-xs font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-[#6C5CE7]" />
          <span>Loading event gallery from Appwrite...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border-2 border-[#121316]/20 text-center space-y-2">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-xs font-bold text-gray-600">
            No gallery photos uploaded yet for this event.
          </p>
        </div>
      ) : (
        /* Image Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <div
              key={item.$id}
              className={`rounded-3xl bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all flex flex-col overflow-hidden ${
                item.isFeatured ? 'ring-2 ring-[#FFE600]' : ''
              }`}
            >
              {/* Thumbnail Stage */}
              <div className="relative aspect-[4/3] bg-gray-100 border-b-2 border-[#121316] overflow-hidden group">
                <OptimizedImage
                  src={item.previewUrl || item.imageUrl}
                  alt={item.caption || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />

                {/* Top Actions Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  {/* Position Badge */}
                  <span className="px-2.5 py-1 rounded-xl bg-[#121316]/80 text-white font-mono text-[10px] font-black pointer-events-auto">
                    #{idx + 1}
                  </span>

                  {/* Featured Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(item)}
                    className={`px-2.5 py-1 rounded-xl border-2 border-[#121316] font-mono text-[10px] font-black flex items-center gap-1 shadow-pop-sm transition-all cursor-pointer pointer-events-auto ${
                      item.isFeatured
                        ? 'bg-[#FFE600] text-[#121316]'
                        : 'bg-white/90 text-gray-700 hover:bg-[#FFE600]'
                    }`}
                    title={item.isFeatured ? 'Featured in Public Gallery' : 'Click to feature'}
                  >
                    <Star className={`w-3 h-3 ${item.isFeatured ? 'fill-[#121316]' : ''}`} />
                    <span>{item.isFeatured ? 'Featured' : 'Feature'}</span>
                  </button>
                </div>

                {/* Enlarge Preview Button */}
                <button
                  type="button"
                  onClick={() => setPreviewIndex(idx)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  title="View full size"
                >
                  <span className="px-3.5 py-1.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </span>
                </button>
              </div>

              {/* Card Footer: Caption & Controls */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#FAF7F0]">
                {/* Caption Input / Display */}
                <div>
                  {editingId === item.$id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingCaption}
                        onChange={(e) => setEditingCaption(e.target.value)}
                        placeholder="Add photo caption..."
                        className="w-full px-3 py-1.5 rounded-xl border-2 border-[#121316] bg-white font-sans text-xs font-bold outline-none"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => saveCaption(item.$id)}
                          disabled={isSavingCaption}
                          className="px-3 py-1 rounded-lg bg-[#2ED573] text-[#121316] border border-[#121316] font-mono text-[10px] font-black flex items-center gap-1 cursor-pointer"
                        >
                          {isSavingCaption ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 font-mono text-[10px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 group/cap">
                      <p className="text-xs font-bold text-gray-800 line-clamp-2">
                        {item.caption || <span className="text-gray-400 italic font-normal">No caption added</span>}
                      </p>
                      <button
                        type="button"
                        onClick={() => startEditCaption(item)}
                        className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 cursor-pointer flex-shrink-0"
                        title="Edit caption"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Control Bar: Reorder & Delete */}
                <div className="pt-2 border-t border-[#121316]/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'left')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-xl bg-white border border-[#121316] shadow-pop-sm hover:bg-[#FFE600] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                      title="Move Left / Earlier"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'right')}
                      disabled={idx === images.length - 1}
                      className="p-1.5 rounded-xl bg-white border border-[#121316] shadow-pop-sm hover:bg-[#FFE600] disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                      title="Move Right / Later"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-xl bg-[#FFE5E5] text-[#FF4757] border border-[#121316] shadow-pop-sm hover:bg-red-200 cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview */}
      {previewIndex !== null && (
        <GalleryLightbox
          images={images}
          currentIndex={previewIndex}
          isOpen={previewIndex !== null}
          onClose={() => setPreviewIndex(null)}
          onNavigate={(newIdx) => setPreviewIndex(newIdx)}
          theme="playful"
        />
      )}
    </div>
  );
};

export default AdminEventGalleryManager;
