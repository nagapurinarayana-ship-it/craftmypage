import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const SITE_URL = 'https://craftmypage.pages.dev'
const DIST = 'dist'

const sitemap = await readFile('public/sitemap.xml', 'utf8')
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
const allPaths = [...new Set(['/', ...paths])]

function count(html, pattern) {
  return (html.match(pattern) || []).length
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
  if (/<meta name="keywords"/i.test(html)) throw new Error(`Obsolete meta keywords found: ${path}`)

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1])
  if (jsonLd.length === 0) throw new Error(`Missing structured data: ${path}`)

  for (const raw of jsonLd) {
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (error) {
      throw new Error(`Invalid JSON-LD on ${path}: ${error instanceof Error ? error.message : String(error)}`)
    }
    if (!parsed || parsed['@context'] !== 'https://schema.org' || !parsed['@type']) {
      throw new Error(`Malformed schema object on ${path}`)
    }
  }
}

console.log(`Verified SEO shells, canonical metadata and JSON-LD for ${allPaths.length} routes.`)
