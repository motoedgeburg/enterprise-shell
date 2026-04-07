const messages = {
  // ─── Page chrome ──────────────────────────────────────────────────────────
  DETAIL_PAGE_TITLE: { id: 'DETAIL_PAGE_TITLE', defaultMessage: 'Record Detail' },
  DETAIL_BACK: { id: 'DETAIL_BACK', defaultMessage: 'Back to Results' },
  DETAIL_SUBMIT: { id: 'DETAIL_SUBMIT', defaultMessage: 'Save Changes' },
  DETAIL_SUCCESS: { id: 'DETAIL_SUCCESS', defaultMessage: 'Record updated successfully.' },
  DETAIL_ERROR_LOAD: { id: 'DETAIL_ERROR_LOAD', defaultMessage: 'Failed to load record.' },
  DETAIL_ERROR_SUBMIT: {
    id: 'DETAIL_ERROR_SUBMIT',
    defaultMessage: 'Failed to save changes. Please try again.',
  },

  // ─── Create mode ──────────────────────────────────────────────────────────
  DETAIL_CREATE_TITLE: { id: 'DETAIL_CREATE_TITLE', defaultMessage: 'New Record' },
  DETAIL_CREATE_SUBMIT: { id: 'DETAIL_CREATE_SUBMIT', defaultMessage: 'Create Record' },
  DETAIL_CREATE_SUCCESS: {
    id: 'DETAIL_CREATE_SUCCESS',
    defaultMessage: 'Record created successfully.',
  },
  DETAIL_CREATE_ERROR: {
    id: 'DETAIL_CREATE_ERROR',
    defaultMessage: 'Failed to create record. Please try again.',
  },

  // ─── Delete ───────────────────────────────────────────────────────────────
  DETAIL_ERROR_DELETE: { id: 'DETAIL_ERROR_DELETE', defaultMessage: 'Failed to delete record.' },
  DETAIL_DELETE_SUCCESS: { id: 'DETAIL_DELETE_SUCCESS', defaultMessage: 'Record deleted.' },
  DETAIL_DELETE_CONFIRM_TITLE: {
    id: 'DETAIL_DELETE_CONFIRM_TITLE',
    defaultMessage: 'Delete record',
  },
  DETAIL_DELETE_CONFIRM_DESC: {
    id: 'DETAIL_DELETE_CONFIRM_DESC',
    defaultMessage:
      'This action cannot be undone. Are you sure you want to delete \u201c{name}\u201d?',
  },
  DETAIL_DELETE_OK: { id: 'DETAIL_DELETE_OK', defaultMessage: 'Delete' },
  DETAIL_DELETE_CANCEL: { id: 'DETAIL_DELETE_CANCEL', defaultMessage: 'Cancel' },

  // ─── Section headings ─────────────────────────────────────────────────────
  DETAIL_SECTION_PERSONAL: {
    id: 'DETAIL_SECTION_PERSONAL',
    defaultMessage: 'Personal Information',
  },
  DETAIL_SECTION_WORK: { id: 'DETAIL_SECTION_WORK', defaultMessage: 'Work Information' },
  DETAIL_SECTION_PREFERENCES: {
    id: 'DETAIL_SECTION_PREFERENCES',
    defaultMessage: 'Preferences & Permissions',
  },
  DETAIL_SECTION_HISTORY: {
    id: 'DETAIL_SECTION_HISTORY',
    defaultMessage: 'Contacts & Certifications',
  },
  DETAIL_SECTION_SUMMARY: { id: 'DETAIL_SECTION_SUMMARY', defaultMessage: 'Summary' },
};

export default messages;
