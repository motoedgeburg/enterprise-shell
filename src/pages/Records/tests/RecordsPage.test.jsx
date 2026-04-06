/**
 * RecordsPage tests.
 *
 * The page:
 *   - Fetches records on mount via recordsService.getAll → MSW handler
 *   - Renders a table with Name / Email / Department / Status / Created / Actions columns
 *   - Search input filters rows client-side by name or email
 *   - "Add Record" button opens the form modal
 *   - Edit button opens the form modal pre-populated with row data
 *   - Delete Popconfirm → confirm calls recordsService.remove and refreshes the list
 *
 * MSW server lifecycle is managed by src/setupTests.js.
 * db.reset() gives us a fresh 8-row dataset before each test.
 *
 * RecordFormModal is mocked here — its own test file covers form internals.
 * This file focuses on RecordsPage behaviour: rendering, modal open/close,
 * submit → API call → list refresh, and delete.
 */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from 'antd';
import { IntlProvider } from 'react-intl';

import { db } from '../../../mocks/data';
import { appMessages } from '../../../tests/renderUtils.jsx';
import RecordsPage from '../RecordsPage.jsx';

// ─── RecordFormModal mock ─────────────────────────────────────────────────────
// Replaces the real modal with a minimal stub so these tests are not blocked
// by Ant Design Select's jsdom incompatibilities.  Form-level behaviour is
// covered in RecordFormModal.test.jsx.

jest.mock('../RecordFormModal.jsx', () => ({
  __esModule: true,
  default: ({ open, record, onSubmit, onCancel }) => {
    if (!open) return null;
    const isEdit = Boolean(record);
    return (
      <div role="dialog" aria-label={isEdit ? 'Edit Record' : 'Add Record'}>
        <span>{isEdit ? 'Edit Record' : 'Add Record'}</span>
        <span>Full Name</span>
        {/* Controlled input so getByDisplayValue works in edit-mode tests */}
        <input aria-label="name" readOnly value={record?.name ?? ''} />
        <button onClick={onCancel}>Cancel</button>
        <button
          onClick={() =>
            onSubmit(
              isEdit
                ? { ...record }
                : {
                    name: 'New Person',
                    email: 'new@company.com',
                    department: 'Engineering',
                    status: 'active',
                  },
              { reset: () => {} }, // RecordsPage's handleFormSubmit calls form.reset()
            )
          }
        >
          {isEdit ? 'Save Changes' : 'Create'}
        </button>
      </div>
    );
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  db.reset();
});

function renderRecordsPage() {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <App>
        <RecordsPage />
      </App>
    </IntlProvider>,
  );
}

// ─── Initial render ───────────────────────────────────────────────────────────

describe('RecordsPage — initial render', () => {
  it('renders the page title', async () => {
    renderRecordsPage();
    expect(await screen.findByText('Records')).toBeInTheDocument();
  });

  it('renders all table column headers', async () => {
    renderRecordsPage();
    await screen.findByText('Alice Johnson'); // wait for data
    // scroll={{ x: 800 }} causes AntD to render two <table> elements (sticky header + body).
    // Query only the first <thead> to avoid duplicate matches.
    // textContent grabs the column title regardless of whether a sorter wrapper is present.
    const firstThead = document.querySelector('thead');
    const headerTexts = Array.from(firstThead.querySelectorAll('th')).map((th) =>
      th.textContent.trim(),
    );
    expect(headerTexts).toEqual(
      expect.arrayContaining(['Name', 'Email', 'Department', 'Status', 'Actions']),
    );
  });

  it('renders records from the mock API', async () => {
    renderRecordsPage();
    expect(await screen.findByText('Alice Johnson')).toBeInTheDocument();
    expect(await screen.findByText('Bob Martinez')).toBeInTheDocument();
  });

  it('renders the total records count in pagination', async () => {
    renderRecordsPage();
    await screen.findByText('Alice Johnson');
    expect(screen.getByText(/Total 8 records/i)).toBeInTheDocument();
  });

  it('renders the Add Record button', async () => {
    renderRecordsPage();
    expect(await screen.findByRole('button', { name: /Add Record/i })).toBeInTheDocument();
  });

  it('renders the search input', async () => {
    renderRecordsPage();
    expect(
      await screen.findByPlaceholderText('Search by name or email'),
    ).toBeInTheDocument();
  });
});

// ─── Search / filter ──────────────────────────────────────────────────────────

describe('RecordsPage — search', () => {
  it('filters rows by name', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await screen.findByText('Alice Johnson');
    await user.type(screen.getByPlaceholderText('Search by name or email'), 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Bob Martinez')).not.toBeInTheDocument();
    });
  });

  it('filters rows by email', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await screen.findByText('Alice Johnson');
    await user.type(
      screen.getByPlaceholderText('Search by name or email'),
      'bob.martinez@company.com',
    );

    await waitFor(() => {
      expect(screen.getByText('Bob Martinez')).toBeInTheDocument();
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    });
  });

  it('shows all rows when search is cleared', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await screen.findByText('Alice Johnson');
    const searchInput = screen.getByPlaceholderText('Search by name or email');

    await user.type(searchInput, 'Alice');
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Martinez')).toBeInTheDocument();
    });
  });
});

// ─── Add modal ────────────────────────────────────────────────────────────────

describe('RecordsPage — Add Record modal', () => {
  it('opens the Add Record modal when the button is clicked', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await user.click(await screen.findByRole('button', { name: /Add Record/i }));
    // Wait for the modal title specifically (inside .ant-modal-title)
    await screen.findByText('Full Name'); // form field label only appears when modal is open
  });

  it('closes the modal when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await user.click(await screen.findByRole('button', { name: /Add Record/i }));
    await screen.findByText(/Full Name/i); // modal is open
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByText('Full Name')).not.toBeInTheDocument();
    });
  });

  it('creates a new record and refreshes the list', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await user.click(await screen.findByRole('button', { name: /Add Record/i }));
    await screen.findByText('Full Name'); // modal is open

    // The stub's Create button calls onSubmit with a complete record object,
    // which hits the MSW POST handler and increments the total count.
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(screen.getByText(/Total 9 records/i)).toBeInTheDocument();
    });
  });
});

// ─── Edit modal ───────────────────────────────────────────────────────────────

describe('RecordsPage — Edit Record modal', () => {
  it('opens the Edit Record modal with pre-populated data', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await screen.findByText('Alice Johnson');
    const editBtn = screen.getByRole('button', { name: 'Edit Alice Johnson' });
    await user.click(editBtn);

    expect(await screen.findByText('Edit Record')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument();
  });
});

// ─── Delete ───────────────────────────────────────────────────────────────────

describe('RecordsPage — Delete record', () => {
  it('removes the row from the table after confirming delete', async () => {
    const user = userEvent.setup();
    renderRecordsPage();

    await screen.findByText('Alice Johnson');
    const deleteBtn = screen.getByRole('button', { name: 'Delete Alice Johnson' });
    await user.click(deleteBtn);

    // Confirm the Popconfirm
    const confirmBtn = await screen.findByRole('button', { name: 'Delete' });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/Total 7 records/i)).toBeInTheDocument();
    });
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe('RecordsPage — snapshots', () => {
  it('matches snapshot after initial data load', async () => {
    const { asFragment } = renderRecordsPage();
    await screen.findByText('Alice Johnson');
    expect(asFragment()).toMatchSnapshot();
  });
});
