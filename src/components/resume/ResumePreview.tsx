import type { ResumeData } from '../../lib/resume'

type ResumePreviewProps = {
  data: ResumeData
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const c = data.contact
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin]
    .filter(Boolean)
    .join(' | ')

  return (
    <div className="bg-white border rounded-lg p-8 shadow-sm text-gray-900">
      <header className="text-center border-b pb-4 mb-4">
        {c.fullName && <h2 className="text-2xl font-bold">{c.fullName}</h2>}
        {c.jobTitle && <p className="text-gray-600 mt-1">{c.jobTitle}</p>}
        {contactLine && <p className="text-sm text-gray-500 mt-2">{contactLine}</p>}
      </header>

      {data.summary && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">
            Professional Summary
          </h3>
          <p className="text-sm">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-2">
            Work Experience
          </h3>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <p className="font-medium text-sm">
                    {[exp.role, exp.company].filter(Boolean).join(' — ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {exp.current ? `${exp.startDate} — Present` : `${exp.startDate} — ${exp.endDate}`}
                  </p>
                </div>
                {exp.description && <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-2">
            Education
          </h3>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <p className="font-medium text-sm">
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {edu.startDate} — {edu.endDate}
                  </p>
                </div>
                {edu.school && <p className="text-sm text-gray-600">{edu.school}</p>}
                {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">
            Skills
          </h3>
          <p className="text-sm">{data.skills.join(', ')}</p>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-2">
            Projects
          </h3>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <p className="font-medium text-sm">{proj.name}</p>
                {proj.link && <p className="text-xs text-blue-700">{proj.link}</p>}
                {proj.description && <p className="text-sm mt-1">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">
            Certifications
          </h3>
          <ul className="text-sm space-y-1">
            {data.certifications.map((cert) => (
              <li key={cert.id}>
                {[cert.name, cert.issuer, cert.year].filter(Boolean).join(' — ')}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.achievements.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">
            Achievements
          </h3>
          <ul className="text-sm space-y-1">
            {data.achievements.map((ach) => (
              <li key={ach.id}>
                <span className="font-medium">{ach.title}</span>
                {ach.description && <span> — {ach.description}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">
            Languages
          </h3>
          <ul className="text-sm space-y-1">
            {data.languages.map((lang) => (
              <li key={lang.id}>
                {[lang.name, lang.proficiency].filter(Boolean).join(' — ')}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.customSections.map((section) => (
        <section key={section.id} className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700 mb-1">
            {section.title}
          </h3>
          <p className="text-sm whitespace-pre-line">{section.content}</p>
        </section>
      ))}
    </div>
  )
}