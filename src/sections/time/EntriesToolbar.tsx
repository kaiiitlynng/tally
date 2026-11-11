import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../components/Icon'
import { currentPeriod, entryIsInPeriod, monthNames, type Project } from '../../data/store'

/**
 * The billing-period filter, like a Notion view filter: 'current' (the default view), a month key ('2025-04'),
 * 'all', or 'custom' (dateFrom/dateTo).
 */
export type PeriodFilter = string

export interface EntryFilters {
  period: PeriodFilter
  /** Only used when period is 'custom'. */
  dateFrom: string
  dateTo: string
  /** Partner only: one team member's entries. */
  employee: string
  projectId: string
  status: string
  billable: string
  source: string
}
/** The view's saved state: current billing period, nothing else. "Reset view" returns here. */
export const defaultFilters: EntryFilters = { period: 'current', dateFrom: '', dateTo: '', employee: '', projectId: '', status: '', billable: '', source: '' }

export const isDefaultFilters = (f: EntryFilters) => (Object.keys(defaultFilters) as (keyof EntryFilters)[]).every((k) => f[k] === defaultFilters[k])

const pad = (n: number) => String(n).padStart(2, '0')
const currentKey = `${currentPeriod.year}-${pad(currentPeriod.month)}`
const monthText = (key: string) => `${monthNames[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}`
const shortDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

/** "May 2025", "April 2025", "All time", or "May 3 – May 20" for custom dates. */
export function periodText(f: EntryFilters) {
  if (f.period === 'all') return 'All time'
  if (f.period === 'custom') return f.dateFrom || f.dateTo ? `${f.dateFrom ? shortDate(f.dateFrom) : '…'} – ${f.dateTo ? shortDate(f.dateTo) : '…'}` : 'Custom dates'
  return monthText(f.period === 'current' ? currentKey : f.period)
}

/** Period choices: the current period first, then every other month that has entries (newest first). */
export function periodOptions(dates: string[]): { value: PeriodFilter; label: string }[] {
  const months = [...new Set(dates.map((d) => d.slice(0, 7)))].filter((m) => m !== currentKey).sort().reverse()
  return [{ value: 'current', label: monthText(currentKey) }, ...months.map((m) => ({ value: m, label: monthText(m) }))]
}

/** The period filter value for a date: 'current' when it's in the current period, else its month key. */
export const periodFor = (date: string): PeriodFilter => (date.slice(0, 7) === currentKey ? 'current' : date.slice(0, 7))

/** Whether an entry date falls inside the filter's period. */
export function matchesPeriod(date: string, f: EntryFilters) {
  if (f.period === 'all') return true
  if (f.period === 'custom') return (!f.dateFrom || date >= f.dateFrom) && (!f.dateTo || date <= f.dateTo)
  if (f.period === 'current') return entryIsInPeriod(date, currentPeriod)
  return date.startsWith(f.period)
}

export type SortKey = 'date' | 'employee' | 'project' | 'description' | 'source' | 'hours' | 'status'
export interface EntrySort {
  key: SortKey
  dir: 'asc' | 'desc'
}
/** Default for both tables (spec item 2): date ascending, then employee last name A–Z. */
export const DEFAULT_SORT: EntrySort = { key: 'date', dir: 'asc' }
export const sameSort = (a: EntrySort, b: EntrySort) => a.key === b.key && a.dir === b.dir
export const SORTS: [EntrySort, string][] = [
  [{ key: 'date', dir: 'asc' }, 'Date: Oldest first'],
  [{ key: 'date', dir: 'desc' }, 'Date: Newest first'],
  [{ key: 'project', dir: 'asc' }, 'Project: A–Z'],
  [{ key: 'project', dir: 'desc' }, 'Project: Z–A'],
  [{ key: 'hours', dir: 'desc' }, 'Hours: Highest first'],
  [{ key: 'hours', dir: 'asc' }, 'Hours: Lowest first'],
  [{ key: 'status', dir: 'asc' }, 'Status'],
]

interface ToolbarProps {
  /** Entry count shown at the left; omit to hide it (partner view). */
  count?: number
  projects: Project[]
  /** Shown as an Employee filter when given (partner view). */
  employees?: string[]
  filters: EntryFilters
  setFilters: (f: EntryFilters) => void
  sort: EntrySort
  setSort: (s: EntrySort) => void
  search: string
  setSearch: (s: string) => void
  structuredActive: boolean
  /** Dates of the entries this view can show, for the billing-period choices. */
  periods: { value: PeriodFilter; label: string }[]
}

const TOOL = 'grid size-9 place-items-center rounded-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent'
const SELECT = 'h-8 w-full rounded-sm border border-line bg-white px-2 text-caption font-normal text-ink focus:outline-2 focus:outline-accent'
const LABEL = 'mt-2.25 flex flex-col gap-1.25 text-caption font-semibold text-filter-label'

/**
 * "3 entries" + Filter / Sort / Search (Figma 36:12850 shows the closed toolbar; popovers follow the
 * prototype code layer). Click outside or Esc closes an open tool.
 */
export function EntriesToolbar({ count, projects, employees, filters, setFilters, sort, setSort, search, setSearch, structuredActive, periods }: ToolbarProps) {
  const [open, setOpen] = useState<'filter' | 'sort' | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!open && !searchOpen) return
    const dismiss = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(null)
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(null)
      setSearchOpen(false)
    }
    document.addEventListener('mousedown', dismiss)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('keydown', esc)
    }
  }, [open, searchOpen])

  const toolClass = (active: boolean) => `${TOOL} ${active ? 'bg-brand-50 ring-1 ring-brand-200' : 'hover:bg-hover'}`
  const set = (patch: Partial<EntryFilters>) => setFilters({ ...filters, ...patch })

  return (
    <div className="flex min-h-9.5 items-center justify-between pt-2">
      {count === undefined ? (
        <span />
      ) : (
        <span className="text-caption text-ink-muted" aria-live="polite">
          {count} {count === 1 ? 'entry' : 'entries'}
        </span>
      )}
      <div ref={ref} className="relative flex items-center gap-0.75">
        {searchOpen && (
          <div className="flex h-7.5 w-60 items-center gap-1.5 rounded-sm border border-line bg-menu pr-1.75 pl-2.25 focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-accent">
            <Icon name="search-field" size={14} />
            <label htmlFor="entry-search" className="text-caption font-semibold text-filter-label">
              Search
            </label>
            <input
              id="entry-search"
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="descriptions and projects"
              className="min-w-0 flex-1 bg-transparent text-small outline-none"
            />
            {search && (
              <button type="button" aria-label="Clear search" onClick={() => setSearch('')} className="grid size-5 place-items-center">
                <Icon name="close-chip" size={11} />
              </button>
            )}
          </div>
        )}
        <button
          type="button"
          aria-label="Filter entries"
          title="Filter"
          aria-expanded={open === 'filter'}
          onClick={() => {
            setOpen(open === 'filter' ? null : 'filter')
            setSearchOpen(false)
          }}
          className={toolClass(open === 'filter' || structuredActive)}
        >
          <Icon name="tool-filter" size={15} />
        </button>
        <button
          type="button"
          aria-label="Sort entries"
          title="Sort"
          aria-expanded={open === 'sort'}
          onClick={() => {
            setOpen(open === 'sort' ? null : 'sort')
            setSearchOpen(false)
          }}
          className={toolClass(open === 'sort' || !sameSort(sort, DEFAULT_SORT))}
        >
          <Icon name="tool-sort" size={15} />
        </button>
        <button
          type="button"
          aria-label="Search entries"
          title="Search"
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((o) => !o)
            setOpen(null)
          }}
          className={toolClass(searchOpen || Boolean(search))}
        >
          <Icon name="tool-search" size={15} />
        </button>

        {open === 'filter' && (
          <div role="dialog" aria-label="Filter entries" className="absolute top-full right-0 z-35 mt-1.75 w-65 rounded-lg border border-line-step bg-modal p-3 shadow-popover animate-pop">
            <div className="mb-2.75 flex items-center justify-between">
              <b className="text-small font-semibold">Filter entries</b>
              <button type="button" onClick={() => setFilters(defaultFilters)} className="text-caption text-link underline">
                Reset filters
              </button>
            </div>
            <label className={`${LABEL} mt-0`}>
              Billing period
              <select value={filters.period} onChange={(e) => set({ period: e.target.value, dateFrom: '', dateTo: '' })} className={SELECT}>
                {periods.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                    {o.value === 'current' ? ' (current)' : ''}
                  </option>
                ))}
                <option value="all">All time</option>
                <option value="custom">Custom dates</option>
              </select>
            </label>
            {filters.period === 'custom' && (
              <div className="mt-1.75 grid grid-cols-2 gap-1.75 rounded-sm bg-filter-panel p-2.5">
                <label className={`${LABEL} mt-0`}>
                  From
                  <input type="date" value={filters.dateFrom} onChange={(e) => set({ dateFrom: e.target.value })} className={SELECT} />
                </label>
                <label className={`${LABEL} mt-0`}>
                  To
                  <input type="date" value={filters.dateTo} onChange={(e) => set({ dateTo: e.target.value })} className={SELECT} />
                </label>
              </div>
            )}
            {employees && (
              <label className={LABEL}>
                Employee
                <select value={filters.employee} onChange={(e) => set({ employee: e.target.value })} className={SELECT}>
                  <option value="">All employees</option>
                  {employees.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
            )}
            <label className={LABEL}>
              Project
              <select value={filters.projectId} onChange={(e) => set({ projectId: e.target.value })} className={SELECT}>
                <option value="">All projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={LABEL}>
              Status
              <select value={filters.status} onChange={(e) => set({ status: e.target.value })} className={SELECT}>
                <option value="">All statuses</option>
                {['Draft', 'Submitted', 'Flagged', 'Updated'].map((s) => (
                  <option key={s} value={s}>
                    {s === 'Flagged' ? 'Needs review' : s}
                  </option>
                ))}
              </select>
            </label>
            <label className={LABEL}>
              Billing
              <select value={filters.billable} onChange={(e) => set({ billable: e.target.value })} className={SELECT}>
                <option value="">Billable and nonbillable</option>
                <option value="billable">Billable</option>
                <option value="nonbillable">Nonbillable</option>
              </select>
            </label>
            <label className={LABEL}>
              Source
              <select value={filters.source} onChange={(e) => set({ source: e.target.value })} className={SELECT}>
                <option value="">All sources</option>
                <option value="excel">Excel import</option>
                <option value="direct">Direct entry</option>
              </select>
            </label>
          </div>
        )}

        {open === 'sort' && (
          <div role="dialog" aria-label="Sort entries" className="absolute top-full right-0 z-35 mt-1.75 w-52.5 rounded-lg border border-line-step bg-modal p-2 shadow-popover animate-pop">
            <b className="block px-1.75 pt-1.25 pb-2 text-small font-semibold">Sort entries</b>
            {SORTS.map(([value, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={sameSort(sort, value)}
                onClick={() => {
                  setSort(value)
                  setOpen(null)
                }}
                className={`flex min-h-7.75 w-full items-center justify-between rounded-sm px-2 text-left text-caption ${
                  sameSort(sort, value) ? 'bg-segment text-success-ink' : 'text-ink-subtle hover:bg-hover hover:text-success-ink'
                }`}
              >
                <span>{label}</span>
                {sameSort(sort, value) && <Icon name="check-sort" size={13} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Filter chips, Notion-style: the billing-period filter always shows first (marked "Default" at the view's saved
 * value), with a menu to switch period; × on it widens to all time (or clears custom dates). Other active filters
 * follow with their own ×. "Reset view" restores the default filters and clears search.
 */
export function FilterChips({
  chips,
  filters,
  setFilters,
  periods,
  showReset,
  onReset,
}: {
  chips: { label: string; onRemove: () => void }[]
  filters: EntryFilters
  setFilters: (f: EntryFilters) => void
  periods: { value: PeriodFilter; label: string }[]
  showReset: boolean
  onReset: () => void
}) {
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!menu) return
    const out = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setMenu(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('mousedown', out)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', out)
      document.removeEventListener('keydown', esc)
    }
  }, [menu])

  const isDefault = filters.period === defaultFilters.period
  const custom = filters.period === 'custom'
  const pick = (period: PeriodFilter) => {
    setFilters({ ...filters, period, dateFrom: '', dateTo: '' })
    setMenu(false)
  }
  const CHIP = 'inline-flex min-h-6.25 items-center gap-1.25 rounded-lg border border-line-step bg-chip px-2 text-caption text-chip-ink'

  return (
    <div className="flex flex-wrap items-center gap-1.25 pb-2.25">
      <div ref={ref} className="relative">
        <span className={`${CHIP} pr-1`}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
            className="inline-flex items-center gap-1 rounded-xs hover:underline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="font-semibold">{custom ? 'Dates' : 'Billing period'}:</span> {periodText(filters)}
            {isDefault && <span className="rounded-xs bg-white/70 px-1 text-caption font-semibold text-ink-muted">Default</span>}
            <Icon name="chevron-down" width={8} height={5} />
          </button>
          {filters.period !== 'all' && (
            <button
              type="button"
              aria-label={custom ? 'Remove date filter' : 'Show all periods'}
              onClick={() => pick(custom ? 'current' : 'all')}
              className="grid size-4.5 place-items-center rounded-xs hover:bg-white focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Icon name="close-chip" size={11} />
            </button>
          )}
        </span>
        {menu && (
          <ul role="menu" aria-label="Billing period" className="absolute top-full left-0 z-35 mt-1 w-44 animate-pop rounded-md border border-line bg-menu p-1 shadow-menu">
            {[...periods, { value: 'all', label: 'All time' }].map((o) => (
              <li key={o.value} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={filters.period === o.value}
                  onClick={() => pick(o.value)}
                  className="flex h-8 w-full items-center justify-between rounded-sm px-2 text-left text-caption text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {o.label}
                  {filters.period === o.value && <Icon name="check-sort" size={12} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {chips.map((c) => (
        <button key={c.label} type="button" onClick={c.onRemove} aria-label={`Remove filter: ${c.label}`} className={`${CHIP} hover:bg-white`}>
          {c.label} <Icon name="close-chip" size={11} />
        </button>
      ))}
      {showReset && (
        <button type="button" onClick={onReset} className="px-2 text-caption text-link underline">
          Reset view
        </button>
      )}
    </div>
  )
}
