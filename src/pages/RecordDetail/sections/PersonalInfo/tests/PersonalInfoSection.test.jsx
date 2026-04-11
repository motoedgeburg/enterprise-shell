/**
 * PersonalInfoSection tests.
 *
 * Covers:
 *   - All field labels are rendered
 *   - Required validation fires on name and email
 *   - Email format validation
 *   - Phone auto-formatting
 *   - SSN auto-formatting
 *   - Address minLength validation
 *   - Bio maxLength validation
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { Form as FinalForm } from 'react-final-form';
import { IntlProvider } from 'react-intl';

import { appMessages } from '../../../../../renderUtils.jsx';
import PersonalInfoSection from '../PersonalInfoSection.jsx';

// ─── Helper ───────────────────────────────────────────────────────────────────

function renderSection(initialValues = {}) {
  return render(
    <IntlProvider locale="en" messages={appMessages} defaultLocale="en">
      <FinalForm onSubmit={() => {}} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <Form layout="vertical" component="div" onSubmit={handleSubmit}>
            <PersonalInfoSection />
            <button type="submit">Submit</button>
          </Form>
        )}
      </FinalForm>
    </IntlProvider>,
  );
}

// ─── Field labels ─────────────────────────────────────────────────────────────

describe('PersonalInfoSection — field labels', () => {
  it('renders Full Name label', () => {
    renderSection();
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });

  it('renders Email label', () => {
    renderSection();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders Phone label', () => {
    renderSection();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('renders Address label', () => {
    renderSection();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('renders Date of Birth label', () => {
    renderSection();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
  });

  it('renders Social Security Number label', () => {
    renderSection();
    expect(screen.getByText('Social Security Number')).toBeInTheDocument();
  });

  it('renders Bio label', () => {
    renderSection();
    expect(screen.getByText('Bio')).toBeInTheDocument();
  });
});

// ─── Initial values ───────────────────────────────────────────────────────────

describe('PersonalInfoSection — initial values', () => {
  it('pre-fills name field', () => {
    renderSection({ personalInfo: { name: 'Alice Johnson' } });
    expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument();
  });

  it('pre-fills email field', () => {
    renderSection({ personalInfo: { email: 'alice@company.com' } });
    expect(screen.getByDisplayValue('alice@company.com')).toBeInTheDocument();
  });

  it('pre-fills phone field', () => {
    renderSection({ personalInfo: { phone: '(215) 555-0101' } });
    expect(screen.getByDisplayValue('(215) 555-0101')).toBeInTheDocument();
  });

  it('pre-fills address field', () => {
    renderSection({ personalInfo: { address: '123 Market St' } });
    expect(screen.getByDisplayValue('123 Market St')).toBeInTheDocument();
  });

  it('pre-fills bio field', () => {
    renderSection({ personalInfo: { bio: 'Senior engineer.' } });
    expect(screen.getByDisplayValue('Senior engineer.')).toBeInTheDocument();
  });
});

// ─── Validation — required ────────────────────────────────────────────────────

describe('PersonalInfoSection — required validation', () => {
  it('shows required error on name after blur', async () => {
    const user = userEvent.setup();
    renderSection();
    const nameInput = screen.getByPlaceholderText('Jane Doe');
    await user.click(nameInput);
    await user.tab();
    await waitFor(() => expect(screen.getByText('Required')).toBeInTheDocument());
  });

  it('shows required error on email after blur', async () => {
    const user = userEvent.setup();
    renderSection();
    const emailInput = screen.getByPlaceholderText('jane@company.com');
    await user.click(emailInput);
    await user.tab();
    await waitFor(() => expect(screen.getAllByText('Required').length).toBeGreaterThan(0));
  });

  it('clears required error on name field when filled', async () => {
    const user = userEvent.setup();
    renderSection();
    const nameInput = screen.getByPlaceholderText('Jane Doe');
    await user.click(nameInput);
    await user.tab();
    await waitFor(() => screen.getAllByText('Required').length > 0);
    await user.type(nameInput, 'Alice');
    await waitFor(() => expect(nameInput.value).toBe('Alice'));
    // Name field error should be gone; check the name field's form item specifically
    expect(nameInput.closest('.ant-form-item')).not.toHaveClass('ant-form-item-has-error');
  });
});

// ─── Validation — email format ────────────────────────────────────────────────

describe('PersonalInfoSection — email validation', () => {
  it('shows email format error for invalid email', async () => {
    const user = userEvent.setup();
    renderSection();
    const emailInput = screen.getByPlaceholderText('jane@company.com');
    await user.type(emailInput, 'notanemail');
    await user.tab();
    await waitFor(() =>
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument(),
    );
  });

  it('does not show error for valid email', async () => {
    const user = userEvent.setup();
    renderSection();
    const emailInput = screen.getByPlaceholderText('jane@company.com');
    await user.type(emailInput, 'alice@company.com');
    await user.tab();
    await waitFor(() =>
      expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument(),
    );
  });
});

// ─── Validation — phone formatting ────────────────────────────────────────────

describe('PersonalInfoSection — phone field', () => {
  it('auto-formats phone as digits are typed', async () => {
    const user = userEvent.setup();
    renderSection();
    const phoneInput = screen.getByPlaceholderText('(215) 555-0100');
    await user.type(phoneInput, '2155550100');
    expect(phoneInput.value).toBe('(215) 555-0100');
  });

  it('shows phone validation error for incomplete number', async () => {
    const user = userEvent.setup();
    renderSection();
    const phoneInput = screen.getByPlaceholderText('(215) 555-0100');
    await user.type(phoneInput, '215');
    await user.tab();
    await waitFor(() => expect(screen.getByText(/valid US phone number/i)).toBeInTheDocument());
  });

  it('clears phone error for valid formatted number', async () => {
    const user = userEvent.setup();
    renderSection();
    const phoneInput = screen.getByPlaceholderText('(215) 555-0100');
    await user.type(phoneInput, '2155550100');
    await user.tab();
    await waitFor(() =>
      expect(screen.queryByText(/valid US phone number/i)).not.toBeInTheDocument(),
    );
  });
});

// ─── Validation — SSN formatting ──────────────────────────────────────────────

describe('PersonalInfoSection — SSN field', () => {
  it('auto-formats SSN as digits are typed', async () => {
    const user = userEvent.setup();
    renderSection();
    const ssnInput = document.querySelector('input[type="password"]');
    await user.type(ssnInput, '123456789');
    expect(ssnInput.value).toBe('123-45-6789');
  });

  it('shows SSN validation error for incomplete SSN', async () => {
    const user = userEvent.setup();
    renderSection();
    const ssnInput = document.querySelector('input[type="password"]');
    await user.type(ssnInput, '123');
    await user.tab();
    await waitFor(() => expect(screen.getByText(/valid SSN/i)).toBeInTheDocument());
  });
});

// ─── Validation — address minLength ───────────────────────────────────────────

describe('PersonalInfoSection — address validation', () => {
  it('shows minLength error when address is too short', async () => {
    const user = userEvent.setup();
    renderSection();
    const addressInput = screen.getByPlaceholderText(/123 Main St/i);
    await user.type(addressInput, 'abc');
    await user.tab();
    await waitFor(() => expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument());
  });

  it('no error for address with 5+ characters', async () => {
    const user = userEvent.setup();
    renderSection();
    const addressInput = screen.getByPlaceholderText(/123 Main St/i);
    await user.type(addressInput, '123 Main St');
    await user.tab();
    await waitFor(() =>
      expect(screen.queryByText(/at least 5 characters/i)).not.toBeInTheDocument(),
    );
  });
});

// ─── Validation — bio maxLength ───────────────────────────────────────────────

describe('PersonalInfoSection — bio validation', () => {
  it('shows maxLength error when bio exceeds 500 characters', async () => {
    renderSection();
    const bioInput = screen.getByPlaceholderText(/short professional biography/i);
    // Use fireEvent to paste a long string directly — userEvent.type is too slow for 500+ chars
    fireEvent.change(bioInput, { target: { value: 'a'.repeat(501) } });
    fireEvent.blur(bioInput);
    await waitFor(() => expect(screen.getByText(/Cannot exceed 500/i)).toBeInTheDocument());
  });

  it('no error for bio within 500 characters', async () => {
    const user = userEvent.setup();
    renderSection();
    const bioInput = screen.getByPlaceholderText(/short professional biography/i);
    await user.type(bioInput, 'Short bio.');
    await user.tab();
    await waitFor(() => expect(screen.queryByText(/Cannot exceed 500/i)).not.toBeInTheDocument());
  });
});
