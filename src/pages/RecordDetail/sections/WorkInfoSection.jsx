import { Col, Row } from 'antd';
import { useIntl } from 'react-intl';

import { DateField, RadioGroupField, SelectField, TextField } from '../../../components/fields/index.js';
import { useLookups } from '../../../hooks/useLookups.js';
import messages from '../messages.js';

const WorkInfoSection = () => {
  const intl = useIntl();
  const { departments, statuses, employmentTypes } = useLookups();

  return (
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <TextField
          name="jobTitle"
          label={intl.formatMessage(messages.DETAIL_FIELD_JOB_TITLE)}
          placeholder="Software Engineer"
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
        />
      </Col>
      <Col xs={24} sm={12}>
        <SelectField
          name="status"
          label={intl.formatMessage(messages.DETAIL_FIELD_STATUS)}
          options={statuses}
        />
      </Col>
      <Col xs={24} sm={12}>
        <DateField
          name="startDate"
          label={intl.formatMessage(messages.DETAIL_FIELD_START_DATE)}
        />
      </Col>
      <Col xs={24}>
        <RadioGroupField
          name="employmentType"
          label={intl.formatMessage(messages.DETAIL_FIELD_EMPLOYMENT_TYPE)}
          options={employmentTypes}
          optionType="button"
          buttonStyle="solid"
        />
      </Col>
    </Row>
  );
};

export default WorkInfoSection;
