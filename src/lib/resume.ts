export type ResumeSectionKey =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'custom'

export type ContactInfo = {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
}

export type ExperienceEntry = {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export type EducationEntry = {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

export type ProjectEntry = {
  id: string
  name: string
  link: string
  description: string
}

export type CertificationEntry = {
  id: string
  name: string
  issuer: string
  year: string
}

export type AchievementEntry = {
  id: string
  title: string
  description: string
}

export type LanguageEntry = {
  id: string
  name: string
  proficiency: string
}

export type CustomSection = {
  id: string
  title: string
  content: string
}

export type ResumeData = {
  contact: ContactInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  achievements: AchievementEntry[]
  languages: LanguageEntry[]
  customSections: CustomSection[]
}

export type ResumeTemplateId =
  | 'ats-classic'
  | 'ats-modern'
  | 'software-engineer'
  | 'experienced-professional'
  | 'student-fresher'
  | 'minimal-one-page'
  | 'two-page-professional'
  | 'academic-cv'

export type ResumeProject = {
  id: string
  name: string
  templateId: ResumeTemplateId
  data: ResumeData
  createdAt: number
  updatedAt: number
}

export function createEmptyResumeData(): ResumeData {
  return {
    contact: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    customSections: [],
  }
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}