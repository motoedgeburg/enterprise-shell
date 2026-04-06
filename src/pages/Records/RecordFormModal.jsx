import { Modal, Form, Input, Select, Button, Space, Alert } from 'antd';
import { Form as FinalForm, Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import messages from './messages.js';

// ─── Field adapter — bridges React Final Form ↔ Ant Design ───────────────────

const AntField = ({ name, label, children }) => (
  <Field name={name}>
    {({ input, meta }) => {
      const hasError = meta.touched && meta.error;
      return (
        <Form.Item
          label={label}
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

// ─── Modal Component ──────────────────────────────────────────────────────────

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'HR'];

const RecordFormModal = ({ open, record, onSubmit, onCancel }) => {
  const intl = useIntl();
  const isEdit = Boolean(record);
  const title = isEdit
    ? intl.formatMessage(messages.MODAL_TITLE_EDIT)
    : intl.formatMessage(messages.MODAL_TITLE_ADD);

  // ── Validation ──────────────────────────────────────────────────────────────
  // Defined inside the component so it can call intl.formatMessage.

  const validate = (values) => {
    const errors = {};

    if (!values.name?.trim()) {
      errors.name = intl.formatMessage(messages.MODAL_VALIDATION_NAME_REQUIRED);
    }

    if (!values.email?.trim()) {
      errors.email = intl.formatMessage(messages.MODAL_VALIDATION_EMAIL_REQUIRED);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = intl.formatMessage(messages.MODAL_VALIDATION_EMAIL_INVALID);
    }

    if (!values.department?.trim()) {
      errors.department = intl.formatMessage(messages.MODAL_VALIDATION_DEPARTMENT_REQUIRED);
    }

    if (!values.status) {
      errors.status = intl.formatMessage(messages.MODAL_VALIDATION_STATUS_REQUIRED);
    }

    return errors;
  };

  const initialValues = record
    ? {
        name: record.name,
        email: record.email,
        department: record.department,
        status: record.status,
      }
    : { status: 'active' };

  return (
    <FinalForm
      onSubmit={onSubmit}
      validate={validate}
      initialValues={initialValues}
    >
      {({ handleSubmit, submitting, submitError, pristine }) => (
        <Modal
          title={title}
          open={open}
          onCancel={onCancel}
          destroyOnHidden
          footer={
            <Space>
              <Button onClick={onCancel} disabled={submitting}>
                {intl.formatMessage(messages.MODAL_CANCEL)}
              </Button>
              <Button
                type="primary"
                loading={submitting}
                disabled={pristine && isEdit}
                onClick={() => void handleSubmit()}
              >
                {isEdit
                  ? intl.formatMessage(messages.MODAL_SAVE)
                  : intl.formatMessage(messages.MODAL_CREATE)}
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" component="div">
            {submitError && (
              <Alert
                type="error"
                message={submitError}
                style={{ marginBottom: 16 }}
                showIcon
              />
            )}

            <AntField name="name" label={intl.formatMessage(messages.MODAL_FIELD_NAME)}>
              {({ value, onChange, onBlur }) => (
                <Input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  placeholder={intl.formatMessage(messages.MODAL_FIELD_NAME_PLACEHOLDER)}
                />
              )}
            </AntField>

            <AntField name="email" label={intl.formatMessage(messages.MODAL_FIELD_EMAIL)}>
              {({ value, onChange, onBlur }) => (
                <Input
                  type="email"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={onBlur}
                  placeholder={intl.formatMessage(messages.MODAL_FIELD_EMAIL_PLACEHOLDER)}
                />
              )}
            </AntField>

            <AntField
              name="department"
              label={intl.formatMessage(messages.MODAL_FIELD_DEPARTMENT)}
            >
              {({ value, onChange, onBlur }) => (
                <Select
                  value={value || undefined}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={intl.formatMessage(messages.MODAL_FIELD_DEPARTMENT_PLACEHOLDER)}
                  style={{ width: '100%' }}
                  options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                />
              )}
            </AntField>

            <AntField name="status" label={intl.formatMessage(messages.MODAL_FIELD_STATUS)}>
              {({ value, onChange, onBlur }) => (
                <Select
                  value={value || undefined}
                  onChange={onChange}
                  onBlur={onBlur}
                  style={{ width: '100%' }}
                  options={[
                    {
                      value: 'active',
                      label: intl.formatMessage(messages.MODAL_STATUS_ACTIVE),
                    },
                    {
                      value: 'inactive',
                      label: intl.formatMessage(messages.MODAL_STATUS_INACTIVE),
                    },
                  ]}
                />
              )}
            </AntField>
          </Form>
        </Modal>
      )}
    </FinalForm>
  );
};

export default RecordFormModal;
