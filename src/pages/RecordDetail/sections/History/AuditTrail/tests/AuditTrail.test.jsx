/**
 * AuditTrail tests.
 *
 * Covers:
 *   - Empty state when no audit entries exist
 *   - Create event rendering
 *   - Edit event with note rendering
 *   - savedBy display
 *   - Events sorted descending (most recent first)
 *   - Entries without savedAt are skipped
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../../renderUtils.jsx';
import AuditTrail from '../AuditTrail.jsx';

// ─── Helper ──────���────────────────────────────────────────────────────────────

function renderAuditTrail(initialValues = {}) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <AuditTrail />}
      </FinalForm>
    </IntlProvider>,
  );
}

// ��── Empty state ───���──────────────────────────────────��───────────────────────

describe('AuditTrail — empty state', () => {
  it('shows empty message when no audit entries exist', () => {
    renderAuditTrail();
    expect(screen.getByText('No audit history to display.')).toBeInTheDocument();
  });

  it('shows empty message when auditLog is an empty array', () => {
    renderAuditTrail({ auditLog: [] });
    expect(screen.getByText('No audit history to display.')).toBeInTheDocument();
  });
});

// ─── Create event ─────────────────────────────────────────────────────────────

describe('AuditTrail — create event', () => {
  it('displays a create event', () => {
    renderAuditTrail({
      auditLog: [
        {
          type: 'create',
          note: '',
          savedBy: 'system@company.com',
          savedAt: '2024-01-15T10:30:00Z',
        },
      ],
    });
    expect(screen.getByText('Record created')).toBeInTheDocument();
    expect(screen.getByText('by system@company.com')).toBeInTheDocument();
  });
});

// ─── Edit event ──────��─────────────────────────────────────���──────────────────

describe('AuditTrail — edit event', () => {
  it('displays an edit event with note', () => {
    renderAuditTrail({
      auditLog: [
        {
          type: 'edit',
          note: 'Updated salary after review.',
          savedBy: 'jane.smith@company.com',
          savedAt: '2025-01-10T14:22:00Z',
        },
      ],
    });
    expect(screen.getByText('Record updated')).toBeInTheDocument();
    expect(screen.getByText('by jane.smith@company.com')).toBeInTheDocument();
    expect(screen.getByText('Updated salary after review.')).toBeInTheDocument();
  });

  it('does not render note line when note is empty', () => {
    renderAuditTrail({
      auditLog: [
        { type: 'edit', note: '', savedBy: 'jane@co.com', savedAt: '2025-01-10T14:00:00Z' },
      ],
    });
    expect(screen.getByText('Record updated')).toBeInTheDocument();
    // No note content rendered
    expect(screen.queryByText(/Updated salary/)).not.toBeInTheDocument();
  });
});

// ─── Sort order ─────────────────────────────────────��─────────────────────────

describe('AuditTrail — sort order', () => {
  it('renders events in descending date order', () => {
    renderAuditTrail({
      auditLog: [
        { type: 'create', note: '', savedBy: 'a@co.com', savedAt: '2024-01-15T10:00:00Z' },
        { type: 'edit', note: '', savedBy: 'b@co.com', savedAt: '2025-06-10T14:00:00Z' },
        { type: 'edit', note: '', savedBy: 'c@co.com', savedAt: '2024-09-01T08:00:00Z' },
      ],
    });
    const items = screen.getAllByText(/Record created|Record updated/);
    expect(items).toHaveLength(3);
    // Most recent first: 2025-06 > 2024-09 > 2024-01
    expect(items[0].textContent).toBe('Record updated');
    expect(items[2].textContent).toBe('Record created');
  });
});

// ─── Skip entries without savedAt ────────────────────��────────────────────────

describe('AuditTrail — incomplete entries', () => {
  it('skips entries that have no savedAt', () => {
    renderAuditTrail({
      auditLog: [
        { type: 'create', note: '', savedBy: 'a@co.com', savedAt: '2024-01-15T10:00:00Z' },
        { type: 'edit', note: 'pending', savedBy: 'b@co.com' },
      ],
    });
    const items = screen.getAllByText(/Record created|Record updated/);
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('Record created');
  });
});
