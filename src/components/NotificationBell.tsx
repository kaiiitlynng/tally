import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDemo } from './DemoContext'
import { Icon } from './Icon'

/** Top-bar bell with unread count (spec item 4). Partner only: notifications are for the reviewer. */
export function NotificationBell() {
  const { store, update } = useDemo()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const unread = store.notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', out)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', out)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative grid size-7.75 place-items-center rounded-full hover:bg-segment focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Icon name="bell-dark" size={18} />
        {unread > 0 && (
          <span aria-hidden="true" className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-ink px-1 text-caption font-semibold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute top-full right-0 z-40 mt-2 w-72 rounded-lg border border-line-step bg-modal p-2 shadow-popover animate-pop">
          <b className="block px-2 pt-1 pb-2 text-small font-semibold">Notifications</b>
          {store.notifications.length ? (
            <ul>
              {store.notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      update((s) => {
                        s.notifications.find((x) => x.id === n.id)!.read = true
                      })
                      setOpen(false)
                      navigate(n.to)
                    }}
                    className={`flex w-full gap-2 rounded-sm p-2 text-left text-caption leading-normal hover:bg-segment focus-visible:outline-2 focus-visible:outline-accent ${n.read ? 'text-ink-muted' : 'text-ink'}`}
                  >
                    <span aria-hidden="true" className={`mt-1 size-1.5 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-accent-ink'}`} />
                    <span>
                      {n.text}
                      {!n.read && <span className="sr-only"> (unread)</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 pb-2 text-caption text-ink-muted">No notifications yet. They appear here when a project's time is all in.</p>
          )}
        </div>
      )}
    </div>
  )
}
