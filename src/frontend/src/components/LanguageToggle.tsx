import { useTranslation } from '../lib/i18n';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
    </Button>
  );
}
