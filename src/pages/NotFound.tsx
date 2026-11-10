import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="pt-10">
      <h1 className="text-32 font-medium tracking-display text-ink">Page not found</h1>
      <p className="pt-1.75 text-13 text-ink-muted">
        <Link to="/" className="underline hover:text-ink">
          Back to Home
        </Link>
      </p>
    </div>
  )
}
