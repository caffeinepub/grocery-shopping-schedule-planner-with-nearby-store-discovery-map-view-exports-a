import { useMemo, useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, TrendingUp, Edit } from 'lucide-react';
import { estimateTotalCost, getHighestCostItems, DEFAULT_PRICES } from '../lib/costing';
import type { Item } from '../backend';

interface CostSummaryProps {
  items: Item[];
  budget: number;
  priceOverrides: Record<string, number>;
  onPriceOverridesChange: (overrides: Record<string, number>) => void;
}

export default function CostSummary({
  items,
  budget,
  priceOverrides,
  onPriceOverridesChange,
}: CostSummaryProps) {
  const { t } = useTranslation();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const total = useMemo(() => estimateTotalCost(items, priceOverrides), [items, priceOverrides]);
  const highestCostItems = useMemo(() => getHighestCostItems(items, priceOverrides, 3), [items, priceOverrides]);

  const isOverBudget = total > budget;
  const delta = Math.abs(total - budget);

  const handleEditPrice = (itemName: string) => {
    const currentPrice = priceOverrides[itemName] || DEFAULT_PRICES[itemName.toLowerCase()] || 50;
    setEditingItem(itemName);
    setEditPrice(String(currentPrice));
  };

  const handleSavePrice = () => {
    if (editingItem && editPrice) {
      onPriceOverridesChange({
        ...priceOverrides,
        [editingItem]: Number(editPrice),
      });
      setEditingItem(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {t('costEstimate')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-2xl font-bold">
          <span>{t('estimatedTotal')}</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isOverBudget ? 'destructive' : 'default'} className="text-sm">
            {isOverBudget ? t('overBudget') : t('withinBudget')}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {isOverBudget ? '+' : '-'}₹{delta.toFixed(2)}
          </span>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('highestCostItems')}
          </Label>
          <div className="space-y-2">
            {highestCostItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">₹{item.price.toFixed(2)}</span>
                  {editingItem === item.name ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-20 h-7"
                      />
                      <Button size="sm" onClick={handleSavePrice}>
                        {t('save')}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditPrice(item.name)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{t('pricesAreEstimated')}</p>
      </CardContent>
    </Card>
  );
}
