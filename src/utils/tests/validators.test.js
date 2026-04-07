/**
 * Unit tests for composable validator functions.
 * Validators are pure functions — no React context needed.
 */
import {
  composeValidators,
  email,
  maxLength,
  minLength,
  pastDate,
  phone,
  required,
  ssn,
  url,
} from '../validators.js';

const ERR = 'error';

// ─── required ─────────────────────────────────────────────────────────────────

describe('required', () => {
  const validate = required(ERR);

  it('returns error for null', () => expect(validate(null)).toBe(ERR));
  it('returns error for undefined', () => expect(validate(undefined)).toBe(ERR));
  it('returns error for empty string', () => expect(validate('')).toBe(ERR));
  it('returns error for whitespace-only string', () => expect(validate('   ')).toBe(ERR));
  it('returns error for empty array', () => expect(validate([])).toBe(ERR));
  it('returns undefined for a non-empty string', () => expect(validate('hello')).toBeUndefined());
  it('returns undefined for a non-empty array', () => expect(validate(['a'])).toBeUndefined());
  it('returns undefined for zero (falsy but valid)', () => expect(validate(0)).toBeUndefined());
});

// ─── email ────────────────────────────────────────────────────────────────────

describe('email', () => {
  const validate = email(ERR);

  it('returns undefined for empty value (optional field)', () =>
    expect(validate('')).toBeUndefined());
  it('returns undefined for null', () => expect(validate(null)).toBeUndefined());
  it('returns undefined for valid email', () =>
    expect(validate('alice@company.com')).toBeUndefined());
  it('returns undefined for email with subdomain', () =>
    expect(validate('a@b.co.uk')).toBeUndefined());
  it('returns error for missing @', () => expect(validate('notanemail')).toBe(ERR));
  it('returns error for missing domain', () => expect(validate('a@')).toBe(ERR));
  it('returns error for missing TLD', () => expect(validate('a@b')).toBe(ERR));
  it('returns error for spaces', () => expect(validate('a b@c.com')).toBe(ERR));
});

// ─── phone ────────────────────────────────────────────────────────────────────

describe('phone', () => {
  const validate = phone(ERR);

  it('returns undefined for empty value', () => expect(validate('')).toBeUndefined());
  it('returns undefined for valid US format', () =>
    expect(validate('(215) 555-0100')).toBeUndefined());
  it('returns error for digits only', () => expect(validate('2155550100')).toBe(ERR));
  it('returns error for dashes format', () => expect(validate('215-555-0100')).toBe(ERR));
  it('returns error for incomplete number', () => expect(validate('(215) 555-010')).toBe(ERR));
});

// ─── ssn ──────────────────────────────────────────────────────────────────────

describe('ssn', () => {
  const validate = ssn(ERR);

  it('returns undefined for empty value', () => expect(validate('')).toBeUndefined());
  it('returns undefined for valid SSN', () => expect(validate('123-45-6789')).toBeUndefined());
  it('returns error for digits only', () => expect(validate('123456789')).toBe(ERR));
  it('returns error for wrong format', () => expect(validate('12-345-6789')).toBe(ERR));
  it('returns error for too few digits', () => expect(validate('123-45-678')).toBe(ERR));
  it('returns error for letters', () => expect(validate('abc-de-fghi')).toBe(ERR));
});

// ─── minLength ────────────────────────────────────────────────────────────────

describe('minLength', () => {
  const validate = minLength(3, ERR);

  it('returns undefined for empty value (optional)', () => expect(validate('')).toBeUndefined());
  it('returns undefined when length equals minimum', () => expect(validate('abc')).toBeUndefined());
  it('returns undefined when length exceeds minimum', () =>
    expect(validate('abcd')).toBeUndefined());
  it('returns error when shorter than minimum', () => expect(validate('ab')).toBe(ERR));
});

// ─── maxLength ────────────────────────────────────────────────────────────────

describe('maxLength', () => {
  const validate = maxLength(5, ERR);

  it('returns undefined for empty value', () => expect(validate('')).toBeUndefined());
  it('returns undefined when length equals maximum', () =>
    expect(validate('abcde')).toBeUndefined());
  it('returns undefined when shorter than maximum', () => expect(validate('abc')).toBeUndefined());
  it('returns error when longer than maximum', () => expect(validate('abcdef')).toBe(ERR));
});

// ─── pastDate ─────────────────────────────────────────────────────────────────

describe('pastDate', () => {
  const validate = pastDate(ERR);

  it('returns undefined for empty value', () => expect(validate('')).toBeUndefined());
  it('returns undefined for a past date', () => expect(validate('1990-01-01')).toBeUndefined());
  it('returns error for a future date', () => expect(validate('2099-12-31')).toBe(ERR));
});

// ─── url ──────────────────────────────────────────────────────────────────────

describe('url', () => {
  const validate = url(ERR);

  it('returns undefined for empty value', () => expect(validate('')).toBeUndefined());
  it('returns undefined for valid https URL', () =>
    expect(validate('https://example.com')).toBeUndefined());
  it('returns undefined for valid http URL', () =>
    expect(validate('http://localhost:3000')).toBeUndefined());
  it('returns error for plain text', () => expect(validate('not a url')).toBe(ERR));
  it('returns error for missing protocol', () => expect(validate('example.com')).toBe(ERR));
});

// ─── composeValidators ────────────────────────────────────────────────────────

describe('composeValidators', () => {
  const req = required('required');
  const min = minLength(3, 'too short');

  it('returns undefined when all validators pass', () => {
    expect(composeValidators(req, min)('hello')).toBeUndefined();
  });

  it('returns the first failing error (required fails first)', () => {
    expect(composeValidators(req, min)('')).toBe('required');
  });

  it('returns the second error when first passes but second fails', () => {
    expect(composeValidators(req, min)('ab')).toBe('too short');
  });

  it('short-circuits — does not run subsequent validators after first failure', () => {
    const spy = vi.fn(() => undefined);
    composeValidators(req, spy)('');
    expect(spy).not.toHaveBeenCalled();
  });
});
