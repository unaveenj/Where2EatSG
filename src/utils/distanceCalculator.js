// Haversine formula to calculate distance between two coordinates
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// Get Singapore's approximate center coordinates
export function getSingaporeCenter() {
  return {
    lat: 1.3521,
    lng: 103.8198
  };
}

// Find geocoordinates for common Singapore locations
export function getLocationCoordinates(locationName) {
  const locations = {
    'tampines': { lat: 1.3496, lng: 103.9568 },
    'orchard': { lat: 1.3048, lng: 103.8318 },
    'jurong': { lat: 1.3329, lng: 103.7436 },
    'jurong east': { lat: 1.3329, lng: 103.7436 },
    'woodlands': { lat: 1.4382, lng: 103.7891 },
    'bedok': { lat: 1.3236, lng: 103.9273 },
    'bishan': { lat: 1.3526, lng: 103.8352 },
    'clementi': { lat: 1.3162, lng: 103.7649 },
    'toa payoh': { lat: 1.3343, lng: 103.8497 },
    'ang mo kio': { lat: 1.3691, lng: 103.8454 },
    'hougang': { lat: 1.3612, lng: 103.8864 },
    'sengkang': { lat: 1.3868, lng: 103.8914 },
    'punggol': { lat: 1.4043, lng: 103.9021 },
    'pasir ris': { lat: 1.3721, lng: 103.9474 },
    'serangoon': { lat: 1.3554, lng: 103.8679 },
    'bukit batok': { lat: 1.3590, lng: 103.7637 },
    'choa chu kang': { lat: 1.3840, lng: 103.7470 },
    'yishun': { lat: 1.4304, lng: 103.8354 },
  };

  return locations[locationName?.toLowerCase()] || getSingaporeCenter();
}
