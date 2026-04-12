import { Spin, Typography, Alert } from 'antd';
import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useLocation } from 'react-router-dom';

import { ROUTES } from '../../constants/routes.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useAppDispatch, useAppSelector } from '../../store';
import { setAuthError } from '../../store/slices/authSlice.js';
import { createLogger } from '../../utils/logger.js';

import messages from './messages.js';

const log = createLogger('OktaCallback');

const { Title } = Typography;

/**
 * OktaCallback — /login/callback
 *
 * Auth flow:
 *  1. User clicks "Sign in with Okta" on LoginPage
 *  2. useAuth.login() redirects to Okta /authorize
 *  3. Okta authenticates and redirects here with ?code=... (PKCE) or #access_token=... (implicit)
 *  4. handleCallback() calls okta-auth-js to exchange the code for tokens
 *  5. Access token + user claims are stored in Redux via setCredentials()
 *  6. navigate() sends the user to /dashboard (or their original destination)
 */
const OktaCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { handleCallback, error: authError } = useAuth();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const intl = useIntl();

  // Guard against double-invocation in React StrictMode
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    // Retrieve the originally requested path (set by ProtectedRoute)
    const from = location.state?.from?.pathname ?? ROUTES.DASHBOARD;

    handleCallback()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        log.error('Token exchange failed', err);
        dispatch(setAuthError(err instanceof Error ? err.message : String(err)));
      });
    // Deps intentionally omitted: this runs once on mount only.
    // `handled` ref prevents double-invocation in React StrictMode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If already authenticated (e.g. back-button), redirect in an effect
  // to avoid calling navigate() during render.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (authError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <Alert
          type="error"
          showIcon
          message={intl.formatMessage(messages.CALLBACK_AUTH_FAILED_TITLE)}
          description={authError}
          action={
            <a href={ROUTES.LOGIN}>{intl.formatMessage(messages.CALLBACK_RETURN_TO_LOGIN)}</a>
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 16,
      }}
    >
      <Spin size="large" />
      <Title level={4} style={{ marginTop: 16, color: '#595959' }}>
        {intl.formatMessage(messages.CALLBACK_COMPLETING_SIGN_IN)}
      </Title>
    </div>
  );
};

export default OktaCallback;
