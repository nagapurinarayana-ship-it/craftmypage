import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const dist = 'dist'
const SOCIAL_IMAGE = 'https://craftmypage.pages.dev/og-image.svg'
const overrides = {
  'tools/invoice-maker/index.html': [
    'Free Invoice Maker Online — No Signup, PDF Download | CraftMyPage',
    'Create a professional invoice online for free with taxes, discounts, payment terms and A4 PDF download. No signup, no watermark and drafts stay in your browser.'
  ],
  'tools/invitation-maker/index.html': [
    'Free Invitation Maker Online — Birthday, Wedding & More | CraftMyPage',
    'Create birthday, wedding, baby shower, housewarming and party invitations online for free. Customize in your browser and download for WhatsApp, social or print.'
  ],
  'tools/resume-builder/index.html': [
    'Free ATS Resume Builder Online — No Signup, PDF Download | CraftMyPage',
    'Build an ATS-friendly resume online for free, edit it privately in your browser and download a clean A4 PDF with no signup or watermark.'
  ],
  'invoices/gst-invoice/index.html': [
    'Free GST Invoice Generator India — GSTIN, HSN/SAC & PDF | CraftMyPage',
    'Create a GST invoice for India with GSTIN, HSN or SAC, CGST, SGST or IGST, payment details and A4 PDF download. Free and no account required.'
  ],
  'invoices/freelancer-invoice/index.html': [
    'Free Freelancer Invoice Generator — No Signup, PDF | CraftMyPage',
    'Create a freelancer invoice with services, rates, taxes, discounts, due date and payment terms, then download a professional PDF without creating an account.'
  ]
}

const files = []
await collect(dist)
for (const file of files) {
  let html = await readFile(file, 'utf8')
  const relative = file.slice(dist.length + 1).replaceAll('\\', '/')

  // General utility/business pages do not gain useful FAQ rich-result coverage.
  // Remove only an individual FAQPage JSON-LD document. Do not use a cross-script
  // regex: it can accidentally consume WebPage/Breadcrumb/WebApplication schemas
  // that appear before the FAQ block in generated HTML.
  html = removeJsonLdType(html, 'FAQPage')

  if (!html.includes('property="og:locale"')) {
    html = html.replace('</head>', '    <meta property="og:locale" content="en_IN" />\n  </head>')
  }

  const override = overrides[relative]
  if (override) {
    const [title, description] = override
    html = html
      .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["'][^>]*>/i, `<meta name="description" content="${escapeAttr(description)}" />`)
      .replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["'][^>]*>/i, `<meta property="og:title" content="${escapeAttr(title)}" />`)
      .replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["'][^>]*>/i, `<meta property="og:description" content="${escapeAttr(description)}" />`)
      .replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["'][^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(title)}" />`)
      .replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["'][^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(description)}" />`)
  }

  for (const [attribute, key] of [
    ['name', 'description'],
    ['name', 'robots'],
    ['property', 'og:type'],
    ['property', 'og:site_name'],
    ['property', 'og:locale'],
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:url'],
    ['property', 'og:image:alt'],
    ['property', 'og:image:type'],
    ['property', 'og:image:width'],
    ['property', 'og:image:height'],
    ['name', 'twitter:title'],
    ['name', 'twitter:description'],
    ['name', 'twitter:image:alt'],
  ]) {
    html = dedupeMeta(html, attribute, key)
  }
  html = dedupeCanonical(html)

  // Rebuild the three verifier-critical social tags from scratch. This avoids
  // attribute-order or inherited-template duplicates in generated route shells.
  html = removeMeta(html, 'property', 'og:image')
  html = removeMeta(html, 'name', 'twitter:card')
  html = removeMeta(html, 'name', 'twitter:image')
  html = html.replace('</head>', `    <meta property="og:image" content="${SOCIAL_IMAGE}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:image" content="${SOCIAL_IMAGE}" />\n  </head>`)

  await writeFile(file, html, 'utf8')
}

console.log(`Applied 2026 SEO refinements to ${files.length} generated HTML pages.`)

async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) await collect(full)
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full)
  }
}

function removeJsonLdType(html, schemaType) {
  const pattern = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>\s*/gi
  return html.replace(pattern, (full, raw) => {
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.['@type'] === schemaType) return ''
      if (Array.isArray(parsed?.['@graph'])) {
        const graph = parsed['@graph'].filter(item => item?.['@type'] !== schemaType)
        if (graph.length !== parsed['@graph'].length) {
          if (graph.length === 0) return ''
          return `<script type="application/ld+json">${JSON.stringify({ ...parsed, '@graph': graph })}</script>\n`
        }
      }
    } catch (_) {
      // Preserve malformed/unknown JSON-LD here; the strict verifier will report it
      // with the route name instead of this refinement pass silently deleting data.
    }
    return full
  })
}

function removeMeta(html, attribute, key) {
  const pattern = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${escapeRegex(key)}["'][^>]*>\\s*`, 'gi')
  return html.replace(pattern, '')
}

function dedupeMeta(html, attribute, key) {
  const pattern = new RegExp(`<meta\\b[^>]*\\b${attribute}=["']${escapeRegex(key)}["'][^>]*>`, 'gi')
  let seen = false
  return html.replace(pattern, tag => {
    if (seen) return ''
    seen = true
    return tag
  })
}

function dedupeCanonical(html) {
  const pattern = /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi
  let seen = false
  return html.replace(pattern, tag => {
    if (seen) return ''
    seen = true
    return tag
  })
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeAttr(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}
function escapeHtml(value) {
  return escapeAttr(value)
}
