import React from 'react';
import {
  Package,
  MapPin,
  ArrowRight,
  Cpu,
  Radio,
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';
import { InventoryItem } from '../../types/inventory.types';

interface InventoryCardProps {
  item: InventoryItem;
  onSelect: (item: InventoryItem) => void;
}

/**
 * Returns a contextual tech icon based on equipment title
 */
const getItemIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('sensor') || lower.includes('ir') || lower.includes('vibration') || lower.includes('max')) {
    return <Radio className="w-5 h-5 text-[#6C5CE7] stroke-[2.5]" />;
  }
  if (lower.includes('module') || lower.includes('cam') || lower.includes('board') || lower.includes('chip')) {
    return <Cpu className="w-5 h-5 text-[#FF6B6B] stroke-[2.5]" />;
  }
  if (lower.includes('motor') || lower.includes('driver') || lower.includes('power') || lower.includes('relay')) {
    return <Zap className="w-5 h-5 text-[#FFE600] stroke-[2.5]" />;
  }
  if (lower.includes('kit') || lower.includes('chassis') || lower.includes('frame')) {
    return <Layers className="w-5 h-5 text-[#2ED573] stroke-[2.5]" />;
  }
  return <Package className="w-5 h-5 text-[#121316] stroke-[2.5]" />;
};

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, onSelect }) => {
  const hasDescription = Boolean(item.description && item.description.trim());

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-3xl border-3 border-[#121316] p-5 lg:p-6 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative select-none"
    >
      {/* Top Section: Icon & Location Pill */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm group-hover:rotate-6 transition-transform flex-shrink-0">
            {getItemIcon(item.title)}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F0] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] shadow-pop-sm flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span className="truncate max-w-[120px]">{item.location}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg lg:text-xl font-black text-[#121316] tracking-tight group-hover:text-[#6C5CE7] transition-colors line-clamp-2 mb-3">
          {item.title}
        </h3>

        {/* Description Preview (if available) */}
        {hasDescription && (
          <p className="text-xs text-gray-600 font-bold line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        )}
      </div>

      {/* Bottom Section: Quantity & CTA */}
      <div className="pt-3 border-t-2 border-[#121316]/10 mt-2">
        <div className="flex items-center justify-between gap-2">
          {/* Quantity Badge */}
          <div className="flex flex-col">
            <span className="font-mono text-[9px] font-black uppercase tracking-wider text-gray-400">
              AVAILABLE
            </span>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-[#121316]">
              <span className={`w-2 h-2 rounded-full ${item.quantity > 0 ? 'bg-[#2ED573]' : 'bg-[#FF4757]'}`} />
              <span>
                {item.quantity.toLocaleString()} {item.quantity === 1 ? 'UNIT' : 'UNITS'}
              </span>
            </div>
          </div>

          {/* View Details Action */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFE600] group-hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black border-2 border-[#121316] shadow-pop-sm group-hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
