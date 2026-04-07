const historyMessages = {
  // ─── Shared actions ────────────────────────────────────────────────────────
  DETAIL_SUBMIT: { id: 'DETAIL_SUBMIT', defaultMessage: 'Save Changes' },
  DETAIL_DELETE_OK: { id: 'DETAIL_DELETE_OK', defaultMessage: 'Delete' },
  DETAIL_DELETE_CANCEL: { id: 'DETAIL_DELETE_CANCEL', defaultMessage: 'Cancel' },

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  DETAIL_TAB_CONTACTS: { id: 'DETAIL_TAB_CONTACTS', defaultMessage: 'Emergency Contacts' },
  DETAIL_TAB_CERTIFICATIONS: {
    id: 'DETAIL_TAB_CERTIFICATIONS',
    defaultMessage: 'Professional Certifications',
  },

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

  // ─── Professional Certifications ───────────────────────────────────────────
  DETAIL_CERTS_COL_NAME: { id: 'DETAIL_CERTS_COL_NAME', defaultMessage: 'Certification' },
  DETAIL_CERTS_COL_ISSUER: { id: 'DETAIL_CERTS_COL_ISSUER', defaultMessage: 'Issuing Body' },
  DETAIL_CERTS_COL_ISSUE_DATE: { id: 'DETAIL_CERTS_COL_ISSUE_DATE', defaultMessage: 'Issue Date' },
  DETAIL_CERTS_COL_EXPIRY: { id: 'DETAIL_CERTS_COL_EXPIRY', defaultMessage: 'Expiry Date' },
  DETAIL_CERTS_COL_STATUS: { id: 'DETAIL_CERTS_COL_STATUS', defaultMessage: 'Status' },
  DETAIL_CERTS_CREDENTIAL_ID: { id: 'DETAIL_CERTS_CREDENTIAL_ID', defaultMessage: 'Credential ID' },
  DETAIL_CERTS_ADD: { id: 'DETAIL_CERTS_ADD', defaultMessage: 'Add Certification' },
  DETAIL_CERTS_ADD_TITLE: { id: 'DETAIL_CERTS_ADD_TITLE', defaultMessage: 'Add Certification' },
  DETAIL_CERTS_EDIT_TITLE: { id: 'DETAIL_CERTS_EDIT_TITLE', defaultMessage: 'Edit Certification' },
  DETAIL_CERTS_DELETE_CONFIRM: {
    id: 'DETAIL_CERTS_DELETE_CONFIRM',
    defaultMessage: 'Remove this certification?',
  },
  DETAIL_CERTS_EMPTY: { id: 'DETAIL_CERTS_EMPTY', defaultMessage: 'No certifications on file.' },
};

export default historyMessages;
