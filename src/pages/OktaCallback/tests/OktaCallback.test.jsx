/**
 * OktaCallback page tests.
 *
 * Three rendering branches:
 *   isAuthenticated = true → calls navigate('/dashboard') immediately, renders null
 *   authError set         → shows Authentication Failed alert with return link
 *   default (processing)  → shows Spin + "Completing sign-in…" title
 *
 * OktaAuth is mocked at the top level (hoisted by Babel).  The instance
 * created during module load is captured in beforeAll before any
 * clearAllMocks calls can wipe mock.instances.
 */
import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { buildStore, appMessages } from '../../../renderUtils.jsx';
import OktaCallback from '../OktaCallback.jsx';

const oktaMock = vi.hoisted(() => ({
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
  token: { parseFromUrl: vi.fn().mockReturnValue(new Promise(() => {})) },
  tokenManager: { setTokens: vi.fn() },
}));

vi.mock('@okta/okta-auth-js', () => ({
  OktaAuth: class { constructor() { return oktaMock; } },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderCallback(authOverrides = {}, initialEntries = ['/login/callback']) {
  const store = buildStore(authOverrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path="/login/callback" element={<OktaCallback />} />
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    ),
  };
}

// ─── Loading state ────────────────────────────────────────────────────────────

describe('OktaCallback — loading state', () => {
  it('renders the completing sign-in title while processing', () => {
    renderCallback({ isAuthenticated: false, isInitializing: false });
    expect(screen.getByText('Completing sign-in\u2026')).toBeInTheDocument();
  });

  it('does not show an error alert during loading', () => {
    renderCallback({ isAuthenticated: false, isInitializing: false });
    expect(screen.queryByText('Authentication Failed')).not.toBeInTheDocument();
  });
});

// ─── Error state ──────────────────────────────────────────────────────────────

describe('OktaCallback — error state', () => {
  it('renders the Authentication Failed alert when authError is set', () => {
    renderCallback({
      isAuthenticated: false,
      isInitializing: false,
      error: 'Token exchange failed',
    });
    expect(screen.getByText('Authentication Failed')).toBeInTheDocument();
  });

  it('shows the error message as the alert description', () => {
    renderCallback({
      isAuthenticated: false,
      isInitializing: false,
      error: 'Token exchange failed',
    });
    expect(screen.getByText('Token exchange failed')).toBeInTheDocument();
  });

  it('renders a "Return to Login" link when there is an error', () => {
    renderCallback({
      isAuthenticated: false,
      isInitializing: false,
      error: 'Token exchange failed',
    });
    expect(screen.getByRole('link', { name: 'Return to Login' })).toBeInTheDocument();
  });

  it('does not render the loading title when there is an error', () => {
    renderCallback({
      isAuthenticated: false,
      isInitializing: false,
      error: 'Something went wrong',
    });
    expect(screen.queryByText('Completing sign-in\u2026')).not.toBeInTheDocument();
  });
});

// ─── Successful token exchange ────────────────────────────────────────────────

describe('OktaCallback — successful token exchange', () => {
  beforeEach(() => {
    oktaMock?.token.parseFromUrl.mockClear();
    oktaMock?.tokenManager.setTokens.mockClear();
  });

  it('dispatches setCredentials and navigates to /dashboard on success', async () => {
    const mockTokenObj = { accessToken: 'new-tok', claims: {} };
    const mockIdToken = {
      claims: { sub: 'u-1', email: 'u@example.com', name: 'Example User', groups: [] },
    };
    oktaMock.token.parseFromUrl.mockResolvedValue({
      tokens: { accessToken: mockTokenObj, idToken: mockIdToken },
    });

    const { store } = renderCallback({ isAuthenticated: false, isInitializing: false });

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    expect(store.getState().auth.user.email).toBe('u@example.com');
    expect(oktaMock.tokenManager.setTokens).toHaveBeenCalledTimes(1);
  });

  it('navigates to /dashboard after successful callback', async () => {
    const mockTokenObj = { accessToken: 'tok', claims: {} };
    const mockIdToken = {
      claims: { sub: 'u', email: 'u@x.com', name: 'U', groups: [] },
    };
    oktaMock.token.parseFromUrl.mockResolvedValue({
      tokens: { accessToken: mockTokenObj, idToken: mockIdToken },
    });

    renderCallback({ isAuthenticated: false, isInitializing: false });

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
  });
});

// ─── Snapshot ─────────────────────────────────────────────────────────────────

describe('OktaCallback — snapshots', () => {
  it('matches snapshot in error state', () => {
    const { asFragment } = renderCallback({
      isAuthenticated: false,
      isInitializing: false,
      error: 'Auth error',
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot in loading state', () => {
    const { asFragment } = renderCallback({
      isAuthenticated: false,
      isInitializing: false,
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
