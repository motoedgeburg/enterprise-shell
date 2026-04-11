import axiosInstance from './axiosInstance';

// ─── Service ────────────────────────────────────────────────────────────────

const RECORDS_PATH = '/records';

export const recordsService = {
  /**
   * GET /api/records — flat summary list with optional filters.
   * Returns an array of { uuid, name, address, department, status }.
   * Empty / null filter values are stripped before sending.
   */
  search: (filters = {}) => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== null),
    );
    return axiosInstance.get(RECORDS_PATH, { params: activeFilters }).then((res) => res.data);
  },

  /** GET /api/records/:uuid — returns nested record for form use */
  getById: (uuid) => axiosInstance.get(`${RECORDS_PATH}/${uuid}`).then((res) => res.data),

  /** POST /api/records — form values already match API shape */
  create: (values) => axiosInstance.post(RECORDS_PATH, values).then((res) => res.data),

  /** PUT /api/records/:uuid — form values already match API shape */
  update: (uuid, values) =>
    axiosInstance.put(`${RECORDS_PATH}/${uuid}`, values).then((res) => res.data),

  /** DELETE /api/records/:uuid */
  remove: (uuid) => axiosInstance.delete(`${RECORDS_PATH}/${uuid}`).then((res) => res.data),
};
