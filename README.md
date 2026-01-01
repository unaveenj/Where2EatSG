# Singapore Food Explorer

An interactive web application that visualizes and enables natural language search of food establishments across Singapore using government open data.

## Features

- 🗣️ Natural language search for food establishments
- 🗺️ Interactive map visualization with Leaflet
- 📍 Location-based filtering and distance calculation
- 📱 Fully responsive mobile design
- 🔍 Smart query parsing with OpenRouter API (optional)
- 📊 Real-time results filtering

## Tech Stack

- **Frontend**: React + Vite
- **Map**: Leaflet + React-Leaflet
- **Styling**: Tailwind CSS
- **NLP**: OpenRouter API (optional, with local fallback)
- **Data**: Singapore government open data (GeoJSON)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file for OpenRouter API:
```env
VITE_OPENROUTER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Usage

### Search Examples

- "Show me 5 Indian restaurants near Tampines"
- "Chinese food in Orchard"
- "Halal food within 2km of Jurong East"
- "Vegetarian options near Bishan"

### Features

- **Natural Language Search**: Type queries in plain English
- **Interactive Map**: Click markers to see establishment details
- **Results List**: Browse and select from search results
- **Mobile Responsive**: Toggle between map and list views on mobile

## Data Source

Uses the `EatingEstablishments.geojson` file from [data.gov.sg](https://data.gov.sg) containing all licensed food establishments in Singapore.

## Environment Variables

- `VITE_OPENROUTER_API_KEY` - OpenRouter API key (optional, uses local parser as fallback)
- `VITE_MAP_DEFAULT_CENTER` - Default map center coordinates
- `VITE_MAP_DEFAULT_ZOOM` - Default map zoom level

## Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx      # Search input component
│   ├── Map.jsx            # Leaflet map component
│   └── ResultsList.jsx    # Search results list
├── services/
│   ├── openRouterAPI.js   # Natural language processing
│   └── searchEngine.js    # Search and filter logic
├── utils/
│   └── distanceCalculator.js  # Haversine distance calculations
├── data/
│   └── EatingEstablishments.geojson  # Food establishments data
└── App.jsx                # Main application component
```

## License

MIT
