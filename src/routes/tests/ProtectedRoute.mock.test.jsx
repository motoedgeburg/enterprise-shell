/**
 * ProtectedRoute — mock mode tests (IS_MOCK_MODE = true).
 *
 * This file uses ONLY require() (no ESM import) so that
 * process.env.REACT_APP_ENABLE_MOCKS is set BEFORE any module is evaluated.
 * Babel-jest hoists `import` above all code, so env manipulation in a file
 * that uses imports cannot reliably affect IS_MOCK_MODE at module-load time.
 *
 * Each Jest test file gets its own isolated module registry, so setting the
 * env var here does not bleed into other test files.
 */

// Set before any require so IS_MOCK_MODE === true when modules load
process.env.REACT_APP_ENABLE_MOCKS = 'true';

const { render, screen } = require('@testing-library/react');
const { IntlProvider } = require('react-intl');
const { Provider } = require('react-redux');
const { MemoryRouter, Route, Routes } = require('react-router-dom');

// buildStore and appMessages don't depend on the env var
const { buildStore, appMessages } = require('../../renderUtils.jsx');
const ProtectedRouteMock = require('../ProtectedRoute.jsx').default;

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
