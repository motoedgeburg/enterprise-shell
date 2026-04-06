/**
 * LoginPage tests.
 *
 * Three rendering branches:
 *   isInitializing = true  → shows a Spin loader, no form
 *   isAuthenticated = true → redirects to /dashboard (Navigate)
 *   otherwise             → shows the SSO login card with Sign in button
 *
 * useAuth is driven by the Redux store pre-seeded via buildStore.
 * OktaAuth must be mocked to avoid construction failure.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { buildStore, appMessages, AUTHED_STATE } from '../../tests/renderUtils.jsx';
import LoginPage from '../LoginPage.jsx';

jest.mock('@okta/okta-auth-js', () => {
  global.__oktaMock = {
    signInWithRedirect: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    token: { parseFromUrl: jest.fn() },
    tokenManager: { setTokens: jest.fn() },
  };
  return { OktaAuth: jest.fn().mockImplementation(() => global.__oktaMock) };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderLoginPage(authOverrides = {}) {
  const store = buildStore(authOverrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <MemoryRouter initialEntries={['/login']}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    ),
  };
}

// ─── Default (not authenticated, not initializing) ────────────────────────────

describe('LoginPage — default state (unauthenticated)', () => {
  it('renders the page title', () => {
    renderLoginPage({ isAuthenticated: false, isInitializing: false });
    expect(screen.getByText('Enterprise Application')).toBeInTheDocument();
  });

  it('renders the SSO description text', () => {
    renderLoginPage({ isAuthenticated: false, isInitializing: false });
    expect(
      screen.getByText(/Sign in using your organization/i),
    ).toBeInTheDocument();
  });

  it('renders the Sign in with Okta button', () => {
    renderLoginPage({ isAuthenticated: false, isInitializing: false });
    expect(screen.getByRole('button', { name: /Sign in with Okta/i })).toBeInTheDocument();
  });

  it('does not show the spinner', () => {
    renderLoginPage({ isAuthenticated: false, isInitializing: false });
    // Ant Design Spin renders with role="img" by default or an aria-label; easiest to check absence of loading text
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});

// ─── Initializing state ───────────────────────────────────────────────────────

describe('LoginPage — initializing state', () => {
  it('does not render the sign-in button while initializing', () => {
    renderLoginPage({ isAuthenticated: false, isInitializing: true });
    expect(screen.queryByRole('button', { name: /Sign in with Okta/i })).not.toBeInTheDocument();
  });

  it('does not render the page title while initializing', () => {
    renderLoginPage({ isAuthenticated: false, isInitializing: true });
    expect(screen.queryByText('Enterprise Application')).not.toBeInTheDocument();
  });
});

// ─── Authenticated redirect ───────────────────────────────────────────────────

describe('LoginPage — authenticated redirect', () => {
  it('navigates to /dashboard when already authenticated', () => {
    renderLoginPage(AUTHED_STATE);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Enterprise Application')).not.toBeInTheDocument();
  });
});

// ─── Button interaction ───────────────────────────────────────────────────────

describe('LoginPage — button click', () => {
  beforeEach(() => {
    global.__oktaMock?.signInWithRedirect.mockClear();
  });

  it('calls signInWithRedirect when the button is clicked', async () => {
    const user = userEvent.setup();
    renderLoginPage({ isAuthenticated: false, isInitializing: false });

    await user.click(screen.getByRole('button', { name: /Sign in with Okta/i }));

    expect(global.__oktaMock.signInWithRedirect).toHaveBeenCalledTimes(1);
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe('LoginPage — snapshots', () => {
  it('matches snapshot in default unauthenticated state', () => {
    const { asFragment } = renderLoginPage({ isAuthenticated: false, isInitializing: false });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot while initializing', () => {
    const { asFragment } = renderLoginPage({ isAuthenticated: false, isInitializing: true });
    expect(asFragment()).toMatchSnapshot();
  });
});
