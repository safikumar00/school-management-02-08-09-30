import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../../constants/env';
import { storage } from '../../utils/storage';
import { normalizeError } from './errors';

// Track in-flight GET requests for dedupe across parallel callers.
const inflight = new Map<string, Promise<unknown>>();

type RetryConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
  __dedupeKey?: string;
};

const client: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// ---- Request interceptor: inject auth token ----
client.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor: retry on transient errors, normalize on failure ----
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const cfg = error.config as RetryConfig | undefined;
    if (!cfg) return Promise.reject(normalizeError(error));

    const retries = ENV.API_RETRIES;
    cfg.__retryCount = cfg.__retryCount ?? 0;

    const isTransient =
      error.code === 'ECONNABORTED' ||
      !error.response ||
      (error.response && error.response.status >= 500);

    const method = (cfg.method || 'get').toLowerCase();
    const isIdempotent = method === 'get' || method === 'head' || method === 'options';

    if (isTransient && isIdempotent && cfg.__retryCount < retries) {
      cfg.__retryCount += 1;
      const delay = 250 * 2 ** (cfg.__retryCount - 1);
      await new Promise((r) => setTimeout(r, delay));
      return client(cfg);
    }

    // 401 → clear auth so UI redirects to login
    if (error.response?.status === 401) {
      await storage.clearAll();
    }

    return Promise.reject(normalizeError(error));
  },
);

/**
 * Deduped GET: parallel callers share the same inflight request.
 * Subsequent callers get the already-resolved promise.
 */
export async function dedupedGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const key = `GET:${url}:${JSON.stringify(params ?? {})}`;
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = client
    .get<T>(url, { params })
    .then((r) => r.data)
    .finally(() => inflight.delete(key));

  inflight.set(key, promise as Promise<unknown>);
  return promise;
}

export { client as apiClient };
export default client;
