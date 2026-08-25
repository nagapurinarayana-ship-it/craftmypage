import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://craftmypage.pages.dev'
const SOCIAL_IMAGE = `${SITE_URL}/og-image.svg`

const GUIDE_METADATA: Record<string, { title: string; description: string; keywords: string }> = {
  'birthday-invitation-whatsapp': { title: 'How to Create a Birthday Invitation for WhatsApp | CraftMyPage', description: 'Learn practical birthday invitation sizes, wording, and sharing tips for WhatsApp.', keywords: 'birthday invitation whatsapp, birthday invitation for whatsapp, whatsapp birthday invitation, birthday invite template' },
  'wedding-invitation-wording': { title: 'Wedding Invitation Wording Examples | CraftMyPage', description: 'Classic, modern, and Indian wedding invitation wording examples you can customize.', keywords: 'wedding invitation wording, wedding invite wording, wedding invitation examples, indian wedding invitation wording' },
  'invitation-details': { title: 'What Details Should an Invitation Contain? | CraftMyPage', description: 'A practical checklist of the essential details every invitation should include.', keywords: 'invitation details, invitation checklist, invitation card details, what to include on an invitation' },
  'invitation-sizes': { title: 'Invitation Sizes for WhatsApp, Instagram and Print | CraftMyPage', description: 'Choose practical invitation dimensions for messaging, social media, and printing.', keywords: 'invitation size, invitation card size, whatsapp invitation size, instagram invitation size, printable invitation size' },
  'housewarming-invitation-wording': { title: 'Housewarming Invitation Wording | CraftMyPage', description: 'Warm and formal housewarming and Gruhapravesam invitation wording examples.', keywords: 'housewarming invitation wording, housewarming invite, gruhapravesam invitation wording, new home invitation' },
  'naming-ceremony-invitation': { title: 'Naming Ceremony Invitation Examples | CraftMyPage', description: 'Naming ceremony invitation wording and design ideas for a memorable celebration.', keywords: 'naming ceremony invitation, baby naming invitation, naming ceremony invite, naming ceremony wording' },
  'ats-friendly-resume': { title: 'How to Create an ATS-Friendly Resume | CraftMyPage', description: 'Practical ATS-friendly resume tips covering headings, formatting, keywords, and layout.', keywords: 'ats friendly resume, ats resume, ats resume format, ats resume tips, applicant tracking system resume' },
  'fresher-resume-format': { title: 'Fresher Resume Format with Examples | CraftMyPage', description: 'A clear resume structure for students and fresh graduates with limited experience.', keywords: 'fresher resume format, resume for freshers, student resume, graduate resume, fresher resume examples' },
  'software-engineer-resume': { title: 'Software Engineer Resume Guide | CraftMyPage', description: 'Practical tips for writing a software engineering resume that highlights measurable impact.', keywords: 'software engineer resume, software developer resume, engineering resume, software engineer cv' },
  'one-page-vs-two-page-resume': { title: 'One-Page vs Two-Page Resume | CraftMyPage', description: 'Understand when a one-page or two-page resume is the better choice.', keywords: 'one page resume, two page resume, resume length, one page vs two page resume' },
}

const CATEGORY_METADATA: Record<string, { name: string; description: string; keywords: string }> = {
  birthday: { name: 'Birthday', description: 'Free birthday invitation templates you can customize in your browser.', keywords: 'birthday invitation templates, birthday invite template, free birthday invitation, birthday card maker' },
  wedding: { name: 'Wedding', description: 'Free wedding invitation templates for elegant and modern celebrations.', keywords: 'wedding invitation templates, wedding invite template, free wedding invitation, wedding card maker' },
  engagement: { name: 'Engagement', description: 'Free engagement invitation templates you can customize and download.', keywords: 'engagement invitation templates, engagement invite, free engagement invitation, engagement card maker' },
  baby: { name: 'Baby Shower', description: 'Free baby shower invitation templates for sharing and printing.', keywords: 'baby shower invitation templates, baby shower invite, free baby shower invitation, baby shower card maker' },
  housewarming: { name: 'Housewarming', description: 'Free housewarming and Gruhapravesam invitation templates.', keywords: 'housewarming invitation templates, gruhapravesam invitation, housewarming invite, new home invitation' },
  naming: { name: 'Naming Ceremony', description: 'Free naming ceremony invitation templates for family celebrations.', keywords: 'naming ceremony invitation templates, baby naming invitation, naming ceremony invite, free naming ceremony invitation' },
  party: { name: 'Party', description: 'Free party invitation templates for birthdays, gatherings, and celebrations.', keywords: 'party invitation templates, party invite maker, free party invitation, celebration invitation' },
  anniversary: { name: 'Anniversary', description: 'Free anniversary invitation templates for romantic and family celebrations.', keywords: 'anniversary invitation templates, anniversary invite, free anniversary invitation, anniversary card maker' },
}

const TOOL_METADATA: Record<string, { name: string; description: string; keywords: string }> = {
  '/tools/invoice-maker': { name: 'Free Invoice Maker', description: 'Create professional invoices in your browser, save drafts locally, calculate taxes and download A4 invoice PDFs.', keywords: 'free invoice maker, online invoice maker, invoice generator, invoice template, invoice PDF maker' },
  '/tools/invitation-maker': { name: 'Free Invitation Maker', description: 'Create and customize free birthday, wedding, baby shower, housewarming and party invitations in your browser.', keywords: 'free invitation maker, online invitation maker, invitation card maker, invitation template maker, digital invitation maker' },
  '/tools/resume-builder': { name: 'Free Resume Builder', description: 'Build a clean ATS-friendly resume from a template, edit it in your browser, and download an A4 PDF.', keywords: 'free resume builder, online resume builder, ats resume builder, resume maker, CV builder' },
}

const ROUTE_KEYWORDS: Record<string, string> = {
  '/': 'free invoice maker, free invitation maker, free resume builder, invoice generator, invitation maker, resume builder, online document maker',
  '/guides': 'invoice guides, invitation guides, resume guides, invoice tips, invitation tips, resume tips',
  '/guides/how-to-create-an-invoice': 'how to create an invoice, invoice guide, professional invoice, invoice format, invoice best practices',
  '/about': 'CraftMyPage, browser document editor, privacy first document tools',
  '/contact': 'CraftMyPage contact, support, feedback',
  '/privacy': 'CraftMyPage privacy policy, local browser storage, document privacy',
  '/terms': 'CraftMyPage terms of use, document tools terms',
}

function getRouteMetadata(pathname: string): { title: string; description: string; canonical: string; keywords: string; software?: { name: string; description: string } } {
  if (pathname === '/') return {
    title: 'CraftMyPage — Free Invoice Maker, Invitation Maker & Resume Builder',
    description: 'Create professional invoices, invitations and resumes in your browser. No account, no watermark and no core document uploads.',
    canonical: `${SITE_URL}/`,
    keywords: ROUTE_KEYWORDS['/'],
  }

  const staticRoutes: Record<string, { title: string; description: string }> = {
    '/guides': { title: 'Invitation, Resume & Invoice Guides | CraftMyPage', description: 'Practical guides for creating invitations, resumes and invoices with CraftMyPage.' },
    '/guides/how-to-create-an-invoice': { title: 'How to Create a Professional Invoice for Free | CraftMyPage', description: 'Learn how to create a professional invoice for free, including required information, numbering, payment terms, taxes, discounts, and best practices.' },
    '/about': { title: 'About CraftMyPage', description: 'Learn about CraftMyPage, its privacy-first design approach, and browser-based editors.' },
    '/contact': { title: 'Contact CraftMyPage', description: 'Contact CraftMyPage with questions, suggestions, or feedback.' },
    '/privacy': { title: 'Privacy Policy | CraftMyPage', description: 'Learn how CraftMyPage handles local browser storage, documents, personal content, and third-party advertising.' },
    '/terms': { title: 'Terms of Use | CraftMyPage', description: 'Read the terms that apply to use of the CraftMyPage website and tools.' },
  }

  const toolMeta = TOOL_METADATA[pathname]
  if (toolMeta) return { title: `${toolMeta.name} | CraftMyPage`, description: toolMeta.description, canonical: SITE_URL + pathname, keywords: toolMeta.keywords, software: toolMeta }

  const staticMeta = staticRoutes[pathname]
  if (staticMeta) return { ...staticMeta, canonical: SITE_URL + pathname, keywords: ROUTE_KEYWORDS[pathname] || 'CraftMyPage, online document tools' }

  const guideMatch = pathname.match(/^\/guides\/([^/]+)$/)
  if (guideMatch) {
    const meta = GUIDE_METADATA[guideMatch[1]]
    return meta ? { ...meta, canonical: SITE_URL + pathname } : { title: 'Guide Not Found | CraftMyPage', description: 'The requested CraftMyPage guide could not be found.', canonical: SITE_URL + pathname, keywords: 'CraftMyPage guides, document guides' }
  }

  const categoryMatch = pathname.match(/^\/invitations\/([^/]+)$/)
  if (categoryMatch) {
    const category = CATEGORY_METADATA[categoryMatch[1]]
    return category ? { title: `${category.name} Invitation Templates | CraftMyPage`, description: category.description, canonical: SITE_URL + pathname, keywords: category.keywords } : { title: 'Invitation Templates | CraftMyPage', description: 'Browse free invitation templates you can customize in your browser.', canonical: SITE_URL + pathname, keywords: 'free invitation templates, invitation maker, invitation card maker' }
  }

  return { title: 'CraftMyPage — Free Invoice Maker, Invitation Maker & Resume Builder', description: 'Create professional invoices, invitations and resumes in your browser.', canonical: SITE_URL + pathname, keywords: 'CraftMyPage, invoice maker, invitation maker, resume builder' }
}

export default function RouteSeo() {
  const { pathname: rawPathname } = useLocation()
  const pathname = rawPathname === '/' ? '/' : rawPathname.replace(/\/+$/, '')

  if (pathname.startsWith('/invoices/') || pathname.startsWith('/resumes/') || /^\/invitations\/(birthday|wedding|baby|housewarming)\/maker$/.test(pathname)) return null

  const meta = getRouteMetadata(pathname)
  const softwareSchema = meta.software
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: meta.software.name,
        url: meta.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        description: meta.software.description,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }
    : null

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="googlebot" content="index,follow" />
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="CraftMyPage" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={SOCIAL_IMAGE} />
      <meta property="og:image:alt" content="CraftMyPage — free browser document tools" />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={SOCIAL_IMAGE} />
      {softwareSchema ? <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script> : null}
    </Helmet>
  )
}
