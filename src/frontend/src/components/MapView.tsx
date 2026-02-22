import { useTranslation } from '../lib/i18n';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Star, Clock } from 'lucide-react';
import type { ShopResult } from '../lib/providers/placesProviders';

interface MapViewProps {
  shops: ShopResult[];
  userLocation?: { lat: number; lng: number };
  selectedShop: ShopResult | null;
  onSelectShop: (shop: ShopResult) => void;
}

export default function MapView({ shops, userLocation, selectedShop, onSelectShop }: MapViewProps) {
  const { t } = useTranslation();

  if (shops.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">{t('noShopsToDisplay')}</p>
      </div>
    );
  }

  // Calculate center point
  const centerLat = userLocation?.lat || shops[0].latitude;
  const centerLng = userLocation?.lng || shops[0].longitude;

  // Create markers string for OpenStreetMap static map
  const markers = shops.map((shop, idx) => 
    `pin-s-${idx + 1}+f97316(${shop.longitude},${shop.latitude})`
  ).join(',');

  const userMarker = userLocation ? `pin-l-star+3b82f6(${userLocation.lng},${userLocation.lat})` : '';
  const allMarkers = userMarker ? `${userMarker},${markers}` : markers;

  // OpenStreetMap static map URL (using Mapbox static API style)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05},${centerLat - 0.05},${centerLng + 0.05},${centerLat + 0.05}&layer=mapnik&marker=${centerLat},${centerLng}`;

  return (
    <div className="space-y-4">
      <div className="h-96 rounded-lg overflow-hidden border bg-muted relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={mapUrl}
          className="absolute inset-0"
          title="Shop locations map"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop, index) => (
          <Card
            key={index}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              selectedShop === shop ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectShop(shop)}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <Badge className="shrink-0">#{index + 1}</Badge>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{shop.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{shop.address}</p>
                  </div>
                </div>
                {shop.rating && (
                  <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {shop.rating.toFixed(1)}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-1 text-xs">
                <Badge variant={shop.openingStatus === 'open' ? 'default' : 'secondary'} className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {shop.openingStatus === 'open' ? t('openNow') : 
                   shop.openingStatus === 'closed' ? t('closed') : t('hoursUnknown')}
                </Badge>

                <Badge variant="outline" className="text-xs">
                  <Navigation className="h-3 w-3 mr-1" />
                  {shop.distanceKm.toFixed(1)} km
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        <p>{t('mapPoweredBy')} OpenStreetMap</p>
      </div>
    </div>
  );
}
