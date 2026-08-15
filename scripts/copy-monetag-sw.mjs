import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const source = resolve(root, 'sw.js')
const dist = resolve(root, 'dist')
const destination = resolve(dist, 'sw.js')

if (!existsSync(source)) {
  throw new Error(`Monetag verification file not found: ${source}`)
}

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true })
}

copyFileSync(source, destination)
console.log('Monetag verification service worker copied to dist/sw.js')
