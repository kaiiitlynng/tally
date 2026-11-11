import { useDemo } from '../../components/DemoContext'
import { HeldRowItem } from '../home/HeldRowItem'

/** Imported time whose matter matched no project (spec item 3). Moved here from Home's removed "Needs attention" card. */
export function HeldRows() {
  const { store } = useDemo()
  if (!store.heldRows.length) return null
  return (
    <section aria-labelledby="held-rows" className="mt-6 rounded-lg border border-line bg-surface px-5 pt-4 pb-1 shadow-card">
      <h2 id="held-rows" className="text-lead font-semibold text-ink">
        Time waiting for a project
      </h2>
      <ul className="pt-1 [&>li:last-child]:border-b-0">
        {store.heldRows.map((row) => (
          <HeldRowItem key={row.id} row={row} />
        ))}
      </ul>
    </section>
  )
}
