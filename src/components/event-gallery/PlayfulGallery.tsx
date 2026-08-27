import React, { useState } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { GalleryLightbox } from './GalleryLightbox';
import { Maximize2, Star, Sparkles } from 'lucide-react';

interface PlayfulGalleryProps {
  images: EventGalleryImage[];
  isCompleted?: boolean;
}

export const PlayfulGallery: React.FC<PlayfulGalleryProps> = ({ images, isCompleted }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-[#121316]/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
              <span>📸 EVENT SCRAPBOOK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#121316]" />
              <span>
                {images.length} {images.length === 1 ? 'MOMENT' : 'MOMENTS'}
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
              {isCompleted ? 'The Chaos, Captured 📸' : 'Captured Memories & Highlights'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-gray-600">
              Live moments, team demos, coding sprints, and stage snapshots from ATC Lab
            </p>
          </div>

          <span className="text-[11px] font-mono font-bold text-gray-500 hidden sm:block">
            CLICK ANY PHOTO TO ENLARGE 🔍
          </span>
        </div>

        {/* Dynamic Responsive Scrapbook Grid */}
        <div
          className={
            images.length === 1
              ? 'max-w-xl mx-auto'
              : images.length === 2
              ? 'grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-8'
              : images.length === 3
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          }
        >
          {images.map((item, idx) => {
            const rotations = ['rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-2deg]', 'rotate-[2deg]'];
            const tapeColors = ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'];
            const cardRotate = rotations[idx % rotations.length];
            const tapeColor = tapeColors[idx % tapeColors.length];

            return (
              <div
                key={item.$id}
                onClick={() => setActiveIdx(idx)}
                className={`relative p-3.5 sm:p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-300 cursor-pointer group hover:rotate-0 hover:scale-[1.03] ${cardRotate}`}
              >
                {/* Washi Tape Accent Sticker */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 border-2 border-[#121316] shadow-sm z-10 opacity-95 rotate-[-1deg]"
                  style={{ backgroundColor: tapeColor }}
                />

                {/* Featured Badge Ribbon */}
                {item.isFeatured && (
                  <div className="absolute top-2 right-2 z-20 px-2.5 py-0.5 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono text-[9px] font-black text-[#121316] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#121316]" /> FEATURED
                  </div>
                )}

                {/* Photo Container */}
                <div className="aspect-[4/3] w-full rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 relative mt-1">
                  <img
                    src={item.previewUrl || item.imageUrl}
                    alt={item.caption || `Event memory ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Full Size</span>
                    </span>
                  </div>
                </div>

                {/* Bottom Polaroid Caption */}
                <div className="pt-3 px-1 space-y-1">
                  {item.caption ? (
                    <p className="text-xs font-bold text-[#121316] line-clamp-1">
                      {item.caption}
                    </p>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gray-500">
                      <span className="text-[#121316]">SNAPSHOT #{idx + 1}</span>
                      <span>ATC LAB 5.0</span>
                    </div>
                  )}
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
          theme="playful"
        />
      )}
    </section>
  );
};

export default PlayfulGallery;
