import { Checkbox } from 'antd';

import AntField from './AntField.jsx';

/**
 * options: Array<{ value: string; label: string }>
 * Stores the selected values as a string[] in form state.
 */
const CheckboxGroupField = ({ name, label, options, required, validate, ...props }) => (
  <AntField name={name} label={label} required={required} validate={validate}>
    {({ value, onChange }) => (
      <Checkbox.Group value={value ?? []} onChange={onChange} options={options} {...props} />
    )}
  </AntField>
);

export default CheckboxGroupField;
