import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DIST = resolve(process.cwd(), 'dist')
const INDEX = resolve(DIST, 'index.html')

const POPUNDER = '<script src="https://pl30815332.effectivecpmnetwork.com/98/cd/4d/98cd4d37b3a5c234c49c85952c033714.js"></script>'
const SOCIAL_BAR = '<script src="https://pl30815335.effectivecpmnetwork.com/e7/87/aa/e787aa4e8d5075169853c0d1fe5fcabc.js"></script>'
const MONETAG_MULTITAG = '<script src="https://quge5.com/88/tag.min.js" data-zone="270417" async data-cfasync="false"></script>'

const MARKER_START = '<!-- craftmypage-effectivecpm:start -->'
const MARKER_END = '<!-- craftmypage-effectivecpm:end -->'
const MONETAG_MARKER = '<!-- craftmypage-monetag:start -->'

function stripExisting(html) {
  const escaped = MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedEnd = MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.replace(new RegExp(`${escaped}[\\s\\S]*?${escapedEnd}`, 'g'), '')
}

function stripMonetag(html) {
  const escaped = MONETAG_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.replace(new RegExp(`${escaped}[\\s\\S]*?${escaped}`, 'g'), '')
}

function inject(html) {
  let result = stripExisting(html)
  result = stripMonetag(result)

  if (!result.includes('pl30815332.effectivecpmnetwork.com/98/cd/4d/98cd4d37b3a5c234c49c85952c033714.js')) {
    result = result.replace('</head>', `  ${POPUNDER}\n</head>`)
  }

  if (!result.includes('quge5.com/88/tag.min.js')) {
    result = result.replace('</head>', `  ${MONETAG_MARKER}\n  ${MONETAG_MULTITAG}\n</head>`)
  }

  const bodyBlock = `
${MARKER_START}
${SOCIAL_BAR}
${MARKER_END}
</body>`

  return result.replace('</body>', bodyBlock)
}

if (!existsSync(INDEX)) {
  throw new Error(`Cannot inject EffectiveCPM global scripts: ${INDEX} does not exist. Run the Vite build first.`)
}

const html = readFileSync(INDEX, 'utf8')
const updated = inject(html)
writeFileSync(INDEX, updated, 'utf8')
console.log('EffectiveCPM and Monetag global scripts injected into dist/index.html')
