/**
 * RadioGroupField tests.
 *
 * Covers:
 *   - Renders with label
 *   - Renders radio options
 *   - Pre-selects initial value
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import RadioGroupField from '../RadioGroupField.jsx';

const OPTIONS = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
];

function renderField(props = {}, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <RadioGroupField name="type" label="Employment Type" options={OPTIONS} {...props} />}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('RadioGroupField', () => {
  it('renders with label', () => {
    renderField();
    expect(screen.getByText('Employment Type')).toBeInTheDocument();
  });

  it('renders all radio options', () => {
    renderField();
    expect(screen.getByText('Full Time')).toBeInTheDocument();
    expect(screen.getByText('Part Time')).toBeInTheDocument();
    expect(screen.getByText('Contract')).toBeInTheDocument();
  });

  it('pre-selects initial value', () => {
    renderField({}, { type: 'part-time' });
    const radios = screen.getAllByRole('radio');
    const selected = radios.find((r) => r.checked);
    expect(selected).toBeDefined();
    expect(selected.value).toBe('part-time');
  });
});
