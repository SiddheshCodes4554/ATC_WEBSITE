/**
 * ============================================================================
 * ATC Lab Inventory Types & Interfaces
 * ============================================================================
 */

export interface InventoryItem {
  id: string;
  title: string;
  quantity: number;
  location: string;
  description: string;
}

export type InventorySortOption =
  | 'name-asc'
  | 'name-desc'
  | 'qty-desc'
  | 'qty-asc'
  | 'loc-asc';

export interface InventoryStatsData {
  totalItems: number;
  totalQuantity: number;
  uniqueLocations: number;
}
