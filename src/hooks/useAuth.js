import { OktaAuth } from '@okta/okta-auth-js';
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../store';
import { clearCredentials, setCredentials } from '../store/slices/authSlice';

const IS_MOCK_MODE = process.env.REACT_APP_ENABLE_MOCKS === 'true';

// ─── Mock auth (no Okta needed) ──────────────────────────────────────────────
// When REACT_APP_ENABLE_MOCKS=true, skip real Okta initialisation entirely.
// OktaAuth throws on construction if the issuer URL is empty/invalid, which
// crashes the app before any component renders.

const MOCK_USER = {
  sub: 'mock-user-001',
  email: 'demo.user@company.com',
  name: 'Demo User',
  groups: ['Everyone', 'Developers'],
};

const MOCK_TOKEN = 'mock-access-token-for-dev';

// ─── Okta client (singleton, real mode only) ─────────────────────────────────
export const oktaAuth = IS_MOCK_MODE
  ? null
  : new OktaAuth({
      issuer: process.env.REACT_APP_OKTA_ISSUER ?? '',
      clientId: process.env.REACT_APP_OKTA_CLIENT_ID ?? '',
      redirectUri:
        process.env.REACT_APP_OKTA_REDIRECT_URI ??
        window.location.origin + '/login/callback',
      scopes: ['openid', 'profile', 'email'],
      pkce: true,
      tokenManager: {
        // Store tokens in memory only — no localStorage for security
        storage: 'memory',
      },
    });

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitializing, user, accessToken, error } =
    useAppSelector((state) => state.auth);

  // ── Mock implementations ───────────────────────────────────────────────────

  const mockLogin = useCallback(() => {
    dispatch(setCredentials({ accessToken: MOCK_TOKEN, user: MOCK_USER }));
  }, [dispatch]);

  const mockLogout = useCallback(async () => {
    dispatch(clearCredentials());
  }, [dispatch]);

  const mockHandleCallback = useCallback(async () => {
    dispatch(setCredentials({ accessToken: MOCK_TOKEN, user: MOCK_USER }));
  }, [dispatch]);

  // ── Real Okta implementations ──────────────────────────────────────────────

  /** Redirect to Okta's /authorize endpoint (PKCE flow) */
  const realLogin = useCallback(() => {
    void oktaAuth.signInWithRedirect();
  }, []);

  /** Sign out from Okta and clear local Redux state */
  const realLogout = useCallback(async () => {
    dispatch(clearCredentials());
    await oktaAuth.signOut({
      postLogoutRedirectUri:
        process.env.REACT_APP_OKTA_POST_LOGOUT_URI ?? window.location.origin,
    });
  }, [dispatch]);

  /**
   * Called by OktaCallback after Okta redirects back.
   * Exchanges the authorization code for tokens and stores them in Redux.
   */
  const realHandleCallback = useCallback(async () => {
    const tokenResponse = await oktaAuth.token.parseFromUrl();
    const { accessToken: tokenObj, idToken } = tokenResponse.tokens;

    if (!tokenObj) {
      throw new Error('No access token in Okta callback response.');
    }

    oktaAuth.tokenManager.setTokens(tokenResponse.tokens);

    const claims = idToken?.claims ?? tokenObj.claims;

    const userPayload = {
      sub: String(claims['sub'] ?? ''),
      email: String(claims['email'] ?? ''),
      name: String(claims['name'] ?? claims['email'] ?? ''),
      groups: Array.isArray(claims['groups']) ? claims['groups'] : [],
    };

    dispatch(setCredentials({ accessToken: tokenObj.accessToken, user: userPayload }));
  }, [dispatch]);

  return {
    isAuthenticated,
    isInitializing,
    user,
    accessToken,
    error,
    login: IS_MOCK_MODE ? mockLogin : realLogin,
    logout: IS_MOCK_MODE ? mockLogout : realLogout,
    handleCallback: IS_MOCK_MODE ? mockHandleCallback : realHandleCallback,
  };
};
