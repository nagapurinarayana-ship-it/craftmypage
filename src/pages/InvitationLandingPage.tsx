import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

const PAGES = {
  birthday: {
    title: 'Free Birthday Invitation Maker | CraftMyPage',
    description: 'Create a birthday invitation in your browser, customize a focused template, and download a polished PDF or image.',
    eyebrow: 'Birthday invitations',
    heading: 'Create a birthday invitation people will want to open.',
    intro: 'Choose a birthday-ready design, personalize the wording and details, then export a shareable invitation without an account or server upload for the core editor.',
    points: ['Choose a birthday-focused template', 'Add the date, time, venue and RSVP details', 'Customize text, colors and images in the browser', 'Download a PDF or image for sharing or printing'],
  },
  wedding: {
    title: 'Free Wedding Invitation Maker | CraftMyPage',
    description: 'Create elegant wedding invitations in your browser with customizable templates, wording and print-ready PDF export.',
    eyebrow: 'Wedding invitations',
    heading: 'Create a wedding invitation with a polished finish.',
    intro: 'Start with a focused wedding design, personalize names, ceremony details and wording, then download the finished invitation as a PDF or image.',
    points: ['Start with wedding-focused layouts', 'Add ceremony, reception and RSVP details', 'Customize wording, colors and imagery', 'Export a clean PDF or image for sharing and printing'],
  },
  baby: {
    title: 'Free Baby Shower Invitation Maker | CraftMyPage',
    description: 'Create a baby shower invitation online with editable templates, event details and downloadable PDF or image export.',
    eyebrow: 'Baby shower invitations',
    heading: 'Create a warm, shareable baby shower invitation.',
    intro: 'Choose a baby-shower-ready template and personalize the host, date, location and RSVP details directly in your browser.',
    points: ['Choose a baby shower style', 'Add event and RSVP information', 'Personalize wording, colors and images', 'Download a PDF or image ready to share'],
  },
  housewarming: {
    title: 'Free Housewarming Invitation Maker | CraftMyPage',
    description: 'Create a housewarming or Gruhapravesam invitation in your browser with editable templates and downloadable PDF export.',
    eyebrow: 'Housewarming invitations',
    heading: 'Create a housewarming invitation for your new home.',
    intro: 'Build a personalized housewarming or Gruhapravesam invitation with your family, ceremony, date, venue and RSVP details.',
    points: ['Choose a housewarming-ready design', 'Add Gruhapravesam or celebration details', 'Customize names, wording and colors', 'Download a PDF or image for guests'],
  },
} as const

type PageKey = keyof typeof PAGES

export default function InvitationLandingPage() {
  const { intent = 'birthday' } = useParams()
  const page = PAGES[intent as PageKey] ?? PAGES.birthday
  const canonical = `https://craftmypage.pages.dev/invitations/${intent}/maker`

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CraftMyPage" />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.description,
            url: canonical,
            about: { '@type': 'SoftwareApplication', name: 'CraftMyPage Invitation Maker', applicationCategory: 'DesignApplication' },
          })}
        </script>
      </Helmet>

      <div className="cmp-page">
        <section className="border-b border-slate-200 bg-white">
          <div className="cmp-container py-14 sm:py-18 lg:py-20">
            <span className="cmp-eyebrow">{page.eyebrow}</span>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{page.heading}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{page.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="cmp-primary-btn" to="/tools/invitation-maker">Create an invitation</Link>
              <Link className="cmp-secondary-btn" to="/guides/invitation-details">Read invitation tips</Link>
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
            <span className="cmp-eyebrow">Why use CraftMyPage?</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">A focused invitation editor, without the complexity.</h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">The editor is designed for quick customization and local-first export. Your core invitation content stays in the browser while you create and download the finished design.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="cmp-primary-btn" to="/tools/invitation-maker">Open Invitation Maker</Link>
              <Link className="cmp-secondary-btn" to="/guides/invitation-sizes">See invitation size guidance</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
