import {
  CalendarOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Empty, Timeline, Typography } from 'antd';
import { useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { useLookups } from '../../../../../hooks/useLookups.js';
import messages from './messages.js';

const { Text } = Typography;

const EVENT_CONFIG = {
  hire: { color: 'green', icon: <UserAddOutlined /> },
  compensation: { color: 'gold', icon: <DollarOutlined /> },
  certification: { color: 'blue', icon: <SafetyCertificateOutlined /> },
  expiry: { color: 'red', icon: <CalendarOutlined /> },
};

const formatCurrency = (value) =>
  `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const EmploymentTimeline = () => {
  const intl = useIntl();
  const { values } = useFormState({ subscription: { values: true } });
  const { payFrequencies } = useLookups();

  const events = [];

  // Hire date
  if (values.workInfo?.startDate) {
    events.push({
      date: values.workInfo.startDate,
      type: 'hire',
      description: intl.formatMessage(messages.TIMELINE_HIRED, {
        jobTitle: values.workInfo.jobTitle || '—',
        department: values.workInfo.department || '—',
      }),
    });
  }

  // Compensation effective date
  if (values.compensation?.effectiveDate) {
    const freqLabel =
      payFrequencies.find((o) => o.value === values.compensation.payFrequency)?.label ?? '';
    events.push({
      date: values.compensation.effectiveDate,
      type: 'compensation',
      description: intl.formatMessage(messages.TIMELINE_COMPENSATION, {
        salary: values.compensation.baseSalary
          ? formatCurrency(values.compensation.baseSalary)
          : '—',
        frequency: freqLabel,
      }),
    });
  }

  // Certifications issued
  if (values.history?.certifications?.length) {
    values.history.certifications.forEach((cert) => {
      if (cert.issueDate) {
        events.push({
          date: cert.issueDate,
          type: 'certification',
          description: intl.formatMessage(messages.TIMELINE_CERT_ISSUED, {
            name: cert.name,
            body: cert.issuingBody || '',
          }),
        });
      }
      if (cert.expiryDate) {
        events.push({
          date: cert.expiryDate,
          type: 'expiry',
          description: intl.formatMessage(messages.TIMELINE_CERT_EXPIRED, {
            name: cert.name,
          }),
        });
      }
    });
  }

  // Sort descending (most recent first)
  events.sort((a, b) => b.date.localeCompare(a.date));

  if (events.length === 0) {
    return <Empty description={intl.formatMessage(messages.TIMELINE_EMPTY)} />;
  }

  return (
    <Timeline
      mode="left"
      items={events.map((event) => ({
        color: EVENT_CONFIG[event.type].color,
        dot: EVENT_CONFIG[event.type].icon,
        label: <Text type="secondary">{intl.formatDate(event.date)}</Text>,
        children: event.description,
      }))}
    />
  );
};

export default EmploymentTimeline;
