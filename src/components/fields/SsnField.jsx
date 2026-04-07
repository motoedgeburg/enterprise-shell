import { Input } from 'antd';

import AntField from './AntField.jsx';

/**
 * Formats a raw digit string into XXX-XX-XXXX.
 * Strips all non-digits first, then applies the mask progressively.
 */
export const formatSsn = (raw = '') => {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (digits.length < 4) return digits;
  if (digits.length < 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

const SsnField = ({ name, label, validate, ...inputProps }) => (
  <AntField name={name} label={label} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <Input.Password
        value={value}
        onChange={(e) => onChange(formatSsn(e.target.value))}
        onBlur={onBlur}
        placeholder="•••-••-••••"
        maxLength={11}
        {...inputProps}
      />
    )}
  </AntField>
);

export default SsnField;
