import { useTranslation } from '../lib/i18n';
import { useGetQuickBuyList } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import type { Item } from '../backend';

const DEFAULT_QUICK_BUY_ITEMS: Item[] = [
  { name: 'Milk' },
  { name: 'Bread' },
  { name: 'Eggs' },
  { name: 'Rice' },
  { name: 'Biscuits' },
  { name: 'Tea' },
  { name: 'Sugar' },
  { name: 'Chips' },
];

interface QuickBuyListProps {
  onAddItems: (items: Item[]) => void;
}

export default function QuickBuyList({ onAddItems }: QuickBuyListProps) {
  const { t } = useTranslation();
  const { data: userQuickBuyList } = useGetQuickBuyList();

  const quickBuyItems = userQuickBuyList && userQuickBuyList.length > 0 
    ? userQuickBuyList 
    : DEFAULT_QUICK_BUY_ITEMS;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          {t('quickBuyList')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {quickBuyItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onAddItems([item])}
            >
              + {item.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
