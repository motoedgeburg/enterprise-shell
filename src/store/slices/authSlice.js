import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.error = null;
    },
    clearCredentials(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.error = null;
    },
    setInitializing(state, action) {
      state.isInitializing = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
  },
});

export const { setCredentials, clearCredentials, setInitializing, setAuthError } =
  authSlice.actions;

export default authSlice.reducer;
