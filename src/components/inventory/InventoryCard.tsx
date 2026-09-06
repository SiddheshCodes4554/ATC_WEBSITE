import React from 'react';
import {
  Package,
  MapPin,
  ArrowRight,
  Cpu,
  Radio,
  Zap,
  Layers,
} from 'lucide-react';
import { InventoryItem } from '../../types/inventory.types';
import { IconModule, SignalLed } from '../visual';

/**
 * Returns contextual tech icon & variant based on equipment title
 */
const getItemIconConfig = (title: string): { icon: React.ReactNode; variant: 'purple' | 'coral' | 'yellow' | 'green' | 'white' } => {
  const lower = title.toLowerCase();
  if (lower.includes('sensor') || lower.includes('ir') || lower.includes('vibration') || lower.includes('max')) {
    return { icon: <Radio className="w-5 h-5 stroke-[2.5]" />, variant: 'purple' };
  }
  if (lower.includes('module') || lower.includes('cam') || lower.includes('board') || lower.includes('chip')) {
    return { icon: <Cpu className="w-5 h-5 stroke-[2.5]" />, variant: 'coral' };
  }
  if (lower.includes('motor') || lower.includes('driver') || lower.includes('power') || lower.includes('relay')) {
    return { icon: <Zap className="w-5 h-5 stroke-[2.5]" />, variant: 'yellow' };
  }
  if (lower.includes('kit') || lower.includes('chassis') || lower.includes('frame')) {
    return { icon: <Layers className="w-5 h-5 stroke-[2.5]" />, variant: 'green' };
  }
  return { icon: <Package className="w-5 h-5 stroke-[2.5]" />, variant: 'white' };
};

export interface InventoryCardProps {
  item: InventoryItem;
  onSelect: (item: InventoryItem) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, onSelect }) => {
  const hasDescription = Boolean(item.description && item.description.trim());
  const iconConfig = getItemIconConfig(item.title);

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-3xl border-3 border-[#121316] p-5 lg:p-6 shadow-pop hover:shadow-pop-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative select-none"
    >
      {/* Top Section: Icon & Location Pill */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <IconModule
            icon={iconConfig.icon}
            size="md"
            variant={iconConfig.variant}
            hoverEffect="rotate"
          />

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
            <div className="inline-flex items-center gap-2 font-mono text-xs font-black text-[#121316]">
              <SignalLed color={item.quantity > 0 ? 'green' : 'red'} pulse={item.quantity > 0} />
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
