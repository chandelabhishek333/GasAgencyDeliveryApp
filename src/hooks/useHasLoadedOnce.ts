import { useEffect, useState } from 'react';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

const isSettled = (status: RequestStatus): boolean => status === 'succeeded' || status === 'failed';

/**
 * True once a slice's request has settled at least once. Screens show
 * their full-screen loader only before that, so background re-fetches
 * (tab focus, pull-to-refresh) never blank out what's already shown —
 * even when the last result was an empty list.
 */
export const useHasLoadedOnce = (status: RequestStatus): boolean => {
  const [hasLoaded, setHasLoaded] = useState(isSettled(status));

  useEffect(() => {
    if (isSettled(status)) {
      setHasLoaded(true);
    }
  }, [status]);

  return hasLoaded;
};
