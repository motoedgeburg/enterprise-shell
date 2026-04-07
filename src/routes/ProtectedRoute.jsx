import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '../store';

const IS_MOCK_MODE = import.meta.env.VITE_ENABLE_MOCKS === 'true';

/**
 * Wraps routes that require authentication.
 *
 * In mock mode (VITE_ENABLE_MOCKS=true) the gate is bypassed entirely so
 * the full UI is accessible without real Okta credentials.  The mock component
 * is a plain functional component with no hooks — this avoids React duplicate-
 * instance errors when tests use jest.resetModules() to re-require the module
 * with IS_MOCK_MODE=true.
 *
 * In production mode, unauthenticated users are redirected to /login and the
 * original destination is preserved in location state for post-auth redirect.
 * While auth state is still initialising, nothing is rendered to prevent a
 * flash-redirect before the callback has had a chance to run.
 */

// Mock mode: no auth checks, no hooks
const MockProtectedRoute = () => <Outlet />;

// Real mode: auth-gated
const RealProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const ProtectedRoute = IS_MOCK_MODE ? MockProtectedRoute : RealProtectedRoute;

export default ProtectedRoute;
