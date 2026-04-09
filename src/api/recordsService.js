import axiosInstance from './axiosInstance';

// ─── Record shape mappers ─────────────────────────────────────────────────────
// The API uses a nested structure (personalInfo, workInfo, preferences, etc.)
// while the form uses flat field names.  These helpers bridge the two shapes.

/** API nested → flat form values */
export function flattenRecord(record) {
  if (!record) return record;
  const {
    uuid,
    personalInfo,
    workInfo,
    preferences,
    emergencyContacts,
    certifications,
    createdAt,
  } = record;
  return {
    uuid,
    ...personalInfo,
    ...workInfo,
    ...preferences,
    emergencyContacts,
    certifications,
    createdAt,
  };
}

/** Flat form values → API nested */
export function nestRecord(values) {
  const {
    // personal info
    name,
    email,
    phone,
    address,
    dateOfBirth,
    ssn,
    bio,
    // work info
    jobTitle,
    manager,
    department,
    status,
    startDate,
    employmentType,
    // preferences
    remoteEligible,
    notificationsEnabled,
    notificationChannels,
    accessLevel,
    notes,
    // collections
    emergencyContacts,
    certifications,
  } = values;

  return {
    personalInfo: { name, email, phone, address, dateOfBirth, ssn, bio },
    workInfo: { jobTitle, manager, department, status, startDate, employmentType },
    preferences: { remoteEligible, notificationsEnabled, notificationChannels, accessLevel, notes },
    emergencyContacts,
    certifications,
  };
}

// ─── Service ────────────────────────────────────────────────────────────────

const RECORDS_PATH = '/records';

export const recordsService = {
  /** GET /api/records — paginated list, no filters */
  getAll: (page = 0, size = 10) =>
    axiosInstance.get(RECORDS_PATH, { params: { page, size } }).then((res) => res.data),

  /**
   * GET /api/records — paginated list with optional attribute filters.
   * Empty / null filter values are stripped before sending.
   */
  search: (filters = {}, page = 0, size = 10) => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== null),
    );
    return axiosInstance
      .get(RECORDS_PATH, { params: { page, size, ...activeFilters } })
      .then((res) => res.data);
  },

  /** GET /api/records/:uuid — returns flattened record for form use */
  getById: (uuid) =>
    axiosInstance.get(`${RECORDS_PATH}/${uuid}`).then((res) => flattenRecord(res.data)),

  /** POST /api/records — nests flat form values before sending */
  create: (values) =>
    axiosInstance.post(RECORDS_PATH, nestRecord(values)).then((res) => flattenRecord(res.data)),

  /** PUT /api/records/:uuid — nests flat form values before sending */
  update: (uuid, values) =>
    axiosInstance
      .put(`${RECORDS_PATH}/${uuid}`, nestRecord(values))
      .then((res) => flattenRecord(res.data)),

  /** DELETE /api/records/:uuid */
  remove: (uuid) => axiosInstance.delete(`${RECORDS_PATH}/${uuid}`).then((res) => res.data),
};
