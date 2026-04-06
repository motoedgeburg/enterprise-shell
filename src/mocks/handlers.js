import { http, HttpResponse } from 'msw';

import { db } from './data';

const BASE = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080/api';

/**
 * MSW handlers that mirror a Spring Boot REST controller:
 *
 *   GET    /api/records?page=0&size=10&name=&department=  → PagedResponse<Record>
 *   GET    /api/records/:id                               → Record
 *   POST   /api/records                                   → Record (201)
 *   PUT    /api/records/:id                               → Record
 *   DELETE /api/records/:id                               → 204
 */
export const handlers = [
  // ── GET /api/records ────────────────────────────────────────────────────────
  http.get(`${BASE}/records`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0', 10);
    const size = parseInt(url.searchParams.get('size') ?? '10', 10);

    const filters = {
      name:       url.searchParams.get('name')       ?? '',
      email:      url.searchParams.get('email')      ?? '',
      department: url.searchParams.get('department') ?? '',
      status:     url.searchParams.get('status')     ?? '',
      address:    url.searchParams.get('address')    ?? '',
    };

    const data = db.search(filters, page, size);
    return HttpResponse.json(data);
  }),

  // ── GET /api/records/:id ────────────────────────────────────────────────────
  http.get(`${BASE}/records/:id`, ({ params }) => {
    const id = parseInt(params['id'], 10);
    const record = db.getById(id);

    if (!record) {
      return HttpResponse.json(
        { message: `Record with id ${id} not found`, status: 404 },
        { status: 404 },
      );
    }

    return HttpResponse.json(record);
  }),

  // ── POST /api/records ───────────────────────────────────────────────────────
  http.post(`${BASE}/records`, async ({ request }) => {
    const body = await request.json();

    if (!body.name || !body.email) {
      return HttpResponse.json(
        { message: 'name and email are required', status: 400 },
        { status: 400 },
      );
    }

    const created = db.create(body);
    return HttpResponse.json(created, { status: 201 });
  }),

  // ── PUT /api/records/:id ────────────────────────────────────────────────────
  http.put(`${BASE}/records/:id`, async ({ params, request }) => {
    const id = parseInt(params['id'], 10);
    const body = await request.json();

    const updated = db.update(id, body);
    if (!updated) {
      return HttpResponse.json(
        { message: `Record with id ${id} not found`, status: 404 },
        { status: 404 },
      );
    }

    return HttpResponse.json(updated);
  }),

  // ── DELETE /api/records/:id ─────────────────────────────────────────────────
  http.delete(`${BASE}/records/:id`, ({ params }) => {
    const id = parseInt(params['id'], 10);
    const existed = db.remove(id);

    if (!existed) {
      return HttpResponse.json(
        { message: `Record with id ${id} not found`, status: 404 },
        { status: 404 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
