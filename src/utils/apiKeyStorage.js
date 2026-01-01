const API_KEY_STORAGE_KEY = 'openrouter_api_key';

export function saveApiKey(apiKey) {
  if (apiKey) {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_OPENROUTER_API_KEY || '';
}

export function hasApiKey() {
  return !!getApiKey();
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}
