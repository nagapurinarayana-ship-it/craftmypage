import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { validateTemplate } from '../lib/template-validator'
import type { Template } from '../lib/template-validator'
import TemplateGallery from '../components/TemplateGallery'

const templateModules = import.meta.glob('../templates/*.json', { eager: true }) as Record<string, { default: unknown }>

const CATEGORY_TITLES: Record<string, string> = {
  birthday: 'Birthday Invitations',
  wedding: 'Wedding Invitations',
  engagement: 'Engagement Invitations',
  baby: 'Baby Shower Invitations',
  housewarming: 'Housewarming Invitations',
  naming: 'Naming Ceremony Invitations',
  party: 'Party Invitations',
  anniversary: 'Anniversary Invitations',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  birthday: 'Create a birthday invitation that is easy to personalize and share with friends and family.',
  wedding: 'Create an elegant wedding invitation with the date, venue, names and celebration details your guests need.',
  engagement: 'Create a polished engagement invitation to announce your celebration and share the important details.',
  baby: 'Create a warm baby shower invitation with the celebration details, timing and location your guests need.',
  housewarming: 'Create a welcoming housewarming or Gruhapravesam invitation for family and friends.',
  naming: 'Create a thoughtful naming ceremony invitation with traditional or modern wording for your celebration.',
  party: 'Create a fun party invitation with clear event details and a design that matches the occasion.',
  anniversary: 'Create a memorable anniversary invitation with your celebration details and a personal touch.',
}

const CATEGORY_TIPS: Record<string, string[]> = {
  birthday: ['Include the guest of honor, date, time and venue.', 'Use a design that matches the age and style of the celebration.', 'Keep the final invitation easy to read on a phone before sharing it.'],
  wedding: ['Include both names, ceremony or reception details, date, time and venue.', 'Keep the most important details visually prominent.', 'Check names, dates and venue information carefully before sharing.'],
  engagement: ['Include both names, date, time and venue.', 'Choose a design that fits the formality of the celebration.', 'Review the invitation on a phone so guests can read it easily.'],
  baby: ['Include the parents-to-be, date, time and venue.', 'Mention any useful RSVP or gift information when appropriate.', 'Choose a gentle, readable design that works well for mobile sharing.'],
  housewarming: ['Include the family or hosts, date, time and address.', 'For Gruhapravesam events, include the ceremony details guests need.', 'Double-check the address and timing before sending the invitation.'],
  naming: ['Include the baby name if it is being announced, along with date, time and venue.', 'Add ceremony or family details when they help guests plan.', 'Use readable wording that works for both mobile sharing and printing.'],
  party: ['Include the occasion, date, time, venue and RSVP details if needed.', 'Match the visual style to the party rather than overcrowding the design.', 'Keep the event information short and easy to scan.'],
  anniversary: ['Include the couple or honorees, date, time and venue.', 'Choose a style that matches the tone of the celebration.', 'Proofread names and dates before sharing the final invitation.'],
}

const CATEGORY_GUIDES: Record<string, { path: string; label: string }> = {
  birthday: { path: '/guides/birthday-invitation-whatsapp', label: 'Birthday invitation sharing tips' },
  wedding: { path: '/guides/wedding-invitation-wording', label: 'Wedding invitation wording guide' },
  housewarming: { path: '/guides/housewarming-invitation-wording', label: 'Housewarming invitation wording guide' },
  naming: { path: '/guides/naming-ceremony-invitation', label: 'Naming ceremony invitation guide' },
  baby: { path: '/guides/invitation-details', label: 'Invitation details checklist' },
  engagement: { path: '/guides/invitation-details', label: 'Invitation details checklist' },
  party: { path: '/guides/invitation-details', label: 'Invitation details checklist' },
  anniversary: { path: '/guides/invitation-details', label: 'Invitation details checklist' },
}

const TEMPLATE_CATEGORY_BY_ROUTE: Record<string, string> = { baby: 'baby-shower', naming: 'naming-ceremony' }
const RELATED_CATEGORIES = ['birthday', 'wedding', 'engagement', 'baby', 'housewarming', 'naming', 'party', 'anniversary']

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
  const tips = CATEGORY_TIPS[category] ?? ['Add the event name, date, time and venue.', 'Choose a layout that is easy to read on a phone.', 'Proofread the final details before sharing.']
  const guide = CATEGORY_GUIDES[category] ?? CATEGORY_GUIDES.birthday
  const relatedCategories = RELATED_CATEGORIES.filter((item) => item !== category)
  const makerPath = CATEGORY_TITLES[category] ? `/invitations/${category}/maker` : '/tools/invitation-maker'

  return (
    <div className="cmp-tool-shell">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500">
        <Link to="/tools/invitation-maker" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">Invitation Maker</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span aria-current="page">{title}</span>
      </nav>

      <div className="mb-8 max-w-3xl">
        <span className="cmp-eyebrow">Invitation Templates</span>
        <h1 className="cmp-tool-title mt-3">{title}</h1>
        <p className="cmp-tool-subtitle">{description}</p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Start with a template, personalize the wording and details in the CraftMyPage invitation maker, then prepare the finished invitation for sharing or printing.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={makerPath} className="cmp-primary-btn">Create a {title.replace(/ Invitations$/, '')} invitation</Link>
          <Link to={guide.path} className="cmp-secondary-btn">{guide.label}</Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="cmp-surface p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900">Templates are coming soon</h2>
          <p className="mt-2 text-sm text-slate-500">There are no published templates in this category yet. You can still browse the full invitation maker.</p>
          <Link to="/tools/invitation-maker" className="cmp-primary-btn mt-5">Browse all templates</Link>
        </div>
      ) : (
        <TemplateGallery templates={filtered} onSelect={(template) => navigate(`/tools/invitation-maker?template=${encodeURIComponent(template.id)}`)} />
      )}

      <section className="mt-10 cmp-surface p-6 sm:p-8" aria-labelledby="invitation-tips-heading">
        <h2 id="invitation-tips-heading" className="text-xl font-bold text-slate-900">{title}: what to include</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">A good invitation should make the event easy to understand at a glance. These are the most useful details to check before you share it.</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {tips.map((tip) => <li key={tip} className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">{tip}</li>)}
        </ul>
      </section>

      <section className="mt-8 cmp-surface p-6 sm:p-8" aria-labelledby="related-invitations-heading">
        <h2 id="related-invitations-heading" className="text-xl font-bold text-slate-900">Explore more invitation templates</h2>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
          {relatedCategories.map((item) => <Link key={item} to={`/invitations/${item}`} className="text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950">{CATEGORY_TITLES[item]}</Link>)}
        </div>
      </section>
    </div>
  )
}
