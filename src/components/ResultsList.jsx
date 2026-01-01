import { getEstablishmentDetails } from '../services/searchEngine';
import { formatDistance } from '../utils/distanceCalculator';

export default function ResultsList({ results, onSelectEstablishment, selectedId }) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No results found</p>
        <p className="text-gray-400 text-sm mt-2">Try a different search query</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full bg-gray-50">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 to-red-500 p-4 shadow-md">
        <h2 className="font-bold text-white text-lg">
          {results.length} {results.length === 1 ? 'Place' : 'Places'} Found
        </h2>
      </div>

      <div className="p-3 space-y-3">
        {results.map((establishment, idx) => {
          const details = getEstablishmentDetails(establishment);
          const isSelected = selectedId === idx;

          return (
            <button
              key={idx}
              onClick={() => onSelectEstablishment(establishment, idx)}
              className={`w-full text-left p-4 rounded-xl transition-all transform hover:scale-[1.02] ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-500 shadow-lg'
                  : 'bg-white hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-base pr-2 leading-tight">{details.name}</h3>
                {isSelected && (
                  <svg className="w-6 h-6 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{details.address}</p>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {formatDistance(details.distance)}
                </span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                  {details.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
