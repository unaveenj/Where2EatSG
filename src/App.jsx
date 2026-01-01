import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Map from './components/Map';
import ResultsList from './components/ResultsList';
import ApiKeyModal from './components/ApiKeyModal';
import { processNaturalQuery } from './services/openRouterAPI';
import { searchEstablishments } from './services/searchEngine';
import { getApiKey, saveApiKey, hasApiKey } from './utils/apiKeyStorage';
import geoJsonData from './data/EatingEstablishments.geojson';

function App() {
  const [establishments, setEstablishments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(hasApiKey());

  // Load GeoJSON data on mount
  useEffect(() => {
    if (geoJsonData && geoJsonData.features) {
      setEstablishments(geoJsonData.features);
      // Show first 20 establishments by default
      setSearchResults(geoJsonData.features.slice(0, 20));
    }
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setSelectedEstablishment(null);
    setSelectedId(null);

    try {
      // Process natural language query
      const parsedQuery = await processNaturalQuery(query);
      console.log('Parsed query:', parsedQuery);

      // Search establishments
      const results = searchEstablishments(establishments, parsedQuery);
      setSearchResults(results);

      // On mobile, show results list after search
      setShowMobileList(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEstablishment = (establishment, id) => {
    setSelectedEstablishment(establishment);
    setSelectedId(id);
    // On mobile, hide list and show map when selecting
    setShowMobileList(false);
  };

  const handleSaveApiKey = (apiKey) => {
    saveApiKey(apiKey);
    setApiKeyConfigured(hasApiKey());
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1"></div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              🍽️ Singapore Food Explorer
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                title="Configure API Key"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="hidden sm:inline">
                  {apiKeyConfigured ? 'API Key Set' : 'Set API Key'}
                </span>
                {apiKeyConfigured && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
        currentKey={getApiKey()}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Results Panel - Desktop: fixed left, Mobile: toggleable overlay */}
        <div
          className={`
            w-full md:w-96 bg-white border-r flex flex-col
            md:relative md:block
            ${showMobileList ? 'fixed inset-0 z-20' : 'hidden md:flex'}
          `}
        >
          {/* Mobile close button */}
          <button
            onClick={() => setShowMobileList(false)}
            className="md:hidden absolute top-4 right-4 z-30 p-2 bg-white rounded-full shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <ResultsList
            results={searchResults}
            onSelectEstablishment={handleSelectEstablishment}
            selectedId={selectedId}
          />
        </div>

        {/* Map Panel */}
        <div className="flex-1 relative">
          <Map
            results={searchResults}
            selectedEstablishment={selectedEstablishment}
            onMarkerClick={handleSelectEstablishment}
          />

          {/* Mobile toggle button */}
          <button
            onClick={() => setShowMobileList(!showMobileList)}
            className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            View Results ({searchResults.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
