import { useIntl } from 'react-intl';

import validatorMessages from '../utils/validatorMessages.js';
import {
  composeValidators,
  email,
  maxLength,
  minLength,
  pastDate,
  phone,
  required,
  url,
} from '../utils/validators.js';

/**
 * Returns validator factories pre-bound to localized error messages.
 * Use this hook in components instead of importing validators directly.
 *
 * Usage:
 *   const { required, email, composeValidators } = useValidators();
 *   <TextField validate={composeValidators(required(), email())} />
 */
export const useValidators = () => {
  const intl = useIntl();

  return {
    required: (msg) =>
      required(msg ?? intl.formatMessage(validatorMessages.VALIDATOR_REQUIRED)),

    email: (msg) =>
      email(msg ?? intl.formatMessage(validatorMessages.VALIDATOR_EMAIL)),

    phone: (msg) =>
      phone(msg ?? intl.formatMessage(validatorMessages.VALIDATOR_PHONE)),

    url: (msg) =>
      url(msg ?? intl.formatMessage(validatorMessages.VALIDATOR_URL)),

    pastDate: (msg) =>
      pastDate(msg ?? intl.formatMessage(validatorMessages.VALIDATOR_PAST_DATE)),

    minLength: (n, msg) =>
      minLength(n, msg ?? intl.formatMessage(validatorMessages.VALIDATOR_MIN_LENGTH, { min: n })),

    maxLength: (n, msg) =>
      maxLength(n, msg ?? intl.formatMessage(validatorMessages.VALIDATOR_MAX_LENGTH, { max: n })),

    composeValidators,
  };
};
