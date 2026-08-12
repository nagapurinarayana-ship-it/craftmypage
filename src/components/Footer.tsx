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
    <footer className="border-t bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="font-bold">CraftMyPage</p>
          <p className="mt-1 text-sm text-gray-600">
            Free invitations, resumes, invoices and printable designs—created privately in your browser.
          </p>
        </div>
        <nav aria-label="Tools">
          <p className="font-semibold mb-2">Tools</p>
          <ul className="space-y-1 text-sm">
            {toolLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-gray-700 hover:text-blue-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="font-semibold mb-2">Company</p>
          <ul className="space-y-1 text-sm">
            {companyLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-gray-700 hover:text-blue-700">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t">
        <div className="max-w-6xl mx-auto p-4 text-sm text-gray-600">
          Core design and export workflows run in your browser. No account or server upload is required for the core tools.
        </div>
      </div>
    </footer>
  )
}
