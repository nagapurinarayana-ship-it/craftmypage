import type Konva from 'konva'

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function exportStageToPng(stage: Konva.Stage, pixelRatio = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // The editor Stage is visually scaled (for example 0.4x for the
      // on-screen preview). Konva's export uses the Stage's transform too,
      // so exporting directly would place the invitation in only 40% of the
      // downloaded canvas, leaving the rest blank. Temporarily reset the
      // Stage transform for a true full-canvas export, then restore it.
      const scaleX = stage.scaleX()
      const scaleY = stage.scaleY()
      const x = stage.x()
      const y = stage.y()

      stage.scale({ x: 1, y: 1 })
      stage.position({ x: 0, y: 0 })
      stage.draw()

      const dataUrl = stage.toDataURL({ pixelRatio })

      stage.scale({ x: scaleX, y: scaleY })
      stage.position({ x, y })
      stage.draw()

      fetch(dataUrl).then((res) => res.blob()).then(resolve).catch(reject)
    } catch (error) {
      reject(error)
    }
  })
}

export function downloadPng(stage: Konva.Stage, baseName: string): void {
  exportStageToPng(stage).then((blob) => downloadBlob(blob, `${sanitizeFilename(baseName)}.png`))
}

export function standardFilename(baseName: string, purpose = ''): string {
  const cleaned = sanitizeFilename(baseName)
  return purpose ? `${cleaned}-${purpose}` : cleaned
}

function sanitizeFilename(value: string): string {
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return cleaned || 'craftmypage'
}

export async function exportToPdf(
  stage: Konva.Stage,
  options: { filename?: string; title?: string } = {},
): Promise<Blob> {
  void options
  const { PDFDocument } = await import('pdf-lib')
  const width = stage.width()
  const height = stage.height()
  const pageWidth = 595
  const pageHeight = 842
  const scale = Math.min(pageWidth / width, pageHeight / height)
  const renderedWidth = width * scale
  const renderedHeight = height * scale
  const offsetX = (pageWidth - renderedWidth) / 2
  const offsetY = (pageHeight - renderedHeight) / 2

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([pageWidth, pageHeight])
  const pngBlob = await exportStageToPng(stage, 2)
  const pngBytes = await pngBlob.arrayBuffer()
  const pngImage = await pdfDoc.embedPng(pngBytes)

  page.drawImage(pngImage, { x: offsetX, y: offsetY, width: renderedWidth, height: renderedHeight })

  const pdfBytes = await pdfDoc.save()
  const pdfArrayBuffer = new ArrayBuffer(pdfBytes.byteLength)
  new Uint8Array(pdfArrayBuffer).set(pdfBytes)
  return new Blob([pdfArrayBuffer], { type: 'application/pdf' })
}

export function downloadPdf(stage: Konva.Stage, options: { filename?: string; title?: string } = {}): void {
  exportToPdf(stage, options).then((blob) => downloadBlob(blob, `${sanitizeFilename(options.filename ?? 'invitation')}.pdf`))
}
