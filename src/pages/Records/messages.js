const messages = {
  // ─── Records page ─────────────────────────────────────────────────────────
  RECORDS_PAGE_TITLE: { id: 'RECORDS_PAGE_TITLE', defaultMessage: 'Records' },
  RECORDS_SEARCH_PLACEHOLDER: {
    id: 'RECORDS_SEARCH_PLACEHOLDER',
    defaultMessage: 'Search by name or email',
  },
  RECORDS_ADD_BUTTON: { id: 'RECORDS_ADD_BUTTON', defaultMessage: 'Add Record' },

  RECORDS_COL_NAME: { id: 'RECORDS_COL_NAME', defaultMessage: 'Name' },
  RECORDS_COL_EMAIL: { id: 'RECORDS_COL_EMAIL', defaultMessage: 'Email' },
  RECORDS_COL_DEPARTMENT: { id: 'RECORDS_COL_DEPARTMENT', defaultMessage: 'Department' },
  RECORDS_COL_STATUS: { id: 'RECORDS_COL_STATUS', defaultMessage: 'Status' },
  RECORDS_COL_ADDRESS: { id: 'RECORDS_COL_ADDRESS', defaultMessage: 'Address' },
  RECORDS_COL_CREATED: { id: 'RECORDS_COL_CREATED', defaultMessage: 'Created' },
  RECORDS_COL_ACTIONS: { id: 'RECORDS_COL_ACTIONS', defaultMessage: 'Actions' },

  RECORDS_DELETE_CONFIRM_TITLE: {
    id: 'RECORDS_DELETE_CONFIRM_TITLE',
    defaultMessage: 'Delete record',
  },
  RECORDS_DELETE_CONFIRM_DESC: {
    id: 'RECORDS_DELETE_CONFIRM_DESC',
    defaultMessage: 'Are you sure you want to delete \u201c{name}\u201d?',
  },
  RECORDS_DELETE_OK: { id: 'RECORDS_DELETE_OK', defaultMessage: 'Delete' },
  RECORDS_DELETE_CANCEL: { id: 'RECORDS_DELETE_CANCEL', defaultMessage: 'Cancel' },

  RECORDS_EDIT_ARIA: { id: 'RECORDS_EDIT_ARIA', defaultMessage: 'Edit {name}' },
  RECORDS_DELETE_ARIA: { id: 'RECORDS_DELETE_ARIA', defaultMessage: 'Delete {name}' },
  RECORDS_PAGINATION_TOTAL: {
    id: 'RECORDS_PAGINATION_TOTAL',
    defaultMessage: 'Total {total} records',
  },

  RECORDS_ERROR_LOAD: {
    id: 'RECORDS_ERROR_LOAD',
    defaultMessage: 'Failed to load records.',
  },
  RECORDS_SUCCESS_DELETED: { id: 'RECORDS_SUCCESS_DELETED', defaultMessage: 'Record deleted.' },
  RECORDS_ERROR_DELETE: {
    id: 'RECORDS_ERROR_DELETE',
    defaultMessage: 'Failed to delete record.',
  },
  RECORDS_SUCCESS_UPDATED: { id: 'RECORDS_SUCCESS_UPDATED', defaultMessage: 'Record updated.' },
  RECORDS_SUCCESS_CREATED: { id: 'RECORDS_SUCCESS_CREATED', defaultMessage: 'Record created.' },
  RECORDS_ERROR_SUBMIT: {
    id: 'RECORDS_ERROR_SUBMIT',
    defaultMessage: 'An error occurred. Please try again.',
  },

  // ─── Record form modal ────────────────────────────────────────────────────
  MODAL_TITLE_ADD: { id: 'MODAL_TITLE_ADD', defaultMessage: 'Add Record' },
  MODAL_TITLE_EDIT: { id: 'MODAL_TITLE_EDIT', defaultMessage: 'Edit Record' },
  MODAL_CANCEL: { id: 'MODAL_CANCEL', defaultMessage: 'Cancel' },
  MODAL_SAVE: { id: 'MODAL_SAVE', defaultMessage: 'Save Changes' },
  MODAL_CREATE: { id: 'MODAL_CREATE', defaultMessage: 'Create' },

  MODAL_FIELD_NAME: { id: 'MODAL_FIELD_NAME', defaultMessage: 'Full Name' },
  MODAL_FIELD_NAME_PLACEHOLDER: {
    id: 'MODAL_FIELD_NAME_PLACEHOLDER',
    defaultMessage: 'Jane Doe',
  },
  MODAL_FIELD_EMAIL: { id: 'MODAL_FIELD_EMAIL', defaultMessage: 'Email' },
  MODAL_FIELD_EMAIL_PLACEHOLDER: {
    id: 'MODAL_FIELD_EMAIL_PLACEHOLDER',
    defaultMessage: 'jane.doe@company.com',
  },
  MODAL_FIELD_ADDRESS: { id: 'MODAL_FIELD_ADDRESS', defaultMessage: 'Address' },
  MODAL_FIELD_ADDRESS_PLACEHOLDER: {
    id: 'MODAL_FIELD_ADDRESS_PLACEHOLDER',
    defaultMessage: '123 Main St, Philadelphia, PA 19103',
  },
  MODAL_FIELD_DEPARTMENT: { id: 'MODAL_FIELD_DEPARTMENT', defaultMessage: 'Department' },
  MODAL_FIELD_DEPARTMENT_PLACEHOLDER: {
    id: 'MODAL_FIELD_DEPARTMENT_PLACEHOLDER',
    defaultMessage: 'Select department',
  },
  MODAL_FIELD_STATUS: { id: 'MODAL_FIELD_STATUS', defaultMessage: 'Status' },
  MODAL_STATUS_ACTIVE: { id: 'MODAL_STATUS_ACTIVE', defaultMessage: 'Active' },
  MODAL_STATUS_INACTIVE: { id: 'MODAL_STATUS_INACTIVE', defaultMessage: 'Inactive' },

  MODAL_VALIDATION_NAME_REQUIRED: {
    id: 'MODAL_VALIDATION_NAME_REQUIRED',
    defaultMessage: 'Name is required',
  },
  MODAL_VALIDATION_EMAIL_REQUIRED: {
    id: 'MODAL_VALIDATION_EMAIL_REQUIRED',
    defaultMessage: 'Email is required',
  },
  MODAL_VALIDATION_EMAIL_INVALID: {
    id: 'MODAL_VALIDATION_EMAIL_INVALID',
    defaultMessage: 'Enter a valid email address',
  },
  MODAL_VALIDATION_ADDRESS_REQUIRED: {
    id: 'MODAL_VALIDATION_ADDRESS_REQUIRED',
    defaultMessage: 'Address is required',
  },
  MODAL_VALIDATION_DEPARTMENT_REQUIRED: {
    id: 'MODAL_VALIDATION_DEPARTMENT_REQUIRED',
    defaultMessage: 'Department is required',
  },
  MODAL_VALIDATION_STATUS_REQUIRED: {
    id: 'MODAL_VALIDATION_STATUS_REQUIRED',
    defaultMessage: 'Status is required',
  },
};

export default messages;
