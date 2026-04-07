import { Col, Row } from 'antd';
import { useIntl } from 'react-intl';

import { DateField, EmailField, TextAreaField, TextField } from '../../../components/fields/index.js';
import messages from '../messages.js';

const PersonalInfoSection = () => {
  const intl = useIntl();

  return (
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <TextField
          name="name"
          label={intl.formatMessage(messages.DETAIL_FIELD_NAME)}
          placeholder="Jane Doe"
        />
      </Col>
      <Col xs={24} sm={12}>
        <EmailField
          name="email"
          label={intl.formatMessage(messages.DETAIL_FIELD_EMAIL)}
          placeholder="jane@company.com"
        />
      </Col>
      <Col xs={24} sm={12}>
        <TextField
          name="phone"
          label={intl.formatMessage(messages.DETAIL_FIELD_PHONE)}
          placeholder="(215) 555-0100"
        />
      </Col>
      <Col xs={24} sm={12}>
        <TextField
          name="address"
          label={intl.formatMessage(messages.DETAIL_FIELD_ADDRESS)}
          placeholder="123 Main St, Philadelphia, PA 19103"
        />
      </Col>
      <Col xs={24} sm={12}>
        <DateField
          name="dateOfBirth"
          label={intl.formatMessage(messages.DETAIL_FIELD_DOB)}
        />
      </Col>
      <Col xs={24}>
        <TextAreaField
          name="bio"
          label={intl.formatMessage(messages.DETAIL_FIELD_BIO)}
          placeholder="A short professional biography…"
          rows={3}
        />
      </Col>
    </Row>
  );
};

export default PersonalInfoSection;
