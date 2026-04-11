import { InputNumber } from 'antd';

import AntField from './AntField.jsx';

/**
 * Numeric input field. Wraps Ant Design InputNumber with React Final Form.
 * Stores a plain number (or null) in form state.
 *
 * Props like min, max, step, precision, prefix, suffix, and formatter/parser
 * are forwarded to InputNumber.
 */
const NumberField = ({ name, label, placeholder, required, validate, ...inputProps }) => (
  <AntField name={name} label={label} required={required} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <InputNumber
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{ width: '100%' }}
        {...inputProps}
      />
    )}
  </AntField>
);

export default NumberField;
