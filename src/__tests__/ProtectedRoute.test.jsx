import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../routes/ProtectedRoute.jsx';
import authReducer from '../store/slices/authSlice';

function buildStore(authOverrides = {}) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isInitializing: false,
        error: null,
        ...authOverrides,
      },
    },
  });
}

function renderWithRouter(store, initialPath = '/protected') {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    renderWithRouter(buildStore({ isAuthenticated: false }));
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders child route when authenticated', () => {
    const store = buildStore({
      isAuthenticated: true,
      accessToken: 'tok',
      user: { sub: 'u1', email: 'a@b.com', name: 'Alice' },
    });
    renderWithRouter(store);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('renders nothing while initializing', () => {
    renderWithRouter(buildStore({ isAuthenticated: false, isInitializing: true }));
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
