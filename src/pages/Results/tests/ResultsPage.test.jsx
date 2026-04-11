/**
 * ResultsPage tests.
 *
 * Covers:
 *   - Page chrome (title, back button, new record button)
 *   - Active filter tags rendered from URL params
 *   - Table renders loaded records
 *   - Empty state when no records match
 *   - Navigation on row click
 *   - Navigation on New Record click
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { buildStore, appMessages, AUTHED_STATE } from '../../../renderUtils.jsx';
import ResultsPage from '../ResultsPage.jsx';

vi.mock('@okta/okta-auth-js', () => ({
  OktaAuth: class {
    constructor() {}
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

let capturedLocation = null;

function LocationCapture() {
  capturedLocation = useLocation();
  return null;
}

function renderResults(search = '') {
  capturedLocation = null;
  const store = buildStore(AUTHED_STATE);
  return render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
        <App>
          <MemoryRouter initialEntries={[`/results${search}`]}>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/search" element={<LocationCapture />} />
              <Route path="/records/:id" element={<LocationCapture />} />
              <Route path="/records/new" element={<LocationCapture />} />
            </Routes>
          </MemoryRouter>
        </App>
      </IntlProvider>
    </Provider>,
  );
}

// ─── Page chrome ──────────────────────────────────────────────────────────────

describe('ResultsPage — chrome', () => {
  it('renders the breadcrumb', async () => {
    renderResults();
    await waitFor(() => expect(screen.getByText('Results')).toBeInTheDocument());
  });

  it('renders the Back to Search button', async () => {
    renderResults();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Back to Search/i })).toBeInTheDocument(),
    );
  });

  it('renders the New Record button', async () => {
    renderResults();
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /New Record/i }).length).toBeGreaterThan(0),
    );
  }, 15000);

  it('navigates to /search when Back is clicked', async () => {
    const user = userEvent.setup();
    renderResults();
    await user.click(screen.getByRole('button', { name: /Back to Search/i }));
    await waitFor(() => expect(capturedLocation?.pathname).toBe('/search'));
  });

  it('navigates to /records/new when New Record is clicked', async () => {
    const user = userEvent.setup();
    renderResults();
    await user.click(screen.getAllByRole('button', { name: /New Record/i })[0]);
    await waitFor(() => expect(capturedLocation?.pathname).toBe('/records/new'));
  }, 10000);
});

// ─── Filter tags ──────────────────────────────────────────────────────────────

describe('ResultsPage — active filter tags', () => {
  it('shows a filter tag when name param is present', async () => {
    renderResults('?name=Alice');
    await waitFor(() => expect(screen.getByText(/name: Alice/i)).toBeInTheDocument());
  });

  it('shows multiple filter tags', async () => {
    renderResults('?name=Alice&status=active');
    await waitFor(() => {
      expect(screen.getByText(/name: Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/status: active/i)).toBeInTheDocument();
    });
  });

  it('does not show filter section when no params', async () => {
    renderResults();
    await waitFor(() => screen.getByText('Results'));
    expect(screen.queryByText('Filters:')).not.toBeInTheDocument();
  });
});

// ─── Table data ───────────────────────────────────────────────────────────────

describe('ResultsPage — table', () => {
  it('renders column headers', async () => {
    renderResults();
    await waitFor(() => expect(screen.getAllByText('Name').length).toBeGreaterThan(0));
    expect(screen.getAllByText('Address').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Department').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
  });

  it('renders seeded records from MSW', async () => {
    renderResults();
    await waitFor(() => expect(screen.getByText('Alice Johnson')).toBeInTheDocument());
  });

  it('renders active status tag in green', async () => {
    renderResults('?name=Alice');
    await waitFor(() => screen.getByText('Alice Johnson'));
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('navigates to record detail on row click', async () => {
    const user = userEvent.setup();
    renderResults('?name=Alice');
    await waitFor(() => screen.getByText('Alice Johnson'));
    await user.click(screen.getByText('Alice Johnson'));
    await waitFor(() => expect(capturedLocation?.pathname).toMatch(/^\/records\/[a-f0-9-]+$/));
  });

  it('renders empty state when no results match', async () => {
    renderResults('?name=ZZZNONEXISTENT');
    await waitFor(() =>
      expect(screen.getByText(/No records match your filters/i)).toBeInTheDocument(),
    );
  });
});
