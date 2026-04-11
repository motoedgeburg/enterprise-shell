/**
 * CheckboxGroupField tests.
 *
 * Covers:
 *   - Renders with label
 *   - Renders checkbox options
 *   - Pre-checks initial values
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import CheckboxGroupField from '../CheckboxGroupField.jsx';

const OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
];

function renderField(props = {}, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => (
          <CheckboxGroupField
            name="channels"
            label="Notification Channels"
            options={OPTIONS}
            {...props}
          />
        )}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('CheckboxGroupField', () => {
  it('renders with label', () => {
    renderField();
    expect(screen.getByText('Notification Channels')).toBeInTheDocument();
  });

  it('renders all checkbox options', () => {
    renderField();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('SMS')).toBeInTheDocument();
    expect(screen.getByText('Push')).toBeInTheDocument();
  });

  it('pre-checks initial values', () => {
    renderField({}, { channels: ['email', 'push'] });
    const checkboxes = screen.getAllByRole('checkbox');
    const checked = checkboxes.filter((c) => c.checked);
    expect(checked).toHaveLength(2);
  });

  it('renders unchecked when no initial value', () => {
    renderField();
    const checkboxes = screen.getAllByRole('checkbox');
    const checked = checkboxes.filter((c) => c.checked);
    expect(checked).toHaveLength(0);
  });
});
