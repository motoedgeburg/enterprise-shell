import authReducer, {
  clearCredentials,
  setAuthError,
  setCredentials,
  setInitializing,
} from '../slices/authSlice';

const INITIAL_STATE = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,
};

const ALICE = { sub: 'u1', email: 'alice@example.com', name: 'Alice', groups: ['admin'] };

// ─── Initial state ────────────────────────────────────────────────────────────

describe('authSlice — initial state', () => {
  it('returns the correct initial state on first call', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(INITIAL_STATE);
  });

  it('does not mutate state for unknown actions', () => {
    const state = authReducer(INITIAL_STATE, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(INITIAL_STATE);
  });
});

// ─── setCredentials ───────────────────────────────────────────────────────────

describe('setCredentials', () => {
  it('stores the access token', () => {
    const state = authReducer(INITIAL_STATE, setCredentials({ accessToken: 'tok', user: ALICE }));
    expect(state.accessToken).toBe('tok');
  });

  it('stores the user object', () => {
    const state = authReducer(INITIAL_STATE, setCredentials({ accessToken: 'tok', user: ALICE }));
    expect(state.user).toEqual(ALICE);
  });

  it('sets isAuthenticated to true', () => {
    const state = authReducer(INITIAL_STATE, setCredentials({ accessToken: 'tok', user: ALICE }));
    expect(state.isAuthenticated).toBe(true);
  });

  it('sets isInitializing to false', () => {
    const state = authReducer(INITIAL_STATE, setCredentials({ accessToken: 'tok', user: ALICE }));
    expect(state.isInitializing).toBe(false);
  });

  it('clears any prior error', () => {
    const errorState = { ...INITIAL_STATE, error: 'previous error' };
    const state = authReducer(errorState, setCredentials({ accessToken: 'tok', user: ALICE }));
    expect(state.error).toBeNull();
  });

  it('overwrites a previous token when called again', () => {
    const after1 = authReducer(INITIAL_STATE, setCredentials({ accessToken: 'tok1', user: ALICE }));
    const after2 = authReducer(after1, setCredentials({ accessToken: 'tok2', user: ALICE }));
    expect(after2.accessToken).toBe('tok2');
  });
});

// ─── clearCredentials ─────────────────────────────────────────────────────────

describe('clearCredentials', () => {
  const authedState = {
    accessToken: 'tok',
    user: ALICE,
    isAuthenticated: true,
    isInitializing: false,
    error: null,
  };

  it('clears the access token', () => {
    expect(authReducer(authedState, clearCredentials()).accessToken).toBeNull();
  });

  it('clears the user', () => {
    expect(authReducer(authedState, clearCredentials()).user).toBeNull();
  });

  it('sets isAuthenticated to false', () => {
    expect(authReducer(authedState, clearCredentials()).isAuthenticated).toBe(false);
  });

  it('sets isInitializing to false', () => {
    expect(authReducer(authedState, clearCredentials()).isInitializing).toBe(false);
  });

  it('clears any stored error', () => {
    const withError = { ...authedState, error: 'something' };
    expect(authReducer(withError, clearCredentials()).error).toBeNull();
  });
});

// ─── setInitializing ──────────────────────────────────────────────────────────

describe('setInitializing', () => {
  it('sets the flag to true', () => {
    const state = authReducer({ ...INITIAL_STATE, isInitializing: false }, setInitializing(true));
    expect(state.isInitializing).toBe(true);
  });

  it('sets the flag to false', () => {
    const state = authReducer(INITIAL_STATE, setInitializing(false));
    expect(state.isInitializing).toBe(false);
  });

  it('does not change other fields', () => {
    const before = { ...INITIAL_STATE, accessToken: 'tok', isInitializing: true };
    const after = authReducer(before, setInitializing(false));
    expect(after.accessToken).toBe('tok');
  });
});

// ─── setAuthError ─────────────────────────────────────────────────────────────

describe('setAuthError', () => {
  it('stores the error message', () => {
    const state = authReducer(INITIAL_STATE, setAuthError('Token expired'));
    expect(state.error).toBe('Token expired');
  });

  it('sets isAuthenticated to false', () => {
    const authed = { ...INITIAL_STATE, isAuthenticated: true };
    const state = authReducer(authed, setAuthError('Expired'));
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets isInitializing to false', () => {
    const state = authReducer(INITIAL_STATE, setAuthError('Err'));
    expect(state.isInitializing).toBe(false);
  });

  it('does not clear the user if one was present', () => {
    const authed = { ...INITIAL_STATE, user: ALICE, isAuthenticated: true };
    const state = authReducer(authed, setAuthError('Err'));
    // user field is not explicitly cleared by setAuthError — verify stability
    expect(state.user).toEqual(ALICE);
  });

  it('subsequent setCredentials call clears the error', () => {
    const withError = authReducer(INITIAL_STATE, setAuthError('Err'));
    const cleared = authReducer(withError, setCredentials({ accessToken: 'tok', user: ALICE }));
    expect(cleared.error).toBeNull();
  });
});
