import React, { useState } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { GalleryLightbox } from './GalleryLightbox';
import { FlaskConical, Maximize2, Star } from 'lucide-react';

interface ExperimentalGalleryProps {
  images: EventGalleryImage[];
  isCompleted?: boolean;
}

export const ExperimentalGallery: React.FC<ExperimentalGalleryProps> = ({ images, isCompleted }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-[#121316] border-4 border-[#FFE600] text-[#FFE600] shadow-pop-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black uppercase">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>LAB EXPERIMENTS & PROTOTYPE FRAMES 🧪</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isCompleted ? 'Creative Sandbox Artifacts' : 'Experimental Lab Captures'}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-300">
                {images.length} unconventional snapshots from late-night student builds
              </p>
            </div>

            <span className="text-[11px] font-mono text-gray-400 hidden sm:block">
              CLICK FRAME TO EXPAND 🧪
            </span>
          </div>
        </div>

        {/* Staggered Experimental Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => {
            const rotations = ['rotate-[1deg]', 'rotate-[-1.5deg]', 'rotate-[0.5deg]', 'rotate-[-2deg]'];
            const cardRotate = rotations[idx % rotations.length];

            return (
              <div
                key={item.$id}
                onClick={() => setActiveIdx(idx)}
                className={`p-3.5 rounded-[28px] bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg hover:rotate-0 hover:scale-[1.02] transition-all duration-300 cursor-pointer group space-y-3 ${cardRotate}`}
              >
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 relative border-2 border-[#121316]">
                  <img
                    src={item.previewUrl || item.imageUrl}
                    alt={item.caption || `Lab artifact ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {item.isFeatured && (
                    <div className="absolute top-2 right-2 z-10 px-2.5 py-0.5 rounded-full bg-[#FF4757] text-white border-2 border-[#121316] font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-white" /> Featured
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </span>
                  </div>
                </div>

                <div className="px-1 text-xs space-y-1">
                  <p className="font-black text-[#121316] truncate">
                    {item.caption || `Experiment #${idx + 1}`}
                  </p>
                  <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 font-bold">
                    <span>STATUS: DOCUMENTED</span>
                    <span>EXP 5.0</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <GalleryLightbox
          images={images}
          currentIndex={activeIdx}
          isOpen={activeIdx !== null}
          onClose={() => setActiveIdx(null)}
          onNavigate={(newIdx) => setActiveIdx(newIdx)}
          theme="experimental"
        />
      )}
    </section>
  );
};

export default ExperimentalGallery;
