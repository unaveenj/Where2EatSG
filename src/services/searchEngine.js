import { calculateDistance, getLocationCoordinates } from '../utils/distanceCalculator';

export function searchEstablishments(establishments, query) {
  const { cuisine, location, count, radius, filters } = query;

  let results = [...establishments];

  // Filter by cuisine if specified
  if (cuisine) {
    results = results.filter(est => {
      const name = est.properties?.DESCRIPTION?.toLowerCase() || '';
      const type = est.properties?.TYPE?.toLowerCase() || '';
      return name.includes(cuisine.toLowerCase()) || type.includes(cuisine.toLowerCase());
    });
  }

  // Filter by location and calculate distances
  if (location) {
    const centerCoords = getLocationCoordinates(location);

    results = results.map(est => {
      const [lng, lat] = est.geometry.coordinates;
      const distance = calculateDistance(
        centerCoords.lat,
        centerCoords.lng,
        lat,
        lng
      );

      return {
        ...est,
        distance
      };
    });

    // Filter by radius
    results = results.filter(est => est.distance <= radius);

    // Sort by distance
    results.sort((a, b) => a.distance - b.distance);
  } else {
    // If no location specified, calculate distance from Singapore center
    const centerCoords = getLocationCoordinates();

    results = results.map(est => {
      const [lng, lat] = est.geometry.coordinates;
      const distance = calculateDistance(
        centerCoords.lat,
        centerCoords.lng,
        lat,
        lng
      );

      return {
        ...est,
        distance
      };
    });

    results.sort((a, b) => a.distance - b.distance);
  }

  // Apply filters
  if (filters && filters.length > 0) {
    results = results.filter(est => {
      const description = est.properties?.DESCRIPTION?.toLowerCase() || '';
      const type = est.properties?.TYPE?.toLowerCase() || '';
      const combined = `${description} ${type}`;

      return filters.every(filter => combined.includes(filter.toLowerCase()));
    });
  }

  // Limit results
  return results.slice(0, count);
}

export function getEstablishmentDetails(establishment) {
  const props = establishment.properties || {};

  return {
    name: props.DESCRIPTION || props.NAME || 'Unknown Establishment',
    address: props.ADDRESSBLOCKHOUSENUMBER && props.ADDRESSSTREETNAME
      ? `${props.ADDRESSBLOCKHOUSENUMBER} ${props.ADDRESSSTREETNAME}, Singapore ${props.ADDRESSPOSTALCODE || ''}`
      : props.ADDRESS || 'Address not available',
    type: props.TYPE || 'Food Establishment',
    postalCode: props.ADDRESSPOSTALCODE || '',
    coordinates: establishment.geometry.coordinates,
    distance: establishment.distance
  };
}
