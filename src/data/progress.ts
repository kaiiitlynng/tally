import { currentPeriod, demoToday, entryIsInPeriod, formatHours, tableDate, type Project, type Store } from './store'

export type DeadlineState = 'correction' | 'submitted' | 'overdue' | 'urgent' | 'normal'

/** Employee timesheet progress for one project (ported from the prototype's projectProgress). */
export function projectProgress(s: Store, project: Project, person: string) {
  const entries = s.entries.filter((e) => e.employee === person && e.projectId === project.id && entryIsInPeriod(e.date, currentPeriod))
  const hours = entries.reduce((sum, e) => sum + e.hours, 0)
  const corrections = s.messages.filter((m) => m.projectId === project.id && m.to === person && m.status === 'Open').length
  const submitted = entries.length > 0 && entries.every((e) => e.status !== 'Draft')

  // Timesheet is due on the 3rd of the following month.
  const dueMonth = currentPeriod.month === 12 ? 1 : currentPeriod.month + 1
  const dueYear = currentPeriod.month === 12 ? currentPeriod.year + 1 : currentPeriod.year
  const dueDate = new Date(Date.UTC(dueYear, dueMonth - 1, 3))
  const dueLabel = dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const daysUntilDue = Math.round((dueDate.getTime() - Date.parse(`${demoToday}T00:00:00Z`)) / 86400000)

  const status = corrections ? 'Needs correction' : submitted ? 'Submitted' : daysUntilDue < 0 ? 'Overdue' : entries.length ? 'Draft' : 'Not started'
  const latest = entries
    .map((e) => e.submittedAt)
    .filter(Boolean)
    .sort()
    .at(-1)

  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
  return {
    hours,
    corrections,
    submitted,
    status,
    dueLabel,
    deadlineState: (corrections ? 'correction' : submitted ? 'submitted' : daysUntilDue < 0 ? 'overdue' : daysUntilDue <= 2 ? 'urgent' : 'normal') as DeadlineState,
    deadlineDisplay: corrections
      ? 'Needs correction'
      : submitted
        ? 'Submitted'
        : daysUntilDue === 0
          ? 'Due today'
          : daysUntilDue > 0
            ? `${plural(daysUntilDue, 'day')} left`
            : `${plural(Math.abs(daysUntilDue), 'day')} overdue`,
    statusText:
      status === 'Submitted'
        ? latest
          ? `Submitted ${tableDate(latest)}`
          : `Submitted: ${formatHours(hours)} hours recorded`
        : status === 'Draft'
          ? `Draft: ${formatHours(hours)} hours recorded`
          : status === 'Needs correction'
            ? `${plural(corrections, 'correction')} requested`
            : status === 'Overdue'
              ? 'Timesheet is past due'
              : 'No hours recorded yet',
  }
}

/** Card fill + matching outline per project (prototype projectTint). Full class names so Tailwind keeps them. */
export function projectTint(projectId: string) {
  const named: Record<string, string> = {
    montrose: 'bg-tint-montrose border-tint-montrose-line',
    aster: 'bg-tint-aster border-tint-aster-line',
  }
  if (named[projectId]) return named[projectId]
  const palette = ['bg-tint-a border-tint-a-line', 'bg-tint-b border-tint-b-line', 'bg-tint-c border-tint-c-line', 'bg-tint-d border-tint-d-line']
  return palette[[...projectId].reduce((t, c) => t + c.charCodeAt(0), 0) % palette.length]
}

/** Just the project's outline color (no fill), for white cards that still carry the project's color. */
export const projectOutline = (projectId: string) => projectTint(projectId).split(' ').find((c) => c.startsWith('border-'))!
