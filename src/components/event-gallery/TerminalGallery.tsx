import React, { useState } from 'react';
import { EventGalleryImage } from '../../types/eventGallery.types';
import { GalleryLightbox } from './GalleryLightbox';
import { Terminal, Maximize2, Star, Folder, FileCode, Check } from 'lucide-react';

interface TerminalGalleryProps {
  images: EventGalleryImage[];
  isCompleted?: boolean;
}

export const TerminalGallery: React.FC<TerminalGalleryProps> = ({ images, isCompleted }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
      <div className="rounded-[36px] bg-[#0F172A] border-4 border-[#121316] shadow-pop-xl overflow-hidden font-mono text-emerald-400">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1E293B] border-b-2 border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF4757]" />
              <span className="w-3 h-3 rounded-full bg-[#FFE600]" />
              <span className="w-3 h-3 rounded-full bg-[#2ED573]" />
            </div>
            <span className="text-xs font-bold text-gray-300">
              bash ~ atc-cli/event-memories
            </span>
          </div>

          <span className="text-[11px] text-emerald-400/70">
            {images.length} files indexed
          </span>
        </div>

        {/* Terminal Command Prompt */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-emerald-400">
              <span className="text-cyan-400">guest@atc-lab</span>:<span className="text-purple-400">~/memories</span>$ {isCompleted ? 'ls -la ./event-archive' : 'cat ./gallery-manifest.json'}
            </p>
            <p className="text-[11px] text-gray-400">
              Found {images.length} captured frames with verified SHA-256 telemetry.
            </p>
          </div>

          {/* Terminal File Explorer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((item, idx) => {
              const fileNum = String(idx + 1).padStart(3, '0');
              const filename = `frame_${fileNum}.raw`;

              return (
                <div
                  key={item.$id}
                  onClick={() => setActiveIdx(idx)}
                  className="rounded-2xl bg-[#1E293B]/80 border-2 border-emerald-500/30 hover:border-emerald-400 p-3.5 space-y-3 transition-all duration-200 cursor-pointer group hover:bg-[#1E293B]"
                >
                  {/* File Header */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-700/60 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5" />
                      {filename}
                    </span>

                    {item.isFeatured && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                        [FEATURED]
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Stage */}
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/60 relative border border-emerald-500/20">
                    <img
                      src={item.previewUrl || item.imageUrl}
                      alt={item.caption || filename}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1 rounded-lg bg-[#0F172A] border border-emerald-400 text-emerald-400 font-mono text-xs flex items-center gap-1.5 shadow-lg">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>inspect()</span>
                      </span>
                    </div>
                  </div>

                  {/* Metadata & Caption */}
                  <div className="space-y-1 text-[11px]">
                    <p className="text-gray-200 truncate font-sans font-medium">
                      {item.caption || `Captured frame index #${fileNum}`}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>ORDER: {item.displayOrder}</span>
                      <span>STATUS: 200 OK</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
          theme="terminal"
        />
      )}
    </section>
  );
};

export default TerminalGallery;
