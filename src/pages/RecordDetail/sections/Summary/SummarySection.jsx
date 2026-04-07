import { Descriptions, Tag } from 'antd';
import { FormSpy } from 'react-final-form';
import { useIntl } from 'react-intl';

import { useLookups } from '../../../../hooks/useLookups.js';
import personalInfoMessages from '../PersonalInfo/messages.js';
import preferencesMessages from '../Preferences/messages.js';
import workInfoMessages from '../WorkInfo/messages.js';

import summaryMessages from './messages.js';

const SummarySection = () => {
  const intl = useIntl();
  const { employmentTypes, notificationChannels, accessLevels } = useLookups();

  return (
    <FormSpy subscription={{ values: true }}>
      {({ values: v }) => (
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          {/* Personal */}
          <Descriptions.Item
            label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_NAME)}
            span={2}
          >
            {v.name || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_EMAIL)}>
            {v.email || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_PHONE)}>
            {v.phone || '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_ADDRESS)}
            span={2}
          >
            {v.address || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_DOB)}>
            {v.dateOfBirth ? new Date(v.dateOfBirth).toLocaleDateString() : '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_BIO)}
            span={2}
          >
            {v.bio || '—'}
          </Descriptions.Item>

          {/* Work */}
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_JOB_TITLE)}>
            {v.jobTitle || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_DEPARTMENT)}>
            {v.department || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_STATUS)}>
            {v.status ? (
              <Tag color={v.status === 'active' ? 'green' : 'red'}>{v.status.toUpperCase()}</Tag>
            ) : (
              '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_EMPLOYMENT_TYPE)}
          >
            {employmentTypes.find((o) => o.value === v.employmentType)?.label ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_START_DATE)}>
            {v.startDate ? new Date(v.startDate).toLocaleDateString() : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_MANAGER)}>
            {v.manager || '—'}
          </Descriptions.Item>

          {/* Preferences */}
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_REMOTE_ELIGIBLE)}
          >
            {v.remoteEligible ? 'Yes' : 'No'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_NOTIFICATIONS_ENABLED)}
          >
            {v.notificationsEnabled ? 'On' : 'Off'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_NOTIFICATION_CHANNELS)}
            span={2}
          >
            {v.notificationChannels?.length
              ? v.notificationChannels.map((c) => (
                  <Tag key={c}>{notificationChannels.find((o) => o.value === c)?.label ?? c}</Tag>
                ))
              : intl.formatMessage(summaryMessages.DETAIL_SUMMARY_NONE)}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_ACCESS_LEVEL)}
          >
            {accessLevels.find((o) => o.value === v.accessLevel)?.label ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_NOTES)}
            span={2}
          >
            {v.notes || '—'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </FormSpy>
  );
};

export default SummarySection;
