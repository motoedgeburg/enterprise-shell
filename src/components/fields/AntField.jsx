import { Form } from 'antd';
import { Field } from 'react-final-form';

/**
 * Base adapter that bridges a React Final Form <Field> to an Ant Design
 * <Form.Item>.  Handles touched/error state and passes value/onChange/onBlur
 * down to whatever input is rendered via the children render-prop.
 *
 * Prefer the typed wrappers (TextField, EmailField, SelectField) over using
 * this directly.  Export it as an escape hatch for one-off custom fields.
 */
const AntField = ({ name, label, required, validate, children }) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => {
      const hasError = meta.touched && meta.error;
      return (
        <Form.Item
          label={label}
          required={required}
          validateStatus={hasError ? 'error' : ''}
          help={hasError ? meta.error : undefined}
          style={{ marginBottom: 16 }}
        >
          {children({
            value: input.value,
            onChange: input.onChange,
            onBlur: input.onBlur,
          })}
        </Form.Item>
      );
    }}
  </Field>
);

export default AntField;
