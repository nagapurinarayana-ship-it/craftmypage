import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { ResumeData } from './resume'

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = []
  const c = data.contact
  if (c.fullName) lines.push(c.fullName)
  if (c.jobTitle) lines.push(c.jobTitle)
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean).join(' | ')
  if (contactLine) lines.push(contactLine)
  lines.push('')
  if (data.summary) { lines.push('PROFESSIONAL SUMMARY', data.summary, '') }
  if (data.experience.length > 0) { lines.push('WORK EXPERIENCE'); for (const exp of data.experience) { lines.push([exp.role, exp.company].filter(Boolean).join(' — ')); const dates = exp.current ? `${exp.startDate} — Present` : `${exp.startDate} — ${exp.endDate}`; if (dates.trim() !== '—') lines.push(dates); if (exp.description) lines.push(exp.description); lines.push('') } }
  if (data.education.length > 0) { lines.push('EDUCATION'); for (const edu of data.education) { lines.push([edu.degree, edu.field].filter(Boolean).join(' in ')); if (edu.school) lines.push(edu.school); const dates = `${edu.startDate} — ${edu.endDate}`; if (dates.trim() !== '—') lines.push(dates); if (edu.description) lines.push(edu.description); lines.push('') } }
  if (data.skills.length > 0) lines.push('SKILLS', data.skills.join(', '), '')
  if (data.projects.length > 0) { lines.push('PROJECTS'); for (const proj of data.projects) { lines.push(proj.name); if (proj.link) lines.push(proj.link); if (proj.description) lines.push(proj.description); lines.push('') } }
  if (data.certifications.length > 0) { lines.push('CERTIFICATIONS'); for (const cert of data.certifications) lines.push([cert.name, cert.issuer, cert.year].filter(Boolean).join(' — ')); lines.push('') }
  if (data.achievements.length > 0) { lines.push('ACHIEVEMENTS'); for (const ach of data.achievements) { lines.push(ach.title); if (ach.description) lines.push(ach.description) } lines.push('') }
  if (data.languages.length > 0) { lines.push('LANGUAGES'); for (const lang of data.languages) lines.push([lang.name, lang.proficiency].filter(Boolean).join(' — ')); lines.push('') }
  for (const section of data.customSections) { if (section.title) lines.push(section.title.toUpperCase()); if (section.content) lines.push(section.content); lines.push('') }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export async function exportResumeToPdf(data: ResumeData): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // A4 portrait in PDF points.
  const pageWidth = 595
  const pageHeight = 842
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

  // Wrap by words and also split long unbroken tokens (URLs, long skill strings,
  // etc.) so exported PDFs never clip content outside the page.
  const wrapLine = (text: string, size: number, f: typeof font): string[] => {
    if (!text) return ['']
    const output: string[] = []
    let line = ''
    for (const word of text.split(/\s+/)) {
      if (!word) continue
      const candidate = line ? `${line} ${word}` : word
      if (f.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate
        continue
      }
      if (line) output.push(line)
      line = ''
      let chunk = ''
      for (const char of word) {
        const test = chunk + char
        if (f.widthOfTextAtSize(test, size) > maxWidth && chunk) {
          output.push(chunk)
          chunk = char
        } else chunk = test
      }
      line = chunk
    }
    if (line || output.length === 0) output.push(line)
    return output
  }

  const drawText = (text: string, size: number, bold = false, gap = lineHeight) => {
    const f = bold ? boldFont : font
    // Preserve user-entered Enter / Shift+Enter line breaks in the PDF.
    const paragraphs = String(text ?? '').replace(/\r\n?/g, '\n').split('\n')
    for (const paragraph of paragraphs) {
      const lines = wrapLine(paragraph, size, f)
      for (const line of lines) {
        ensureSpace(gap)
        if (line) page.drawText(line, { x: margin, y, size, font: f, color: rgb(0, 0, 0) })
        y -= gap
      }
    }
  }

  const drawSection = (title: string) => {
    ensureSpace(sectionGap + lineHeight + 10)
    y -= sectionGap
    page.drawText(title, { x: margin, y, size: 12, font: boldFont, color: rgb(0, 0, 0) })
    y -= lineHeight
    page.drawLine({
      start: { x: margin, y: y + 1 },
      end: { x: pageWidth - margin, y: y + 1 },
      thickness: 0.8,
      color: rgb(0.3, 0.3, 0.3),
    })
    y -= 8
  }

  const c = data.contact
  if (c.fullName) { drawText(c.fullName, 22, true, 24) }
  if (c.jobTitle) { drawText(c.jobTitle, 13, false, 18) }
  const contactLine = [c.email, c.phone, c.location, c.website, c.linkedin].filter(Boolean).join(' | ')
  if (contactLine) { drawText(contactLine, 10); y -= 6 }
  if (data.summary) { drawSection('PROFESSIONAL SUMMARY'); drawText(data.summary, 11) }
  if (data.experience.length > 0) { drawSection('WORK EXPERIENCE'); for (const exp of data.experience) { drawText([exp.role, exp.company].filter(Boolean).join(' — '), 11, true); const dates = exp.current ? `${exp.startDate} — Present` : `${exp.startDate} — ${exp.endDate}`; if (dates.trim() !== '—') drawText(dates, 10); if (exp.description) drawText(exp.description, 10); y -= 4 } }
  if (data.education.length > 0) { drawSection('EDUCATION'); for (const edu of data.education) { drawText([edu.degree, edu.field].filter(Boolean).join(' in '), 11, true); if (edu.school) drawText(edu.school, 10); const dates = `${edu.startDate} — ${edu.endDate}`; if (dates.trim() !== '—') drawText(dates, 10); if (edu.description) drawText(edu.description, 10); y -= 4 } }
  if (data.skills.length > 0) { drawSection('SKILLS'); drawText(data.skills.join(', '), 10) }
  if (data.projects.length > 0) { drawSection('PROJECTS'); for (const proj of data.projects) { drawText(proj.name, 11, true); if (proj.link) drawText(proj.link, 10); if (proj.description) drawText(proj.description, 10); y -= 4 } }
  if (data.certifications.length > 0) { drawSection('CERTIFICATIONS'); for (const cert of data.certifications) drawText([cert.name, cert.issuer, cert.year].filter(Boolean).join(' — '), 10) }
  if (data.achievements.length > 0) { drawSection('ACHIEVEMENTS'); for (const ach of data.achievements) { drawText(ach.title, 11, true); if (ach.description) drawText(ach.description, 10) } }
  if (data.languages.length > 0) { drawSection('LANGUAGES'); for (const lang of data.languages) drawText([lang.name, lang.proficiency].filter(Boolean).join(' — '), 10) }
  for (const section of data.customSections) { if (section.title) drawSection(section.title.toUpperCase()); if (section.content) drawText(section.content, 10) }

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
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
