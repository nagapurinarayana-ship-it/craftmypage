import { describe, expect, it } from 'vitest'
import { resumeToPlainText } from './resume-export'
import type { ResumeData } from './resume'

const sampleData: ResumeData = {
  contact: {
    fullName: 'Aarav Sharma',
    jobTitle: 'Software Engineer',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad',
    website: 'aarav.dev',
    linkedin: 'linkedin.com/in/aarav',
  },
  summary: 'Experienced software engineer specializing in web applications.',
  experience: [
    {
      id: 'exp1',
      company: 'Tech Corp',
      role: 'Senior Developer',
      location: 'Hyderabad',
      startDate: '2021',
      endDate: '2024',
      current: false,
      description: 'Built scalable web applications.',
    },
    {
      id: 'exp2',
      company: 'Startup Inc',
      role: 'Developer',
      location: 'Remote',
      startDate: '2019',
      endDate: '',
      current: true,
      description: 'Developed features and fixed bugs.',
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'IIT',
      degree: 'B.Tech',
      field: 'Computer Science',
      startDate: '2015',
      endDate: '2019',
      description: 'Graduated with honors.',
    },
  ],
  skills: ['JavaScript', 'React', 'TypeScript'],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  customSections: [],
}

describe('resumeToPlainText', () => {
  it('includes contact details', () => {
    const text = resumeToPlainText(sampleData)
    expect(text).toContain('Aarav Sharma')
    expect(text).toContain('Software Engineer')
    expect(text).toContain('aarav@example.com')
    expect(text).toContain('+91 98765 43210')
  })

  it('includes summary', () => {
    const text = resumeToPlainText(sampleData)
    expect(text).toContain('PROFESSIONAL SUMMARY')
    expect(text).toContain('Experienced software engineer')
  })

  it('includes experience with current role marked Present', () => {
    const text = resumeToPlainText(sampleData)
    expect(text).toContain('Senior Developer — Tech Corp')
    expect(text).toContain('2021 — 2024')
    expect(text).toContain('Developer — Startup Inc')
    expect(text).toContain('2019 — Present')
  })

  it('includes education and skills', () => {
    const text = resumeToPlainText(sampleData)
    expect(text).toContain('B.Tech in Computer Science')
    expect(text).toContain('IIT')
    expect(text).toContain('JavaScript, React, TypeScript')
  })

  it('produces selectable text (not empty)', () => {
    const text = resumeToPlainText(sampleData)
    expect(text.length).toBeGreaterThan(100)
  })
})