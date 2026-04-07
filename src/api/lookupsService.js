import axiosInstance from './axiosInstance';

/** GET /api/lookups — returns all reference data arrays in one request. */
export const lookupsService = {
  getAll: () => axiosInstance.get('/lookups').then((res) => res.data),
};
