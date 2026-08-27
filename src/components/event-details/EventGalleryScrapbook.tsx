import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, ZoomIn } from 'lucide-react';
import { GalleryPhoto } from '../../data/eventsData';
import { SparkleDoodle } from '../doodles/DoodleSvgs';

// Vector Art Scene for Gallery Polaroid Placeholders
const GalleryVectorScene: React.FC<{ type: GalleryPhoto['svgSceneType']; title: string }> = ({ type, title }) => {
  return (
    <div className="w-full aspect-[4/3] bg-[#FAF7F0] rounded-xl border-2 border-[#121316] flex items-center justify-center p-3 relative overflow-hidden select-none">
      <svg viewBox="0 0 200 150" fill="none" className="w-full h-full">
        {type === 'chaos-code' && (
          <g>
            <rect x="20" y="20" width="160" height="110" rx="10" fill="#121316" stroke="#121316" strokeWidth="2" />
            <circle cx="35" cy="35" r="4" fill="#FF6B6B" />
            <circle cx="47" cy="35" r="4" fill="#FFE600" />
            <circle cx="59" cy="35" r="4" fill="#2ED573" />
            <path d="M 40 60 L 70 90 L 100 60" stroke="#FF4757" strokeWidth="4" strokeLinecap="round" />
            <text x="100" y="110" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#FFE600" textAnchor="middle">
              RUNAWAY_BUTTON.TSX
            </text>
          </g>
        )}

        {type === 'hacking' && (
          <g>
            {/* Laptops and coding avatars */}
            <circle cx="70" cy="55" r="22" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
            <path d="M 45 105 C 45 80 95 80 95 105" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" />
            <polygon points="50,110 110,110 100,95 60,95" fill="#2D3436" stroke="#121316" strokeWidth="2" />
            <circle cx="135" cy="55" r="22" fill="#F8C291" stroke="#121316" strokeWidth="2.5" />
            <path d="M 110 105 C 110 80 160 80 160 105" fill="#FF793F" stroke="#121316" strokeWidth="2.5" />
            <polygon points="115,110 175,110 165,95 125,95" fill="#2D3436" stroke="#121316" strokeWidth="2" />
          </g>
        )}

        {type === 'laughing' && (
          <g>
            <circle cx="100" cy="70" r="42" fill="#FFE600" stroke="#121316" strokeWidth="3.5" />
            {/* Laughing Eyes */}
            <path d="M 75 60 Q 85 50 95 60" stroke="#121316" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 105 60 Q 115 50 125 60" stroke="#121316" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Big Open Laughing Mouth */}
            <path d="M 75 75 Q 100 110 125 75 Z" fill="#FF6B6B" stroke="#121316" strokeWidth="3" />
          </g>
        )}

        {type === 'trophy' && (
          <g>
            <path d="M 70 35 H 130 V 75 C 130 95 115 105 100 105 C 85 105 70 95 70 75 Z" fill="#FFE600" stroke="#121316" strokeWidth="3" />
            <path d="M 70 45 H 50 C 50 65 65 70 70 70" stroke="#121316" strokeWidth="2.5" fill="none" />
            <path d="M 130 45 H 150 C 150 65 135 70 130 70" stroke="#121316" strokeWidth="2.5" fill="none" />
            <rect x="85" y="105" width="30" height="20" rx="4" fill="#FF793F" stroke="#121316" strokeWidth="2" />
            <text x="100" y="70" fontFamily="sans-serif" fontSize="16" fontWeight="900" textAnchor="middle" fill="#121316">1st</text>
          </g>
        )}

        {type === 'judging' && (
          <g>
            <rect x="40" y="30" width="120" height="90" rx="8" fill="#E1DCFF" stroke="#121316" strokeWidth="2.5" />
            <circle cx="80" cy="65" r="14" fill="#FFFFFF" stroke="#121316" strokeWidth="2" />
            <circle cx="120" cy="65" r="14" fill="#FFFFFF" stroke="#121316" strokeWidth="2" />
            <line x1="94" y1="65" x2="106" y2="65" stroke="#121316" strokeWidth="2.5" />
            <path d="M 85 95 Q 100 85 115 95" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {type === 'presentation' && (
          <g>
            <rect x="30" y="25" width="140" height="85" rx="8" fill="#121316" stroke="#121316" strokeWidth="2.5" />
            <rect x="40" y="35" width="120" height="65" rx="4" fill="#2ED573" />
            <text x="100" y="72" fontFamily="sans-serif" fontSize="11" fontWeight="900" textAnchor="middle" fill="#121316">
              DEMO TIME
            </text>
            <line x1="100" y1="110" x2="100" y2="135" stroke="#121316" strokeWidth="4" />
          </g>
        )}
      </svg>
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white font-mono text-[9px] rounded">
        {title}
      </div>
    </div>
  );
};

interface EventGalleryScrapbookProps {
  gallery: GalleryPhoto[];
}

export const EventGalleryScrapbook: React.FC<EventGalleryScrapbookProps> = ({ gallery }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % gallery.length);
    }
  };

  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Decorative Doodles */}
      <div className="absolute top-12 right-12 opacity-50 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#6C5CE7" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Camera className="w-5 h-5 text-[#2E86DE]" />
              ATC IN ACTION
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFD32A" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            Event Photo Scrapbook 🎞️
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            Click any polaroid to enter the full-screen immersive gallery viewer:
          </p>
        </div>

        {/* Dynamic Polaroid Collage Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {gallery.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className={`group relative p-5 pb-6 rounded-[28px] bg-white border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                photo.rotation || 'rotate-0'
              } hover:rotate-0 hover:scale-105 z-10 hover:z-20`}
            >
              {/* Tape Strip Accent */}
              <div 
                className="tape-strip pointer-events-none" 
                style={{ backgroundColor: photo.tapeColor || '#FFE600' }}
              />

              {/* Photo Area with Vector Scene */}
              <div className="relative mb-4">
                <GalleryVectorScene type={photo.svgSceneType} title={photo.category} />
                
                {/* Zoom in hover icon badge */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white">
                  <div className="p-3 bg-[#FFE600] text-[#121316] rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1 font-bold text-xs">
                    <ZoomIn className="w-4 h-4" /> View Fullscreen
                  </div>
                </div>
              </div>

              {/* Caption & Title */}
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-black text-lg text-[#121316] font-display">
                  {photo.title}
                </h4>
                <p className="text-xs sm:text-sm font-hand font-bold text-gray-700 text-lg leading-snug">
                  "{photo.caption}"
                </p>
              </div>

              {/* Bottom Meta */}
              <div className="mt-4 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-[11px] font-mono font-bold text-gray-500">
                <span>SNAPSHOT #{index + 1}</span>
                <span className="text-[#6C5CE7]">NIAT LAB 5.0</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN IMMERSIVE LIGHTBOX VIEWER MODAL */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn select-none"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#FFE600] border-3 border-[#121316] shadow-pop flex items-center justify-center text-[#121316] hover:bg-[#FF6B6B] hover:text-white transition-all cursor-pointer z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-3 border-[#121316] shadow-pop flex items-center justify-center text-[#121316] hover:bg-[#FFE600] transition-all cursor-pointer z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-3 border-[#121316] shadow-pop flex items-center justify-center text-[#121316] hover:bg-[#FFE600] transition-all cursor-pointer z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>

          {/* Lightbox Content Polaroid Card */}
          <div 
            className="relative w-full max-w-3xl bg-white rounded-[32px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 paper-pattern"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-6">
              <GalleryVectorScene 
                type={gallery[lightboxIndex].svgSceneType} 
                title={gallery[lightboxIndex].category} 
              />
            </div>

            <div className="space-y-2 text-center">
              <span className="px-3 py-1 bg-[#121316] text-[#FFE600] rounded-full text-xs font-mono font-black uppercase">
                {gallery[lightboxIndex].category} • {lightboxIndex + 1} of {gallery.length}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#121316]">
                {gallery[lightboxIndex].title}
              </h3>
              <p className="text-base sm:text-xl font-hand font-bold text-gray-800">
                "{gallery[lightboxIndex].caption}"
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
