import React, { useState } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { GalleryLightbox } from './GalleryLightbox';
import { OptimizedImage } from '../common/OptimizedImage';
import { Cpu, Maximize2, Star, Shield, Layers } from 'lucide-react';

interface FuturisticGalleryProps {
  images: EventGalleryImage[];
  isCompleted?: boolean;
}

export const FuturisticGallery: React.FC<FuturisticGalleryProps> = ({ images, isCompleted }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-[#0B0F19] border-4 border-[#121316] shadow-pop-xl text-cyan-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <span>EVENT ARCHIVE // VISUAL RECORDS</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {isCompleted ? 'Decentralized Vault Records' : 'Optical Telemetry & Memory Blocks'}
              </h3>
              <p className="text-xs sm:text-sm text-cyan-200/70 font-mono">
                {images.length} verified image nodes registered in club repository
              </p>
            </div>

            <span className="text-[11px] font-mono text-cyan-400/60 hidden sm:block">
              CLICK RECORD TO EXPAND //
            </span>
          </div>
        </div>

        {/* Futuristic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <div
              key={item.$id}
              onClick={() => setActiveIdx(idx)}
              className="group relative rounded-[28px] bg-[#0B0F19] border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-300 cursor-pointer overflow-hidden p-3.5 space-y-3"
            >
              {/* Featured Badge */}
              {item.isFeatured && (
                <div className="absolute top-5 right-5 z-20 px-2.5 py-1 rounded-full bg-cyan-400 text-[#0B0F19] font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-[#0B0F19]" /> PINNED NODE
                </div>
              )}

              {/* Holographic Frame */}
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/60 relative border border-cyan-500/30">
                <OptimizedImage
                  src={item.previewUrl || item.imageUrl}
                  alt={item.caption || `Telemetry snapshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  containerClassName="w-full h-full bg-black/60"
                />

                <div className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-xl bg-cyan-400 text-[#0B0F19] font-mono text-xs font-black flex items-center gap-1.5 shadow-lg pointer-events-auto">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expand Node</span>
                  </span>
                </div>
              </div>

              {/* Caption & Coordinates */}
              <div className="px-1 text-cyan-300 font-mono text-xs space-y-1">
                <p className="font-bold truncate text-white">
                  {item.caption || `Telemetry Frame #${idx + 1}`}
                </p>
                <div className="flex items-center justify-between text-[10px] text-cyan-400/60">
                  <span>BLOCK #{idx + 1}</span>
                  <span>NODE: ACTIVE</span>
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
          theme="futuristic"
        />
      )}
    </section>
  );
};

export default FuturisticGallery;
