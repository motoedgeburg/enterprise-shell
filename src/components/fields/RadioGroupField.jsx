import { Radio } from 'antd';

import AntField from './AntField.jsx';

/**
 * options: Array<{ value: string; label: string }>
 * Renders a horizontal Radio.Group by default; pass optionType="button" for
 * button-style toggles.
 */
const RadioGroupField = ({ name, label, options, ...props }) => (
  <AntField name={name} label={label}>
    {({ value, onChange }) => (
      <Radio.Group
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        {...props}
      />
    )}
  </AntField>
);

export default RadioGroupField;
