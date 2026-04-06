# Enterprise Shell

A production-grade React enterprise application shell with Okta SSO, Redux Toolkit, Ant Design, Axios, React Final Form, and MSW.

---

## Tech Stack

| Concern | Library |
|---|---|
| UI framework | [Ant Design 5](https://ant.design) |
| Routing | [React Router v6](https://reactrouter.com) |
| Global state | [Redux Toolkit](https://redux-toolkit.js.org) |
| HTTP client | [Axios](https://axios-http.com) with centralized interceptors |
| Forms | [React Final Form](https://final-form.org/react) + Ant Design fields |
| Authentication | [Okta](https://okta.com) via `@okta/okta-auth-js` (PKCE flow) |
| API mocking | [MSW v2](https://mswjs.io) (browser + Node) |
| Testing | Jest + [React Testing Library](https://testing-library.com) |
| Linting | ESLint + Prettier |

---

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Configure environment
cp .env.example .env
# Fill in your Okta issuer, client ID, redirect URI, and API base URL

# 3. Initialize MSW service worker (one-time)
npx msw init public/ --save

# 4. Start with mocks enabled (no real backend needed)
REACT_APP_ENABLE_MOCKS=true npm start

# 5. Or start pointing at a real Spring Boot backend
npm start
```

---

## Authentication Flow

This app uses **Okta as the identity provider** with no login form. Here is the complete auth flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. User navigates to any protected route (e.g. /dashboard)     │
│                                                                 │
│  2. ProtectedRoute checks Redux auth state:                     │
│     • isAuthenticated = false  →  redirect to /login            │
│                                                                 │
│  3. LoginPage renders a single "Sign in with Okta" button       │
│     No username/password fields.                                │
│                                                                 │
│  4. User clicks the button → useAuth.login() calls:            │
│     oktaAuth.signInWithRedirect()                               │
│     Browser redirects to Okta's /authorize endpoint            │
│                                                                 │
│  5. User authenticates at Okta (MFA, password, etc.)           │
│     or clicks the app tile from the Okta dashboard             │
│                                                                 │
│  6. Okta redirects back to:                                     │
│     REACT_APP_OKTA_REDIRECT_URI  (e.g. /login/callback)        │
│     URL contains an authorization code (PKCE flow)             │
│                                                                 │
│  7. OktaCallback page mounts and calls handleCallback():        │
│     a. oktaAuth.token.parseFromUrl() exchanges the code        │
│        for access + ID tokens via Okta's /token endpoint       │
│     b. Tokens are stored in Okta's in-memory token manager     │
│     c. User claims (sub, email, name, groups) are extracted    │
│        from the ID token                                        │
│     d. dispatch(setCredentials({ accessToken, user }))         │
│        stores the access token string in Redux                  │
│                                                                 │
│  8. navigate('/dashboard') — user lands on the Dashboard        │
│                                                                 │
│  9. All subsequent Axios requests automatically inject:         │
│     Authorization: Bearer <accessToken>                         │
│     via the request interceptor in src/api/axiosInstance.ts    │
│                                                                 │
│ 10. On 401 response: interceptor calls clearCredentials()      │
│     and redirects back to Okta /authorize                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why token-only mode?

- Tokens are stored **in Redux (JavaScript memory only)** — never in `localStorage` or cookies
- The Okta SDK's token manager is also configured for `storage: 'memory'`
- This prevents XSS attacks from stealing long-lived refresh tokens
- Trade-off: tokens don't survive a page refresh; the user will be re-authenticated by Okta transparently on next load

---

## Folder Structure

```
src/
├── api/
│   ├── axiosInstance.ts          # Centralized Axios instance with interceptors
│   └── recordsService.ts         # Records CRUD service module
│
├── store/
│   ├── index.ts                  # Redux store configuration + typed hooks
│   └── slices/
│       └── authSlice.ts          # Auth state (token, user, flags)
│
├── routes/
│   ├── index.tsx                 # Route tree (public + protected)
│   └── ProtectedRoute.tsx        # HOC — redirects unauthenticated users
│
├── components/
│   └── AppLayout.tsx             # Ant Design Layout with sidebar + header
│
├── pages/
│   ├── LoginPage.tsx             # SSO entry point (no credentials form)
│   ├── OktaCallback.tsx          # Token exchange + Redux dispatch
│   ├── Dashboard.tsx             # Main landing page post-auth
│   └── Records/
│       ├── RecordsPage.tsx       # Table + search + CRUD actions
│       └── RecordFormModal.tsx   # React Final Form + Ant Design fields
│
├── hooks/
│   └── useAuth.ts                # Okta client singleton + auth actions
│
├── mocks/
│   ├── data.ts                   # In-memory DB (seed + CRUD helpers)
│   ├── handlers.ts               # MSW request handlers (Spring Boot mirror)
│   ├── browser.ts                # MSW Service Worker setup
│   └── server.ts                 # MSW Node server (Jest)
│
├── __tests__/
│   ├── authSlice.test.ts
│   ├── recordsService.test.ts
│   ├── ProtectedRoute.test.tsx
│   └── RecordFormModal.test.tsx
│
├── App.tsx                       # Ant Design ConfigProvider + BrowserRouter
├── index.tsx                     # React root + MSW bootstrap
└── setupTests.ts                 # Jest setup (MSW lifecycle + jsdom stubs)
```

---

## Okta App Configuration

In your Okta Admin console:

1. Create a **Single-Page Application (SPA)** OIDC app
2. Set **Sign-in redirect URI** to `http://localhost:3000/login/callback`
3. Set **Sign-out redirect URI** to `http://localhost:3000`
4. Enable **Authorization Code with PKCE** grant type
5. Add scopes: `openid`, `profile`, `email`
6. Copy the **Client ID** and your **Okta domain** to `.env`

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server on port 3000 |
| `npm test` | Run all tests (single pass) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Production build |
| `npm run lint` | Check for lint errors |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## MSW Mock API

The mock handlers in `src/mocks/handlers.ts` mirror a Spring Boot `@RestController`:

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/records?page=0&size=10` | Paginated list (Spring `Page<Record>` shape) |
| `GET` | `/api/records/:id` | Single record |
| `POST` | `/api/records` | Create record (returns 201) |
| `PUT` | `/api/records/:id` | Update record |
| `DELETE` | `/api/records/:id` | Delete record (returns 204) |

Enable mocks in dev: `REACT_APP_ENABLE_MOCKS=true npm start`

---

## Environment Variables

See [.env.example](.env.example) for all required variables:

| Variable | Description |
|---|---|
| `REACT_APP_OKTA_ISSUER` | Okta authorization server URL |
| `REACT_APP_OKTA_CLIENT_ID` | Okta OIDC client ID |
| `REACT_APP_OKTA_REDIRECT_URI` | Callback URL (must match Okta app config) |
| `REACT_APP_OKTA_POST_LOGOUT_URI` | Post-logout redirect URL |
| `REACT_APP_API_BASE_URL` | Spring Boot backend base URL |
| `REACT_APP_ENABLE_MOCKS` | Set `true` to enable MSW in development |
