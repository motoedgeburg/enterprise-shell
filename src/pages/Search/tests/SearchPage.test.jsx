/**
 * SearchPage tests.
 *
 * Covers:
 *   - Page renders (title, fields, buttons)
 *   - Search button disabled when validation errors exist
 *   - Reset clears fields
 *   - Submit navigates to /results with correct query params
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { buildStore, appMessages, AUTHED_STATE } from '../../../renderUtils.jsx';
import SearchPage from '../SearchPage.jsx';

vi.mock('@okta/okta-auth-js', () => ({
  OktaAuth: class { constructor() {} },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Captures the URL the test navigated to
let capturedLocation = null;

function LocationCapture() {
  capturedLocation = useLocation();
  return null;
}

function renderSearch(lookupsOverrides = {}) {
  capturedLocation = null;
  const store = buildStore(AUTHED_STATE, {
    status: 'succeeded',
    departments: ['Engineering', 'Product', 'Design'],
    statuses: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    employmentTypes: [],
    notificationChannels: [],
    accessLevels: [],
    ...lookupsOverrides,
  });

  return render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
        <MemoryRouter initialEntries={['/search']}>
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/results" element={<LocationCapture />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </Provider>,
  );
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('SearchPage — rendering', () => {
  it('renders the page title', () => {
    renderSearch();
    expect(screen.getByText('Search Records')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderSearch();
    expect(screen.getByText(/Enter one or more criteria/i)).toBeInTheDocument();
  });

  it('renders the Name field', () => {
    renderSearch();
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('renders the Email field', () => {
    renderSearch();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders the Address field', () => {
    renderSearch();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('renders the Search button', () => {
    renderSearch();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('renders the Reset button', () => {
    renderSearch();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe('SearchPage — validation', () => {
  it('Search button is enabled with no input (all fields optional)', () => {
    renderSearch();
    expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled();
  });

  it('Search button is disabled when name is too short', async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByPlaceholderText(/alice johnson/i), 'a');
    await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled());
  });

  it('Search button is disabled when email is invalid', async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByPlaceholderText(/alice@company/i), 'notanemail');
    await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled());
  });

  it('Search button re-enables after fixing invalid email', async () => {
    const user = userEvent.setup();
    renderSearch();
    const emailInput = screen.getByPlaceholderText(/alice@company/i);
    await user.type(emailInput, 'notanemail');
    await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled());
    await user.clear(emailInput);
    await waitFor(() => expect(screen.getByRole('button', { name: /Search/i })).not.toBeDisabled());
  });
});

// ─── Submit ───────────────────────────────────────────────────────────────────

describe('SearchPage — submit', () => {
  it('navigates to /results on submit', async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.click(screen.getByRole('button', { name: /Search/i }));
    await waitFor(() => expect(capturedLocation).not.toBeNull());
    expect(capturedLocation.pathname).toBe('/results');
  });

  it('includes name in query params when filled', async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByPlaceholderText(/alice johnson/i), 'Alice');
    await user.click(screen.getByRole('button', { name: /Search/i }));
    await waitFor(() => expect(capturedLocation).not.toBeNull());
    expect(capturedLocation.search).toContain('name=Alice');
  });

  it('includes email in query params when filled', async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByPlaceholderText(/alice@company/i), 'alice@company.com');
    await user.click(screen.getByRole('button', { name: /Search/i }));
    await waitFor(() => expect(capturedLocation).not.toBeNull());
    expect(capturedLocation.search).toContain('email=alice%40company.com');
  });
});

// ─── Reset ────────────────────────────────────────────────────────────────────

describe('SearchPage — reset', () => {
  it('clears the name field on reset', async () => {
    const user = userEvent.setup();
    renderSearch();
    const nameInput = screen.getByPlaceholderText(/alice johnson/i);
    await user.type(nameInput, 'Alice');
    expect(nameInput.value).toBe('Alice');
    await user.click(screen.getByRole('button', { name: /Reset/i }));
    expect(nameInput.value).toBe('');
  });
});
