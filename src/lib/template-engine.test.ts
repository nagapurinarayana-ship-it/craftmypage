import { describe, expect, it } from 'vitest'
import { createProject, updateProjectValue, importTemplate, isEditableTextElement } from './template-engine'
import type { Template } from './template-validator'

const sampleTemplate: Template = {
  id: 'birthday-modern-blue',
  category: 'birthday',
  name: 'Modern Blue Birthday',
  canvas: { width: 1500, height: 2100, size: 'portrait' },
  background: { fill: '#2c3e8f' },
  elements: [
    {
      type: 'text',
      key: 'guestName',
      editable: true,
      default: 'Guest Name',
      x: 90,
      y: 300,
      width: 1320,
      height: 200,
      fontSize: 96,
      fontFamily: 'Georgia',
      fill: '#ffffff',
      align: 'center',
    },
    {
      type: 'text',
      key: 'date',
      editable: true,
      default: '01 Jan 2027',
      x: 150,
      y: 950,
      width: 1200,
      height: 100,
      fontSize: 56,
      fontFamily: 'Georgia',
      fill: '#ffd166',
      align: 'center',
    },
    {
      type: 'shape',
      key: 'headerBand',
      shapeType: 'rect',
      x: 0,
      y: 0,
      width: 1500,
      height: 700,
      fill: '#1e2a6d',
    },
  ],
}

describe('createProject', () => {
  it('creates a project with editable text values from defaults', () => {
    const project = createProject(sampleTemplate)
    expect(project.templateId).toBe('birthday-modern-blue')
    expect(project.name).toBe('Modern Blue Birthday')
    expect(project.values).toEqual({
      guestName: 'Guest Name',
      date: '01 Jan 2027',
    })
    expect(project.elements).toHaveLength(3)
    expect(project.id).toBeTruthy()
  })

  it('preserves existing values when provided', () => {
    const project = createProject(sampleTemplate, {
      values: { guestName: 'Aarav', date: '15 Aug 2027' },
    })
    expect(project.values.guestName).toBe('Aarav')
    expect(project.values.date).toBe('15 Aug 2027')
  })

  it('sanitizes imported text values', () => {
    const project = createProject(sampleTemplate, {
      values: { guestName: '<script>alert(1)</script>Aarav', date: '01 Jan 2027' },
    })
    expect(project.values.guestName).not.toContain('<script>')
    expect(project.values.guestName).toContain('Aarav')
  })
})

describe('updateProjectValue', () => {
  it('updates a value and bumps updatedAt', () => {
    const project = createProject(sampleTemplate)
    const before = project.updatedAt
    const updated = updateProjectValue(project, 'guestName', 'Ananya')
    expect(updated.values.guestName).toBe('Ananya')
    expect(updated.updatedAt).toBeGreaterThanOrEqual(before)
    expect(updated.id).toBe(project.id)
  })

  it('sanitizes the new value', () => {
    const project = createProject(sampleTemplate)
    const updated = updateProjectValue(project, 'guestName', '<b>Bold</b>')
    expect(updated.values.guestName).not.toContain('<b>')
  })
})

describe('importTemplate', () => {
  it('returns null for invalid templates', () => {
    expect(importTemplate(null)).toBeNull()
    expect(importTemplate({})).toBeNull()
    expect(importTemplate({ id: 'x' })).toBeNull()
  })

  it('returns the template for valid input', () => {
    const result = importTemplate(sampleTemplate)
    expect(result).not.toBeNull()
    expect(result?.id).toBe('birthday-modern-blue')
  })
})

describe('isEditableTextElement', () => {
  it('returns true only for editable text elements', () => {
    expect(isEditableTextElement(sampleTemplate.elements[0])).toBe(true)
    expect(isEditableTextElement(sampleTemplate.elements[2])).toBe(false)
  })
})