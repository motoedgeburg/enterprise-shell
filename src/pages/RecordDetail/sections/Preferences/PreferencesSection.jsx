import { Alert, Col, Divider, Row } from 'antd';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  CheckboxGroupField,
  RadioGroupField,
  SwitchField,
  TextAreaField,
} from '../../../../components/fields/index.js';
import { useLookups } from '../../../../hooks/useLookups.js';
import { useValidators } from '../../../../hooks/useValidators.js';

import messages from './messages.js';

const PreferencesSection = () => {
  const intl = useIntl();
  const { notificationChannels, accessLevels } = useLookups();
  const { maxLength, required } = useValidators();

  const form = useForm();
  const { values } = useFormState({ subscription: { values: true } });

  const isInactive = values.workInfo?.status === 'inactive';
  const isIntern = values.workInfo?.employmentType === 'intern';
  const notifsOff = !values.preferences?.notificationsEnabled;

  // Work → Preferences: inactive employees are locked to restricted access
  useEffect(() => {
    if (isInactive) form.change('preferences.accessLevel', 'restricted');
  }, [isInactive, form]);

  // Work → Preferences: interns cannot be remote eligible
  useEffect(() => {
    if (isIntern) form.change('preferences.remoteEligible', false);
  }, [isIntern, form]);

  return (
    <Row gutter={[16, 0]}>
      {/* Cross-section constraint notices */}
      {isInactive && (
        <Col xs={24} style={{ marginBottom: 8 }}>
          <Alert
            type="warning"
            showIcon
            message={intl.formatMessage(messages.DETAIL_CONSTRAINT_INACTIVE)}
          />
        </Col>
      )}
      {isIntern && (
        <Col xs={24} style={{ marginBottom: 8 }}>
          <Alert
            type="info"
            showIcon
            message={intl.formatMessage(messages.DETAIL_CONSTRAINT_INTERN)}
          />
        </Col>
      )}

      <Col xs={24} sm={12}>
        <SwitchField
          name="preferences.remoteEligible"
          label={intl.formatMessage(messages.DETAIL_FIELD_REMOTE_ELIGIBLE)}
          checkedLabel={intl.formatMessage(messages.DETAIL_SWITCH_ELIGIBLE)}
          uncheckedLabel={intl.formatMessage(messages.DETAIL_SWITCH_NOT_ELIGIBLE)}
          disabled={isIntern}
        />
      </Col>
      <Col xs={24} sm={12}>
        <SwitchField
          name="preferences.notificationsEnabled"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATIONS_ENABLED)}
          checkedLabel={intl.formatMessage(messages.DETAIL_SWITCH_ON)}
          uncheckedLabel={intl.formatMessage(messages.DETAIL_SWITCH_OFF)}
          disabled={isInactive}
        />
      </Col>
      <Col xs={24}>
        <CheckboxGroupField
          name="preferences.notificationChannels"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTIFICATION_CHANNELS)}
          options={notificationChannels}
          disabled={notifsOff || isInactive}
        />
      </Col>
      <Col xs={24}>
        <Divider style={{ margin: '8px 0 16px' }} />
        <RadioGroupField
          name="preferences.accessLevel"
          label={intl.formatMessage(messages.DETAIL_FIELD_ACCESS_LEVEL)}
          options={accessLevels}
          optionType="button"
          buttonStyle="solid"
          required
          validate={required()}
          disabled={isInactive}
        />
      </Col>
      <Col xs={24}>
        <TextAreaField
          name="preferences.notes"
          label={intl.formatMessage(messages.DETAIL_FIELD_NOTES)}
          placeholder={intl.formatMessage(messages.DETAIL_PLACEHOLDER_NOTES)}
          rows={4}
          validate={maxLength(1000)}
        />
      </Col>
    </Row>
  );
};

export default PreferencesSection;
