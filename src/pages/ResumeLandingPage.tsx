import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

const PAGES = {
  'ats-resume': {
    title: 'Free ATS Resume Builder | ATS-Friendly Resume | CraftMyPage',
    description: 'Build an ATS-friendly resume with a clean structure, focused templates and A4 PDF export. Edit your resume in your browser and keep your draft local.',
    eyebrow: 'ATS resumes',
    heading: 'Build an ATS-friendly resume without the clutter.',
    intro: 'Start from an ATS-focused template, add your experience and skills, review the layout, and export a clean A4 PDF from your browser.',
    points: ['Single-column ATS-focused options', 'Clear headings and practical formatting', 'Templates for students and experienced professionals', 'A4 PDF export with local drafts'],
    checklist: ['Use clear section headings such as Experience, Education and Skills', 'Keep important experience and skills in readable text', 'Use a simple structure that remains easy to scan', 'Review the exported PDF before sending an application'],
    guide: '/guides/ats-friendly-resume',
  },
  'fresher-resume': {
    title: 'Free Fresher Resume Builder | Resume for Students & Graduates | CraftMyPage',
    description: 'Create a clean fresher resume for internships and entry-level roles with focused templates, projects, education and skills sections.',
    eyebrow: 'Fresher resumes',
    heading: 'Create a strong fresher resume from a focused template.',
    intro: 'Build a practical resume around education, projects, skills, internships and achievements without needing a complicated design suite.',
    points: ['Student and fresher templates', 'Projects and education sections', 'Simple ATS-friendly layouts', 'Download a ready-to-share A4 PDF'],
    checklist: ['Put your strongest education or project evidence where it is easy to find', 'Describe projects with your contribution and outcome', 'List relevant technical and professional skills clearly', 'Check spelling, dates and contact details before exporting'],
    guide: '/guides/fresher-resume-format',
  },
  'software-engineer-resume': {
    title: 'Free Software Engineer Resume Builder | CraftMyPage',
    description: 'Create a software engineer resume focused on technical skills, projects, experience and measurable impact with A4 PDF export.',
    eyebrow: 'Software engineer resumes',
    heading: 'Build a resume that puts your engineering work first.',
    intro: 'Organize technical skills, projects, experience and measurable outcomes in a focused resume that is easy to review and export.',
    points: ['Software engineering template', 'Skills, projects and experience focus', 'Clean professional structure', 'A4 PDF export and local drafts'],
    checklist: ['Group technical skills so recruiters can scan them quickly', 'Describe engineering work with specific technologies and outcomes', 'Prioritize relevant projects and production experience', 'Check that the exported PDF preserves your intended hierarchy'],
    guide: '/guides/ats-friendly-resume',
  },
} as const

type PageKey = keyof typeof PAGES

export default function ResumeLandingPage() {
  const { intent = 'ats-resume' } = useParams()
  const page = PAGES[intent as PageKey] ?? PAGES['ats-resume']
  const canonical = `https://craftmypage.pages.dev/resumes/${intent}`

  return (
    <div className="cmp-page">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CraftMyPage" />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: page.title,
          description: page.description,
          url: canonical,
          about: { '@type': 'SoftwareApplication', name: 'CraftMyPage Resume Builder', applicationCategory: 'BusinessApplication' },
        })}</script>
      </Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="cmp-container py-14 sm:py-18 lg:py-20">
          <span className="cmp-eyebrow">{page.eyebrow}</span>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{page.heading}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{page.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="cmp-primary-btn" to="/tools/resume-builder">Build your resume</Link>
            <Link className="cmp-secondary-btn" to={page.guide}>Read the resume guide</Link>
          </div>
        </div>
      </section>

      <section className="cmp-container py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {page.points.map((point) => (
            <div className="cmp-card" key={point}>
              <span className="text-sm font-black text-indigo-600">✓</span>
              <p className="mt-3 text-base font-semibold text-slate-900">{point}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 cmp-surface p-8 sm:p-10">
          <span className="cmp-eyebrow">Resume checklist</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Before you send your resume</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {page.checklist.map((item) => (
              <li className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700" key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 cmp-surface p-8 sm:p-10">
          <span className="cmp-eyebrow">Focused resume building</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Choose a template that matches your career stage.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">CraftMyPage includes ATS-focused, fresher, software-engineer, experienced-professional, one-page, two-page and academic resume templates. Edit the content in your browser and export when it is ready.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className="cmp-primary-btn" to="/tools/resume-builder">Open Resume Builder</Link>
            <Link className="cmp-secondary-btn" to={page.guide}>See resume tips</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
