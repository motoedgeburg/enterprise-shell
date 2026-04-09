import { useEffect } from 'react';

import { oktaAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../store';
import { clearCredentials, setAuthError, setCredentials } from '../store/slices/authSlice';
import { createLogger } from '../utils/logger.js';

const log = createLogger('AuthInitializer');

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
    const handleAuthState = (authState) => {
      if (authState.isPending) return;

      if (authState.isAuthenticated) {
        const { accessToken, idToken } = authState;

        if (!accessToken?.accessToken) {
          dispatch(setAuthError('Okta returned an authenticated state with no access token.'));
          return;
        }

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
    };

    oktaAuth.authStateManager.subscribe(handleAuthState);
    oktaAuth.start().catch((err) => {
      log.error('oktaAuth.start() failed', err);
      dispatch(setAuthError(err?.message ?? 'Failed to initialize authentication.'));
    });

    return () => {
      oktaAuth.authStateManager.unsubscribe(handleAuthState);
      oktaAuth.stop();
    };
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
