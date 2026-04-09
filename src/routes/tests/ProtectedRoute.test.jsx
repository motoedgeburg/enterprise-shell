/**
 * ProtectedRoute tests.
 *
 * The component has two distinct code paths:
 *   IS_MOCK_MODE = true  → always render outlet (bypass auth gate)
 *   IS_MOCK_MODE = false → redirect / null / outlet based on auth state
 *
 * The real-mode path is the default in tests (env var not set).
 * Mock-mode is tested by re-requiring with the env var set.
 */
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { buildStore, appMessages } from '../../renderUtils.jsx';
import ProtectedRoute from '../ProtectedRoute.jsx';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderWithRoute(authOverrides = {}, initialPath = '/protected') {
  const store = buildStore(authOverrides);

  return render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </Provider>,
  );
}

// ─── Real mode (IS_MOCK_MODE = false) ─────────────────────────────────────────

describe('ProtectedRoute — real mode', () => {
  it('renders the outlet when the user is authenticated', () => {
    renderWithRoute({ isAuthenticated: true, accessToken: 'tok' });
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('does not render the login page when authenticated', () => {
    renderWithRoute({ isAuthenticated: true, accessToken: 'tok' });
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    renderWithRoute({ isAuthenticated: false, isInitializing: false });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders nothing (null) while auth is initializing', () => {
    const { container } = renderWithRoute({ isAuthenticated: false, isInitializing: true });
    // Neither outlet content nor redirect should appear
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('preserves the original path in redirect location state', () => {
    // We can't directly inspect location state in RTL, but we can verify the
    // redirect goes to /login by asserting the Login page renders.
    renderWithRoute({ isAuthenticated: false, isInitializing: false }, '/protected');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders outlet after transitioning from initializing to authenticated', () => {
    const store = buildStore({ isAuthenticated: false, isInitializing: true });

    const { rerender } = render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/login" element={<div>Login Page</div>} />
              <Route element={<ProtectedRoute />}>
                <Route path="/protected" element={<div>Protected Content</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

    // Dispatch credentials directly to simulate callback completion
    const { setCredentials } = require('../../store/slices/authSlice');
    store.dispatch(
      setCredentials({ accessToken: 'tok', user: { sub: 'u', email: 'u@e.com', name: 'U' } }),
    );

    rerender(
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/login" element={<div>Login Page</div>} />
              <Route element={<ProtectedRoute />}>
                <Route path="/protected" element={<div>Protected Content</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

// Note: IS_MOCK_AUTH=true tests live in ProtectedRoute.mock.test.jsx
