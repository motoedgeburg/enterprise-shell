import { Alert, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { DateField, RadioGroupField, SelectField, TextField } from '../../../../components/fields/index.js';
import { useLookups } from '../../../../hooks/useLookups.js';
import { useValidators } from '../../../../hooks/useValidators.js';

import messages from './messages.js';

const WorkInfoSection = () => {
  const intl = useIntl();
  const { departments, statuses, employmentTypes } = useLookups();
  const { pastDate, required } = useValidators();

  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });

  const isAdmin = values.accessLevel === 'admin';

  // Preferences → Work: admin access level requires active status
  useEffect(() => {
    if (isAdmin) form.change('status', 'active');
  }, [isAdmin, form]);

  return (
    <Row gutter={[16, 0]}>

      {/* Cross-section constraint notice */}
      {isAdmin && (
        <Col xs={24} style={{ marginBottom: 8 }}>
          <Alert type="info" showIcon
            message={intl.formatMessage(messages.DETAIL_CONSTRAINT_ADMIN)}
          />
        </Col>
      )}

      <Col xs={24} sm={12}>
        <TextField
          name="jobTitle"
          label={intl.formatMessage(messages.DETAIL_FIELD_JOB_TITLE)}
          placeholder="Software Engineer"
          validate={required()}
        />
      </Col>
      <Col xs={24} sm={12}>
        <TextField
          name="manager"
          label={intl.formatMessage(messages.DETAIL_FIELD_MANAGER)}
          placeholder="Manager name"
        />
      </Col>
      <Col xs={24} sm={12}>
        <SelectField
          name="department"
          label={intl.formatMessage(messages.DETAIL_FIELD_DEPARTMENT)}
          options={departments.map((d) => ({ value: d, label: d }))}
          validate={required()}
        />
      </Col>
      <Col xs={24} sm={12}>
        <SelectField
          name="status"
          label={intl.formatMessage(messages.DETAIL_FIELD_STATUS)}
          options={statuses}
          validate={required()}
          disabled={isAdmin}
        />
      </Col>
      <Col xs={24} sm={12}>
        <DateField
          name="startDate"
          label={intl.formatMessage(messages.DETAIL_FIELD_START_DATE)}
          validate={pastDate()}
        />
      </Col>
      <Col xs={24}>
        <RadioGroupField
          name="employmentType"
          label={intl.formatMessage(messages.DETAIL_FIELD_EMPLOYMENT_TYPE)}
          options={employmentTypes}
          optionType="button"
          buttonStyle="solid"
          validate={required()}
        />
      </Col>
    </Row>
  );
};

export default WorkInfoSection;
