import React from 'react';
import { GalleryItem } from '../../data/galleryData';
import { Sparkles, ZoomIn, Pin, Calendar, MapPin } from 'lucide-react';

export const MemoryVectorScene: React.FC<{ type: GalleryItem['svgSceneType'] }> = ({ type }) => {
  switch (type) {
    case 'worst-ui-demo':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#FF7675" stroke="#121316" strokeWidth="3" />
          <rect x="35" y="35" width="170" height="95" rx="8" fill="#FFFFFF" />
          <g transform="translate(45, 50) rotate(-6)">
            <rect x="0" y="0" width="70" height="24" rx="4" fill="#FFE600" stroke="#121316" strokeWidth="2" />
            <text x="35" y="16" fontFamily="Comic Sans MS, cursive" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#121316">RUN BUTTON</text>
          </g>
          <g transform="translate(125, 75) rotate(12)">
            <rect x="0" y="0" width="70" height="24" rx="4" fill="#FF4757" stroke="#121316" strokeWidth="2" />
            <text x="35" y="16" fontFamily="sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">404 ERROR</text>
          </g>
        </svg>
      );

    case 'git-push-panic':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="15" y="15" width="210" height="130" rx="12" fill="#121316" stroke="#121316" strokeWidth="3" />
          <circle cx="35" cy="32" r="3.5" fill="#FF6B6B" />
          <circle cx="46" cy="32" r="3.5" fill="#FFE600" />
          <circle cx="57" cy="32" r="3.5" fill="#2ED573" />
          <text x="35" y="65" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#FF4757">$ git push --force origin main</text>
          <text x="35" y="85" fontFamily="monospace" fontSize="9" fill="#FFE600">CONFLICT (content): Merge conflict in App.tsx</text>
          <text x="35" y="105" fontFamily="monospace" fontSize="9" fill="#2ED573">Automatic merge failed; fix conflicts and commit.</text>
          <path d="M 35 125 H 180" stroke="#00D2D3" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      );

    case 'blockchain-blocks':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#E8F5E9" stroke="#121316" strokeWidth="3" />
          <line x1="60" y1="80" x2="110" y2="80" stroke="#121316" strokeWidth="3" strokeDasharray="4 4" />
          <line x1="130" y1="80" x2="180" y2="80" stroke="#121316" strokeWidth="3" strokeDasharray="4 4" />
          <rect x="40" y="60" width="40" height="40" rx="8" fill="#2ED573" stroke="#121316" strokeWidth="2.5" />
          <text x="60" y="84" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">#01</text>
          <rect x="100" y="60" width="40" height="40" rx="8" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
          <text x="120" y="84" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#121316">#02</text>
          <rect x="160" y="60" width="40" height="40" rx="8" fill="#6C5CE7" stroke="#121316" strokeWidth="2.5" />
          <text x="180" y="84" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">#03</text>
        </svg>
      );

    case 'organized-chaos':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#FAF7F0" stroke="#121316" strokeWidth="3" />
          {/* Tangled wires */}
          <path d="M 40 40 Q 90 120 140 40 T 200 120" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 40 120 Q 100 20 160 120 T 200 40" stroke="#FF793F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <rect x="95" y="65" width="50" height="30" rx="6" fill="#FFE600" stroke="#121316" strokeWidth="2" />
          <text x="120" y="84" fontFamily="monospace" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#121316">OPS OK</text>
        </svg>
      );

    case 'robot-avoid':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#D6EEFF" stroke="#121316" strokeWidth="3" />
          {/* Wall obstacle */}
          <rect x="180" y="35" width="25" height="90" rx="4" fill="#E74C3C" stroke="#121316" strokeWidth="2.5" />
          {/* Rover dodging */}
          <g transform="translate(60, 65)">
            <rect x="0" y="0" width="60" height="30" rx="8" fill="#FFE600" stroke="#121316" strokeWidth="2.5" />
            <circle cx="15" cy="30" r="7" fill="#121316" />
            <circle cx="45" cy="30" r="7" fill="#121316" />
            {/* LiDAR radar arc */}
            <path d="M 50 5 Q 85 -10 85 25" stroke="#00D2D3" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-pulse" />
          </g>
        </svg>
      );

    case 'pizza-stack':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#FFF9DB" stroke="#121316" strokeWidth="3" />
          {/* Stacked Pizza Boxes */}
          <g transform="translate(60, 45)">
            <polygon points="10,60 110,60 100,45 20,45" fill="#E67E22" stroke="#121316" strokeWidth="2" />
            <polygon points="10,42 110,42 100,27 20,27" fill="#F39C12" stroke="#121316" strokeWidth="2" />
            <polygon points="10,24 110,24 100,9 20,9" fill="#E67E22" stroke="#121316" strokeWidth="2" />
            <circle cx="60" cy="18" r="4" fill="#FF4757" />
          </g>
          <text x="120" y="130" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#121316">
            🍕 40+ BOXES CONSUMED
          </text>
        </svg>
      );

    case 'gsoc-merged':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#E1F5FE" stroke="#121316" strokeWidth="3" />
          <circle cx="120" cy="70" r="32" fill="#2ED573" stroke="#121316" strokeWidth="3" />
          <path d="M106 70 L116 80 L134 60" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="120" y="125" fontFamily="monospace" fontSize="11" fontWeight="900" textAnchor="middle" fill="#121316">
            #PR MERGED UPSTREAM
          </text>
        </svg>
      );

    case 'late-night-debug':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="15" y="15" width="210" height="130" rx="12" fill="#0B0F19" stroke="#121316" strokeWidth="3" />
          <circle cx="120" cy="65" r="28" fill="#121316" stroke="#00D2D3" strokeWidth="2" />
          <text x="120" y="71" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#FFE600">03:14</text>
          <text x="120" y="115" fontFamily="monospace" fontSize="9" fill="#A29BFE" textAnchor="middle">
            compiling kernel driver... [OK]
          </text>
        </svg>
      );

    case 'drone-flight':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#E8F5E9" stroke="#121316" strokeWidth="3" />
          <g transform="translate(85, 45)" className="animate-float-slow">
            <rect x="25" y="20" width="20" height="16" rx="4" fill="#121316" stroke="#121316" strokeWidth="2" />
            <line x1="5" y1="5" x2="65" y2="45" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round" />
            <line x1="5" y1="45" x2="65" y2="5" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="5" cy="5" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
            <ellipse cx="65" cy="5" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
            <ellipse cx="5" cy="45" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
            <ellipse cx="65" cy="45" rx="14" ry="4" fill="#00D2D3" opacity="0.8" />
          </g>
          <text x="120" y="130" fontFamily="monospace" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#121316">
            WAYPOINT ACCURACY: 99.4%
          </text>
        </svg>
      );

    case 'solder-station':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#FFEBF2" stroke="#121316" strokeWidth="3" />
          <rect x="50" y="55" width="60" height="40" rx="8" fill="#E67E22" stroke="#121316" strokeWidth="2.5" />
          <text x="80" y="78" fontFamily="monospace" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">350°C</text>
          <line x1="105" y1="70" x2="155" y2="35" stroke="#121316" strokeWidth="6" strokeLinecap="round" />
          <line x1="155" y1="35" x2="168" y2="22" stroke="#F1C40F" strokeWidth="3" />
          <path d="M 168 20 Q 160 5 172 -5" stroke="#7F8C8D" strokeWidth="2" strokeLinecap="round" fill="none" className="animate-pulse" />
        </svg>
      );

    case 'hackathon-podium':
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="12" fill="#FFF9DB" stroke="#121316" strokeWidth="3" />
          <path d="M 85 40 H 155 V 75 C 155 95 135 102 120 102 C 105 102 85 95 85 75 Z" fill="#FFE600" stroke="#121316" strokeWidth="3" />
          <path d="M 85 48 H 70 C 70 64 82 68 85 68" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 155 48 H 170 C 170 64 158 68 155 68" stroke="#121316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <rect x="105" y="102" width="30" height="16" fill="#FF793F" stroke="#121316" strokeWidth="2" />
          <text x="120" y="72" fontFamily="sans-serif" fontSize="16" fontWeight="900" textAnchor="middle" fill="#121316">1st</text>
        </svg>
      );

    case 'sticky-quote':
    default:
      return (
        <svg viewBox="0 0 240 160" fill="none" className="w-full h-auto">
          <rect x="20" y="15" width="200" height="130" rx="8" fill="#FFF9DB" stroke="#121316" strokeWidth="3" />
          <text x="120" y="60" fontFamily="Comic Sans MS, cursive, sans-serif" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#121316">
            "IF IT WORKS,
          </text>
          <text x="120" y="85" fontFamily="Comic Sans MS, cursive, sans-serif" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#FF4757">
            DO NOT TOUCH IT."
          </text>
          <text x="120" y="115" fontFamily="monospace" fontSize="9" textAnchor="middle" fill="#6C5CE7">
            — ATC Whiteboard Rule #1
          </text>
        </svg>
      );
  }
};

interface ScrapbookMemoryCardProps {
  item: GalleryItem;
  onSelect: (item: GalleryItem) => void;
}

export const ScrapbookMemoryCard: React.FC<ScrapbookMemoryCardProps> = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative p-5 pb-6 rounded-[32px] bg-white border-4 border-[#121316] shadow-pop-lg hover:shadow-pop-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        item.rotation || 'rotate-0'
      } hover:rotate-0 hover:-translate-y-2 hover:scale-[1.02] select-none`}
    >
      {/* Tape Strip / Pushpin Top Accent */}
      {item.format === 'pinned' ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#FF4757] border-2 border-[#121316] shadow-pop-sm flex items-center justify-center z-20">
          <div className="w-2 h-2 rounded-full bg-white opacity-80" />
        </div>
      ) : item.tapeColor ? (
        <div 
          className="tape-strip pointer-events-none" 
          style={{ backgroundColor: item.tapeColor }}
        />
      ) : (
        <div className="tape-strip pointer-events-none bg-[#FFE600]" />
      )}

      {/* Vector Scene Artwork with Zoom Hover Overlay */}
      <div className="relative mb-4">
        <MemoryVectorScene type={item.svgSceneType} />

        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white">
          <div className="px-4 py-2 bg-[#FFE600] text-[#121316] rounded-full border-2 border-[#121316] shadow-pop-sm flex items-center gap-1.5 font-bold text-xs">
            <ZoomIn className="w-4 h-4" /> View Full Memory
          </div>
        </div>
      </div>

      {/* Title & Caption */}
      <div className="space-y-1 text-left">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#121316] font-mono text-[10px] font-bold text-[#6C5CE7]">
            {item.category}
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-500">
            {item.date}
          </span>
        </div>

        <h4 className="font-black text-lg text-[#121316] tracking-tight">
          {item.title}
        </h4>

        <p className="font-hand font-bold text-base text-gray-800 leading-snug">
          "{item.caption}"
        </p>
      </div>

      {/* Bottom Metadata */}
      <div className="mt-4 pt-3 border-t-2 border-[#121316]/10 flex items-center justify-between text-[11px] font-mono font-bold text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#FF793F]" />
          {item.location}
        </span>
        <span className="text-[#121316] group-hover:translate-x-0.5 transition-transform">
          OPEN ↗
        </span>
      </div>

    </div>
  );
};
