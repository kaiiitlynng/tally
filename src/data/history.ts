// Read-only archive of closed billing cycles (demo data, not in Figma). It lives outside the mutable Store,
// so "Reset demo" never touches it and nothing in the current cycle can edit it.
import { periodLabel, type BillingPeriod, type Project, type Store } from './store'

export interface ArchivedLine {
  date: string // yyyy-mm-dd
  employee: string
  description: string
  hours: number
  rate: number
}

export interface ArchivedInvoice {
  id: string
  projectId: string
  status: 'Sent' | 'Exported'
  approvedAt: string // yyyy-mm-dd
  sentAt?: string // yyyy-mm-dd, only for Sent
  lines: ArchivedLine[]
}

export interface PastCycle {
  period: BillingPeriod
  invoices: ArchivedInvoice[]
}

/** Projects that closed before the current cycle; they only appear under "Past Projects". */
export const archivedProjects: Project[] = [
  {
    id: 'harlow',
    client: 'Harlow Foods',
    name: 'Harlow Foods v. Brightline Logistics',
    code: '2025-012',
    type: 'Litigation support',
    contact: 'Priya Desai',
    email: 'ap@harlowfoods.example',
    address: '901 Commerce Street, Dallas, TX 75202',
    people: ['Vanessa Hart', 'Nora Chen', 'Maya Singh'],
    reviewer: 'Vanessa Hart',
    status: 'Completed',
    deadline: 'May 3',
    completedDate: '2025-04-25',
  },
  {
    id: 'pembrook',
    client: 'Pembrook Capital',
    name: 'Pembrook Capital valuation review',
    code: '2025-009',
    type: 'Valuation',
    contact: 'Marcus Lee',
    email: 'finance@pembrook.example',
    address: '200 Clarendon Street, Boston, MA 02116',
    people: ['Vanessa Hart', 'Eli Brooks'],
    reviewer: 'Vanessa Hart',
    status: 'Completed',
    deadline: 'April 3',
    completedDate: '2025-03-28',
  },
]

/** Closed cycles, most recent first. Montrose and Aster also billed in these months. */
export const pastCycles: PastCycle[] = [
  {
    period: { year: 2025, month: 4 },
    invoices: [
      {
        id: 'montrose-2025-04',
        projectId: 'montrose',
        status: 'Sent',
        approvedAt: '2025-05-02',
        sentAt: '2025-05-03',
        lines: [
          { date: '2025-04-08', employee: 'Nora Chen', description: 'Reviewed general ledger extracts', hours: 6.5, rate: 620 },
          { date: '2025-04-15', employee: 'Ryan Cole', description: 'Built damages schedule draft', hours: 7.2, rate: 465 },
          { date: '2025-04-22', employee: 'Vanessa Hart', description: 'Call with counsel on scope', hours: 1.5, rate: 850 },
          { date: '2025-04-29', employee: 'Nora Chen', description: 'Reconciled vendor payments', hours: 5.0, rate: 620 },
        ],
      },
      {
        id: 'aster-2025-04',
        projectId: 'aster',
        status: 'Sent',
        approvedAt: '2025-05-02',
        sentAt: '2025-05-03',
        lines: [
          { date: '2025-04-10', employee: 'Nora Chen', description: 'Quality of earnings data request', hours: 4.0, rate: 620 },
          { date: '2025-04-24', employee: 'Vanessa Hart', description: 'Reviewed diligence findings', hours: 2.0, rate: 850 },
        ],
      },
      {
        id: 'harlow-2025-04',
        projectId: 'harlow',
        status: 'Sent',
        approvedAt: '2025-04-30',
        sentAt: '2025-05-01',
        lines: [
          { date: '2025-04-03', employee: 'Maya Singh', description: 'Indexed shipping records', hours: 6.0, rate: 410 },
          { date: '2025-04-11', employee: 'Nora Chen', description: 'Lost-profits model update', hours: 5.5, rate: 620 },
          { date: '2025-04-23', employee: 'Vanessa Hart', description: 'Final expert report review', hours: 3.0, rate: 850 },
        ],
      },
    ],
  },
  {
    period: { year: 2025, month: 3 },
    invoices: [
      {
        id: 'montrose-2025-03',
        projectId: 'montrose',
        status: 'Sent',
        approvedAt: '2025-04-02',
        sentAt: '2025-04-03',
        lines: [
          { date: '2025-03-12', employee: 'Vanessa Hart', description: 'Engagement kickoff with client', hours: 2.0, rate: 850 },
          { date: '2025-03-19', employee: 'Nora Chen', description: 'Document request list', hours: 3.5, rate: 620 },
          { date: '2025-03-27', employee: 'Ryan Cole', description: 'Organized produced documents', hours: 6.0, rate: 465 },
        ],
      },
      {
        id: 'harlow-2025-03',
        projectId: 'harlow',
        status: 'Sent',
        approvedAt: '2025-04-01',
        sentAt: '2025-04-02',
        lines: [
          { date: '2025-03-06', employee: 'Nora Chen', description: 'Reviewed carrier contracts', hours: 4.5, rate: 620 },
          { date: '2025-03-20', employee: 'Maya Singh', description: 'Built freight cost summary', hours: 7.0, rate: 410 },
        ],
      },
      {
        id: 'pembrook-2025-03',
        projectId: 'pembrook',
        status: 'Exported',
        approvedAt: '2025-03-31',
        lines: [
          { date: '2025-03-05', employee: 'Eli Brooks', description: 'Comparable company screen', hours: 6.5, rate: 380 },
          { date: '2025-03-14', employee: 'Eli Brooks', description: 'DCF model inputs', hours: 5.0, rate: 380 },
          { date: '2025-03-26', employee: 'Vanessa Hart', description: 'Valuation memo sign-off', hours: 2.5, rate: 850 },
        ],
      },
    ],
  },
]

export const archivedInvoiceTotal = (inv: ArchivedInvoice) => inv.lines.reduce((n, l) => n + l.hours * l.rate, 0)

export function findArchivedInvoice(id: string): { invoice: ArchivedInvoice; period: BillingPeriod } | undefined {
  for (const cycle of pastCycles) {
    const invoice = cycle.invoices.find((inv) => inv.id === id)
    if (invoice) return { invoice, period: cycle.period }
  }
}

/** A current project from the store, or an archived one. */
export const projectById = (s: Store, id: string) => s.projects.find((p) => p.id === id) ?? archivedProjects.find((p) => p.id === id)

/** Most recent closed cycle that billed this project, with its invoice. */
export function lastBilled(projectId: string): { invoice: ArchivedInvoice; period: BillingPeriod; label: string } | undefined {
  for (const cycle of pastCycles) {
    const invoice = cycle.invoices.find((inv) => inv.projectId === projectId)
    if (invoice) return { invoice, period: cycle.period, label: periodLabel(cycle.period) }
  }
}
