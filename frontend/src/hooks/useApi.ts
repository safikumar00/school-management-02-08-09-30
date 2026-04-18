/**
 * useApi: tiny data-fetcher with loading / error / retry / cache.
 * - Caches identical fetcher results by cacheKey for `staleTime` ms.
 * - Dedupes parallel callers via the shared inflight map.
 * - Exposes refresh() to bypass cache.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../services/api';

type Cache = Map<string, { data: unknown; at: number }>;
const cache: Cache = new Map();
const inflight: Map<string, Promise<unknown>> = new Map();

interface Options {
  cacheKey?: string;
  staleTime?: number; // ms
  enabled?: boolean;
}

export interface UseApiResult<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  opts: Options = {},
): UseApiResult<T> {
  const { cacheKey, staleTime = 30_000, enabled = true } = opts;
  const [data, setData] = useState<T | null>(() => {
    if (cacheKey && cache.has(cacheKey)) {
      const hit = cache.get(cacheKey)!;
      if (Date.now() - hit.at < staleTime) return hit.data as T;
    }
    return null;
  });
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(enabled && data === null);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  const run = useCallback(
    async (isRefresh = false) => {
      if (!enabled) return;
      try {
        if (!isRefresh) setLoading(data === null);
        else setRefreshing(true);
        setError(null);

        // Dedupe in-flight fetches per cache key
        let promise: Promise<T>;
        if (cacheKey && inflight.has(cacheKey)) {
          promise = inflight.get(cacheKey) as Promise<T>;
        } else {
          promise = fetcher();
          if (cacheKey) inflight.set(cacheKey, promise as Promise<unknown>);
        }

        const result = await promise;
        if (cacheKey) {
          cache.set(cacheKey, { data: result, at: Date.now() });
          inflight.delete(cacheKey);
        }
        if (mounted.current) setData(result);
      } catch (err) {
        if (cacheKey) inflight.delete(cacheKey);
        if (mounted.current) setError(err as ApiError);
      } finally {
        if (mounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, cacheKey, ...deps],
  );

  useEffect(() => {
    mounted.current = true;
    run(false);
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const refresh = useCallback(async () => {
    if (cacheKey) cache.delete(cacheKey);
    await run(true);
  }, [cacheKey, run]);

  return { data, error, loading, refreshing, refresh };
}

export function clearApiCache(): void {
  cache.clear();
}
