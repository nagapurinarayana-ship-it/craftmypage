#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateTemplate } from '../src/lib/template-validator.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const templatesDir = path.join(__dirname, '..', 'src', 'templates')
const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'))
let ok = true

for (const f of files) {
  const content = JSON.parse(fs.readFileSync(path.join(templatesDir, f), 'utf8'))
  const result = validateTemplate(content)
  if (!result.valid) {
    ok = false
    console.error(`Template ${f} is invalid:`)
    result.errors.forEach((error) => console.error('  -', error))
  } else {
    console.log(`Template ${f} OK`)
  }
}

process.exit(ok ? 0 : 1)
