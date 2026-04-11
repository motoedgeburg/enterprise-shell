/**
 * SwitchField tests.
 *
 * Covers:
 *   - Renders with label
 *   - Shows checkedLabel when on
 *   - Shows uncheckedLabel when off
 *   - Pre-fills initial value
 *   - Respects disabled prop
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import SwitchField from '../SwitchField.jsx';

function renderField(props = {}, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <SwitchField name="toggle" label="Active" {...props} />}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('SwitchField', () => {
  it('renders with label', () => {
    renderField();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders the switch control', () => {
    renderField();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('shows uncheckedLabel when off', () => {
    renderField({ checkedLabel: 'Yes', uncheckedLabel: 'No' });
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('shows checkedLabel when on', () => {
    renderField({ checkedLabel: 'Yes', uncheckedLabel: 'No' }, { toggle: true });
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('pre-fills initial value as checked', () => {
    renderField({}, { toggle: true });
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('renders unchecked by default', () => {
    renderField();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('respects disabled prop', () => {
    renderField({ disabled: true });
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
