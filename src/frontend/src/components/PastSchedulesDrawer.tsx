import { useTranslation } from '../lib/i18n';
import { useListSchedules, useDeleteSchedule } from '../hooks/useQueries';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Calendar, MapPin } from 'lucide-react';
import type { Schedule } from '../backend';
import { toast } from 'sonner';

interface PastSchedulesDrawerProps {
  open: boolean;
  onClose: () => void;
  onCloneSchedule: (schedule: Schedule) => void;
}

export default function PastSchedulesDrawer({ open, onClose, onCloneSchedule }: PastSchedulesDrawerProps) {
  const { t } = useTranslation();
  const { data: schedules, isLoading } = useListSchedules();
  const deleteSchedule = useDeleteSchedule();

  const handleDelete = async (id: bigint) => {
    try {
      await deleteSchedule.mutateAsync(id);
      toast.success(t('scheduleDeleted'));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(t('scheduleDeleteError'));
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('pastSchedules')}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <p className="text-center text-muted-foreground">{t('loading')}</p>
          ) : !schedules || schedules.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('noSchedulesYet')}</p>
          ) : (
            schedules.map((schedule) => (
              <Card key={schedule.id.toString()} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {schedule.location}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(Number(schedule.preferredDateTime) / 1000000).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary">₹{Number(schedule.budget)}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {schedule.items.slice(0, 5).map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item.name}
                      </Badge>
                    ))}
                    {schedule.items.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{schedule.items.length - 5}
                      </Badge>
                    )}
                  </div>

                  {schedule.selectedShop && (
                    <p className="text-sm text-muted-foreground">
                      {t('shop')}: {schedule.selectedShop.name}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onCloneSchedule(schedule);
                        toast.success(t('scheduleCloned'));
                      }}
                      className="flex-1"
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      {t('clone')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
