import type { Item } from '../../backend';
import type { ShopResult } from '../providers/placesProviders';

interface ICSParams {
  location: string;
  preferredDateTime: Date;
  shop: ShopResult;
  items: Item[];
  notes: string;
}

export function generateICS(params: ICSParams): void {
  const { location, preferredDateTime, shop, items, notes } = params;

  const startDate = preferredDateTime;
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

  const formatDate = (date: Date): string => {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  };

  const itemsList = items.map((item) => item.name).join(', ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smart Shopping Planner//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@smartshoppingplanner.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:Shopping at ${shop.name}`,
    `LOCATION:${shop.address}`,
    `DESCRIPTION:Shopping trip for: ${itemsList}\\n\\nNotes: ${notes || 'None'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `shopping-${shop.name.replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
