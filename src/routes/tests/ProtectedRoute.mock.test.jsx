/**
 * ProtectedRoute — mock mode tests (IS_MOCK_MODE = true).
 *
 * vi.stubEnv + vi.resetModules + dynamic import ensures ProtectedRoute is
 * evaluated with VITE_ENABLE_MOCKS=true so IS_MOCK_MODE is true.
 */
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { buildStore, appMessages } from '../../renderUtils.jsx';

let ProtectedRouteMock;

beforeAll(async () => {
  vi.stubEnv('VITE_ENABLE_MOCKS', 'true');
  vi.resetModules();
  const mod = await import('../ProtectedRoute.jsx');
  ProtectedRouteMock = mod.default;
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('ProtectedRoute — mock mode (IS_MOCK_MODE=true)', () => {
  it('renders the outlet even when auth state is unauthenticated', () => {
    const store = buildStore({ isAuthenticated: false, isInitializing: false });

    render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route path="/login" element={<div>Login Page</div>} />
              <Route element={<ProtectedRouteMock />}>
                <Route path="/protected" element={<div>Protected Content</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('renders the outlet even when isInitializing is true', () => {
    const store = buildStore({ isAuthenticated: false, isInitializing: true });

    render(
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <MemoryRouter initialEntries={['/protected']}>
            <Routes>
              <Route element={<ProtectedRouteMock />}>
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
