import React, { useState } from 'react';
import { GalleryHero } from '../components/gallery/GalleryHero';
import { ScrapbookMemoryCard } from '../components/gallery/ScrapbookMemoryCard';
import { GalleryLightboxModal } from '../components/gallery/GalleryLightboxModal';
import { galleryMemories, GalleryCategory, GalleryItem } from '../data/galleryData';
import { SparkleDoodle, SpiralScribble } from '../components/doodles/DoodleSvgs';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items
  const filteredMemories = selectedCategory === 'All'
    ? galleryMemories
    : galleryMemories.filter((m) => m.category === selectedCategory);

  const handleOpenLightbox = (item: GalleryItem) => {
    const idx = filteredMemories.findIndex((m) => m.id === item.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO & CATEGORY FILTERS */}
      <GalleryHero
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
        totalCount={filteredMemories.length}
      />

      {/* 2. DYNAMIC SCRAPBOOK / MEMORY WALL */}
      <section className="relative bg-[#FAF7F0] py-16 sm:py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
        
        {/* Decorative Floating Doodles in Background */}
        <div className="absolute top-10 left-8 opacity-30 pointer-events-none hidden md:block animate-pulse">
          <SparkleDoodle className="w-14 h-14" color="#6C5CE7" />
        </div>
        <div className="absolute bottom-12 right-10 opacity-30 pointer-events-none hidden md:block animate-float-slow">
          <SpiralScribble className="w-16 h-16" color="#FF793F" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Dynamic Scrapbook Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            {filteredMemories.map((item) => (
              <ScrapbookMemoryCard
                key={item.id}
                item={item}
                onSelect={handleOpenLightbox}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. FULL-SCREEN LIGHTBOX MODAL */}
      <GalleryLightboxModal
        items={filteredMemories}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

    </div>
  );
};
