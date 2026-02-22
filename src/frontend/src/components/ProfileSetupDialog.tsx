import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfileSetupDialogProps {
  open: boolean;
}

export default function ProfileSetupDialog({ open }: ProfileSetupDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(t('nameRequired'));
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success(t('profileSaved'));
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error(t('profileSaveError'));
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('welcomeTitle')}</DialogTitle>
          <DialogDescription>{t('welcomeDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('yourName')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterYourName')}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saveProfile.isPending}
            className="w-full"
          >
            {saveProfile.isPending ? t('saving') : t('continue')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
