interface IconProps {
  /** File name in public/assets/icons, without extension. */
  name: string
  /** Square size in px; use width/height instead for non-square SVGs. */
  size?: number
  width?: number
  height?: number
  className?: string
}

/** Decorative icon exported from Figma. Always paired with visible text, so alt is empty. */
export function Icon({ name, size, width, height, className }: IconProps) {
  return (
    <img
      src={`/assets/icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      width={width ?? size}
      height={height ?? size}
      className={`block shrink-0 ${className ?? ''}`}
    />
  )
}
