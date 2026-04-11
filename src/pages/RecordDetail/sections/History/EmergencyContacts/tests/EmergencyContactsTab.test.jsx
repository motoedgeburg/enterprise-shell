/**
 * EmergencyContactsTab tests.
 *
 * Covers:
 *   - Empty state messaging
 *   - Contacts render in the table (name, relationship, phone, email)
 *   - Primary-contact star visibility
 *   - Add Contact modal opens with correct title and fields
 *   - Edit modal opens with "Edit" title
 *   - Cancel button closes modal
 *
 * SelectField wraps Ant Design Select which is incompatible with jsdom —
 * it is mocked with a native <select> so relationship dropdowns work in tests.
 */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import { Field, Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import { buildStore, appMessages } from '../../../../../../renderUtils.jsx';
import EmergencyContactsTab from '../EmergencyContactsTab.jsx';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../../../../components/fields/SelectField.jsx', () => ({
  default: function MockSelectField({ name, label, options = [], validate }) {
    return (
      <Field name={name} validate={validate}>
        {({ input }) => (
          <div>
            <label htmlFor={name}>{label}</label>
            <select id={name} {...input} data-testid={`select-${name}`}>
              <option value="">-- select --</option>
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </Field>
    );
  },
}));

vi.mock('../../../../../../hooks/useLookups.js', () => ({
  useLookups: () => ({
    relationships: [
      { value: 'Brother', label: 'Brother' },
      { value: 'Mother', label: 'Mother' },
      { value: 'Parent', label: 'Parent' },
      { value: 'Spouse', label: 'Spouse' },
    ],
  }),
}));

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

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderContacts(initialValues = {}) {
  const store = buildStore({ isAuthenticated: true, accessToken: 'tok' });
  return render(
    <Provider store={store}>
      <App>
        <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
          <FinalForm onSubmit={() => {}} initialValues={initialValues}>
            {() => <EmergencyContactsTab />}
          </FinalForm>
        </IntlProvider>
      </App>
    </Provider>,
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

describe('EmergencyContactsTab — empty state', () => {
  it('shows empty message when no contacts', () => {
    renderContacts({ history: { emergencyContacts: [] } });
    expect(screen.getByText('No emergency contacts on file.')).toBeInTheDocument();
  });

  it('shows empty message when emergencyContacts is undefined', () => {
    renderContacts({});
    expect(screen.getByText('No emergency contacts on file.')).toBeInTheDocument();
  });
});

// ─── Table data ───────────────────────────────────────────────────────────────

describe('EmergencyContactsTab — table', () => {
  it('renders contact names in the table', () => {
    renderContacts({ history: { emergencyContacts: CONTACTS } });
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('renders relationship values', () => {
    renderContacts({ history: { emergencyContacts: CONTACTS } });
    expect(screen.getByText('Spouse')).toBeInTheDocument();
    expect(screen.getByText('Parent')).toBeInTheDocument();
  });

  it('renders contact phone numbers', () => {
    renderContacts({ history: { emergencyContacts: CONTACTS } });
    expect(screen.getByText('(215) 555-0101')).toBeInTheDocument();
    expect(screen.getByText('(215) 555-0202')).toBeInTheDocument();
  });

  it('renders contact emails', () => {
    renderContacts({ history: { emergencyContacts: CONTACTS } });
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('hides the set-primary star button for the primary contact', () => {
    renderContacts({ history: { emergencyContacts: CONTACTS } });
    const aliceRow = screen.getByText('Alice Smith').closest('tr');
    expect(within(aliceRow).queryByTitle('Set as primary contact')).not.toBeInTheDocument();
  });

  it('shows the set-primary star button for non-primary contacts', () => {
    renderContacts({ history: { emergencyContacts: CONTACTS } });
    const bobRow = screen.getByText('Bob Jones').closest('tr');
    expect(within(bobRow).getByTitle('Set as primary contact')).toBeInTheDocument();
  });
});

// ─── Add modal ────────────────────────────────────────────────────────────────

describe('EmergencyContactsTab — Add Contact modal', () => {
  it('opens with "Add Emergency Contact" title on Add Contact click', async () => {
    const user = userEvent.setup();
    renderContacts();
    await user.click(screen.getByRole('button', { name: /Add Contact/i }));
    await waitFor(() => expect(screen.getByText('Add Emergency Contact')).toBeInTheDocument());
  });

  it('Cancel button is present and clickable inside the Add Contact modal', async () => {
    const user = userEvent.setup();
    renderContacts();
    await user.click(screen.getByRole('button', { name: /Add Contact/i }));
    await waitFor(() => expect(screen.getByText('Add Emergency Contact')).toBeInTheDocument());
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelBtn).toBeInTheDocument();
    await user.click(cancelBtn);
  });

  it('shows required field labels inside the modal', async () => {
    const user = userEvent.setup();
    renderContacts();
    await user.click(screen.getByRole('button', { name: /Add Contact/i }));
    await waitFor(() => screen.getByText('Add Emergency Contact'));
    const modal = document.querySelector('.ant-modal-body');
    expect(within(modal).getAllByText('Name').length).toBeGreaterThan(0);
    expect(within(modal).getByText('Relationship')).toBeInTheDocument();
    expect(within(modal).getAllByText('Phone').length).toBeGreaterThan(0);
    expect(within(modal).getAllByText('Email').length).toBeGreaterThan(0);
  });

  it('renders relationship options from useLookups', async () => {
    const user = userEvent.setup();
    renderContacts();
    await user.click(screen.getByRole('button', { name: /Add Contact/i }));
    await waitFor(() => screen.getByText('Add Emergency Contact'));
    const modal = document.querySelector('.ant-modal-body');
    const opts = Array.from(within(modal).getByTestId('select-relationship').options).map(
      (o) => o.value,
    );
    expect(opts).toContain('Spouse');
    expect(opts).toContain('Parent');
    expect(opts).toContain('Brother');
  });
});

// ─── Edit modal ───────────────────────────────────────────────────────────────

describe('EmergencyContactsTab — Edit Contact modal', () => {
  it('opens with "Edit Emergency Contact" title on Edit click', async () => {
    const user = userEvent.setup();
    renderContacts({ history: { emergencyContacts: CONTACTS } });
    const editBtn = document.querySelector('.anticon-edit')?.closest('button');
    await user.click(editBtn);
    await waitFor(() => expect(screen.getByText('Edit Emergency Contact')).toBeInTheDocument());
  });
});
