/**
 * Environment configuration for the app.
 * Switch USE_MOCK to false to hit a real backend seamlessly.
 */
export const ENV = {
  USE_MOCK: (process.env.EXPO_PUBLIC_USE_MOCK ?? 'true') !== 'false',
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.eduflow.mock/api',
  API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT ?? 10000),
  API_RETRIES: Number(process.env.EXPO_PUBLIC_API_RETRIES ?? 2),
  MOCK_LATENCY_MIN: 280,
  MOCK_LATENCY_MAX: 700,
  APP_NAME: 'EduFlow',
  APP_VERSION: '1.0.0',
  APP_TAGLINE: 'Campus. Simplified.',
} as const;
