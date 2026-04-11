/**
 * DateField tests.
 *
 * Covers:
 *   - Renders with label
 *   - Displays initial date value
 *
 * Note: Ant Design DatePicker uses a virtual overlay that is difficult to
 * interact with in jsdom. We verify rendering and rely on section-level
 * tests for full interaction coverage.
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import DateField from '../DateField.jsx';

function renderField(props = {}, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <DateField name="dob" label="Date of Birth" {...props} />}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('DateField', () => {
  it('renders with label', () => {
    renderField();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
  });

  it('displays formatted initial date', () => {
    renderField({}, { dob: '1990-03-15' });
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('1990-03-15');
  });

  it('renders empty when no initial value', () => {
    renderField();
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('');
  });
});
