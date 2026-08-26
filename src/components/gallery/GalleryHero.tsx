import React from 'react';
import { Sparkles, Camera, Image, Layers } from 'lucide-react';
import { GalleryCategory } from '../../data/galleryData';
import { SparkleDoodle, SpiralScribble } from '../doodles/DoodleSvgs';

interface GalleryHeroProps {
  selectedCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
  totalCount: number;
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({
  selectedCategory,
  onCategoryChange,
  totalCount,
}) => {
  const categories: GalleryCategory[] = [
    'All',
    'Events',
    'Workshops',
    'Behind the Scenes',
    'Projects',
  ];

  return (
    <section className="relative bg-[#FAF7F0] pt-12 sm:pt-16 pb-12 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-10 left-10 opacity-50 pointer-events-none hidden md:block animate-pulse">
        <SparkleDoodle className="w-12 h-12" color="#FF6B6B" />
      </div>
      <div className="absolute top-14 right-14 opacity-40 pointer-events-none hidden md:block">
        <SpiralScribble className="w-14 h-14" color="#FFE600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm font-mono font-black text-xs uppercase text-[#6C5CE7]">
            <Camera className="w-4 h-4" />
            THE LIVING SCRAPBOOK • NIAT PUNE
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121316] tracking-tight leading-[1.08]">
            ATC IN<br />
            <span className="relative inline-block px-5 py-1.5 bg-[#FF6B6B] text-white rounded-3xl border-4 border-[#121316] shadow-pop rotate-[-1.5deg] mt-1">
              ACTION.
              <Sparkles className="w-7 h-7 text-[#FFE600] absolute -top-4 -right-4 animate-bounce" />
            </span>
          </h1>

          <p className="text-base sm:text-xl font-bold text-gray-700 max-w-2xl leading-relaxed">
            The candid memories, late-night hackathons, lab triumphs, and organized chaos of Advanced Tech Club.
          </p>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 bg-white rounded-full border-3 border-[#121316] shadow-pop max-w-3xl">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-4 sm:px-6 py-2 rounded-full font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#FFE600] text-[#121316] border-2 border-[#121316] shadow-pop-sm scale-105'
                      : 'text-gray-700 hover:text-[#121316] hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
            <span>Showing {totalCount} {totalCount === 1 ? 'memory' : 'memories'}</span>
            <span>•</span>
            <span className="text-[#6C5CE7]">Click any card to open full-screen lightbox</span>
          </div>
        </div>

      </div>
    </section>
  );
};
