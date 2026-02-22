import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '../lib/i18n';
import LanguageToggle from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function AppHeader() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/logo-shopping-schedule.dim_512x512.png" 
            alt="Logo" 
            className="h-10 w-10"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t('appTitle')}
            </h1>
            <p className="text-xs text-muted-foreground">{t('appSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {disabled ? t('loggingIn') : isAuthenticated ? t('logout') : t('login')}
          </Button>
        </div>
      </div>
    </header>
  );
}
