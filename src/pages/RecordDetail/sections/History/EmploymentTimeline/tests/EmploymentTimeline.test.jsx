/**
 * EmploymentTimeline tests.
 *
 * Covers:
 *   - Empty state when no events exist
 *   - Hire event from workInfo.startDate
 *   - Compensation event from compensation.effectiveDate
 *   - Certification issued events
 *   - Certification expiry events
 *   - Events are sorted descending (most recent first)
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../../renderUtils.jsx';
import EmploymentTimeline from '../EmploymentTimeline.jsx';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../../../../hooks/useLookups.js', () => ({
  useLookups: () => ({
    payFrequencies: [
      { value: 'annual', label: 'Annual' },
      { value: 'bi-weekly', label: 'Bi Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'weekly', label: 'Weekly' },
    ],
  }),
}));

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderTimeline(initialValues = {}) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <EmploymentTimeline />}
      </FinalForm>
    </IntlProvider>,
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

describe('EmploymentTimeline — empty state', () => {
  it('shows empty message when no events exist', () => {
    renderTimeline();
    expect(screen.getByText('No timeline events to display.')).toBeInTheDocument();
  });

  it('shows empty message when sections have no dates', () => {
    renderTimeline({ workInfo: { jobTitle: 'Engineer' } });
    expect(screen.getByText('No timeline events to display.')).toBeInTheDocument();
  });
});

// ─── Hire event ───────────────────────────────────────────────────────────────

describe('EmploymentTimeline — hire event', () => {
  it('displays hire event with job title and department', () => {
    renderTimeline({
      workInfo: { startDate: '2019-06-01', jobTitle: 'Senior Engineer', department: 'Engineering' },
    });
    expect(screen.getByText('Hired as Senior Engineer (Engineering)')).toBeInTheDocument();
  });

  it('uses dash for missing job title', () => {
    renderTimeline({
      workInfo: { startDate: '2019-06-01', department: 'Engineering' },
    });
    expect(screen.getByText(/Hired as — \(Engineering\)/)).toBeInTheDocument();
  });
});

// ─── Compensation event ─────────────────────────────────────────────────────

describe('EmploymentTimeline — compensation event', () => {
  it('displays compensation event with salary and frequency', () => {
    renderTimeline({
      compensation: { effectiveDate: '2023-01-01', baseSalary: 145000, payFrequency: 'annual' },
    });
    expect(screen.getByText('Compensation updated — $145,000.00 Annual')).toBeInTheDocument();
  });

  it('uses dash for missing salary', () => {
    renderTimeline({
      compensation: { effectiveDate: '2023-01-01', payFrequency: 'monthly' },
    });
    expect(screen.getByText('Compensation updated — — Monthly')).toBeInTheDocument();
  });
});

// ─── Certification events ───────────────────────────────────────────────────

describe('EmploymentTimeline — certification events', () => {
  it('displays certification issued event', () => {
    renderTimeline({
      history: {
        certifications: [
          {
            name: 'AWS Solutions Architect',
            issuingBody: 'Amazon Web Services',
            issueDate: '2022-03-15',
          },
        ],
      },
    });
    expect(
      screen.getByText('AWS Solutions Architect certified by Amazon Web Services'),
    ).toBeInTheDocument();
  });

  it('displays certification expiry event', () => {
    renderTimeline({
      history: {
        certifications: [
          {
            name: 'AWS Solutions Architect',
            issuingBody: 'AWS',
            issueDate: '2022-03-15',
            expiryDate: '2025-03-15',
          },
        ],
      },
    });
    expect(screen.getByText('AWS Solutions Architect expired')).toBeInTheDocument();
  });

  it('renders multiple certifications', () => {
    renderTimeline({
      history: {
        certifications: [
          { name: 'CKA', issuingBody: 'CNCF', issueDate: '2023-06-01' },
          { name: 'PMP', issuingBody: 'PMI', issueDate: '2020-11-10' },
        ],
      },
    });
    expect(screen.getByText('CKA certified by CNCF')).toBeInTheDocument();
    expect(screen.getByText('PMP certified by PMI')).toBeInTheDocument();
  });
});

// ─── Sort order ─────────────────────────────────────────────────────────────

describe('EmploymentTimeline — sort order', () => {
  it('renders events in descending date order', () => {
    renderTimeline({
      workInfo: { startDate: '2019-06-01', jobTitle: 'Engineer', department: 'Eng' },
      compensation: { effectiveDate: '2023-01-01', baseSalary: 100000, payFrequency: 'annual' },
      history: {
        certifications: [{ name: 'CKA', issuingBody: 'CNCF', issueDate: '2021-05-01' }],
      },
    });

    const items = screen.getAllByText(/Hired as|Compensation updated|certified by/);
    expect(items).toHaveLength(3);
    // Most recent first: compensation (2023) > cert (2021) > hire (2019)
    expect(items[0].textContent).toContain('Compensation updated');
    expect(items[1].textContent).toContain('CKA certified');
    expect(items[2].textContent).toContain('Hired as');
  });
});
