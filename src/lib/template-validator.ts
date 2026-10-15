export type TemplateCanvasSize = 'portrait' | 'landscape' | 'square' | 'story' | 'print5x7'

export type TemplateElementType = 'text' | 'image' | 'shape' | 'decoration'

export type TemplateElementBase = {
  type: TemplateElementType
  key: string
  editable?: boolean
  removable?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  visible?: boolean
}

export type TextElement = TemplateElementBase & {
  type: 'text'
  default?: string
  placeholder?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: 'normal' | 'bold'
  fill?: string
  align?: 'left' | 'center' | 'right'
  lineHeight?: number
  maxLines?: number
}

export type ImageElement = TemplateElementBase & {
  type: 'image'
  src?: string
  alt?: string
  borderRadius?: number
}

export type ShapeElement = TemplateElementBase & {
  type: 'shape'
  shapeType: 'rect' | 'circle' | 'line'
  fill?: string
  stroke?: string
  strokeWidth?: number
  cornerRadius?: number
}

export type DecorationElement = TemplateElementBase & {
  type: 'decoration'
  kind: string
  color?: string
  size?: number
}

export type TemplateElement = TextElement | ImageElement | ShapeElement | DecorationElement

export type Template = {
  id: string
  category: string
  name: string
  description?: string
  canvas: { width: number; height: number; size: TemplateCanvasSize }
  background?: { fill?: string; imageSrc?: string }
  elements: TemplateElement[]
}

const textElementKeys = new Set([
  'type',
  'key',
  'editable',
  'removable',
  'x',
  'y',
  'width',
  'height',
  'rotation',
  'visible',
  'default',
  'placeholder',
  'fontSize',
  'fontFamily',
  'fontWeight',
  'fill',
  'align',
  'lineHeight',
  'maxLines',
])

const imageElementKeys = new Set([
  'type',
  'key',
  'editable',
  'removable',
  'x',
  'y',
  'width',
  'height',
  'rotation',
  'visible',
  'src',
  'alt',
  'borderRadius',
])

const shapeElementKeys = new Set([
  'type',
  'key',
  'editable',
  'removable',
  'x',
  'y',
  'width',
  'height',
  'rotation',
  'visible',
  'shapeType',
  'fill',
  'stroke',
  'strokeWidth',
  'cornerRadius',
])

const decorationElementKeys = new Set([
  'type',
  'key',
  'editable',
  'removable',
  'x',
  'y',
  'width',
  'height',
  'rotation',
  'visible',
  'kind',
  'color',
  'size',
])

const allowedKeysByType: Record<TemplateElementType, Set<string>> = {
  text: textElementKeys,
  image: imageElementKeys,
  shape: shapeElementKeys,
  decoration: decorationElementKeys,
}

const canvasSizes: Record<TemplateCanvasSize, { width: number; height: number }> = {
  portrait: { width: 1500, height: 2100 },
  landscape: { width: 2100, height: 1500 },
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  print5x7: { width: 1500, height: 2100 },
}

export function isKnownCanvasSize(value: unknown): value is TemplateCanvasSize {
  return typeof value === 'string' && value in canvasSizes
}

export function getCanvasSize(size: TemplateCanvasSize): { width: number; height: number } {
  return { ...canvasSizes[size] }
}

const validCategories = new Set([
  'birthday',
  'wedding',
  'engagement',
  'baby-shower',
  'housewarming',
  'naming-ceremony',
  'anniversary',
  'graduation',
  'corporate',
  'party',
])

export function isValidCategory(value: unknown): value is string {
  return typeof value === 'string' && validCategories.has(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isBoundedNumber(value: unknown, min: number, max: number): value is number {
  return isFiniteNumber(value) && value >= min && value <= max
}

function isSafeImageSource(value: unknown): boolean {
  if (typeof value !== 'string' || value.length > 8_000_000) return false
  if (/^data:image\/(jpeg|png|webp);base64,/i.test(value)) return true
  try {
    const parsed = new URL(value)
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && Boolean(parsed.hostname)
  } catch {
    return false
  }
}

export function validateTemplate(obj: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!obj || typeof obj !== 'object') {
    return { valid: false, errors: ['Template must be an object'] }
  }

  const t = obj as Record<string, unknown>

  if (typeof t.id !== 'string' || t.id.length === 0) errors.push('id (non-empty string) is required')
  else if (t.id.length > 200) errors.push('id must be no more than 200 characters')
  if (typeof t.category !== 'string' || !isValidCategory(t.category))
    errors.push(`category must be one of: ${[...validCategories].join(', ')}`)
  if (typeof t.name !== 'string' || t.name.length === 0) errors.push('name (non-empty string) is required')
  else if (t.name.length > 500) errors.push('name must be no more than 500 characters')

  if (!t.canvas || typeof t.canvas !== 'object') {
    errors.push('canvas (object) is required')
  } else {
    const canvas = t.canvas as Record<string, unknown>
    if (typeof canvas.width !== 'number' || typeof canvas.height !== 'number')
      errors.push('canvas.width and canvas.height (numbers) are required')
    if (!isKnownCanvasSize(canvas.size)) {
      errors.push(
        `canvas.size must be one of: ${['portrait', 'landscape', 'square', 'story', 'print5x7'].join(', ')}`
      )
    } else if (
      canvas.width !== canvasSizes[canvas.size].width ||
      canvas.height !== canvasSizes[canvas.size].height
    ) {
      errors.push('canvas.width and canvas.height must match canvas.size preset')
    }
  }

  if (t.background !== undefined) {
    if (!t.background || typeof t.background !== 'object' || Array.isArray(t.background)) {
      errors.push('background must be an object')
    } else {
      const background = t.background as Record<string, unknown>
      for (const key of Object.keys(background)) {
        if (!['fill', 'imageSrc'].includes(key)) errors.push('background has unknown field "' + key + '"')
      }
      if (background.fill !== undefined && (typeof background.fill !== 'string' || background.fill.length > 200)) {
        errors.push('background.fill must be a string up to 200 characters')
      }
      if (background.imageSrc !== undefined && !isSafeImageSource(background.imageSrc)) {
        errors.push('background.imageSrc must be a safe image URL or supported data URL')
      }
    }
  }

  if (!Array.isArray(t.elements)) {
    errors.push('elements (array) is required')
  } else if (t.elements.length > 500) {
    errors.push('elements must contain no more than 500 items')
  } else {
    t.elements.forEach((el, i) => {
      if (!el || typeof el !== 'object') {
        errors.push(`elements[${i}] must be an object`)
        return
      }
      const element = el as Record<string, unknown>
      if (
        typeof element.type !== 'string' ||
        !(element.type in allowedKeysByType)
      ) {
        errors.push(`elements[${i}].type must be one of: text, image, shape, decoration`)
        return
      }
      const type = element.type as TemplateElementType
      if (typeof element.key !== 'string' || element.key.length === 0)
        errors.push(`elements[${i}].key (non-empty string) is required`)
      else if (element.key.length > 200) errors.push(`elements[${i}].key must be no more than 200 characters`)

      for (const [key, value] of Object.entries(element)) {
        if (!allowedKeysByType[type].has(key)) {
          errors.push(`elements[${i}] has unknown field "${key}" for type "${type}"`)
          continue
        }
        if (['editable', 'removable', 'visible'].includes(key) && value !== undefined && typeof value !== 'boolean') {
          errors.push(`elements[${i}].${key} must be a boolean`)
          continue
        }
        if (['x', 'y'].includes(key) && value !== undefined && !isBoundedNumber(value, -5000, 5000)) {
          errors.push(`elements[${i}].${key} must be a finite number between -5000 and 5000`)
          continue
        }
        if (['width', 'height'].includes(key) && value !== undefined && !isBoundedNumber(value, 0, 5000)) {
          errors.push(`elements[${i}].${key} must be a finite number between 0 and 5000`)
          continue
        }
        if (key === 'rotation' && value !== undefined && !isBoundedNumber(value, -3600, 3600)) {
          errors.push(`elements[${i}].rotation must be a finite number between -3600 and 3600`)
          continue
        }
        if (['fontSize', 'lineHeight', 'maxLines', 'borderRadius', 'strokeWidth', 'cornerRadius', 'size'].includes(key) && value !== undefined && !isFiniteNumber(value)) {
          errors.push(`elements[${i}].${key} must be a finite number`)
          continue
        }
        if (key === 'fontSize' && value !== undefined && !isBoundedNumber(value, 1, 1000)) errors.push(`elements[${i}].fontSize must be between 1 and 1000`)
        if (key === 'lineHeight' && value !== undefined && !isBoundedNumber(value, 0.1, 20)) errors.push(`elements[${i}].lineHeight must be between 0.1 and 20`)
        if (key === 'maxLines' && value !== undefined && (!isBoundedNumber(value, 1, 100) || !Number.isInteger(value))) errors.push(`elements[${i}].maxLines must be an integer between 1 and 100`)
        if (['borderRadius', 'strokeWidth', 'cornerRadius', 'size'].includes(key) && value !== undefined && !isBoundedNumber(value, 0, 5000)) errors.push(`elements[${i}].${key} must be between 0 and 5000`)
        if (['default', 'placeholder'].includes(key) && value !== undefined && (typeof value !== 'string' || value.length > 5000)) errors.push(`elements[${i}].${key} must be a string up to 5000 characters`)
        if (['fontFamily', 'alt', 'kind'].includes(key) && value !== undefined && (typeof value !== 'string' || value.length > 200)) errors.push(`elements[${i}].${key} must be a string up to 200 characters`)
        if (['fill', 'stroke', 'color'].includes(key) && value !== undefined && (typeof value !== 'string' || value.length > 200)) errors.push(`elements[${i}].${key} must be a string up to 200 characters`)
        if (key === 'fontWeight' && value !== undefined && !['normal', 'bold'].includes(String(value))) errors.push(`elements[${i}].fontWeight must be normal or bold`)
        if (key === 'align' && value !== undefined && !['left', 'center', 'right'].includes(String(value))) errors.push(`elements[${i}].align must be left, center or right`)
        if (key === 'shapeType' && value !== undefined && !['rect', 'circle', 'line'].includes(String(value))) errors.push(`elements[${i}].shapeType must be rect, circle or line`)
        if (key === 'src' && value !== undefined && !isSafeImageSource(value)) errors.push(`elements[${i}].src must be a safe image URL or supported data URL`)
      }
    })
  }

  return { valid: errors.length === 0, errors }
}

export function sanitizeTemplate(obj: unknown): Template | null {
  const result = validateTemplate(obj)
  if (!result.valid) return null
  return obj as Template
}