import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { validateTemplate } from '../lib/template-validator'
import type { Template } from '../lib/template-validator'
import TemplateGallery from '../components/TemplateGallery'

const templateModules = import.meta.glob('../templates/*.json', { eager: true }) as Record<
  string,
  { default: unknown }
>

const CATEGORY_TITLES: Record<string, string> = {
  birthday: 'Birthday Invitations',
  wedding: 'Wedding Invitations',
  engagement: 'Engagement Invitations',
  baby: 'Baby Shower Invitations',
  housewarming: 'Housewarming Invitations',
  naming: 'Naming Ceremony Invitations',
  party: 'Party Invitations',
  anniversary: 'Anniversary Invitations',
  general: 'Invitation Templates',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  birthday: 'Celebrate in style with our birthday invitation templates.',
  wedding: 'Elegant wedding invitation templates for your special day.',
  engagement: 'Regal engagement invitations to announce your joy.',
  baby: 'Gentle and lovely baby shower invitation templates.',
  housewarming: 'Warm housewarming and Gruhapravesam invitation templates.',
  naming: 'Traditional and modern naming ceremony invitations.',
  party: 'Fun and vibrant party invitation templates.',
  anniversary: 'Romantic anniversary invitation templates.',
  general: 'Browse all invitation templates.',
}

function loadTemplates(): Template[] {
  const templates: Template[] = []
  for (const path of Object.keys(templateModules)) {
    const result = validateTemplate(templateModules[path].default)
    if (result.valid) templates.push(templateModules[path].default as Template)
  }
  return templates
}

export default function InvitationCategoryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const category = location.pathname.split('/').pop() ?? 'general'
  const templates = useMemo(loadTemplates, [])

  const filtered = useMemo(
    () => templates.filter((t) => (t.category ?? 'general') === category),
    [templates, category]
  )

  const title = CATEGORY_TITLES[category] ?? CATEGORY_TITLES.general
  const description = CATEGORY_DESCRIPTIONS[category] ?? CATEGORY_DESCRIPTIONS.general

  const handleSelect = (template: Template) => {
    navigate('/invitation-maker')
    setTimeout(() => {
      const event = new CustomEvent('select-template', { detail: { templateId: template.id } })
      window.dispatchEvent(event)
    }, 0)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">{description}</p>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No templates in this category yet. Coming soon!</p>
      ) : (
        <TemplateGallery templates={filtered} onSelect={handleSelect} />
      )}
    </div>
  )
}