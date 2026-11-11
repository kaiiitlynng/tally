import type { ReactNode } from 'react'
import { Icon } from '../../components/Icon'

/** "Want to double-check this entry?" callout (prototype code layer .warning-confirm). */
export function WarningConfirm({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="status" className="mt-3.75 flex items-center justify-between gap-4.5 rounded-md border border-confirm-line bg-confirm-soft px-3.5 py-3.25 text-confirm-ink">
      <div className="flex items-center gap-2.25">
        <Icon name="review-caution" size={18} />
        <span>
          <b className="block text-small font-semibold">{title}</b>
        </span>
      </div>
      <div className="flex shrink-0 gap-2">{children}</div>
    </div>
  )
}
