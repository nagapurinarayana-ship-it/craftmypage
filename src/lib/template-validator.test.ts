import { describe, expect, it } from 'vitest'
import { validateTemplate, getCanvasSize, isKnownCanvasSize, isValidCategory } from './template-validator'

const validTemplate = {
  id: 'birthday-modern-blue',
  category: 'birthday',
  name: 'Modern Blue Birthday',
  canvas: { width: 1500, height: 2100, size: 'portrait' },
  background: { fill: '#2c3e8f' },
  elements: [
    { type: 'text', key: 'guestName', editable: true, default: 'Guest Name' },
    { type: 'text', key: 'date', editable: true, default: '01 Jan 2027' },
  ],
}

describe('validateTemplate', () => {
  it('accepts a valid template', () => {
    const result = validateTemplate(validTemplate)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects non-object input', () => {
    const result = validateTemplate(null)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Template must be an object')
  })

  it('rejects a template missing required fields', () => {
    const result = validateTemplate({})
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining([
        'id (non-empty string) is required',
        'category must be one of: birthday, wedding, engagement, baby-shower, housewarming, naming-ceremony, anniversary, graduation, corporate, party',
        'name (non-empty string) is required',
        'canvas (object) is required',
        'elements (array) is required',
      ])
    )
  })

  it('rejects an invalid category', () => {
    const result = validateTemplate({ ...validTemplate, category: 'unknown' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'category must be one of: birthday, wedding, engagement, baby-shower, housewarming, naming-ceremony, anniversary, graduation, corporate, party'
    )
  })

  it('rejects canvas size mismatches', () => {
    const result = validateTemplate({
      ...validTemplate,
      canvas: { width: 1000, height: 1000, size: 'portrait' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('canvas.width and canvas.height must match canvas.size preset')
  })

  it('rejects elements missing type or key', () => {
    const result = validateTemplate({
      ...validTemplate,
      elements: [{ type: 'text' }],
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(['elements[0].key (non-empty string) is required'])
  })

  it('rejects unknown element fields', () => {
    const result = validateTemplate({
      ...validTemplate,
      elements: [{ type: 'text', key: 'x', bogusField: true }],
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('elements[0] has unknown field "bogusField" for type "text"')
  })

  it('rejects invalid canvas dimensions', () => {
    const result = validateTemplate({
      ...validTemplate,
      canvas: { width: '1500', height: 2100, size: 'portrait' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors).toEqual(
      expect.arrayContaining(['canvas.width and canvas.height (numbers) are required'])
    )
  })
})

describe('getCanvasSize', () => {
  it('returns preset dimensions', () => {
    expect(getCanvasSize('portrait')).toEqual({ width: 1500, height: 2100 })
    expect(getCanvasSize('square')).toEqual({ width: 1080, height: 1080 })
    expect(getCanvasSize('story')).toEqual({ width: 1080, height: 1920 })
  })
})

describe('isKnownCanvasSize', () => {
  it('recognizes valid sizes', () => {
    expect(isKnownCanvasSize('portrait')).toBe(true)
    expect(isKnownCanvasSize('landscape')).toBe(true)
    expect(isKnownCanvasSize('print5x7')).toBe(true)
    expect(isKnownCanvasSize('bogus')).toBe(false)
  })
})

describe('isValidCategory', () => {
  it('recognizes valid categories', () => {
    expect(isValidCategory('birthday')).toBe(true)
    expect(isValidCategory('wedding')).toBe(true)
    expect(isValidCategory('naming-ceremony')).toBe(true)
    expect(isValidCategory('unknown')).toBe(false)
  })
})