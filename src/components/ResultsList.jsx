import { getEstablishmentDetails } from '../services/searchEngine';
import { formatDistance } from '../utils/distanceCalculator';

export default function ResultsList({ results, onSelectEstablishment, selectedId }) {
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No results found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-semibold text-lg">
          Found {results.length} establishment{results.length !== 1 ? 's' : ''}
        </h2>
      </div>

      <div className="divide-y">
        {results.map((establishment, idx) => {
          const details = getEstablishmentDetails(establishment);
          const isSelected = selectedId === idx;

          return (
            <button
              key={idx}
              onClick={() => onSelectEstablishment(establishment, idx)}
              className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${
                isSelected ? 'bg-blue-100 border-l-4 border-blue-600' : ''
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{details.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{details.address}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {formatDistance(details.distance)}
                </span>
                <span className="px-2 py-1 bg-gray-200 rounded text-xs">{details.type}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
