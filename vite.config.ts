import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !/ResumeBuilderPage-|PDFButton-/.test(dep)),
    },
  },
})
