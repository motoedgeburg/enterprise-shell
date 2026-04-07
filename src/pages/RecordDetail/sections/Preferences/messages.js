const preferencesMessages = {
  // ─── Field labels ─────────────────────────────────────────────────────────
  DETAIL_FIELD_REMOTE_ELIGIBLE: {
    id: 'DETAIL_FIELD_REMOTE_ELIGIBLE',
    defaultMessage: 'Remote Work Eligible',
  },
  DETAIL_FIELD_NOTIFICATIONS_ENABLED: {
    id: 'DETAIL_FIELD_NOTIFICATIONS_ENABLED',
    defaultMessage: 'Notifications Enabled',
  },
  DETAIL_FIELD_NOTIFICATION_CHANNELS: {
    id: 'DETAIL_FIELD_NOTIFICATION_CHANNELS',
    defaultMessage: 'Notification Channels',
  },
  DETAIL_FIELD_ACCESS_LEVEL: { id: 'DETAIL_FIELD_ACCESS_LEVEL', defaultMessage: 'Access Level' },
  DETAIL_FIELD_NOTES: { id: 'DETAIL_FIELD_NOTES', defaultMessage: 'Internal Notes' },

  // ─── Notification channel options ─────────────────────────────────────────
  DETAIL_CHANNEL_EMAIL: { id: 'DETAIL_CHANNEL_EMAIL', defaultMessage: 'Email' },
  DETAIL_CHANNEL_SMS: { id: 'DETAIL_CHANNEL_SMS', defaultMessage: 'SMS' },
  DETAIL_CHANNEL_SLACK: { id: 'DETAIL_CHANNEL_SLACK', defaultMessage: 'Slack' },
  DETAIL_CHANNEL_TEAMS: { id: 'DETAIL_CHANNEL_TEAMS', defaultMessage: 'Teams' },

  // ─── Access level options ──────────────────────────────────────────────────
  DETAIL_ACCESS_READ_ONLY: { id: 'DETAIL_ACCESS_READ_ONLY', defaultMessage: 'Read-only' },
  DETAIL_ACCESS_STANDARD: { id: 'DETAIL_ACCESS_STANDARD', defaultMessage: 'Standard' },
  DETAIL_ACCESS_ADMIN: { id: 'DETAIL_ACCESS_ADMIN', defaultMessage: 'Admin' },

  // ─── Cross-section constraints ─────────────────────────────────────────────
  DETAIL_CONSTRAINT_INACTIVE: {
    id: 'DETAIL_CONSTRAINT_INACTIVE',
    defaultMessage:
      'Inactive employees are locked to Read-only access with notifications disabled.',
  },
  DETAIL_CONSTRAINT_INTERN: {
    id: 'DETAIL_CONSTRAINT_INTERN',
    defaultMessage: 'Remote work eligibility is not available for interns.',
  },
};

export default preferencesMessages;
