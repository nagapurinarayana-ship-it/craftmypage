import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DIST = resolve(process.cwd(), 'dist')
const INDEX = resolve(DIST, 'index.html')

const POPUNDER = '<script src="https://pl30815332.effectivecpmnetwork.com/98/cd/4d/98cd4d37b3a5c234c49c85952c033714.js"></script>'
const SOCIAL_BAR = '<script src="https://pl30815335.effectivecpmnetwork.com/e7/87/aa/e787aa4e8d5075169853c0d1fe5fcabc.js"></script>'

const MARKER_START = '<!-- craftmypage-effectivecpm:start -->'
const MARKER_END = '<!-- craftmypage-effectivecpm:end -->'

function stripExisting(html) {
  const escaped = MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedEnd = MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html.replace(new RegExp(`${escaped}[\\s\\S]*?${escapedEnd}`, 'g'), '')
}

function inject(html) {
  let result = stripExisting(html)

  if (!result.includes('pl30815332.effectivecpmnetwork.com/98/cd/4d/98cd4d37b3a5c234c49c85952c033714.js')) {
    result = result.replace('</head>', `  ${POPUNDER}\n</head>`)
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
console.log('EffectiveCPM global scripts injected into dist/index.html')
