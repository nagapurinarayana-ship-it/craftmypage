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

export default function GuideArticle({ meta, children }: GuideArticleProps) {
  const tool = TOOL_LINKS[meta.category]

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

      <aside className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6" aria-label="Continue with CraftMyPage">
        <h2 className="text-xl font-bold text-slate-900">
          Ready to put this into practice?
        </h2>
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
