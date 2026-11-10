import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon } from './Icon'

const DARK =
  'inline-flex h-9.5 items-center justify-center gap-2 rounded-20 border border-dark bg-dark px-4 text-11 font-semibold text-white transition-colors hover:bg-ink-subtle hover:border-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark'

const OUTLINE =
  'inline-flex h-9.5 items-center justify-center rounded-20 border border-line bg-surface px-4 text-11 font-semibold text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark'

/** Light outlined pill <button>, e.g. "Save draft" (Figma 36:1358). */
export function OutlineButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${OUTLINE} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  )
}

/** Dark pill call-to-action with trailing arrow (Figma 36:59). Renders a router link. */
export function DarkLinkButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={DARK}>
      {children}
      <Icon name="arrow-right-white" size={18} />
    </Link>
  )
}

/** Dark pill <button>, optionally with a leading icon (e.g. "+ New Project", Figma 36:752). */
export function DarkButton({
  leadingIcon,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { leadingIcon?: string }) {
  return (
    <button type="button" className={`${DARK} ${className ?? ''}`} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} size={18} />}
      {children}
    </button>
  )
}

