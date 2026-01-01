import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Map from './components/Map';
import ResultsList from './components/ResultsList';
import ApiKeyModal from './components/ApiKeyModal';
import { processNaturalQuery } from './services/openRouterAPI';
import { searchEstablishments } from './services/searchEngine';
import { getApiKey, saveApiKey, hasApiKey } from './utils/apiKeyStorage';

function App() {
  const [establishments, setEstablishments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(hasApiKey());
  const [dataLoading, setDataLoading] = useState(true);

  // Load GeoJSON data on mount
  useEffect(() => {
    async function loadGeoJSON() {
      try {
        setDataLoading(true);
        const response = await fetch('/EatingEstablishments.geojson');
        const geoJsonData = await response.json();

        if (geoJsonData && geoJsonData.features) {
          setEstablishments(geoJsonData.features);
          // Show first 20 establishments by default
          setSearchResults(geoJsonData.features.slice(0, 20));
        }
      } catch (error) {
        console.error('Error loading GeoJSON data:', error);
      } finally {
        setDataLoading(false);
      }
    }

    loadGeoJSON();
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

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Loading Food Establishments
          </h2>
          <p className="text-gray-500">Preparing your culinary adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg z-10">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 justify-center">
                <span className="text-4xl">🍽️</span>
                <span>Singapore Food Explorer</span>
              </h1>
              <p className="text-orange-100 text-sm mt-1">Discover amazing food places across Singapore</p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all backdrop-blur-sm border border-white/30"
                title="Configure API Key"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="hidden lg:inline text-sm font-medium">
                  {apiKeyConfigured ? 'API' : 'API Key'}
                </span>
                {apiKeyConfigured && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
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
            w-full md:w-[400px] bg-white flex flex-col shadow-xl
            md:relative md:block
            ${showMobileList ? 'fixed inset-0 z-20' : 'hidden md:flex'}
          `}
        >
          {/* Mobile close button */}
          <button
            onClick={() => setShowMobileList(false)}
            className="md:hidden absolute top-4 right-4 z-30 p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
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
            className="md:hidden fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3 hover:from-orange-600 hover:to-red-600 transition-all border-4 border-white"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-lg">View {searchResults.length} Places</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
