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
  it('renders the invoice-first home page at the root route', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Beautiful invoices, invitations and resumes without the complexity.' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Create an invoice' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Create an invitation' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Build a resume' })).toBeTruthy()
  })

  it('renders the Invitation Maker page', () => {
    renderApp('/invitation-maker')
    expect(screen.getByRole('heading', { name: 'Invitation Maker' })).toBeTruthy()
  })

  it('renders the Resume Builder page', () => {
    renderApp('/resume-builder')
    expect(screen.getByRole('heading', { name: 'Resume Builder' })).toBeTruthy()
  })

  it('renders the branded 404 page for unknown routes', () => {
    renderApp('/this-page-does-not-exist')
    expect(screen.getByRole('heading', { name: "We couldn't find that page." })).toBeTruthy()
  })
})
