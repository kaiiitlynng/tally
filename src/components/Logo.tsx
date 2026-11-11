import { Link } from 'react-router'

/**
 * Tally asterisk mark: 8 rounded 3×10 bars around the centre of a 25px box
 * (Figma 36:291 — built from shapes in Figma, not an exported asset).
 * Each bar sits at x=11 y=1 and rotates about the box centre (12.5, 12.5).
 */
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

/** Links to Home (owner request 2026-11-10). */
export function Logo() {
  return (
    <Link to="/" aria-label="Tally home" className="group mb-7 flex w-fit items-center gap-2.5 rounded-sm px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
      {/* Mark turns an eighth on hover: a small, Stripe-like moment of play. */}
      <span className="relative size-6.25 shrink-0 transition-transform duration-500 ease-out-expo group-hover:rotate-45 motion-reduce:transition-none" aria-hidden="true">
        {ANGLES.map((deg) => (
          <span
            key={deg}
            className="absolute top-px left-2.75 h-2.5 w-0.75 rounded-full bg-brand"
            // Pivot = box centre relative to the bar's own top-left corner.
            style={{ transformOrigin: '1.5px 11.5px', transform: `rotate(${deg}deg)` }}
          />
        ))}
      </span>
      <span className="text-title font-semibold tracking-title text-ink">tally</span>
    </Link>
  )
}
