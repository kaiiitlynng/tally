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
  /** Where the hours came from, e.g. "Ryan_May.xlsx, row 14". Direct entries derive theirs from the date. */
  sourceRef?: string
  /** Partner marked this line "No charge": stays on the invoice, excluded from the total. */
  noCharge?: boolean
  /** First reviewer change to this line; the original values are kept for the "Edited by" marker. */
  review?: { by: string; original: { hours: number; description: string; rate: number; noCharge: boolean } }
}

export interface RemovedLine {
  entry: Entry
  reason: string
  by: string
}

/** Excel rows whose matter name matched no Tally project. Held until mapped (spec item 3). */
export interface HeldRow {
  id: string
  employee: string
  matter: string
  date: string
  hours: number
  description: string
  file: string
  row?: number
  /** Set once the partner has asked the employee about it. */
  asked?: boolean
}

export interface Notification {
  id: string
  text: string
  to: string
  read: boolean
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
  /** The concrete before/after Tally proposes, when there is one (shown as a comparison in the review panel). */
  change?: { field: string; from: string; to: string }
  status: FlagStatus
  /** "daily" flags are derived from the daily-hours threshold; they are not stored. */
  kind?: 'daily'
  note?: string
}

export interface Message {
  id: string
  projectId?: string
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

export type InvoiceStatus = 'Draft' | 'In review' | 'Awaiting employee' | 'Ready to approve' | 'Approved' | 'Exported' | 'Sent'
export type Submission = 'Submitted' | 'Due soon' | 'Overdue'

export interface TeamMember {
  name: string
  email: string
  role: 'Partner' | 'Employee'
}

export interface Store {
  projects: Project[]
  /** Firm members with Tally access (Settings → Team). Removing someone keeps their entries and rate history. */
  team: TeamMember[]
  entries: Entry[]
  flags: Flag[]
  messages: Message[]
  invoiceStatus: Record<string, InvoiceStatus>
  submissions: Record<string, Submission>
  /** Date of each person's latest timesheet submission (yyyy-mm-dd). */
  lastSubmitted: Record<string, string>
  reminderLog: string[]
  audit: string[]
  rates: Record<string, number>
  /** 2026 rates scheduled from Settings; effective Jan 1, 2026. Empty until saved. */
  scheduledRates: Record<string, number>
  reminderChannels: { inApp: boolean; email: boolean }
  reminderSchedule: { sevenDays: boolean; oneDay: boolean; overdue: boolean }
  threshold: number
  removedLines: RemovedLine[]
  /** Reviewer decisions on derived daily-hours flags, keyed by flag id. */
  dailyFlagState: Record<string, { status: FlagStatus; note?: string }>
  heldRows: HeldRow[]
  notifications: Notification[]
  invoiceDates: Record<string, { approvedAt?: string; sentAt?: string }>
  ai: { autoClear: boolean; lastCleared?: string }
}

export const firm = 'Hartwell & Knox Forensic Advisory'
export const partner = { name: 'Vanessa Hart', firstName: 'Vanessa', initials: 'VH', role: 'Partner' }
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
/** "May 1–31, 2025" (or "May 1–31" without the year), with the month's real last day. */
export const periodRange = ({ year, month }: BillingPeriod, withYear = true) => {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return `${monthNames[month - 1]} 1–${last}${withYear ? `, ${year}` : ''}`
}
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
    email: 'ap@montrose.example',
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
    email: 'finance@aster.example',
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
    email: 'billing@northstar.example',
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
  sourceRef?: string,
): Entry => ({ id, date, employee, projectId, hours, rate, description, billable: true, status: 'Submitted', source, sourceRef })

// Spreadsheet rows are synthetic demo references (spec item 9 example: "Ryan_May.xlsx, row 14").
const entries: Entry[] = [
  e('e1', '2025-05-14', 'Nora Chen', 'montrose', 1.2, 620, 'Prepared client strategy schedules', 'Excel', 'Nora_May_part1.xlsx, row 6'),
  // e2 is Nora's (owner request 2026-11-10) so every review question reaches the employee-view user and can be answered there.
  e('e2', '2025-05-16', 'Nora Chen', 'montrose', 20, 620, 'Emails and follow up', 'Excel', 'Nora_May_part1.xlsx, row 9'),
  e('e3', '2025-05-18', 'Ryan Cole', 'montrose', 0.8, 465, 'Reconciled revenue schedule', 'Excel', 'Ryan_May.xlsx, row 16'),
  e('e4', '2025-05-21', 'Nora Chen', 'montrose', 8.5, 620, 'Drafting', 'Direct'),
  e('e5', '2025-05-22', 'Vanessa Hart', 'montrose', 4.2, 850, 'Reviewed damages model and methodology', 'Direct'),
  e('e6', '2025-05-13', 'Nora Chen', 'aster', 9.3, 620, 'Prepared quality of earnings schedules', 'Excel', 'Nora_May_part1.xlsx, row 4'),
  e('e7', '2025-05-09', 'Ryan Cole', 'northstar', 6.6, 465, 'Built back-pay model and payroll tie-out', 'Excel', 'Ryan_May.xlsx, row 8'),
]

const flags: Flag[] = [
  {
    id: 'f1',
    entryId: 'e2',
    type: 'Unusually high hours',
    title: '20 hours may be a decimal error',
    noticed: 'Nora recorded 20.0 hours on May 16; the next-highest day on Nora\'s timesheet is 9.3 hours.',
    why: 'A mistyped decimal would materially overstate the client invoice.',
    suggestion: 'Change 20.0 hours to 2.0 hours',
    change: { field: 'Hours', from: '20.0', to: '2.0' },
    impact: -11160,
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
    team: people.map((name) => ({ name, email: `${name.toLowerCase().replace(' ', '.')}@hartwellknox.example`, role: name === partner.name ? 'Partner' : 'Employee' })),
    entries,
    flags,
    messages: [],
    // Aster carries a daily-hours flag (9.3h on May 13 > 8h), so it starts in review.
    invoiceStatus: { montrose: 'In review', aster: 'In review', northstar: 'Draft' },
    submissions: {
      'Vanessa Hart': 'Submitted',
      'Nora Chen': 'Submitted',
      'Ryan Cole': 'Due soon',
      'Maya Singh': 'Overdue',
      'Eli Brooks': 'Submitted',
    },
    lastSubmitted: {
      'Vanessa Hart': '2025-05-29',
      'Nora Chen': '2025-05-29',
      'Ryan Cole': '2025-05-29',
      'Maya Singh': '2025-04-30',
      'Eli Brooks': '2025-05-29',
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
    rates: { 'Vanessa Hart': 850, 'Nora Chen': 620, 'Ryan Cole': 465, 'Maya Singh': 410, 'Eli Brooks': 380 },
    scheduledRates: {},
    reminderChannels: { inApp: true, email: false },
    reminderSchedule: { sevenDays: true, oneDay: true, overdue: true },
    threshold: 8,
    removedLines: [],
    dailyFlagState: {},
    heldRows: [],
    notifications: [],
    invoiceDates: {},
    ai: { autoClear: true },
  } satisfies Store)
}

/* ---------- Derived values ---------- */

export const formatHours = (hours: number) => hours.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

/** yyyy-mm-dd → MM/DD/YY */
export const tableDate = (iso: string) => `${iso.slice(5, 7)}/${iso.slice(8, 10)}/${iso.slice(2, 4)}`

export const initials = (name: string) =>
  name
    .split(' ')
    .map((x) => x[0])
    .join('')

export const isOpen = (f: Flag) => f.status !== 'Resolved' && f.status !== 'Dismissed'

export const shortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })

/**
 * Daily-hours flags (spec item 5): any person-day whose total across all projects exceeds the threshold.
 * Derived on every render so changing the threshold re-flags immediately. The flag sits on that day's
 * largest entry. Days already covered by an "Unusually high hours" flag are skipped.
 */
export function dailyFlags(s: Store): Flag[] {
  const days = new Map<string, Entry[]>()
  s.entries.forEach((e) => days.set(`${e.employee}|${e.date}`, [...(days.get(`${e.employee}|${e.date}`) ?? []), e]))
  const flags: Flag[] = []
  days.forEach((list, key) => {
    const total = Math.round(list.reduce((n, e) => n + e.hours, 0) * 100) / 100
    if (total <= s.threshold) return
    const top = [...list].sort((a, b) => b.hours - a.hours)[0]
    if (s.flags.some((f) => f.entryId === top.id && f.type === 'Unusually high hours')) return
    const [person, date] = key.split('|')
    const first = person.split(' ')[0]
    const id = `daily-${person}-${date}`
    const state = s.dailyFlagState[id]
    flags.push({
      id,
      entryId: top.id,
      kind: 'daily',
      type: 'Daily hours',
      title: `${formatHours(total)} hours on ${shortDate(date)}, above your firm's ${s.threshold}-hour limit`,
      noticed: `${first}'s entries on ${shortDate(date)} add up to ${formatHours(total)} hours across all projects.`,
      why: `Your firm checks any day above ${s.threshold} hours before it reaches a client invoice.`,
      suggestion: `Keep it with a note, edit the hours, or ask ${first}`,
      impact: 0,
      status: state?.status ?? 'Open',
      note: state?.note,
    })
  })
  return flags
}

export const allFlags = (s: Store) => [...s.flags, ...dailyFlags(s)]

/** Set a flag's status whether it is stored (s.flags) or derived (daily). Call inside update(). */
export function setFlagStatus(s: Store, flagId: string, status: FlagStatus, note?: string) {
  const stored = s.flags.find((f) => f.id === flagId)
  if (stored) {
    stored.status = status
    if (note) stored.note = note
  } else s.dailyFlagState[flagId] = { status, note: note ?? s.dailyFlagState[flagId]?.note }
}

/** Invoice line items: the project's billable entries, by date then employee last name (spec item 2). */
export const invoiceLines = (s: Store, projectId: string) =>
  s.entries
    .filter((e) => e.projectId === projectId && e.billable)
    .sort((a, b) => a.date.localeCompare(b.date) || a.employee.split(' ').at(-1)!.localeCompare(b.employee.split(' ').at(-1)!))

export const lineAmount = (e: Entry) => (e.noCharge ? 0 : e.hours * e.rate)

export const invoiceTotal = (s: Store, projectId: string) => invoiceLines(s, projectId).reduce((n, e) => n + lineAmount(e), 0)

/** Reviewer changes on this invoice: edited, no-charge and removed lines, with the net change in dollars. */
export function invoiceAdjustments(s: Store, projectId: string) {
  const edited = invoiceLines(s, projectId).filter((e) => e.review)
  const removed = s.removedLines.filter((r) => r.entry.projectId === projectId)
  const net =
    edited.reduce((n, e) => {
      const o = e.review!.original
      return n + lineAmount(e) - (o.noCharge ? 0 : o.hours * o.rate)
    }, 0) - removed.reduce((n, r) => n + lineAmount(r.entry), 0)
  return { count: edited.length + removed.length, net }
}

/** Snapshot an entry's values before its first reviewer change. Call inside update(). */
export function snapshotForReview(entry: Entry, by: string) {
  entry.review ??= { by, original: { hours: entry.hours, description: entry.description, rate: entry.rate, noCharge: Boolean(entry.noCharge) } }
}

export const sourceOf = (e: Entry) => e.sourceRef ?? (e.source === 'Direct' ? `Direct entry, ${shortDate(e.date)}` : 'Excel import')

export const openFlagsFor = (s: Store, projectId: string) =>
  allFlags(s).filter((f) => isOpen(f) && s.entries.find((x) => x.id === f.entryId)?.projectId === projectId)

export const entryIsFlagged = (s: Store, entryId: string) => allFlags(s).some((f) => f.entryId === entryId && isOpen(f))

/** A draft invoice still waits on time; every other status has its time in (Figma: Coleman "Time missing"). */
export const completeness = (s: Store, projectId: string) => (s.invoiceStatus[projectId] === 'Draft' ? 'Time missing' : 'Complete')

/** People whose timesheet is overdue (Figma: "01 timesheet missing", "Maya is overdue"). */
export const overduePeople = (s: Store) => Object.keys(s.submissions).filter((p) => s.submissions[p] === 'Overdue')

/** Whole days from the pinned demo date to a yyyy-mm-dd date. */
export const daysFromToday = (iso: string) => Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${demoToday}T00:00:00Z`)) / 86400000)

/** Invoices that still need Vanessa's attention (drives "Review N invoices"). */
export const invoicesNeedingReview = (s: Store) =>
  Object.values(s.invoiceStatus).filter((x) => x === 'In review' || x === 'Ready to approve' || x === 'Awaiting employee').length

/** The demo spreadsheet behind "Select demo file" (Figma 36:3871; second row added for spec item 3). */
export const demoImport = {
  fileName: 'Nora_May.xlsx',
  employee: 'Nora Chen',
  columns: [
    { column: 'Work date', field: 'Date', sample: 'May 27, 2025' },
    { column: 'Matter', field: 'Project', sample: 'Aster Labs Acq.' },
    { column: 'Hrs', field: 'Hours', sample: '2.0' },
    { column: 'Task / Notes', field: 'Description', sample: 'Reviewed acquisition schedules' },
  ],
  /** Synthetic rows. "suggest" = uncertain match Tally proposes; null = no matching project. */
  rows: [
    { row: 2, date: '2025-05-27', matter: 'Aster Labs Acq.', suggest: 'aster' as string | null, hours: 2, description: 'Reviewed acquisition schedules' },
    { row: 3, date: '2025-05-28', matter: 'Henley Arbitration', suggest: null as string | null, hours: 3.5, description: 'Reviewed arbitration exhibits' },
  ],
}

/** Turn an imported or held row into a submitted time entry. Call inside update(). */
export function entryFromRow(s: Store, row: { date: string; hours: number; description: string; employee: string; file: string; row?: number }, projectId: string, id: string): Entry {
  return {
    id,
    date: row.date,
    employee: row.employee,
    projectId,
    hours: row.hours,
    rate: s.rates[row.employee],
    description: row.description,
    billable: true,
    status: 'Submitted',
    source: 'Excel',
    sourceRef: row.row ? `${row.file}, row ${row.row}` : row.file,
    submittedAt: demoToday,
  }
}


/**
 * Add a reply and move the thread to the top: s.messages is kept newest-activity first (new threads are
 * unshifted), so the inbox lists conversations by their latest message. Call inside update().
 */
export function addReply(s: Store, messageId: string, reply: Message['replies'][number]) {
  const i = s.messages.findIndex((m) => m.id === messageId)
  const [m] = s.messages.splice(i, 1)
  m.replies.push(reply)
  s.messages.unshift(m)
  return m
}

export const projectName = (s: Store, projectId: string) => s.projects.find((p) => p.id === projectId)?.name ?? 'Unknown project'

export type DisplayStatus = 'Draft' | 'Submitted' | 'Flagged' | 'Updated'
export const displayStatus = (s: Store, entry: Entry): DisplayStatus =>
  entryIsFlagged(s, entry.id) ? 'Flagged' : entry.status === 'Updated after submission' ? 'Updated' : entry.status

/** Entries on approved/exported invoices can no longer be edited or deleted. */
export const entryIsLocked = (s: Store, entry: Entry) => ['Approved', 'Exported', 'Sent'].includes(s.invoiceStatus[entry.projectId])

export const isFinal = (status: InvoiceStatus) => status === 'Approved' || status === 'Exported' || status === 'Sent'

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
