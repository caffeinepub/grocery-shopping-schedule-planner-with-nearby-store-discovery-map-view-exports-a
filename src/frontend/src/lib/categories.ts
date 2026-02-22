import type { Item } from '../backend';

export const DEFAULT_CATEGORY_MAPPING: Record<string, string> = {
  milk: 'dairy',
  bread: 'bakery',
  eggs: 'dairy',
  rice: 'groceries',
  biscuits: 'snacks',
  tea: 'beverages',
  sugar: 'groceries',
  chips: 'snacks',
  butter: 'dairy',
  cheese: 'dairy',
  yogurt: 'dairy',
  cake: 'bakery',
  cookies: 'snacks',
  coffee: 'beverages',
  juice: 'beverages',
  soap: 'household',
  detergent: 'household',
};

export function inferCategories(
  items: Item[],
  userMapping: Record<string, string> = {}
): string[] {
  const categories = new Set<string>();

  items.forEach((item) => {
    const itemKey = item.name.toLowerCase();
    const category =
      userMapping[item.name] ||
      DEFAULT_CATEGORY_MAPPING[itemKey] ||
      'groceries';
    categories.add(category);
  });

  return Array.from(categories);
}
