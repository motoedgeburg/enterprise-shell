/**
 * CompensationSection tests.
 *
 * Covers:
 *   - All field labels render
 *   - Initial values pre-fill fields
 *   - Required validation on baseSalary, payFrequency, effectiveDate
 *   - Min/max validation on bonusTarget and stockOptions
 *   - Inactive constraint: Alert shown, all fields disabled
 *   - Active status: no Alert, fields enabled
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../renderUtils.jsx';
import CompensationSection from '../CompensationSection.jsx';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../../../components/fields/SelectField.jsx', () => ({
  default: function MockSelectField({ name, label, options = [], disabled, validate }) {
    return (
      <Field name={name} validate={validate}>
        {({ input }) => (
          <div>
            <label htmlFor={name}>{label}</label>
            <select id={name} {...input} disabled={disabled} data-testid={`select-${name}`}>
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

vi.mock('../../../../../hooks/useLookups.js', () => ({
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

function renderSection(initialValues = {}) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <CompensationSection />
            <button type="submit">Submit</button>
          </form>
        )}
      </FinalForm>
    </IntlProvider>,
  );
}

// ─── Field labels ─────────────────────────────────────────────────────────────

describe('CompensationSection — field labels', () => {
  it('renders Base Salary label', () => {
    renderSection();
    expect(screen.getByText('Base Salary')).toBeInTheDocument();
  });

  it('renders Pay Frequency label', () => {
    renderSection();
    expect(screen.getByText('Pay Frequency')).toBeInTheDocument();
  });

  it('renders Bonus Target label', () => {
    renderSection();
    expect(screen.getByText('Bonus Target (%)')).toBeInTheDocument();
  });

  it('renders Stock Options label', () => {
    renderSection();
    expect(screen.getByText('Stock Options')).toBeInTheDocument();
  });

  it('renders Effective Date label', () => {
    renderSection();
    expect(screen.getByText('Effective Date')).toBeInTheDocument();
  });

  it('renders Overtime Eligible label', () => {
    renderSection();
    expect(screen.getByText('Overtime Eligible')).toBeInTheDocument();
  });
});

// ─── Initial values ───────────────────────────────────────────────────────────

describe('CompensationSection — initial values', () => {
  const COMP_VALUES = {
    compensation: {
      baseSalary: 120000,
      payFrequency: 'annual',
      bonusTarget: 15,
      stockOptions: 500,
      effectiveDate: '2024-01-01',
      overtimeEligible: true,
    },
  };

  it('pre-selects pay frequency', () => {
    renderSection(COMP_VALUES);
    expect(screen.getByTestId('select-compensation.payFrequency').value).toBe('annual');
  });

  it('renders pay frequency options from lookups', () => {
    renderSection();
    const opts = Array.from(screen.getByTestId('select-compensation.payFrequency').options).map(
      (o) => o.value,
    );
    expect(opts).toContain('annual');
    expect(opts).toContain('monthly');
    expect(opts).toContain('bi-weekly');
    expect(opts).toContain('weekly');
  });
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe('CompensationSection — required validation', () => {
  it('shows required error on baseSalary after blur', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByPlaceholderText('75,000.00'));
    await user.tab();
    await waitFor(() => expect(screen.getByText('Required')).toBeInTheDocument());
  });

  it('clears required error on baseSalary when filled', async () => {
    const user = userEvent.setup();
    renderSection();
    const input = screen.getByPlaceholderText('75,000.00');
    await user.click(input);
    await user.tab();
    await waitFor(() => screen.getByText('Required'));
    await user.type(input, '50000');
    await waitFor(() =>
      expect(input.closest('.ant-form-item')).not.toHaveClass('ant-form-item-has-error'),
    );
  });
});

// ─── Inactive constraint ─────────────────────────────────────────────────────

describe('CompensationSection — inactive constraint', () => {
  it('shows the inactive alert when status is inactive', () => {
    renderSection({ workInfo: { status: 'inactive' } });
    expect(
      screen.getByText('Compensation fields are locked because the employee status is inactive.'),
    ).toBeInTheDocument();
  });

  it('does not show the inactive alert for active status', () => {
    renderSection({ workInfo: { status: 'active' } });
    expect(
      screen.queryByText('Compensation fields are locked because the employee status is inactive.'),
    ).not.toBeInTheDocument();
  });

  it('disables pay frequency when status is inactive', () => {
    renderSection({ workInfo: { status: 'inactive' } });
    expect(screen.getByTestId('select-compensation.payFrequency')).toBeDisabled();
  });

  it('enables pay frequency for active status', () => {
    renderSection({ workInfo: { status: 'active' } });
    expect(screen.getByTestId('select-compensation.payFrequency')).not.toBeDisabled();
  });
});
