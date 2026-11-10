import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { Icon } from './Icon'

/** Shared button mechanics: 40px target, 6px radius, a slight press-in on click (stripe-design). */
const BASE =
  'group inline-flex h-10 items-center justify-center gap-2 rounded-sm border px-4 text-body font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-stripe active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:border-line disabled:bg-surface-muted disabled:text-ink-placeholder disabled:shadow-none motion-reduce:active:scale-100'

/** Solid brand button (#533afd → #2e2b8c on hover). */
const DARK = `${BASE} border-brand bg-brand text-white shadow-card hover:border-brand-hover hover:bg-brand-hover`

/** Quiet button: white with a lavender border and brand text, like Stripe's secondary CTA. */
const OUTLINE = `${BASE} border-line bg-surface text-ink hover:border-brand-200 hover:bg-brand-25 hover:text-brand`

/** Trailing chevron that slides right on hover (Stripe's "Get started ›"). */
function Arrow() {
  return (
    <span aria-hidden="true" className="transition-transform duration-150 ease-stripe group-hover:translate-x-0.5 motion-reduce:transition-none">
      <Icon name="arrow-right-white" size={16} />
    </span>
  )
}

/** Light outlined <button>, e.g. "Save draft" (Figma 36:1358). */
export function OutlineButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${OUTLINE} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  )
}

/** Brand call-to-action with trailing arrow (Figma 36:59). Renders a router link. */
export function DarkLinkButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={DARK}>
      {children}
      <Arrow />
    </Link>
  )
}

/** Brand <button>, optionally with a leading icon (e.g. "+ New Project", Figma 36:752). */
export function DarkButton({
  leadingIcon,
  iconSize = 18,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { leadingIcon?: string; iconSize?: number }) {
  return (
    <button type="button" className={`${DARK} ${className ?? ''}`} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
      {children}
    </button>
  )
}

