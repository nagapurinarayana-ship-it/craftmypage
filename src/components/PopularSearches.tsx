import { Link, useLocation } from 'react-router-dom'

type SearchLink = { to: string; label: string }

const invoiceSearches: SearchLink[] = [
  { to: '/tools/invoice-maker', label: 'free invoice maker online' },
  { to: '/invoices/gst-invoice', label: 'GST invoice generator India' },
  { to: '/invoices/freelancer-invoice', label: 'freelancer invoice generator' },
  { to: '/invoices/invoice-templates', label: 'free invoice templates' },
  { to: '/guides/how-to-create-an-invoice', label: 'how to create an invoice' },
]

const resumeSearches: SearchLink[] = [
  { to: '/tools/resume-builder', label: 'free ATS resume builder' },
  { to: '/guides/ats-friendly-resume', label: 'ATS-friendly resume format' },
  { to: '/guides/ats-resume-keywords', label: 'ATS resume keywords' },
  { to: '/guides/fresher-resume-format', label: 'fresher resume format' },
  { to: '/guides/software-engineer-resume', label: 'software engineer resume' },
]

const invitationSearches: SearchLink[] = [
  { to: '/tools/invitation-maker', label: 'free invitation maker online' },
  { to: '/guides/birthday-invitation-whatsapp', label: 'birthday invitation for WhatsApp' },
  { to: '/guides/wedding-invitation-wording', label: 'wedding invitation wording' },
  { to: '/guides/housewarming-invitation-wording', label: 'housewarming invitation wording' },
  { to: '/guides/naming-ceremony-invitation', label: 'naming ceremony invitation' },
]

function searchesFor(pathname: string) {
  if (pathname.includes('invoice')) return invoiceSearches
  if (pathname.includes('resume') || pathname.includes('ats-')) return resumeSearches
  if (pathname.includes('invitation') || pathname.startsWith('/invitations/')) return invitationSearches
  return [...invoiceSearches.slice(0, 3), ...resumeSearches.slice(0, 3), ...invitationSearches.slice(0, 3)]
}

export default function PopularSearches() {
  const { pathname } = useLocation()
  if (['/privacy', '/terms', '/contact', '/about'].includes(pathname)) return null
  const links = searchesFor(pathname)

  return (
    <section className="cmp-container mt-12" aria-labelledby="popular-searches-title">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <span className="cmp-eyebrow">Popular searches</span>
        <h2 id="popular-searches-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Related tools and guides people commonly look for
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Open the page that matches your task. These links use the same plain-language terms people use when looking for invoice, resume and invitation help.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Popular CraftMyPage searches">
          {links.map((item) => (
            <Link key={`${item.to}-${item.label}`} to={item.to} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
