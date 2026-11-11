/** 18px section heading with a small description underneath (Figma 36:121). */
export function SectionHeading({ id, title, description }: { id?: string; title: string; description?: string }) {
  return (
    <div>
      <h2 id={id} className="text-title-sm font-semibold tracking-title text-ink">
        {title}
      </h2>
      {description && <p className="pt-1 text-small text-ink-muted">{description}</p>}
    </div>
  )
}
