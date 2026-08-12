import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="cmp-tool-shell">
      <div className="cmp-surface mx-auto max-w-2xl p-8 text-center sm:p-12">
        <span className="cmp-eyebrow">404 · Page not found</span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">We couldn't find that page.</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">The link may be outdated or the address may have been typed incorrectly. Choose a tool below to continue.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/tools/invoice-maker" className="cmp-primary-btn">Create an invoice</Link>
          <Link to="/tools/invitation-maker" className="cmp-secondary-btn">Create an invitation</Link>
          <Link to="/" className="cmp-secondary-btn">Go home</Link>
        </div>
      </div>
    </div>
  )
}
