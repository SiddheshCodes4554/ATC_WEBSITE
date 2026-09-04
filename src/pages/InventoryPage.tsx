import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Package,
  Sparkles,
  AlertTriangle,
  RotateCw,
  SearchX,
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { InventoryService } from '../services/inventoryService';
import {
  InventoryItem,
  InventorySortOption,
  InventoryStatsData
} from '../types/inventory.types';
import { InventoryStats } from '../components/inventory/InventoryStats';
import { InventoryFilters } from '../components/inventory/InventoryFilters';
import { InventoryCard } from '../components/inventory/InventoryCard';
import { InventoryDetailsModal } from '../components/inventory/InventoryDetailsModal';
import { InventorySkeleton } from '../components/inventory/InventorySkeleton';

export const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Filter & Search & Sort states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<InventorySortOption>('name-asc');

  // Selected item for modal
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Fetch inventory data
  const loadInventory = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await InventoryService.fetchInventory();
      setItems(data);
      const now = new Date();
      setLastSyncedTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    } catch (err: any) {
      setError(
        err?.message ||
          'We could not connect to the lab inventory right now. Please check back shortly.'
      );
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  // Extract unique locations dynamically from data
  const uniqueLocations = useMemo(() => {
    const locSet = new Set<string>();
    items.forEach((item) => {
      if (item.location && item.location.trim()) {
        locSet.add(item.location.trim());
      }
    });
    return Array.from(locSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [items]);

  // Compute live statistics
  const stats: InventoryStatsData = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    return {
      totalItems,
      totalQuantity,
      uniqueLocations: uniqueLocations.length,
    };
  }, [items, uniqueLocations]);

  // Filter and Sort inventory items
  const filteredAndSortedItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Filter
    const filtered = items.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesLocation =
        selectedLocation === 'ALL' ||
        item.location.toLowerCase() === selectedLocation.toLowerCase();

      return matchesSearch && matchesLocation;
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'qty-desc':
          return b.quantity - a.quantity;
        case 'qty-asc':
          return a.quantity - b.quantity;
        case 'loc-asc':
          return a.location.localeCompare(b.location, undefined, { numeric: true });
        default:
          return 0;
      }
    });
  }, [items, searchQuery, selectedLocation, sortBy]);

  // Reset filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('ALL');
    setSortBy('name-asc');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#121316] paper-pattern pb-20 select-none">
      {/* Hero Section */}
      <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 border-b-3 border-[#121316] bg-white overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-[#FFE600]/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-[#6C5CE7]/20 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F0] border-2 border-[#121316] shadow-pop-sm font-mono text-xs font-black uppercase text-[#121316]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2ED573] animate-pulse" />
              <span>LIVE INVENTORY</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 font-bold">Synced from Lab 5.0</span>
            </div>

            {/* Main Hero Title */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#FFE600] border-3 border-[#121316] shadow-pop hidden sm:flex items-center justify-center">
                <Package className="w-8 h-8 text-[#121316] stroke-[2.5]" />
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#121316] tracking-tight leading-none">
                ATC INVENTORY
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-bold text-gray-700 leading-relaxed max-w-2xl">
              Explore the equipment, microcontrollers, sensor modules, and hardware components available at the ADYPU Pune Robotics Lab.
            </p>

            {/* Last synced banner */}
            {lastSyncedTime && !error && !loading && (
              <div className="pt-2 flex items-center gap-2 font-mono text-xs text-gray-500 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2ED573]" />
                <span>Live data loaded successfully (Last synced: {lastSyncedTime})</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Loading State */}
        {loading ? (
          <InventorySkeleton />
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-3xl border-3 border-[#FF4757] p-8 sm:p-12 shadow-pop-xl text-center max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#FFE5E5] border-3 border-[#FF4757] mx-auto flex items-center justify-center shadow-pop-sm">
              <AlertTriangle className="w-8 h-8 text-[#FF4757]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#121316]">
                INVENTORY TEMPORARILY UNAVAILABLE
              </h2>
              <p className="text-sm font-bold text-gray-600 max-w-md mx-auto">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadInventory(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4 stroke-[2.5]" />
              <span>Try Again</span>
            </button>
          </div>
        ) : (
          /* Normal Loaded State */
          <>
            {/* 1. Statistics Cards */}
            <InventoryStats stats={stats} />

            {/* 2. Filters & Search Section */}
            <InventoryFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              locations={uniqueLocations}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onRefresh={() => loadInventory(true)}
              isRefreshing={isRefreshing}
              totalFilteredCount={filteredAndSortedItems.length}
            />

            {/* 3. Inventory Items Grid or Empty State */}
            {filteredAndSortedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {filteredAndSortedItems.map((item) => (
                  <InventoryCard
                    key={item.id}
                    item={item}
                    onSelect={(selected) => setSelectedItem(selected)}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter Results State */
              <div className="bg-white rounded-3xl border-3 border-[#121316] p-10 sm:p-14 shadow-pop-lg text-center max-w-lg mx-auto space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-[#FAF7F0] border-3 border-[#121316] mx-auto flex items-center justify-center shadow-pop-sm">
                  <SearchX className="w-8 h-8 text-[#6C5CE7]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#121316]">
                    NO EQUIPMENT FOUND
                  </h3>
                  <p className="text-sm font-bold text-gray-600">
                    We couldn't find any components matching "{searchQuery}" in location "{selectedLocation}". Try refining your search terms.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-6 py-3 rounded-full bg-[#FFE600] hover:bg-[#FFD32A] text-[#121316] font-mono text-xs font-black uppercase border-2 border-[#121316] shadow-pop-sm hover:shadow-pop active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Item Detail Modal */}
      <InventoryDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default InventoryPage;
