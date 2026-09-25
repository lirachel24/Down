import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  lat: number;
  lng: number;
  interactive?: boolean;
  onPick?: (lat: number, lng: number) => void;
  className?: string;
}

const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="34" height="42" viewBox="0 0 34 42" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17 1C8.7 1 2 7.6 2 15.8 2 26.6 17 41 17 41s15-14.4 15-25.2C32 7.6 25.3 1 17 1z" fill="#FF4D94" stroke="#18111A" stroke-width="2"/>
    <circle cx="17" cy="16" r="5.5" fill="#FAF6EE"/></svg>`,
  iconSize: [34, 42],
  iconAnchor: [17, 41],
});

export const LocationMap: React.FC<LocationMapProps> = ({ lat, lng, interactive = true, onPick, className = '' }) => {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      keyboard: interactive,
      attributionControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    marker.current = L.marker([lat, lng], { icon: pinIcon, keyboard: false }).addTo(m);
    if (interactive) m.on('click', (e) => onPickRef.current?.(e.latlng.lat, e.latlng.lng));
    map.current = m;
    // The map is often mounted while its container is still laying out
    const t = setTimeout(() => m.invalidateSize(), 50);
    return () => {
      clearTimeout(t);
      m.remove();
      map.current = null;
      marker.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    marker.current?.setLatLng([lat, lng]);
    map.current?.setView([lat, lng], map.current.getZoom());
  }, [lat, lng]);

  return <div ref={el} className={`z-0 ${className}`} role="img" aria-label="Map showing the event location" />;
};
