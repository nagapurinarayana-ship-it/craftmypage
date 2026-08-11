import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { ResumeData } from './resume'

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = []
  const c = data.contact

  if (c.fullName) lines.push(c.fullName)
  if (c.jobTitle) lines.push(c.jobTitle)
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin]
    .filter(Boolean)
    .join(' | ')
  if (contactLine) lines.push(contactLine)
  lines.push('')

  if (data.summary) {
    lines.push('PROFESSIONAL SUMMARY')
    lines.push(data.summary)
    lines.push('')
  }

  if (data.experience.length > 0) {
    lines.push('WORK EXPERIENCE')
    for (const exp of data.experience) {
      const header = [exp.role, exp.company].filter(Boolean).join(' — ')
      const dates = exp.current ? `${exp.startDate} — Present` : `${exp.startDate} — ${exp.endDate}`
      lines.push(header)
      if (dates.trim() !== '—') lines.push(dates)
      if (exp.description) lines.push(exp.description)
      lines.push('')
    }
  }

  if (data.education.length > 0) {
    lines.push('EDUCATION')
    for (const edu of data.education) {
      const header = [edu.degree, edu.field].filter(Boolean).join(' in ')
      lines.push(header)
      if (edu.school) lines.push(edu.school)
      const dates = `${edu.startDate} — ${edu.endDate}`
      if (dates.trim() !== '—') lines.push(dates)
      if (edu.description) lines.push(edu.description)
      lines.push('')
    }
  }

  if (data.skills.length > 0) {
    lines.push('SKILLS')
    lines.push(data.skills.join(', '))
    lines.push('')
  }

  if (data.projects.length > 0) {
    lines.push('PROJECTS')
    for (const proj of data.projects) {
      lines.push(proj.name)
      if (proj.link) lines.push(proj.link)
      if (proj.description) lines.push(proj.description)
      lines.push('')
    }
  }

  if (data.certifications.length > 0) {
    lines.push('CERTIFICATIONS')
    for (const cert of data.certifications) {
      lines.push([cert.name, cert.issuer, cert.year].filter(Boolean).join(' — '))
    }
    lines.push('')
  }

  if (data.achievements.length > 0) {
    lines.push('ACHIEVEMENTS')
    for (const ach of data.achievements) {
      lines.push(ach.title)
      if (ach.description) lines.push(ach.description)
    }
    lines.push('')
  }

  if (data.languages.length > 0) {
    lines.push('LANGUAGES')
    for (const lang of data.languages) {
      lines.push([lang.name, lang.proficiency].filter(Boolean).join(' — '))
    }
    lines.push('')
  }

  for (const section of data.customSections) {
    if (section.title) lines.push(section.title.toUpperCase())
    if (section.content) lines.push(section.content)
    lines.push('')
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export async function exportResumeToPdf(data: ResumeData): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const pageWidth = 612
  const pageHeight = 792
  const margin = 48
  const maxWidth = pageWidth - margin * 2
  const lineHeight = 13
  const sectionGap = 16

  let page = pdfDoc.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  const ensureSpace = (needed: number) => {
    if (y - needed < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight])
      y = pageHeight - margin
    }
  }

  const drawText = (text: string, size: number, bold = false, gap = lineHeight) => {
    const f = bold ? boldFont : font
    const words = text.split(' ')
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (f.widthOfTextAtSize(test, size) > maxWidth) {
        ensureSpace(gap)
        page.drawText(line, { x: margin, y, size, font: f, color: rgb(0, 0, 0) })
        y -= gap
        line = word
      } else {
        line = test
      }
    }
    if (line) {
      ensureSpace(gap)
      page.drawText(line, { x: margin, y, size, font: f, color: rgb(0, 0, 0) })
      y -= gap
    }
  }

  const drawSection = (title: string) => {
    ensureSpace(sectionGap + lineHeight)
    y -= sectionGap
    page.drawText(title, { x: margin, y, size: 12, font: boldFont, color: rgb(0, 0, 0) })
    y -= lineHeight
    page.drawLine({
      start: { x: margin, y: y + 4 },
      end: { x: pageWidth - margin, y: y + 4 },
      thickness: 0.8,
      color: rgb(0.3, 0.3, 0.3),
    })
  }

  const c = data.contact
  if (c.fullName) {
    page.drawText(c.fullName, { x: margin, y, size: 22, font: boldFont, color: rgb(0, 0, 0) })
    y -= 24
  }
  if (c.jobTitle) {
    page.drawText(c.jobTitle, { x: margin, y, size: 13, font: font, color: rgb(0.2, 0.2, 0.2) })
    y -= 18
  }
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin]
    .filter(Boolean)
    .join(' | ')
  if (contactLine) {
    drawText(contactLine, 10)
    y -= 6
  }

  if (data.summary) {
    drawSection('PROFESSIONAL SUMMARY')
    drawText(data.summary, 11)
  }

  if (data.experience.length > 0) {
    drawSection('WORK EXPERIENCE')
    for (const exp of data.experience) {
      const header = [exp.role, exp.company].filter(Boolean).join(' — ')
      drawText(header, 11, true)
      const dates = exp.current ? `${exp.startDate} — Present` : `${exp.startDate} — ${exp.endDate}`
      if (dates.trim() !== '—') drawText(dates, 10)
      if (exp.description) drawText(exp.description, 10)
      y -= 4
    }
  }

  if (data.education.length > 0) {
    drawSection('EDUCATION')
    for (const edu of data.education) {
      const header = [edu.degree, edu.field].filter(Boolean).join(' in ')
      drawText(header, 11, true)
      if (edu.school) drawText(edu.school, 10)
      const dates = `${edu.startDate} — ${edu.endDate}`
      if (dates.trim() !== '—') drawText(dates, 10)
      if (edu.description) drawText(edu.description, 10)
      y -= 4
    }
  }

  if (data.skills.length > 0) {
    drawSection('SKILLS')
    drawText(data.skills.join(', '), 10)
  }

  if (data.projects.length > 0) {
    drawSection('PROJECTS')
    for (const proj of data.projects) {
      drawText(proj.name, 11, true)
      if (proj.link) drawText(proj.link, 10)
      if (proj.description) drawText(proj.description, 10)
      y -= 4
    }
  }

  if (data.certifications.length > 0) {
    drawSection('CERTIFICATIONS')
    for (const cert of data.certifications) {
      drawText([cert.name, cert.issuer, cert.year].filter(Boolean).join(' — '), 10)
    }
  }

  if (data.achievements.length > 0) {
    drawSection('ACHIEVEMENTS')
    for (const ach of data.achievements) {
      drawText(ach.title, 11, true)
      if (ach.description) drawText(ach.description, 10)
    }
  }

  if (data.languages.length > 0) {
    drawSection('LANGUAGES')
    for (const lang of data.languages) {
      drawText([lang.name, lang.proficiency].filter(Boolean).join(' — '), 10)
    }
  }

  for (const section of data.customSections) {
    if (section.title) drawSection(section.title.toUpperCase())
    if (section.content) drawText(section.content, 10)
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

export function downloadTextFile(text: string, filename: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}