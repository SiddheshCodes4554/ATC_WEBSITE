import React, { useEffect } from 'react';
import { GalleryItem } from '../../data/galleryData';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles } from 'lucide-react';
import { MemoryVectorScene } from './ScrapbookMemoryCard';

interface GalleryLightboxModalProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const GalleryLightboxModal: React.FC<GalleryLightboxModalProps> = ({
  items,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % items.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn select-none overflow-y-auto"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center text-[#121316] hover:bg-[#FF6B6B] hover:text-white transition-all cursor-pointer z-50"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Prev Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-3 border-[#121316] shadow-pop flex items-center justify-center text-[#121316] hover:bg-[#FFE600] transition-all cursor-pointer z-50"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Next Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-3 border-[#121316] shadow-pop flex items-center justify-center text-[#121316] hover:bg-[#FFE600] transition-all cursor-pointer z-50"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Modal Polaroid Card */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-10 paper-pattern my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Memory Vector Showcase */}
        <div className="relative mb-6">
          <MemoryVectorScene type={currentItem.svgSceneType} />
        </div>

        {/* Narrative Details */}
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="px-3.5 py-1 bg-[#121316] text-[#FFE600] rounded-full text-xs font-mono font-black uppercase">
              {currentItem.category} • MEMORY #{currentIndex + 1} OF {items.length}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight">
            {currentItem.title}
          </h3>

          <p className="text-lg sm:text-2xl font-hand font-bold text-gray-800 leading-snug">
            "{currentItem.caption}"
          </p>

          {/* Location & Date Footer */}
          <div className="pt-4 border-t-2 border-[#121316]/10 flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FF793F]" />
              {currentItem.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2E86DE]" />
              {currentItem.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
