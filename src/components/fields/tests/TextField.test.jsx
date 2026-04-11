/**
 * TextField + EmailField tests.
 *
 * Covers:
 *   - TextField renders with label and placeholder
 *   - TextField pre-fills initial value
 *   - EmailField renders with type="email"
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import EmailField from '../EmailField.jsx';
import TextField from '../TextField.jsx';

function renderField(ui, initialValues = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => ui}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('TextField', () => {
  it('renders with label', () => {
    renderField(<TextField name="name" label="Full Name" />);
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    renderField(<TextField name="name" label="Name" placeholder="Jane Doe" />);
    expect(screen.getByPlaceholderText('Jane Doe')).toBeInTheDocument();
  });

  it('pre-fills initial value', () => {
    renderField(<TextField name="name" label="Name" />, { name: 'Alice' });
    expect(screen.getByRole('textbox')).toHaveValue('Alice');
  });
});

describe('EmailField', () => {
  it('renders with label', () => {
    renderField(<EmailField name="email" label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders as type email', () => {
    renderField(<EmailField name="email" label="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('pre-fills initial value', () => {
    renderField(<EmailField name="email" label="Email" />, { email: 'a@b.com' });
    expect(screen.getByRole('textbox')).toHaveValue('a@b.com');
  });
});
