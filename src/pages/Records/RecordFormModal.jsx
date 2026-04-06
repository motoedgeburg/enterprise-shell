import { Modal, Form, Button, Space, Alert } from 'antd';
import { Form as FinalForm } from 'react-final-form';
import { useIntl } from 'react-intl';

import { EmailField, SelectField, TextField } from '../../components/fields/index.js';

import messages from './messages.js';

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

            <TextField
              name="name"
              label={intl.formatMessage(messages.MODAL_FIELD_NAME)}
              placeholder={intl.formatMessage(messages.MODAL_FIELD_NAME_PLACEHOLDER)}
            />

            <EmailField
              name="email"
              label={intl.formatMessage(messages.MODAL_FIELD_EMAIL)}
              placeholder={intl.formatMessage(messages.MODAL_FIELD_EMAIL_PLACEHOLDER)}
            />

            <SelectField
              name="department"
              label={intl.formatMessage(messages.MODAL_FIELD_DEPARTMENT)}
              placeholder={intl.formatMessage(messages.MODAL_FIELD_DEPARTMENT_PLACEHOLDER)}
              options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
            />

            <SelectField
              name="status"
              label={intl.formatMessage(messages.MODAL_FIELD_STATUS)}
              options={[
                { value: 'active',   label: intl.formatMessage(messages.MODAL_STATUS_ACTIVE) },
                { value: 'inactive', label: intl.formatMessage(messages.MODAL_STATUS_INACTIVE) },
              ]}
            />
          </Form>
        </Modal>
      )}
    </FinalForm>
  );
};

export default RecordFormModal;
