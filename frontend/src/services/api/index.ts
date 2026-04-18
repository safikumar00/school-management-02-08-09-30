/**
 * Single barrel for all API endpoints.
 * Initializes the mock adapter on first import when USE_MOCK is true.
 */
import { setupMocks } from './mockAdapter';

// Kick off mocks before any endpoint gets used.
setupMocks();

export { authApi } from './endpoints/auth';
export { attendanceApi } from './endpoints/attendance';
export { marksApi } from './endpoints/marks';
export { walletApi } from './endpoints/wallet';
export { usersApi } from './endpoints/users';
export { foodCourtApi } from './endpoints/foodCourt';
export { notificationsApi } from './endpoints/notifications';
export { ApiError } from './errors';
export type { ApiErrorCode } from './errors';
export { apiClient } from './client';
