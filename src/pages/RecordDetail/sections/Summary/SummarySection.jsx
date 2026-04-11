import { Descriptions, Tag } from 'antd';
import { FormSpy } from 'react-final-form';
import { useIntl } from 'react-intl';

import { useLookups } from '../../../../hooks/useLookups.js';
import compensationMessages from '../Compensation/messages.js';
import personalInfoMessages from '../PersonalInfo/messages.js';
import preferencesMessages from '../Preferences/messages.js';
import workInfoMessages from '../WorkInfo/messages.js';

import summaryMessages from './messages.js';

const STATUS_COLOR = {
  active: 'green',
  inactive: 'default',
  'on-leave': 'orange',
  terminated: 'red',
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—';
  return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const SummarySection = () => {
  const intl = useIntl();
  const { employmentTypes, notificationChannels, accessLevels, payFrequencies } = useLookups();

  return (
    <FormSpy subscription={{ values: true }}>
      {({ values: v }) => (
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          {/* Personal */}
          <Descriptions.Item
            label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_NAME)}
            span={2}
          >
            {v.personalInfo?.name || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_EMAIL)}>
            {v.personalInfo?.email || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_PHONE)}>
            {v.personalInfo?.phone || '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_ADDRESS)}
            span={2}
          >
            {v.personalInfo?.address || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_DOB)}>
            {v.personalInfo?.dateOfBirth ? intl.formatDate(v.personalInfo.dateOfBirth) : '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(personalInfoMessages.DETAIL_FIELD_BIO)}
            span={2}
          >
            {v.personalInfo?.bio || '—'}
          </Descriptions.Item>

          {/* Work */}
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_JOB_TITLE)}>
            {v.workInfo?.jobTitle || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_DEPARTMENT)}>
            {v.workInfo?.department || '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_STATUS)}>
            {v.workInfo?.status ? (
              <Tag color={STATUS_COLOR[v.workInfo.status] ?? 'default'}>
                {v.workInfo.status.toUpperCase()}
              </Tag>
            ) : (
              '—'
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_EMPLOYMENT_TYPE)}
          >
            {employmentTypes.find((o) => o.value === v.workInfo?.employmentType)?.label ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_START_DATE)}>
            {v.workInfo?.startDate ? intl.formatDate(v.workInfo.startDate) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage(workInfoMessages.DETAIL_FIELD_MANAGER)}>
            {v.workInfo?.manager || '—'}
          </Descriptions.Item>

          {/* Preferences */}
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_REMOTE_ELIGIBLE)}
          >
            {intl.formatMessage(
              v.preferences?.remoteEligible
                ? summaryMessages.DETAIL_SUMMARY_YES
                : summaryMessages.DETAIL_SUMMARY_NO,
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_NOTIFICATIONS_ENABLED)}
          >
            {intl.formatMessage(
              v.preferences?.notificationsEnabled
                ? summaryMessages.DETAIL_SUMMARY_ON
                : summaryMessages.DETAIL_SUMMARY_OFF,
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_NOTIFICATION_CHANNELS)}
            span={2}
          >
            {v.preferences?.notificationChannels?.length
              ? v.preferences.notificationChannels.map((c) => (
                  <Tag key={c}>{notificationChannels.find((o) => o.value === c)?.label ?? c}</Tag>
                ))
              : intl.formatMessage(summaryMessages.DETAIL_SUMMARY_NONE)}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_ACCESS_LEVEL)}
          >
            {accessLevels.find((o) => o.value === v.preferences?.accessLevel)?.label ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(preferencesMessages.DETAIL_FIELD_NOTES)}
            span={2}
          >
            {v.preferences?.notes || '—'}
          </Descriptions.Item>

          {/* Compensation */}
          <Descriptions.Item
            label={intl.formatMessage(compensationMessages.DETAIL_FIELD_BASE_SALARY)}
          >
            {formatCurrency(v.compensation?.baseSalary)}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(compensationMessages.DETAIL_FIELD_PAY_FREQUENCY)}
          >
            {payFrequencies.find((o) => o.value === v.compensation?.payFrequency)?.label ?? '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(compensationMessages.DETAIL_FIELD_BONUS_TARGET)}
          >
            {v.compensation?.bonusTarget !== null && v.compensation?.bonusTarget !== undefined
              ? `${v.compensation.bonusTarget}%`
              : '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(compensationMessages.DETAIL_FIELD_STOCK_OPTIONS)}
          >
            {v.compensation?.stockOptions !== null && v.compensation?.stockOptions !== undefined
              ? v.compensation.stockOptions.toLocaleString()
              : '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(compensationMessages.DETAIL_FIELD_EFFECTIVE_DATE)}
          >
            {v.compensation?.effectiveDate ? intl.formatDate(v.compensation.effectiveDate) : '—'}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.formatMessage(compensationMessages.DETAIL_FIELD_OVERTIME_ELIGIBLE)}
          >
            {intl.formatMessage(
              v.compensation?.overtimeEligible
                ? summaryMessages.DETAIL_SUMMARY_YES
                : summaryMessages.DETAIL_SUMMARY_NO,
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </FormSpy>
  );
};

export default SummarySection;
