/**
 * Workflow step dot: every step looks the same, a solid brand-orange dot (owner request 2026-11-10). Only the nav
 * item for the page you're on is highlighted, like any other link. Sits in a 24px box so it centres on the rail.
 */
export function StepMarker() {
  return (
    <span aria-hidden="true" className="relative z-10 grid size-6 shrink-0 place-items-center">
      <span className="size-2 rounded-full bg-brand" />
    </span>
  )
}
