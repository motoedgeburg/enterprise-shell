const certificationsMessages = {
  // ─── Shared actions ────────────────────────────────────────────────────────
  DETAIL_SUBMIT: { id: 'DETAIL_SUBMIT', defaultMessage: 'Save Changes' },
  DETAIL_DELETE_OK: { id: 'DETAIL_DELETE_OK', defaultMessage: 'Delete' },
  DETAIL_DELETE_CANCEL: { id: 'DETAIL_DELETE_CANCEL', defaultMessage: 'Cancel' },

  // ─── Professional Certifications ───────────────────────────────────────────
  DETAIL_CERTS_COL_NAME: { id: 'DETAIL_CERTS_COL_NAME', defaultMessage: 'Certification' },
  DETAIL_CERTS_COL_ISSUER: { id: 'DETAIL_CERTS_COL_ISSUER', defaultMessage: 'Issuing Body' },
  DETAIL_CERTS_COL_ISSUE_DATE: {
    id: 'DETAIL_CERTS_COL_ISSUE_DATE',
    defaultMessage: 'Issue Date',
  },
  DETAIL_CERTS_COL_EXPIRY: { id: 'DETAIL_CERTS_COL_EXPIRY', defaultMessage: 'Expiry Date' },
  DETAIL_CERTS_COL_STATUS: { id: 'DETAIL_CERTS_COL_STATUS', defaultMessage: 'Status' },
  DETAIL_CERTS_CREDENTIAL_ID: {
    id: 'DETAIL_CERTS_CREDENTIAL_ID',
    defaultMessage: 'Credential ID',
  },
  DETAIL_CERTS_ADD: { id: 'DETAIL_CERTS_ADD', defaultMessage: 'Add Certification' },
  DETAIL_CERTS_ADD_TITLE: { id: 'DETAIL_CERTS_ADD_TITLE', defaultMessage: 'Add Certification' },
  DETAIL_CERTS_EDIT_TITLE: {
    id: 'DETAIL_CERTS_EDIT_TITLE',
    defaultMessage: 'Edit Certification',
  },
  DETAIL_CERTS_DELETE_CONFIRM: {
    id: 'DETAIL_CERTS_DELETE_CONFIRM',
    defaultMessage: 'Remove this certification?',
  },
  DETAIL_CERTS_EMPTY: {
    id: 'DETAIL_CERTS_EMPTY',
    defaultMessage: 'No certifications on file.',
  },

  // ─���─ Placeholders ─────────────────────────────────────────────────────────
  DETAIL_CERTS_PLACEHOLDER_NAME: {
    id: 'DETAIL_CERTS_PLACEHOLDER_NAME',
    defaultMessage: 'AWS Solutions Architect',
  },
  DETAIL_CERTS_PLACEHOLDER_ISSUER: {
    id: 'DETAIL_CERTS_PLACEHOLDER_ISSUER',
    defaultMessage: 'Amazon Web Services',
  },
  DETAIL_CERTS_PLACEHOLDER_CREDENTIAL_ID: {
    id: 'DETAIL_CERTS_PLACEHOLDER_CREDENTIAL_ID',
    defaultMessage: 'Optional',
  },
  DETAIL_CERTS_PLACEHOLDER_EXPIRY: {
    id: 'DETAIL_CERTS_PLACEHOLDER_EXPIRY',
    defaultMessage: 'Leave blank if no expiry',
  },
};

export default certificationsMessages;
