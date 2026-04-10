import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import AntField from './AntField.jsx';

/**
 * Stores dates as ISO strings in the form state (YYYY-MM-DD).
 * Converts to/from dayjs internally for Ant Design DatePicker.
 */
const DateField = ({ name, label, required, validate, ...props }) => (
  <AntField name={name} label={label} required={required} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <DatePicker
        value={value ? dayjs(value) : null}
        onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
        onBlur={onBlur}
        style={{ width: '100%' }}
        {...props}
      />
    )}
  </AntField>
);

export default DateField;
