import { useState } from 'react'
import type { ResumeData } from '../../lib/resume'
import { createId } from '../../lib/resume'

type ResumeFormProps = {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  const [skillsInput, setSkillsInput] = useState(data.skills.join(', '))

  const updateContact = (field: keyof ResumeData['contact'], value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } })
  }

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        {
          id: createId('exp'),
          company: '',
          role: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    })
  }

  const updateExperience = (id: string, patch: Partial<ResumeData['experience'][number]>) => {
    onChange({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })
  }

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) })
  }

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          id: createId('edu'),
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    })
  }

  const updateEducation = (id: string, patch: Partial<ResumeData['education'][number]>) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })
  }

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) })
  }

  const commitSkills = (value: string) => {
    onChange({
      ...data,
      skills: value
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
    })
  }

  const updateSkills = (value: string) => {
    // Keep the raw text in local state so commas, Enter, and Shift+Enter are
    // not immediately removed while the user is typing.
    setSkillsInput(value)
    commitSkills(value)
  }

  return (
    <div className="space-y-6">
      <section className="border rounded-lg p-4 bg-white" aria-label="Contact details">
        <h2 className="font-semibold mb-3">Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full name" value={data.contact.fullName} onChange={(v) => updateContact('fullName', v)} />
          <Field label="Job title" value={data.contact.jobTitle} onChange={(v) => updateContact('jobTitle', v)} />
          <Field label="Email" type="email" value={data.contact.email} onChange={(v) => updateContact('email', v)} />
          <Field label="Phone" value={data.contact.phone} onChange={(v) => updateContact('phone', v)} />
          <Field label="Location" value={data.contact.location} onChange={(v) => updateContact('location', v)} />
          <Field label="Website" value={data.contact.website} onChange={(v) => updateContact('website', v)} />
          <Field label="LinkedIn" value={data.contact.linkedin} onChange={(v) => updateContact('linkedin', v)} />
        </div>
      </section>

      <section className="border rounded-lg p-4 bg-white" aria-label="Professional summary">
        <h2 className="font-semibold mb-3">Professional Summary</h2>
        <textarea
          className="w-full border rounded px-2 py-1.5 text-gray-900"
          rows={4}
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="Write a 2-4 sentence professional summary..."
        />
      </section>

      <section className="border rounded-lg p-4 bg-white" aria-label="Work experience">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Work Experience</h2>
          <button type="button" className="text-sm text-blue-700 hover:underline" onClick={addExperience}>
            + Add experience
          </button>
        </div>
        {data.experience.length === 0 && (
          <p className="text-sm text-gray-500">No experience added yet.</p>
        )}
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="border rounded p-3 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Role" value={exp.role} onChange={(v) => updateExperience(exp.id, { role: v })} />
                <Field label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
                <Field label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} />
                <div className="flex gap-2">
                  <Field label="Start" value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} />
                  <Field label="End" value={exp.endDate} disabled={exp.current} onChange={(v) => updateExperience(exp.id, { endDate: v })} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                />
                Currently working here
              </label>
              <textarea
                className="w-full border rounded px-2 py-1.5 text-gray-900"
                rows={3}
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                placeholder="Describe your role, achievements, and impact..."
              />
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() => removeExperience(exp.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4 bg-white" aria-label="Education">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Education</h2>
          <button type="button" className="text-sm text-blue-700 hover:underline" onClick={addEducation}>
            + Add education
          </button>
        </div>
        {data.education.length === 0 && (
          <p className="text-sm text-gray-500">No education added yet.</p>
        )}
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="border rounded p-3 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
                <Field label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
                <Field label="Field of study" value={edu.field} onChange={(v) => updateEducation(edu.id, { field: v })} />
                <div className="flex gap-2">
                  <Field label="Start" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
                  <Field label="End" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
                </div>
              </div>
              <textarea
                className="w-full border rounded px-2 py-1.5 text-gray-900"
                rows={2}
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                placeholder="Notes, GPA, relevant coursework..."
              />
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() => removeEducation(edu.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4 bg-white" aria-label="Skills">
        <h2 className="font-semibold mb-3">Skills</h2>
        <textarea
          className="w-full border rounded px-2 py-1.5 text-gray-900"
          rows={3}
          value={skillsInput}
          onChange={(e) => updateSkills(e.target.value)}
          onBlur={() => commitSkills(skillsInput)}
          placeholder="JavaScript, React, TypeScript, Node.js, SQL..."
          spellCheck={false}
        />
        <p className="text-xs text-gray-500 mt-1">Separate skills with commas or new lines. Enter and Shift+Enter work normally.</p>
      </section>
    </div>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  disabled?: boolean
}

function Field({ label, value, onChange, type = 'text', disabled }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        className="w-full border rounded px-2 py-1.5 text-gray-900 disabled:bg-gray-100"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
