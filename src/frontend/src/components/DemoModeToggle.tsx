import { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube } from 'lucide-react';
import { DEMO_LOCATION, DEMO_ITEMS } from '../lib/demoData';
import type { Item } from '../backend';

interface DemoModeToggleProps {
  onDemoEnabled: (location: string, items: Item[]) => void;
}

export default function DemoModeToggle({ onDemoEnabled }: DemoModeToggleProps) {
  const { t } = useTranslation();
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('demoMode');
    if (stored === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  const handleToggle = () => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    localStorage.setItem('demoMode', String(newMode));
    
    if (newMode) {
      onDemoEnabled(DEMO_LOCATION.label, DEMO_ITEMS);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isDemoMode ? 'default' : 'outline'}
        size="sm"
        onClick={handleToggle}
      >
        <TestTube className="h-4 w-4 mr-2" />
        {t('demoMode')}
      </Button>
      {isDemoMode && (
        <Badge variant="secondary">{t('sampleData')}</Badge>
      )}
    </div>
  );
}
