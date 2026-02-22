import { useMemo } from 'react';
import { useTranslation } from '../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown } from 'lucide-react';
import { compareShopPrices } from '../lib/costing';
import type { Item } from '../backend';
import type { ShopResult } from '../lib/providers/placesProviders';

interface PriceComparisonProps {
  items: Item[];
  shops: ShopResult[];
  priceOverrides: Record<string, number>;
}

export default function PriceComparison({ items, shops, priceOverrides }: PriceComparisonProps) {
  const { t } = useTranslation();

  const comparison = useMemo(
    () => compareShopPrices(items, shops, priceOverrides),
    [items, shops, priceOverrides]
  );

  const cheapestShop = comparison.reduce((min, shop) =>
    shop.estimatedTotal < min.estimatedTotal ? shop : min
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          {t('priceComparison')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t('priceComparisonDisclaimer')}</p>

        <div className="space-y-2">
          {comparison.map((shop, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                shop.shopName === cheapestShop.shopName ? 'bg-green-50 dark:bg-green-950 border-green-500' : ''
              }`}
            >
              <div>
                <p className="font-medium">{shop.shopName}</p>
                {shop.shopName === cheapestShop.shopName && (
                  <Badge variant="default" className="mt-1">
                    {t('cheapestOption')}
                  </Badge>
                )}
              </div>
              <p className="text-lg font-bold">₹{shop.estimatedTotal.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
