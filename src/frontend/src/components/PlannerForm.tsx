import { useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, DollarSign, History } from 'lucide-react';
import ItemsEditor from './ItemsEditor';
import QuickBuyList from './QuickBuyList';
import DemoModeToggle from './DemoModeToggle';
import { useGeolocation } from '../hooks/useGeolocation';
import type { PlannerState } from '../App';
import type { Item } from '../backend';

interface PlannerFormProps {
  state: PlannerState;
  onChange: (state: PlannerState) => void;
  onShowPastSchedules: () => void;
}

export default function PlannerForm({ state, onChange, onShowPastSchedules }: PlannerFormProps) {
  const { t } = useTranslation();
  const { requestLocation, isLoading: geoLoading } = useGeolocation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocationClick = async () => {
    const result = await requestLocation();
    if (result.success && result.latitude && result.longitude) {
      onChange({
        ...state,
        location: result.label || `${result.latitude.toFixed(4)}, ${result.longitude.toFixed(4)}`,
        latitude: result.latitude,
        longitude: result.longitude,
      });
    }
  };

  const handleItemsChange = (items: Item[]) => {
    onChange({ ...state, items });
    if (items.length > 0) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!state.location.trim()) newErrors.location = t('locationRequired');
    if (state.items.length === 0) newErrors.items = t('itemsRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{t('planYourShopping')}</CardTitle>
          <div className="flex gap-2">
            <DemoModeToggle 
              onDemoEnabled={(location, items) => {
                onChange({ ...state, location, items });
              }}
            />
            <Button variant="outline" size="sm" onClick={onShowPastSchedules}>
              <History className="h-4 w-4 mr-2" />
              {t('pastSchedules')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('location')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={state.location}
                onChange={(e) => onChange({ ...state, location: e.target.value })}
                placeholder={t('locationPlaceholder')}
                className={errors.location ? 'border-destructive' : ''}
              />
              <Button 
                variant="outline" 
                onClick={handleLocationClick}
                disabled={geoLoading}
              >
                {geoLoading ? t('locating') : t('useMyLocation')}
              </Button>
            </div>
            {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="datetime" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('preferredDateTime')}
            </Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={state.preferredDateTime.toISOString().slice(0, 16)}
              onChange={(e) => onChange({ ...state, preferredDateTime: new Date(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('budget')} (₹)
            </Label>
            <Input
              id="budget"
              type="number"
              value={state.budget}
              onChange={(e) => onChange({ ...state, budget: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('shoppingItems')}</Label>
          <ItemsEditor 
            items={state.items}
            onChange={handleItemsChange}
          />
          {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
        </div>

        <QuickBuyList 
          onAddItems={(items) => {
            const newItems = [...state.items, ...items];
            onChange({ ...state, items: newItems });
          }}
        />
      </CardContent>
    </Card>
  );
}
