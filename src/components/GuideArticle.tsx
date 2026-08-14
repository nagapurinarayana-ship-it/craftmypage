import { Link } from 'react-router-dom'

export type GuideMeta = {
  slug: string
  title: string
  description: string
  category: 'invitation' | 'resume'
  readMinutes: number
}

type GuideArticleProps = {
  meta: GuideMeta
  children: React.ReactNode
}

const TOOL_LINKS = {
  invitation: { href: '/tools/invitation-maker', label: 'Open Invitation Maker' },
  resume: { href: '/tools/resume-builder', label: 'Open Resume Builder' },
} as const

const RELATED_GUIDES: Record<string, Array<{ slug: string; label: string }>> = {
  'birthday-invitation-whatsapp': [
    { slug: 'invitation-sizes', label: 'Invitation sizes for WhatsApp, Instagram and print' },
    { slug: 'invitation-details', label: 'What details should an invitation contain?' },
  ],
  'wedding-invitation-wording': [
    { slug: 'invitation-details', label: 'What details should an invitation contain?' },
    { slug: 'invitation-sizes', label: 'Invitation sizes for WhatsApp, Instagram and print' },
  ],
  'housewarming-invitation-wording': [
    { slug: 'invitation-details', label: 'What details should an invitation contain?' },
    { slug: 'invitation-sizes', label: 'Invitation sizes for WhatsApp, Instagram and print' },
  ],
  'naming-ceremony-invitation': [
    { slug: 'invitation-details', label: 'What details should an invitation contain?' },
    { slug: 'invitation-sizes', label: 'Invitation sizes for WhatsApp, Instagram and print' },
  ],
  'invitation-details': [
    { slug: 'invitation-sizes', label: 'Invitation sizes for WhatsApp, Instagram and print' },
    { slug: 'wedding-invitation-wording', label: 'Wedding invitation wording examples' },
  ],
  'invitation-sizes': [
    { slug: 'invitation-details', label: 'What details should an invitation contain?' },
    { slug: 'birthday-invitation-whatsapp', label: 'How to create a birthday invitation for WhatsApp' },
  ],
  'ats-friendly-resume': [
    { slug: 'one-page-vs-two-page-resume', label: 'One-page versus two-page resume' },
    { slug: 'software-engineer-resume', label: 'Software engineer resume guide' },
  ],
  'fresher-resume-format': [
    { slug: 'ats-friendly-resume', label: 'How to create an ATS-friendly resume' },
    { slug: 'one-page-vs-two-page-resume', label: 'One-page versus two-page resume' },
  ],
  'software-engineer-resume': [
    { slug: 'ats-friendly-resume', label: 'How to create an ATS-friendly resume' },
    { slug: 'one-page-vs-two-page-resume', label: 'One-page versus two-page resume' },
  ],
  'one-page-vs-two-page-resume': [
    { slug: 'ats-friendly-resume', label: 'How to create an ATS-friendly resume' },
    { slug: 'fresher-resume-format', label: 'Fresher resume format with examples' },
  ],
}

export default function GuideArticle({ meta, children }: GuideArticleProps) {
  const tool = TOOL_LINKS[meta.category]
  const relatedGuides = RELATED_GUIDES[meta.slug] ?? []

  return (
    <article className="max-w-3xl mx-auto p-6">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <Link to="/guides" className="hover:text-blue-700">
          Guides
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="capitalize">{meta.category} guides</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{meta.title}</h1>
        <p className="mt-2 text-gray-600">{meta.description}</p>
        <p className="mt-2 text-sm text-gray-500">{meta.readMinutes} min read</p>
      </header>

      <div className="prose prose-gray max-w-none space-y-6">{children}</div>

      {relatedGuides.length > 0 && (
        <section className="mt-10 border-t border-slate-200 pt-8" aria-labelledby="related-guides-heading">
          <h2 id="related-guides-heading" className="text-xl font-bold text-slate-900">Continue learning</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/guides/${guide.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
              >
                {guide.label} →
              </Link>
            ))}
          </div>
        </section>
      )}

      <aside className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6" aria-label="Continue with CraftMyPage">
        <h2 className="text-xl font-bold text-slate-900">Ready to put this into practice?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use the free CraftMyPage {meta.category} tool to create your document in the browser and continue from the guidance in this article.
        </p>
        <Link to={tool.href} className="cmp-primary-btn mt-4 inline-flex">
          {tool.label}
        </Link>
      </aside>
    </article>
  )
}
