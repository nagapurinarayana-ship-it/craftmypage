import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const SITE_URL = 'https://craftmypage.pages.dev'
const SOCIAL_IMAGE = `${SITE_URL}/og-image.svg`
const DIST = 'dist'

const routes = {
  '/': ['CraftMyPage — Free Invoice Maker, Invitation Maker & Resume Builder', 'Create professional invoices, invitations and resumes in your browser. No account, no watermark and no core document uploads.'],
  '/tools/invoice-maker': ['Free Invoice Maker | CraftMyPage', 'Create professional invoices in your browser, save drafts locally, calculate taxes and download A4 invoice PDFs.'],
  '/tools/invitation-maker': ['Free Invitation Maker | CraftMyPage', 'Create and customize free birthday, wedding, baby shower, housewarming and party invitations in your browser.'],
  '/tools/resume-builder': ['Free Resume Builder | CraftMyPage', 'Build a clean ATS-friendly resume from a template, edit it in your browser, and download an A4 PDF.'],
  '/guides': ['Invitation, Resume & Invoice Guides | CraftMyPage', 'Practical guides for creating invitations, resumes and invoices with CraftMyPage.'],
  '/guides/how-to-create-an-invoice': ['How to Create a Professional Invoice for Free | CraftMyPage', 'Learn how to create a professional invoice for free, including required information, numbering, payment terms, taxes, discounts, and best practices.'],
  '/about': ['About CraftMyPage', 'Learn about CraftMyPage, its privacy-first design approach, and browser-based editors.'],
  '/contact': ['Contact CraftMyPage', 'Contact CraftMyPage with questions, suggestions, or feedback.'],
  '/privacy': ['Privacy Policy | CraftMyPage', 'Learn how CraftMyPage handles local browser storage, documents, personal content, and third-party advertising.'],
  '/terms': ['Terms of Use | CraftMyPage', 'Read the terms that apply to use of the CraftMyPage website and tools.'],
}

const guideMeta = {
  'birthday-invitation-whatsapp': ['How to Create a Birthday Invitation for WhatsApp | CraftMyPage', 'Learn practical birthday invitation sizes, wording, and sharing tips for WhatsApp.'],
  'wedding-invitation-wording': ['Wedding Invitation Wording Examples | CraftMyPage', 'Classic, modern, and Indian wedding invitation wording examples you can customize.'],
  'invitation-details': ['What Details Should an Invitation Contain? | CraftMyPage', 'A practical checklist of the essential details every invitation should include.'],
  'invitation-sizes': ['Invitation Sizes for WhatsApp, Instagram and Print | CraftMyPage', 'Choose practical invitation dimensions for messaging, social media, and printing.'],
  'housewarming-invitation-wording': ['Housewarming Invitation Wording | CraftMyPage', 'Warm and formal housewarming and Gruhapravesam invitation wording examples.'],
  'naming-ceremony-invitation': ['Naming Ceremony Invitation Examples | CraftMyPage', 'Naming ceremony invitation wording and design ideas for a memorable celebration.'],
  'ats-friendly-resume': ['How to Create an ATS-Friendly Resume | CraftMyPage', 'Practical ATS-friendly resume tips covering headings, formatting, keywords, and layout.'],
  'fresher-resume-format': ['Fresher Resume Format with Examples | CraftMyPage', 'A clear resume structure for students and fresh graduates with limited experience.'],
  'software-engineer-resume': ['Software Engineer Resume Guide | CraftMyPage', 'Practical tips for writing a software engineering resume that highlights measurable impact.'],
  'one-page-vs-two-page-resume': ['One-Page vs Two-Page Resume | CraftMyPage', 'Understand when a one-page or two-page resume is the better choice.'],
}

const invoiceMeta = {
  'gst-invoice': ['Free GST Invoice Generator Online | CraftMyPage', 'Create a GST-ready invoice online with GSTIN, HSN or SAC codes, CGST, SGST or IGST, payment details and a professional A4 PDF. Free and no account required.'],
  'freelancer-invoice': ['Free Freelancer Invoice Generator | CraftMyPage', 'Create a professional freelancer invoice online with services, rates, taxes, discounts, due dates and payment terms, then download a clean A4 PDF.'],
  'invoice-templates': ['Free Invoice Templates & Online Invoice Maker | CraftMyPage', 'Choose a professional invoice template, customize business and client details, calculate totals and download a print-ready A4 PDF for free.'],
}

const invoiceFaqs = [
  ['Can I create an invoice without an account?', 'Yes. The invoice maker lets you create and edit an invoice in your browser without requiring an accounting subscription.'],
  ['Can I download the finished invoice?', 'Yes. After reviewing the document, you can export an A4 PDF that is ready to save, share or print.'],
  ['What should I check before sending an invoice?', 'Review the customer details, invoice number, dates, line items, tax values, totals and payment instructions before sending it.'],
]

const categoryNames = { birthday: 'Birthday', wedding: 'Wedding', engagement: 'Engagement', baby: 'Baby Shower', housewarming: 'Housewarming', naming: 'Naming Ceremony', party: 'Party', anniversary: 'Anniversary' }

function metaFor(path) {
  path = path === '/' ? '/' : path.replace(/\/+$/, '')
  if (routes[path]) return { title: routes[path][0], description: routes[path][1] }
  const guide = path.match(/^\/guides\/([^/]+)$/)
  if (guide && guideMeta[guide[1]]) return { title: guideMeta[guide[1]][0], description: guideMeta[guide[1]][1] }
  const category = path.match(/^\/invitations\/([^/]+)$/)
  if (category && categoryNames[category[1]]) return { title: `${categoryNames[category[1]]} Invitation Templates | CraftMyPage`, description: `Free ${categoryNames[category[1]].toLowerCase()} invitation templates you can customize in your browser.` }
  const maker = path.match(/^\/invitations\/([^/]+)\/maker$/)
  if (maker && categoryNames[maker[1]]) return { title: `Free ${categoryNames[maker[1]]} Invitation Maker | CraftMyPage`, description: `Create and customize a ${categoryNames[maker[1]].toLowerCase()} invitation in your browser and download it for sharing or printing.` }
  const invoice = path.match(/^\/invoices\/([^/]+)$/)
  if (invoice && invoiceMeta[invoice[1]]) return { title: invoiceMeta[invoice[1]][0], description: invoiceMeta[invoice[1]][1] }
  const resume = path.match(/^\/resumes\/([^/]+)$/)
  if (resume) return { title: `${resume[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | Free Resume Builder | CraftMyPage`, description: 'Create a clean, ATS-friendly resume with CraftMyPage and download it as a PDF.' }
  return null
}

function breadcrumbItems(path) {
  const items = [{ name: 'CraftMyPage', url: `${SITE_URL}/` }]
  if (path === '/') return items
  const parts = path.split('/').filter(Boolean)
  let current = ''
  for (const part of parts) {
    current += `/${part}`
    const label = part === 'tools' ? 'Tools' : part === 'guides' ? 'Guides' : part === 'invitations' ? 'Invitations' : part === 'invoices' ? 'Invoices' : part === 'resumes' ? 'Resumes' : part.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    items.push({ name: label, url: `${SITE_URL}${current}` })
  }
  return items
}

function structuredDataFor(path, meta) {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      description: meta.description,
      url: `${SITE_URL}${path}`,
      isPartOf: { '@type': 'WebSite', name: 'CraftMyPage', url: `${SITE_URL}/` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems(path).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
  ]

  if (/^\/guides\//.test(path)) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title.replace(/ \| CraftMyPage$/, ''),
      description: meta.description,
      url: `${SITE_URL}${path}`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
      author: { '@type': 'Organization', name: 'CraftMyPage', url: `${SITE_URL}/about` },
      publisher: { '@type': 'Organization', name: 'CraftMyPage', url: `${SITE_URL}/about` },
      inLanguage: 'en',
    })
  }

  if (/^\/tools\//.test(path)) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: meta.title.replace(/ \| CraftMyPage$/, ''),
      description: meta.description,
      url: `${SITE_URL}${path}`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      isAccessibleForFree: true,
    })
  }

  if (/^\/invoices\//.test(path)) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: meta.title.replace(/ \| CraftMyPage$/, ''),
      description: meta.description,
      url: `${SITE_URL}${path}`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web browser',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: invoiceFaqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    })
  }

  return schemas
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function fallbackLinks(path) {
  const link = (href, label) => `<a href="${SITE_URL}${href}">${escapeHtml(label)}</a>`
  if (path === '/') return `${link('/tools/invoice-maker', 'Free Invoice Maker')} · ${link('/tools/invitation-maker', 'Free Invitation Maker')} · ${link('/tools/resume-builder', 'Free Resume Builder')} · ${link('/guides', 'Guides')}`
  if (path.startsWith('/tools/invoice-maker') || path.startsWith('/invoices/')) return `${link('/tools/invoice-maker', 'Open Invoice Maker')} · ${link('/guides/how-to-create-an-invoice', 'Invoice Guide')} · ${link('/guides', 'All Guides')}`
  if (path.startsWith('/tools/resume-builder') || path.startsWith('/resumes/')) return `${link('/tools/resume-builder', 'Open Resume Builder')} · ${link('/guides/ats-friendly-resume', 'ATS Resume Guide')} · ${link('/guides', 'All Guides')}`
  if (path.startsWith('/tools/invitation-maker') || path.startsWith('/invitations/')) return `${link('/tools/invitation-maker', 'Open Invitation Maker')} · ${link('/invitations/birthday', 'Birthday Invitations')} · ${link('/invitations/wedding', 'Wedding Invitations')} · ${link('/guides', 'Invitation Guides')}`
  if (path.startsWith('/guides/')) return `${link('/guides', 'All Guides')} · ${link('/tools/invoice-maker', 'Invoice Maker')} · ${link('/tools/invitation-maker', 'Invitation Maker')} · ${link('/tools/resume-builder', 'Resume Builder')}`
  return `${link('/', 'CraftMyPage Home')} · ${link('/tools/invoice-maker', 'Invoice Maker')} · ${link('/tools/invitation-maker', 'Invitation Maker')} · ${link('/tools/resume-builder', 'Resume Builder')}`
}

const base = await readFile(join(DIST, 'index.html'), 'utf8')
const sitemap = await readFile('public/sitemap.xml', 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname)
const allPaths = [...new Set(['/', ...urls])]

for (const path of allPaths) {
  const meta = metaFor(path)
  if (!meta) continue
  const canonical = `${SITE_URL}${path}`
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const structuredDataScripts = structuredDataFor(path, meta)
    .map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n    ')

  let html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`)

  const generatedSocialTags = [
    ['property', 'og:image'],
    ['property', 'og:image:alt'],
    ['property', 'og:image:type'],
    ['property', 'og:image:width'],
    ['property', 'og:image:height'],
    ['name', 'twitter:card'],
    ['name', 'twitter:image'],
    ['name', 'twitter:image:alt'],
  ]
  for (const [attribute, key] of generatedSocialTags) {
    const pattern = new RegExp(`\\s*<meta\\s+${attribute}="${key}"[^>]*>`, 'gi')
    html = html.replace(pattern, '')
  }

  html = html.replace('</head>', `    <meta property="og:image" content="${SOCIAL_IMAGE}" />\n    <meta property="og:image:alt" content="CraftMyPage — free browser document tools" />\n    <meta property="og:image:type" content="image/svg+xml" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:image" content="${SOCIAL_IMAGE}" />\n    <meta name="twitter:image:alt" content="CraftMyPage — free browser document tools" />\n    ${structuredDataScripts}\n  </head>`)

  const fallback = `<noscript><main><h1>${title}</h1><p>${description}</p><nav aria-label="Related CraftMyPage tools and guides">${fallbackLinks(path)}</nav></main></noscript>`
  html = html.replace('<div id="root"></div>', `<div id="root"></div>${fallback}`)
  const output = path === '/' ? join(DIST, 'index.html') : join(DIST, path.replace(/^\//, ''), 'index.html')
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, html)
}

console.log(`Generated SEO HTML shells for ${allPaths.length} sitemap routes.`)
