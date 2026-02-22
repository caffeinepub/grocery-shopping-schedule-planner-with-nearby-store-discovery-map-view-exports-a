import { useTranslation } from '../lib/i18n';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Phone, Navigation, Star } from 'lucide-react';
import type { ShopResult } from '../lib/providers/placesProviders';

interface ShopsListProps {
  shops: ShopResult[];
  selectedShop: ShopResult | null;
  onSelectShop: (shop: ShopResult) => void;
}

export default function ShopsList({ shops, selectedShop, onSelectShop }: ShopsListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {shops.map((shop, index) => (
        <Card
          key={index}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedShop === shop ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectShop(shop)}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{shop.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {shop.address}
                </p>
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
                <Clock className="h-3 w-3 mr-1" />
                {shop.openingStatus === 'open' ? t('openNow') : 
                 shop.openingStatus === 'closed' ? t('closed') : t('hoursUnknown')}
              </Badge>

              <Badge variant="outline">
                <Navigation className="h-3 w-3 mr-1" />
                {shop.distanceKm.toFixed(1)} km
              </Badge>

              {shop.etaMinutes && (
                <Badge variant="outline">
                  {shop.etaMinutes} {t('minutes')}
                </Badge>
              )}

              {shop.phone && (
                <Badge variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  {shop.phone}
                </Badge>
              )}
            </div>

            {selectedShop === shop && (
              <Button size="sm" className="w-full mt-2">
                {t('selected')}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
