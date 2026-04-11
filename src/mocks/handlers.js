import { http, HttpResponse } from 'msw';

import { db } from './data';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

/**
 * MSW handlers that mirror a Spring Boot REST controller:
 *
 *   GET    /api/records?page=0&size=10&name=&department=  → PagedResponse<Record>
 *   GET    /api/records/:id                               → Record
 *   POST   /api/records                                   → Record (201)
 *   PUT    /api/records/:id                               → Record
 *   DELETE /api/records/:id                               → 204
 */
// ─── Static lookup data ──────────────────────────────────────────────────────
// Mirrors what a Spring Boot @RestController would serve from a reference-data
// table.  Kept here so it is co-located with the other mock handlers.

const LOOKUPS = {
  departments: [
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Legal', label: 'Legal' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Product', label: 'Product' },
    { value: 'Sales', label: 'Sales' },
  ],
  relationships: [
    { value: 'Brother', label: 'Brother' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Spouse', label: 'Spouse' },
  ],
  statuses: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on-leave', label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
  ],
  employmentTypes: [
    { value: 'contract', label: 'Contract' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'intern', label: 'Intern' },
    { value: 'part-time', label: 'Part Time' },
  ],
  notificationChannels: [
    { value: 'email', label: 'Email' },
    { value: 'push', label: 'Push' },
    { value: 'slack', label: 'Slack' },
    { value: 'sms', label: 'Sms' },
  ],
  accessLevels: [
    { value: 'standard', label: 'Standard' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'admin', label: 'Admin' },
    { value: 'restricted', label: 'Restricted' },
  ],
  payFrequencies: [
    { value: 'annual', label: 'Annual' },
    { value: 'bi-weekly', label: 'Bi Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
  ],
};

export const handlers = [
  // ── GET /api/lookups ─────────────────────────────────────────────────────────
  http.get(`${BASE}/lookups`, () => HttpResponse.json(LOOKUPS)),

  // ── GET /api/records ────────────────────────────────────────────────────────
  http.get(`${BASE}/records`, ({ request }) => {
    const url = new URL(request.url);

    const filters = {
      name: url.searchParams.get('name') ?? '',
      email: url.searchParams.get('email') ?? '',
      department: url.searchParams.get('department') ?? '',
      status: url.searchParams.get('status') ?? '',
      address: url.searchParams.get('address') ?? '',
    };

    return HttpResponse.json(db.search(filters));
  }),

  // ── GET /api/records/:id ────────────────────────────────────────────────────
  http.get(`${BASE}/records/:id`, ({ params }) => {
    const record = db.getById(params['id']);

    if (!record) {
      return HttpResponse.json(
        { message: `Record with id ${params['id']} not found`, status: 404 },
        { status: 404 },
      );
    }

    return HttpResponse.json(record);
  }),

  // ── POST /api/records ───────────────────────────────────────────────────────
  http.post(`${BASE}/records`, async ({ request }) => {
    const body = await request.json();

    if (!body.personalInfo?.name || !body.personalInfo?.email) {
      return HttpResponse.json(
        { message: 'personalInfo.name and personalInfo.email are required', status: 400 },
        { status: 400 },
      );
    }

    const created = db.create(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  // ── PUT /api/records/:id ────────────────────────────────────────────────────
  http.put(`${BASE}/records/:id`, async ({ params, request }) => {
    const body = await request.json();

    const updated = db.update(params['id'], body);
    if (!updated) {
      return HttpResponse.json(
        { message: `Record with id ${params['id']} not found`, status: 404 },
        { status: 404 },
      );
    }

    return HttpResponse.json(updated);
  }),

  // ── DELETE /api/records/:id ─────────────────────────────────────────────────
  http.delete(`${BASE}/records/:id`, ({ params }) => {
    const existed = db.remove(params['id']);

    if (!existed) {
      return HttpResponse.json(
        { message: `Record with id ${params['id']} not found`, status: 404 },
        { status: 404 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
