import type { ShopResult } from './providers/placesProviders';

export function rankShops(shops: ShopResult[]): ShopResult[] {
  return [...shops].sort((a, b) => {
    // Open shops first
    if (a.openingStatus === 'open' && b.openingStatus !== 'open') return -1;
    if (a.openingStatus !== 'open' && b.openingStatus === 'open') return 1;

    // Then by rating if available
    if (a.rating && b.rating) {
      if (Math.abs(a.rating - b.rating) > 0.3) {
        return b.rating - a.rating;
      }
    }

    // Then by distance
    return a.distanceKm - b.distanceKm;
  });
}

export function suggestVisitTime(
  shop: ShopResult,
  preferredDateTime: Date
): { suggestion: string; note?: string } {
  const dateStr = preferredDateTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = preferredDateTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (shop.openingStatus === 'unknown') {
    return {
      suggestion: `${dateStr} at ${timeStr}`,
      note: 'Opening hours unknown - please verify before visiting',
    };
  }

  if (shop.openingStatus === 'open') {
    return {
      suggestion: `${dateStr} at ${timeStr} (Currently open)`,
    };
  }

  return {
    suggestion: `${dateStr} at ${timeStr}`,
    note: 'Shop is currently closed - please check opening hours',
  };
}
