import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const SITE_URL = 'https://craftmypage.pages.dev'
const DIST = 'dist'

const sitemap = await readFile('public/sitemap.xml', 'utf8')
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
const allPaths = [...new Set(['/', ...paths])]
const invoicePaths = new Set([
  '/invoices/gst-invoice/',
  '/invoices/freelancer-invoice/',
  '/invoices/invoice-templates/',
])
const invoiceTitles = new Set()
const invoiceDescriptions = new Set()

function count(html, pattern) {
  return (html.match(pattern) || []).length
}

function getSchemaObjects(parsed) {
  if (Array.isArray(parsed)) return parsed.map((schema) => ({ schema, context: undefined }))
  if (parsed && Array.isArray(parsed['@graph'])) {
    return parsed['@graph'].map((schema) => ({ schema, context: parsed['@context'] }))
  }
  return [{ schema: parsed, context: parsed?.['@context'] }]
}

for (const path of allPaths) {
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, path.slice(1), 'index.html')
  if (!existsSync(file)) throw new Error(`Missing SEO shell: ${file}`)

  const html = await readFile(file, 'utf8')
  const canonical = `${SITE_URL}${path}`
  const canonicalPattern = new RegExp(`<link rel="canonical" href="${canonical.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}"`)

  if (!/<title>[^<]+<\/title>/.test(html)) throw new Error(`Missing title: ${path}`)
  if (!/<meta name="description" content="[^"]+"/.test(html)) throw new Error(`Missing description: ${path}`)
  if (!canonicalPattern.test(html)) throw new Error(`Incorrect canonical: ${path}`)
  if (count(html, /<link rel="canonical"/g) !== 1) throw new Error(`Duplicate canonical: ${path}`)
  if (count(html, /<title>/g) !== 1) throw new Error(`Duplicate title: ${path}`)
  if (count(html, /<meta name="description"/g) !== 1) throw new Error(`Duplicate description: ${path}`)
  if (count(html, /<meta property="og:image" content=/g) !== 1) throw new Error(`Duplicate or missing Open Graph image: ${path}`)
  if (count(html, /<meta name="twitter:card" content=/g) !== 1) throw new Error(`Duplicate or missing Twitter card: ${path}`)
  if (count(html, /<meta name="twitter:image" content=/g) !== 1) throw new Error(`Duplicate or missing Twitter image: ${path}`)
  if (/<meta name="keywords"/i.test(html)) throw new Error(`Obsolete meta keywords found: ${path}`)

  if (invoicePaths.has(path)) {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
    if (!title || !description) throw new Error(`Missing invoice metadata: ${path}`)
    if (invoiceTitles.has(title)) throw new Error(`Duplicate invoice title: ${path}`)
    if (invoiceDescriptions.has(description)) throw new Error(`Duplicate invoice description: ${path}`)
    invoiceTitles.add(title)
    invoiceDescriptions.add(description)
  }

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1])
  if (jsonLd.length === 0) throw new Error(`Missing structured data: ${path}`)

  for (const raw of jsonLd) {
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (error) {
      throw new Error(`Invalid JSON-LD on ${path}: ${error instanceof Error ? error.message : String(error)}`)
    }

    if (!parsed || typeof parsed !== 'object') throw new Error(`Malformed schema document on ${path}`)
    const documentContext = parsed['@context']
    const schemaObjects = getSchemaObjects(parsed)
    if (schemaObjects.length === 0) throw new Error(`Empty schema document on ${path}`)

    for (const { schema, context } of schemaObjects) {
      const effectiveContext = context ?? documentContext
      if (!schema || typeof schema !== 'object' || effectiveContext !== 'https://schema.org' || !schema['@type']) {
        throw new Error(`Malformed schema object on ${path}`)
      }
    }
  }

  if (invoicePaths.has(path)) {
    const schemaTypes = jsonLd.flatMap((raw) => getSchemaObjects(JSON.parse(raw)).map(({ schema }) => schema['@type']))
    if (!schemaTypes.includes('WebApplication')) throw new Error(`Missing WebApplication schema: ${path}`)
    if (!schemaTypes.includes('FAQPage')) throw new Error(`Missing FAQPage schema: ${path}`)
  }
}

console.log(`Verified SEO shells, canonical metadata and JSON-LD for ${allPaths.length} routes.`)
