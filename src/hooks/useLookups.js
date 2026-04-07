import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../store/index.js';
import { fetchLookups } from '../store/slices/lookupsSlice.js';

/**
 * Returns the lookups slice from Redux and ensures the data has been fetched.
 *
 * The thunk is guarded by a `condition` check — it will not re-request if
 * lookups are already loading or have succeeded.  Any component can call this
 * hook safely without triggering duplicate network requests.
 */
export const useLookups = () => {
  const dispatch = useAppDispatch();
  const lookups = useAppSelector((state) => state.lookups);

  useEffect(() => {
    dispatch(fetchLookups());
  }, [dispatch]);

  return lookups;
};
