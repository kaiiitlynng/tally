export interface WorkflowStep {
  id: 'setup' | 'collect' | 'review' | 'approve'
  /** Step name from the Figma workflow tracker (36:86). */
  label: string
  /** Page that does this step, as named in the sidebar (Figma 36:289). */
  page: { to: string; label: string; icon: string }
}

/**
 * The billing workflow (Figma tracker 36:86), minus Tally's own "Tally prepares" step, which the owner removed
 * from the nav (2026-11-10). The partner sidebar's Billing group renders from this
 * list, so each nav item is one step of the workflow.
 */
export const WORKFLOW: WorkflowStep[] = [
  { id: 'setup', label: 'Set up projects', page: { to: '/clients', label: 'Clients & Projects', icon: 'nav-clients-projects' } },
  { id: 'collect', label: 'Collect time', page: { to: '/time', label: 'Time Entries', icon: 'nav-time-entries' } },
  { id: 'review', label: 'Review', page: { to: '/review', label: 'Ready for Review', icon: 'nav-review-invoices' } },
  { id: 'approve', label: 'Approve & export', page: { to: '/invoices', label: 'Approved Invoices', icon: 'nav-invoices' } },
]
