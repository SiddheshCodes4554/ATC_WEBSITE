import Papa from 'papaparse';
import { InventoryItem } from '../types/inventory.types';

/**
 * ============================================================================
 * ATC Public Inventory Service
 * ============================================================================
 * Fetches and parses published Google Sheets CSV data dynamically.
 * Zero hardcoded items.
 */

/**
 * Normalizes a string to create a safe URL-friendly identifier
 */
const normalizeSlug = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item'
  );
};

export class InventoryService {
  /**
   * Fetches published Google Sheets CSV and returns typed, cleaned InventoryItem array
   */
  static async fetchInventory(): Promise<InventoryItem[]> {
    const csvUrl = import.meta.env.VITE_INVENTORY_CSV_URL;

    if (!csvUrl || !csvUrl.trim()) {
      throw new Error(
        'Inventory data source is not configured. Please define VITE_INVENTORY_CSV_URL in your environment.'
      );
    }

    try {
      // Add timestamp query parameter or standard cache-busting to ensure fresh data
      const fetchUrl = csvUrl.includes('?')
        ? `${csvUrl}&_t=${Date.now()}`
        : `${csvUrl}?_t=${Date.now()}`;

      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          Accept: 'text/csv, text/plain, */*',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unable to fetch inventory spreadsheet (HTTP ${response.status}: ${response.statusText})`
        );
      }

      const csvText = await response.text();

      if (!csvText || !csvText.trim()) {
        return [];
      }

      // Parse CSV reliably using papaparse
      const parseResult = Papa.parse<string[]>(csvText, {
        skipEmptyLines: 'greedy',
      });

      if (parseResult.errors && parseResult.errors.length > 0 && parseResult.data.length === 0) {
        throw new Error('Failed to parse inventory spreadsheet CSV.');
      }

      const rows = parseResult.data;
      if (!rows || rows.length === 0) {
        return [];
      }

      // Detect header row index
      let titleIdx = 0;
      let qtyIdx = 1;
      let locIdx = 2;
      let descIdx = 3;

      let startRowIndex = 0;
      const firstRow = rows[0].map((col) => (col || '').toLowerCase().trim());

      const hasTitleHeader = firstRow.some((col) => col.includes('title') || col.includes('name') || col.includes('item'));
      const hasQtyHeader = firstRow.some((col) => col.includes('qty') || col.includes('quant'));

      if (hasTitleHeader || hasQtyHeader) {
        startRowIndex = 1;
        firstRow.forEach((col, idx) => {
          if (col.includes('title') || col.includes('name') || col.includes('item')) titleIdx = idx;
          else if (col.includes('qty') || col.includes('quant') || col.includes('count') || col.includes('units')) qtyIdx = idx;
          else if (col.includes('loc') || col.includes('bin') || col.includes('rack') || col.includes('place')) locIdx = idx;
          else if (col.includes('desc') || col.includes('detail') || col.includes('info') || col.includes('spec')) descIdx = idx;
        });
      }

      const items: InventoryItem[] = [];

      for (let i = startRowIndex; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const rawTitle = (row[titleIdx] || '').trim();
        const rawQty = (row[qtyIdx] || '').trim();
        const rawLoc = (row[locIdx] || '').trim();
        const rawDesc = (row[descIdx] || '').trim();

        // Skip completely empty rows
        if (!rawTitle && !rawQty && !rawLoc && !rawDesc) {
          continue;
        }

        // Clean numeric quantity
        const cleanedQtyStr = rawQty.replace(/[^0-9.-]/g, '');
        const parsedQty = cleanedQtyStr ? parseInt(cleanedQtyStr, 10) : 0;
        const quantity = isNaN(parsedQty) ? 0 : Math.max(0, parsedQty);

        // Generate stable client-side ID
        const normalizedTitle = normalizeSlug(rawTitle || `item-${i}`);
        const id = `inventory-${i}-${normalizedTitle}`;

        items.push({
          id,
          title: rawTitle || `Equipment #${i}`,
          quantity,
          location: rawLoc || 'Lab Storage',
          description: rawDesc,
        });
      }

      return items;
    } catch (err: any) {
      // Return user-friendly error without raw stack traces
      throw new Error(
        err?.message || 'We could not connect to the lab inventory sheet. Please try again.'
      );
    }
  }
}

export default InventoryService;
