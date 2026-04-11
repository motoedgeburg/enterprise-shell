/**
 * WorkInfoSection tests.
 *
 * Covers:
 *   - All field labels render
 *   - Initial values pre-fill text fields
 *   - Required validation on jobTitle
 *   - Admin constraint: Alert shown, status forced to 'active', status field disabled
 *   - Non-admin: no Alert, status field enabled
 *
 * SelectField uses Ant Design Select which is incompatible with jsdom.
 * It is mocked with a native <select> so we can test validation and
 * field-change behaviour without jsdom crashes.
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../renderUtils.jsx';
import WorkInfoSection from '../WorkInfoSection.jsx';

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

vi.mock('../../../../../components/fields/RadioGroupField.jsx', () => ({
  default: function MockRadioGroupField({ name, label, options = [], validate }) {
    return (
      <Field name={name} validate={validate}>
        {({ input }) => (
          <fieldset>
            <legend>{label}</legend>
            {options.map((o) => (
              <label key={o.value}>
                <input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={input.value === o.value}
                  onChange={() => input.onChange(o.value)}
                />
                {o.label}
              </label>
            ))}
          </fieldset>
        )}
      </Field>
    );
  },
}));

vi.mock('../../../../../hooks/useLookups.js', () => ({
  useLookups: () => ({
    departments: [
      { value: 'Customer Support', label: 'Customer Support' },
      { value: 'Design', label: 'Design' },
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Executive', label: 'Executive' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Human Resources', label: 'Human Resources' },
      { value: 'IT', label: 'IT' },
      { value: 'Legal', label: 'Legal' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'Operations', label: 'Operations' },
      { value: 'Product', label: 'Product' },
      { value: 'Sales', label: 'Sales' },
    ],
    statuses: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'on-leave', label: 'On Leave' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'terminated', label: 'Terminated' },
    ],
    employmentTypes: [
      { value: 'contract', label: 'Contract' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'full-time', label: 'Full Time' },
      { value: 'intern', label: 'Intern' },
      { value: 'part-time', label: 'Part Time' },
      { value: 'temporary', label: 'Temporary' },
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
            <WorkInfoSection />
            <button type="submit">Submit</button>
          </form>
        )}
      </FinalForm>
    </IntlProvider>,
  );
}

// ─── Field labels ─────────────────────────────────────────────────────────────

describe('WorkInfoSection — field labels', () => {
  it('renders Job Title label', () => {
    renderSection();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
  });

  it('renders Manager label', () => {
    renderSection();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('renders Department label', () => {
    renderSection();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('renders Status label', () => {
    renderSection();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders Start Date label', () => {
    renderSection();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
  });

  it('renders Employment Type label', () => {
    renderSection();
    expect(screen.getByText('Employment Type')).toBeInTheDocument();
  });
});

// ─── Initial values ───────────────────────────────────────────────────────────

describe('WorkInfoSection — initial values', () => {
  it('pre-fills jobTitle', () => {
    renderSection({ workInfo: { jobTitle: 'Senior Engineer' } });
    expect(screen.getByDisplayValue('Senior Engineer')).toBeInTheDocument();
  });

  it('pre-fills manager', () => {
    renderSection({ workInfo: { manager: 'Jane Smith' } });
    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
  });

  it('pre-selects department', () => {
    renderSection({ workInfo: { department: 'Engineering' } });
    expect(screen.getByTestId('select-workInfo.department').value).toBe('Engineering');
  });

  it('pre-selects status', () => {
    renderSection({ workInfo: { status: 'active' } });
    expect(screen.getByTestId('select-workInfo.status').value).toBe('active');
  });

  it('pre-selects employment type radio', () => {
    renderSection({ workInfo: { employmentType: 'full-time' } });
    expect(screen.getByLabelText('Full Time')).toBeChecked();
  });
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe('WorkInfoSection — required validation', () => {
  it('shows required error on jobTitle after blur', async () => {
    const user = userEvent.setup();
    renderSection();
    await user.click(screen.getByPlaceholderText('Software Engineer'));
    await user.tab();
    await waitFor(() => expect(screen.getByText('Required')).toBeInTheDocument());
  });

  it('clears required error on jobTitle when filled', async () => {
    const user = userEvent.setup();
    renderSection();
    const jobInput = screen.getByPlaceholderText('Software Engineer');
    await user.click(jobInput);
    await user.tab();
    await waitFor(() => screen.getByText('Required'));
    await user.type(jobInput, 'Engineer');
    await waitFor(() =>
      expect(jobInput.closest('.ant-form-item')).not.toHaveClass('ant-form-item-has-error'),
    );
  });

  it('renders department options from lookups', () => {
    renderSection();
    const opts = Array.from(screen.getByTestId('select-workInfo.department').options).map(
      (o) => o.value,
    );
    expect(opts).toContain('Engineering');
    expect(opts).toContain('Product');
    expect(opts).toContain('Legal');
  });

  it('renders status options from lookups', () => {
    renderSection();
    const opts = Array.from(screen.getByTestId('select-workInfo.status').options).map(
      (o) => o.value,
    );
    expect(opts).toContain('active');
    expect(opts).toContain('inactive');
  });

  it('renders all employment type radio options', () => {
    renderSection();
    expect(screen.getByLabelText('Full Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Part Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Contract')).toBeInTheDocument();
    expect(screen.getByLabelText('Intern')).toBeInTheDocument();
  });
});

// ─── Admin constraint ─────────────────────────────────────────────────────────

describe('WorkInfoSection — admin constraint', () => {
  it('shows the admin alert when accessLevel is admin', () => {
    renderSection({ preferences: { accessLevel: 'admin' } });
    expect(
      screen.getByText('Employees with Admin access must have Active status.'),
    ).toBeInTheDocument();
  });

  it('does not show the admin alert for standard access', () => {
    renderSection({ preferences: { accessLevel: 'standard' } });
    expect(
      screen.queryByText('Employees with Admin access must have Active status.'),
    ).not.toBeInTheDocument();
  });

  it('does not show the admin alert when no access level is set', () => {
    renderSection();
    expect(
      screen.queryByText('Employees with Admin access must have Active status.'),
    ).not.toBeInTheDocument();
  });

  it('forces status to active when accessLevel is admin', async () => {
    renderSection({
      preferences: { accessLevel: 'admin' },
      workInfo: { status: 'inactive' },
    });
    await waitFor(() => expect(screen.getByTestId('select-workInfo.status').value).toBe('active'));
  });

  it('disables the status field when accessLevel is admin', () => {
    renderSection({ preferences: { accessLevel: 'admin' } });
    expect(screen.getByTestId('select-workInfo.status')).toBeDisabled();
  });

  it('enables the status field for non-admin access level', () => {
    renderSection({ preferences: { accessLevel: 'standard' } });
    expect(screen.getByTestId('select-workInfo.status')).not.toBeDisabled();
  });
});
