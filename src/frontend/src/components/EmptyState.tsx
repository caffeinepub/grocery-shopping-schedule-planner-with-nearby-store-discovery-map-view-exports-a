import { useTranslation } from '../lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onRetry: () => void;
}

export default function EmptyState({ onRetry }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="py-12 text-center space-y-4">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{t('noShopsFound')}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t('noShopsFoundDescription')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('tryAgain')}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('deliveryAlternativeSuggestion')}
        </p>
      </CardContent>
    </Card>
  );
}
