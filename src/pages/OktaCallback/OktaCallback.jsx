import { Spin, Typography, Alert } from 'antd';
import { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth.js';
import { useAppSelector } from '../../store';
import messages from '../messages.js';

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
  const { handleCallback, error: authError } = useAuth();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const intl = useIntl();

  // Guard against double-invocation in React StrictMode
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    // Retrieve the originally requested path (set by ProtectedRoute)
    const from = location.state?.from?.pathname ?? '/dashboard';

    handleCallback()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error('[OktaCallback] Token exchange failed:', err);
        // authError will be set by the hook via Redux; we stay on this page to show it
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If already authenticated (e.g. back-button), skip straight to dashboard
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  if (authError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <Alert
          type="error"
          showIcon
          message={intl.formatMessage(messages.CALLBACK_AUTH_FAILED_TITLE)}
          description={authError}
          action={<a href="/login">{intl.formatMessage(messages.CALLBACK_RETURN_TO_LOGIN)}</a>}
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
