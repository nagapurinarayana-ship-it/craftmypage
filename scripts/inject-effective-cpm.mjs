import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DIST = resolve(process.cwd(), 'dist')
const INDEX = resolve(DIST, 'index.html')

const POPUNDER = '<script src="https://pl30815332.effectivecpmnetwork.com/98/cd/4d/98cd4d37b3a5c234c49c85952c033714.js"></script>'
const NATIVE_SCRIPT = '<script async="async" data-cfasync="false" src="https://pl30815334.effectivecpmnetwork.com/29feded00f4ae2c8a3b2719189977fff/invoke.js"></script>'
const SOCIAL_BAR = '<script src="https://pl30815335.effectivecpmnetwork.com/e7/87/aa/e787aa4e8d5075169853c0d1fe5fcabc.js"></script>'
const BANNER = `<script>atOptions = {'key' : '75b0fc4d7ef9bda7dbda8e3863498abc', 'format' : 'iframe', 'height' : 60, 'width' : 468, 'params' : {}};</script><script src="https://www.highperformanceformat.com/75b0fc4d7ef9bda7dbda8e3863498abc/invoke.js"></script>`
const SMARTLINK = 'https://www.effectivecpmnetwork.com/hcit0ft2?key=3383ae2b2a94f70103f6b28c372f4f72'

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
<section class="cmp-monetization" aria-label="Advertisements">
  <div class="cmp-ad-block">
    <p class="cmp-ad-label">Advertisement</p>
    <div class="cmp-ad-native" aria-label="Sponsored advertisement">
      ${NATIVE_SCRIPT}
      <div id="container-29feded00f4ae2c8a3b2719189977fff"></div>
    </div>
  </div>

  <div class="cmp-ad-block">
    <p class="cmp-ad-label">Advertisement</p>
    <div class="cmp-ad-banner" aria-label="Sponsored advertisement">
      ${BANNER}
    </div>
  </div>

  <div class="cmp-ad-block cmp-smartlink">
    <p class="cmp-ad-label">Sponsored</p>
    <a href="${SMARTLINK}" target="_blank" rel="sponsored noopener noreferrer">
      Explore sponsored offers
    </a>
  </div>
</section>
${SOCIAL_BAR}
${MARKER_END}
</body>`

  return result.replace('</body>', bodyBlock)
}

if (!existsSync(INDEX)) {
  throw new Error(`Cannot inject EffectiveCPM ads: ${INDEX} does not exist. Run the Vite build first.`)
}

const html = readFileSync(INDEX, 'utf8')
const updated = inject(html)
writeFileSync(INDEX, updated, 'utf8')
console.log('EffectiveCPM monetization injected into dist/index.html')
