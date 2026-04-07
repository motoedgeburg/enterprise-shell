import { Alert, Col, Divider, Row } from 'antd';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-final-form';
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

  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });

  const isInactive = values.status === 'inactive';
  const isIntern   = values.employmentType === 'intern';
  const notifsOff  = !values.notificationsEnabled;

  // Work → Preferences: inactive employees are locked to read-only access
  useEffect(() => {
    if (isInactive) form.change('accessLevel', 'read-only');
  }, [isInactive, form]);

  // Work → Preferences: interns cannot be remote eligible
  useEffect(() => {
    if (isIntern) form.change('remoteEligible', false);
  }, [isIntern, form]);

  return (
    <Row gutter={[16, 0]}>

      {/* Cross-section constraint notices */}
      {isInactive && (
        <Col xs={24} style={{ marginBottom: 8 }}>
          <Alert type="warning" showIcon
            message={intl.formatMessage(messages.DETAIL_CONSTRAINT_INACTIVE)}
          />
        </Col>
      )}
      {isIntern && (
        <Col xs={24} style={{ marginBottom: 8 }}>
          <Alert type="info" showIcon
            message={intl.formatMessage(messages.DETAIL_CONSTRAINT_INTERN)}
          />
        </Col>
      )}

      <Col xs={24} sm={12}>
        <SwitchField
          name="remoteEligible"
          label={intl.formatMessage(messages.DETAIL_FIELD_REMOTE_ELIGIBLE)}
          checkedLabel="Eligible"
          uncheckedLabel="Not eligible"
          disabled={isIntern}
        />
      </Col>
      <Col xs={24} sm={12}>
        <SwitchField
          name="notificationsEnabled"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATIONS_ENABLED)}
          checkedLabel="On"
          uncheckedLabel="Off"
          disabled={isInactive}
        />
      </Col>
      <Col xs={24}>
        <CheckboxGroupField
          name="notificationChannels"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATION_CHANNELS)}
          options={notificationChannels}
          disabled={notifsOff || isInactive}
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
          disabled={isInactive}
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
