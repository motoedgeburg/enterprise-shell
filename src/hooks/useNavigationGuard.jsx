import { Modal } from 'antd';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Navigation guard context.
 *
 * Allows a child page (e.g. RecordDetail) to register an unsaved-changes guard
 * that parent components (e.g. AppLayout sidebar) can check before navigating.
 */
const NavigationGuardContext = createContext({
  /** Call from parent: navigates immediately or shows confirmation if guarded. */
  guardedNavigate: null,
  /** Call from child: register/update the guard. Returns an unregister function. */
  setGuard: null,
});

export const NavigationGuardProvider = ({ children, navigate }) => {
  const guardRef = useRef(null);

  const setGuard = useCallback((guard) => {
    guardRef.current = guard;
    return () => {
      guardRef.current = null;
    };
  }, []);

  const guardedNavigate = useCallback(
    (path) => {
      const guard = guardRef.current;
      if (guard && guard.dirty) {
        Modal.confirm({
          title: guard.title,
          content: guard.content,
          okText: guard.okText,
          cancelText: guard.cancelText,
          onOk: () => navigate(path),
        });
      } else {
        navigate(path);
      }
    },
    [navigate],
  );

  return (
    <NavigationGuardContext.Provider value={{ guardedNavigate, setGuard }}>
      {children}
    </NavigationGuardContext.Provider>
  );
};

/**
 * Hook for parent components (e.g. AppLayout) to get a navigate function
 * that respects any active guard.
 */
export const useGuardedNavigate = () => {
  const { guardedNavigate } = useContext(NavigationGuardContext);
  const navigate = useNavigate();
  return guardedNavigate ?? navigate;
};

/**
 * Hook for child pages to register an unsaved-changes guard.
 * The guard is automatically removed when the component unmounts.
 */
export const useSetNavigationGuard = (dirty, messages) => {
  const { setGuard } = useContext(NavigationGuardContext);

  useEffect(() => {
    if (!setGuard) return;
    const unregister = setGuard({
      dirty,
      ...messages,
    });
    return unregister;
  }, [dirty, messages, setGuard]);
};
