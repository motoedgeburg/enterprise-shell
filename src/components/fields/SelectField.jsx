import { Select } from 'antd';

import AntField from './AntField.jsx';

const SelectField = ({ name, label, options, placeholder, validate, ...selectProps }) => (
  <AntField name={name} label={label} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <Select
        value={value || undefined}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{ width: '100%' }}
        options={options}
        {...selectProps}
      />
    )}
  </AntField>
);

export default SelectField;
