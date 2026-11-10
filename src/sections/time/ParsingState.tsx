/** Brief "reading the file" state between drop and mapping (prototype code layer, 700ms). */
export function ParsingState() {
  return (
    <section aria-live="polite" className="min-h-80 rounded-lg border border-line bg-surface p-5 shadow-card">
      <div className="flex min-h-68.75 flex-col items-center justify-center gap-3">
        <span className="size-9 animate-spin rounded-full border-3 border-spinner-track border-t-brand motion-reduce:animate-none" aria-hidden="true" />
        <h2 className="text-body font-semibold text-ink">Reading columns and checking project names…</h2>
      </div>
    </section>
  )
}
