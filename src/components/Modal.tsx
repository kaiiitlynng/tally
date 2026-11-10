import { useEffect, useRef, type ReactNode } from 'react'
import { DarkButton, OutlineButton } from './Button'
import { Icon } from './Icon'

/**
 * Native <dialog> base: focus trapping, Esc to close and an inert, blurred background.
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
          ? 'm-auto max-h-[90vh] border shadow-modal backdrop:bg-scrim backdrop:backdrop-blur-scrim'
          : 'my-0 mr-0 ml-auto h-dvh max-h-dvh border-l shadow-drawer backdrop:bg-scrim-light backdrop:backdrop-blur-[2px]'
      } ${className}`}
    >
      {children}
    </dialog>
  )
}

interface ModalProps {
  title: string
  eyebrow?: string
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
export function Modal({ title, eyebrow, onClose, confirmLabel, onConfirm, footer, size = 'md', children }: ModalProps) {
  return (
    <Dialog labelledBy="modal-title" onClose={onClose} className={`rounded-22 p-6.75 ${size === 'md' ? 'w-117.5' : 'w-155'}`}>
      <div className="flex items-start justify-between">
        <div>
          {eyebrow && <p className="text-9 font-semibold tracking-eyebrow text-eyebrow uppercase">{eyebrow}</p>}
          <h2 id="modal-title" className="my-1 text-23 font-medium">
            {title}
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-10 p-1 hover:bg-segment focus-visible:outline-2 focus-visible:outline-dark">
          <Icon name="close" size={18} />
        </button>
      </div>
      {children}
      <div className="mt-6 flex justify-end gap-2">
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
  return <p className="text-8 text-ink-muted">{children}</p>
}
