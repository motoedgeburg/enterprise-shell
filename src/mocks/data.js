// Seed data that mirrors a Spring Boot backend response
export const seedRecords = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    phone: '(215) 555-0101',
    address: '123 Market St, Philadelphia, PA 19103',
    dateOfBirth: '1990-03-15',
    bio: 'Senior software engineer with 8 years of experience in distributed systems and cloud infrastructure.',
    department: 'Engineering',
    jobTitle: 'Senior Software Engineer',
    employmentType: 'full-time',
    startDate: '2019-06-01',
    manager: 'Jane Smith',
    status: 'active',
    remoteEligible: true,
    notificationsEnabled: true,
    notificationChannels: ['email', 'slack'],
    accessLevel: 'standard',
    notes: 'Team lead for the infrastructure squad. Eligible for senior staff promotion in Q3.',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Bob Martinez',
    email: 'bob.martinez@company.com',
    phone: '(412) 555-0202',
    address: '456 Liberty Ave, Pittsburgh, PA 15222',
    dateOfBirth: '1985-07-22',
    bio: 'Product manager focused on enterprise SaaS with a background in UX research.',
    department: 'Product',
    jobTitle: 'Product Manager',
    employmentType: 'full-time',
    startDate: '2020-02-10',
    manager: 'Karen Lee',
    status: 'active',
    remoteEligible: true,
    notificationsEnabled: true,
    notificationChannels: ['email', 'teams', 'sms'],
    accessLevel: 'admin',
    notes: 'Owns the roadmap for the B2B product line.',
    createdAt: '2024-02-03T08:00:00Z',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol.white@company.com',
    phone: '(717) 555-0303',
    address: '789 Penn Ave, Harrisburg, PA 17101',
    dateOfBirth: '1993-11-08',
    bio: 'UX designer specializing in accessibility and design systems.',
    department: 'Design',
    jobTitle: 'UX Designer',
    employmentType: 'part-time',
    startDate: '2021-09-15',
    manager: 'Tom Baker',
    status: 'inactive',
    remoteEligible: false,
    notificationsEnabled: false,
    notificationChannels: ['email'],
    accessLevel: 'read-only',
    notes: 'On extended leave. Return date TBD.',
    createdAt: '2024-01-22T14:15:00Z',
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@company.com',
    phone: '(610) 555-0404',
    address: '321 E Hamilton St, Allentown, PA 18101',
    dateOfBirth: '1995-05-30',
    bio: 'Full-stack engineer passionate about React and microservices.',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    employmentType: 'full-time',
    startDate: '2022-03-01',
    manager: 'Alice Johnson',
    status: 'active',
    remoteEligible: true,
    notificationsEnabled: true,
    notificationChannels: ['slack'],
    accessLevel: 'standard',
    notes: 'Mentoring two junior developers on the team.',
    createdAt: '2024-03-10T09:45:00Z',
  },
  {
    id: 5,
    name: 'Eva Brown',
    email: 'eva.brown@company.com',
    phone: '(484) 555-0505',
    address: '654 Main St, Bethlehem, PA 18015',
    dateOfBirth: '1988-01-14',
    bio: 'Marketing manager with expertise in digital campaigns and brand strategy.',
    department: 'Marketing',
    jobTitle: 'Marketing Manager',
    employmentType: 'full-time',
    startDate: '2018-11-12',
    manager: 'Karen Lee',
    status: 'active',
    remoteEligible: true,
    notificationsEnabled: true,
    notificationChannels: ['email', 'sms'],
    accessLevel: 'standard',
    notes: 'Leading the Q2 product launch campaign.',
    createdAt: '2024-03-18T11:00:00Z',
  },
  {
    id: 6,
    name: 'Frank Lee',
    email: 'frank.lee@company.com',
    phone: '(610) 555-0606',
    address: '987 Penn Ave, Reading, PA 19601',
    dateOfBirth: '1982-09-03',
    bio: 'Sales representative with a strong track record in enterprise accounts.',
    department: 'Sales',
    jobTitle: 'Sales Representative',
    employmentType: 'contract',
    startDate: '2023-01-05',
    manager: 'Sam Rivera',
    status: 'inactive',
    remoteEligible: false,
    notificationsEnabled: false,
    notificationChannels: [],
    accessLevel: 'read-only',
    notes: 'Contract ending Q2. Renewal under review.',
    createdAt: '2024-02-28T16:30:00Z',
  },
  {
    id: 7,
    name: 'Grace Chen',
    email: 'grace.chen@company.com',
    phone: '(717) 555-0707',
    address: '147 Queen St, Lancaster, PA 17602',
    dateOfBirth: '1991-06-19',
    bio: 'Operations manager who specializes in process improvement and supply chain optimization.',
    department: 'Operations',
    jobTitle: 'Operations Manager',
    employmentType: 'full-time',
    startDate: '2017-08-20',
    manager: 'Jane Smith',
    status: 'active',
    remoteEligible: false,
    notificationsEnabled: true,
    notificationChannels: ['email', 'teams'],
    accessLevel: 'admin',
    notes: 'Key contact for vendor onboarding.',
    createdAt: '2024-04-01T08:30:00Z',
  },
  {
    id: 8,
    name: 'Henry Davis',
    email: 'henry.davis@company.com',
    phone: '(570) 555-0808',
    address: '258 Spruce St, Scranton, PA 18503',
    dateOfBirth: '1987-12-27',
    bio: 'HR business partner supporting engineering and product teams.',
    department: 'HR',
    jobTitle: 'HR Business Partner',
    employmentType: 'full-time',
    startDate: '2016-04-11',
    manager: 'Jane Smith',
    status: 'active',
    remoteEligible: true,
    notificationsEnabled: true,
    notificationChannels: ['email', 'slack', 'teams'],
    accessLevel: 'admin',
    notes: 'Point of contact for performance review cycle.',
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
