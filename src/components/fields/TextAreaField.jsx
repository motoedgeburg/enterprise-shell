import { Input } from 'antd';

import AntField from './AntField.jsx';

const { TextArea } = Input;

const TextAreaField = ({ name, label, placeholder, rows = 3, validate, ...props }) => (
  <AntField name={name} label={label} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    )}
  </AntField>
);

export default TextAreaField;
