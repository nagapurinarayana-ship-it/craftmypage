import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderApp(initialEntry: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('App', () => {
  it('renders the invoice-first home page at the root route', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { name: 'Beautiful invoices, invitations and resumes without the complexity.' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Create an invoice' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Create an invitation' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Build a resume' })).toBeTruthy()
  })

  it('renders the Invitation Maker page', async () => {
    renderApp('/invitation-maker')
    expect(await screen.findByRole('heading', { name: 'Create an invitation you are proud to send.' })).toBeTruthy()
  })

  it('renders the Resume Builder page', async () => {
    renderApp('/resume-builder')
    expect(await screen.findByRole('heading', { name: 'Build a resume that looks polished and stays practical.' })).toBeTruthy()
  })

  it('renders the branded 404 page for unknown routes', async () => {
    renderApp('/this-page-does-not-exist')
    expect(await screen.findByRole('heading', { name: "We couldn't find that page." })).toBeTruthy()
  })
})
