import { useCallback, useState } from 'react';

/**
 * State for a pull-to-refresh `RefreshControl`: `refreshing` stays true
 * until every promise `reload` returns has settled. Failures land in the
 * slices' own error state, so they never leave the spinner stuck.
 */
export const usePullToRefresh = (reload: () => Array<Promise<unknown>>) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    try {
      await Promise.allSettled(reload());
    } finally {
      setRefreshing(false);
    }
  }, [reload]);

  return { refreshing, handleRefresh };
};
