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
    <div aria-live="polite" className="pointer-events-none fixed top-20 right-8 z-45">
      {message && (
        <div key={message} role="status" className="flex animate-toast items-center gap-2.5 rounded-md bg-banner px-4 py-3 text-body font-medium text-banner-ink shadow-toast">
          <span className="grid size-6 place-items-center rounded-full bg-success-soft">
            <Icon name="check-toast" size={14} />
          </span>
          {message}
        </div>
      )}
    </div>
  )
}
