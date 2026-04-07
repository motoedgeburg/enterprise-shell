/**
 * useAuth — mock mode tests (IS_MOCK_MODE = true).
 *
 * Uses only require() so REACT_APP_ENABLE_MOCKS is set before any module loads.
 * See useAuth.test.js for real-mode tests.
 */

process.env.REACT_APP_ENABLE_MOCKS = 'true';

jest.mock('@okta/okta-auth-js', () => ({ OktaAuth: jest.fn() }));

const { act, renderHook } = require('@testing-library/react');
const { Provider } = require('react-redux');

const { buildStore, MOCK_USER } = require('../../renderUtils.jsx');
const { useAuth } = require('../useAuth.js');

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
