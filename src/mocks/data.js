// Seed data that mirrors a Spring Boot backend response
export const seedRecords = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    department: 'Engineering',
    status: 'active',
    address: '123 Market St, Philadelphia, PA 19103',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Bob Martinez',
    email: 'bob.martinez@company.com',
    department: 'Product',
    status: 'active',
    address: '456 Liberty Ave, Pittsburgh, PA 15222',
    createdAt: '2024-02-03T08:00:00Z',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol.white@company.com',
    department: 'Design',
    status: 'inactive',
    address: '789 Penn Ave, Harrisburg, PA 17101',
    createdAt: '2024-01-22T14:15:00Z',
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@company.com',
    department: 'Engineering',
    status: 'active',
    address: '321 E Hamilton St, Allentown, PA 18101',
    createdAt: '2024-03-10T09:45:00Z',
  },
  {
    id: 5,
    name: 'Eva Brown',
    email: 'eva.brown@company.com',
    department: 'Marketing',
    status: 'active',
    address: '654 Main St, Bethlehem, PA 18015',
    createdAt: '2024-03-18T11:00:00Z',
  },
  {
    id: 6,
    name: 'Frank Lee',
    email: 'frank.lee@company.com',
    department: 'Sales',
    status: 'inactive',
    address: '987 Penn Ave, Reading, PA 19601',
    createdAt: '2024-02-28T16:30:00Z',
  },
  {
    id: 7,
    name: 'Grace Chen',
    email: 'grace.chen@company.com',
    department: 'Operations',
    status: 'active',
    address: '147 Queen St, Lancaster, PA 17602',
    createdAt: '2024-04-01T08:30:00Z',
  },
  {
    id: 8,
    name: 'Henry Davis',
    email: 'henry.davis@company.com',
    department: 'HR',
    status: 'active',
    address: '258 Spruce St, Scranton, PA 18503',
    createdAt: '2024-04-05T13:00:00Z',
  },
];

let records = [...seedRecords];
let nextId = records.length + 1;

export const db = {
  getAll: (page, size) => {
    const start = page * size;
    const content = records.slice(start, start + size);
    return {
      content,
      totalElements: records.length,
      totalPages: Math.ceil(records.length / size),
      size,
      number: page,
    };
  },

  /**
   * Filter records by any combination of fields, then paginate.
   * Empty / absent filter values are ignored (match all).
   */
  search: (filters = {}, page = 0, size = 10) => {
    const { name, email, department, status, address } = filters;
    let result = records;

    if (name)       result = result.filter((r) => r.name.toLowerCase().includes(name.toLowerCase()));
    if (email)      result = result.filter((r) => r.email.toLowerCase().includes(email.toLowerCase()));
    if (department) result = result.filter((r) => r.department === department);
    if (status)     result = result.filter((r) => r.status === status);
    if (address)    result = result.filter((r) => r.address?.toLowerCase().includes(address.toLowerCase()));

    const start = page * size;
    return {
      content: result.slice(start, start + size),
      totalElements: result.length,
      totalPages: Math.ceil(result.length / size),
      size,
      number: page,
    };
  },

  getById: (id) => records.find((r) => r.id === id) ?? null,

  create: (dto) => {
    const newRecord = {
      ...dto,
      id: nextId++,
      createdAt: new Date().toISOString(),
    };
    records = [...records, newRecord];
    return newRecord;
  },

  update: (id, dto) => {
    let updated = null;
    records = records.map((r) => {
      if (r.id === id) {
        updated = { ...r, ...dto };
        return updated;
      }
      return r;
    });
    return updated;
  },

  remove: (id) => {
    const existed = records.some((r) => r.id === id);
    records = records.filter((r) => r.id !== id);
    return existed;
  },

  reset: () => {
    records = [...seedRecords];
    nextId = seedRecords.length + 1;
  },
};
