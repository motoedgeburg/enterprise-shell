import { Space, Switch, Typography } from 'antd';

import AntField from './AntField.jsx';

const { Text } = Typography;

/**
 * Renders a labelled Switch.  The AntField wraps it in a Form.Item for
 * consistent spacing and error display.  checkedLabel / uncheckedLabel
 * are optional inline captions rendered next to the toggle.
 */
const SwitchField = ({
  name,
  label,
  checkedLabel,
  uncheckedLabel,
  required,
  validate,
  ...props
}) => (
  <AntField name={name} label={label} required={required} validate={validate}>
    {({ value, onChange, onBlur }) => (
      <Space onBlur={onBlur}>
        <Switch checked={Boolean(value)} onChange={onChange} {...props} />
        {(checkedLabel || uncheckedLabel) && (
          <Text type="secondary">{value ? checkedLabel : uncheckedLabel}</Text>
        )}
      </Space>
    )}
  </AntField>
);

export default SwitchField;
