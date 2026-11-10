/** 18px section heading with a small description underneath (Figma 36:121). */
export function SectionHeading({ id, title, description }: { id?: string; title: string; description: string }) {
  return (
    <div>
      <h2 id={id} className="text-18 font-medium text-ink">
        {title}
      </h2>
      <p className="pt-0.5 text-10 text-ink-muted">{description}</p>
    </div>
  )
}
