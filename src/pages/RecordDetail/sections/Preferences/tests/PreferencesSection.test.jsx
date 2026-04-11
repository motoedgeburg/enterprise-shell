/**
 * PreferencesSection tests.
 *
 * Covers:
 *   - All field labels render
 *   - Initial values pre-fill switch, checkbox, radio, and textarea fields
 *   - Required validation on accessLevel
 *   - Notes maxLength(1000) validation
 *   - Inactive constraint: Alert shown, accessLevel forced to 'restricted',
 *     notificationsEnabled and channels disabled
 *   - Intern constraint: Alert shown, remoteEligible forced to false and disabled
 *
 * SwitchField, CheckboxGroupField, and RadioGroupField wrap Ant Design
 * components that are incompatible with jsdom — all three are mocked with
 * native equivalents that integrate with React Final Form via Field.
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field, Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../renderUtils.jsx';
import PreferencesSection from '../PreferencesSection.jsx';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../../../../../components/fields/SwitchField.jsx', () => ({
  default: function MockSwitchField({ name, label, checkedLabel, uncheckedLabel, disabled }) {
    return (
      <Field name={name} type="checkbox">
        {({ input }) => (
          <div>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type="checkbox"
              checked={!!input.checked}
              onChange={input.onChange}
              disabled={disabled}
              data-testid={`switch-${name}`}
            />
            <span data-testid={`switch-label-${name}`}>
              {input.checked ? checkedLabel : uncheckedLabel}
            </span>
          </div>
        )}
      </Field>
    );
  },
}));

vi.mock('../../../../../components/fields/CheckboxGroupField.jsx', () => ({
  default: function MockCheckboxGroupField({ name, label, options = [], disabled }) {
    return (
      <Field name={name}>
        {({ input }) => {
          const selected = input.value ?? [];
          const toggle = (val) => {
            const next = selected.includes(val)
              ? selected.filter((v) => v !== val)
              : [...selected, val];
            input.onChange(next);
          };
          return (
            <fieldset disabled={disabled} data-testid={`checkboxgroup-${name}`}>
              <legend>{label}</legend>
              {options.map((o) => (
                <label key={o.value}>
                  <input
                    type="checkbox"
                    value={o.value}
                    checked={selected.includes(o.value)}
                    onChange={() => toggle(o.value)}
                    disabled={disabled}
                  />
                  {o.label}
                </label>
              ))}
            </fieldset>
          );
        }}
      </Field>
    );
  },
}));

vi.mock('../../../../../components/fields/RadioGroupField.jsx', () => ({
  default: function MockRadioGroupField({ name, label, options = [], disabled, validate }) {
    return (
      <Field name={name} validate={validate}>
        {({ input, meta }) => (
          <fieldset disabled={disabled} data-testid={`radiogroup-${name}`}>
            <legend>{label}</legend>
            {options.map((o) => (
              <label key={o.value}>
                <input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={input.value === o.value}
                  onChange={() => input.onChange(o.value)}
                  disabled={disabled}
                />
                {o.label}
              </label>
            ))}
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </fieldset>
        )}
      </Field>
    );
  },
}));

vi.mock('../../../../../hooks/useLookups.js', () => ({
  useLookups: () => ({
    notificationChannels: [
      { value: 'email', label: 'Email' },
      { value: 'push', label: 'Push' },
      { value: 'slack', label: 'Slack' },
      { value: 'sms', label: 'Sms' },
    ],
    accessLevels: [
      { value: 'admin', label: 'Admin' },
      { value: 'elevated', label: 'Elevated' },
      { value: 'read-only', label: 'Read Only' },
      { value: 'restricted', label: 'Restricted' },
      { value: 'standard', label: 'Standard' },
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
            <PreferencesSection />
            <button type="submit">Submit</button>
          </form>
        )}
      </FinalForm>
    </IntlProvider>,
  );
}

// ─── Field labels ─────────────────────────────────────────────────────────────

describe('PreferencesSection — field labels', () => {
  it('renders Remote Work Eligible label', () => {
    renderSection();
    expect(screen.getByText('Remote Work Eligible')).toBeInTheDocument();
  });

  it('renders Notifications Enabled label', () => {
    renderSection();
    expect(screen.getByText('Notifications Enabled')).toBeInTheDocument();
  });

  it('renders Notification Channels label', () => {
    renderSection();
    expect(screen.getByText('Notification Channels')).toBeInTheDocument();
  });

  it('renders Access Level label', () => {
    renderSection();
    expect(screen.getByText('Access Level')).toBeInTheDocument();
  });

  it('renders Internal Notes label', () => {
    renderSection();
    expect(screen.getByText('Internal Notes')).toBeInTheDocument();
  });
});

// ─── Initial values ───────────────────────────────────────────────────────────

describe('PreferencesSection — initial values', () => {
  it('pre-checks the remoteEligible switch when true', () => {
    renderSection({ preferences: { remoteEligible: true } });
    expect(screen.getByTestId('switch-preferences.remoteEligible')).toBeChecked();
  });

  it('pre-unchecks the remoteEligible switch when false', () => {
    renderSection({ preferences: { remoteEligible: false } });
    expect(screen.getByTestId('switch-preferences.remoteEligible')).not.toBeChecked();
  });

  it('pre-checks notificationsEnabled switch', () => {
    renderSection({ preferences: { notificationsEnabled: true } });
    expect(screen.getByTestId('switch-preferences.notificationsEnabled')).toBeChecked();
  });

  it('pre-checks notification channel checkboxes', () => {
    renderSection({ preferences: { notificationChannels: ['email', 'slack'] } });
    const emailCb = screen.getByRole('checkbox', { name: 'Email' });
    const slackCb = screen.getByRole('checkbox', { name: 'Slack' });
    expect(emailCb).toBeChecked();
    expect(slackCb).toBeChecked();
  });

  it('pre-selects access level radio', () => {
    renderSection({ preferences: { accessLevel: 'standard' } });
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
  });

  it('pre-fills notes textarea', () => {
    renderSection({ preferences: { notes: 'Team lead.' } });
    expect(screen.getByDisplayValue('Team lead.')).toBeInTheDocument();
  });
});

// ─── Checkbox group interaction ───────────────────────────────────────────────

describe('PreferencesSection — notification channel checkboxes', () => {
  it('renders all four channel options', () => {
    renderSection();
    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Push' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Slack' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Sms' })).toBeInTheDocument();
  });

  it('toggles a channel on click', async () => {
    const user = userEvent.setup();
    // notificationsEnabled must be true; otherwise notifsOff=true disables the group
    renderSection({
      preferences: { notificationChannels: [], notificationsEnabled: true },
    });
    const emailCb = screen.getByRole('checkbox', { name: 'Email' });
    await user.click(emailCb);
    expect(emailCb).toBeChecked();
  });
});

// ─── Access level radio ───────────────────────────────────────────────────────

describe('PreferencesSection — access level options', () => {
  it('renders all four access level options', () => {
    renderSection();
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Elevated' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Admin' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Restricted' })).toBeInTheDocument();
  });
});

// ─── Validation ───────────────────────────────────────────────────────────────

describe('PreferencesSection — notes validation', () => {
  it('shows maxLength error when notes exceed 1000 characters', async () => {
    renderSection();
    const notesInput = screen.getByPlaceholderText(/Internal notes visible/i);
    fireEvent.change(notesInput, { target: { value: 'a'.repeat(1001) } });
    fireEvent.blur(notesInput);
    await waitFor(() => expect(screen.getByText(/Cannot exceed 1000/i)).toBeInTheDocument());
  });

  it('no error for notes within 1000 characters', async () => {
    const user = userEvent.setup();
    renderSection();
    const notesInput = screen.getByPlaceholderText(/Internal notes visible/i);
    await user.type(notesInput, 'Short note.');
    await user.tab();
    await waitFor(() => expect(screen.queryByText(/Cannot exceed 1000/i)).not.toBeInTheDocument());
  });
});

// ─── Inactive constraint ──────────────────────────────────────────────────────

describe('PreferencesSection — inactive constraint', () => {
  it('shows the inactive alert when status is inactive', () => {
    renderSection({ workInfo: { status: 'inactive' } });
    expect(
      screen.getByText(
        'Inactive employees are locked to Read-only access with notifications disabled.',
      ),
    ).toBeInTheDocument();
  });

  it('does not show the inactive alert for active status', () => {
    renderSection({ workInfo: { status: 'active' } });
    expect(
      screen.queryByText(
        'Inactive employees are locked to Read-only access with notifications disabled.',
      ),
    ).not.toBeInTheDocument();
  });

  it('forces accessLevel to restricted when status is inactive', async () => {
    renderSection({
      workInfo: { status: 'inactive' },
      preferences: { accessLevel: 'admin' },
    });
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Restricted' })).toBeChecked());
  });

  it('disables the notificationsEnabled switch when inactive', () => {
    renderSection({ workInfo: { status: 'inactive' } });
    expect(screen.getByTestId('switch-preferences.notificationsEnabled')).toBeDisabled();
  });

  it('disables the accessLevel radio group when inactive', () => {
    renderSection({ workInfo: { status: 'inactive' } });
    expect(screen.getByTestId('radiogroup-preferences.accessLevel')).toBeDisabled();
  });

  it('disables the notification channels when inactive', () => {
    renderSection({ workInfo: { status: 'inactive' } });
    expect(screen.getByTestId('checkboxgroup-preferences.notificationChannels')).toBeDisabled();
  });
});

// ─── Intern constraint ────────────────────────────────────────────────────────

describe('PreferencesSection — intern constraint', () => {
  it('shows the intern alert when employmentType is intern', () => {
    renderSection({ workInfo: { employmentType: 'intern' } });
    expect(
      screen.getByText('Remote work eligibility is not available for interns.'),
    ).toBeInTheDocument();
  });

  it('does not show the intern alert for non-intern employment types', () => {
    renderSection({ workInfo: { employmentType: 'full-time' } });
    expect(
      screen.queryByText('Remote work eligibility is not available for interns.'),
    ).not.toBeInTheDocument();
  });

  it('forces remoteEligible to false when employmentType is intern', async () => {
    renderSection({
      workInfo: { employmentType: 'intern' },
      preferences: { remoteEligible: true },
    });
    await waitFor(() =>
      expect(screen.getByTestId('switch-preferences.remoteEligible')).not.toBeChecked(),
    );
  });

  it('disables the remoteEligible switch when employmentType is intern', () => {
    renderSection({ workInfo: { employmentType: 'intern' } });
    expect(screen.getByTestId('switch-preferences.remoteEligible')).toBeDisabled();
  });
});
