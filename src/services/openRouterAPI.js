import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function processNaturalQuery(userQuery) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn('OpenRouter API key not configured');
    return parseQueryLocally(userQuery);
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a query parser for food establishments in Singapore. Extract structured data from natural language queries and return ONLY a valid JSON object with these fields:
- cuisine: string or null (type of food: Chinese, Indian, Western, etc.)
- location: string or null (area name: Tampines, Orchard, etc.)
- count: number (default: 10, max: 50)
- radius: number in meters (default: 5000)
- filters: array of strings (dietary requirements: vegetarian, halal, etc.)

Example query: "Show me 5 Indian restaurants near Tampines"
Response: {"cuisine":"Indian","location":"Tampines","count":5,"radius":5000,"filters":[]}

Return ONLY the JSON object, no additional text.`
          },
          {
            role: 'user',
            content: userQuery
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return parseQueryLocally(userQuery);
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return parseQueryLocally(userQuery);
  }
}

// Simple local fallback parser
function parseQueryLocally(query) {
  const lowerQuery = query.toLowerCase();

  // Extract count
  const countMatch = query.match(/(\d+)/);
  const count = countMatch ? Math.min(parseInt(countMatch[1]), 50) : 10;

  // Common cuisines
  const cuisines = ['chinese', 'indian', 'malay', 'western', 'japanese', 'korean', 'thai', 'vietnamese', 'italian', 'mexican'];
  const cuisine = cuisines.find(c => lowerQuery.includes(c)) || null;

  // Common locations
  const locations = ['tampines', 'orchard', 'jurong', 'woodlands', 'bedok', 'bishan', 'clementi', 'toa payoh', 'ang mo kio'];
  const location = locations.find(l => lowerQuery.includes(l)) || null;

  // Filters
  const filters = [];
  if (lowerQuery.includes('halal')) filters.push('halal');
  if (lowerQuery.includes('vegetarian') || lowerQuery.includes('veg')) filters.push('vegetarian');

  // Extract radius
  const radiusMatch = query.match(/(\d+)\s*(km|m|meter|kilometer)/i);
  let radius = 5000; // default 5km
  if (radiusMatch) {
    const value = parseInt(radiusMatch[1]);
    radius = radiusMatch[2].toLowerCase().startsWith('k') ? value * 1000 : value;
  }

  return {
    cuisine,
    location,
    count,
    radius,
    filters
  };
}
