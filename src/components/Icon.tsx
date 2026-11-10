interface IconProps {
  /** File name in public/assets/icons, without extension. */
  name: string
  /** Square size in px; use width/height instead for non-square SVGs. */
  size?: number
  width?: number
  height?: number
  className?: string
  /** Render as a CSS mask filled with currentColor, so the icon follows the text color (active tabs, nav). */
  tint?: boolean
}

/** Decorative icon exported from Figma. Always paired with visible text, so it is hidden from assistive tech. */
export function Icon({ name, size, width, height, className, tint }: IconProps) {
  const w = width ?? size
  const h = height ?? size
  if (tint) {
    return (
      <span
        aria-hidden="true"
        className={`block shrink-0 bg-current ${className ?? ''}`}
        style={{ width: w, height: h, mask: `url(/assets/icons/${name}.svg) center / contain no-repeat` }}
      />
    )
  }
  return <img src={`/assets/icons/${name}.svg`} alt="" aria-hidden="true" width={w} height={h} className={`block shrink-0 ${className ?? ''}`} />
}
