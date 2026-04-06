import authReducer, {
  setCredentials,
  clearCredentials,
  setInitializing,
  setAuthError,
} from '../store/slices/authSlice';

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,
};

describe('authSlice', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setCredentials stores token and user, sets isAuthenticated=true', () => {
    const payload = {
      accessToken: 'tok_abc123',
      user: { sub: 'u1', email: 'a@b.com', name: 'Alice', groups: ['admin'] },
    };
    const state = authReducer(initialState, setCredentials(payload));
    expect(state.accessToken).toBe('tok_abc123');
    expect(state.user).toEqual(payload.user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isInitializing).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clearCredentials resets to unauthenticated state', () => {
    const authedState = {
      accessToken: 'tok',
      user: { sub: 'u1', email: 'a@b.com', name: 'Alice' },
      isAuthenticated: true,
      isInitializing: false,
      error: null,
    };
    const state = authReducer(authedState, clearCredentials());
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setInitializing updates the flag', () => {
    const state = authReducer(initialState, setInitializing(false));
    expect(state.isInitializing).toBe(false);
  });

  it('setAuthError records error and clears authenticated state', () => {
    const authedState = {
      ...initialState,
      isAuthenticated: true,
    };
    const state = authReducer(authedState, setAuthError('Token expired'));
    expect(state.error).toBe('Token expired');
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitializing).toBe(false);
  });
});
