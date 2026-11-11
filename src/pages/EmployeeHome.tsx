import { useState } from 'react'
import { Link } from 'react-router'
import { OutlineButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { initials, isUnread, timesheetDueLabel } from '../data/store'
import { AddTimeDialog, type AddMode } from '../sections/time/AddTimeDialog'
import { ImportDropzone } from '../sections/time/ImportDropzone'

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Employee home (Figma 36:11419), laid out like the partner's Home (owner request 2026-11-10): two cards side by
 * side, uploading a timesheet (enter hours as the alternative) and checking messages.
 */
export default function EmployeeHome() {
  const { store, me, role, toast } = useDemo()
  const [adding, setAdding] = useState<{ mode: AddMode; importNow?: boolean } | null>(null)
  // Up to three conversations I'm in, newest activity first (store.messages is kept in that order).
  const threads = store.messages.filter((m) => m.from === me.name || m.to === me.name).slice(0, 3)

  return (
    <>
      <PageTitle title={`Good morning, ${me.firstName}.`} />

      <div className="grid grid-cols-2 gap-4 pt-6 wide:grid-cols-[3fr_2fr]">
        <section aria-labelledby="emp-upload" className="relative isolate overflow-hidden rounded-xl border border-hero-line bg-surface p-6 shadow-hero">
          <span aria-hidden="true" className="pointer-events-none absolute -top-28 -right-48 -z-10 h-40 w-160 origin-center animate-ribbon ribbon opacity-80" />
          <div className="flex items-start justify-between gap-4 pb-4">
            <div>
              <h2 id="emp-upload" className="text-title-sm font-semibold tracking-title text-ink">
                Upload your timesheet
              </h2>
              <p className="pt-0.5 text-small text-ink-muted">Due {timesheetDueLabel}</p>
            </div>
            <OutlineButton onClick={() => setAdding({ mode: 'enter' })} className="h-9 shrink-0 px-3 text-small">
              <Icon tint name="clock-dark" size={16} /> Enter hours directly
            </OutlineButton>
          </div>
          <ImportDropzone bare onFile={() => setAdding({ mode: 'import', importNow: true })} />
        </section>

        <section aria-labelledby="emp-messages" className="flex flex-col rounded-xl border border-hero-line bg-surface p-6 shadow-hero">
          <h2 id="emp-messages" className="text-title-sm font-semibold tracking-title text-ink">
            Messages
          </h2>
          {threads.length ? (
            <ul className="mt-3">
              {threads.map((m) => {
                const last = m.replies.at(-1) ?? m
                const other = m.from === me.name ? m.to : m.from
                const unread = isUnread(m, me.name, role)
                return (
                  <li key={m.id} className="border-b border-line-row last:border-b-0">
                    <Link to={`/messages?thread=${m.id}`} className={`-mx-2 flex items-center gap-3 rounded-sm px-2 py-3 transition-colors hover:bg-hover ${FOCUS}`}>
                      <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-avatar text-caption font-semibold text-avatar-ink">
                        {initials(other)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-body text-ink ${unread ? 'font-semibold' : 'font-medium'}`}>{m.subject}</span>
                        <span className="block truncate text-small text-ink-muted">{last.body}</span>
                      </span>
                      {unread && (
                        <span className="size-2 shrink-0 rounded-full bg-notify-ink">
                          <span className="sr-only">Unread</span>
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="flex flex-1 items-center text-body text-ink-muted">No messages yet</p>
          )}
          <div className="mt-auto pt-3">
            <Link to="/messages" className={`group -ml-2 inline-flex items-center gap-1 rounded-sm px-2 py-1 text-small font-semibold text-link transition-colors hover:bg-hover ${FOCUS}`}>
              All messages
              <Icon name="arrow-right-small" size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </div>

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
