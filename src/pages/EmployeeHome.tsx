import { Link } from 'react-router'
import { DarkLinkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { SectionHeading } from '../components/SectionHeading'
import { daysFromToday } from '../data/store'

/** Employee home (Figma 36:11419 → content 36:11446). Copy for the "question waiting" state is from the code layer. */
export default function EmployeeHome() {
  const { store, me } = useDemo()
  const mine = store.entries.filter((e) => e.employee === me.name)
  const drafts = mine.filter((e) => e.status === 'Draft').length
  const openRequests = store.messages.filter((m) => m.to === me.name && m.status === 'Open').length
  const assigned = store.projects.filter((p) => p.people.includes(me.name))
  const daysLeft = Math.max(0, daysFromToday('2025-06-03'))
  // "On track" only while nothing is waiting on Nora and her timesheet isn't overdue.
  const onTrack = !openRequests && store.submissions[me.name] !== 'Overdue'

  const quick = [
    { to: '/time', icon: 'quick-plus', title: 'Log time', hint: 'Enter hours directly' },
    { to: '/time?mode=import', icon: 'quick-upload', title: 'Upload timesheet', hint: 'Import an Excel file' },
    { to: '/time', icon: 'quick-entries', title: 'My entries', hint: `${mine.length} entries this period` },
    { to: '/messages', icon: 'quick-messages', title: 'Messages', hint: openRequests ? `${openRequests} needs a response` : 'No open requests' },
  ]

  return (
    <>
      <PageTitle
        title={`Good morning, ${me.firstName}.`}
        description="Log your work, respond to billing questions, and submit by June 3."
        actions={onTrack && <Pill tone="success">On track</Pill>}
      />

      <section
        aria-labelledby="employee-hero"
        className="relative isolate mt-6 flex min-h-48 items-center justify-between overflow-hidden rounded-xl border border-hero-line bg-hero-employee px-8 py-8 shadow-hero"
      >
        <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-40 -z-10 h-44 w-200 origin-center animate-ribbon ribbon" />
        <div>
          <div className="pt-0.5">
            <Pill tone="accent">Due June 3</Pill>
          </div>
          <h2 id="employee-hero" className="pt-3.5 text-title-lg font-semibold tracking-title text-ink">
            {openRequests ? 'A billing question needs your response' : 'Your time is almost ready'}
          </h2>
          <p className="pt-2 pb-6 text-lead text-hero-ink">
            {openRequests ? 'Vanessa linked the exact entry that needs clarification.' : `${mine.length} entries saved. ${drafts} still in draft.`}
          </p>
          <DarkLinkButton to={openRequests ? '/messages' : '/time'}>{openRequests ? 'Respond now' : 'Log time'}</DarkLinkButton>
        </div>
        {/* Gradient rim (ribbon colors) around a white disc keeps the count legible over the ribbon. */}
        <div className="grid size-30 shrink-0 place-items-center rounded-full ribbon-rim p-1 shadow-raised">
          <div className="flex size-full flex-col items-center justify-center rounded-full bg-surface text-ink">
            <b className="font-display text-display font-bold tracking-stat-ring text-brand">{String(daysLeft).padStart(2, '0')}</b>
            <span className="text-caption font-medium text-ink-muted">{daysLeft === 1 ? 'day left' : 'days left'}</span>
          </div>
        </div>
      </section>

      <nav aria-label="Quick actions" className="grid grid-cols-4 gap-3 pt-6">
        {quick.map((q) => (
          <Link
            key={q.title}
            to={q.to}
            className="group grid grid-cols-[20px_1fr] grid-rows-[auto_auto] items-center gap-x-3 gap-y-0.5 rounded-lg border border-line bg-surface p-4 shadow-card card-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="row-span-2 grid place-items-center transition-transform duration-200 ease-stripe group-hover:scale-110">
              <Icon name={q.icon} size={18} />
            </span>
            <b className="text-body font-semibold text-ink">{q.title}</b>
            <span className="text-small text-ink-muted">{q.hint}</span>
          </Link>
        ))}
      </nav>

      <section aria-labelledby="assigned" className="mt-6 rounded-lg border border-line bg-surface shadow-card p-5">
        <SectionHeading id="assigned" title="My assigned projects" description="Only projects you can charge time to appear here." />
        <ul className="pt-2.5">
          {assigned.map((p) => (
            <li key={p.id} className="flex items-center gap-3 border-t border-line-row py-3">
              <span className="grid size-9 place-items-center rounded-md bg-mini-tile text-caption font-semibold text-brand" aria-hidden="true">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="flex-1">
                <b className="block text-body font-semibold">{p.name}</b>
                <small className="block pt-0.5 text-small text-ink-muted">
                  {p.client} · {p.code}
                </small>
              </div>
              {/* Figma fixes this pill at 34×34 (text overflows); sized to content here. The code layer always shows "Active". */}
              <Pill tone="success">Active</Pill>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
