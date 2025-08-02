import { APP_CONFIG } from '../config/appConfig';
import { mockAPI } from './mocks';
import { realAPI } from './client';

// API facade that switches between mock and real implementations
export const api = APP_CONFIG.USE_MOCK ? mockAPI : realAPI;

export * from './mocks';
export * from './client';