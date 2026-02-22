import { useTranslation } from '../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Item } from '../backend';

const CATEGORIES = ['groceries', 'snacks', 'beverages', 'dairy', 'bakery', 'household'];

interface CategoryMappingEditorProps {
  items: Item[];
  mapping: Record<string, string>;
  onMappingChange: (mapping: Record<string, string>) => void;
}

export default function CategoryMappingEditor({ items, mapping, onMappingChange }: CategoryMappingEditorProps) {
  const { t } = useTranslation();

  const handleCategoryChange = (itemName: string, category: string) => {
    onMappingChange({ ...mapping, [itemName]: category });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('editItemCategories')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <Label className="flex-1">{item.name}</Label>
            <Select
              value={mapping[item.name] || 'groceries'}
              onValueChange={(v) => handleCategoryChange(item.name, v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
