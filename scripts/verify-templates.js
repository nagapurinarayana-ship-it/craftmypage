#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const validator = require('../src/lib/template-validator.ts')

const templatesDir = path.join(__dirname, '..', 'src', 'templates')
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'))
let ok = true
for (const f of files) {
  const content = JSON.parse(fs.readFileSync(path.join(templatesDir, f), 'utf8'))
  const res = validator.validateTemplate(content)
  if (!res.valid) {
    ok = false
    console.error(`Template ${f} is invalid:`)
    res.errors.forEach(e => console.error('  -', e))
  } else {
    console.log(`Template ${f} OK`)
  }
}
process.exit(ok ? 0 : 1)