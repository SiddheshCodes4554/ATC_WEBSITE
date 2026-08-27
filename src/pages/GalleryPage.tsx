import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventGalleryService } from '../services/eventGalleryService';
import { EventService } from '../services/eventService';
import { StorageService } from '../services/storage.service';
import { EventGalleryImage } from '../types/eventGallery.types';
import { ATCEvent } from '../types/event.types';
import { GalleryLightbox } from '../components/event-gallery/GalleryLightbox';
import { OptimizedImage } from '../components/common/OptimizedImage';
import {
  Camera,
  Sparkles,
  Maximize2,
  Star,
  Calendar,
  ArrowUpRight,
  Loader2,
  ImageIcon,
  Filter,
} from 'lucide-react';
import { SparkleDoodle, SpiralScribble } from '../components/doodles/DoodleSvgs';

interface EnrichedGalleryItem extends EventGalleryImage {
  eventTitle?: string;
  eventSlug?: string;
  eventType?: string;
  formattedDate?: string;
}

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [images, setImages] = useState<EnrichedGalleryItem[]>([]);
  const [events, setEvents] = useState<Record<string, ATCEvent>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGalleryData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all events for enrichment
        const eventsMap: Record<string, ATCEvent> = {};
        const eventsRes = await EventService.getAllEvents();
        if (eventsRes.success && eventsRes.data) {
          for (const ev of eventsRes.data) {
            eventsMap[ev.$id] = ev;
          }
        }
        if (isMounted) setEvents(eventsMap);

        // 2. Fetch all real gallery images from Appwrite event_gallery collection
        const galleryRes = await EventGalleryService.getAllGalleryImages(100);
        if (isMounted && galleryRes.success && galleryRes.data) {
          const enriched: EnrichedGalleryItem[] = galleryRes.data.map((item) => {
            const ev = eventsMap[item.eventId];
            let dateStr = '';
            if (ev?.startDate) {
              try {
                dateStr = new Date(ev.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              } catch {
                dateStr = '';
              }
            }

            return {
              ...item,
              eventTitle: ev?.title || 'ATC Event',
              eventSlug: ev?.slug || '',
              eventType: ev?.eventType || 'event',
              formattedDate: dateStr,
            };
          });

          // Also if some events have legacy galleryImageIds not yet in event_gallery, include them
          if (eventsRes.success && eventsRes.data) {
            for (const ev of eventsRes.data) {
              if (ev.galleryImageIds && Array.isArray(ev.galleryImageIds)) {
                for (let idx = 0; idx < ev.galleryImageIds.length; idx++) {
                  const fileId = ev.galleryImageIds[idx];
                  // If not already in enriched by fileId
                  const alreadyExists = enriched.some((e) => e.fileId === fileId);
                  if (!alreadyExists && fileId) {
                    enriched.push({
                      $id: `legacy-${ev.$id}-${idx}`,
                      eventId: ev.$id,
                      fileId: fileId,
                      caption: `${ev.title} Moment #${idx + 1}`,
                      displayOrder: idx,
                      isFeatured: idx === 0,
                      $createdAt: ev.$createdAt,
                      $updatedAt: ev.$updatedAt,
                      imageUrl: StorageService.getEventImageUrl(fileId, 1600),
                      previewUrl: StorageService.getEventImageUrl(fileId, 800),
                      eventTitle: ev.title,
                      eventSlug: ev.slug,
                      eventType: ev.eventType || 'event',
                      formattedDate: ev.startDate ? new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                    });
                  }
                }
              }
            }
          }

          setImages(enriched);
        }
      } catch (err) {
        console.warn('Error loading public gallery:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadGalleryData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter categories
  const categories = ['All', 'Featured', 'Workshops', 'Hackathons', 'Tech Talks'];

  const filteredImages = images.filter((item) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Featured') return Boolean(item.isFeatured);
    const type = (item.eventType || '').toLowerCase();
    if (selectedCategory === 'Workshops') return type.includes('workshop');
    if (selectedCategory === 'Hackathons') return type.includes('hackathon');
    if (selectedCategory === 'Tech Talks') return type.includes('talk') || type.includes('tech');
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
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
              ATC IN
              <br />
              <span className="relative inline-block px-5 py-1.5 bg-[#FF6B6B] text-white rounded-3xl border-4 border-[#121316] shadow-pop rotate-[-1.5deg] mt-1">
                ACTION.
                <Sparkles className="w-7 h-7 text-[#FFE600] absolute -top-4 -right-4 animate-bounce" />
              </span>
            </h1>

            <p className="text-base sm:text-xl font-bold text-gray-700 max-w-2xl leading-relaxed">
              Real moments, live workshops, coding sprints, stage talks, and student hackathons from Advanced Tech Club.
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
                    onClick={() => setSelectedCategory(cat)}
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
              <span>
                Showing {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
              </span>
              <span>•</span>
              <span className="text-[#6C5CE7]">Click any photo to open full-screen view</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC PHOTO GRID */}
      <section className="relative bg-[#FAF7F0] py-16 sm:py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {loading ? (
            <div className="p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-lg flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto">
              <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
              <p className="font-mono text-xs font-black text-[#121316]">
                Loading verified event memories...
              </p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-[36px] bg-white border-4 border-[#121316] shadow-pop-xl text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#FFF9DB] border-3 border-[#121316] shadow-pop-sm flex items-center justify-center mx-auto text-[#121316]">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#121316]">No Photos in This View</h3>
                <p className="text-xs sm:text-sm font-bold text-gray-600">
                  {images.length === 0
                    ? 'No event gallery photos uploaded yet. Check back soon after our upcoming workshops!'
                    : 'No photos match the selected filter category. Try selecting "All".'}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="px-5 py-2.5 rounded-full bg-[#FFE600] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:bg-[#FFD32A]"
                >
                  View All Photos
                </button>
                <Link
                  to="/events"
                  className="px-5 py-2.5 rounded-full bg-white text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm hover:bg-gray-100"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {filteredImages.map((item, idx) => {
                const rotations = ['rotate-[-1.5deg]', 'rotate-[1.5deg]', 'rotate-[-2deg]', 'rotate-[2deg]'];
                const tapeColors = ['#FFE600', '#FF6B6B', '#6C5CE7', '#2ED573'];
                const cardRotate = rotations[idx % rotations.length];
                const tapeColor = tapeColors[idx % tapeColors.length];

                return (
                  <div
                    key={item.$id}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative p-3.5 sm:p-4 rounded-3xl bg-white border-3 border-[#121316] shadow-pop hover:shadow-pop-lg transition-all duration-300 cursor-pointer group hover:rotate-0 hover:scale-[1.03] flex flex-col justify-between ${cardRotate}`}
                  >
                    {/* Washi Tape Accent Sticker */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 border-2 border-[#121316] shadow-sm z-10 opacity-95 rotate-[-1deg]"
                      style={{ backgroundColor: tapeColor }}
                    />

                    {/* Featured Ribbon */}
                    {item.isFeatured && (
                      <div className="absolute top-2 right-2 z-20 px-2.5 py-0.5 rounded-full bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm font-mono text-[9px] font-black text-[#121316] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#121316]" /> FEATURED
                      </div>
                    )}

                    {/* Real Image Container with Smooth Shimmer Loading */}
                    <div className="aspect-[4/3] w-full rounded-2xl border-2 border-[#121316] overflow-hidden bg-gray-100 relative mt-1">
                      <OptimizedImage
                        src={item.previewUrl || item.imageUrl}
                        alt={item.caption || item.eventTitle || `ATC Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-white border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex items-center gap-1.5 pointer-events-auto">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Full Size</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Footer: Event Title & Caption */}
                    <div className="pt-3 px-1 space-y-1">
                      <p className="text-xs font-bold text-[#121316] line-clamp-1">
                        {item.caption || item.eventTitle || 'ATC Event Moment'}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-500 pt-1 border-t border-[#121316]/10">
                        <span className="text-[#6C5CE7] truncate max-w-[140px]">
                          {item.eventTitle}
                        </span>
                        <span>{item.formattedDate || 'NIAT PUNE'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
          theme="playful"
        />
      )}
    </div>
  );
};

export default GalleryPage;
