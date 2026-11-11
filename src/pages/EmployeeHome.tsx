import { useState } from 'react'
import { Link } from 'react-router'
import { OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { daysFromToday, initials, isUnread, submissionStatus, timesheetDue, timesheetDueLabel } from '../data/store'
import { AddTimeDialog, type AddMode } from '../sections/time/AddTimeDialog'
import { ImportDropzone } from '../sections/time/ImportDropzone'

/**
 * Employee home (Figma 36:11419), refocused by the owner (2026-11-10) on the two jobs an employee has: logging
 * time (drop a timesheet, or enter hours, both finishing in the "Add time" dialog) and answering billing questions.
 */
export default function EmployeeHome() {
  const { store, me, toast } = useDemo()
  const [adding, setAdding] = useState<{ mode: AddMode; importNow?: boolean } | null>(null)
  const mine = store.entries.filter((e) => e.employee === me.name)
  const drafts = mine.filter((e) => e.status === 'Draft').length
  // Threads waiting on me: addressed to me and not yet answered, or with an unread reply.
  const waiting = store.messages.filter((m) => (m.to === me.name && m.status === 'Open') || isUnread(m, me.name, 'employee'))
  const daysLeft = Math.max(0, daysFromToday(timesheetDue))
  const onTrack = !waiting.length && submissionStatus(store, me.name) !== 'Overdue'

  return (
    <>
      <PageTitle
        title={`Good morning, ${me.firstName}.`}
        actions={onTrack && <Pill tone="success">On track</Pill>}
      />

      {/* The upload drop zone is the page's central action (owner request 2026-11-10); typing hours in is secondary. */}
      <section aria-labelledby="log-time" className="relative isolate mt-6 overflow-hidden rounded-xl border border-hero-line bg-hero-employee px-8 py-7 shadow-hero">
        <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-40 -z-10 h-44 w-200 origin-center animate-ribbon ribbon" />
        <div className="flex items-start justify-between gap-6">
          <div>
            <Pill tone="accent">Due {timesheetDueLabel}</Pill>
            <h2 id="log-time" className="pt-3.5 text-title-lg font-semibold tracking-title text-ink">
              Log your May time
            </h2>
            <p className="pt-2 text-lead text-hero-ink">
              {mine.length} entries saved. {drafts} still in draft.
            </p>
          </div>
          {/* Gradient rim (ribbon colors) around a white disc keeps the count legible over the ribbon. */}
          <div className="grid size-26 shrink-0 place-items-center rounded-full ribbon-rim p-1 shadow-raised">
            <div className="flex size-full flex-col items-center justify-center rounded-full bg-surface text-ink">
              <b className="font-display text-title-lg font-bold tracking-stat-ring text-brand">{String(daysLeft).padStart(2, '0')}</b>
              <span className="text-caption font-medium text-ink-muted">{daysLeft === 1 ? 'day left' : 'days left'}</span>
            </div>
          </div>
        </div>
        <div className="mt-5 rounded-lg bg-surface">
          <ImportDropzone bare onFile={() => setAdding({ mode: 'import', importNow: true })} />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <OutlineButton onClick={() => setAdding({ mode: 'enter' })}>
            <Icon tint name="clock-dark" size={16} /> Enter hours directly
          </OutlineButton>
        </div>
      </section>

      <section aria-labelledby="waiting" className="mt-6 rounded-lg border border-line bg-surface p-5 shadow-card">
        <div className="flex items-baseline justify-between">
          <h2 id="waiting" className="text-lead font-semibold text-ink">
            Messages waiting on you
          </h2>
          <Link to="/messages" className="rounded-sm text-small font-semibold text-link hover:underline focus-visible:outline-2 focus-visible:outline-accent">
            All messages
          </Link>
        </div>
        {waiting.length ? (
          <ul className="pt-2">
            {waiting.map((m) => {
              const last = m.replies.at(-1) ?? m
              const from = m.from === me.name ? m.to : m.from
              return (
                <li key={m.id} className="flex items-center gap-3 border-t border-line-row py-3">
                  <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-avatar text-caption font-semibold text-avatar-ink">
                    {initials(from)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-body font-semibold text-ink">{m.subject}</b>
                    <p className="truncate text-small text-ink-muted">
                      {from}: {last.body}
                    </p>
                  </div>
                  <Link
                    to={`/messages?thread=${m.id}`}
                    aria-label={`Respond: ${m.subject}`}
                    className="inline-flex h-8 items-center rounded-sm px-2.5 text-small font-semibold text-link transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    Respond
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="pt-2 text-small text-ink-muted">Nothing waiting.</p>
        )}
      </section>

      {adding && (
        <AddTimeDialog
          initialMode={adding.mode}
          importNow={adding.importNow}
          onClose={(message) => {
            setAdding(null)
            if (message) toast(message)
          }}
        />
      )}
    </>
  )
}
