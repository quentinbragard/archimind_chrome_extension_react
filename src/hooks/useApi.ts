import { useState, useCallback } from 'react';
import { apiService } from '@/services/api.service';

/**
 * Custom hook for API calls with loading and error state
 */
export function useApi<T, P extends any[]>(
  apiMethod: (...args: P) => Promise<T>,
  initialData?: T
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiMethod(...args);
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiMethod]
  );

  return {
    data,
    isLoading,
    error,
    execute,
  };
}

/**
 * Predefined hooks for common API calls
 */

export function useUserStats() {
  return useApi(() => apiService.getUserStats());
}

export function useTemplates() {
  return useApi(() => apiService.getUserTemplates());
}

export function useOfficialTemplates() {
  return useApi(() => apiService.getOfficialTemplates());
}

export function useNotifications() {
  return useApi(() => apiService.getNotifications());
}

export function useUnreadNotifications() {
  return useApi(() => apiService.getUnreadNotifications());
}

export function useEnhancePrompt() {
  return useApi((draftPrompt: string) => apiService.enhancePrompt(draftPrompt));
}

export default useApi;