import { Pill, type PillTone } from '../../components/Pill'
import { SectionHeading } from '../../components/SectionHeading'
import { useDemo } from '../../components/DemoContext'
import { entryIsFlagged, tableDate } from '../../data/store'

type DisplayStatus = 'Submitted' | 'Flagged' | 'Draft'
const STATUS_TONE: Record<DisplayStatus, PillTone> = {
  Submitted: 'success',
  Flagged: 'accent',
  Draft: 'neutral', // no Figma frame shows a draft row; reuses the neutral "Draft" pill from Home
}

// Figma grid (36:1374): 72 / 92 / 170 / 271 / 88 / 50 / 130 / 32 px, 8px gaps, 16px side padding.
// Widths below include the trailing gap; Description takes the remaining space.
const COL_WIDTHS: (number | undefined)[] = [96, 100, 178, undefined, 96, 58, 138, 48]

const TH = 'h-11.5 pr-2 text-left align-middle text-7 font-normal tracking-th text-ink-th uppercase'
const TD = 'h-11.5 border-t border-line-row py-2.5 pr-2 align-middle text-9 text-ink'

/** "All submitted time" table (Figma 36:1365). */
export function SubmittedTimeTable() {
  const { store } = useDemo()
  // Newest first, as in the prototype (it renders the entry list reversed).
  const rows = [...store.entries].reverse()
  const total = rows.reduce((sum, e) => sum + e.hours, 0)
  const projectName = (id: string) => store.projects.find((p) => p.id === id)?.name ?? 'Unknown project'

  return (
    <section aria-labelledby="all-time" className="pt-6.25">
      <SectionHeading id="all-time" title="All submitted time" description={`May billing period · ${total.toFixed(1)} total hours`} />
      <div className="mt-2.5 overflow-hidden rounded-14 border border-line bg-surface">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {COL_WIDTHS.map((w, i) => (
              <col key={i} style={w ? { width: w } : undefined} />
            ))}
          </colgroup>
          <thead>
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
          </thead>
          <tbody>
            {rows.map((e) => {
              const status: DisplayStatus = entryIsFlagged(store, e.id) ? 'Flagged' : e.status
              return (
              <tr key={e.id}>
                <td className={`${TD} pl-4`}>{tableDate(e.date)}</td>
                <td className={`${TD} truncate`}>{e.employee}</td>
                <td className={`${TD} truncate`}>{projectName(e.projectId)}</td>
                <td className={`${TD} truncate`}>{e.description}</td>
                <td className={`${TD} text-8 text-ink-source`}>{e.source === 'Excel' ? 'Excel import' : 'Direct entry'}</td>
                <td className={`${TD} text-right`}>{e.hours.toFixed(1)}</td>
                <td className={TD}>
                  <Pill tone={STATUS_TONE[status]} size="lg">
                    {status}
                  </Pill>
                </td>
                <td className={`${TD} pr-4`} />
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
