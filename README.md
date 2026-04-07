# Enterprise Shell

A production-grade React enterprise application shell with Okta SSO, Redux Toolkit, Ant Design, Axios, React Final Form, and MSW.

---

## Tech Stack

| Concern | Library |
|---|---|
| UI framework | [Ant Design 5](https://ant.design) with ConfigProvider theming |
| Routing | [React Router v6](https://reactrouter.com) |
| Global state | [Redux Toolkit](https://redux-toolkit.js.org) |
| HTTP client | [Axios](https://axios-http.com) with centralized interceptors |
| Forms | [React Final Form](https://final-form.org/react) + typed Ant Design field components |
| Validation | Composable validator functions + `useValidators` hook (react-intl aware) |
| Authentication | [Okta](https://okta.com) via `@okta/okta-auth-js` (PKCE flow) |
| API mocking | [MSW v2](https://mswjs.io) (browser + Node) |
| i18n | [react-intl](https://formatjs.io/docs/react-intl) — all strings in message descriptor files |
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
├── App.jsx
├── index.jsx
├── renderUtils.jsx               # Shared test helpers (buildStore, appMessages, fixtures)
├── setupTests.js                 # Jest setup (polyfills, MSW lifecycle, jsdom stubs)
├── setupPolyfills.js
│
├── api/
│   ├── axiosInstance.js          # Centralized Axios instance with interceptors
│   ├── lookupsService.js         # Reference data (departments, statuses, etc.)
│   ├── recordsService.js         # Records CRUD + search
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
│   ├── AppLayout.jsx             # Dark sidebar + header shell (Ant Design Layout)
│   ├── messages.js               # i18n descriptors for shell chrome
│   ├── fields/                   # Typed React Final Form ↔ Ant Design field components
│   │   ├── AntField.jsx          # Base adapter (Field → Form.Item)
│   │   ├── TextField.jsx
│   │   ├── EmailField.jsx
│   │   ├── PhoneField.jsx        # Auto-formats to (NXX) NXX-XXXX as user types
│   │   ├── SsnField.jsx          # Masked input, auto-formats to XXX-XX-XXXX
│   │   ├── SelectField.jsx
│   │   ├── TextAreaField.jsx
│   │   ├── DateField.jsx         # ISO string ↔ dayjs conversion
│   │   ├── RadioGroupField.jsx
│   │   ├── CheckboxGroupField.jsx
│   │   ├── SwitchField.jsx
│   │   └── index.js              # Barrel export
│   └── tests/
│       ├── AppLayout.test.jsx
│       └── fields/
│           ├── PhoneField.test.jsx
│           └── SsnField.test.jsx
│
├── pages/
│   ├── messages.js               # Shared page messages (Dashboard, Login, Callback)
│   ├── Dashboard/
│   │   ├── Dashboard.jsx         # Welcome + centered Search tile
│   │   └── tests/
│   │       └── Dashboard.test.jsx
│   ├── LoginPage/
│   │   ├── LoginPage.jsx         # SSO entry point (no credentials form)
│   │   └── tests/
│   │       └── LoginPage.test.jsx
│   ├── OktaCallback/
│   │   ├── OktaCallback.jsx      # Token exchange + Redux dispatch
│   │   └── tests/
│   │       └── OktaCallback.test.jsx
│   ├── Search/
│   │   ├── SearchPage.jsx        # Filter form → navigate to /results
│   │   ├── messages.js
│   │   └── tests/
│   │       └── SearchPage.test.jsx
│   ├── Results/
│   │   ├── ResultsPage.jsx       # Paginated table; New Record → /records/new
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
│           │   ├── HistorySection.jsx    # Emergency Contacts + Certifications tabs
│           │   ├── messages.js
│           │   └── tests/
│           │       └── HistorySection.test.jsx
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
│   ├── validators.js             # Pure validator functions (no strings)
│   ├── validatorMessages.js      # i18n descriptors for validation errors
│   └── tests/
│       └── validators.test.js
│
└── mocks/
    ├── data.js                   # In-memory DB (8 seed records + search/CRUD helpers)
    ├── handlers.js               # MSW handlers: /api/lookups, /api/records
    ├── browser.js                # MSW Service Worker (dev)
    └── server.js                 # MSW Node server (Jest)
```

---

## Field Components

All form fields are typed wrappers that bridge React Final Form's `<Field>` to Ant Design inputs. They handle value/onChange/onBlur, touched+error display, and forward a `validate` prop to Final Form.

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

## Cross-Section Form Dependencies

`RecordDetailPage` uses `useFormState` + `useForm` inside section components to enforce business rules across accordion panels. Enforced values are written back via `form.change()` so the submitted payload is always consistent.

| Trigger (section) | Effect (section) | Behaviour |
|---|---|---|
| `status = inactive` (Work) | `accessLevel` (Preferences) | Forced to `read-only`; field disabled |
| `status = inactive` (Work) | `notificationsEnabled`, `notificationChannels` (Preferences) | Disabled |
| `employmentType = intern` (Work) | `remoteEligible` (Preferences) | Forced to `false`; field disabled |
| `accessLevel = admin` (Preferences) | `status` (Work) | Forced to `active`; field disabled |

Each active constraint surfaces an inline `Alert` inside the affected section explaining why the field is locked.

---

## Record Detail Accordion

The accordion has five sections. Each section is self-contained with its own `messages.js`:

| Section | Key fields |
|---|---|
| Personal Information | Name, email, phone (auto-formatted), SSN (masked), address, DOB, bio |
| Work Information | Job title, department, status, employment type, start date, manager |
| Preferences & Permissions | Remote eligibility, notifications, channels, access level, notes |
| Contacts & Certifications | Emergency contacts tab + Professional certifications tab (full CRUD) |
| Summary | Read-only live preview via `FormSpy` |

The **Contacts & Certifications** section contains two tabbed grids:
- **Emergency Contacts** — add/edit/delete contacts; star icon marks the primary contact
- **Professional Certifications** — add/edit/delete certifications; expiry status shown as Active / Expired / No Expiry tag

---

## i18n Message Organization

Each section owns its messages file, co-located with the component:

| File | Scope |
|---|---|
| `src/pages/messages.js` | Dashboard, Login, Callback strings |
| `src/components/messages.js` | App shell (header, sidebar) |
| `src/utils/validatorMessages.js` | Validation error strings |
| `RecordDetail/messages.js` | Page chrome, section headings, delete/submit actions |
| `sections/PersonalInfo/messages.js` | Personal field labels |
| `sections/WorkInfo/messages.js` | Work fields, employment types, statuses |
| `sections/Preferences/messages.js` | Preference fields, channel/access options, constraints |
| `sections/History/messages.js` | Contact and certification labels and actions |
| `sections/Summary/messages.js` | Summary-specific strings |

---

## Reference Data (Lookups)

`GET /api/lookups` returns departments, statuses, employment types, notification channels, and access levels. The response is stored in the `lookups` Redux slice via `createAsyncThunk` with a condition guard that prevents duplicate fetches.

`Dashboard` dispatches the fetch on mount so lookups are warm for all downstream pages. Components consume them via the `useLookups()` hook.

---

## MSW Mock API

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/lookups` | Reference data (departments, statuses, etc.) |
| `GET` | `/api/records` | Paginated + filtered list |
| `GET` | `/api/records/:id` | Single record |
| `POST` | `/api/records` | Create (returns 201) |
| `PUT` | `/api/records/:id` | Update |
| `DELETE` | `/api/records/:id` | Delete (returns 204) |

Enable mocks in dev: `REACT_APP_ENABLE_MOCKS=true npm start`

---

## Tests

368 tests across 21 suites, collocated with their source files. Coverage: **85% statements / 79% branches / 81% functions**.

```bash
npm test                   # single pass
npm run test:watch         # watch mode
npm test -- --coverage     # with coverage report
```

Coverage thresholds (enforced in `package.json`): 60% across all metrics.

Key patterns:

- **MSW v2** intercepts all Axios requests in Jest via the Node server. Axios is forced onto the `fetch` adapter in `setupTests.js` so MSW's interceptor applies.
- **Okta** is mocked via `jest.mock('@okta/okta-auth-js')` using a `global.__oktaMock` pattern to avoid Babel hoisting issues.
- **IS_MOCK_MODE** tests live in separate `*.mock.test.js` files that use `require()` so the env var is set before any module loads.
- **Ant Design Select / Switch / CheckboxGroup** incompatibility with jsdom is handled by mocking the custom field components at the test boundary with native equivalents that integrate with React Final Form's `<Field>` render prop.
- **Ant Design DatePicker** inside modals is avoided by opening and cancelling modals without submitting, keeping tests fast and jsdom-safe.
- **`fireEvent.change` + `fireEvent.blur`** is used instead of `userEvent.type` when pasting long strings (e.g. bio maxLength) to avoid Jest's 5 s timeout.
- **`renderUtils.jsx`** at `src/` root provides `buildStore`, `appMessages`, `MOCK_USER`, and `AUTHED_STATE` for all test suites.

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

## Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_OKTA_ISSUER` | Okta authorization server URL |
| `REACT_APP_OKTA_CLIENT_ID` | Okta OIDC client ID |
| `REACT_APP_OKTA_REDIRECT_URI` | Callback URL (must match Okta app config) |
| `REACT_APP_OKTA_POST_LOGOUT_URI` | Post-logout redirect URL |
| `REACT_APP_API_BASE_URL` | Backend base URL |
| `REACT_APP_ENABLE_MOCKS` | Set `true` to enable MSW in development |
