import { Tabs } from 'antd';
import { useIntl } from 'react-intl';

import CertificationsTab from './Certifications/CertificationsTab.jsx';
import EmergencyContactsTab from './EmergencyContacts/EmergencyContactsTab.jsx';
import EmploymentTimeline from './EmploymentTimeline/EmploymentTimeline.jsx';
import messages from './messages.js';

const HistorySection = () => {
  const intl = useIntl();

  return (
    <Tabs
      size="small"
      items={[
        {
          key: 'contacts',
          label: intl.formatMessage(messages.DETAIL_TAB_CONTACTS),
          children: <EmergencyContactsTab />,
        },
        {
          key: 'certifications',
          label: intl.formatMessage(messages.DETAIL_TAB_CERTIFICATIONS),
          children: <CertificationsTab />,
        },
        {
          key: 'timeline',
          label: intl.formatMessage(messages.DETAIL_TAB_TIMELINE),
          children: <EmploymentTimeline />,
        },
      ]}
    />
  );
};

export default HistorySection;
