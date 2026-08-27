import React, { useState } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { GalleryLightbox } from './GalleryLightbox';
import { OptimizedImage } from '../common/OptimizedImage';
import { Camera, Maximize2, Star, Eye } from 'lucide-react';

interface EditorialGalleryProps {
  images: EventGalleryImage[];
  isCompleted?: boolean;
}

export const EditorialGallery: React.FC<EditorialGalleryProps> = ({ images, isCompleted }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-gray-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-mono text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>VISUAL DOCUMENTATION ({images.length})</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-[#121316] tracking-tight">
              {isCompleted ? 'Moments from the Event' : 'Event Photo Gallery'}
            </h3>
            <p className="text-sm font-medium text-gray-600">
              A curated photographic record of keynote sessions, workshops, and team presentations
            </p>
          </div>

          <span className="text-xs font-mono text-gray-500 hidden sm:block">
            CLICK TO EXPAND PHOTO 🔍
          </span>
        </div>

        {/* Dynamic Responsive Grid */}
        <div
          className={
            images.length === 1
              ? 'max-w-2xl mx-auto'
              : images.length === 2
              ? 'grid grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto gap-8'
              : images.length === 3
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          }
        >
          {images.map((item, idx) => (
            <div
              key={item.$id}
              onClick={() => setActiveIdx(idx)}
              className="group cursor-pointer rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Photo Box */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                <OptimizedImage
                  src={item.previewUrl || item.imageUrl}
                  alt={item.caption || `Event moment ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  containerClassName="w-full h-full"
                />

                {item.isFeatured && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-[#FFE600] text-[#121316] border border-[#121316] font-mono text-[10px] font-black uppercase flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-[#121316]" /> Featured
                  </div>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-white font-mono text-xs font-bold text-[#121316] shadow-md flex items-center gap-1.5 pointer-events-auto">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Image</span>
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2">
                  {item.caption || `Moment #${idx + 1} from ATC Event`}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>FRAME #{idx + 1}</span>
                  <span>NIAT PUNE</span>
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
          theme="editorial"
        />
      )}
    </section>
  );
};

export default EditorialGallery;
