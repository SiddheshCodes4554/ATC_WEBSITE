import React from 'react';
import { Package, Layers, MapPin } from 'lucide-react';
import { InventoryStatsData } from '../../types/inventory.types';

interface InventoryStatsProps {
  stats: InventoryStatsData;
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {/* Total Distinct Items */}
      <div className="bg-white rounded-3xl border-3 border-[#121316] p-5 lg:p-6 shadow-pop hover:shadow-pop-lg transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-[#FFE600] border-2 border-[#121316] shadow-pop-sm group-hover:rotate-6 transition-transform">
            <Package className="w-6 h-6 text-[#121316] stroke-[2.5]" />
          </div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-gray-500 bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#121316]/20">
            CATALOG
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl lg:text-4xl font-black text-[#121316] tracking-tight">
            {stats.totalItems.toLocaleString()}
          </div>
          <div className="font-mono text-xs font-black uppercase text-gray-600 mt-1">
            Total Equipment Items
          </div>
        </div>
      </div>

      {/* Total Quantity */}
      <div className="bg-white rounded-3xl border-3 border-[#121316] p-5 lg:p-6 shadow-pop hover:shadow-pop-lg transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-[#2ED573] border-2 border-[#121316] shadow-pop-sm group-hover:rotate-6 transition-transform">
            <Layers className="w-6 h-6 text-[#121316] stroke-[2.5]" />
          </div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#121316] bg-[#2ED573]/20 px-2.5 py-1 rounded-full border border-[#121316]/20">
            IN STOCK
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl lg:text-4xl font-black text-[#121316] tracking-tight">
            {stats.totalQuantity.toLocaleString()}
          </div>
          <div className="font-mono text-xs font-black uppercase text-gray-600 mt-1">
            Total Component Units
          </div>
        </div>
      </div>

      {/* Unique Storage Locations */}
      <div className="bg-white rounded-3xl border-3 border-[#121316] p-5 lg:p-6 shadow-pop hover:shadow-pop-lg transition-all duration-200 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-[#E1DCFF] border-2 border-[#121316] shadow-pop-sm group-hover:rotate-6 transition-transform">
            <MapPin className="w-6 h-6 text-[#6C5CE7] stroke-[2.5]" />
          </div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#6C5CE7] bg-[#E1DCFF]/50 px-2.5 py-1 rounded-full border border-[#121316]/20">
            STORAGE
          </span>
        </div>
        <div className="mt-4">
          <div className="text-3xl lg:text-4xl font-black text-[#121316] tracking-tight">
            {stats.uniqueLocations.toLocaleString()}
          </div>
          <div className="font-mono text-xs font-black uppercase text-gray-600 mt-1">
            Storage Locations / Bins
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;
