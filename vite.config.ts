import { defineConfig } from 'vite'

function manualChunk(id: string): string | undefined {
  if (!id.includes('/node_modules/')) return undefined

  if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react'
  if (id.includes('/react-router/') || id.includes('/react-router-dom/')) return 'vendor-routing'
  if (id.includes('/react-helmet-async/')) return 'vendor-head'
  if (id.includes('/konva/') || id.includes('/react-konva/')) return 'vendor-canvas'
  if (id.includes('/pdf-lib/')) return 'vendor-pdf'

  return undefined
}

export default defineConfig({
  base: '/',
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !/ResumeBuilderPage-|PDFButton-/.test(dep)),
    },
    rollupOptions: {
      output: {
        manualChunks: manualChunk,
      },
    },
  },
})
