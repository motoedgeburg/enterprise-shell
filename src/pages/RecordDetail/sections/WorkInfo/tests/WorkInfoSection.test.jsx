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
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../renderUtils.jsx';
import WorkInfoSection from '../WorkInfoSection.jsx';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock(
  '../../../../../components/fields/SelectField.jsx',
  () =>
    function MockSelectField({ name, label, options = [], disabled, validate }) {
      const { Field } = require('react-final-form');
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
);

jest.mock(
  '../../../../../components/fields/RadioGroupField.jsx',
  () =>
    function MockRadioGroupField({ name, label, options = [], validate }) {
      const { Field } = require('react-final-form');
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
);

jest.mock('../../../../../hooks/useLookups.js', () => ({
  useLookups: () => ({
    departments: ['Engineering', 'Product', 'Design'],
    statuses: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    employmentTypes: [
      { value: 'full-time', label: 'Full-time' },
      { value: 'part-time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'intern', label: 'Intern' },
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
    renderSection({ jobTitle: 'Senior Engineer' });
    expect(screen.getByDisplayValue('Senior Engineer')).toBeInTheDocument();
  });

  it('pre-fills manager', () => {
    renderSection({ manager: 'Jane Smith' });
    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
  });

  it('pre-selects department', () => {
    renderSection({ department: 'Engineering' });
    expect(screen.getByTestId('select-department').value).toBe('Engineering');
  });

  it('pre-selects status', () => {
    renderSection({ status: 'active' });
    expect(screen.getByTestId('select-status').value).toBe('active');
  });

  it('pre-selects employment type radio', () => {
    renderSection({ employmentType: 'full-time' });
    expect(screen.getByLabelText('Full-time')).toBeChecked();
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
    const opts = Array.from(screen.getByTestId('select-department').options).map((o) => o.value);
    expect(opts).toContain('Engineering');
    expect(opts).toContain('Product');
    expect(opts).toContain('Design');
  });

  it('renders status options from lookups', () => {
    renderSection();
    const opts = Array.from(screen.getByTestId('select-status').options).map((o) => o.value);
    expect(opts).toContain('active');
    expect(opts).toContain('inactive');
  });

  it('renders all employment type radio options', () => {
    renderSection();
    expect(screen.getByLabelText('Full-time')).toBeInTheDocument();
    expect(screen.getByLabelText('Part-time')).toBeInTheDocument();
    expect(screen.getByLabelText('Contract')).toBeInTheDocument();
    expect(screen.getByLabelText('Intern')).toBeInTheDocument();
  });
});

// ─── Admin constraint ─────────────────────────────────────────────────────────

describe('WorkInfoSection — admin constraint', () => {
  it('shows the admin alert when accessLevel is admin', () => {
    renderSection({ accessLevel: 'admin' });
    expect(
      screen.getByText('Employees with Admin access must have Active status.'),
    ).toBeInTheDocument();
  });

  it('does not show the admin alert for standard access', () => {
    renderSection({ accessLevel: 'standard' });
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
    renderSection({ accessLevel: 'admin', status: 'inactive' });
    await waitFor(() => expect(screen.getByTestId('select-status').value).toBe('active'));
  });

  it('disables the status field when accessLevel is admin', () => {
    renderSection({ accessLevel: 'admin' });
    expect(screen.getByTestId('select-status')).toBeDisabled();
  });

  it('enables the status field for non-admin access level', () => {
    renderSection({ accessLevel: 'standard' });
    expect(screen.getByTestId('select-status')).not.toBeDisabled();
  });
});
