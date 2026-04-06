/**
 * RecordFormModal tests.
 *
 * Tests cover:
 *   - Title changes between Add / Edit modes
 *   - Form fields are present and pre-populated in edit mode
 *   - Validation errors appear after a submit attempt with missing fields
 *   - onSubmit callback is called with correct values on valid submission
 *   - onCancel callback is invoked when Cancel is clicked
 *   - Submit button label changes between Create / Save Changes
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../tests/renderUtils.jsx';
import RecordFormModal from '../RecordFormModal.jsx';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SAMPLE_RECORD = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@company.com',
  department: 'Engineering',
  status: 'active',
};

function renderModal({ open = true, record = null, onSubmit = jest.fn(), onCancel = jest.fn() } = {}) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <App>
        <RecordFormModal open={open} record={record} onSubmit={onSubmit} onCancel={onCancel} />
      </App>
    </IntlProvider>,
  );
}

// ─── Modal visibility ─────────────────────────────────────────────────────────

describe('RecordFormModal — visibility', () => {
  it('renders nothing when open=false', () => {
    renderModal({ open: false });
    expect(screen.queryByText('Add Record')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit Record')).not.toBeInTheDocument();
  });
});

// ─── Add mode ─────────────────────────────────────────────────────────────────

describe('RecordFormModal — add mode', () => {
  it('renders "Add Record" as the modal title', () => {
    renderModal();
    expect(screen.getByText('Add Record')).toBeInTheDocument();
  });

  it('renders the Create submit button', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders all four form field labels', () => {
    renderModal();
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('name input starts empty', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Jane Doe')).toHaveValue('');
  });
});

// ─── Edit mode ────────────────────────────────────────────────────────────────

describe('RecordFormModal — edit mode', () => {
  it('renders "Edit Record" as the modal title', () => {
    renderModal({ record: SAMPLE_RECORD });
    expect(screen.getByText('Edit Record')).toBeInTheDocument();
  });

  it('renders the Save Changes submit button', () => {
    renderModal({ record: SAMPLE_RECORD });
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('pre-populates the name field', () => {
    renderModal({ record: SAMPLE_RECORD });
    expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument();
  });

  it('pre-populates the email field', () => {
    renderModal({ record: SAMPLE_RECORD });
    expect(screen.getByDisplayValue('alice@company.com')).toBeInTheDocument();
  });
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe('RecordFormModal — validation', () => {
  it('shows name required error when name is cleared and submitted', async () => {
    const user = userEvent.setup();
    renderModal();

    // Clear name (starts empty) then click Create to trigger validation
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('shows email required error when email is empty and submitted', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('shows invalid email error for a malformed email', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByPlaceholderText('Jane Doe'), 'Test Name');
    await user.type(screen.getByPlaceholderText('jane.doe@company.com'), 'not-an-email');

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    });
  });
});

// ─── Callbacks ────────────────────────────────────────────────────────────────

describe('RecordFormModal — callbacks', () => {
  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    renderModal({ onCancel });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when the form is pre-populated (edit mode) and saved', async () => {
    // Testing onSubmit via edit mode avoids the need to interact with Ant Design
    // Select dropdowns in jsdom, which don't reliably propagate value changes.
    // Edit mode pre-populates all fields from the record prop.
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    renderModal({ record: SAMPLE_RECORD, onSubmit });

    // Change the name so the form is no longer pristine (Save Changes is enabled)
    const nameInput = screen.getByDisplayValue('Alice Johnson');
    await user.clear(nameInput);
    await user.type(nameInput, 'Alice Updated');

    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(
      () => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Alice Updated',
            email: 'alice@company.com',
            department: 'Engineering',
            status: 'active',
          }),
          expect.anything(), // React Final Form passes the form API as second arg
          expect.anything(), // and a callback as third arg
        );
      },
      { timeout: 3000 },
    );
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe('RecordFormModal — snapshots', () => {
  it('matches snapshot in add mode', () => {
    const { asFragment } = renderModal();
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot in edit mode', () => {
    const { asFragment } = renderModal({ record: SAMPLE_RECORD });
    expect(asFragment()).toMatchSnapshot();
  });
});
