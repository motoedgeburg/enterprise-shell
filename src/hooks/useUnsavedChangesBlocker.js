import { useEffect } from 'react';

/**
 * Warns the user before closing/refreshing the browser tab when `dirty` is true.
 *
 * For in-app navigation blocking, React Router's useBlocker requires a data router
 * (createBrowserRouter). Since this app uses <BrowserRouter>, in-app navigation
 * guards are handled at the component level (e.g. confirmThenNavigate pattern).
 *
 * This hook covers the browser-level case: tab close, refresh, and external navigation.
 */
const useUnsavedChangesBlocker = (dirty) => {
  useEffect(() => {
    if (!dirty) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);
};

export default useUnsavedChangesBlocker;
