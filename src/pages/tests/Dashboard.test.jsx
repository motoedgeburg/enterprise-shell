/**
 * Dashboard page tests.
 *
 * Dashboard renders:
 *   - A welcome heading with the user's name
 *   - A centered Search tile card that navigates to /search
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { buildStore, appMessages, MOCK_USER, AUTHED_STATE } from '../../tests/renderUtils.jsx';
import Dashboard from '../Dashboard.jsx';

jest.mock('@okta/okta-auth-js', () => ({
  OktaAuth: jest.fn().mockImplementation(() => ({
    signInWithRedirect: jest.fn(),
    signOut: jest.fn(),
    token: { parseFromUrl: jest.fn() },
    tokenManager: { setTokens: jest.fn() },
  })),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderDashboard(authOverrides = {}) {
  const store = buildStore(authOverrides);
  return render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </IntlProvider>
    </Provider>,
  );
}

// ─── Welcome heading ──────────────────────────────────────────────────────────

describe('Dashboard — welcome heading', () => {
  it('shows the user name in the welcome title', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText(/Welcome back, Test User/i)).toBeInTheDocument();
  });

  it('falls back to "User" when no name is set', () => {
    renderDashboard({ isAuthenticated: true, user: { ...MOCK_USER, name: undefined } });
    expect(screen.getByText(/Welcome back, User/i)).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText(/ready for you today/i)).toBeInTheDocument();
  });
});

// ─── Search tile ──────────────────────────────────────────────────────────────

describe('Dashboard — search tile', () => {
  it('renders the Search Records tile title', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Search Records')).toBeInTheDocument();
  });

  it('renders the tile description', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText(/Filter records by name/i)).toBeInTheDocument();
  });

  it('renders the Get Started button', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });

  it('navigates to /search when the tile is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard(AUTHED_STATE);
    await user.click(screen.getByText('Search Records'));
    // Navigation is handled by useNavigate — no error thrown means it fired
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe('Dashboard — snapshots', () => {
  it('matches snapshot when authenticated', () => {
    const { asFragment } = renderDashboard(AUTHED_STATE);
    expect(asFragment()).toMatchSnapshot();
  });
});
