import { uid, useDemo } from '../components/DemoContext'
import { demoToday, entryIsLocked, type Entry, type EntryForm, type EntryWarning } from '../data/store'

/**
 * Create or update a time entry for the signed-in user (ported from the prototype's `commit`).
 * Returns 'locked' when the entry sits on an approved/exported invoice and cannot change.
 */
export function useCommitEntry() {
  const { store, update, me, role } = useDemo()

  return (form: EntryForm, submit: boolean, acknowledged: EntryWarning[], existingId?: string): 'ok' | 'locked' => {
    const existing = existingId ? store.entries.find((e) => e.id === existingId) : undefined
    if (existing && entryIsLocked(store, existing)) return 'locked'
    const invoiceStatus = existing ? store.invoiceStatus[existing.projectId] : undefined

    update((s) => {
      const status: Entry['status'] =
        existing?.status === 'Submitted' || existing?.status === 'Updated after submission' ? 'Updated after submission' : submit ? 'Submitted' : 'Draft'
      const record: Entry = {
        id: existing?.id ?? uid(),
        date: form.date,
        employee: me.name,
        projectId: form.projectId,
        hours: Number(form.hours),
        rate: s.rates[me.name],
        description: form.description.trim(),
        billable: form.billable,
        status,
        source: existing?.source ?? 'Direct',
        original: existing ? (existing.original ?? `${existing.date} · ${existing.hours}h · ${existing.description}`) : undefined,
        submittedAt: existing?.submittedAt ?? (submit ? demoToday : undefined),
      }
      s.entries = existing ? s.entries.map((e) => (e.id === existing.id ? record : e)) : [...s.entries, record]

      if (submit) {
        s.lastSubmitted[me.name] = demoToday
        // The partner isn't on the reminder schedule, so their own submissions don't touch the reminder log.
        if (role !== 'partner') s.reminderLog.unshift(`${me.name} submitted time; pending overdue reminders canceled`)
        // Warnings the person confirmed still reach the billing reviewer as flags.
        acknowledged.forEach((w) =>
          s.flags.push({
            id: uid(),
            entryId: record.id,
            type: w.kind,
            title: w.message,
            noticed: `${me.name} reviewed and confirmed this entry before submitting it.`,
            why: 'The employee confirmed the value, but the billing reviewer should still see the concern.',
            suggestion: 'Review the employee-confirmed entry',
            impact: 0,
            status: 'Open',
          }),
        )
      }

      if (existing && ['In review', 'Awaiting employee', 'Ready to approve'].includes(invoiceStatus ?? '')) {
        s.invoiceStatus[existing.projectId] = 'In review'
        s.messages.unshift({
          id: uid(),
          projectId: existing.projectId,
          entryId: existing.id,
          from: me.name,
          to: s.projects.find((p) => p.id === existing.projectId)?.reviewer ?? 'Vanessa Hart',
          subject: 'Time entry updated during invoice review',
          body: `${me.name} updated a submitted entry. The affected invoice now needs re-review.`,
          time: 'Just now',
          unreadBy: ['partner'],
          status: 'Open',
          replies: [],
        })
      }

      s.audit.unshift(
        existing ? `${me.name} updated time entry ${existing.id}; original values preserved` : `${me.name} ${submit ? 'submitted' : 'saved'} a direct time entry`,
      )
    })
    return 'ok'
  }
}
