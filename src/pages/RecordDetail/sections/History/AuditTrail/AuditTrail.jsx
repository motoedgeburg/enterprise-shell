import { CommentOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Empty, Timeline, Typography } from 'antd';
import { useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import messages from './messages.js';

const { Text } = Typography;

const EVENT_CONFIG = {
  create: { color: 'green', icon: <PlusCircleOutlined /> },
  edit: { color: 'purple', icon: <EditOutlined /> },
};

/** Renders the children content for a single audit item. */
const AuditEventContent = ({ description, savedBy, note }) => (
  <div>
    <div>{description}</div>
    {savedBy && (
      <Text type="secondary" style={{ fontSize: 12 }}>
        by {savedBy}
      </Text>
    )}
    {note && (
      <div
        style={{
          marginTop: 4,
          paddingLeft: 8,
          borderLeft: '2px solid #d9d9d9',
        }}
      >
        <Text type="secondary" italic style={{ fontSize: 12 }}>
          <CommentOutlined style={{ marginRight: 4 }} />
          {note}
        </Text>
      </div>
    )}
  </div>
);

const AuditTrail = () => {
  const intl = useIntl();
  const { values } = useFormState({ subscription: { values: true } });

  const events = [];

  if (values.auditLog?.length) {
    values.auditLog.forEach((entry) => {
      if (!entry.savedAt) return;
      const isCreate = entry.type === 'create';
      events.push({
        date: entry.savedAt,
        type: isCreate ? 'create' : 'edit',
        description: intl.formatMessage(isCreate ? messages.AUDIT_CREATED : messages.AUDIT_EDITED),
        savedBy: entry.savedBy || null,
        note: entry.note || null,
      });
    });
  }

  // Sort descending (most recent first)
  events.sort((a, b) => b.date.localeCompare(a.date));

  if (events.length === 0) {
    return <Empty description={intl.formatMessage(messages.AUDIT_EMPTY)} />;
  }

  return (
    <div
      style={{
        maxHeight: 250,
        overflowY: 'auto',
        maxWidth: '80%',
        margin: '0 auto',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: '12px 16px 0',
      }}
    >
      <Timeline
        titleSpan="20%"
        items={events.map((event) => ({
          color: EVENT_CONFIG[event.type].color,
          dot: EVENT_CONFIG[event.type].icon,
          label: (
            <Text type="secondary">
              {intl.formatDate(event.date)} {intl.formatTime(event.date)}
            </Text>
          ),
          children: (
            <AuditEventContent
              description={event.description}
              savedBy={event.savedBy}
              note={event.note}
            />
          ),
        }))}
      />
    </div>
  );
};

export default AuditTrail;
