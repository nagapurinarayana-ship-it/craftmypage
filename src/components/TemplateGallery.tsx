import type { Template } from '../lib/template-validator'

type TemplateGalleryProps = {
  templates: Template[]
  onSelect: (template: Template) => void
}

export default function TemplateGallery({ templates, onSelect }: TemplateGalleryProps) {
  if (templates.length === 0) {
    return (
      <div className="cmp-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Choose a template</h2>
        <p className="mt-2 text-sm text-slate-500">No invitation templates are available yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <span className="cmp-eyebrow">Templates</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Choose a starting point</h2>
          <p className="mt-1 text-sm text-slate-500">Pick a design, then customize the editable text and images.</p>
        </div>
        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
          {templates.length} templates
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => onSelect(template)}
          >
            <div
              className="relative aspect-[1500/2100] w-full overflow-hidden bg-slate-100"
              style={template.background?.fill ? { backgroundColor: template.background.fill } : undefined}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-8">
                {template.elements
                  .filter((el) => el.type === 'text' && el.editable)
                  .slice(0, 3)
                  .map((el) => (
                    <p
                      key={el.key}
                      className="w-full truncate text-center"
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
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-700">{template.name}</p>
                <p className="mt-1 text-xs capitalize text-slate-500">{template.category} invitation</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-indigo-600 transition group-hover:translate-x-0.5">Use →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
