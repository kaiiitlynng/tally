import { useEffect } from 'react'
import { Icon } from './Icon'

/** Success toast, top-right (prototype code layer .time-toast). Auto-dismisses after 3.2s. */
export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(onDone, 3200)
    return () => window.clearTimeout(t)
  }, [message, onDone])

  return (
    <div aria-live="polite" className="pointer-events-none fixed top-18.5 right-8 z-45">
      {message && (
        <div role="status" className="flex items-center gap-2 rounded-11 border border-done-line bg-banner px-3.5 py-2.75 text-9 text-banner-ink shadow-toast">
          <Icon name="check-toast" size={18} />
          {message}
        </div>
      )}
    </div>
  )
}
