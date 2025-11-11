const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Ensure the API URL always points at the API prefix. Accepts values with or without
// a trailing '/api' (or trailing slash) and normalizes them to end with '/api'.
const normalizedApiUrl = (() => {
  const v = rawApiUrl.trim();
  if (v.endsWith('/api')) return v;
  // remove trailing slash if present then append /api
  return v.replace(/\/$/, '') + '/api';
})();

export const config = {
  apiUrl: normalizedApiUrl,
  appName: 'Themis',
  appDescription: 'Gen AI Initiative Prioritization Engine',
  version: '1.0.0',
} as const;

export type Config = typeof config;
