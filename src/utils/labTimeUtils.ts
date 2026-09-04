/**
 * ============================================================================
 * Lab Time & Slot Expiration Utilities
 * ============================================================================
 * Handles parsing, validation, and auto-expiration checks for lab slots.
 */

/**
 * Parses a slot's date (YYYY-MM-DD) and endTime (24h or 12h AM/PM) into a JS Date.
 */
export function parseSlotEndDateTime(date: string, endTime: string): Date | null {
  if (!date?.trim() || !endTime?.trim()) return null;

  try {
    const [yearStr, monthStr, dayStr] = date.trim().split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

    let cleanTime = endTime.trim().toUpperCase();
    const isPM = cleanTime.includes('PM');
    const isAM = cleanTime.includes('AM');

    cleanTime = cleanTime.replace(/AM|PM/g, '').trim();

    let hours = 0;
    let minutes = 0;

    if (cleanTime.includes(':')) {
      const parts = cleanTime.split(':');
      hours = parseInt(parts[0], 10) || 0;
      minutes = parseInt(parts[1], 10) || 0;
    } else {
      hours = parseInt(cleanTime, 10) || 0;
      minutes = 0;
    }

    if (isPM && hours < 12) {
      hours += 12;
    } else if (isAM && hours === 12) {
      hours = 0;
    }

    // Return Date in local timezone
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  } catch (err) {
    console.warn('[parseSlotEndDateTime] Error parsing slot time:', err);
    return null;
  }
}

/**
 * Checks if a slot has expired (its date and endTime have completely elapsed).
 * @param date - YYYY-MM-DD
 * @param endTime - "14:00" or "02:00 PM"
 * @param bufferMinutes - Optional safety buffer in minutes (default: 0 = expires right when endTime is reached)
 */
export function isSlotExpired(date: string, endTime: string, bufferMinutes = 0): boolean {
  const endDate = parseSlotEndDateTime(date, endTime);
  if (!endDate) return false;
  const expiryTimestamp = endDate.getTime() + bufferMinutes * 60 * 1000;
  return Date.now() >= expiryTimestamp;
}

/**
 * Returns user-friendly time remaining or expiration status
 */
export function getSlotTimeRemaining(date: string, endTime: string): { isExpired: boolean; label: string } {
  const endDate = parseSlotEndDateTime(date, endTime);
  if (!endDate) return { isExpired: false, label: 'Active' };

  const diffMs = endDate.getTime() - Date.now();
  if (diffMs <= 0) {
    return { isExpired: true, label: 'Expired' };
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMins = diffMinutes % 60;

  if (diffHours > 24) {
    const days = Math.floor(diffHours / 24);
    return { isExpired: false, label: `in ${days}d` };
  }

  if (diffHours > 0) {
    return { isExpired: false, label: `in ${diffHours}h ${remainingMins}m` };
  }

  return { isExpired: false, label: `in ${diffMinutes}m` };
}
