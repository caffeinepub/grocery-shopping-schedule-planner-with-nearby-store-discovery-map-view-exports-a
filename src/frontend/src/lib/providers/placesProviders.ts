import { calculateDistance, estimateETA } from '../geo';
import { DEMO_SHOPS, DEMO_LOCATION } from '../demoData';

export interface ShopResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  openingStatus: 'open' | 'closed' | 'unknown';
  phone?: string;
  etaMinutes?: number;
  rating?: number;
}

interface DiscoverParams {
  location: string;
  latitude?: number;
  longitude?: number;
  provider: 'osm' | 'google';
  apiKey?: string;
  categories?: string[];
}

export async function discoverShops(params: DiscoverParams): Promise<ShopResult[]> {
  const isDemoMode = localStorage.getItem('demoMode') === 'true';

  if (isDemoMode || !params.latitude || !params.longitude) {
    return getDemoShops(params.latitude || DEMO_LOCATION.latitude, params.longitude || DEMO_LOCATION.longitude);
  }

  try {
    if (params.provider === 'google' && params.apiKey) {
      return await discoverWithGoogle(params);
    } else {
      return await discoverWithOSM(params);
    }
  } catch (error) {
    console.error('Discovery failed, falling back to demo:', error);
    return getDemoShops(params.latitude, params.longitude);
  }
}

function getDemoShops(userLat: number, userLon: number): ShopResult[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  return DEMO_SHOPS.map((shop) => {
    const distance = calculateDistance(userLat, userLon, shop.latitude, shop.longitude);
    
    let openingStatus: 'open' | 'closed' | 'unknown' = 'unknown';
    if (shop.openingHours) {
      const [openHour, openMin] = shop.openingHours.open.split(':').map(Number);
      const [closeHour, closeMin] = shop.openingHours.close.split(':').map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;
      openingStatus = currentTime >= openTime && currentTime < closeTime ? 'open' : 'closed';
    }

    return {
      name: shop.name,
      address: shop.address,
      latitude: shop.latitude,
      longitude: shop.longitude,
      distanceKm: distance,
      openingStatus,
      phone: shop.phone,
      etaMinutes: estimateETA(distance),
      rating: shop.rating,
    };
  }).sort((a, b) => {
    if (a.openingStatus === 'open' && b.openingStatus !== 'open') return -1;
    if (a.openingStatus !== 'open' && b.openingStatus === 'open') return 1;
    return a.distanceKm - b.distanceKm;
  });
}

async function discoverWithOSM(params: DiscoverParams): Promise<ShopResult[]> {
  const { latitude, longitude } = params;
  if (!latitude || !longitude) return [];

  const query = `
    [out:json][timeout:25];
    (
      node["shop"="supermarket"](around:5000,${latitude},${longitude});
      node["shop"="convenience"](around:5000,${latitude},${longitude});
      node["shop"="grocery"](around:5000,${latitude},${longitude});
    );
    out body;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });

  if (!response.ok) throw new Error('OSM request failed');

  const data = await response.json();
  const shops: ShopResult[] = data.elements
    .filter((el: any) => el.tags?.name)
    .map((el: any) => {
      const distance = calculateDistance(latitude, longitude, el.lat, el.lon);
      return {
        name: el.tags.name,
        address: el.tags['addr:full'] || el.tags['addr:street'] || 'Address not available',
        latitude: el.lat,
        longitude: el.lon,
        distanceKm: distance,
        openingStatus: 'unknown' as const,
        phone: el.tags.phone,
        etaMinutes: estimateETA(distance),
        rating: undefined,
      };
    })
    .sort((a: ShopResult, b: ShopResult) => a.distanceKm - b.distanceKm)
    .slice(0, 10);

  return shops;
}

async function discoverWithGoogle(params: DiscoverParams): Promise<ShopResult[]> {
  const { latitude, longitude, apiKey } = params;
  if (!latitude || !longitude || !apiKey) return [];

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=grocery_or_supermarket&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Google Places request failed');

  const data = await response.json();
  
  const shops: ShopResult[] = data.results
    .map((place: any) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      return {
        name: place.name,
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        distanceKm: distance,
        openingStatus: place.opening_hours?.open_now ? 'open' : 'closed',
        etaMinutes: estimateETA(distance),
        rating: place.rating,
      };
    })
    .filter((shop: ShopResult) => !shop.rating || shop.rating >= 4)
    .sort((a: ShopResult, b: ShopResult) => {
      if (a.openingStatus === 'open' && b.openingStatus !== 'open') return -1;
      if (a.openingStatus !== 'open' && b.openingStatus === 'open') return 1;
      return a.distanceKm - b.distanceKm;
    })
    .slice(0, 10);

  return shops;
}
