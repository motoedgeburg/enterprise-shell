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
| i18n | [react-intl](https://formatjs.io/docs/react-intl) |
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

# 5. Or start pointing at a real backend
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
│     via the request interceptor in src/api/axiosInstance.js    │
│                                                                 │
│ 10. On 401 response: interceptor calls clearCredentials()      │
│     and redirects back to Okta /authorize                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why token-only (memory) storage?

- Tokens are stored **in Redux (JavaScript memory only)** — never in `localStorage` or cookies
- The Okta SDK's token manager is also configured for `storage: 'memory'`
- This prevents XSS attacks from stealing long-lived refresh tokens
- Trade-off: tokens don't survive a page refresh; Okta's silent re-authentication handles renewal transparently

---

## Folder Structure

```
src/
├── api/
│   ├── axiosInstance.js          # Centralized Axios instance with interceptors
│   ├── recordsService.js         # Records CRUD service module
│   └── tests/
│       └── recordsService.test.js
│
├── store/
│   ├── index.js                  # Redux store configuration + typed hooks
│   ├── slices/
│   │   └── authSlice.js          # Auth state (token, user, flags)
│   └── tests/
│       └── authSlice.test.js
│
├── routes/
│   ├── index.jsx                 # Route tree (public + protected)
│   ├── ProtectedRoute.jsx        # HOC — redirects unauthenticated users
│   └── tests/
│       ├── ProtectedRoute.test.jsx
│       └── ProtectedRoute.mock.test.jsx   # IS_MOCK_MODE=true path
│
├── components/
│   ├── AppLayout.jsx             # Ant Design Layout with sidebar + header
│   ├── messages.js               # i18n message descriptors
│   └── tests/
│       └── AppLayout.test.jsx
│
├── pages/
│   ├── Dashboard.jsx             # Main landing page post-auth
│   ├── LoginPage.jsx             # SSO entry point (no credentials form)
│   ├── OktaCallback.jsx          # Token exchange + Redux dispatch
│   ├── messages.js               # i18n message descriptors
│   ├── tests/
│   │   ├── Dashboard.test.jsx
│   │   ├── LoginPage.test.jsx
│   │   └── OktaCallback.test.jsx
│   └── Records/
│       ├── RecordsPage.jsx       # Table + search + CRUD actions
│       ├── RecordFormModal.jsx   # React Final Form + Ant Design fields
│       ├── messages.js
│       └── tests/
│           ├── RecordsPage.test.jsx
│           └── RecordFormModal.test.jsx
│
├── hooks/
│   ├── useAuth.js                # Okta client singleton + auth actions
│   └── tests/
│       ├── useAuth.test.js
│       └── useAuth.mock.test.js  # IS_MOCK_MODE=true path
│
├── mocks/
│   ├── data.js                   # In-memory DB (seed + CRUD helpers)
│   ├── handlers.js               # MSW request handlers
│   ├── browser.js                # MSW Service Worker setup
│   └── server.js                 # MSW Node server (Jest)
│
├── tests/
│   └── renderUtils.jsx           # Shared render helpers + store factory
│
├── App.jsx                       # Ant Design ConfigProvider + BrowserRouter
├── index.jsx                     # React root + MSW bootstrap
└── setupTests.js                 # Jest setup (polyfills, MSW lifecycle, jsdom stubs)
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
| `npm test` | Run all tests (single pass, no watch) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Production build |
| `npm run lint` | Check for lint errors |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## Tests

169 tests across 15 suites, collocated with their source files.

```bash
npm test              # single pass
npm run test:watch    # watch mode
npm test -- --coverage
```

Key testing patterns:

- **MSW v2** intercepts all Axios requests in Jest via the Node server (`src/mocks/server.js`). Axios is forced onto the `fetch` adapter in `setupTests.js` so MSW's interceptor applies.
- **Okta** is mocked via `jest.mock('@okta/okta-auth-js')` using a `global.__oktaMock` pattern to avoid Babel hoisting issues.
- **IS_MOCK_MODE** tests (env-var-gated code paths) live in separate `*.mock.test.js` files that use `require()` so the env var is set before any module loads.
- **Ant Design** modals and popovers are tested via React Testing Library's ARIA queries.

---

## MSW Mock API

The mock handlers in `src/mocks/handlers.js` mirror a Spring Boot `@RestController`:

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
| `REACT_APP_API_BASE_URL` | Backend base URL |
| `REACT_APP_ENABLE_MOCKS` | Set `true` to enable MSW in development |
