/** Brief "reading the file" state between drop and mapping (prototype code layer, 700ms). */
export function ParsingState() {
  return (
    <section aria-live="polite" className="min-h-80 rounded-16 border border-line bg-surface p-5.25">
      <div className="flex min-h-68.75 flex-col items-center justify-center gap-3">
        <span className="size-8.75 animate-spin rounded-full border-3 border-spinner-track border-t-orange motion-reduce:animate-none" aria-hidden="true" />
        <h3 className="text-11 font-bold text-ink">Reading columns and checking project names…</h3>
      </div>
    </section>
  )
}
