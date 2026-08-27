import React, { useEffect, useCallback } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { X, ChevronLeft, ChevronRight, Star, Maximize2 } from 'lucide-react';

interface GalleryLightboxProps {
  images: EventGalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  theme?: string;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  theme = 'playful',
}) => {
  const total = images.length;
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    const newIdx = (currentIndex - 1 + total) % total;
    onNavigate(newIdx);
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    const newIdx = (currentIndex + 1) % total;
    onNavigate(newIdx);
  }, [currentIndex, total, onNavigate]);

  // Keyboard navigation listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  const isTerminal = theme === 'terminal';
  const isFuturistic = theme === 'futuristic' || theme === 'digital';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox preview"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fadeIn select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-[36px] overflow-hidden ${
          isTerminal
            ? 'bg-[#0F172A] border-2 border-emerald-500/40 text-emerald-400 font-mono shadow-2xl'
            : isFuturistic
            ? 'bg-[#0B0F19] border-2 border-cyan-500/40 text-cyan-300 shadow-2xl'
            : 'bg-white border-4 border-[#121316] shadow-pop-2xl text-[#121316]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-current/15 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-wider opacity-80">
              {currentIndex + 1} / {total}
            </span>

            {currentImage.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-[#FFE600] text-[#121316] border border-[#121316] font-mono text-[10px] font-black uppercase flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-[#121316]" /> Featured Moment
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono opacity-50 hidden sm:inline-block">
              Use ← → keys to navigate • ESC to exit
            </span>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
                isTerminal
                  ? 'border-emerald-500/40 hover:bg-emerald-500/20 text-emerald-400'
                  : isFuturistic
                  ? 'border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-300'
                  : 'border-[#121316] bg-[#FFE5E5] text-[#FF4757] hover:bg-red-200 shadow-pop-sm'
              }`}
              title="Close (Esc)"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Main Image Stage */}
        <div className="relative flex-1 min-h-0 bg-black/40 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <img
            src={currentImage.imageUrl || currentImage.previewUrl}
            alt={currentImage.caption || `Event memory ${currentIndex + 1}`}
            className="max-h-[68vh] w-auto max-w-full object-contain rounded-2xl border border-white/10 shadow-lg"
          />

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl border-2 transition-all cursor-pointer z-10 ${
                  isTerminal
                    ? 'bg-[#0F172A]/90 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20'
                    : isFuturistic
                    ? 'bg-[#0B0F19]/90 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'
                    : 'bg-white border-[#121316] text-[#121316] hover:bg-[#FFE600] shadow-pop'
                }`}
                title="Previous Image (Left Arrow)"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl border-2 transition-all cursor-pointer z-10 ${
                  isTerminal
                    ? 'bg-[#0F172A]/90 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20'
                    : isFuturistic
                    ? 'bg-[#0B0F19]/90 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'
                    : 'bg-white border-[#121316] text-[#121316] hover:bg-[#FFE600] shadow-pop'
                }`}
                title="Next Image (Right Arrow)"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </>
          )}
        </div>

        {/* Bottom Caption Bar */}
        <div className="px-6 py-4 border-t border-current/15 flex-shrink-0 flex items-center justify-between gap-4">
          <div className="overflow-hidden">
            <p className="text-xs sm:text-sm font-bold truncate">
              {currentImage.caption || `ATC Event Snapshot #${currentIndex + 1}`}
            </p>
            <span className="text-[10px] font-mono opacity-60">
              NIAT Pune • Advanced Tech Club
            </span>
          </div>

          <span className="font-mono text-xs opacity-70 flex-shrink-0">
            {currentIndex + 1} of {total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GalleryLightbox;
