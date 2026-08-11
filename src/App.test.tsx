import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders the home page at the root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', {
        name: 'Create free invitations, resumes and printable designs',
      })
    ).toBeTruthy()
    expect(screen.getByText('Create an Invitation')).toBeTruthy()
    expect(screen.getByText('Build a Resume')).toBeTruthy()
  })

  it('renders the Invitation Maker page', () => {
    render(
      <MemoryRouter initialEntries={['/invitation-maker']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Invitation Maker' })).toBeTruthy()
  })

  it('renders the Resume Builder page', () => {
    render(
      <MemoryRouter initialEntries={['/resume-builder']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Resume Builder' })).toBeTruthy()
  })
})