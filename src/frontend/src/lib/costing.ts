import type { Item } from '../backend';
import type { ShopResult } from './providers/placesProviders';

export const DEFAULT_PRICES: Record<string, number> = {
  milk: 60,
  bread: 40,
  eggs: 80,
  rice: 150,
  biscuits: 30,
  tea: 200,
  sugar: 45,
  chips: 20,
  butter: 50,
  cheese: 120,
  yogurt: 40,
  cake: 300,
  cookies: 50,
  coffee: 250,
  juice: 80,
  soap: 35,
  detergent: 150,
};

export function estimateTotalCost(
  items: Item[],
  priceOverrides: Record<string, number> = {}
): number {
  return items.reduce((total, item) => {
    const price =
      priceOverrides[item.name] ||
      DEFAULT_PRICES[item.name.toLowerCase()] ||
      50;
    return total + price;
  }, 0);
}

export function getHighestCostItems(
  items: Item[],
  priceOverrides: Record<string, number> = {},
  count: number = 3
): Array<{ name: string; price: number }> {
  return items
    .map((item) => ({
      name: item.name,
      price:
        priceOverrides[item.name] ||
        DEFAULT_PRICES[item.name.toLowerCase()] ||
        50,
    }))
    .sort((a, b) => b.price - a.price)
    .slice(0, count);
}

export function compareShopPrices(
  items: Item[],
  shops: ShopResult[],
  priceOverrides: Record<string, number> = {}
): Array<{ shopName: string; estimatedTotal: number }> {
  const baseTotal = estimateTotalCost(items, priceOverrides);

  return shops.map((shop) => {
    // Simple heuristic: apply multiplier based on shop type
    let multiplier = 1.0;
    if (shop.name.toLowerCase().includes('d-mart') || shop.name.toLowerCase().includes('reliance')) {
      multiplier = 0.95; // Slightly cheaper
    } else if (shop.name.toLowerCase().includes('kirana') || shop.name.toLowerCase().includes('local')) {
      multiplier = 1.05; // Slightly more expensive
    }

    return {
      shopName: shop.name,
      estimatedTotal: baseTotal * multiplier,
    };
  });
}
