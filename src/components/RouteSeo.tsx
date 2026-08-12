import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://craftmypage.pages.dev'

const GUIDE_METADATA: Record<string, { title: string; description: string }> = {
  'birthday-invitation-whatsapp': {
    title: 'How to Create a Birthday Invitation for WhatsApp | CraftMyPage',
    description: 'Learn practical birthday invitation sizes, wording, and sharing tips for WhatsApp.',
  },
  'wedding-invitation-wording': {
    title: 'Wedding Invitation Wording Examples | CraftMyPage',
    description: 'Classic, modern, and Indian wedding invitation wording examples you can customize.',
  },
  'invitation-details': {
    title: 'What Details Should an Invitation Contain? | CraftMyPage',
    description: 'A practical checklist of the essential details every invitation should include.',
  },
  'invitation-sizes': {
    title: 'Invitation Sizes for WhatsApp, Instagram and Print | CraftMyPage',
    description: 'Choose practical invitation dimensions for messaging, social media, and printing.',
  },
  'housewarming-invitation-wording': {
    title: 'Housewarming Invitation Wording | CraftMyPage',
    description: 'Warm and formal housewarming and Gruhapravesam invitation wording examples.',
  },
  'naming-ceremony-invitation': {
    title: 'Naming Ceremony Invitation Examples | CraftMyPage',
    description: 'Naming ceremony invitation wording and design ideas for a memorable celebration.',
  },
  'ats-friendly-resume': {
    title: 'How to Create an ATS-Friendly Resume | CraftMyPage',
    description: 'Practical ATS-friendly resume tips covering headings, formatting, keywords, and layout.',
  },
  'fresher-resume-format': {
    title: 'Fresher Resume Format with Examples | CraftMyPage',
    description: 'A clear resume structure for students and fresh graduates with limited experience.',
  },
  'software-engineer-resume': {
    title: 'Software Engineer Resume Guide | CraftMyPage',
    description: 'Practical tips for writing a software engineering resume that highlights measurable impact.',
  },
  'one-page-vs-two-page-resume': {
    title: 'One-Page vs Two-Page Resume | CraftMyPage',
    description: 'Understand when a one-page or two-page resume is the better choice.',
  },
}

const CATEGORY_METADATA: Record<string, { name: string; description: string }> = {
  birthday: { name: 'Birthday', description: 'Free birthday invitation templates you can customize in your browser.' },
  wedding: { name: 'Wedding', description: 'Free wedding invitation templates for elegant and modern celebrations.' },
  engagement: { name: 'Engagement', description: 'Free engagement invitation templates you can customize and download.' },
  baby: { name: 'Baby Shower', description: 'Free baby shower invitation templates for sharing and printing.' },
  housewarming: { name: 'Housewarming', description: 'Free housewarming and Gruhapravesam invitation templates.' },
  naming: { name: 'Naming Ceremony', description: 'Free naming ceremony invitation templates for family celebrations.' },
  party: { name: 'Party', description: 'Free party invitation templates for birthdays, gatherings, and celebrations.' },
  anniversary: { name: 'Anniversary', description: 'Free anniversary invitation templates for romantic and family celebrations.' },
}

function getRouteMetadata(pathname: string): { title: string; description: string; canonical: string } {
  if (pathname === '/') {
    return {
      title: 'CraftMyPage — Free Invitation, Invoice & Resume Maker',
      description: 'Create free invitations, invoices, resumes and printable designs in your browser. No account, no watermark, and no document uploads required for the core tools.',
      canonical: SITE_URL + '/',
    }
  }

  const staticRoutes: Record<string, { title: string; description: string }> = {
    '/tools/invitation-maker': {
      title: 'Free Invitation Maker | CraftMyPage',
      description: 'Create and customize free birthday, wedding, baby shower, housewarming and party invitations in your browser.',
    },
    '/tools/invoice-maker': {
      title: 'Free Invoice Maker | CraftMyPage',
      description: 'Create professional invoices in your browser, save drafts locally, and download invoice PDFs.',
    },
    '/tools/resume-builder': {
      title: 'Free Resume Builder | CraftMyPage',
      description: 'Build a clean resume from a template, edit it in your browser, and prepare it for download.',
    },
    '/guides': {
      title: 'Invitation, Resume & Invoice Guides | CraftMyPage',
      description: 'Practical guides for creating invitations, resumes and invoices with CraftMyPage.',
    },
    '/guides/how-to-create-an-invoice': {
      title: 'How to Create an Invoice | CraftMyPage',
      description: 'Learn how to create a clear professional invoice and download it from your browser.',
    },
    '/about': {
      title: 'About CraftMyPage',
      description: 'Learn about CraftMyPage, its privacy-first design approach, and browser-based editors.',
    },
    '/contact': {
      title: 'Contact CraftMyPage',
      description: 'Contact CraftMyPage with questions, suggestions, or feedback.',
    },
    '/privacy': {
      title: 'Privacy Policy | CraftMyPage',
      description: 'Learn how CraftMyPage handles local browser storage, documents, and personal content.',
    },
    '/terms': {
      title: 'Terms of Use | CraftMyPage',
      description: 'Read the terms that apply to use of the CraftMyPage website and tools.',
    },
  }

  const staticMeta = staticRoutes[pathname]
  if (staticMeta) return { ...staticMeta, canonical: SITE_URL + pathname }

  const guideMatch = pathname.match(/^\/guides\/([^/]+)$/)
  if (guideMatch) {
    const meta = GUIDE_METADATA[guideMatch[1]]
    if (meta) return { ...meta, canonical: SITE_URL + pathname }
    return {
      title: 'Guide Not Found | CraftMyPage',
      description: 'The requested CraftMyPage guide could not be found.',
      canonical: SITE_URL + pathname,
    }
  }

  const categoryMatch = pathname.match(/^\/invitations\/([^/]+)$/)
  if (categoryMatch) {
    const category = CATEGORY_METADATA[categoryMatch[1]]
    if (category) {
      return {
        title: `${category.name} Invitation Templates | CraftMyPage`,
        description: category.description,
        canonical: SITE_URL + pathname,
      }
    }
    return {
      title: 'Invitation Templates | CraftMyPage',
      description: 'Browse free invitation templates you can customize in your browser.',
      canonical: SITE_URL + pathname,
    }
  }

  return {
    title: 'CraftMyPage — Free Invitation, Invoice & Resume Maker',
    description: 'Create free invitations, invoices, resumes and printable designs in your browser.',
    canonical: SITE_URL + pathname,
  }
}

function upsertMeta(nameOrProperty: string, value: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    if (isProperty) tag.setAttribute('property', nameOrProperty)
    else tag.setAttribute('name', nameOrProperty)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', value)
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.href = href
}

export default function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getRouteMetadata(pathname)
    document.title = meta.title
    upsertMeta('description', meta.description)
    upsertMeta('og:title', meta.title, true)
    upsertMeta('og:description', meta.description, true)
    upsertMeta('og:url', meta.canonical, true)
    upsertCanonical(meta.canonical)
  }, [pathname])

  return null
}
