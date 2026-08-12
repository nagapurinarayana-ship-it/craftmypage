import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { validateTemplate } from '../lib/template-validator'
import type { Template } from '../lib/template-validator'
import TemplateGallery from '../components/TemplateGallery'

const templateModules = import.meta.glob('../templates/*.json', { eager: true }) as Record<string, { default: unknown }>
const CATEGORY_TITLES: Record<string, string> = { birthday: 'Birthday Invitations', wedding: 'Wedding Invitations', engagement: 'Engagement Invitations', baby: 'Baby Shower Invitations', housewarming: 'Housewarming Invitations', naming: 'Naming Ceremony Invitations', party: 'Party Invitations', anniversary: 'Anniversary Invitations' }
const CATEGORY_DESCRIPTIONS: Record<string, string> = { birthday: 'Celebrate in style with our birthday invitation templates.', wedding: 'Elegant wedding invitation templates for your special day.', engagement: 'Regal engagement invitations to announce your joy.', baby: 'Gentle and lovely baby shower invitation templates.', housewarming: 'Warm housewarming and Gruhapravesam invitation templates.', naming: 'Traditional and modern naming ceremony invitations.', party: 'Fun and vibrant party invitation templates.', anniversary: 'Romantic anniversary invitation templates.' }
const TEMPLATE_CATEGORY_BY_ROUTE: Record<string, string> = { baby: 'baby-shower', naming: 'naming-ceremony' }

function loadTemplates(): Template[] {
  const templates: Template[] = []
  for (const path of Object.keys(templateModules)) {
    if (path.endsWith('/example-template.json')) continue
    const result = validateTemplate(templateModules[path].default)
    if (result.valid) templates.push(templateModules[path].default as Template)
  }
  return templates
}

export default function InvitationCategoryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const category = location.pathname.split('/').pop() ?? 'birthday'
  const templates = useMemo(loadTemplates, [])
  const templateCategory = TEMPLATE_CATEGORY_BY_ROUTE[category] ?? category
  const filtered = useMemo(() => templates.filter((template) => (template.category ?? 'general') === templateCategory), [templates, templateCategory])
  const title = CATEGORY_TITLES[category] ?? 'Invitation Templates'
  const description = CATEGORY_DESCRIPTIONS[category] ?? 'Browse free invitation templates you can customize in your browser.'

  return (
    <div className="cmp-tool-shell">
      <div className="mb-8 max-w-3xl">
        <span className="cmp-eyebrow">Invitation Templates</span>
        <h1 className="cmp-tool-title mt-3">{title}</h1>
        <p className="cmp-tool-subtitle">{description}</p>
      </div>
      {filtered.length === 0 ? (
        <div className="cmp-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900">Templates are coming soon</h2>
          <p className="mt-2 text-sm text-slate-500">There are no published templates in this category yet.</p>
          <button type="button" className="cmp-primary-btn mt-5" onClick={() => navigate('/tools/invitation-maker')}>Browse all templates</button>
        </div>
      ) : (
        <TemplateGallery templates={filtered} onSelect={(template) => navigate(`/tools/invitation-maker?template=${encodeURIComponent(template.id)}`)} />
      )}
    </div>
  )
}
