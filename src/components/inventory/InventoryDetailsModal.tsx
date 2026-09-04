import React, { useEffect, useRef } from 'react';
import {
  X,
  Package,
  MapPin,
  Layers,
  FileText,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { InventoryItem } from '../../types/inventory.types';

interface InventoryDetailsModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export const InventoryDetailsModal: React.FC<InventoryDetailsModalProps> = ({
  item,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (item) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose]);

  if (!item) return null;

  const hasDescription = Boolean(item.description && item.description.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-equipment-title"
        className="relative w-full max-w-lg bg-white rounded-[36px] border-4 border-[#121316] shadow-pop-xl p-6 sm:p-8 animate-scaleUp overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Playful Top Tape Accent */}
        <div className="tape-strip pointer-events-none bg-[#FFE600]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1DCFF] border-2 border-[#121316] font-mono font-black text-xs uppercase text-[#6C5CE7] shadow-pop-sm">
            <Sparkles className="w-3.5 h-3.5" />
            EQUIPMENT SPECIFICATION
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE5E5] text-[#121316] hover:text-[#FF4757] border-2 border-[#121316] shadow-pop-sm active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto space-y-6 pr-1 scrollbar-thin flex-grow">
          {/* Item Title */}
          <div>
            <h2
              id="modal-equipment-title"
              className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight leading-snug"
            >
              {item.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 font-mono text-xs font-bold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ATC Robotics & IoT Lab Inventory</span>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Quantity Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase text-gray-500">
                <Layers className="w-3.5 h-3.5 text-[#2ED573]" />
                <span>Quantity</span>
              </div>
              <div className="text-2xl font-black text-[#121316]">
                {item.quantity.toLocaleString()}
                <span className="text-xs font-mono font-bold text-gray-500 ml-1.5">
                  {item.quantity === 1 ? 'unit' : 'units'}
                </span>
              </div>
              <div className="font-mono text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Available for Lab Projects</span>
              </div>
            </div>

            {/* Storage Location Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Storage Location</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#121316] truncate">
                {item.location}
              </div>
              <div className="font-mono text-[10px] font-bold text-gray-500">
                Lab 5.0 Component Bin
              </div>
            </div>
          </div>

          {/* Description Section (if available) */}
          {hasDescription && (
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] space-y-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-gray-700">
                <FileText className="w-4 h-4 text-[#6C5CE7]" />
                <span>Description & Notes</span>
              </div>
              <p className="text-sm font-bold text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Lab Usage Notice */}
          <div className="p-3.5 rounded-2xl bg-[#FFE600]/20 border-2 border-[#121316] text-xs font-bold text-[#121316] flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#121316] flex-shrink-0" />
            <span>
              Need this component for an ATC project? Visit Lab 5.0 or reach out during club workshop hours.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t-2 border-[#121316]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailsModal;
