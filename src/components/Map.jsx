import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getEstablishmentDetails } from '../services/searchEngine';
import { formatDistance } from '../utils/distanceCalculator';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ results, selectedEstablishment }) {
  const map = useMap();

  useEffect(() => {
    if (results.length > 0) {
      const bounds = L.latLngBounds(
        results.map(est => {
          const [lng, lat] = est.geometry.coordinates;
          return [lat, lng];
        })
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [results, map]);

  useEffect(() => {
    if (selectedEstablishment) {
      const [lng, lat] = selectedEstablishment.geometry.coordinates;
      map.setView([lat, lng], 16, { animate: true });
    }
  }, [selectedEstablishment, map]);

  return null;
}

export default function Map({ results, selectedEstablishment, onMarkerClick }) {
  const defaultCenter = [1.3521, 103.8198]; // Singapore center
  const defaultZoom = 11;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater results={results} selectedEstablishment={selectedEstablishment} />

      {results.map((establishment, idx) => {
        const [lng, lat] = establishment.geometry.coordinates;
        const details = getEstablishmentDetails(establishment);

        return (
          <Marker
            key={idx}
            position={[lat, lng]}
            eventHandlers={{
              click: () => onMarkerClick(establishment, idx)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-2">{details.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{details.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{details.type}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span>{formatDistance(details.distance)} away</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
