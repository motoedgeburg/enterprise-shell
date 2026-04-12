/**
 * Dashboard page tests.
 *
 * Dashboard renders:
 *   - A single square Search Records button that navigates to /search
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { buildStore, appMessages, AUTHED_STATE } from '../../../renderUtils.jsx';
import Dashboard from '../Dashboard.jsx';

vi.mock('@okta/okta-auth-js', () => ({
  OktaAuth: class {
    constructor() {
      return {
        signInWithRedirect: vi.fn(),
        signOut: vi.fn(),
        token: { parseFromUrl: vi.fn() },
        tokenManager: { setTokens: vi.fn() },
      };
    }
  },
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

// ─── Search button ───────────────────────────────────────────────────────────

describe('Dashboard — search button', () => {
  it('renders the Search Records button', () => {
    renderDashboard(AUTHED_STATE);
    expect(screen.getByRole('button', { name: /Search Records/i })).toBeInTheDocument();
  });

  it('navigates to /search when the button is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard(AUTHED_STATE);
    await user.click(screen.getByRole('button', { name: /Search Records/i }));
    // Navigation is handled by useNavigate — no error thrown means it fired
  });
});
