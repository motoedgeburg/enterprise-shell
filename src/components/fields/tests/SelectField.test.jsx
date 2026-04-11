/**
 * SelectField tests.
 *
 * Covers:
 *   - Renders with label
 *   - Renders placeholder
 *   - Renders options
 *
 * Note: Ant Design Select uses a virtual dropdown that is hard to interact
 * with in jsdom. We verify rendering and rely on section-level tests for
 * full interaction coverage.
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import SelectField from '../SelectField.jsx';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

function renderField(props = {}, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <SelectField name="choice" label="Choice" options={OPTIONS} {...props} />}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('SelectField', () => {
  it('renders with label', () => {
    renderField();
    expect(screen.getByText('Choice')).toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    renderField({ placeholder: 'Pick one' });
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('displays selected initial value label', () => {
    renderField({}, { choice: 'a' });
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });
});
