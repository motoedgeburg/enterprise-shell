import { Col, Row } from 'antd';
import { useIntl } from 'react-intl';

import {
  DateField,
  EmailField,
  PhoneField,
  SsnField,
  TextAreaField,
  TextField,
} from '../../../../components/fields/index.js';
import { useValidators } from '../../../../hooks/useValidators.js';

import messages from './messages.js';

const PersonalInfoSection = () => {
  const intl = useIntl();
  const { composeValidators, email, maxLength, minLength, pastDate, phone, required, ssn } =
    useValidators();

  return (
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <TextField
          name="personalInfo.name"
          label={intl.formatMessage(messages.DETAIL_FIELD_NAME)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_NAME)}
          required
          validate={required()}
        />
      </Col>
      <Col xs={24} sm={12}>
        <EmailField
          name="personalInfo.email"
          label={intl.formatMessage(messages.DETAIL_FIELD_EMAIL)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_EMAIL)}
          required
          validate={composeValidators(required(), email())}
        />
      </Col>
      <Col xs={24} sm={12}>
        <PhoneField
          name="personalInfo.phone"
          label={intl.formatMessage(messages.DETAIL_FIELD_PHONE)}
          validate={phone()}
        />
      </Col>
      <Col xs={24} sm={12}>
        <TextField
          name="personalInfo.address"
          label={intl.formatMessage(messages.DETAIL_FIELD_ADDRESS)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_ADDRESS)}
          validate={minLength(5)}
        />
      </Col>
      <Col xs={24} sm={12}>
        <DateField
          name="personalInfo.dateOfBirth"
          label={intl.formatMessage(messages.DETAIL_FIELD_DOB)}
          validate={pastDate()}
        />
      </Col>
      <Col xs={24} sm={12}>
        <SsnField
          name="personalInfo.ssn"
          label={intl.formatMessage(messages.DETAIL_FIELD_SSN)}
          validate={ssn()}
        />
      </Col>
      <Col xs={24}>
        <TextAreaField
          name="personalInfo.bio"
          label={intl.formatMessage(messages.DETAIL_FIELD_BIO)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_BIO)}
          rows={3}
          validate={maxLength(500)}
        />
      </Col>
    </Row>
  );
};

export default PersonalInfoSection;
