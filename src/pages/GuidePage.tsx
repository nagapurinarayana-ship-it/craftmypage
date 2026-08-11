import type React from 'react'
import { useParams } from 'react-router-dom'
import GuideArticle from '../components/GuideArticle'
import type { GuideMeta } from '../components/GuideArticle'

type Guide = { meta: GuideMeta; content: React.ReactNode }

const GUIDES: Record<string, Guide> = {}

const GUIDE_DATA: Record<string, { meta: Omit<GuideMeta, 'slug'>; content: React.ReactNode }> = {
  'birthday-invitation-whatsapp': {
    meta: {
      title: 'How to create a birthday invitation for WhatsApp',
      description: 'Learn the best sizes, wording, and tips for sharing birthday invitations on WhatsApp.',
      category: 'invitation',
      readMinutes: 4,
    },
    content: (
      <>
        <section>
          <h2>Choose the right size</h2>
          <p>WhatsApp renders images at up to 1080×1350 portrait or 1080×1080 square. For invitation sharing, a portrait canvas looks great on most phones. Keep the most important details in the center.</p>
        </section>
        <section>
          <h2>Write clear wording</h2>
          <p>Include who is inviting, whose birthday it is, the date and time, the venue with clear directions, an RSVP contact, and a polite note about gifts.</p>
        </section>
        <section>
          <h2>Make it scannable</h2>
          <p>Phone screens are small. Use large, high-contrast text. Avoid clutter. A clear date/time is the most important detail.</p>
        </section>
      </>
    ),
  },
  'wedding-invitation-wording': {
    meta: {
      title: 'Wedding invitation wording examples',
      description: 'Classic, modern, and Indian wedding invitation wording examples you can copy.',
      category: 'invitation',
      readMinutes: 5,
    },
    content: (
      <>
        <section>
          <h2>Classic formal</h2>
          <p>"Together with their families, Aarav and Ananya request the honour of your presence at their marriage on Saturday, 14 February 2027 at The Royal Gardens, Udaipur."</p>
        </section>
        <section>
          <h2>Modern casual</h2>
          <p>"Aarav & Ananya are getting married! Please join us on 14 Feb 2027, 11 AM at The Royal Gardens. RSVP to Priya on 98765 43210."</p>
        </section>
        <section>
          <h2>Indian wedding (Hindu)</h2>
          <p>"Mr. and Mrs. Sharma and Mr. and Mrs. Patel joyfully announce the wedding of their children, Aarav Narayan Sharma and Ananya Ramesh Patel, on 14th February 2027."</p>
        </section>
      </>
    ),
  },
  'invitation-details': {
    meta: {
      title: 'What details should an invitation contain?',
      description: 'The essential details every invitation needs, from names to RSVP information.',
      category: 'invitation',
      readMinutes: 3,
    },
    content: (
      <>
        <section>
          <h2>The must-haves</h2>
          <p>Every invitation should clearly state: <strong>who</strong> is celebrating, <strong>what</strong> kind of event, <strong>when</strong> (date and time), and <strong>where</strong> (venue with address).</p>
        </section>
        <section>
          <h2>Helpful extras</h2>
          <p>Include RSVP details (contact and deadline), attire guidance for themed or formal events, and a simple map or landmark for directions.</p>
        </section>
      </>
    ),
  },
  'invitation-sizes': {
    meta: {
      title: 'Invitation sizes for WhatsApp, Instagram and printing',
      description: 'The right dimensions for portrait, square, story, and print invitations.',
      category: 'invitation',
      readMinutes: 4,
    },
    content: (
      <>
        <section>
          <h2>Digital (social and messaging)</h2>
          <p>WhatsApp/Telegram share: 1080×1350 portrait or 1080×1080 square. Instagram post: 1080×1080 or 1080×1350. Instagram story / WhatsApp status: 1080×1920.</p>
        </section>
        <section>
          <h2>Print</h2>
          <p>Standard invitation sizes: 5×7 inches (A7) and 4×6 inches. Set canvas to 1500×2100 for a portrait A4 ratio.</p>
        </section>
      </>
    ),
  },
  'housewarming-invitation-wording': {
    meta: {
      title: 'Housewarming invitation wording',
      description: 'Warm and welcoming housewarming (Gruhapravesam) invitation wording examples.',
      category: 'invitation',
      readMinutes: 4,
    },
    content: (
      <>
        <section>
          <h2>Formal housewarming</h2>
          <p>"Mr. and Mrs. Reddy request the honour of your presence at the Gruhapravesam of their new home on Sunday, 16 May 2027 at 9:00 AM at 12 Green Valley Residency, Vijayawada."</p>
        </section>
        <section>
          <h2>Warm and friendly</h2>
          <p>"We've moved in! Join us to celebrate the housewarming of our new home. 16 May, 9 AM onwards. Your blessings mean everything."</p>
        </section>
      </>
    ),
  },
  'naming-ceremony-invitation': {
    meta: {
      title: 'Naming ceremony invitation examples',
      description: 'Beautiful naming ceremony invitation wording and design ideas.',
      category: 'invitation',
      readMinutes: 4,
    },
    content: (
      <>
        <section>
          <h2>Classical wording</h2>
          <p>"Mr. and Mrs. Verma joyfully request your presence at the naming ceremony of their daughter, Ananya Priya, on 10 March 2027 at 11:00 AM at their residence."</p>
        </section>
        <section>
          <h2>Modern wording</h2>
          <p>"Ananya's naming ceremony! We invite you to celebrate on 10th March 2027, 11 AM. RSVP to 98765 43210."</p>
        </section>
      </>
    ),
  },
  'ats-friendly-resume': {
    meta: {
      title: 'How to create an ATS-friendly resume',
      description: 'Make your resume pass applicant tracking systems with these practical tips.',
      category: 'resume',
      readMinutes: 6,
    },
    content: (
      <>
        <section>
          <h2>Use standard headings</h2>
          <p>ATS looks for "Work Experience", "Education", "Skills", "Projects". Avoid creative headings like "Career Path".</p>
        </section>
        <section>
          <h2>Stick to common fonts</h2>
          <p>Use Arial, Calibri, Georgia, or Times New Roman. Keep font size between 10 and 12 points.</p>
        </section>
        <section>
          <h2>Avoid tables, columns, and graphics</h2>
          <p>ATS struggles with tables, text boxes, columns, and images. Use a simple single-column layout.</p>
        </section>
        <section>
          <h2>Match keywords</h2>
          <p>Mirror the exact job title, skills, and qualifications from the job posting in your experience and skills sections.</p>
        </section>
      </>
    ),
  },
  'fresher-resume-format': {
    meta: {
      title: 'Fresher resume format with examples',
      description: 'A clear resume format for students and fresh graduates with no experience.',
      category: 'resume',
      readMinutes: 5,
    },
    content: (
      <>
        <section>
          <h2>Order your sections</h2>
          <p>As a fresher, lead with: Contact, Education (detailed, with CGPA), Projects, Skills, Certifications, then internships or part-time work.</p>
        </section>
        <section>
          <h2>Show projects over grades</h2>
          <p>List 2-4 academic or personal projects with concrete outcomes and technologies used.</p>
        </section>
      </>
    ),
  },
  'software-engineer-resume': {
    meta: {
      title: 'Software engineer resume guide',
      description: 'How to write a resume that gets software engineering interviews.',
      category: 'resume',
      readMinutes: 6,
    },
    content: (
      <>
        <section>
          <h2>Quantify impact</h2>
          <p>Use metrics: "Reduced API response time by 40%", "Built a feature used by 10k daily users."</p>
        </section>
        <section>
          <h2>Highlight a technical stack</h2>
          <p>In each role, list the languages, frameworks, and tools you used. Group skills clearly.</p>
        </section>
      </>
    ),
  },
  'one-page-vs-two-page-resume': {
    meta: {
      title: 'One-page versus two-page resume',
      description: 'When to use a one-page resume and when a two-page resume is appropriate.',
      category: 'resume',
      readMinutes: 4,
    },
    content: (
      <>
        <section>
          <h2>Use one page when...</h2>
          <p>You have less than 10 years of experience, are applying for early-career roles, or your content fits on one page.</p>
        </section>
        <section>
          <h2>Use two pages when...</h2>
          <p>You are a senior professional with a decade or more of experience and extensive achievements.</p>
        </section>
      </>
    ),
  },
}

for (const slug of Object.keys(GUIDE_DATA)) {
  GUIDES[slug] = {
    meta: { slug, ...GUIDE_DATA[slug].meta },
    content: GUIDE_DATA[slug].content,
  }
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? GUIDES[slug] : undefined

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Guide not found</h1>
        <p className="text-gray-600">We could not find that guide. Browse all guides on the guides page.</p>
      </div>
    )
  }

  return <GuideArticle meta={guide.meta}>{guide.content}</GuideArticle>
}