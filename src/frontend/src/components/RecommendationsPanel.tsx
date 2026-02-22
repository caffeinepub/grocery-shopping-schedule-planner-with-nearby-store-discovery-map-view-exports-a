import { useMemo } from 'react';
import { useTranslation } from '../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, MapPin, Star } from 'lucide-react';
import { rankShops, suggestVisitTime } from '../lib/scheduling';
import type { ShopResult } from '../lib/providers/placesProviders';

interface RecommendationsPanelProps {
  shops: ShopResult[];
  preferredDateTime: Date;
  selectedShop: ShopResult | null;
  onSelectShop: (shop: ShopResult) => void;
}

export default function RecommendationsPanel({
  shops,
  preferredDateTime,
  selectedShop,
  onSelectShop,
}: RecommendationsPanelProps) {
  const { t } = useTranslation();

  const topShops = useMemo(() => {
    return rankShops(shops).slice(0, 3);
  }, [shops]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          {t('topRecommendations')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topShops.map((shop, index) => {
          const visitTime = suggestVisitTime(shop, preferredDateTime);
          const isSelected = selectedShop === shop;

          return (
            <Card
              key={index}
              className={`p-4 ${isSelected ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Badge className="text-lg px-3 py-1">#{index + 1}</Badge>
                    <div>
                      <h3 className="font-semibold text-lg">{shop.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {shop.address}
                      </p>
                    </div>
                  </div>
                  {shop.rating && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {shop.rating.toFixed(1)}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant={shop.openingStatus === 'open' ? 'default' : 'secondary'}>
                    {shop.openingStatus === 'open' ? t('openNow') : t('closed')}
                  </Badge>
                  <Badge variant="outline">{shop.distanceKm.toFixed(1)} km</Badge>
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('suggestedVisitTime')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {visitTime.suggestion}
                  </p>
                  {visitTime.note && (
                    <p className="text-xs text-muted-foreground mt-1">{visitTime.note}</p>
                  )}
                </div>

                <Button
                  onClick={() => onSelectShop(shop)}
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full"
                >
                  {isSelected ? t('selected') : t('selectThisShop')}
                </Button>
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
