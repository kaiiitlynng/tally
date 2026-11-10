import { useEffect, useRef, useState } from 'react'
import { Icon } from '../../components/Icon'
import type { Project } from '../../data/store'

export interface EntryFilters {
  dateFrom: string
  dateTo: string
  projectId: string
  status: string
  billable: string
  source: string
}
export const emptyFilters: EntryFilters = { dateFrom: '', dateTo: '', projectId: '', status: '', billable: '', source: '' }

export type EntrySort = 'date-desc' | 'date-asc' | 'project-asc' | 'project-desc' | 'hours-desc' | 'hours-asc' | 'status'
export const SORTS: [EntrySort, string][] = [
  ['date-desc', 'Date: Newest first'],
  ['date-asc', 'Date: Oldest first'],
  ['project-asc', 'Project: A–Z'],
  ['project-desc', 'Project: Z–A'],
  ['hours-desc', 'Hours: Highest first'],
  ['hours-asc', 'Hours: Lowest first'],
  ['status', 'Status'],
]

interface ToolbarProps {
  count: number
  projects: Project[]
  filters: EntryFilters
  setFilters: (f: EntryFilters) => void
  sort: EntrySort | null
  setSort: (s: EntrySort) => void
  search: string
  setSearch: (s: string) => void
  structuredActive: boolean
}

const TOOL = 'grid size-7.25 place-items-center rounded-8 transition-colors focus-visible:outline-2 focus-visible:outline-dark'
const SELECT = 'h-8 w-full rounded-8 border border-line bg-white px-2 text-8 font-normal text-ink focus:outline-2 focus:outline-dark/20'
const LABEL = 'mt-2.25 flex flex-col gap-1.25 text-7 font-semibold text-filter-label'

/**
 * "3 entries" + Filter / Sort / Search (Figma 36:12850 shows the closed toolbar; popovers follow the
 * prototype code layer). Click outside or Esc closes an open tool.
 */
export function EntriesToolbar({ count, projects, filters, setFilters, sort, setSort, search, setSearch, structuredActive }: ToolbarProps) {
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

  const toolClass = (active: boolean) => `${TOOL} ${active ? 'bg-segment' : 'hover:bg-segment'}`
  const set = (patch: Partial<EntryFilters>) => setFilters({ ...filters, ...patch })

  return (
    <div className="flex min-h-9.5 items-center justify-between pt-2">
      <span className="text-8 text-ink-muted" aria-live="polite">
        {count} {count === 1 ? 'entry' : 'entries'}
      </span>
      <div ref={ref} className="relative flex items-center gap-0.75">
        {searchOpen && (
          <div className="flex h-7.5 w-51.25 items-center gap-1.5 rounded-9 border border-line bg-menu pr-1.75 pl-2.25">
            <Icon name="search-field" size={14} />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries"
              aria-label="Search descriptions and projects"
              className="min-w-0 flex-1 bg-transparent text-9 outline-none"
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
          className={toolClass(open === 'sort' || (sort !== null && sort !== 'date-desc'))}
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
          <div role="dialog" aria-label="Filter entries" className="absolute top-full right-0 z-35 mt-1.75 w-65 rounded-13 border border-line-step bg-modal p-3 shadow-popover">
            <div className="mb-2.75 flex items-center justify-between">
              <b className="text-10 font-bold">Filter entries</b>
              <button type="button" onClick={() => setFilters(emptyFilters)} className="text-7 text-link underline">
                Reset filters
              </button>
            </div>
            <div className="rounded-9 bg-filter-panel p-2.5">
              <small className="text-7 font-semibold text-filter-label">Custom date range</small>
              <div className="grid grid-cols-2 gap-1.75">
                <label className={`${LABEL} mt-1.75`}>
                  From
                  <input type="date" value={filters.dateFrom} onChange={(e) => set({ dateFrom: e.target.value })} className={SELECT} />
                </label>
                <label className={`${LABEL} mt-1.75`}>
                  To
                  <input type="date" value={filters.dateTo} onChange={(e) => set({ dateTo: e.target.value })} className={SELECT} />
                </label>
              </div>
              <p className="mt-1.75 text-7 leading-[1.35] text-ink-meta">Setting a range temporarily overrides the selected month.</p>
            </div>
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
                  <option key={s}>{s}</option>
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
          <div role="dialog" aria-label="Sort entries" className="absolute top-full right-0 z-35 mt-1.75 w-52.5 rounded-13 border border-line-step bg-modal p-2 shadow-popover">
            <b className="block px-1.75 pt-1.25 pb-2 text-10 font-bold">Sort entries</b>
            {SORTS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={sort === value}
                onClick={() => {
                  setSort(value)
                  setOpen(null)
                }}
                className={`flex min-h-7.75 w-full items-center justify-between rounded-7 px-2 text-left text-8 ${
                  sort === value ? 'bg-segment text-success-ink' : 'text-ink-subtle hover:bg-segment hover:text-success-ink'
                }`}
              >
                <span>{label}</span>
                {sort === value && <Icon name="check-sort" size={13} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Active-filter chips with per-chip remove + "Clear all" (prototype .filter-chips). */
export function FilterChips({ chips, onClearAll }: { chips: { label: string; onRemove: () => void }[]; onClearAll: () => void }) {
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1.25 pb-2.25">
      {chips.map((c) => (
        <button
          key={c.label}
          type="button"
          onClick={c.onRemove}
          aria-label={`Remove filter: ${c.label}`}
          className="inline-flex min-h-6.25 items-center gap-1.25 rounded-12 border border-line-step bg-chip px-2 text-7 text-chip-ink hover:bg-white"
        >
          {c.label} <Icon name="close-chip" size={11} />
        </button>
      ))}
      <button type="button" onClick={onClearAll} className="px-2 text-7 text-link underline">
        Clear all
      </button>
    </div>
  )
}
