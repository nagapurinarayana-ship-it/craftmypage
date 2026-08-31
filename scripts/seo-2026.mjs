import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const dist = 'dist'
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

  // FAQ rich results are not generally available for utility/business sites. Keep
  // visible FAQs, but remove FAQPage JSON-LD so structured data stays purposeful.
  html = html.replace(/<script\s+type=["']application\/ld\+json["']>\s*\{[\s\S]*?["']@type["']\s*:\s*["']FAQPage["'][\s\S]*?<\/script>\s*/gi, '')

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

  // Generated route shells can inherit social tags from more than one source.
  // Keep exactly one copy of every ranking/share-critical meta directive.
  for (const [attribute, key] of [
    ['name', 'description'],
    ['name', 'robots'],
    ['property', 'og:type'],
    ['property', 'og:site_name'],
    ['property', 'og:locale'],
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:url'],
    ['property', 'og:image'],
    ['property', 'og:image:alt'],
    ['property', 'og:image:type'],
    ['property', 'og:image:width'],
    ['property', 'og:image:height'],
    ['name', 'twitter:card'],
    ['name', 'twitter:title'],
    ['name', 'twitter:description'],
    ['name', 'twitter:image'],
    ['name', 'twitter:image:alt'],
  ]) {
    html = dedupeMeta(html, attribute, key)
  }
  html = dedupeCanonical(html)

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

function dedupeMeta(html, attribute, key) {
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapeRegex(key)}["'][^>]*>`, 'gi')
  let seen = false
  return html.replace(pattern, tag => {
    if (seen) return ''
    seen = true
    return tag
  })
}

function dedupeCanonical(html) {
  const pattern = /<link\s+rel=["']canonical["'][^>]*>/gi
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
