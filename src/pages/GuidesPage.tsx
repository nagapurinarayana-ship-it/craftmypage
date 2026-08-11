import { Link } from 'react-router-dom'
import type { GuideMeta } from '../components/GuideArticle'

const guides: GuideMeta[] = [
  {
    slug: 'birthday-invitation-whatsapp',
    title: 'How to create a birthday invitation for WhatsApp',
    description: 'Learn the best sizes, wording, and tips for sharing birthday invitations on WhatsApp.',
    category: 'invitation',
    readMinutes: 4,
  },
  {
    slug: 'wedding-invitation-wording',
    title: 'Wedding invitation wording examples',
    description: 'Classic, modern, and Indian wedding invitation wording examples you can copy.',
    category: 'invitation',
    readMinutes: 5,
  },
  {
    slug: 'invitation-details',
    title: 'What details should an invitation contain?',
    description: 'The essential details every invitation needs, from names to RSVP information.',
    category: 'invitation',
    readMinutes: 3,
  },
  {
    slug: 'invitation-sizes',
    title: 'Invitation sizes for WhatsApp, Instagram and printing',
    description: 'The right dimensions for portrait, square, story, and print invitations.',
    category: 'invitation',
    readMinutes: 4,
  },
  {
    slug: 'housewarming-invitation-wording',
    title: 'Housewarming invitation wording',
    description: 'Warm and welcoming housewarming (Gruhapravesam) invitation wording examples.',
    category: 'invitation',
    readMinutes: 4,
  },
  {
    slug: 'naming-ceremony-invitation',
    title: 'Naming ceremony invitation examples',
    description: 'Beautiful naming ceremony invitation wording and design ideas.',
    category: 'invitation',
    readMinutes: 4,
  },
  {
    slug: 'ats-friendly-resume',
    title: 'How to create an ATS-friendly resume',
    description: 'Make your resume pass applicant tracking systems with these practical tips.',
    category: 'resume',
    readMinutes: 6,
  },
  {
    slug: 'fresher-resume-format',
    title: 'Fresher resume format with examples',
    description: 'A clear resume format for students and fresh graduates with no experience.',
    category: 'resume',
    readMinutes: 5,
  },
  {
    slug: 'software-engineer-resume',
    title: 'Software engineer resume guide',
    description: 'How to write a resume that gets software engineering interviews.',
    category: 'resume',
    readMinutes: 6,
  },
  {
    slug: 'one-page-vs-two-page-resume',
    title: 'One-page versus two-page resume',
    description: 'When to use a one-page resume and when a two-page resume is appropriate.',
    category: 'resume',
    readMinutes: 4,
  },
]

export default function GuidesPage() {
  const invitationGuides = guides.filter((g) => g.category === 'invitation')
  const resumeGuides = guides.filter((g) => g.category === 'resume')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Guides</h1>
      <p className="text-gray-600 mb-8">
        Practical, original guides to help you create better invitations and resumes.
      </p>

      <section className="mb-8" aria-label="Invitation guides">
        <h2 className="text-xl font-semibold mb-4">Invitation guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {invitationGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">{guide.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
              <p className="text-xs text-gray-500 mt-2">{guide.readMinutes} min read</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Resume guides">
        <h2 className="text-xl font-semibold mb-4">Resume guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resumeGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold">{guide.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
              <p className="text-xs text-gray-500 mt-2">{guide.readMinutes} min read</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}