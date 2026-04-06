import axiosInstance from './axiosInstance';

// ─── Service ────────────────────────────────────────────────────────────────

const RECORDS_PATH = '/records';

export const recordsService = {
  /** GET /api/records — paginated list, no filters */
  getAll: (page = 0, size = 10) =>
    axiosInstance
      .get(RECORDS_PATH, { params: { page, size } })
      .then((res) => res.data),

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

  /** GET /api/records/:id */
  getById: (id) =>
    axiosInstance.get(`${RECORDS_PATH}/${id}`).then((res) => res.data),

  /** POST /api/records */
  create: (dto) =>
    axiosInstance.post(RECORDS_PATH, dto).then((res) => res.data),

  /** PUT /api/records/:id */
  update: (id, dto) =>
    axiosInstance.put(`${RECORDS_PATH}/${id}`, dto).then((res) => res.data),

  /** DELETE /api/records/:id */
  remove: (id) =>
    axiosInstance.delete(`${RECORDS_PATH}/${id}`).then((res) => res.data),
};
