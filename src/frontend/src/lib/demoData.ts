import type { Item } from '../backend';

export const DEMO_LOCATION = {
  label: 'Indore, Madhya Pradesh',
  latitude: 22.7196,
  longitude: 75.8577,
};

export const DEMO_ITEMS: Item[] = [
  { name: 'Milk' },
  { name: 'Bread' },
  { name: 'Eggs' },
  { name: 'Rice' },
];

export interface DemoShop {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  rating?: number;
  openingHours?: {
    open: string;
    close: string;
  };
}

export const DEMO_SHOPS: DemoShop[] = [
  {
    name: 'D-Mart Indore',
    address: 'Treasure Island Mall, MG Road, Indore, Madhya Pradesh 452001',
    latitude: 22.7242,
    longitude: 75.8652,
    phone: '+91 731 4012345',
    rating: 4.3,
    openingHours: { open: '08:00', close: '22:00' },
  },
  {
    name: 'Reliance Fresh',
    address: 'Vijay Nagar, Indore, Madhya Pradesh 452010',
    latitude: 22.7532,
    longitude: 75.8937,
    phone: '+91 731 4056789',
    rating: 4.1,
    openingHours: { open: '07:00', close: '23:00' },
  },
  {
    name: 'Sharma Kirana Store',
    address: 'Rajwada, Indore, Madhya Pradesh 452002',
    latitude: 22.7196,
    longitude: 75.8577,
    phone: '+91 731 2501234',
    rating: 4.5,
    openingHours: { open: '06:00', close: '21:00' },
  },
  {
    name: 'Big Bazaar Indore',
    address: 'C21 Mall, Scheme 54, Indore, Madhya Pradesh 452010',
    latitude: 22.7486,
    longitude: 75.8947,
    phone: '+91 731 4098765',
    rating: 4.2,
    openingHours: { open: '10:00', close: '22:00' },
  },
];
