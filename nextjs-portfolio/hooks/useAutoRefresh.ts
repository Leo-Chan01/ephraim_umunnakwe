import { useState, useEffect, useCallback } from 'react';

interface UseAutoRefreshOptions {
  refreshInterval?: number; // in milliseconds
  refreshOnVisibility?: boolean;
  refreshOnFocus?: boolean;
}

export function useAutoRefresh<T>(
  fetchFunction: () => Promise<T>,
  initialData: T,
  options: UseAutoRefreshOptions = {}
) {
  const {
    refreshInterval = 30000, // 30 seconds default
    refreshOnVisibility = true,
    refreshOnFocus = true
  } = options;

  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const refreshData = useCallback(async () => {
    // Avoid rapid successive refreshes
    if (Date.now() - lastRefresh < 5000) return;
    
    setIsRefreshing(true);
    try {
      const freshData = await fetchFunction();
      setData(freshData);
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFunction, lastRefresh]);

  // Auto-refresh interval
  useEffect(() => {
    if (!refreshInterval) return;
    
    const interval = setInterval(refreshData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshData, refreshInterval]);

  // Refresh when page becomes visible
  useEffect(() => {
    if (!refreshOnVisibility) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshData, refreshOnVisibility]);

  // Refresh when window regains focus
  useEffect(() => {
    if (!refreshOnFocus) return;

    const handleFocus = () => {
      refreshData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshData, refreshOnFocus]);

  return {
    data,
    isRefreshing,
    refreshData,
    lastRefresh: new Date(lastRefresh)
  };
}
