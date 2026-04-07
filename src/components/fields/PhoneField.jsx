import { Input } from 'antd';

import AntField from './AntField.jsx';

/**
 * Formats a raw digit string into (NXX) NXX-XXXX.
 * Strips all non-digits first, then applies the mask progressively.
 */
export const formatPhone = (raw = '') => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const PhoneField = ({ name, label, placeholder = '(215) 555-0100', validate, ...inputProps }) => (
  <AntField name={name} label={label} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <Input
        value={value}
        onChange={(e) => onChange(formatPhone(e.target.value))}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={14}
        {...inputProps}
      />
    )}
  </AntField>
);

export default PhoneField;
