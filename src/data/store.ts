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
  email?: string
  address: string
  people: string[]
  reviewer: string
  status: 'Active' | 'Completed'
  deadline: string
  completedDate?: string // yyyy-mm-dd
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
  status: 'Draft' | 'Submitted' | 'Updated after submission'
  source: 'Direct' | 'Excel'
  /** Value before a reviewer correction; kept for the change history. */
  original?: string
  submittedAt?: string // yyyy-mm-dd
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
  replies: { from: string; body: string; time: string }[]
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
export const employee = { name: 'Nora Chen', firstName: 'Nora', initials: 'NC', role: 'Team member' }
export const users = { partner, employee } as const

/**
 * The prototype computes deadlines from the real clock, which makes every May 2025 deadline
 * "overdue" today. The demo pins "today" to May 30, 2025 so it matches the frames ("04 days left").
 */
export const demoToday = '2025-05-30'

export interface BillingPeriod {
  year: number
  month: number
}
export const currentPeriod: BillingPeriod = { year: 2025, month: 5 }
export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const periodLabel = ({ year, month }: BillingPeriod) => `${monthNames[month - 1]} ${year}`
export const periodDefaultDate = ({ year, month }: BillingPeriod) =>
  `${year}-${String(month).padStart(2, '0')}-${year === 2025 && month === 5 ? '28' : '01'}`
export const entryIsInPeriod = (date: string, { year, month }: BillingPeriod) =>
  Number(date.slice(0, 4)) === year && Number(date.slice(5, 7)) === month
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
    completedDate: '2025-05-31',
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

export const formatHours = (hours: number) => hours.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })

export const projectName = (s: Store, projectId: string) => s.projects.find((p) => p.id === projectId)?.name ?? 'Unknown project'

export type DisplayStatus = 'Draft' | 'Submitted' | 'Flagged' | 'Updated'
export const displayStatus = (s: Store, entry: Entry): DisplayStatus =>
  entryIsFlagged(s, entry.id) ? 'Flagged' : entry.status === 'Updated after submission' ? 'Updated' : entry.status

/** Entries on approved/exported invoices can no longer be edited or deleted. */
export const entryIsLocked = (s: Store, entry: Entry) => ['Approved', 'Exported'].includes(s.invoiceStatus[entry.projectId])

/* ---------- Time entry validation (ported from the prototype code layer) ---------- */

export interface EntryForm {
  date: string
  projectId: string
  hours: string
  description: string
  billable: boolean
}
export type FormErrors = Partial<Record<'projectId' | 'hours' | 'description', string>>
export interface EntryWarning {
  field: 'date' | 'hours' | 'description'
  kind: string
  message: string
}

export function validateEntry(form: EntryForm): FormErrors {
  const errors: FormErrors = {}
  const description = form.description
  const trimmed = description.trim()
  if (!form.projectId) errors.projectId = 'Please select a project before submitting.'
  if (description === '') errors.description = 'Please add a description of the work you completed.'
  else if (!trimmed) errors.description = "Your description can't be blank."
  else if (!/[a-z]/i.test(trimmed)) errors.description = 'Please describe the work you completed using words.'
  else if (/^(asdfghjkl|qwertyuiop|zxcvbnm|asdf|qwerty|hjkl)+$/i.test(trimmed.replace(/\s/g, '')))
    errors.description = "This doesn't look like a valid work description. Please explain what you worked on."
  else {
    const words = trimmed.toLowerCase().match(/[a-z]+/g) || []
    if (words.length >= 3 && new Set(words).size === 1) errors.description = 'Please provide a meaningful description of your work.'
  }
  if (!form.hours.trim()) errors.hours = 'Please enter the number of hours worked.'
  else if (/^-\d+(\.\d+)?$/.test(form.hours.trim()) || Number(form.hours) === 0) errors.hours = 'Hours must be greater than zero.'
  else if (!/^\d+(\.\d+)?$/.test(form.hours.trim())) errors.hours = 'Enter hours as a number, such as 1.5 or 2.0.'
  else if (Number(form.hours) > 24) errors.hours = 'An entry cannot exceed 24 hours. Please check your hours.'
  return errors
}

export function entryWarnings(form: EntryForm, entries: Entry[], person: string, threshold: number, editingId?: string): EntryWarning[] {
  const warnings: EntryWarning[] = []
  const hours = Number(form.hours)
  const editing = editingId ? entries.find((e) => e.id === editingId) : undefined
  const peers = entries.filter((e) => e.employee === person && e.id !== editingId)
  const sameDay = peers.filter((e) => e.date === form.date).reduce((sum, e) => sum + e.hours, 0)
  if (hours >= 8) warnings.push({ field: 'hours', kind: 'Long entry', message: 'This is a longer-than-usual entry. Is the duration correct?' })
  if (sameDay + hours > threshold)
    warnings.push({
      field: 'hours',
      kind: 'Daily total',
      message: `You've logged ${(sameDay + hours).toFixed(1)} hours today. Please double-check your total.`,
    })
  const average = peers.length ? peers.reduce((sum, e) => sum + e.hours, 0) / peers.length : 0
  if (average > 0 && hours >= 5 && hours > average * 2)
    warnings.push({ field: 'hours', kind: 'Higher than usual', message: 'These hours are higher than usual. Please verify the amount.' })
  const normalized = form.description.trim().toLowerCase().replace(/\s+/g, ' ')
  if (
    peers.some(
      (e) =>
        e.date === form.date && e.projectId === form.projectId && e.hours === hours && e.description.trim().toLowerCase().replace(/\s+/g, ' ') === normalized,
    )
  )
    warnings.push({ field: 'description', kind: 'Possible duplicate', message: 'This looks similar to another entry you submitted. Is it a duplicate?' })
  if (/^(worked on (the )?project|meeting|work|emails?|research|drafting)[.!]?$/i.test(normalized))
    warnings.push({ field: 'description', kind: 'More detail helpful', message: 'Could you add more detail about what you worked on?' })
  const date = new Date(`${form.date}T12:00:00`)
  const cycle = new Date('2025-05-31T12:00:00')
  if (Number.isFinite(date.getTime()) && Math.abs(date.getTime() - cycle.getTime()) > 90 * 86400000)
    warnings.push({ field: 'date', kind: 'Work date', message: 'Please confirm that the work date is correct.' })
  if (editing && (editing.status === 'Submitted' || editing.status === 'Updated after submission'))
    warnings.push({ field: 'date', kind: 'Submitted period', message: 'This billing period has already been submitted. Your changes may need review.' })
  return warnings.filter((w, i, all) => all.findIndex((x) => x.message === w.message) === i)
}
