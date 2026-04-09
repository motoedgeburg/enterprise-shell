/**
 * AuthInitializer tests.
 *
 * AuthInitializer subscribes to oktaAuth.authStateManager and calls
 * oktaAuth.start() on mount. It dispatches:
 *   - setCredentials  when authState.isAuthenticated === true
 *   - clearCredentials when authState.isAuthenticated === false
 *
 * On unmount it calls oktaAuth.stop() and unsubscribes the listener.
 *
 * OktaAuth is mocked via vi.hoisted so the singleton (oktaAuth) returned
 * by useAuth.js uses the same mock instance as the tests.
 */
import { render } from '@testing-library/react';
import { act } from 'react';
import { Provider } from 'react-redux';

import { buildStore, MOCK_USER } from '../../../renderUtils.jsx';
import AuthInitializer from '../AuthInitializer.jsx';

// ─── Okta mock ────────────────────────────────────────────────────────────────

const oktaMock = vi.hoisted(() => {
  let _subscriber = null;
  return {
    authStateManager: {
      subscribe: vi.fn((cb) => {
        _subscriber = cb;
        // return the unsubscribe fn that AuthInitializer passes back to unsubscribe()
        return cb;
      }),
      unsubscribe: vi.fn(),
      // helper used in tests to fire a state change
      emit: (authState) => _subscriber?.(authState),
    },
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn(),
  };
});

vi.mock('@okta/okta-auth-js', () => ({
  OktaAuth: class {
    constructor() {
      return oktaMock;
    }
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderInitializer(store) {
  return render(
    <Provider store={store}>
      <AuthInitializer>
        <div data-testid="child">child</div>
      </AuthInitializer>
    </Provider>,
  );
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

describe('AuthInitializer — lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls oktaAuth.start() on mount', () => {
    const store = buildStore();
    renderInitializer(store);
    expect(oktaMock.start).toHaveBeenCalledTimes(1);
  });

  it('subscribes to authStateManager on mount', () => {
    const store = buildStore();
    renderInitializer(store);
    expect(oktaMock.authStateManager.subscribe).toHaveBeenCalledTimes(1);
  });

  it('renders children', () => {
    const store = buildStore();
    const { getByTestId } = renderInitializer(store);
    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('calls oktaAuth.stop() and unsubscribes on unmount', () => {
    const store = buildStore();
    const { unmount } = renderInitializer(store);
    unmount();
    expect(oktaMock.stop).toHaveBeenCalledTimes(1);
    expect(oktaMock.authStateManager.unsubscribe).toHaveBeenCalledTimes(1);
  });
});

// ─── Authenticated state ──────────────────────────────────────────────────────

describe('AuthInitializer — authenticated authState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches setCredentials with accessToken and user claims', () => {
    const store = buildStore();
    renderInitializer(store);

    act(() => {
      oktaMock.authStateManager.emit({
        isAuthenticated: true,
        accessToken: { accessToken: 'real-token', claims: {} },
        idToken: {
          claims: {
            sub: 'user-001',
            email: 'user@example.com',
            name: 'Real User',
            groups: ['staff'],
          },
        },
      });
    });

    const auth = store.getState().auth;
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.accessToken).toBe('real-token');
    expect(auth.user.email).toBe('user@example.com');
    expect(auth.user.name).toBe('Real User');
    expect(auth.user.sub).toBe('user-001');
    expect(auth.user.groups).toEqual(['staff']);
    expect(auth.isInitializing).toBe(false);
  });

  it('falls back to accessToken claims when idToken is absent', () => {
    const store = buildStore();
    renderInitializer(store);

    act(() => {
      oktaMock.authStateManager.emit({
        isAuthenticated: true,
        accessToken: {
          accessToken: 'tok',
          claims: { sub: 'at-sub', email: 'at@example.com', name: 'AT User', groups: [] },
        },
        idToken: undefined,
      });
    });

    expect(store.getState().auth.user.sub).toBe('at-sub');
  });

  it('sets groups to [] when claims have no groups', () => {
    const store = buildStore();
    renderInitializer(store);

    act(() => {
      oktaMock.authStateManager.emit({
        isAuthenticated: true,
        accessToken: { accessToken: 'tok', claims: {} },
        idToken: { claims: { sub: 'u', email: 'e@x.com', name: 'N' } },
      });
    });

    expect(store.getState().auth.user.groups).toEqual([]);
  });

  it('preserves existing auth state when a second authenticated event fires', () => {
    const store = buildStore();
    renderInitializer(store);

    act(() => {
      oktaMock.authStateManager.emit({
        isAuthenticated: true,
        accessToken: { accessToken: 'tok-1', claims: {} },
        idToken: { claims: { sub: 'u1', email: 'a@x.com', name: 'A' } },
      });
    });

    act(() => {
      oktaMock.authStateManager.emit({
        isAuthenticated: true,
        accessToken: { accessToken: 'tok-2', claims: {} },
        idToken: { claims: { sub: 'u2', email: 'b@x.com', name: 'B' } },
      });
    });

    expect(store.getState().auth.user.email).toBe('b@x.com');
  });
});

// ─── Unauthenticated state ────────────────────────────────────────────────────

describe('AuthInitializer — unauthenticated authState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches clearCredentials when isAuthenticated is false', () => {
    const store = buildStore({
      isAuthenticated: true,
      accessToken: 'old-token',
      user: MOCK_USER,
    });
    renderInitializer(store);

    act(() => {
      oktaMock.authStateManager.emit({ isAuthenticated: false });
    });

    const auth = store.getState().auth;
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.accessToken).toBeNull();
    expect(auth.user).toBeNull();
    expect(auth.isInitializing).toBe(false);
  });

  it('resolves isInitializing to false on unauthenticated state', () => {
    const store = buildStore({ isInitializing: true });
    renderInitializer(store);

    act(() => {
      oktaMock.authStateManager.emit({ isAuthenticated: false });
    });

    expect(store.getState().auth.isInitializing).toBe(false);
  });
});
