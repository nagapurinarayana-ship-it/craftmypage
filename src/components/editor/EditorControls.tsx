import type { TextElement } from '../../lib/template-validator'
import type { TemplateProject } from '../../lib/template-engine'

type EditorControlsProps = {
  elements: TextElement[]
  project: TemplateProject
  selectedKey: string | null
  onUpdateValue: (key: string, value: string) => void
  onUpdateStyle: (
    key: string,
    patch: Partial<Pick<TextElement, 'fontSize' | 'fontFamily' | 'fill'>>
  ) => void
}

const FONT_FAMILIES = ['Georgia', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana']
const FONT_SIZES = [24, 32, 40, 48, 56, 64, 72, 96]
const COLORS = [
  '#ffffff',
  '#000000',
  '#1e2a6d',
  '#ffd166',
  '#e63946',
  '#2a9d8f',
  '#f4a261',
  '#9b5de5',
]

export default function EditorControls({
  elements,
  project,
  selectedKey,
  onUpdateValue,
  onUpdateStyle,
}: EditorControlsProps) {
  const editableElements = elements.filter((el) => el.editable)
  const selected = elements.find((el) => el.key === selectedKey)

  return (
    <div className="w-full lg:w-80 border rounded-lg bg-white p-4 space-y-4">
      <h2 className="font-semibold">Edit Invitation</h2>

      <section aria-label="Text fields">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Text</h3>
        {editableElements.length === 0 && (
          <p className="text-sm text-gray-500">This template has no editable text.</p>
        )}
        <div className="space-y-3">
          {editableElements.map((el) => (
            <label key={el.key} className="block text-sm">
              <span className="block mb-1 text-gray-700">{labelFor(el.key)}</span>
              <input
                type="text"
                className="w-full border rounded px-2 py-1.5 text-gray-900"
                value={project.values[el.key] ?? el.default ?? ''}
                placeholder={el.placeholder}
                onChange={(e) => onUpdateValue(el.key, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      {selected?.type === 'text' && selected?.editable && (
        <section aria-label="Typography">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Appearance</h3>
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="block mb-1 text-gray-700">Font size</span>
              <select
                className="w-full border rounded px-2 py-1.5 text-gray-900"
                value={selected.fontSize}
                onChange={(e) => onUpdateStyle(selected.key, { fontSize: Number(e.target.value) })}
              >
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="block mb-1 text-gray-700">Font family</span>
              <select
                className="w-full border rounded px-2 py-1.5 text-gray-900"
                value={selected.fontFamily}
                onChange={(e) => onUpdateStyle(selected.key, { fontFamily: e.target.value })}
              >
                {FONT_FAMILIES.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="block mb-1 text-gray-700">Color</span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-7 h-7 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                    aria-label={`Set color ${color}`}
                    onClick={() => onUpdateStyle(selected.key, { fill: color })}
                  />
                ))}
              </div>
            </label>
          </div>
        </section>
      )}
    </div>
  )
}

function labelFor(key: string): string {
  const spaced = key.replace(/([A-Z])/g, ' $1').toLowerCase()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}