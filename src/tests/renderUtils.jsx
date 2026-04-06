/**
 * Shared test utilities.
 *
 * renderWithProviders — wraps UI with every context the app needs:
 *   Redux store  ·  IntlProvider  ·  Ant Design App  ·  MemoryRouter
 *
 * buildStore — creates a fresh, pre-seeded Redux store for a single test.
 */
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { App } from 'antd';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import componentMessages from '../components/messages.js';
import pageMessages from '../pages/messages.js';
import recordsMessages from '../pages/Records/messages.js';
import authReducer from '../store/slices/authSlice';

// ─── Message map ─────────────────────────────────────────────────────────────

const buildMessageMap = (...descriptorObjects) => {
  const map = {};
  for (const descriptors of descriptorObjects) {
    for (const descriptor of Object.values(descriptors)) {
      map[descriptor.id] = descriptor.defaultMessage;
    }
  }
  return map;
};

export const appMessages = buildMessageMap(componentMessages, pageMessages, recordsMessages);

// ─── Store ────────────────────────────────────────────────────────────────────

export const DEFAULT_AUTH_STATE = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: false,
  error: null,
};

export function buildStore(authOverrides = {}) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { ...DEFAULT_AUTH_STATE, ...authOverrides } },
  });
}

// ─── Shared test fixtures ─────────────────────────────────────────────────────

export const MOCK_USER = {
  sub: 'test-sub-001',
  email: 'test.user@company.com',
  name: 'Test User',
  groups: ['Everyone', 'Testers'],
};

export const MOCK_TOKEN = 'test-access-token-xyz';

export const AUTHED_STATE = {
  accessToken: MOCK_TOKEN,
  user: MOCK_USER,
  isAuthenticated: true,
  isInitializing: false,
  error: null,
};

// ─── renderWithProviders ──────────────────────────────────────────────────────

/**
 * @param {React.ReactElement} ui
 * @param {{
 *   authState?: object,
 *   initialEntries?: string[],
 *   store?: import('@reduxjs/toolkit').EnhancedStore,
 * }} options
 */
export function renderWithProviders(
  ui,
  { authState = {}, initialEntries = ['/'], store: storeProp, ...options } = {},
) {
  const store = storeProp ?? buildStore(authState);

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <App>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
          </App>
        </IntlProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
