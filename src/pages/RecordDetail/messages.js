const messages = {
  // ─── Page chrome ──────────────────────────────────────────────────────────
  DETAIL_PAGE_TITLE:   { id: 'DETAIL_PAGE_TITLE',   defaultMessage: 'Record Detail' },
  DETAIL_BACK:         { id: 'DETAIL_BACK',          defaultMessage: 'Back to Results' },
  DETAIL_SUBMIT:       { id: 'DETAIL_SUBMIT',        defaultMessage: 'Save Changes' },
  DETAIL_SUCCESS:      { id: 'DETAIL_SUCCESS',       defaultMessage: 'Record updated successfully.' },
  DETAIL_ERROR_LOAD:   { id: 'DETAIL_ERROR_LOAD',    defaultMessage: 'Failed to load record.' },
  DETAIL_ERROR_SUBMIT: { id: 'DETAIL_ERROR_SUBMIT',  defaultMessage: 'Failed to save changes. Please try again.' },
  DETAIL_ERROR_DELETE: { id: 'DETAIL_ERROR_DELETE',  defaultMessage: 'Failed to delete record.' },
  DETAIL_DELETE_SUCCESS:      { id: 'DETAIL_DELETE_SUCCESS',       defaultMessage: 'Record deleted.' },
  DETAIL_DELETE_CONFIRM_TITLE: { id: 'DETAIL_DELETE_CONFIRM_TITLE', defaultMessage: 'Delete record' },
  DETAIL_DELETE_CONFIRM_DESC:  { id: 'DETAIL_DELETE_CONFIRM_DESC',  defaultMessage: 'This action cannot be undone. Are you sure you want to delete \u201c{name}\u201d?' },
  DETAIL_DELETE_OK:     { id: 'DETAIL_DELETE_OK',    defaultMessage: 'Delete' },
  DETAIL_DELETE_CANCEL: { id: 'DETAIL_DELETE_CANCEL', defaultMessage: 'Cancel' },

  // ─── Section headings ─────────────────────────────────────────────────────
  DETAIL_SECTION_PERSONAL:    { id: 'DETAIL_SECTION_PERSONAL',    defaultMessage: 'Personal Information' },
  DETAIL_SECTION_WORK:        { id: 'DETAIL_SECTION_WORK',        defaultMessage: 'Work Information' },
  DETAIL_SECTION_PREFERENCES: { id: 'DETAIL_SECTION_PREFERENCES', defaultMessage: 'Preferences & Permissions' },
  DETAIL_SECTION_SUMMARY:     { id: 'DETAIL_SECTION_SUMMARY',     defaultMessage: 'Summary' },

  // ─── Personal Info fields ─────────────────────────────────────────────────
  DETAIL_FIELD_NAME:        { id: 'DETAIL_FIELD_NAME',        defaultMessage: 'Full Name' },
  DETAIL_FIELD_EMAIL:       { id: 'DETAIL_FIELD_EMAIL',       defaultMessage: 'Email' },
  DETAIL_FIELD_PHONE:       { id: 'DETAIL_FIELD_PHONE',       defaultMessage: 'Phone' },
  DETAIL_FIELD_ADDRESS:     { id: 'DETAIL_FIELD_ADDRESS',     defaultMessage: 'Address' },
  DETAIL_FIELD_DOB:         { id: 'DETAIL_FIELD_DOB',         defaultMessage: 'Date of Birth' },
  DETAIL_FIELD_BIO:         { id: 'DETAIL_FIELD_BIO',         defaultMessage: 'Bio' },

  // ─── Work Info fields ─────────────────────────────────────────────────────
  DETAIL_FIELD_JOB_TITLE:        { id: 'DETAIL_FIELD_JOB_TITLE',        defaultMessage: 'Job Title' },
  DETAIL_FIELD_DEPARTMENT:       { id: 'DETAIL_FIELD_DEPARTMENT',       defaultMessage: 'Department' },
  DETAIL_FIELD_STATUS:           { id: 'DETAIL_FIELD_STATUS',           defaultMessage: 'Status' },
  DETAIL_FIELD_EMPLOYMENT_TYPE:  { id: 'DETAIL_FIELD_EMPLOYMENT_TYPE',  defaultMessage: 'Employment Type' },
  DETAIL_FIELD_START_DATE:       { id: 'DETAIL_FIELD_START_DATE',       defaultMessage: 'Start Date' },
  DETAIL_FIELD_MANAGER:          { id: 'DETAIL_FIELD_MANAGER',          defaultMessage: 'Manager' },

  // ─── Employment type options ──────────────────────────────────────────────
  DETAIL_EMPLOYMENT_FULL_TIME: { id: 'DETAIL_EMPLOYMENT_FULL_TIME', defaultMessage: 'Full-time' },
  DETAIL_EMPLOYMENT_PART_TIME: { id: 'DETAIL_EMPLOYMENT_PART_TIME', defaultMessage: 'Part-time' },
  DETAIL_EMPLOYMENT_CONTRACT:  { id: 'DETAIL_EMPLOYMENT_CONTRACT',  defaultMessage: 'Contract' },
  DETAIL_EMPLOYMENT_INTERN:    { id: 'DETAIL_EMPLOYMENT_INTERN',    defaultMessage: 'Intern' },

  // ─── Status options ───────────────────────────────────────────────────────
  DETAIL_STATUS_ACTIVE:   { id: 'DETAIL_STATUS_ACTIVE',   defaultMessage: 'Active' },
  DETAIL_STATUS_INACTIVE: { id: 'DETAIL_STATUS_INACTIVE', defaultMessage: 'Inactive' },

  // ─── Preferences fields ───────────────────────────────────────────────────
  DETAIL_FIELD_REMOTE_ELIGIBLE:        { id: 'DETAIL_FIELD_REMOTE_ELIGIBLE',        defaultMessage: 'Remote Work Eligible' },
  DETAIL_FIELD_NOTIFICATIONS_ENABLED:  { id: 'DETAIL_FIELD_NOTIFICATIONS_ENABLED',  defaultMessage: 'Notifications Enabled' },
  DETAIL_FIELD_NOTIFICATION_CHANNELS:  { id: 'DETAIL_FIELD_NOTIFICATION_CHANNELS',  defaultMessage: 'Notification Channels' },
  DETAIL_FIELD_ACCESS_LEVEL:           { id: 'DETAIL_FIELD_ACCESS_LEVEL',           defaultMessage: 'Access Level' },
  DETAIL_FIELD_NOTES:                  { id: 'DETAIL_FIELD_NOTES',                  defaultMessage: 'Internal Notes' },

  // ─── Notification channel options ─────────────────────────────────────────
  DETAIL_CHANNEL_EMAIL: { id: 'DETAIL_CHANNEL_EMAIL', defaultMessage: 'Email' },
  DETAIL_CHANNEL_SMS:   { id: 'DETAIL_CHANNEL_SMS',   defaultMessage: 'SMS' },
  DETAIL_CHANNEL_SLACK: { id: 'DETAIL_CHANNEL_SLACK', defaultMessage: 'Slack' },
  DETAIL_CHANNEL_TEAMS: { id: 'DETAIL_CHANNEL_TEAMS', defaultMessage: 'Teams' },

  // ─── Access level options ─────────────────────────────────────────────────
  DETAIL_ACCESS_READ_ONLY: { id: 'DETAIL_ACCESS_READ_ONLY', defaultMessage: 'Read-only' },
  DETAIL_ACCESS_STANDARD:  { id: 'DETAIL_ACCESS_STANDARD',  defaultMessage: 'Standard' },
  DETAIL_ACCESS_ADMIN:     { id: 'DETAIL_ACCESS_ADMIN',      defaultMessage: 'Admin' },

  // ─── Summary labels ───────────────────────────────────────────────────────
  DETAIL_SUMMARY_PERSONAL:  { id: 'DETAIL_SUMMARY_PERSONAL',  defaultMessage: 'Personal' },
  DETAIL_SUMMARY_WORK:      { id: 'DETAIL_SUMMARY_WORK',      defaultMessage: 'Work' },
  DETAIL_SUMMARY_PREFS:     { id: 'DETAIL_SUMMARY_PREFS',     defaultMessage: 'Preferences' },
  DETAIL_SUMMARY_CHANNELS:  { id: 'DETAIL_SUMMARY_CHANNELS',  defaultMessage: 'Notification Channels' },
  DETAIL_SUMMARY_NONE:      { id: 'DETAIL_SUMMARY_NONE',      defaultMessage: 'None' },
};

export default messages;
