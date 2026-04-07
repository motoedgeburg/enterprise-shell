/**
 * Composable field-level validators for React Final Form.
 *
 * Each validator is a factory that returns a validation function with the
 * signature `(value) => string | undefined`.  Return a string to signal an
 * error; return undefined to signal success.
 *
 * Do NOT import these directly into components — use the useValidators() hook
 * instead so error messages are localised via react-intl.
 *
 * Use composeValidators to chain multiple rules on a single field — the first
 * failing rule wins and subsequent rules are skipped.
 */

export const required = (msg) => (value) => {
  if (value === null || value === undefined) return msg;
  if (typeof value === 'string' && value.trim() === '') return msg;
  if (Array.isArray(value) && value.length === 0) return msg;
  return undefined;
};

export const email = (msg) => (value) => {
  if (!value) return undefined;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : msg;
};

export const phone = (msg) => (value) => {
  if (!value) return undefined;
  return /^\(\d{3}\)\s\d{3}-\d{4}$/.test(value) ? undefined : msg;
};

export const minLength = (n, msg) => (value) => {
  if (!value) return undefined;
  return value.length >= n ? undefined : msg;
};

export const maxLength = (n, msg) => (value) => {
  if (!value) return undefined;
  return value.length <= n ? undefined : msg;
};

export const pastDate = (msg) => (value) => {
  if (!value) return undefined;
  return new Date(value) < new Date() ? undefined : msg;
};

export const ssn = (msg) => (value) => {
  if (!value) return undefined;
  return /^\d{3}-\d{2}-\d{4}$/.test(value) ? undefined : msg;
};

export const url = (msg) => (value) => {
  if (!value) return undefined;
  try {
    new URL(value);
    return undefined;
  } catch {
    return msg;
  }
};

/**
 * Runs validators left-to-right and returns the first error message found.
 * Usage: validate={composeValidators(required(), maxLength(500))}
 */
export const composeValidators =
  (...validators) =>
  (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };
