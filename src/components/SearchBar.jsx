import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const examples = [
    "Show me 5 Indian restaurants near Tampines",
    "Chinese food in Orchard",
    "Halal food within 2km of Jurong East",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for food places in natural language..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="text-sm text-gray-600">
        <p className="mb-2 font-medium">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
