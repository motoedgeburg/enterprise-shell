# Enterprise Shell

A production-grade React 19 enterprise application shell with Okta SSO, Redux Toolkit, Ant Design, Axios, React Final Form, and MSW.

---

## Tech Stack

| Concern | Library |
|---|---|
| Core framework | [React 19](https://react.dev) |
| UI framework | [Ant Design 6](https://ant.design) with ConfigProvider theming |
| Routing | [React Router v6](https://reactrouter.com) |
| Global state | [Redux Toolkit](https://redux-toolkit.js.org) |
| HTTP client | [Axios](https://axios-http.com) with centralized interceptors |
| Forms | [React Final Form 7](https://final-form.org/react) + typed Ant Design field components |
| Validation | Composable validator functions + `useValidators` hook (react-intl aware) |
| Authentication | [Okta](https://okta.com) via `@okta/okta-auth-js` (PKCE flow) |
| API mocking | [MSW v2](https://mswjs.io) (browser + Node) |
| i18n | [react-intl 7](https://formatjs.io/docs/react-intl) — all strings in message descriptor files |
| Logging | Structured logger (`src/utils/logger.js`) with level-gated output |
| Build | [Vite](https://vitejs.dev) — instant dev server, native ESM |
| Testing | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) |
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

# 4. Start with all mocks (no Okta, no backend)
VITE_MOCK_AUTH=true VITE_ENABLE_MOCKS=true npm start

# 5. Mock Okta auth but use real backend at localhost:8080
VITE_MOCK_AUTH=true npm start

# 6. Full production mode (real Okta + real backend)
npm start
```

---

## App Flow

```
Login (Okta SSO)
  └─▶ Dashboard            — welcome + Search tile
        └─▶ Search          — filter form (name, email, dept, status, address)
              └─▶ Results   — paginated table; New Record button or click a row
                    └─▶ Record Detail (/records/:id)  — edit / delete
                    └─▶ New Record    (/records/new)  — create via same accordion
```

- Search filters are preserved in URL query params so the browser Back button returns to the exact results page.
- After creating a record, the page replaces itself with the new record's detail URL so Back still works correctly.

---

## Authentication Flow

This app uses **Okta as the identity provider** with no login form. Here is the complete auth flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  0. App mounts → AuthInitializer subscribes to Okta's           │
│     authStateManager and calls oktaAuth.start().                │
│     This resolves isInitializing (true → false) whether or      │
│     not the user has an existing session.                        │
│                                                                 │
│  1. User navigates to any protected route (e.g. /dashboard)     │
│                                                                 │
│  2. ProtectedRoute checks Redux auth state:                     │
│     • isInitializing = true   →  render nothing (wait)          │
│     • isAuthenticated = false →  redirect to /login             │
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
│     VITE_OKTA_REDIRECT_URI  (e.g. /login/callback)             │
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
│     and redirects to /login, re-entering the auth flow         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why token-only (memory) storage?

- Tokens are stored **in Redux (JavaScript memory only)** — never in `localStorage` or cookies
- The Okta SDK's token manager is also configured for `storage: 'memory'`
- This prevents XSS attacks from stealing long-lived refresh tokens
- Trade-off: tokens don't survive a page refresh; Okta's silent re-authentication handles renewal transparently

---

## Error Handling

The app wraps the entire component tree in a top-level `<ErrorBoundary>` (in `App.jsx`). If any component throws an unhandled error during rendering, the boundary catches it and displays a recovery screen with "Try Again" and "Go to Dashboard" options instead of a blank page.

---

## Logging

All runtime logging goes through `createLogger(source)` from `src/utils/logger.js`. Each logger instance provides `debug`, `info`, `warn`, and `error` methods that tag output with the source name (e.g. `[Auth]`, `[API]`).

In production builds (`import.meta.env.PROD`), `debug` and `info` messages are suppressed — only `warn` and `error` are emitted.

```js
import { createLogger } from '../utils/logger.js';
const log = createLogger('MyComponent');

log.info('loaded');           // silent in production
log.error('fetch failed', err); // always emitted
```

---

## Folder Structure

```
index.html                            # Vite entry point (root of project)
vite.config.js                        # Vite + Vitest configuration
.eslintrc.cjs                         # ESLint config (CJS required with "type": "module")

src/
├── App.jsx
├── index.jsx
├── renderUtils.jsx               # Shared test helpers (buildStore, appMessages, fixtures)
├── setupTests.js                 # Vitest setup (polyfills, MSW lifecycle, jsdom stubs)
│
├── i18n/
│   └── messages.js               # Aggregates all message descriptors into a single map
│
├── api/
│   ├── axiosInstance.js          # Centralized Axios instance with interceptors
│   ├── lookupsService.js         # Reference data (departments, statuses, etc.)
│   ├── recordsService.js         # Records CRUD + search (UUID surrogate keys)
│   └── tests/
│       └── recordsService.test.js
│
├── store/
│   ├── index.js                  # Redux store + typed hooks
│   └── slices/
│       ├── authSlice.js          # Auth state (token, user, flags)
│       └── lookupsSlice.js       # Reference data (fetched once, condition-guarded)
│
├── routes/
│   ├── index.jsx                 # Route tree (public + protected, lazy-loaded)
│   ├── ProtectedRoute.jsx        # Redirects unauthenticated users to /login
│   └── tests/
│
├── components/
│   ├── AppLayout/
│   │   ├── AppLayout.jsx         # Dark sidebar + header shell (Ant Design Layout)
│   │   ├── messages.js           # i18n descriptors for shell chrome
│   │   └── tests/
│   │       └── AppLayout.test.jsx
│   ├── AuthInitializer/
│   │   ├── AuthInitializer.jsx   # Bootstraps Okta auth state on startup (real mode only)
│   │   └── tests/
│   │       └── AuthInitializer.test.jsx
│   ├── Breadcrumbs/
│   │   └── Breadcrumbs.jsx       # Shared breadcrumb bar (clickable ancestors)
│   ├── ErrorBoundary/
│   │   ├── ErrorBoundary.jsx     # Top-level error boundary with recovery UI
│   │   └── tests/
│   │       └── ErrorBoundary.test.jsx
│   └── fields/                   # Typed React Final Form ↔ Ant Design field components
│       ├── AntField.jsx          # Base adapter (Field → Form.Item)
│       ├── TextField.jsx
│       ├── EmailField.jsx
│       ├── PhoneField.jsx        # Auto-formats to (NXX) NXX-XXXX as user types
│       ├── SsnField.jsx          # Masked input, auto-formats to XXX-XX-XXXX
│       ├── SelectField.jsx
│       ├── TextAreaField.jsx
│       ├── DateField.jsx         # ISO string ↔ dayjs conversion
│       ├── RadioGroupField.jsx
│       ├── CheckboxGroupField.jsx
│       ├── SwitchField.jsx
│       ├── index.js              # Barrel export
│       └── tests/
│           ├── PhoneField.test.jsx
│           └── SsnField.test.jsx
│
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx         # Welcome + centered Search tile
│   │   ├── messages.js
│   │   └── tests/
│   │       └── Dashboard.test.jsx
│   ├── LoginPage/
│   │   ├── LoginPage.jsx         # SSO entry point (no credentials form)
│   │   ├── messages.js
│   │   └── tests/
│   │       └── LoginPage.test.jsx
│   ├── OktaCallback/
│   │   ├── OktaCallback.jsx      # Token exchange + Redux dispatch
│   │   ├── messages.js
│   │   └── tests/
│   │       └── OktaCallback.test.jsx
│   ├── Search/
│   │   ├── SearchPage.jsx        # Filter form → navigate to /results
│   │   ├── messages.js
│   │   └── tests/
│   │       └── SearchPage.test.jsx
│   ├── Results/
│   │   ├── ResultsPage.jsx       # Paginated table; New Record → /records/new
│   │   ├── ResultsPage.css       # Row hover highlight styles
│   │   ├── messages.js
│   │   └── tests/
│   │       └── ResultsPage.test.jsx
│   └── RecordDetail/
│       ├── RecordDetailPage.jsx  # Edit (/records/:id) + Create (/records/new)
│       ├── messages.js           # Page chrome, section headings, delete/submit actions
│       ├── tests/
│       │   └── RecordDetailPage.test.jsx
│       └── sections/
│           ├── PersonalInfo/
│           │   ├── PersonalInfoSection.jsx
│           │   ├── messages.js
│           │   └── tests/
│           │       └── PersonalInfoSection.test.jsx
│           ├── WorkInfo/
│           │   ├── WorkInfoSection.jsx   # Reads accessLevel → locks status when admin
│           │   ├── messages.js
│           │   └── tests/
│           │       └── WorkInfoSection.test.jsx
│           ├── Preferences/
│           │   ├── PreferencesSection.jsx # Reads status/employmentType → locks fields
│           │   ├── messages.js
│           │   └── tests/
│           │       └── PreferencesSection.test.jsx
│           ├── History/
│           │   ├── HistorySection.jsx         # Tab wrapper
│           │   ├── messages.js                # Tab labels only
│           │   ├── tests/
│           │   │   └── HistorySection.test.jsx
│           │   ├── EmergencyContacts/
│           │   │   ├── EmergencyContactsTab.jsx  # Contacts table + add/edit modal
│           │   │   ├── messages.js
│           │   │   └── tests/
│           │   │       └── EmergencyContactsTab.test.jsx
│           │   └── Certifications/
│           │       ├── CertificationsTab.jsx     # Certs table + add/edit modal
│           │       ├── messages.js
│           │       └── tests/
│           │           └── CertificationsTab.test.jsx
│           └── Summary/
│               ├── SummarySection.jsx    # FormSpy live preview (read-only)
│               ├── messages.js
│               └── tests/
│                   └── SummarySection.test.jsx
│
├── hooks/
│   ├── useAuth.js                # Okta client singleton + auth actions
│   ├── useLookups.js             # Dispatches fetchLookups (condition-guarded)
│   ├── useValidators.js          # Localized validator factories via useIntl
│   └── tests/
│
├── utils/
│   ├── logger.js                 # Structured logger (createLogger) with level gating
│   ├── validators.js             # Pure validator functions (no strings)
│   ├── validatorMessages.js      # i18n descriptors for validation errors
│   └── tests/
│       └── validators.test.js
│
└── mocks/
    ├── data.js                   # In-memory DB (8 seed records + search/CRUD helpers)
    ├── handlers.js               # MSW handlers: /api/lookups, /api/records
    ├── browser.js                # MSW Service Worker (dev)
    └── server.js                 # MSW Node server (Vitest)
```

---

## Field Components

All form fields are typed wrappers that bridge React Final Form's `<Field>` to Ant Design inputs. They handle value/onChange/onBlur, touched+error display, and forward `validate` and `required` props to Final Form. When `required` is set, Ant Design renders a red asterisk (`*`) next to the field label.

| Component | Ant Design input | Notes |
|---|---|---|
| `TextField` | `Input` | `type` prop (default `text`) |
| `EmailField` | `Input` | Shorthand for `TextField type="email"` |
| `PhoneField` | `Input` | Auto-formats to `(NXX) NXX-XXXX` as user types |
| `SsnField` | `Input.Password` | Masked; auto-formats to `XXX-XX-XXXX` |
| `SelectField` | `Select` | `options: { value, label }[]` |
| `TextAreaField` | `Input.TextArea` | `rows` prop |
| `DateField` | `DatePicker` | Stores ISO string in form state |
| `RadioGroupField` | `Radio.Group` | Supports `optionType="button"` |
| `CheckboxGroupField` | `Checkbox.Group` | Stores `string[]` |
| `SwitchField` | `Switch` | `checkedLabel` / `uncheckedLabel` captions |

---

## Validation

Validators are **pure functions** in `src/utils/validators.js` that take a `msg` string and return `(value) => string | undefined`. Components use the `useValidators()` hook which injects localized error messages via `useIntl()`.

```js
const { required, email, composeValidators } = useValidators();

<EmailField
  name="email"
  validate={composeValidators(required(), email())}
/>
```

Available validators: `required`, `email`, `phone`, `ssn`, `url`, `minLength(n)`, `maxLength(n)`, `pastDate`, `composeValidators`.

Submit/Search buttons are disabled while `hasValidationErrors` is true (React Final Form render prop).

---

## UX Features

### Breadcrumb Navigation

The Search, Results, and Record Detail pages display a breadcrumb trail (Dashboard → Search → Results → Record Detail). Earlier items are clickable links; the current page is plain text. The Dashboard is the top-level page and has no breadcrumb. Implemented via the shared `Breadcrumbs` component in `src/components/Breadcrumbs/`.

### Status Tag Colors

Status values in the Results table and Summary section use color-coded Ant Design `<Tag>` components:

| Status | Color |
|---|---|
| `active` | Green |
| `inactive` | Default (gray) |
| `on-leave` | Orange |
| `terminated` | Red |

### Error Count Badges on Accordion Headers

The Personal Information, Work Information, and Preferences section headers display a red badge with the count of fields that have validation errors. Badges appear when a field has been touched or after a submit attempt, powered by React Final Form's `<FormSpy>` subscribing to `errors`, `touched`, and `submitFailed`.

### Skeleton Loading State

The Record Detail page shows a skeleton placeholder (breadcrumb line, button + title row, three card outlines) while fetching data, providing a content-shaped loading indicator instead of a generic spinner.

### Table Row Hover Highlight

Results table rows highlight with a light blue background (`#f0f5ff`) on hover, reinforcing that rows are clickable. Styled via `src/pages/Results/ResultsPage.css`.

### Unsaved Changes Guard

The Record Detail page registers its form dirty state with a `NavigationGuardProvider` (wrapping `AppLayout`). Any navigation — sidebar menu links, breadcrumbs, or the Back button — is routed through `guardedNavigate`, which shows a confirmation modal ("You have unsaved changes. Are you sure you want to leave?") with "Leave" and "Stay" options when the form is dirty. Browser tab close/refresh is also blocked via `useUnsavedChangesBlocker`.

### Improved Empty State

When no records match the current filters, the Results page shows an explanatory message with two CTA buttons — "Refine Search" (returns to the search form) and "New Record" (navigates to the create form).

---

## Record Detail Accordion

The accordion has five sections, each self-contained with its own `messages.js`:

| Section | Key fields |
|---|---|
| Personal Information | Name, email, phone (auto-formatted), SSN (masked), address, DOB, bio |
| Work Information | Job title, department, status, employment type, start date, manager |
| Preferences & Permissions | Remote eligibility, notifications, channels, access level, notes |
| Contacts & Certifications | Emergency contacts tab + Professional certifications tab (full CRUD) |
| Summary | Read-only live preview via `FormSpy` |

All panels use `forceRender: true` so React Final Form registers every field's validators immediately — the submit button stays disabled until all required fields across all sections are satisfied, even when panels are collapsed.

Section components enforce cross-field business rules via `useFormState` + `form.change()`. When a rule fires, the affected field is disabled and an inline `Alert` explains why.

---

## Reference Data (Lookups)

`GET /api/lookups` returns departments, statuses, employment types, notification channels, and access levels. The response is stored in the `lookups` Redux slice via `createAsyncThunk` with a condition guard that prevents duplicate fetches.

`Dashboard` dispatches the fetch on mount so lookups are warm for all downstream pages. Components consume them via the `useLookups()` hook.

---

## MSW Mock API

Records use **UUID surrogate keys** — the internal numeric `id` is never exposed in API responses. All endpoints accept and return a `uuid` field as the public identifier. Secondary data (emergency contacts, certifications) keeps plain IDs since they are only accessed through their parent record.

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/lookups` | Reference data (departments, statuses, etc.) |
| `GET` | `/api/records` | Flat summary list (`uuid`, `name`, `address`, `department`, `status`); client-side pagination |
| `GET` | `/api/records/:uuid` | Full nested record (detail view) |
| `POST` | `/api/records` | Create (returns 201 with server-generated `uuid`) |
| `PUT` | `/api/records/:uuid` | Update |
| `DELETE` | `/api/records/:uuid` | Delete (returns 204) |

Enable MSW mocks in dev: `VITE_ENABLE_MOCKS=true npm start`

---

## Tests

Tests are collocated with their source files. Coverage thresholds are enforced at 60% across all metrics (`vite.config.js`).

```bash
npm test                    # single pass
npm run test:watch          # watch mode
npm run test:coverage       # with coverage report
```

---

## Okta App Configuration

In your Okta Admin console:

1. Create a **Single-Page Application (SPA)** OIDC app
2. Set **Sign-in redirect URI** to `http://localhost:5173/login/callback`
3. Set **Sign-out redirect URI** to `http://localhost:5173`
4. Enable **Authorization Code with PKCE** grant type
5. Add scopes: `openid`, `profile`, `email`
6. Copy the **Client ID** and your **Okta domain** to `.env`


---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Vite dev server (default port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all tests (single pass) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check for lint errors |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## Environment Variables

All variables are prefixed with `VITE_` and accessed via `import.meta.env` (Vite convention).

| Variable | Description |
|---|---|
| `VITE_OKTA_ISSUER` | Okta authorization server URL (required outside mock mode) |
| `VITE_OKTA_CLIENT_ID` | Okta OIDC client ID (required outside mock mode) |
| `VITE_OKTA_REDIRECT_URI` | Callback URL (must match Okta app config) |
| `VITE_OKTA_POST_LOGOUT_URI` | Post-logout redirect URL |
| `VITE_API_BASE_URL` | Backend base URL |
| `VITE_MOCK_AUTH` | Set `true` to bypass Okta and use a fake user |
| `VITE_ENABLE_MOCKS` | Set `true` to enable MSW mock API in development |
