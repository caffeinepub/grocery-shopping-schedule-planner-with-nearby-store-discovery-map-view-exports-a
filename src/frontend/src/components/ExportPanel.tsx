import { useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Calendar, FileText, Save } from 'lucide-react';
import { generateICS } from '../lib/exports/ics';
import { generatePDF } from '../lib/exports/pdf';
import { useSaveSchedule } from '../hooks/useQueries';
import CostSummary from './CostSummary';
import PriceComparison from './PriceComparison';
import type { PlannerState } from '../App';
import type { ShopResult } from '../lib/providers/placesProviders';
import { toast } from 'sonner';

interface ExportPanelProps {
  plannerState: PlannerState;
  selectedShop: ShopResult;
  onNotesChange: (notes: string) => void;
  onPriceOverridesChange: (overrides: Record<string, number>) => void;
}

export default function ExportPanel({
  plannerState,
  selectedShop,
  onNotesChange,
  onPriceOverridesChange,
}: ExportPanelProps) {
  const { t } = useTranslation();
  const saveSchedule = useSaveSchedule();
  const [isSaving, setIsSaving] = useState(false);

  const handleDownloadICS = () => {
    generateICS({
      location: plannerState.location,
      preferredDateTime: plannerState.preferredDateTime,
      shop: selectedShop,
      items: plannerState.items,
      notes: plannerState.notes,
    });
    toast.success(t('calendarDownloaded'));
  };

  const handleDownloadPDF = async () => {
    await generatePDF({
      location: plannerState.location,
      preferredDateTime: plannerState.preferredDateTime,
      budget: plannerState.budget,
      items: plannerState.items,
      shop: selectedShop,
      notes: plannerState.notes,
      priceOverrides: plannerState.itemPriceOverrides,
    });
    toast.success(t('pdfDownloaded'));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSchedule.mutateAsync({
        location: plannerState.location,
        preferredDateTime: BigInt(plannerState.preferredDateTime.getTime() * 1000000),
        budget: BigInt(plannerState.budget),
        items: plannerState.items,
        selectedShop: { name: selectedShop.name },
      });
      toast.success(t('scheduleSaved'));
    } catch (error) {
      console.error('Save error:', error);
      toast.error(t('scheduleSaveError'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('exportSchedule')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CostSummary
          items={plannerState.items}
          budget={plannerState.budget}
          priceOverrides={plannerState.itemPriceOverrides}
          onPriceOverridesChange={onPriceOverridesChange}
        />

        <div className="space-y-2">
          <Label>{t('notesReminders')}</Label>
          <Textarea
            value={plannerState.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={t('addNotesPlaceholder')}
            rows={3}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={handleDownloadICS} variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {t('downloadCalendar')}
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            {t('downloadPDF')}
          </Button>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? t('saving') : t('saveSchedule')}
        </Button>
      </CardContent>
    </Card>
  );
}
