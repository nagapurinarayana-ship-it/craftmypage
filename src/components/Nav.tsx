import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `mr-2 ${isActive ? 'font-semibold text-blue-700' : 'text-gray-700 hover:text-blue-700'}`

export default function Nav() {
  return (
    <header>
      <nav className="p-4 border-b bg-white" aria-label="Main navigation">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">
          <NavLink to="/" className="mr-4 font-bold text-lg">
            CraftMyPage
          </NavLink>
          <NavLink to="/invitation-maker" className={linkClass}>
            Invitation Maker
          </NavLink>
          <NavLink to="/resume-builder" className={linkClass}>
            Resume Builder
          </NavLink>
          <span className="flex-1" />
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </div>
      </nav>
    </header>
  )
}