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

export function validateTemplate(obj: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!obj || typeof obj !== 'object') {
    return { valid: false, errors: ['Template must be an object'] }
  }

  const t = obj as Record<string, unknown>

  if (typeof t.id !== 'string' || t.id.length === 0) errors.push('id (non-empty string) is required')
  if (typeof t.category !== 'string' || !isValidCategory(t.category))
    errors.push(`category must be one of: ${[...validCategories].join(', ')}`)
  if (typeof t.name !== 'string' || t.name.length === 0)
    errors.push('name (non-empty string) is required')

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

  if (!Array.isArray(t.elements)) {
    errors.push('elements (array) is required')
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

      for (const key of Object.keys(element)) {
        if (!allowedKeysByType[type].has(key)) {
          errors.push(`elements[${i}] has unknown field "${key}" for type "${type}"`)
        }
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