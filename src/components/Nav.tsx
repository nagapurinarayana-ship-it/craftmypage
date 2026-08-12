import { NavLink } from 'react-router-dom'

const primaryLinks = [
  { to: '/tools/invitation-maker', label: 'Invitations' },
  { to: '/tools/invoice-maker', label: 'Invoices' },
  { to: '/tools/resume-builder', label: 'Resumes' },
  { to: '/guides', label: 'Guides' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
  }`

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="cmp-container" aria-label="Main navigation">
        <div className="flex min-h-16 items-center gap-2">
          <NavLink to="/" className="mr-2 flex items-center gap-2 rounded-xl px-2 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white shadow-sm">
              C
            </span>
            <span className="hidden text-base font-bold tracking-tight text-slate-900 sm:inline">
              CraftMyPage
            </span>
          </NavLink>

          <div className="flex flex-1 items-center gap-1 overflow-x-auto py-1">
            {primaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}
