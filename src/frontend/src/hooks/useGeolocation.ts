import { useState } from 'react';

interface GeolocationResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  label?: string;
  error?: string;
}

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = async (): Promise<GeolocationResult> => {
    if (!navigator.geolocation) {
      return {
        success: false,
        error: 'Geolocation is not supported by your browser',
      };
    }

    setIsLoading(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLoading(false);
          resolve({
            success: true,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            label: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          });
        },
        (error) => {
          setIsLoading(false);
          resolve({
            success: false,
            error: error.message,
          });
        }
      );
    });
  };

  return { requestLocation, isLoading };
}
