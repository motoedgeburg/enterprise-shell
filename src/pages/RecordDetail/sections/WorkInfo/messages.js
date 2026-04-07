const workInfoMessages = {
  // ─── Field labels ─────────────────────────────────────────────────────────
  DETAIL_FIELD_JOB_TITLE: { id: 'DETAIL_FIELD_JOB_TITLE', defaultMessage: 'Job Title' },
  DETAIL_FIELD_DEPARTMENT: { id: 'DETAIL_FIELD_DEPARTMENT', defaultMessage: 'Department' },
  DETAIL_FIELD_STATUS: { id: 'DETAIL_FIELD_STATUS', defaultMessage: 'Status' },
  DETAIL_FIELD_EMPLOYMENT_TYPE: {
    id: 'DETAIL_FIELD_EMPLOYMENT_TYPE',
    defaultMessage: 'Employment Type',
  },
  DETAIL_FIELD_START_DATE: { id: 'DETAIL_FIELD_START_DATE', defaultMessage: 'Start Date' },
  DETAIL_FIELD_MANAGER: { id: 'DETAIL_FIELD_MANAGER', defaultMessage: 'Manager' },

  // ─── Employment type options ───────────────────────────────────────────────
  DETAIL_EMPLOYMENT_FULL_TIME: { id: 'DETAIL_EMPLOYMENT_FULL_TIME', defaultMessage: 'Full-time' },
  DETAIL_EMPLOYMENT_PART_TIME: { id: 'DETAIL_EMPLOYMENT_PART_TIME', defaultMessage: 'Part-time' },
  DETAIL_EMPLOYMENT_CONTRACT: { id: 'DETAIL_EMPLOYMENT_CONTRACT', defaultMessage: 'Contract' },
  DETAIL_EMPLOYMENT_INTERN: { id: 'DETAIL_EMPLOYMENT_INTERN', defaultMessage: 'Intern' },

  // ─── Status options ────────────────────────────────────────────────────────
  DETAIL_STATUS_ACTIVE: { id: 'DETAIL_STATUS_ACTIVE', defaultMessage: 'Active' },
  DETAIL_STATUS_INACTIVE: { id: 'DETAIL_STATUS_INACTIVE', defaultMessage: 'Inactive' },

  // ─── Cross-section constraint ──────────────────────────────────────────────
  DETAIL_CONSTRAINT_ADMIN: {
    id: 'DETAIL_CONSTRAINT_ADMIN',
    defaultMessage: 'Employees with Admin access must have Active status.',
  },
};

export default workInfoMessages;
