import type { Template } from '../lib/template-validator'

type TemplateGalleryProps = {
  templates: Template[]
  onSelect: (template: Template) => void
}

export default function TemplateGallery({ templates, onSelect }: TemplateGalleryProps) {
  if (templates.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Choose a template</h2>
        <p className="mt-2 text-gray-600">No invitation templates available yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-semibold">Choose a template</h2>
        <span className="text-sm text-gray-600">{templates.length} templates</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            className="text-left border rounded-lg overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => onSelect(template)}
          >
            <div
              className="relative w-full aspect-[1500/2100] bg-gray-100"
              style={template.background?.fill ? { backgroundColor: template.background.fill } : undefined}
              aria-hidden="true"
            >
              <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-2">
                {template.elements
                  .filter((el) => el.type === 'text' && el.editable)
                  .slice(0, 3)
                  .map((el) => (
                    <p
                      key={el.key}
                      className="text-center truncate w-full"
                      style={{
                        fontSize: `${Math.max(10, (el as { fontSize?: number }).fontSize ?? 48) / 8}px`,
                        color: (el as { fill?: string }).fill ?? '#333333',
                        fontFamily: (el as { fontFamily?: string }).fontFamily ?? 'sans-serif',
                        fontWeight: (el as { fontWeight?: string }).fontWeight === 'bold' ? 'bold' : 'normal',
                      }}
                    >
                      {(el as { default?: string }).default ?? 'Text'}
                    </p>
                  ))}
              </div>
            </div>
            <div className="p-3">
              <p className="font-medium">{template.name}</p>
              <p className="text-sm text-gray-600 capitalize">{template.category} invitation</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}