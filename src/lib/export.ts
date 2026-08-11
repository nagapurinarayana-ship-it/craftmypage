import type Konva from 'konva'
import { PDFDocument, StandardFonts } from 'pdf-lib'

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function exportStageToPng(stage: Konva.Stage, pixelRatio = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const dataUrl = stage.toDataURL({ pixelRatio })
    fetch(dataUrl)
      .then((res) => res.blob())
      .then(resolve)
      .catch(reject)
  })
}

export function downloadPng(stage: Konva.Stage, baseName: string): void {
  exportStageToPng(stage).then((blob) => {
    downloadBlob(blob, `${sanitizeFilename(baseName)}.png`)
  })
}

export function standardFilename(baseName: string, purpose = ''): string {
  const cleaned = sanitizeFilename(baseName)
  return purpose ? `${cleaned}-${purpose}` : cleaned
}

function sanitizeFilename(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return cleaned || 'craftmypage'
}

export async function exportToPdf(
  stage: Konva.Stage,
  options: { filename?: string; title?: string } = {}
): Promise<Blob> {
  const { title = 'Invitation' } = options

  const width = stage.width()
  const height = stage.height()

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([width, height])

  // Add a selectable title text (keeps PDF text-based, not screenshot-only)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontSize = Math.min(18, Math.max(10, Math.round(width / 100)))
  page.drawText(title, {
    x: 24,
    y: height - 40,
    size: fontSize,
    font: helvetica,
  })

  // Embed the canvas as a full-page image
  const pngBlob = await exportStageToPng(stage, 2)
  const pngBytes = await pngBlob.arrayBuffer()
  const pngImage = await pdfDoc.embedPng(pngBytes)
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width,
    height,
  })

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes.buffer], { type: 'application/pdf' })
}

export function downloadPdf(
  stage: Konva.Stage,
  options: { filename?: string; title?: string } = {}
): void {
  exportToPdf(stage, options).then((blob) => {
    downloadBlob(blob, `${sanitizeFilename(options.filename ?? 'invitation')}.pdf`)
  })
}