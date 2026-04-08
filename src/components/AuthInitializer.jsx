import { useEffect } from 'react';

import { oktaAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../store';
import { clearCredentials, setCredentials } from '../store/slices/authSlice';

/**
 * Bootstraps Okta auth state on app startup (real mode only).
 *
 * Subscribes to oktaAuth's authStateManager so any auth state change
 * (initial load, token renewal, sign-out) is reflected in Redux.
 * Calls oktaAuth.start() to trigger the first evaluation.
 */
const AuthInitializer = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = oktaAuth.authStateManager.subscribe((authState) => {
      if (authState.isAuthenticated) {
        const { accessToken, idToken } = authState;
        const claims = idToken?.claims ?? accessToken?.claims ?? {};
        dispatch(
          setCredentials({
            accessToken: accessToken.accessToken,
            user: {
              sub: String(claims.sub ?? ''),
              email: String(claims.email ?? ''),
              name: String(claims.name ?? claims.email ?? ''),
              groups: Array.isArray(claims.groups) ? claims.groups : [],
            },
          }),
        );
      } else {
        dispatch(clearCredentials());
      }
    });

    oktaAuth.start();

    return () => {
      oktaAuth.authStateManager.unsubscribe(unsubscribe);
      oktaAuth.stop();
    };
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
