/**
 * Tests for SsnField and its formatSsn formatter.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import SsnField, { formatSsn } from '../SsnField.jsx';

// ─── formatSsn (pure function) ───────────────────────────────────────────────

describe('formatSsn', () => {
  it('returns empty string for empty input', () => expect(formatSsn('')).toBe(''));
  it('handles no argument', () => expect(formatSsn()).toBe(''));
  it('returns raw digits when fewer than 4', () => expect(formatSsn('123')).toBe('123'));
  it('formats 4 digits with first dash', () => expect(formatSsn('1234')).toBe('123-4'));
  it('formats 5 digits', () => expect(formatSsn('12345')).toBe('123-45'));
  it('formats 6 digits with second dash', () => expect(formatSsn('123456')).toBe('123-45-6'));
  it('formats full 9-digit SSN', () => expect(formatSsn('123456789')).toBe('123-45-6789'));
  it('strips non-digit characters', () => expect(formatSsn('123-45-6789')).toBe('123-45-6789'));
  it('strips letters', () => expect(formatSsn('abc123456789')).toBe('123-45-6789'));
  it('caps at 9 digits', () => expect(formatSsn('1234567890')).toBe('123-45-6789'));
});

// ─── SsnField component ───────────────────────────────────────────────────────

function renderSsnField(props = {}) {
  return render(
    <IntlProvider locale="en">
      <FinalForm onSubmit={() => {}}>
        {() => <SsnField name="ssn" label="SSN" {...props} />}
      </FinalForm>
    </IntlProvider>,
  );
}

describe('SsnField', () => {
  it('renders the label', () => {
    renderSsnField();
    expect(screen.getByText('SSN')).toBeInTheDocument();
  });

  it('renders as a password input (masked)', () => {
    renderSsnField();
    // Input.Password renders type="password" — no textbox role
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('formats typed digits into SSN format', async () => {
    const user = userEvent.setup();
    renderSsnField();
    const input = document.querySelector('input');
    await user.type(input, '123456789');
    expect(input.value).toBe('123-45-6789');
  });
});
