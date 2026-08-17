import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DIST = resolve(process.cwd(), 'dist')
const INDEX = resolve(DIST, 'index.html')

const MARKER_START = '<!-- craftmypage-effectivecpm:start -->'
const MARKER_END = '<!-- craftmypage-effectivecpm:end -->'
const MONETAG_MARKER = '<!-- craftmypage-monetag:start -->'

const retiredSnippets = [
  '<script src="https://pl30815332.effectivecpmnetwork.com/98/cd/4d/98cd4d37b3a5c234c49c85952c033714.js"></script>',
  '<script src="https://pl30815335.effectivecpmnetwork.com/e7/87/aa/e787aa4e8d5075169853c0d1fe5fcabc.js"></script>',
  '<script src="https://quge5.com/88/tag.min.js" data-zone="270417" async data-cfasync="false"></script>',
]

function escaped(value) {
  return value.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&')
}

function stripManagedBlock(html, start, end = start) {
  return html.replace(new RegExp(escaped(start) + '[\\s\\S]*?' + escaped(end), 'g'), '')
}

function removeIntrusiveGlobalFormats(html) {
  let result = stripManagedBlock(html, MARKER_START, MARKER_END)
  result = stripManagedBlock(result, MONETAG_MARKER)
  for (const snippet of retiredSnippets) result = result.split(snippet).join('')
  return result
}

if (!existsSync(INDEX)) {
  throw new Error('Cannot sanitize Adsterra output: ' + INDEX + ' does not exist. Run the Vite build first.')
}

const html = readFileSync(INDEX, 'utf8')
const updated = removeIntrusiveGlobalFormats(html)
writeFileSync(INDEX, updated, 'utf8')
console.log('Removed Popunder, Social Bar and multi-tag scripts; Native, Banner and labelled sponsored units remain.')
