import { Link } from 'react-router-dom'
import type { GuideMeta } from '../components/GuideArticle'

const guides: GuideMeta[] = [
  { slug: 'birthday-invitation-whatsapp', title: 'How to create a birthday invitation for WhatsApp', description: 'Learn the best sizes, wording, and tips for sharing birthday invitations on WhatsApp.', category: 'invitation', readMinutes: 4 },
  { slug: 'wedding-invitation-wording', title: 'Wedding invitation wording examples', description: 'Classic, modern, and Indian wedding invitation wording examples you can copy.', category: 'invitation', readMinutes: 5 },
  { slug: 'invitation-details', title: 'What details should an invitation contain?', description: 'The essential details every invitation needs, from names to RSVP information.', category: 'invitation', readMinutes: 3 },
  { slug: 'invitation-sizes', title: 'Invitation sizes for WhatsApp, Instagram and printing', description: 'The right dimensions for portrait, square, story, and print invitations.', category: 'invitation', readMinutes: 4 },
  { slug: 'housewarming-invitation-wording', title: 'Housewarming invitation wording', description: 'Warm and welcoming housewarming (Gruhapravesam) invitation wording examples.', category: 'invitation', readMinutes: 4 },
  { slug: 'naming-ceremony-invitation', title: 'Naming ceremony invitation examples', description: 'Beautiful naming ceremony invitation wording and design ideas.', category: 'invitation', readMinutes: 4 },
  { slug: 'ats-friendly-resume', title: 'How to create an ATS-friendly resume', description: 'Make your resume pass applicant tracking systems with these practical tips.', category: 'resume', readMinutes: 6 },
  { slug: 'fresher-resume-format', title: 'Fresher resume format with examples', description: 'A clear resume format for students and fresh graduates with no experience.', category: 'resume', readMinutes: 5 },
  { slug: 'software-engineer-resume', title: 'Software engineer resume guide', description: 'How to write a resume that gets software engineering interviews.', category: 'resume', readMinutes: 6 },
  { slug: 'one-page-vs-two-page-resume', title: 'One-page versus two-page resume', description: 'When to use a one-page resume and when a two-page resume is appropriate.', category: 'resume', readMinutes: 4 },
]

function GuideCard({ guide }: { guide: GuideMeta }) {
  return (
    <Link
      to={`/guides/${guide.slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{guide.category}</span>
        <span className="text-xs font-medium text-slate-400">{guide.readMinutes} min</span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-6 text-slate-900 group-hover:text-indigo-700">{guide.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{guide.description}</p>
      <span className="mt-4 inline-flex text-sm font-semibold text-indigo-600">Read guide →</span>
    </Link>
  )
}

export default function GuidesPage() {
  const invitationGuides = guides.filter((g) => g.category === 'invitation')
  const resumeGuides = guides.filter((g) => g.category === 'resume')

  return (
    <div className="cmp-tool-shell">
      <div className="mb-10 max-w-3xl">
        <span className="cmp-eyebrow">Guides & resources</span>
        <h1 className="cmp-tool-title mt-3">Practical guides for better invitations and resumes.</h1>
        <p className="cmp-tool-subtitle">
          Helpful advice on wording, layouts, dimensions, ATS-friendly resumes and common design decisions.
        </p>
      </div>

      <section aria-label="Invitation guides">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Invitation guides</h2>
          <p className="mt-1 text-sm text-slate-500">Create invitations that read well on phones and look good when printed.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">{invitationGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}</div>
      </section>

      <section className="mt-12" aria-label="Resume guides">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Resume guides</h2>
          <p className="mt-1 text-sm text-slate-500">Simple advice for students, engineers and experienced professionals.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <a
            href="/guides/ats-resume-keywords/"
            className="group rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">resume</span>
              <span className="text-xs font-medium text-slate-400">7 min</span>
            </div>
            <h3 className="mt-4 text-lg font-bold leading-6 text-slate-900 group-hover:text-indigo-700">ATS resume keywords: match job descriptions naturally</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Find job-relevant keywords, place them where the evidence lives and avoid keyword stuffing.</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-indigo-600">Read keyword guide →</span>
          </a>
          {resumeGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)}
        </div>
      </section>
    </div>
  )
}
