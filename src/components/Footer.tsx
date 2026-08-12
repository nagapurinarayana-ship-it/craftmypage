import { Link } from 'react-router-dom'

const toolLinks = [
  { to: '/tools/invitation-maker', label: 'Invitation Maker' },
  { to: '/tools/invoice-maker', label: 'Invoice Maker' },
  { to: '/tools/resume-builder', label: 'Resume Builder' },
  { to: '/guides', label: 'Guides' },
]

const companyLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="cmp-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_.75fr_.75fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white">
                C
              </span>
              <span className="font-bold tracking-tight text-slate-900">CraftMyPage</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Free invitations, resumes, invoices and printable designs with focused browser-based editors.
            </p>
            <p className="mt-4 text-xs font-medium text-slate-400">
              Core design and export workflows run locally in your browser.
            </p>
          </div>

          <nav aria-label="Tools">
            <p className="text-sm font-semibold text-slate-900">Tools</p>
            <ul className="mt-4 space-y-2 text-sm">
              {toolLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-500 transition hover:text-indigo-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <ul className="mt-4 space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-500 transition hover:text-indigo-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="cmp-container flex flex-col gap-2 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} CraftMyPage</span>
          <span>No account · No watermark · No server upload for core tools</span>
        </div>
      </div>
    </footer>
  )
}
