import axiosInstance from './axiosInstance';

// ─── Record shape mappers ─────────────────────────────────────────────────────
// The API uses a nested structure (personalInfo, workInfo, preferences, etc.)
// while the form uses flat field names.  These helpers bridge the two shapes.

/** API nested → flat form values */
export function flattenRecord(record) {
  if (!record) return record;
  const { id, personalInfo, workInfo, preferences, emergencyContacts, certifications, createdAt } =
    record;
  return {
    id,
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

  /** GET /api/records/:id — returns flattened record for form use */
  getById: (id) =>
    axiosInstance.get(`${RECORDS_PATH}/${id}`).then((res) => flattenRecord(res.data)),

  /** POST /api/records — nests flat form values before sending */
  create: (values) =>
    axiosInstance.post(RECORDS_PATH, nestRecord(values)).then((res) => flattenRecord(res.data)),

  /** PUT /api/records/:id — nests flat form values before sending */
  update: (id, values) =>
    axiosInstance
      .put(`${RECORDS_PATH}/${id}`, nestRecord(values))
      .then((res) => flattenRecord(res.data)),

  /** DELETE /api/records/:id */
  remove: (id) => axiosInstance.delete(`${RECORDS_PATH}/${id}`).then((res) => res.data),
};
