// Demo data model. Seed data and copy come from the Figma code layer that ships with
// frame 37:15126 (node 36:3, src/App.tsx), so amounts, flags and statuses match every frame.

export type Role = 'partner' | 'employee'

export interface Project {
  id: string
  client: string
  name: string
  code: string
  type: string
  contact: string
  address: string
  people: string[]
  reviewer: string
  status: 'Active' | 'Completed'
  deadline: string
}

export interface Entry {
  id: string
  date: string // yyyy-mm-dd
  employee: string
  projectId: string
  hours: number
  rate: number
  description: string
  billable: boolean
  status: 'Draft' | 'Submitted'
  source: 'Direct' | 'Excel'
  /** Value before a reviewer correction; kept for the change history. */
  original?: string
}

export type FlagStatus = 'Open' | 'Awaiting employee' | 'Response received' | 'Resolved' | 'Dismissed'

export interface Flag {
  id: string
  entryId: string
  type: string
  title: string
  noticed: string
  why: string
  suggestion: string
  impact: number
  status: FlagStatus
}

export interface Message {
  id: string
  projectId: string
  entryId?: string
  from: string
  to: string
  subject: string
  body: string
  time: string
  unreadBy: Role[]
  status: 'Open' | 'Replied' | 'Closed'
}

export type InvoiceStatus = 'Draft' | 'In review' | 'Awaiting employee' | 'Ready to approve' | 'Approved' | 'Exported'
export type Submission = 'Submitted' | 'Due soon' | 'Overdue'

export interface Store {
  projects: Project[]
  entries: Entry[]
  flags: Flag[]
  messages: Message[]
  invoiceStatus: Record<string, InvoiceStatus>
  submissions: Record<string, Submission>
  reminderLog: string[]
  audit: string[]
  rates: Record<string, number>
  reminderChannels: { inApp: boolean; email: boolean }
  threshold: number
}

export const firm = 'Hartwell & Knox Forensic Advisory'
export const partner = { name: 'Vanessa Hart', firstName: 'Vanessa', initials: 'VH', role: 'Partner / Billing manager' }
export const people = ['Vanessa Hart', 'Nora Chen', 'Ryan Cole', 'Maya Singh', 'Eli Brooks']

const projects: Project[] = [
  {
    id: 'montrose',
    client: 'Montrose Industrial Group',
    name: 'Montrose v. Calder',
    code: '2025-018',
    type: 'Forensic accounting',
    contact: 'Amina Hassan',
    address: '380 North LaSalle Street, Chicago, IL 60654',
    people: ['Vanessa Hart', 'Nora Chen', 'Ryan Cole'],
    reviewer: 'Vanessa Hart',
    status: 'Active',
    deadline: 'June 3',
  },
  {
    id: 'aster',
    client: 'Aster Labs',
    name: 'Aster Labs v. Meridian Partners',
    code: '2025-019',
    type: 'Transaction advisory',
    contact: 'Julia Park',
    address: '110 King Street, San Francisco, CA 94107',
    people: ['Vanessa Hart', 'Nora Chen'],
    reviewer: 'Vanessa Hart',
    status: 'Completed',
    deadline: 'June 3',
  },
  {
    id: 'northstar',
    client: 'Northstar Works',
    name: 'Coleman v. Northstar Works',
    code: '2025-021',
    type: 'Consulting',
    contact: 'Theo Martin',
    address: '44 Madison Avenue, New York, NY 10010',
    people: ['Vanessa Hart', 'Ryan Cole'],
    reviewer: 'Vanessa Hart',
    status: 'Active',
    deadline: 'June 3',
  },
]

const e = (
  id: string,
  date: string,
  employee: string,
  projectId: string,
  hours: number,
  rate: number,
  description: string,
  source: Entry['source'],
): Entry => ({ id, date, employee, projectId, hours, rate, description, billable: true, status: 'Submitted', source })

const entries: Entry[] = [
  e('e1', '2025-05-14', 'Nora Chen', 'montrose', 1.2, 620, 'Prepared client strategy schedules', 'Excel'),
  e('e2', '2025-05-16', 'Ryan Cole', 'montrose', 20, 465, 'Emails and follow up', 'Excel'),
  e('e3', '2025-05-18', 'Ryan Cole', 'montrose', 0.8, 465, 'Reconciled revenue schedule', 'Excel'),
  e('e4', '2025-05-21', 'Nora Chen', 'montrose', 8.5, 620, 'Drafting', 'Direct'),
  e('e5', '2025-05-22', 'Vanessa Hart', 'montrose', 4.2, 850, 'Reviewed damages model and methodology', 'Direct'),
  e('e6', '2025-05-13', 'Nora Chen', 'aster', 9.3, 620, 'Prepared quality of earnings schedules', 'Excel'),
  e('e7', '2025-05-09', 'Ryan Cole', 'northstar', 6.6, 465, 'Built back-pay model and payroll tie-out', 'Excel'),
]

const flags: Flag[] = [
  {
    id: 'f1',
    entryId: 'e2',
    type: 'Unusually high hours',
    title: '20 hours may be a decimal error',
    noticed: 'Ryan recorded 20.0 hours on May 16; his next-highest day is 6.6 hours.',
    why: 'A mistyped decimal would materially overstate the client invoice.',
    suggestion: 'Change 20.0 hours to 2.0 hours',
    impact: -8370,
    status: 'Open',
  },
  {
    id: 'f2',
    entryId: 'e4',
    type: 'Vague description',
    title: 'Description needs more detail',
    noticed: 'The description only says “Drafting.”',
    why: 'The client requires enough detail to understand the work performed.',
    suggestion: 'Ask Nora to clarify the document and task',
    impact: 0,
    status: 'Open',
  },
]

export function initialStore(): Store {
  return structuredClone({
    projects,
    entries,
    flags,
    messages: [],
    invoiceStatus: { montrose: 'In review', aster: 'Ready to approve', northstar: 'Draft' },
    submissions: {
      'Vanessa Hart': 'Submitted',
      'Nora Chen': 'Submitted',
      'Ryan Cole': 'Due soon',
      'Maya Singh': 'Overdue',
      'Eli Brooks': 'Submitted',
    },
    reminderLog: [
      '24-hour reminder scheduled for Ryan Cole',
      'Overdue reminder sent in-app to Maya Singh',
      '7-day reminder completed for Nora Chen',
    ],
    audit: [
      'Tally applied current billing rates',
      'Tally prepared three draft invoices',
      'Tally flagged two Montrose entries for review',
    ],
    rates: { 'Vanessa Hart': 850, 'Nora Chen': 620, 'Ryan Cole': 465, 'Maya Singh': 390, 'Eli Brooks': 350 },
    reminderChannels: { inApp: true, email: false },
    threshold: 12,
  } satisfies Store)
}

/* ---------- Derived values ---------- */

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

/** yyyy-mm-dd → MM/DD/YY */
export const tableDate = (iso: string) => `${iso.slice(5, 7)}/${iso.slice(8, 10)}/${iso.slice(2, 4)}`

export const initials = (name: string) =>
  name
    .split(' ')
    .map((x) => x[0])
    .join('')

const isOpen = (f: Flag) => f.status !== 'Resolved' && f.status !== 'Dismissed'

export const invoiceTotal = (s: Store, projectId: string) =>
  s.entries.filter((x) => x.projectId === projectId && x.billable).reduce((n, x) => n + x.hours * x.rate, 0)

export const openFlagsFor = (s: Store, projectId: string) =>
  s.flags.filter((f) => isOpen(f) && s.entries.find((x) => x.id === f.entryId)?.projectId === projectId)

export const entryIsFlagged = (s: Store, entryId: string) => s.flags.some((f) => f.entryId === entryId && isOpen(f))

/** Invoices that still need Vanessa's attention (drives "Review N invoices"). */
export const invoicesNeedingReview = (s: Store) =>
  Object.values(s.invoiceStatus).filter((x) => x === 'In review' || x === 'Ready to approve' || x === 'Awaiting employee').length

/** The demo spreadsheet behind "Select demo file" (Figma 36:3871). */
export const demoImport = {
  fileName: 'Nora_May.xlsx',
  rows: [
    { column: 'Work date', field: 'Date', sample: 'May 27, 2025', certain: true },
    { column: 'Matter', field: 'Project', sample: 'Aster Labs Acq.', certain: false },
    { column: 'Hrs', field: 'Hours', sample: '2.0', certain: true },
    { column: 'Task / Notes', field: 'Description', sample: 'Reviewed acquisition schedules', certain: true },
  ],
  entry: {
    date: '2025-05-27',
    employee: 'Nora Chen',
    projectId: 'aster',
    hours: 2,
    rate: 620,
    description: 'Reviewed acquisition schedules',
    billable: true,
    status: 'Submitted',
    source: 'Excel',
  } satisfies Omit<Entry, 'id'>,
}
