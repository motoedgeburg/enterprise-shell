import { Input } from 'antd';

import AntField from './AntField.jsx';

const TextField = ({ name, label, placeholder, type = 'text', validate, ...inputProps }) => (
  <AntField name={name} label={label} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        {...inputProps}
      />
    )}
  </AntField>
);

export default TextField;
