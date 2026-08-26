import React from 'react';
import { Sparkles, Flame, Camera, Pin } from 'lucide-react';
import { HighlightItem } from '../../data/eventsData';
import { SparkleDoodle, LoopyArrow } from '../doodles/DoodleSvgs';

interface EventHighlightsSectionProps {
  highlights: HighlightItem[];
}

export const EventHighlightsSection: React.FC<EventHighlightsSectionProps> = ({ highlights }) => {
  return (
    <section className="relative bg-[#FAF7F0] py-20 paper-pattern border-b-4 border-[#121316] overflow-hidden">
      
      {/* Background Doodles */}
      <div className="absolute top-12 left-10 opacity-40 pointer-events-none hidden md:block">
        <SparkleDoodle className="w-12 h-12" color="#FF793F" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="relative inline-block">
            <div className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white border-3 border-[#121316] shadow-pop font-black text-base sm:text-lg tracking-wider uppercase text-[#121316]">
              <Flame className="w-5 h-5 text-[#FF6B6B]" />
              WHAT WENT DOWN
            </div>
            
            <div className="absolute -right-10 -bottom-4 hidden sm:block">
              <SparkleDoodle className="w-8 h-8" color="#FFE600" />
            </div>
          </div>

          <h2 className="mt-4 text-2xl sm:text-4xl font-black text-[#121316] tracking-tight">
            The Craziest Hacks & Standout Moments 📸
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium max-w-xl">
            A creative scrapbook collage of the wildest user interface experiments:
          </p>
        </div>

        {/* Scrapbook Collage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {highlights.map((item, idx) => (
            <div
              key={item.id}
              className={`relative p-6 sm:p-7 rounded-[32px] border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-200 flex flex-col justify-between ${
                item.color || 'bg-white'
              } ${item.rotation || 'rotate-0'} hover:rotate-0 hover:-translate-y-2`}
            >
              {/* Tape Strip on Top */}
              <div className="tape-strip pointer-events-none" />

              <div>
                {/* Badge Tag */}
                {item.badge && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#121316] text-[#FFE600] rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#FFE600]" />
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] tracking-tight leading-tight mb-3">
                  {item.title}
                </h3>

                {/* Caption / Description */}
                <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              {/* Bottom Scrapbook Stamp */}
              <div className="mt-6 pt-3 border-t-2 border-[#121316]/20 flex items-center justify-between text-xs font-hand font-bold text-[#121316]">
                <span>📌 Certified Cursed</span>
                <span className="text-[10px] font-mono">NIAT HACK #0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
