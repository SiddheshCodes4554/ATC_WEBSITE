import React, { useState } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { GalleryLightbox } from './GalleryLightbox';
import { OptimizedImage } from '../common/OptimizedImage';
import { Network, Maximize2, Star, Share2 } from 'lucide-react';

interface DigitalGalleryProps {
  images: EventGalleryImage[];
  isCompleted?: boolean;
}

export const DigitalGallery: React.FC<DigitalGalleryProps> = ({ images, isCompleted }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-[#1E1B4B] border-4 border-[#121316] shadow-pop-xl text-indigo-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold uppercase">
                <Network className="w-3.5 h-3.5" />
                <span>DATA CLUSTERS // CAPTURED FRAMES</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isCompleted ? 'Network Memory Nodes' : 'Live Data Stream & Snapshots'}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200/70 font-mono">
                {images.length} connected visual clusters
              </p>
            </div>

            <span className="text-[11px] font-mono text-indigo-300/60 hidden sm:block">
              CLICK TO VIEW FULL CLUSTER 🔍
            </span>
          </div>
        </div>

        {/* Digital Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <div
              key={item.$id}
              onClick={() => setActiveIdx(idx)}
              className="group rounded-[28px] bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-300 cursor-pointer overflow-hidden p-3.5 space-y-3"
            >
              {/* Thumbnail Container */}
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 relative border-2 border-[#121316]">
                <OptimizedImage
                  src={item.previewUrl || item.imageUrl}
                  alt={item.caption || `Data frame ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  containerClassName="w-full h-full"
                />

                {item.isFeatured && (
                  <div className="absolute top-2 right-2 z-10 px-2.5 py-0.5 rounded-full bg-[#6C5CE7] text-white font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-white" /> Featured
                  </div>
                )}

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5 pointer-events-auto">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Data</span>
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="px-1 text-xs space-y-1">
                <p className="font-bold text-[#121316] truncate">
                  {item.caption || `Data Cluster #${idx + 1}`}
                </p>
                <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 font-bold">
                  <span>PACKET #{idx + 1}</span>
                  <span>SYNCED ✓</span>
                </div>
              </div>
            </div>
          ))}
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
          theme="digital"
        />
      )}
    </section>
  );
};

export default DigitalGallery;
