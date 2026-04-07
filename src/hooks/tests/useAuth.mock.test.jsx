/**
 * useAuth — mock mode tests (IS_MOCK_MODE = true).
 *
 * vi.stubEnv + vi.resetModules + dynamic import ensures the module is
 * evaluated with VITE_ENABLE_MOCKS=true, mirroring Jest's require()-after-
 * process.env pattern.
 */
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';

import { buildStore, MOCK_USER } from '../../renderUtils.jsx';

vi.mock('@okta/okta-auth-js', () => ({ OktaAuth: vi.fn() }));

let useAuth;

beforeAll(async () => {
  vi.stubEnv('VITE_ENABLE_MOCKS', 'true');
  vi.resetModules();
  const mod = await import('../useAuth.js');
  useAuth = mod.useAuth;
});

afterAll(() => {
  vi.unstubAllEnvs();
});

function createWrapper(store) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return Wrapper;
}

describe('useAuth — mock mode (IS_MOCK_MODE=true)', () => {
  it('login dispatches setCredentials with the mock user', () => {
    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    act(() => {
      result.current.login();
    });

    const auth = store.getState().auth;
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user.email).toBe('demo.user@company.com');
    expect(auth.accessToken).toBe('mock-access-token-for-dev');
  });

  it('logout dispatches clearCredentials without calling oktaAuth', async () => {
    const store = buildStore({ isAuthenticated: true, accessToken: 'tok', user: MOCK_USER });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.logout();
    });

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.accessToken).toBeNull();
  });

  it('handleCallback dispatches setCredentials with the mock user', async () => {
    const store = buildStore();
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(store) });

    await act(async () => {
      await result.current.handleCallback();
    });

    const auth = store.getState().auth;
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user.name).toBe('Demo User');
  });
});
