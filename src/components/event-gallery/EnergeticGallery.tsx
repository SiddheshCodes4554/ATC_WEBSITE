import React, { useState } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { GalleryLightbox } from './GalleryLightbox';
import { OptimizedImage } from '../common/OptimizedImage';
import { Flame, Zap, Maximize2, Star } from 'lucide-react';

interface EnergeticGalleryProps {
  images: EventGalleryImage[];
  isCompleted?: boolean;
}

export const EnergeticGallery: React.FC<EnergeticGalleryProps> = ({ images, isCompleted }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="p-6 sm:p-8 rounded-[36px] bg-[#FF4757] border-4 border-[#121316] shadow-pop-xl text-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#FF4757] border-2 border-[#121316] font-mono text-xs font-black uppercase shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-[#FF4757]" />
                <span>HIGH-VOLTAGE MOMENTS ({images.length})</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight uppercase italic">
                {isCompleted ? 'High-Voltage Recap ⚡' : 'Energy & Building Moments'}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-white/90">
                High-speed hacking, live project demos, and adrenaline snapshots
              </p>
            </div>

            <span className="text-[11px] font-mono font-bold text-white/80 hidden sm:block">
              CLICK TO ZOOM IN ⚡
            </span>
          </div>
        </div>

        {/* Dynamic Energetic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <div
              key={item.$id}
              onClick={() => setActiveIdx(idx)}
              className="p-3.5 rounded-[28px] bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group space-y-3"
            >
              {/* Photo Box */}
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 relative border-2 border-[#121316]">
                <OptimizedImage
                  src={item.previewUrl || item.imageUrl}
                  alt={item.caption || `High-energy moment ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  containerClassName="w-full h-full"
                />

                {item.isFeatured && (
                  <div className="absolute top-2 right-2 z-10 px-2.5 py-0.5 rounded-full bg-[#FFE600] text-[#121316] border-2 border-[#121316] font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-[#121316]" /> HIGHLIGHT
                  </div>
                )}

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#FFE600] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5 pointer-events-auto">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Enlarge</span>
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="px-1 text-xs space-y-1">
                <p className="font-black text-[#121316] truncate">
                  {item.caption || `Sprint Frame #${idx + 1}`}
                </p>
                <div className="flex items-center justify-between font-mono text-[10px] font-bold text-gray-500">
                  <span>ENERGY // 100%</span>
                  <span>ATC SPRINTS</span>
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
          theme="energetic"
        />
      )}
    </section>
  );
};

export default EnergeticGallery;
