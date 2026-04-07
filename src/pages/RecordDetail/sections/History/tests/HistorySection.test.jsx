/**
 * HistorySection tests.
 *
 * Covers:
 *   - Tab labels render (Emergency Contacts, Professional Certifications)
 *   - Empty state for each tab
 *   - Contacts and certifications render in their tables
 *   - Add Contact / Add Certification buttons open modals with correct titles
 *   - Edit button opens modal with "Edit" title
 *   - Cancelling a modal closes it
 *   - Certification status tags: Active, Expired, No Expiry
 *   - Set-primary star button hidden for the primary contact
 *
 * HistorySection uses Ant Design Modal, Table, Tabs, and Select.
 * Modals render in the document body via portals — wrapping with antd <App>
 * is required so static methods and portals resolve correctly.
 * The ant Select (relationship) and DatePicker are only inside modals;
 * we open and cancel modals without submitting to avoid jsdom incompatibility.
 */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../renderUtils.jsx';
import HistorySection from '../HistorySection.jsx';

// ─── Seed data ────────────────────────────────────────────────────────────────

const CONTACTS = [
  {
    id: 'ec-1',
    name: 'Alice Smith',
    relationship: 'Spouse',
    phone: '(215) 555-0101',
    email: 'alice@example.com',
    isPrimary: true,
  },
  {
    id: 'ec-2',
    name: 'Bob Jones',
    relationship: 'Parent',
    phone: '(215) 555-0202',
    email: 'bob@example.com',
    isPrimary: false,
  },
];

const CERTS = [
  {
    id: 'cert-1',
    name: 'AWS Solutions Architect',
    issuingBody: 'Amazon Web Services',
    issueDate: '2022-01-15',
    expiryDate: '2030-01-15', // future → Active
    credentialId: 'AWS-123',
  },
  {
    id: 'cert-2',
    name: 'Expired Cert',
    issuingBody: 'Old Body',
    issueDate: '2018-01-01',
    expiryDate: '2020-01-01', // past → Expired
  },
  {
    id: 'cert-3',
    name: 'No Expiry Cert',
    issuingBody: 'Eternal Inc.',
    issueDate: '2021-06-01',
    expiryDate: null, // → No Expiry
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderSection(initialValues = {}) {
  return render(
    <App>
      <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
        <FinalForm onSubmit={() => {}} initialValues={initialValues}>
          {() => <HistorySection />}
        </FinalForm>
      </IntlProvider>
    </App>,
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

  it('shows the Emergency Contacts tab content by default', () => {
    renderSection();
    expect(screen.getByRole('button', { name: /Add Contact/i })).toBeInTheDocument();
  });
});

// ─── Emergency Contacts — empty state ────────────────────────────────────────

describe('HistorySection — contacts empty state', () => {
  it('shows empty message when no contacts', () => {
    renderSection({ emergencyContacts: [] });
    expect(screen.getByText('No emergency contacts on file.')).toBeInTheDocument();
  });

  it('shows empty message when emergencyContacts is undefined', () => {
    renderSection({});
    expect(screen.getByText('No emergency contacts on file.')).toBeInTheDocument();
  });
});

// ─── Emergency Contacts — table data ─────────────────────────────────────────

describe('HistorySection — contacts table', () => {
  it('renders contact names in the table', () => {
    renderSection({ emergencyContacts: CONTACTS });
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('renders relationship values', () => {
    renderSection({ emergencyContacts: CONTACTS });
    expect(screen.getByText('Spouse')).toBeInTheDocument();
    expect(screen.getByText('Parent')).toBeInTheDocument();
  });

  it('renders contact phone numbers', () => {
    renderSection({ emergencyContacts: CONTACTS });
    expect(screen.getByText('(215) 555-0101')).toBeInTheDocument();
    expect(screen.getByText('(215) 555-0202')).toBeInTheDocument();
  });

  it('renders contact emails', () => {
    renderSection({ emergencyContacts: CONTACTS });
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('hides the set-primary star button for the primary contact', () => {
    renderSection({ emergencyContacts: CONTACTS });
    // Alice is primary — her row should not have a "Set as primary" button.
    // Bob's row should have it (not primary).
    const aliceRow = screen.getByText('Alice Smith').closest('tr');
    expect(within(aliceRow).queryByTitle('Set as primary contact')).not.toBeInTheDocument();
  });

  it('shows the set-primary star button for non-primary contacts', () => {
    renderSection({ emergencyContacts: CONTACTS });
    const bobRow = screen.getByText('Bob Jones').closest('tr');
    expect(within(bobRow).getByTitle('Set as primary contact')).toBeInTheDocument();
  });
});

// ─── Emergency Contacts — Add modal ──────────────────────────────────────────

describe('HistorySection — Add Contact modal', () => {
  it('opens with "Add Emergency Contact" title on Add Contact click', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole('button', { name: /Add Contact/i }));
    await waitFor(() => expect(screen.getByText('Add Emergency Contact')).toBeInTheDocument());
  });

  it('closes the modal when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole('button', { name: /Add Contact/i }));
    await waitFor(() => screen.getByText('Add Emergency Contact'));
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() =>
      expect(screen.queryByText('Add Emergency Contact')).not.toBeInTheDocument(),
    );
  });

  it('shows required field labels inside the modal', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByRole('button', { name: /Add Contact/i }));
    await waitFor(() => screen.getByText('Add Emergency Contact'));
    // Check form labels inside the modal
    const modal = document.querySelector('.ant-modal-body');
    expect(within(modal).getAllByText('Name').length).toBeGreaterThan(0);
    expect(within(modal).getByText('Relationship')).toBeInTheDocument();
    expect(within(modal).getAllByText('Phone').length).toBeGreaterThan(0);
    expect(within(modal).getAllByText('Email').length).toBeGreaterThan(0);
  });
});

// ─── Emergency Contacts — Edit modal ─────────────────────────────────────────

describe('HistorySection — Edit Contact modal', () => {
  it('opens with "Edit Emergency Contact" title on Edit click', async () => {
    const user = userEvent.setup();
    renderSection({ emergencyContacts: CONTACTS });
    // Icon-only buttons have no accessible name — find via icon class
    const editBtn = document.querySelector('.anticon-edit')?.closest('button');
    await user.click(editBtn);
    await waitFor(() => expect(screen.getByText('Edit Emergency Contact')).toBeInTheDocument());
  });
});

// ─── Certifications tab ───────────────────────────────────────────────────────

describe('HistorySection — certifications tab', () => {
  async function switchToCerts(user) {
    await user.click(screen.getByRole('tab', { name: /Professional Certifications/i }));
  }

  it('shows Add Certification button after switching tabs', async () => {
    const user = userEvent.setup();
    renderSection();
    await switchToCerts(user);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Add Certification/i })).toBeInTheDocument(),
    );
  });

  it('shows empty message when no certifications', async () => {
    const user = userEvent.setup();
    renderSection({ certifications: [] });
    await switchToCerts(user);
    await waitFor(() => expect(screen.getByText('No certifications on file.')).toBeInTheDocument());
  });

  it('renders certification names in the table', async () => {
    const user = userEvent.setup();
    renderSection({ certifications: CERTS });
    await switchToCerts(user);
    await waitFor(() => expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument());
    expect(screen.getByText('Expired Cert')).toBeInTheDocument();
    expect(screen.getByText('No Expiry Cert')).toBeInTheDocument();
  });

  it('renders credential ID as secondary text', async () => {
    const user = userEvent.setup();
    renderSection({ certifications: CERTS });
    await switchToCerts(user);
    await waitFor(() => screen.getByText('AWS Solutions Architect'));
    expect(screen.getByText('ID: AWS-123')).toBeInTheDocument();
  });

  it('shows Active tag for cert with future expiry', async () => {
    const user = userEvent.setup();
    renderSection({ certifications: CERTS });
    await switchToCerts(user);
    await waitFor(() => screen.getByText('AWS Solutions Architect'));
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows Expired tag for cert with past expiry', async () => {
    const user = userEvent.setup();
    renderSection({ certifications: CERTS });
    await switchToCerts(user);
    await waitFor(() => screen.getByText('Expired Cert'));
    expect(screen.getByText('Expired')).toBeInTheDocument();
  });

  it('shows No Expiry tag for cert with no expiry date', async () => {
    const user = userEvent.setup();
    renderSection({ certifications: CERTS });
    await switchToCerts(user);
    await waitFor(() => screen.getByText('No Expiry Cert'));
    expect(screen.getByText('No Expiry')).toBeInTheDocument();
  });

  it('opens Add Certification modal with correct title', async () => {
    const user = userEvent.setup();
    renderSection();
    await switchToCerts(user);
    // Both tab panels render; pick the visible "Add Certification" button
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /Add Certification/i }).length).toBeGreaterThan(
        0,
      ),
    );
    const addBtn = screen.getAllByRole('button', { name: /Add Certification/i })[0];
    await user.click(addBtn);
    // Scope to the modal title div to avoid matching the button text
    await waitFor(() =>
      expect(document.querySelector('.ant-modal-title')).toHaveTextContent('Add Certification'),
    );
  });

  it('closes the certification modal on Cancel', async () => {
    const user = userEvent.setup();
    renderSection();
    await switchToCerts(user);
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /Add Certification/i }).length).toBeGreaterThan(
        0,
      ),
    );
    await user.click(screen.getAllByRole('button', { name: /Add Certification/i })[0]);
    await waitFor(() =>
      expect(document.querySelector('.ant-modal-title')).toHaveTextContent('Add Certification'),
    );
    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() => expect(document.querySelector('.ant-modal-title')).not.toBeInTheDocument());
  });
});
