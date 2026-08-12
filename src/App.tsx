import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePageInvoiceFirst'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

const InvitationMakerPage = lazy(() => import('./pages/InvitationMakerPage'))
const InvoiceMakerPage = lazy(() => import('./pages/InvoiceMakerPage'))
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage'))
const InvoiceLandingPage = lazy(() => import('./pages/InvoiceLandingPage'))
const InvoiceGuidePage = lazy(() => import('./pages/InvoiceGuidePage'))
const GuidesPage = lazy(() => import('./pages/GuidesPage'))
const GuidePage = lazy(() => import('./pages/GuidePage'))
const InvitationCategoryPage = lazy(() => import('./pages/InvitationCategoryPage'))

function RouteFallback() {
  return <div className="cmp-tool-shell p-8 text-center text-slate-500" role="status" aria-live="polite">Loading…</div>
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools/invitation-maker" element={<InvitationMakerPage />} />
          <Route path="/tools/invoice-maker" element={<InvoiceMakerPage />} />
          <Route path="/tools/resume-builder" element={<ResumeBuilderPage />} />
          <Route path="/invoices/:intent" element={<InvoiceLandingPage />} />
          <Route path="/invitations/:category" element={<InvitationCategoryPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/guides/how-to-create-an-invoice" element={<InvoiceGuidePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/invitation-maker" element={<Navigate to="/tools/invitation-maker" replace />} />
          <Route path="/resume-builder" element={<Navigate to="/tools/resume-builder" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
