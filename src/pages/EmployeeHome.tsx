import { Link } from 'react-router'
import { DarkLinkButton } from '../components/Button'
import { useDemo } from '../components/DemoContext'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { SectionHeading } from '../components/SectionHeading'

/** Employee home (Figma 36:11419 → content 36:11446). Copy for the "question waiting" state is from the code layer. */
export default function EmployeeHome() {
  const { store, me } = useDemo()
  const mine = store.entries.filter((e) => e.employee === me.name)
  const drafts = mine.filter((e) => e.status === 'Draft').length
  const openRequests = store.messages.filter((m) => m.to === me.name && m.status === 'Open').length
  const assigned = store.projects.filter((p) => p.people.includes(me.name))

  const quick = [
    { to: '/time', icon: 'quick-plus', title: 'Log time', hint: 'Enter hours directly' },
    { to: '/time?mode=import', icon: 'quick-upload', title: 'Upload timesheet', hint: 'Import an Excel file' },
    { to: '/time', icon: 'quick-entries', title: 'My entries', hint: `${mine.length} entries this period` },
    { to: '/messages', icon: 'quick-messages', title: 'Messages', hint: openRequests ? `${openRequests} needs a response` : 'No open requests' },
  ]

  return (
    <>
      <PageTitle
        eyebrow="My May timesheet"
        title={`Good morning, ${me.firstName}.`}
        description="Log your work, respond to billing questions, and submit by June 3."
        actions={<Pill tone="success">On track</Pill>}
      />

      <section
        aria-labelledby="employee-hero"
        className="mt-6 flex min-h-47.5 items-center justify-between rounded-22 border border-hero-line bg-hero-employee px-7.5 py-7 drop-shadow-hero"
      >
        <div>
          <div className="pt-0.5">
            <Pill tone="accent">Due June 3</Pill>
          </div>
          <h2 id="employee-hero" className="pt-3.5 text-28 font-medium tracking-title text-ink">
            {openRequests ? 'A billing question needs your response' : 'Your time is almost ready'}
          </h2>
          <p className="pt-1.75 pb-4.5 text-11 text-hero-ink">
            {openRequests ? 'Vanessa linked the exact entry that needs clarification.' : `${mine.length} entries saved. ${drafts} still in draft.`}
          </p>
          <DarkLinkButton to={openRequests ? '/messages' : '/time'}>{openRequests ? 'Respond now' : 'Log time'}</DarkLinkButton>
        </div>
        <div className="flex size-26.25 shrink-0 flex-col items-center justify-center rounded-full border border-ring-line bg-ring text-ink">
          <b className="font-display text-31 font-bold tracking-stat-ring">04</b>
          <span className="text-8">days left</span>
        </div>
      </section>

      <nav aria-label="Quick actions" className="grid grid-cols-4 gap-2.75 pt-5">
        {quick.map((q) => (
          <Link
            key={q.title}
            to={q.to}
            className="grid grid-cols-[38px_1fr] grid-rows-[auto_auto] gap-x-2.5 gap-y-0.5 rounded-14 border border-line bg-surface p-3.75 transition-colors hover:border-hero-line hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark"
          >
            <span className="row-span-2 grid size-9.25 place-items-center rounded-11 bg-quick-tile">
              <Icon name={q.icon} size={18} />
            </span>
            <b className="text-10 font-bold text-ink">{q.title}</b>
            <span className="text-7 text-ink-muted">{q.hint}</span>
          </Link>
        ))}
      </nav>

      <section aria-labelledby="assigned" className="mt-5 rounded-16 border border-line bg-surface p-5">
        <SectionHeading id="assigned" title="My assigned projects" description="Only projects you can charge time to appear here." />
        <ul className="pt-2.5">
          {assigned.map((p) => (
            <li key={p.id} className="flex items-center gap-2.75 border-t border-line-row py-2.75">
              <span className="grid size-8.5 place-items-center rounded-10 bg-mini-tile text-8" aria-hidden="true">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="flex-1">
                <b className="block text-9 font-bold">{p.name}</b>
                <small className="block pt-0.5 text-7 text-ink-muted">
                  {p.client} · {p.code}
                </small>
              </div>
              {/* Figma fixes this pill at 34×34 (text overflows); sized to content here. The code layer always shows "Active". */}
              <span className="rounded-10 bg-success-pill px-2.25 py-1.25 text-8 font-semibold text-success-ink">Active</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
