/**
 * NumberField + CurrencyField tests.
 *
 * Covers:
 *   - NumberField renders with label and placeholder
 *   - CurrencyField renders with $ prefix
 *   - Both store numeric values in form state
 */
import { render, screen } from '@testing-library/react';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../renderUtils.jsx';
import CurrencyField from '../CurrencyField.jsx';
import NumberField from '../NumberField.jsx';

function renderField(ui, initialValues = {}) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {() => ui}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('NumberField', () => {
  it('renders with label', () => {
    renderField(<NumberField name="qty" label="Quantity" />);
    expect(screen.getByText('Quantity')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    renderField(<NumberField name="qty" label="Quantity" placeholder="0" />);
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
  });

  it('pre-fills initial value', () => {
    renderField(<NumberField name="qty" label="Quantity" />, { qty: 42 });
    expect(screen.getByRole('spinbutton')).toHaveValue('42');
  });
});

describe('CurrencyField', () => {
  it('renders with label', () => {
    renderField(<CurrencyField name="salary" label="Salary" />);
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('renders $ prefix', () => {
    renderField(<CurrencyField name="salary" label="Salary" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('pre-fills and formats initial value', () => {
    renderField(<CurrencyField name="salary" label="Salary" />, { salary: 50000 });
    expect(screen.getByRole('spinbutton')).toHaveValue('50,000');
  });
});
