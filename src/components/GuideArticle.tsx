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

export default function GuideArticle({ meta, children }: GuideArticleProps) {
  return (
    <article className="max-w-3xl mx-auto p-6">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <Link to="/guides" className="hover:text-blue-700">
          Guides
        </Link>
        <span aria-hidden="true"> / </span>
        <Link
          to={meta.category === 'invitation' ? '/invitation-maker' : '/resume-builder'}
          className="hover:text-blue-700 capitalize"
        >
          {meta.category}
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{meta.title}</h1>
        <p className="mt-2 text-gray-600">{meta.description}</p>
        <p className="mt-2 text-sm text-gray-500">{meta.readMinutes} min read</p>
      </header>

      <div className="prose prose-gray max-w-none space-y-6">{children}</div>
    </article>
  )
}