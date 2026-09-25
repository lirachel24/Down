import { useCallback, useEffect, useRef, useState } from 'react';
import { LatLng } from './travel';

// Berkeley, until the person shares where they are
export const DEFAULT_LOCATION: LatLng = [37.8712, -122.2685];

export function useMyLocation() {
  const [pos, setPos] = useState<LatLng>(DEFAULT_LOCATION);
  const [known, setKnown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (watchId.current !== null || !navigator.geolocation) return;
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        setPos([p.coords.latitude, p.coords.longitude]);
        setKnown(true);
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 30_000 }
    );
  }, []);

  // If permission was already granted, follow the person without prompting again
  useEffect(() => {
    navigator.permissions
      ?.query({ name: 'geolocation' as PermissionName })
      .then((p) => {
        if (p.state === 'granted') startWatching();
      })
      .catch(() => {});
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [startWatching]);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Location is not available in this browser.');
      return;
    }
    setBusy(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos([p.coords.latitude, p.coords.longitude]);
        setKnown(true);
        setBusy(false);
        startWatching();
      },
      () => {
        setBusy(false);
        setError('Could not get your location. Check your browser permissions.');
      },
      { timeout: 10_000 }
    );
  }, [startWatching]);

  return { pos, known, busy, error, locate };
}
