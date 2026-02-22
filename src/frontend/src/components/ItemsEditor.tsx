import { useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import type { Item } from '../backend';

interface ItemsEditorProps {
  items: Item[];
  onChange: (items: Item[]) => void;
}

export default function ItemsEditor({ items, onChange }: ItemsEditorProps) {
  const { t } = useTranslation();
  const [newItem, setNewItem] = useState('');
  const { isSupported, isListening, transcript, startListening, stopListening } = useSpeechToText();

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, { name: newItem.trim() }]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setNewItem(transcript);
      }
    } else {
      startListening();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={isListening ? transcript : newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={t('addItemPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          disabled={isListening}
        />
        {isSupported && (
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={handleVoiceToggle}
            title={isListening ? t('stopVoice') : t('startVoice')}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <Button onClick={handleAdd} disabled={!newItem.trim() && !isListening}>
          <Plus className="h-4 w-4 mr-2" />
          {t('add')}
        </Button>
      </div>

      {isListening && (
        <p className="text-sm text-muted-foreground">{t('listeningForVoice')}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
            {item.name}
            <button
              onClick={() => handleRemove(index)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
