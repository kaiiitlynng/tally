import { forwardRef, useEffect, useRef, useState } from 'react'
import { useDemo } from '../../components/DemoContext'
import { Icon } from '../../components/Icon'
import { Pill, type PillTone } from '../../components/Pill'
import { SectionHeading } from '../../components/SectionHeading'
import { displayStatus, entryIsInPeriod, entryIsLocked, formatHours, periodLabel, projectName, tableDate, type DisplayStatus, type Entry } from '../../data/store'
import { DeleteEntryDialog, EditEntryDialog, LockedEntryDialog } from './EntryDialogs'
import { EntriesToolbar, FilterChips, emptyFilters, type EntryFilters, type EntrySort } from './EntriesToolbar'

const TONE: Record<DisplayStatus, PillTone> = { Submitted: 'success', Flagged: 'accent', Draft: 'neutral', Updated: 'success' }

// Partner grid (Figma 36:1374): 72/92/170/271/88/50/130/32 px + 8px gaps; Description takes the rest.
const PARTNER_COLS: (number | undefined)[] = [96, 100, 178, undefined, 96, 58, 138, 48]
// Employee grid (Figma 36:12865): 205.8/465.29/80.53/134.22/75.16 px of 961px.
const EMPLOYEE_COLS = ['21.4%', '48.4%', '8.4%', '14%', '7.8%']

const TH = 'h-11.5 pr-2 text-left align-middle text-7 font-normal tracking-th text-ink-th uppercase'
const TD = 'h-11.5 border-t border-line-row py-2.5 pr-2 align-middle text-9 text-ink'

function RowMenu({ entry, onEdit, onDelete }: { entry: Entry; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const dismiss = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', dismiss)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const item = 'flex w-full items-center gap-1.75 rounded-7 p-2 text-left text-8 hover:bg-chip focus-visible:outline-2 focus-visible:outline-dark'
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Actions for ${entry.description}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="size-7 rounded-8 text-9 font-semibold tracking-[1px] hover:bg-segment focus-visible:outline-2 focus-visible:outline-dark"
      >
        •••
      </button>
      {open && (
        <div role="menu" className="absolute top-6.75 right-0 z-12 w-28 rounded-10 border border-line bg-menu p-1.25 shadow-menu">
          <button role="menuitem" type="button" className={item} onClick={() => (setOpen(false), onEdit())}>
            <Icon name="edit" size={13} /> Edit
          </button>
          <button role="menuitem" type="button" className={item} onClick={() => (setOpen(false), onDelete())}>
            <Icon name="close" size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

/** Entries list: partner "All submitted time" (Figma 36:1365) / employee "My entries" (36:12842). */
export const EntriesSection = forwardRef<HTMLElement, { initialProjectFilter?: string; onNotice: (msg: string) => void }>(function EntriesSection(
  { initialProjectFilter, onNotice },
  ref,
) {
  const { store, role, me, period } = useDemo()
  const [filters, setFilters] = useState<EntryFilters>({ ...emptyFilters, projectId: initialProjectFilter ?? '' })
  // Partner rows keep Figma's "most recently added first" order until a sort is chosen.
  const [sort, setSort] = useState<EntrySort | null>(role === 'employee' ? 'date-desc' : null)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Entry | null>(null)
  const [deleting, setDeleting] = useState<Entry | null>(null)
  const [locked, setLocked] = useState<Entry | null>(null)

  useEffect(() => {
    if (initialProjectFilter) setFilters((f) => ({ ...f, projectId: initialProjectFilter }))
  }, [initialProjectFilter])

  const name = (e: Entry) => projectName(store, e.projectId)
  const status = (e: Entry) => displayStatus(store, e)
  const customRange = Boolean(filters.dateFrom || filters.dateTo)
  const inRange = (e: Entry) => (!filters.dateFrom || e.date >= filters.dateFrom) && (!filters.dateTo || e.date <= filters.dateTo)

  const base =
    role === 'partner'
      ? [...store.entries].reverse().filter(inRange)
      : store.entries.filter((e) => e.employee === me.name && (customRange ? inRange(e) : entryIsInPeriod(e.date, period)))

  const term = search.trim().toLowerCase()
  const visible = base
    .filter((e) => !filters.projectId || e.projectId === filters.projectId)
    .filter((e) => !filters.status || status(e) === filters.status)
    .filter((e) => !filters.billable || (filters.billable === 'billable' ? e.billable : !e.billable))
    .filter((e) => !filters.source || (filters.source === 'excel' ? e.source === 'Excel' : e.source === 'Direct'))
    .filter((e) => !term || e.description.toLowerCase().includes(term) || name(e).toLowerCase().includes(term))
    .sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return a.date.localeCompare(b.date)
        case 'date-desc':
          return b.date.localeCompare(a.date)
        case 'project-asc':
          return name(a).localeCompare(name(b))
        case 'project-desc':
          return name(b).localeCompare(name(a))
        case 'hours-desc':
          return b.hours - a.hours
        case 'hours-asc':
          return a.hours - b.hours
        case 'status':
          return status(a).localeCompare(status(b))
        default:
          return 0
      }
    })

  const structuredActive = customRange || Boolean(filters.projectId || filters.status || filters.billable || filters.source)
  const filtersActive = structuredActive || Boolean(search)
  const clearAll = () => {
    setFilters(emptyFilters)
    setSearch('')
  }
  const chips = [
    customRange && { label: 'Custom date range', onRemove: () => setFilters({ ...filters, dateFrom: '', dateTo: '' }) },
    filters.projectId && { label: projectName(store, filters.projectId), onRemove: () => setFilters({ ...filters, projectId: '' }) },
    filters.status && { label: filters.status, onRemove: () => setFilters({ ...filters, status: '' }) },
    filters.billable && { label: filters.billable === 'billable' ? 'Billable' : 'Nonbillable', onRemove: () => setFilters({ ...filters, billable: '' }) },
    filters.source && { label: filters.source === 'excel' ? 'Excel import' : 'Direct entry', onRemove: () => setFilters({ ...filters, source: '' }) },
    search && { label: `Search: ${search}`, onRemove: () => setSearch('') },
  ].filter(Boolean) as { label: string; onRemove: () => void }[]

  const total = base.reduce((sum, e) => sum + e.hours, 0)
  const subtitle = `${customRange && role === 'employee' ? 'Custom date range' : `${role === 'employee' ? periodLabel(period) : 'May'} billing period`} · ${formatHours(total)} total hours`
  const projectsForFilter = store.projects.filter((p) => role === 'partner' || p.people.includes(me.name))

  const guard = (entry: Entry, then: (e: Entry) => void) => (entryIsLocked(store, entry) ? setLocked(entry) : then(entry))

  return (
    <section ref={ref} aria-labelledby="entries-title" className="scroll-mt-20 pt-6.25">
      <SectionHeading id="entries-title" title={role === 'employee' ? 'My entries' : 'All submitted time'} description={subtitle} />
      <EntriesToolbar
        count={visible.length}
        projects={projectsForFilter}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        search={search}
        setSearch={setSearch}
        structuredActive={structuredActive}
      />
      <FilterChips chips={chips} onClearAll={clearAll} />

      <div className="mt-1.75 overflow-hidden rounded-14 border border-line bg-surface">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {role === 'partner'
              ? PARTNER_COLS.map((w, i) => <col key={i} style={w ? { width: w } : undefined} />)
              : EMPLOYEE_COLS.map((w, i) => <col key={i} style={{ width: w }} />)}
          </colgroup>
          <thead>
            {role === 'partner' ? (
              <tr>
                <th scope="col" className={`${TH} pl-4`}>Date</th>
                <th scope="col" className={TH}>Employee</th>
                <th scope="col" className={TH}>Project</th>
                <th scope="col" className={TH}>Description</th>
                <th scope="col" className={TH}>Source</th>
                <th scope="col" className={`${TH} text-right`}>Hours</th>
                <th scope="col" className={TH}>Status</th>
                <td className="pr-4" />
              </tr>
            ) : (
              <tr>
                <th scope="col" className={`${TH} pl-4`}>Project</th>
                <th scope="col" className={TH}>Description</th>
                <th scope="col" className={TH}>Hours</th>
                <th scope="col" className={TH}>Status</th>
                <th scope="col" className={`${TH} pr-4`}>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {visible.map((e) =>
              role === 'partner' ? (
                <tr key={e.id}>
                  <td className={`${TD} pl-4`}>{tableDate(e.date)}</td>
                  <td className={`${TD} truncate`}>{e.employee}</td>
                  <td className={`${TD} truncate`}>{name(e)}</td>
                  <td className={`${TD} truncate`}>{e.description}</td>
                  <td className={`${TD} text-8 text-ink-source`}>{e.source === 'Excel' ? 'Excel import' : 'Direct entry'}</td>
                  <td className={`${TD} text-right`}>{e.hours.toFixed(1)}</td>
                  <td className={TD}>
                    <Pill tone={TONE[status(e)]} size="lg">
                      {status(e)}
                    </Pill>
                  </td>
                  <td className={`${TD} pr-4`} />
                </tr>
              ) : (
                <tr key={e.id}>
                  <td className={`${TD} h-14.5 truncate pl-4`}>{name(e)}</td>
                  <td className={`${TD} truncate`}>{e.description}</td>
                  <td className={TD}>{formatHours(e.hours)}</td>
                  <td className={TD}>
                    <Pill tone={TONE[status(e)]}>{status(e)}</Pill>
                  </td>
                  <td className={`${TD} pr-4`}>
                    <RowMenu entry={e} onEdit={() => guard(e, setEditing)} onDelete={() => guard(e, setDeleting)} />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="border-t border-line-row px-5 py-10.5 text-center text-9 text-ink-muted">
            <p>{filtersActive ? 'No entries match your filters.' : 'No time entries for this month yet.'}</p>
            {filtersActive && (
              <button type="button" onClick={clearAll} className="mt-2.25 text-8 text-link underline">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {editing && (
        <EditEntryDialog
          entry={editing}
          onClose={() => setEditing(null)}
          onSaved={(msg) => (setEditing(null), onNotice(msg))}
          onLocked={() => (setLocked(editing), setEditing(null))}
        />
      )}
      {deleting && (
        <DeleteEntryDialog
          entry={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={(msg) => (setDeleting(null), onNotice(msg))}
          onLocked={() => (setLocked(deleting), setDeleting(null))}
        />
      )}
      {locked && <LockedEntryDialog entry={locked} onClose={() => setLocked(null)} onSent={(msg) => (setLocked(null), onNotice(msg))} />}
    </section>
  )
})
