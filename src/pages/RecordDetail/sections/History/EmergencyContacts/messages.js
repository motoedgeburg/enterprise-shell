const emergencyContactsMessages = {
  // ─── Shared actions ────────────────────────────────────────────────────────
  DETAIL_SUBMIT: { id: 'DETAIL_SUBMIT', defaultMessage: 'Save Changes' },
  DETAIL_DELETE_OK: { id: 'DETAIL_DELETE_OK', defaultMessage: 'Delete' },
  DETAIL_DELETE_CANCEL: { id: 'DETAIL_DELETE_CANCEL', defaultMessage: 'Cancel' },
  DETAIL_MODAL_CANCEL: { id: 'DETAIL_MODAL_CANCEL', defaultMessage: 'Cancel' },

  // ─── Emergency Contacts ────────────────────────────────────────────────────
  DETAIL_CONTACTS_COL_NAME: { id: 'DETAIL_CONTACTS_COL_NAME', defaultMessage: 'Name' },
  DETAIL_CONTACTS_COL_RELATIONSHIP: {
    id: 'DETAIL_CONTACTS_COL_RELATIONSHIP',
    defaultMessage: 'Relationship',
  },
  DETAIL_CONTACTS_COL_PHONE: { id: 'DETAIL_CONTACTS_COL_PHONE', defaultMessage: 'Phone' },
  DETAIL_CONTACTS_COL_EMAIL: { id: 'DETAIL_CONTACTS_COL_EMAIL', defaultMessage: 'Email' },
  DETAIL_CONTACTS_ADD: { id: 'DETAIL_CONTACTS_ADD', defaultMessage: 'Add Contact' },
  DETAIL_CONTACTS_ADD_TITLE: {
    id: 'DETAIL_CONTACTS_ADD_TITLE',
    defaultMessage: 'Add Emergency Contact',
  },
  DETAIL_CONTACTS_EDIT_TITLE: {
    id: 'DETAIL_CONTACTS_EDIT_TITLE',
    defaultMessage: 'Edit Emergency Contact',
  },
  DETAIL_CONTACTS_SET_PRIMARY: {
    id: 'DETAIL_CONTACTS_SET_PRIMARY',
    defaultMessage: 'Set as primary contact',
  },
  DETAIL_CONTACTS_DELETE_CONFIRM: {
    id: 'DETAIL_CONTACTS_DELETE_CONFIRM',
    defaultMessage: 'Remove this emergency contact?',
  },
  DETAIL_CONTACTS_EMPTY: {
    id: 'DETAIL_CONTACTS_EMPTY',
    defaultMessage: 'No emergency contacts on file.',
  },

  // ─── Placeholders ─────────────────────────────────────────────���───────────
  DETAIL_CONTACTS_PLACEHOLDER_NAME: {
    id: 'DETAIL_CONTACTS_PLACEHOLDER_NAME',
    defaultMessage: 'Jane Smith',
  },
  DETAIL_CONTACTS_PLACEHOLDER_RELATIONSHIP: {
    id: 'DETAIL_CONTACTS_PLACEHOLDER_RELATIONSHIP',
    defaultMessage: 'Select relationship',
  },
  DETAIL_CONTACTS_PLACEHOLDER_EMAIL: {
    id: 'DETAIL_CONTACTS_PLACEHOLDER_EMAIL',
    defaultMessage: 'jane@example.com',
  },
};

export default emergencyContactsMessages;
