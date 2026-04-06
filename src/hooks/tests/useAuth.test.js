/**
 * useAuth hook tests.
 *
 * The hook has two code paths gated on IS_MOCK_MODE
 * (process.env.REACT_APP_ENABLE_MOCKS === 'true').
 *
 * Real-mode path (IS_MOCK_MODE = false, default in tests):
 *   Delegates login/logout/handleCallback to the OktaAuth singleton.
 *   OktaAuth is mocked to prevent construction failure with empty credentials.
 *
 * Mock-mode path (IS_MOCK_MODE = true):
 *   Bypasses OktaAuth entirely; all operations dispatch straight to Redux.
 *   Tested by re-requiring the module after setting the env var.
 *
 * ── Instance capture ──────────────────────────────────────────────────────────
 * The mock factory must close over a stable reference so every call to
 * `new OktaAuth()` returns the SAME mock methods object.  Babel-jest's
 * jest.mock hoisting allows references to variables whose names start with
 * "mock" (case-insensitive), so `mockOktaMethods` is declared here and used
 * directly in both the factory and the tests.
 */
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

import { buildStore, MOCK_USER } from '../../tests/renderUtils.jsx';

// The factory runs before any const/let declarations in this file (Babel hoists
// jest.mock above everything).  Write the mock methods to `global` so the
// factory can store them without triggering a temporal-dead-zone error.
jest.mock('@okta/okta-auth-js', () => {
  global.__oktaMock = {
    signInWithRedirect: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    token: { parseFromUrl: jest.fn() },
    tokenManager: { setTokens: jest.fn() },
  };
  return { OktaAuth: jest.fn().mockImplementation(() => global.__oktaMock) };
});

import { useAuth } from '../useAuth.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createWrapper(store) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return Wrapper;
}

// ─── State reflection ─────────────────────────────────────────────────────────

describe('useAuth — state from Redux store', () => {
  it('returns isAuthenticated from the Redux store', () => {
    const store = buildStore({ isAuthenticated: true, accessToken: 'tok', user: MOCK_USER });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns isInitializing from the Redux store', () => {
    const store = buildStore({ isInitializing: true });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });
    expect(result.current.isInitializing).toBe(true);
  });

  it('returns the user from the Redux store', () => {
    const store = buildStore({ user: MOCK_USER });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });
    expect(result.current.user).toEqual(MOCK_USER);
  });

  it('returns accessToken from the Redux store', () => {
    const store = buildStore({ accessToken: 'abc123' });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });
    expect(result.current.accessToken).toBe('abc123');
  });

  it('returns null user when store has no user', () => {
    const store = buildStore({ user: null });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });
    expect(result.current.user).toBeNull();
  });

  it('returns error from the Redux store', () => {
    const store = buildStore({ error: 'Something went wrong' });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });
    expect(result.current.error).toBe('Something went wrong');
  });
});

// ─── Real-mode implementations (IS_MOCK_MODE = false) ────────────────────────

describe('useAuth — real mode (IS_MOCK_MODE=false)', () => {
  // In tests, REACT_APP_ENABLE_MOCKS is not set so IS_MOCK_MODE=false.
  // OktaAuth is mocked at the top of this file to avoid constructor failure.
  // mockOktaMethods is the same object returned by every new OktaAuth() call.

  beforeEach(() => {
    global.__oktaMock?.signInWithRedirect.mockClear();
    global.__oktaMock?.signOut.mockClear();
    global.__oktaMock?.token.parseFromUrl.mockClear();
    global.__oktaMock?.tokenManager.setTokens.mockClear();
  });

  it('login calls oktaAuth.signInWithRedirect', () => {
    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });
    act(() => {
      result.current.login();
    });
    expect(global.__oktaMock.signInWithRedirect).toHaveBeenCalledTimes(1);
  });

  it('logout dispatches clearCredentials and calls oktaAuth.signOut', async () => {
    const store = buildStore({ isAuthenticated: true, accessToken: 'tok', user: MOCK_USER });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.logout();
    });

    expect(global.__oktaMock.signOut).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.accessToken).toBeNull();
  });

  it('handleCallback dispatches setCredentials on success', async () => {
    const mockTokenObj = { accessToken: 'new-token', claims: {} };
    const mockIdToken = {
      claims: {
        sub: 'user-123',
        email: 'user@example.com',
        name: 'Example User',
        groups: ['staff'],
      },
    };
    global.__oktaMock.token.parseFromUrl.mockResolvedValue({
      tokens: { accessToken: mockTokenObj, idToken: mockIdToken },
    });

    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.handleCallback();
    });

    const auth = store.getState().auth;
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user.email).toBe('user@example.com');
    expect(auth.user.sub).toBe('user-123');
    expect(global.__oktaMock.tokenManager.setTokens).toHaveBeenCalledTimes(1);
  });

  it('handleCallback throws when no accessToken is returned', async () => {
    global.__oktaMock.token.parseFromUrl.mockResolvedValue({
      tokens: { accessToken: null, idToken: null },
    });

    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await expect(
      act(async () => {
        await result.current.handleCallback();
      }),
    ).rejects.toThrow('No access token in Okta callback response.');
  });

  it('handleCallback uses idToken claims when available', async () => {
    const mockTokenObj = { accessToken: 'tok', claims: { sub: 'fallback' } };
    const mockIdToken = { claims: { sub: 'from-id-token', email: 'id@example.com', name: 'ID User' } };
    global.__oktaMock.token.parseFromUrl.mockResolvedValue({
      tokens: { accessToken: mockTokenObj, idToken: mockIdToken },
    });

    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.handleCallback();
    });

    expect(store.getState().auth.user.sub).toBe('from-id-token');
  });

  it('handleCallback falls back to accessToken claims when no idToken', async () => {
    const mockTokenObj = {
      accessToken: 'tok',
      claims: { sub: 'from-access-token', email: 'at@example.com', name: 'AT User' },
    };
    global.__oktaMock.token.parseFromUrl.mockResolvedValue({
      tokens: { accessToken: mockTokenObj, idToken: undefined },
    });

    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.handleCallback();
    });

    expect(store.getState().auth.user.sub).toBe('from-access-token');
  });

  it('handleCallback sets groups to [] when claims have no groups', async () => {
    const mockTokenObj = { accessToken: 'tok', claims: {} };
    const mockIdToken = { claims: { sub: 'u', email: 'e@x.com', name: 'N' } };
    global.__oktaMock.token.parseFromUrl.mockResolvedValue({
      tokens: { accessToken: mockTokenObj, idToken: mockIdToken },
    });

    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.handleCallback();
    });

    expect(store.getState().auth.user.groups).toEqual([]);
  });
});

// ─── Mock-mode implementations (IS_MOCK_MODE = true) ─────────────────────────

// Note: IS_MOCK_MODE=true tests live in useAuth.mock.test.js
