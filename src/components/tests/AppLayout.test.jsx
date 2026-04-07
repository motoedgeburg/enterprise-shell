/**
 * AppLayout tests.
 *
 * AppLayout renders a sidebar (Sider + Menu) and a header with:
 *   - App title in the sidebar logo area
 *   - Navigation items: Dashboard, Search
 *   - A collapse/expand toggle button
 *   - User name / email display in the header
 *   - A user dropdown with Sign Out action
 *   - An <Outlet /> placeholder rendered as the main content
 *
 * useAuth is driven by the Redux store pre-seeded via buildStore.
 * OktaAuth must be mocked to avoid construction failure.
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { buildStore, appMessages, MOCK_USER, AUTHED_STATE } from '../../renderUtils.jsx';
import AppLayout from '../AppLayout.jsx';

jest.mock('@okta/okta-auth-js', () => {
  global.__oktaMock = {
    signInWithRedirect: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined),
    token: { parseFromUrl: jest.fn() },
    tokenManager: { setTokens: jest.fn() },
  };
  return { OktaAuth: jest.fn().mockImplementation(() => global.__oktaMock) };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderLayout(authOverrides = {}, initialPath = '/dashboard') {
  const store = buildStore(authOverrides);
  return {
    store,
    ...render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<div>Dashboard Content</div>} />
                <Route path="/search" element={<div>Search Content</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    ),
  };
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

describe('AppLayout — sidebar', () => {
  it('renders the app title in the sidebar', () => {
    renderLayout(AUTHED_STATE);
    expect(screen.getByText('Enterprise App')).toBeInTheDocument();
  });

  it('renders the Dashboard navigation item', () => {
    renderLayout(AUTHED_STATE);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the Search navigation item', () => {
    renderLayout(AUTHED_STATE);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('navigates to /search when the Search menu item is clicked', async () => {
    const user = userEvent.setup();
    renderLayout(AUTHED_STATE);

    await user.click(screen.getByText('Search'));
    expect(await screen.findByText('Search Content')).toBeInTheDocument();
  });

  it('navigates to /dashboard when the Dashboard menu item is clicked', async () => {
    const user = userEvent.setup();
    renderLayout(AUTHED_STATE, '/search');

    await screen.findByText('Search Content');
    await user.click(screen.getByText('Dashboard'));
    expect(await screen.findByText('Dashboard Content')).toBeInTheDocument();
  });
});

// ─── Collapse / expand toggle ─────────────────────────────────────────────────

describe('AppLayout — sidebar toggle', () => {
  it('renders the collapse button with accessible label', () => {
    renderLayout(AUTHED_STATE);
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
  });

  it('changes aria-label to "Expand sidebar" after collapsing', async () => {
    const user = userEvent.setup();
    renderLayout(AUTHED_STATE);

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
  });

  it('shows "Collapse sidebar" label again after re-expanding', async () => {
    const user = userEvent.setup();
    renderLayout(AUTHED_STATE);

    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
  });
});

// ─── User display ─────────────────────────────────────────────────────────────

describe('AppLayout — user display', () => {
  it('renders the user name in the header', () => {
    renderLayout(AUTHED_STATE);
    expect(screen.getByText(MOCK_USER.name)).toBeInTheDocument();
  });

  it('falls back to email when user has no name', () => {
    renderLayout({
      ...AUTHED_STATE,
      user: { ...MOCK_USER, name: undefined, email: 'fallback@company.com' },
    });
    expect(screen.getByText('fallback@company.com')).toBeInTheDocument();
  });

  it('falls back to "User" when user has neither name nor email', () => {
    renderLayout({
      ...AUTHED_STATE,
      user: { ...MOCK_USER, name: undefined, email: undefined },
    });
    expect(screen.getByText('User')).toBeInTheDocument();
  });
});

// ─── Sign out ─────────────────────────────────────────────────────────────────

describe('AppLayout — sign out', () => {
  beforeEach(() => {
    global.__oktaMock?.signOut.mockClear();
  });

  it('calls signOut and clears auth state when Sign Out is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderLayout(AUTHED_STATE);

    // Open the user dropdown
    await user.click(screen.getByText(MOCK_USER.name));

    // Click Sign Out in the dropdown
    const signOutItem = await screen.findByText('Sign Out');
    await user.click(signOutItem);

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    expect(global.__oktaMock.signOut).toHaveBeenCalledTimes(1);
  });
});

// ─── Outlet rendering ─────────────────────────────────────────────────────────

describe('AppLayout — outlet', () => {
  it('renders child route content in the main content area', () => {
    renderLayout(AUTHED_STATE, '/dashboard');
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe('AppLayout — snapshots', () => {
  it('matches snapshot when authenticated', () => {
    const { asFragment } = renderLayout(AUTHED_STATE);
    expect(asFragment()).toMatchSnapshot();
  });
});
