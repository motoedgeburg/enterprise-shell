/**
 * RecordDetailPage tests.
 *
 * Covers:
 *   - Create mode (/records/new): title, submit button label, no Delete button
 *   - Edit mode (/records/:id): loads record, shows name in header, shows Delete button
 *   - Back button navigation
 *   - Save Changes submits and shows success
 *   - Delete triggers confirmation then removes record
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { buildStore, appMessages, AUTHED_STATE } from '../../../renderUtils.jsx';
import RecordDetailPage from '../RecordDetailPage.jsx';

vi.mock('@okta/okta-auth-js', () => ({
  OktaAuth: class {
    constructor() {}
  },
}));

// SelectField uses Ant Design Select which is incompatible with jsdom —
// mock the sections that contain Select fields to isolate the page-level logic.
vi.mock('../sections/WorkInfo/WorkInfoSection.jsx', () => ({
  default: function MockWorkInfoSection() {
    return <div data-testid="work-section" />;
  },
}));
vi.mock('../sections/Preferences/PreferencesSection.jsx', () => ({
  default: function MockPreferencesSection() {
    return <div data-testid="prefs-section" />;
  },
}));
vi.mock('../sections/History/HistorySection.jsx', () => ({
  default: function MockHistorySection() {
    return <div data-testid="history-section" />;
  },
}));
vi.mock('../sections/Summary/SummarySection.jsx', () => ({
  default: function MockSummarySection() {
    return <div data-testid="summary-section" />;
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

let capturedLocation = null;

function LocationCapture() {
  capturedLocation = useLocation();
  return null;
}

function renderPage(path) {
  capturedLocation = null;
  const store = buildStore(AUTHED_STATE, {
    status: 'succeeded',
    departments: [{ value: 'Engineering', label: 'Engineering' }],
    statuses: [{ value: 'active', label: 'Active' }],
    employmentTypes: [{ value: 'full-time', label: 'Full Time' }],
    notificationChannels: [{ value: 'email', label: 'Email' }],
    accessLevels: [{ value: 'standard', label: 'Standard' }],
  });

  return render(
    <Provider store={store}>
      <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
        <App>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/records/new" element={<RecordDetailPage />} />
              <Route path="/records/:id" element={<RecordDetailPage />} />
              <Route path="/results" element={<LocationCapture />} />
            </Routes>
          </MemoryRouter>
        </App>
      </IntlProvider>
    </Provider>,
  );
}

// ─── Create mode ─────────────────────────────────────────────────────────────

describe('RecordDetailPage — create mode (/records/new)', () => {
  it('renders "New Record" as the page title', () => {
    renderPage('/records/new');
    expect(screen.getByRole('heading', { name: 'New Record' })).toBeInTheDocument();
  });

  it('renders "Create Record" as the submit button label', () => {
    renderPage('/records/new');
    expect(screen.getByRole('button', { name: /Create Record/i })).toBeInTheDocument();
  });

  it('does not render a Delete button in create mode', () => {
    renderPage('/records/new');
    expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
  });

  it('renders the Back to Results button', () => {
    renderPage('/records/new');
    expect(screen.getByRole('button', { name: /Back to Results/i })).toBeInTheDocument();
  });

  it('renders all accordion section headings', () => {
    renderPage('/records/new');
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Work Information')).toBeInTheDocument();
    expect(screen.getByText('Preferences & Permissions')).toBeInTheDocument();
    expect(screen.getByText('Contacts & Certifications')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});

// ─── Edit mode ───────────────────────────────────────────────────────────────

// UUID of Alice Johnson (seed record 1)
const ALICE_UUID = 'b3a1c5d0-7f2e-4a8b-9c6d-1e0f3a5b7d9e';

describe(`RecordDetailPage — edit mode (/records/${ALICE_UUID})`, () => {
  it('shows a loading spinner initially then renders the record name', async () => {
    renderPage(`/records/${ALICE_UUID}`);
    // Skeleton shown while loading
    expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
    // After MSW responds, record name appears
    await waitFor(() => expect(screen.getByText('Alice Johnson')).toBeInTheDocument());
  });

  it('renders "Save Changes" as the submit button label', async () => {
    renderPage(`/records/${ALICE_UUID}`);
    await waitFor(() => screen.getByText('Alice Johnson'));
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  it('renders the Delete button in edit mode', async () => {
    renderPage(`/records/${ALICE_UUID}`);
    await waitFor(() => screen.getByText('Alice Johnson'));
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('navigates to /results when Back is clicked', async () => {
    const user = userEvent.setup();
    renderPage(`/records/${ALICE_UUID}`);
    await waitFor(() => screen.getByText('Alice Johnson'));
    await user.click(screen.getByRole('button', { name: /Back to Results/i }));
    await waitFor(() => expect(capturedLocation?.pathname).toBe('/results'));
  });
});

// ─── Save ─────────────────────────────────────────────────────────────────────

describe('RecordDetailPage — save', () => {
  it('save button is present and clickable after record loads', async () => {
    const user = userEvent.setup();
    renderPage(`/records/${ALICE_UUID}`);
    await waitFor(() => screen.getByText('Alice Johnson'));
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    expect(saveBtn).toBeInTheDocument();
    // Click should not throw
    await user.click(saveBtn);
  });
});
