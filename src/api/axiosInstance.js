import axios from 'axios';

import { store } from '../store';
import { clearCredentials } from '../store/slices/authSlice';

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
      // Token expired or revoked — clear Redux state so ProtectedRoute redirects
      store.dispatch(clearCredentials());

      const issuer = import.meta.env.VITE_OKTA_ISSUER ?? '';
      const clientId = import.meta.env.VITE_OKTA_CLIENT_ID ?? '';
      const redirectUri = import.meta.env.VITE_OKTA_REDIRECT_URI ?? '';

      if (issuer && clientId && redirectUri) {
        const authorizeUrl =
          `${issuer}/v1/authorize` +
          `?client_id=${clientId}` +
          `&response_type=token` +
          `&scope=openid profile email` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&nonce=${crypto.randomUUID()}` +
          `&state=${crypto.randomUUID()}`;
        window.location.href = authorizeUrl;
      }
    }

    if (error.response?.status === 403) {
      console.warn('[API] 403 Forbidden — user lacks required permissions.');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
