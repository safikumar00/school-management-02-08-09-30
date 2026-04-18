/**
 * Unified API error + normalizer.
 * Every thrown error from services/api has this shape,
 * so screens can show deterministic error messages + retry CTAs.
 */
import type { AxiosError } from 'axios';

export type ApiErrorCode =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'SERVER'
  | 'UNKNOWN';

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number | null;
  details?: unknown;
  retryable: boolean;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number | null = null,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.retryable = code === 'NETWORK' || code === 'TIMEOUT' || code === 'SERVER';
  }
}

export function normalizeError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  const axiosErr = err as AxiosError<{ message?: string; error?: string }>;

  if (axiosErr?.code === 'ECONNABORTED' || /timeout/i.test(axiosErr?.message ?? '')) {
    return new ApiError('TIMEOUT', 'Request took too long. Please try again.');
  }

  if (axiosErr?.message === 'Network Error' || !axiosErr?.response) {
    return new ApiError(
      'NETWORK',
      'Unable to reach the server. Check your connection and retry.',
    );
  }

  const status = axiosErr.response.status;
  const serverMsg =
    axiosErr.response.data?.message ??
    axiosErr.response.data?.error ??
    axiosErr.message;

  switch (status) {
    case 400:
      return new ApiError('VALIDATION', serverMsg || 'Invalid request.', status);
    case 401:
      return new ApiError('UNAUTHORIZED', serverMsg || 'Session expired.', status);
    case 403:
      return new ApiError('FORBIDDEN', serverMsg || 'Access denied.', status);
    case 404:
      return new ApiError('NOT_FOUND', serverMsg || 'Not found.', status);
    case 409:
      return new ApiError('CONFLICT', serverMsg || 'Conflict.', status);
    default:
      if (status >= 500)
        return new ApiError('SERVER', serverMsg || 'Server error. Try again.', status);
      return new ApiError('UNKNOWN', serverMsg || 'Something went wrong.', status);
  }
}
