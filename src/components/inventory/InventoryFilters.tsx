import React from 'react';
import { Search, X, ArrowUpDown, RotateCw, MapPin } from 'lucide-react';
import { InventorySortOption } from '../../types/inventory.types';

interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  locations: string[];
  sortBy: InventorySortOption;
  onSortChange: (sort: InventorySortOption) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalFilteredCount: number;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  locations,
  sortBy,
  onSortChange,
  onRefresh,
  isRefreshing,
  totalFilteredCount,
}) => {
  return (
    <div className="bg-white rounded-3xl border-3 border-[#121316] p-5 lg:p-6 shadow-pop space-y-5">
      {/* Top Controls: Search Bar & Sort Dropdown & Refresh */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3.5">
        {/* Search Input */}
        <div className="relative flex-grow">
          <label htmlFor="inventory-search" className="sr-only">
            Search equipment
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <input
            id="inventory-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search equipment by title, bin, or description..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#FAF7F0] border-2 border-[#121316] font-bold text-sm text-[#121316] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#121316] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-gray-600">
              <ArrowUpDown className="w-4 h-4 stroke-[2.5]" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as InventorySortOption)}
              aria-label="Sort inventory by"
              className="pl-10 pr-8 py-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2ECE1] border-2 border-[#121316] font-mono text-xs font-black text-[#121316] appearance-none cursor-pointer focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#FFE600] transition-colors"
            >
              <option value="name-asc">Name A → Z</option>
              <option value="name-desc">Name Z → A</option>
              <option value="qty-desc">Quantity: High → Low</option>
              <option value="qty-asc">Quantity: Low → High</option>
              <option value="loc-asc">Location A → Z</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#FFE600] border-2 border-[#121316] text-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
            title="Refresh inventory from Google Sheet"
            aria-label="Refresh inventory"
          >
            <RotateCw className={`w-4 h-4 stroke-[2.5] ${isRefreshing ? 'animate-spin text-[#6C5CE7]' : ''}`} />
            <span className="hidden sm:inline font-mono text-xs font-black uppercase">
              Refresh
            </span>
          </button>
        </div>
      </div>

      {/* Location Filter Chips */}
      <div className="space-y-2 pt-2 border-t-2 border-[#121316]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>Filter by Location</span>
          </div>

          <span className="font-mono text-xs font-bold text-gray-500">
            Showing {totalFilteredCount} item{totalFilteredCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 lg:gap-2 max-h-36 overflow-y-auto py-1 scrollbar-thin">
          {/* ALL Locations Chip */}
          <button
            type="button"
            onClick={() => onLocationChange('ALL')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all duration-150 border-2 cursor-pointer ${
              selectedLocation === 'ALL'
                ? 'bg-[#121316] text-[#FFE600] border-[#121316] shadow-pop-sm scale-105'
                : 'bg-[#FAF7F0] hover:bg-white text-gray-700 border-[#121316]/20 hover:border-[#121316]'
            }`}
          >
            All Locations
          </button>

          {/* Dynamic Location Chips */}
          {locations.map((loc) => {
            const isSelected = selectedLocation.toLowerCase() === loc.toLowerCase();
            return (
              <button
                key={loc}
                type="button"
                onClick={() => onLocationChange(loc)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all duration-150 border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#6C5CE7] text-white border-[#121316] shadow-pop-sm scale-105'
                    : 'bg-[#FAF7F0] hover:bg-white text-gray-700 border-[#121316]/20 hover:border-[#121316]'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
