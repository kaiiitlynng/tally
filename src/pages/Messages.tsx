import { useState } from 'react'
import { useDemo } from '../components/DemoContext'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { PageTitle } from '../components/PageTitle'
import { Pill } from '../components/Pill'
import { initials, partner } from '../data/store'

const AVATAR = 'grid size-7 shrink-0 place-items-center rounded-full border-2 border-member-ring bg-member text-7'

/**
 * Messages (Figma 36:7405 shows the empty inbox). Threads appear after "Ask employee" on an
 * invoice flag; the thread layout follows the prototype code layer. Partners read; only the
 * employee view (out of scope) can reply.
 */
export default function Messages() {
  const { store, update } = useDemo()
  const visible = store.messages.filter((m) => m.from === partner.name || m.to === partner.name)
  const [selectedId, setSelectedId] = useState(visible[0]?.id ?? '')
  const message = visible.find((m) => m.id === selectedId) ?? visible[0]
  const entry = message?.entryId ? store.entries.find((e) => e.id === message.entryId) : undefined

  function open(id: string) {
    setSelectedId(id)
    update((s) => {
      const m = s.messages.find((x) => x.id === id)!
      m.unreadBy = m.unreadBy.filter((r) => r !== 'partner')
    })
  }

  return (
    <>
      <PageTitle
        eyebrow="Billing conversations"
        title="Messages"
        description="Focused requests, linked entries, and employee responses in one professional inbox."
      />
      <div className="mt-6 grid h-226.25 min-h-155 grid-cols-[330px_1fr] overflow-hidden rounded-16 border border-line bg-inbox">
        <aside aria-label="Conversations" className="overflow-auto border-r border-line bg-thread-list">
          <div className="flex justify-between p-3.75 text-9 font-semibold text-ink">
            <span>Conversations</span>
            <span>{visible.length}</span>
          </div>
          {visible.length ? (
            visible.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={message?.id === m.id}
                onClick={() => open(m.id)}
                className={`grid w-full grid-cols-[34px_1fr_auto] gap-2.5 border-t border-thread-line p-3.5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-dark ${
                  message?.id === m.id ? 'bg-thread-active' : 'hover:bg-thread-active/60'
                } ${m.unreadBy.includes('partner') ? 'shadow-[inset_3px_0_var(--color-orange)]' : ''}`}
              >
                <span className={AVATAR}>{initials(m.to)}</span>
                <span className="min-w-0">
                  <b className="block truncate text-8 font-bold">{m.to}</b>
                  <strong className="my-1 block truncate text-10 font-semibold">{m.subject}</strong>
                  <span className="block truncate text-7 text-ink-muted">{m.body}</span>
                </span>
                <time className="text-7 text-ink-dim">{m.time}</time>
              </button>
            ))
          ) : (
            <EmptyState icon="message-empty-small" iconSize={18} title="No messages yet" size="sm">
              Billing requests will appear here.
            </EmptyState>
          )}
        </aside>

        <section aria-label="Conversation" className="flex min-w-0 flex-col bg-conversation">
          {message ? (
            <>
              <header className="flex items-center border-b border-line px-4.75 py-4">
                <div className="flex-1">
                  <b className="block text-12 font-bold">{message.subject}</b>
                  <p className="pt-0.75 text-8 text-ink-muted">{store.projects.find((p) => p.id === message.projectId)?.name}</p>
                </div>
                <Pill tone={message.status === 'Replied' ? 'success' : 'accent'}>{message.status}</Pill>
              </header>
              <div className="flex-1 overflow-auto p-6">
                <div className="mb-3.75 flex max-w-155 gap-2.5">
                  <span className={AVATAR}>{partner.initials}</span>
                  <div className="rounded-[4px_14px_14px] bg-bubble px-3.5 py-3">
                    <b className="text-8 font-bold">
                      {message.from} <time className="ml-2 font-normal text-ink-dim">{message.time}</time>
                    </b>
                    <p className="mt-1.5 text-10 leading-[1.6]">{message.body}</p>
                  </div>
                </div>
                {entry && (
                  <div className="mx-auto mb-4.5 max-w-140 rounded-11 border border-line-step bg-white p-3.25">
                    <div className="flex items-center gap-2">
                      <Icon name="nav-time-entries" size={18} />
                      <span>
                        <small className="block text-7">LINKED TIME ENTRY</small>
                        <b className="mt-0.75 block text-9 font-bold">
                          {entry.date} · {entry.hours} hours
                        </b>
                      </span>
                    </div>
                    <p className="mt-2.5 rounded-7 bg-linked-body p-2.5 text-9">{entry.description}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-2.25 border-t border-line p-4.25 text-foot-ink">
                <Icon name={message.status === 'Replied' ? 'check-foot' : 'clock-waiting'} size={18} />
                <span>
                  <b className="block text-8 font-bold">{message.status === 'Replied' ? 'Response received' : 'Awaiting employee'}</b>
                  <small className="mt-0.5 block text-7 text-ink-muted">
                    {message.status === 'Replied'
                      ? "The corrected entry is back in Vanessa's review queue."
                      : 'Vanessa remains the final invoice approver.'}
                  </small>
                </span>
              </div>
            </>
          ) : (
            <EmptyState icon="message-empty-large" iconSize={28} title="Select a conversation" />
          )}
        </section>
      </div>
    </>
  )
}
