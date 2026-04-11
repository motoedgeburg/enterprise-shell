/**
 * HistorySection tests.
 *
 * Covers tab labels and default tab selection only.
 * Component-specific tests live in:
 *   - EmergencyContacts/tests/EmergencyContactsTab.test.jsx
 *   - Certifications/tests/CertificationsTab.test.jsx
 *   - EmploymentTimeline/tests/EmploymentTimeline.test.jsx
 */
import { render, screen } from '@testing-library/react';
import { App } from 'antd';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { buildStore, appMessages } from '../../../../../renderUtils.jsx';
import HistorySection from '../HistorySection.jsx';

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderSection(initialValues = {}) {
  const store = buildStore({ isAuthenticated: true, accessToken: 'tok' });
  return render(
    <Provider store={store}>
      <App>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <FinalForm onSubmit={() => {}} initialValues={initialValues}>
            {() => <HistorySection />}
          </FinalForm>
        </IntlProvider>
      </App>
    </Provider>,
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

describe('HistorySection — tabs', () => {
  it('renders Emergency Contacts tab label', () => {
    renderSection();
    expect(screen.getByRole('tab', { name: /Emergency Contacts/i })).toBeInTheDocument();
  });

  it('renders Professional Certifications tab label', () => {
    renderSection();
    expect(screen.getByRole('tab', { name: /Professional Certifications/i })).toBeInTheDocument();
  });

  it('renders Employment Timeline tab label', () => {
    renderSection();
    expect(screen.getByRole('tab', { name: /Employment Timeline/i })).toBeInTheDocument();
  });

  it('shows the Emergency Contacts tab content by default', () => {
    renderSection();
    expect(screen.getByRole('button', { name: /Add Contact/i })).toBeInTheDocument();
  });
});
