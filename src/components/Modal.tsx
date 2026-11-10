import { useEffect, useRef, type ReactNode } from 'react'
import { DarkButton, OutlineButton } from './Button'
import { Icon } from './Icon'

/**
 * Native <dialog> base: focus trapping, Esc to close and an inert, dimmed background (no blur, per stripe-design).
 * Visual spec: Figma 36:8726 (Request time now) and the prototype code layer's v2.css.
 */
export function Dialog({
  labelledBy,
  onClose,
  className,
  children,
  placement = 'center',
}: {
  labelledBy: string
  onClose: () => void
  className: string
  children: ReactNode
  /** right = full-height side drawer that also closes on backdrop click (prototype .project-details-drawer). */
  placement?: 'center' | 'right'
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={placement === 'right' ? (e) => e.target === e.currentTarget && onClose() : undefined}
      className={`overflow-y-auto border-line bg-modal text-ink ${
        placement === 'center'
          ? 'm-auto max-h-[90vh] border shadow-modal animate-pop backdrop:bg-scrim backdrop:animate-fade'
          : 'my-0 mr-0 ml-auto h-dvh max-h-dvh border-l shadow-drawer animate-slide-in backdrop:bg-scrim-light backdrop:animate-fade'
      } ${className}`}
    >
      {children}
    </dialog>
  )
}

interface ModalProps {
  title: string
  onClose: () => void
  /** Primary action label + handler (ignored when `footer` is given). */
  confirmLabel?: string
  onConfirm?: () => void
  /** Custom action row, e.g. Back / Continue in the New Project steps. */
  footer?: ReactNode
  /** md = 470px (Figma 36:8727), lg = 620px (prototype .project-modal). */
  size?: 'md' | 'lg'
  children: ReactNode
}

/** Titled dialog with a close button and Cancel / confirm actions. */
export function Modal({ title, onClose, confirmLabel, onConfirm, footer, size = 'md', children }: ModalProps) {
  return (
    <Dialog labelledBy="modal-title" onClose={onClose} className={`rounded-xl p-7 ${size === 'md' ? 'w-120' : 'w-160'}`}>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 id="modal-title" className="my-1 text-title font-semibold tracking-title">
            {title}
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="-mt-1 -mr-1 rounded-sm p-2 text-ink-muted transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent">
          <Icon name="close" size={18} />
        </button>
      </div>
      {children}
      <div className="-mx-7 mt-7 -mb-7 flex justify-end gap-2 rounded-b-xl border-t border-line bg-surface-muted px-7 py-4">
        {footer ?? (
          <>
            <OutlineButton onClick={onClose}>Cancel</OutlineButton>
            <DarkButton onClick={onConfirm}>{confirmLabel}</DarkButton>
          </>
        )}
      </div>
    </Dialog>
  )
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <p className="text-caption text-ink-muted">{children}</p>
}
