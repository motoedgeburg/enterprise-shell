const validatorMessages = {
  VALIDATOR_REQUIRED: { id: 'VALIDATOR_REQUIRED', defaultMessage: 'Required' },
  VALIDATOR_EMAIL: { id: 'VALIDATOR_EMAIL', defaultMessage: 'Enter a valid email address' },
  VALIDATOR_PHONE: {
    id: 'VALIDATOR_PHONE',
    defaultMessage: 'Enter a valid US phone number, e.g. (215) 555-0100',
  },
  VALIDATOR_SSN: { id: 'VALIDATOR_SSN', defaultMessage: 'Enter a valid SSN, e.g. 123-45-6789' },
  VALIDATOR_URL: { id: 'VALIDATOR_URL', defaultMessage: 'Enter a valid URL' },
  VALIDATOR_PAST_DATE: { id: 'VALIDATOR_PAST_DATE', defaultMessage: 'Date must be in the past' },
  VALIDATOR_MIN_LENGTH: {
    id: 'VALIDATOR_MIN_LENGTH',
    defaultMessage: 'Must be at least {min} characters',
  },
  VALIDATOR_MAX_LENGTH: {
    id: 'VALIDATOR_MAX_LENGTH',
    defaultMessage: 'Cannot exceed {max} characters',
  },
};

export default validatorMessages;
