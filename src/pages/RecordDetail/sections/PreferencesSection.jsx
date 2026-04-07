import { Col, Divider, Row } from 'antd';
import { useIntl } from 'react-intl';

import {
  CheckboxGroupField,
  RadioGroupField,
  SwitchField,
  TextAreaField,
} from '../../../components/fields/index.js';
import { useLookups } from '../../../hooks/useLookups.js';
import { useValidators } from '../../../hooks/useValidators.js';
import messages from '../messages.js';

const PreferencesSection = () => {
  const intl = useIntl();
  const { notificationChannels, accessLevels } = useLookups();
  const { maxLength, required } = useValidators();

  return (
    <Row gutter={[16, 0]}>
      <Col xs={24} sm={12}>
        <SwitchField
          name="remoteEligible"
          label={intl.formatMessage(messages.DETAIL_FIELD_REMOTE_ELIGIBLE)}
          checkedLabel="Eligible"
          uncheckedLabel="Not eligible"
        />
      </Col>
      <Col xs={24} sm={12}>
        <SwitchField
          name="notificationsEnabled"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATIONS_ENABLED)}
          checkedLabel="On"
          uncheckedLabel="Off"
        />
      </Col>
      <Col xs={24}>
        <CheckboxGroupField
          name="notificationChannels"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATION_CHANNELS)}
          options={notificationChannels}
        />
      </Col>
      <Col xs={24}>
        <Divider style={{ margin: '8px 0 16px' }} />
        <RadioGroupField
          name="accessLevel"
          label={intl.formatMessage(messages.DETAIL_FIELD_ACCESS_LEVEL)}
          options={accessLevels}
          optionType="button"
          buttonStyle="solid"
          validate={required()}
        />
      </Col>
      <Col xs={24}>
        <TextAreaField
          name="notes"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTES)}
          placeholder="Internal notes visible to managers and HR only…"
          rows={4}
          validate={maxLength(1000)}
        />
      </Col>
    </Row>
  );
};

export default PreferencesSection;
