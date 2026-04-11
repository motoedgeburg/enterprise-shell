/**
 * TextAreaField tests.
 *
 * Covers:
 *   - Renders with label and placeholder
 *   - Pre-fills initial value
 *   - Respects rows prop
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import TextAreaField from '../TextAreaField.jsx';

function renderField(props = {}, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => <TextAreaField name="bio" label="Bio" {...props} />}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('TextAreaField', () => {
  it('renders with label', () => {
    renderField();
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    renderField({ placeholder: 'Write something...' });
    expect(screen.getByPlaceholderText('Write something...')).toBeInTheDocument();
  });

  it('pre-fills initial value', () => {
    renderField({}, { bio: 'Hello world' });
    expect(screen.getByRole('textbox')).toHaveValue('Hello world');
  });

  it('renders with specified rows', () => {
    renderField({ rows: 5 });
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});
