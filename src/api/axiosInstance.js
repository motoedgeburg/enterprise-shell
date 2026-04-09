import axios from 'axios';

import { store } from '../store';
import { clearCredentials } from '../store/slices/authSlice';
import { createLogger } from '../utils/logger.js';

const log = createLogger('API');

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Inject Bearer token from Redux store on every outbound request
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Handle 401 Unauthorized globally: clear auth state and redirect to Okta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or revoked — clear Redux state and redirect to login.
      // ProtectedRoute and the login page handle the full re-auth flow,
      // so there's no need to manually construct an Okta authorize URL here.
      store.dispatch(clearCredentials());
      window.location.assign('/login');
    }

    if (error.response?.status === 403) {
      log.warn('403 Forbidden — user lacks required permissions.');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
