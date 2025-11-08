export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  appName: 'Themis',
  appDescription: 'Gen AI Initiative Prioritization Engine',
  version: '1.0.0',
} as const;

export type Config = typeof config;
