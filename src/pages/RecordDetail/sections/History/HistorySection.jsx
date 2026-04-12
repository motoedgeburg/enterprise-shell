import { Badge, Tabs } from 'antd';
import { useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import AuditTrail from './AuditTrail/AuditTrail.jsx';
import CertificationsTab from './Certifications/CertificationsTab.jsx';
import EmergencyContactsTab from './EmergencyContacts/EmergencyContactsTab.jsx';
import messages from './messages.js';

/** Count audit log entries that have been stamped by the backend. */
const useAuditEntryCount = () => {
  const { values } = useFormState({ subscription: { values: true } });
  if (!values.auditLog?.length) return 0;
  return values.auditLog.filter((e) => e.savedAt).length;
};

const HistorySection = () => {
  const intl = useIntl();
  const auditCount = useAuditEntryCount();

  return (
    <Tabs
      size="small"
      defaultActiveKey="audit"
      items={[
        {
          key: 'audit',
          label: (
            <span>
              {intl.formatMessage(messages.DETAIL_TAB_AUDIT)}
              {auditCount > 0 && (
                <Badge
                  count={auditCount}
                  color="blue"
                  size="small"
                  style={{ marginLeft: 8, boxShadow: 'none' }}
                />
              )}
            </span>
          ),
          children: <AuditTrail />,
        },
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
      ]}
    />
  );
};

export default HistorySection;
