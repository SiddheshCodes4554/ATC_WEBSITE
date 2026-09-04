import React from 'react';
import { Loader2, Package } from 'lucide-react';

export const InventorySkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Loading Banner */}
      <div className="flex items-center justify-center gap-3 p-4 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] shadow-pop-sm">
        <Loader2 className="w-5 h-5 animate-spin text-[#6C5CE7]" />
        <span className="font-mono text-xs sm:text-sm font-black uppercase text-[#121316] tracking-wider">
          Connecting to Lab Inventory Sheet...
        </span>
      </div>

      {/* Stats Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border-3 border-[#121316] p-6 shadow-pop animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gray-200" />
              <div className="w-16 h-5 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-8 rounded-xl bg-gray-200" />
              <div className="w-36 h-4 rounded-md bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border-3 border-[#121316] p-6 shadow-pop animate-pulse space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-gray-200" />
              <div className="w-20 h-6 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-2.5">
              <div className="w-3/4 h-6 rounded-lg bg-gray-200" />
              <div className="w-full h-4 rounded-md bg-gray-200" />
              <div className="w-2/3 h-4 rounded-md bg-gray-200" />
            </div>
            <div className="pt-3 border-t-2 border-gray-100 flex items-center justify-between">
              <div className="w-20 h-5 rounded-md bg-gray-200" />
              <div className="w-16 h-8 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventorySkeleton;
