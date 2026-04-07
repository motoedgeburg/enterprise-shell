/**
 * Tests for PhoneField and its formatPhone formatter.
 * The formatter is a pure function so we test it directly.
 * The component is tested via render + userEvent.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import PhoneField, { formatPhone } from '../PhoneField.jsx';

// ─── formatPhone (pure function) ─────────────────────────────────────────────

describe('formatPhone', () => {
  it('returns empty string for empty input', () => expect(formatPhone('')).toBe(''));
  it('handles no argument', () => expect(formatPhone()).toBe(''));
  it('returns raw digits when fewer than 4', () => expect(formatPhone('215')).toBe('215'));
  it('formats area code + first digit', () => expect(formatPhone('2155')).toBe('(215) 5'));
  it('formats up to 6 digits', () => expect(formatPhone('215555')).toBe('(215) 555'));
  it('formats 7 digits with dash', () => expect(formatPhone('2155550')).toBe('(215) 555-0'));
  it('formats full 10-digit number', () =>
    expect(formatPhone('2155550100')).toBe('(215) 555-0100'));
  it('strips non-digit characters', () =>
    expect(formatPhone('(215) 555-0100')).toBe('(215) 555-0100'));
  it('strips letters', () => expect(formatPhone('abc2155550100')).toBe('(215) 555-0100'));
  it('caps at 10 digits', () => expect(formatPhone('21555501001234')).toBe('(215) 555-0100'));
});

// ─── PhoneField component ─────────────────────────────────────────────────────

function renderPhoneField(props = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}}>
        {() => <PhoneField name="phone" label="Phone" {...props} />}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('PhoneField', () => {
  it('renders the label', () => {
    renderPhoneField();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('renders the default placeholder', () => {
    renderPhoneField();
    expect(screen.getByPlaceholderText('(215) 555-0100')).toBeInTheDocument();
  });

  it('renders a custom placeholder', () => {
    renderPhoneField({ placeholder: '(999) 000-0000' });
    expect(screen.getByPlaceholderText('(999) 000-0000')).toBeInTheDocument();
  });

  it('formats typed digits into phone format', async () => {
    const user = userEvent.setup();
    renderPhoneField();
    const input = screen.getByPlaceholderText('(215) 555-0100');
    await user.type(input, '2155550100');
    expect(input.value).toBe('(215) 555-0100');
  });
});
