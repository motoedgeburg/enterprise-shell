# Enterprise Shell

A production-grade React 19 enterprise application shell featuring Okta SSO, Redux Toolkit, Ant Design v6, Axios, React Final Form, and MSW for API mocking.

---

## Tech Stack

| Concern | Library | Version |
|---|---|---|
| Core framework | [React](https://react.dev) | 19 |
| UI framework | [Ant Design](https://ant.design) with ConfigProvider theming | 6 |
| Routing | [React Router](https://reactrouter.com) | 6 |
| Global state | [Redux Toolkit](https://redux-toolkit.js.org) | 2 |
| HTTP client | [Axios](https://axios-http.com) with centralized interceptors | 1.6 |
| Forms | [React Final Form](https://final-form.org/react) + typed Ant Design field components | 7 |
| Validation | Composable validator functions + `useValidators` hook (react-intl aware) | — |
| Authentication | [Okta](https://developer.okta.com) via `@okta/okta-auth-js` (PKCE flow) | 8 |
| API mocking | [MSW](https://mswjs.io) (browser + Node) | 2 |
| i18n | [react-intl](https://formatjs.io/docs/react-intl) — all UI strings in message descriptor files | 7 |
| Logging | Structured logger (`src/utils/logger.js`) with level-gated output | — |
| Build | [Vite](https://vitejs.dev) — instant dev server, native ESM | 8 |
| Testing | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) | 4 |
| Linting | [ESLint](https://eslint.org) 8 + [Prettier](https://prettier.io) 3 | — |

**Node requirement:** `^20.19.0 || >=22.12.0`

---

## Prerequisites

- Node.js (see engine requirement above)
- npm
- An Okta developer account (for production auth — not required in mock mode)
- A Spring Boot backend at `localhost:8080` (optional — MSW can mock the entire API)

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd enterprise-shell
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set your Okta issuer, client ID, and redirect URIs
# Update port numbers if your dev server doesn't run on the default (5173)

# 3. Initialize MSW service worker (one-time)
npx msw init public/ --save

# 4. Start with all mocks (no Okta, no backend needed)
VITE_MOCK_AUTH=true VITE_ENABLE_MOCKS=true npm start

# 5. Mock Okta auth but hit real backend at localhost:8080
VITE_MOCK_AUTH=true npm start

# 6. Full production mode (real Okta + real backend)
npm start
```

The dev server starts at `http://localhost:5173` by default (Vite).

---

## App Flow

```
Login (Okta SSO or mock auth)
  └─▶ Dashboard              — single Search Records button
        └─▶ Search            — filter form (name, email, dept, status, address)
              └─▶ Results     — paginated table; New Record button or click a row
                    ├─▶ Record Detail (/records/:uuid)  — view / edit / delete
                    └─▶ New Record    (/records/new)    — create via same form
```

- Search filters are preserved in URL query params so the browser Back button returns to the exact results page.
- After creating a record, the app replaces the URL with the new record's detail route so Back still works correctly.

---

## API Shape

The app works with a nested record structure. The form field names map directly to the API shape via React Final Form dot-notation (e.g., `name="personalInfo.name"`).

```json
{
  "uuid": "b3a1c5d0-...",
  "personalInfo": {
    "name": "Alice Johnson",
    "email": "alice.johnson@company.com",
    "phone": "(215) 555-0101",
    "address": "123 Market St, Philadelphia, PA 19103",
    "dateOfBirth": "1990-03-15",
    "ssn": "123-45-6789",
    "bio": "Senior software engineer..."
  },
  "workInfo": {
    "jobTitle": "Senior Software Engineer",
    "manager": "Jane Smith",
    "department": "Engineering",
    "status": "active",
    "startDate": "2019-06-01",
    "employmentType": "full-time"
  },
  "preferences": {
    "remoteEligible": true,
    "notificationsEnabled": true,
    "notificationChannels": ["email", "slack"],
    "accessLevel": "standard",
    "notes": "Team lead for the infrastructure squad."
  },
  "compensation": {
    "baseSalary": 145000,
    "payFrequency": "annual",
    "bonusTarget": 15,
    "stockOptions": 500,
    "effectiveDate": "2023-01-01",
    "overtimeEligible": false
  },
  "history": {
    "emergencyContacts": [
      {
        "id": 1,
        "name": "Michael Johnson",
        "relationship": "Spouse",
        "phone": "(215) 555-0199",
        "email": "michael.j@personal.com",
        "isPrimary": true
      }
    ],
    "certifications": [
      {
        "id": 1,
        "name": "AWS Solutions Architect – Professional",
        "issuingBody": "Amazon Web Services",
        "issueDate": "2022-03-15",
        "expiryDate": "2025-03-15",
        "credentialId": "AWS-SAP-001234"
      }
    ]
  },
  "auditLog": [
    {
      "type": "create",
      "note": "",
      "savedBy": "system@company.com",
      "savedAt": "2024-01-15T10:30:00Z"
    },
    {
      "type": "edit",
      "note": "Updated compensation after annual review.",
      "savedBy": "jane.smith@company.com",
      "savedAt": "2025-01-10T14:22:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

- **New sub-records** (emergency contacts, certifications) are sent with `id: null` — the backend assigns the ID.
- **Existing sub-records** include their database `id` so the backend can update in place.
- **`auditLog`** is append-only. The frontend sends only the new entry (without `savedBy` or `savedAt`); the backend stamps both from the auth token and server clock, then appends to the stored array.
- The search endpoint returns a flat summary: `{ uuid, name, address, department, status }` — `auditLog` is only returned on the detail endpoint.

---

## API Endpoints

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/lookups` | Reference data (departments, statuses, relationships, etc.) |
| `GET` | `/api/records` | Flat summary list; supports query params: `name`, `email`, `department`, `status`, `address` |
| `GET` | `/api/records/:uuid` | Full nested record (detail view) |
| `POST` | `/api/records` | Create — returns 201 with server-generated `uuid` |
| `PUT` | `/api/records/:uuid` | Update — full replacement of nested sections |
| `DELETE` | `/api/records/:uuid` | Delete — returns 204 |

Records use **UUID surrogate keys** — the internal numeric `id` is never exposed in list/detail responses.

---

## Authentication Flow

This app uses **Okta as the identity provider** with no login form — users authenticate through Okta's hosted sign-in page.

```
1. User navigates to a protected route (e.g., /dashboard)
2. ProtectedRoute checks Redux auth state:
   - isInitializing = true  → render nothing (wait for Okta SDK)
   - isAuthenticated = false → redirect to /login
3. LoginPage renders a "Sign in with Okta" button (no username/password fields)
4. Button click → oktaAuth.signInWithRedirect() → browser redirects to Okta
5. User authenticates at Okta (password, MFA, etc.)
6. Okta redirects back to /login/callback with an authorization code (PKCE)
7. OktaCallback exchanges the code for tokens, extracts user claims,
   and dispatches setCredentials({ accessToken, user }) to Redux
8. User lands on /dashboard — all subsequent Axios requests inject
   Authorization: Bearer <token> via the request interceptor
9. On 401 response: interceptor clears credentials and redirects to /login
```

### Token Storage

Tokens are stored **in Redux (JavaScript memory only)** — never in `localStorage` or cookies. The Okta SDK's token manager is configured with `storage: 'memory'`. This prevents XSS attacks from stealing tokens. Trade-off: tokens don't survive a page refresh; Okta's silent re-authentication handles renewal transparently.

---

## Record Detail Form

The detail page uses an accordion layout (wrapped in a Card container) with six icon-labeled sections, each self-contained with its own component and `messages.js`:

| Section | Key Fields |
|---|---|
| Personal Information | Name, email, phone (auto-formatted), SSN (masked), address, DOB, bio |
| Work Information | Job title, department, status, employment type, start date, manager |
| Preferences & Permissions | Remote eligibility, notifications, channels, access level, notes |
| Compensation | Base salary (currency), pay frequency, bonus target (%), stock options, effective date, overtime eligible |
| History | Audit Trail (default tab, append-only create/edit log with date+time, user email, and notes — scrollable container with entry count badge) + Emergency contacts tab + Professional certifications tab (full CRUD via modals) |
| Summary | Read-only live preview of all form values via `FormSpy` |

### Form Architecture

- **Dot-notation field names** (`personalInfo.name`, `workInfo.status`, `history.certifications`) — React Final Form automatically creates the nested object structure matching the API shape. No flatten/unflatten adapters needed.
- **`forceRender: true`** on all accordion panels so validators register immediately — the submit button stays disabled until all required fields across all sections are satisfied, even when panels are collapsed.
- **Error count badges** on section headers show how many fields have validation errors (visible after touch or submit attempt), using prefix-based matching (e.g., all `personalInfo.*` errors).
- **Cross-section business rules** via `useFormState` + `form.change()` — when a rule fires, the affected field is disabled and an inline `Alert` explains why.

---

## UX Features

| Feature | Description |
|---|---|
| **Full-width header** | Logo + user menu span the full width; sidebar with nav sits below |
| **Sidebar collapsed by default** | Icons-only sidebar; expandable via toggle in the header |
| **App logo** | SVG logo (`src/assets/logo.svg`) displayed in the header |
| **Breadcrumb navigation** | Dashboard > Search > Results > Record Detail. Current page in bold. Each ancestor is a clickable link. |
| **Section icons** | Accordion headers have contextual icons (User, ID card, Settings, Dollar, History, File) |
| **Status tag colors** | `active` = green, `inactive` = gray, `on-leave` = orange, `suspended` = volcano, `terminated` = red |
| **Skeleton loading** | Record Detail shows shaped placeholders while fetching, not a generic spinner |
| **Centered spinners** | All loading spinners (login, callback, lazy routes) center vertically on the viewport |
| **Table row hover** | Results rows highlight on hover (`#f0f5ff`) to indicate clickability |
| **Unsaved changes guard** | Sidebar links, breadcrumbs, Back button, and browser close/refresh all show a confirmation modal when the form is dirty |
| **Footer action bar** | Delete (left) and Save (right) in the same footer card, separated to prevent accidental clicks |
| **Save confirmation modal** | Edit saves show a modal with an optional note (max 250 chars); create mode auto-generates a silent audit entry |
| **Audit Trail** | Dedicated tab showing append-only create/edit history with date+time, user email, and optional notes (quote-styled with comment icon). Scrollable 250px container with entry count badge on tab |
| **Empty state CTAs** | When no records match, the Results page offers "Refine Search" and "New Record" buttons |

---

## Field Components

All form fields are typed wrappers bridging React Final Form `<Field>` to Ant Design inputs via a shared `AntField` adapter. They handle `value`/`onChange`/`onBlur`, touched + error display, and forward `validate` and `required` props. When `required` is set, a red asterisk appears next to the label.

| Component | Ant Design Input | Notes |
|---|---|---|
| `TextField` | `Input` | `type` prop (default `text`) |
| `EmailField` | `Input` | Shorthand for `type="email"` |
| `PhoneField` | `Input` | Auto-formats to `(NXX) NXX-XXXX` as user types |
| `SsnField` | `Input.Password` | Masked; auto-formats to `XXX-XX-XXXX` |
| `SelectField` | `Select` | `options: { value, label }[]` |
| `TextAreaField` | `Input.TextArea` | `rows` prop |
| `DateField` | `DatePicker` | Stores ISO string in form state |
| `RadioGroupField` | `Radio.Group` | Supports `optionType="button"` |
| `CheckboxGroupField` | `Checkbox.Group` | Stores `string[]` |
| `NumberField` | `InputNumber` | Generic numeric input |
| `CurrencyField` | `InputNumber` | `$` prefix, comma formatting, 2-decimal precision |
| `SwitchField` | `Switch` | `checkedLabel` / `uncheckedLabel` captions |

---

## Validation

Validators are **pure functions** in `src/utils/validators.js`. Each takes a `msg` string and returns `(value) => string | undefined`. Components use the `useValidators()` hook which injects localized error messages via `useIntl()`.

```js
const { required, email, composeValidators } = useValidators();

<EmailField
  name="personalInfo.email"
  validate={composeValidators(required(), email())}
/>
```

**Available validators:** `required`, `email`, `phone`, `ssn`, `url`, `minLength(n)`, `maxLength(n)`, `min(n)`, `max(n)`, `pastDate`, `composeValidators`.

Submit and Search buttons are disabled while `hasValidationErrors` is true (React Final Form render prop).

---

## Reference Data (Lookups)

`GET /api/lookups` returns departments, statuses, employment types, notification channels, relationships, access levels, and pay frequencies. The response is stored in the `lookups` Redux slice via `createAsyncThunk` with a condition guard that prevents duplicate fetches.

The Dashboard dispatches the fetch on mount so lookups are warm for all downstream pages. Components consume them via the `useLookups()` hook.

---

## Error Handling

The entire component tree is wrapped in a top-level `<ErrorBoundary>`. If any component throws during rendering, the boundary catches it and displays a recovery screen with "Try Again" and "Go to Dashboard" options instead of a blank page.

---

## Logging

All runtime logging goes through `createLogger(source)` from `src/utils/logger.js`. Each logger instance tags output with the source name (e.g., `[Auth]`, `[API]`).

In production builds (`import.meta.env.PROD`), `debug` and `info` are suppressed — only `warn` and `error` are emitted.

```js
import { createLogger } from '../utils/logger.js';
const log = createLogger('MyComponent');

log.info('loaded');              // silent in production
log.error('fetch failed', err);  // always emitted
```

---

## Folder Structure

```
├── index.html                        # Vite entry point
├── vite.config.js                    # Vite + Vitest configuration
├── .eslintrc.cjs                     # ESLint config
├── .env.example                      # Environment variable template
│
└── src/
    ├── App.jsx                       # Root component (providers, error boundary)
    ├── index.jsx                     # Entry point (React DOM render)
    ├── renderUtils.jsx               # Shared test helpers (buildStore, appMessages)
    ├── setupTests.js                 # Vitest setup (polyfills, MSW lifecycle)
    │
    ├── api/
    │   ├── axiosInstance.js          # Axios instance + auth/error interceptors
    │   ├── lookupsService.js         # GET /api/lookups
    │   ├── recordsService.js         # Records CRUD + search
    │   └── tests/
    │
    ├── store/
    │   ├── index.js                  # Redux store configuration
    │   └── slices/
    │       ├── authSlice.js          # Auth state (token, user, flags)
    │       └── lookupsSlice.js       # Reference data (fetched once)
    │
    ├── routes/
    │   ├── index.jsx                 # Route tree (public + protected)
    │   ├── ProtectedRoute.jsx        # Auth guard — redirects to /login
    │   └── tests/
    │
    ├── constants/
    │   └── routes.js                 # Centralized route path constants (ROUTES.DASHBOARD, etc.)
    │
    ├── assets/
    │   └── logo.svg                  # App logo (SVG)
    │
    ├── components/
    │   ├── AppLayout/                # Full-width header + collapsible sidebar shell
    │   ├── AuthInitializer/          # Bootstraps Okta auth on startup
    │   ├── Breadcrumbs/              # Shared breadcrumb bar
    │   ├── ErrorBoundary/            # Top-level error boundary
    │   └── fields/                   # React Final Form ↔ Ant Design adapters
    │       ├── AntField.jsx          # Base adapter (Field → Form.Item)
    │       ├── TextField.jsx
    │       ├── EmailField.jsx
    │       ├── PhoneField.jsx
    │       ├── SsnField.jsx
    │       ├── SelectField.jsx
    │       ├── TextAreaField.jsx
    │       ├── DateField.jsx
    │       ├── RadioGroupField.jsx
    │       ├── CheckboxGroupField.jsx
    │       ├── NumberField.jsx
    │       ├── CurrencyField.jsx
    │       ├── SwitchField.jsx
    │       ├── index.js              # Barrel export
    │       └── tests/
    │
    ├── pages/
    │   ├── Dashboard/                # Single Search Records button
    │   ├── LoginPage/                # SSO entry point
    │   ├── OktaCallback/             # Token exchange + redirect
    │   ├── Search/                   # Filter form → /results
    │   ├── Results/                  # Paginated table + New Record
    │   └── RecordDetail/             # Edit + Create form
    │       ├── RecordDetailPage.jsx
    │       └── sections/
    │           ├── PersonalInfo/
    │           ├── WorkInfo/
    │           ├── Preferences/
    │           ├── Compensation/
    │           ├── History/
    │           │   ├── HistorySection.jsx
    │           │   ├── EmergencyContacts/
    │           │   ├── Certifications/
    │           │   └── AuditTrail/
    │           └── Summary/
    │
    ├── hooks/
    │   ├── useAuth.js                # Okta client singleton + auth actions
    │   ├── useLookups.js             # Dispatches fetchLookups (condition-guarded)
    │   ├── useValidators.js          # Localized validator factories
    │   ├── useNavigationGuard.jsx    # Navigation guard context + hooks
    │   ├── useUnsavedChangesBlocker.js  # Browser close/refresh blocker
    │   └── tests/
    │
    ├── utils/
    │   ├── logger.js                 # Structured logger with level gating
    │   ├── validators.js             # Pure validator functions
    │   ├── validatorMessages.js      # i18n descriptors for validation errors
    │   └── tests/
    │
    ├── i18n/
    │   └── messages.js               # Aggregates all message descriptors
    │
    └── mocks/
        ├── data.js                   # In-memory DB (9 seed records + CRUD helpers)
        ├── handlers.js               # MSW request handlers
        ├── browser.js                # MSW Service Worker setup (dev)
        └── server.js                 # MSW Node server (Vitest)
```

Each page and section follows a consistent structure: component file, `messages.js` (i18n descriptors), and a `tests/` directory with collocated tests.

---

## Testing

Tests are collocated with their source files. Coverage thresholds are enforced at **60%** across all metrics (statements, branches, functions, lines) in `vite.config.js`.

```bash
npm test                    # single pass
npm run test:watch          # watch mode
npm run test:coverage       # with HTML + JSON coverage report (reports/coverage/)
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Vite dev server (default `http://localhost:5173`) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all tests (single pass) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check for lint errors (zero warnings policy) |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run lint:report` | Generate HTML + JSON lint reports (`reports/eslint/`) |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## Environment Variables

All variables are prefixed with `VITE_` and accessed via `import.meta.env` (Vite convention). See `.env.example` for a complete template with comments.

| Variable | Required | Description |
|---|---|---|
| `VITE_OKTA_ISSUER` | When `MOCK_AUTH=false` | Okta authorization server URL |
| `VITE_OKTA_CLIENT_ID` | When `MOCK_AUTH=false` | Okta OIDC client ID |
| `VITE_OKTA_REDIRECT_URI` | When `MOCK_AUTH=false` | Callback URL (must match Okta app config) |
| `VITE_OKTA_POST_LOGOUT_URI` | When `MOCK_AUTH=false` | Post-logout redirect URL |
| `VITE_API_BASE_URL` | When `ENABLE_MOCKS=false` | Backend base URL (e.g., `http://localhost:8080/api`) |
| `VITE_MOCK_AUTH` | No | Set `true` to bypass Okta and use a fake user |
| `VITE_ENABLE_MOCKS` | No | Set `true` to enable MSW mock API in development |

---

## Okta App Configuration

In your Okta Admin console:

1. Create a **Single-Page Application (SPA)** OIDC app
2. Set **Sign-in redirect URI** to match `VITE_OKTA_REDIRECT_URI` (e.g., `http://localhost:5173/login/callback`)
3. Set **Sign-out redirect URI** to match `VITE_OKTA_POST_LOGOUT_URI` (e.g., `http://localhost:5173`)
4. Enable **Authorization Code with PKCE** grant type
5. Add scopes: `openid`, `profile`, `email`
6. Copy the **Client ID** and your **Okta domain** to `.env`
