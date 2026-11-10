/**
 * Tally asterisk mark: 8 rounded 3×10 bars around the centre of a 25px box
 * (Figma 36:291 — built from shapes in Figma, not an exported asset).
 * Each bar sits at x=11 y=1 and rotates about the box centre (12.5, 12.5).
 */
const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

export function Logo() {
  return (
    <span className="group flex items-center gap-2.5 px-3 pb-7">
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
    </span>
  )
}
