import { InputNumber } from 'antd';

import AntField from './AntField.jsx';

/**
 * Currency input field. Displays values formatted as $XX,XXX.XX.
 * Stores a plain number (or null) in form state — no string symbols.
 */
const CurrencyField = ({ name, label, placeholder, required, validate, ...inputProps }) => (
  <AntField name={name} label={label} required={required} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <InputNumber
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        prefix="$"
        formatter={(val) => (val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
        parser={(val) => val?.replace(/[$,\s]/g, '')}
        precision={2}
        min={0}
        style={{ width: '100%' }}
        {...inputProps}
      />
    )}
  </AntField>
);

export default CurrencyField;
