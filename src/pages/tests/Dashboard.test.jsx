/**
 * Dashboard page tests.
 *
 * Dashboard renders:
 *   - A welcome banner with the user's name / groups
 *   - Four KPI statistic cards (Total Records, Active, Pending, Inactive)
 *   - A session information card with sub / email / groups
 *
 * useAuth is driven by the Redux store; we pre-seed auth state via buildStore.
 * OktaAuth is mocked to prevent construction failure with empty credentials.
 */
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { buildStore, appMessages, MOCK_USER, AUTHED_STATE } from '../../tests/renderUtils.jsx';
import Dashboard from '../Dashboard.jsx';

// OktaAuth must be mocked before useAuth is imported (hoisted by Babel).
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
        <Dashboard />
      </IntlProvider>
    </Provider>,
  );
}

// ─── Welcome banner ───────────────────────────────────────────────────────────

describe('Dashboard — welcome banner', () => {
  it('shows the user name in the welcome title', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText(/Welcome back, Test User/i)).toBeInTheDocument();
  });

  it('falls back to "User" when no name is set', () => {
    renderDashboard({ isAuthenticated: true, user: { ...MOCK_USER, name: undefined } });
    expect(screen.getByText(/Welcome back, User/i)).toBeInTheDocument();
  });

  it('renders the user email below the title', () => {
    renderDashboard(AUTHED_STATE);
    // Email appears in both the banner and the session card — just check at least one instance
    expect(screen.getAllByText('test.user@company.com').length).toBeGreaterThanOrEqual(1);
  });

  it('renders each group as a tag', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Everyone')).toBeInTheDocument();
    expect(screen.getByText('Testers')).toBeInTheDocument();
  });

  it('renders no group tags when the user has no groups', () => {
    renderDashboard({ isAuthenticated: true, user: { ...MOCK_USER, groups: [] } });
    expect(screen.queryByText('Everyone')).not.toBeInTheDocument();
  });
});

// ─── KPI cards ────────────────────────────────────────────────────────────────

describe('Dashboard — KPI statistic cards', () => {
  it('renders the "Total Records" card label', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Total Records')).toBeInTheDocument();
  });

  it('renders the "Active" card label', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders the "Pending" card label', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders the "Inactive" card label', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('displays the 1,284 total records value', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('1,284')).toBeInTheDocument();
  });
});

// ─── Session information card ─────────────────────────────────────────────────

describe('Dashboard — session information card', () => {
  it('renders the card title', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Session Information')).toBeInTheDocument();
  });

  it('renders the subject label and value', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Subject (sub):')).toBeInTheDocument();
    expect(screen.getByText('test-sub-001')).toBeInTheDocument();
  });

  it('renders the email label', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Email:')).toBeInTheDocument();
  });

  it('renders groups joined by comma', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByText('Everyone, Testers')).toBeInTheDocument();
  });

  it('shows "No groups assigned" when user has no groups', () => {
    renderDashboard({ isAuthenticated: true, user: { ...MOCK_USER, groups: [] } });
    expect(screen.getByText('No groups assigned')).toBeInTheDocument();
  });

  it('shows em-dash fallback for sub when user is null', () => {
    renderDashboard({ isAuthenticated: false, user: null });
    // The em-dash character (U+2014) appears as fallback
    const fallbacks = screen.getAllByText('—');
    expect(fallbacks.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe('Dashboard — snapshots', () => {
  it('matches snapshot when authenticated with full user data', () => {
    const { asFragment } = renderDashboard(AUTHED_STATE);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when user is null (unauthenticated)', () => {
    const { asFragment } = renderDashboard({ isAuthenticated: false, user: null });
    expect(asFragment()).toMatchSnapshot();
  });
});
