import { useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, MapIcon, List, Info } from 'lucide-react';
import { discoverShops, type ShopResult } from '../lib/providers/placesProviders';
import { inferCategories } from '../lib/categories';
import ShopsList from './ShopsList';
import MapView from './MapView';
import EmptyState from './EmptyState';
import CategoryMappingEditor from './CategoryMappingEditor';
import type { PlannerState } from '../App';
import { toast } from 'sonner';

interface DiscoveryPanelProps {
  plannerState: PlannerState;
  onShopsDiscovered: (shops: ShopResult[]) => void;
  discoveredShops: ShopResult[];
  selectedShop: ShopResult | null;
  onSelectShop: (shop: ShopResult | null) => void;
}

export default function DiscoveryPanel({
  plannerState,
  onShopsDiscovered,
  discoveredShops,
  selectedShop,
  onSelectShop,
}: DiscoveryPanelProps) {
  const { t } = useTranslation();
  const [provider, setProvider] = useState<'osm' | 'google'>('osm');
  const [apiKey, setApiKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [categoryMapping, setCategoryMapping] = useState<Record<string, string>>({});

  const categories = inferCategories(plannerState.items, categoryMapping);

  const handleDiscover = async () => {
    if (!plannerState.location.trim()) {
      toast.error(t('locationRequired'));
      return;
    }

    setIsSearching(true);
    try {
      const shops = await discoverShops({
        location: plannerState.location,
        latitude: plannerState.latitude,
        longitude: plannerState.longitude,
        provider,
        apiKey: provider === 'google' ? apiKey : undefined,
        categories,
      });

      onShopsDiscovered(shops);
      
      if (shops.length === 0) {
        toast.info(t('noShopsFound'));
      } else {
        toast.success(t('shopsDiscovered', { count: shops.length }));
      }
    } catch (error) {
      console.error('Discovery error:', error);
      toast.error(t('discoveryError'));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('discoverNearbyShops')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('dataProvider')}</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as 'osm' | 'google')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="osm">OpenStreetMap (Free)</SelectItem>
                <SelectItem value="google">Google Places (API Key Required)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {provider === 'google' && (
            <div className="space-y-2">
              <Label>{t('apiKey')}</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t('enterApiKey')}
              />
            </div>
          )}
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t('categoryFilteringNote')}
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={handleDiscover} disabled={isSearching} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? t('searching') : t('findShops')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCategoryEditor(!showCategoryEditor)}
          >
            {t('editCategories')}
          </Button>
        </div>

        {showCategoryEditor && (
          <CategoryMappingEditor
            items={plannerState.items}
            mapping={categoryMapping}
            onMappingChange={setCategoryMapping}
          />
        )}

        {discoveredShops.length > 0 && (
          <>
            <div className="flex gap-2 border-t pt-4">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                {t('listView')}
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                {t('mapView')}
              </Button>
            </div>

            {viewMode === 'list' ? (
              <ShopsList
                shops={discoveredShops}
                selectedShop={selectedShop}
                onSelectShop={onSelectShop}
              />
            ) : (
              <MapView
                shops={discoveredShops}
                userLocation={
                  plannerState.latitude && plannerState.longitude
                    ? { lat: plannerState.latitude, lng: plannerState.longitude }
                    : undefined
                }
                selectedShop={selectedShop}
                onSelectShop={onSelectShop}
              />
            )}
          </>
        )}

        {!isSearching && discoveredShops.length === 0 && plannerState.location && (
          <EmptyState onRetry={handleDiscover} />
        )}
      </CardContent>
    </Card>
  );
}
