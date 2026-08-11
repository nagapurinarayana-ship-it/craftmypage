import { Route, Routes, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import InvitationMakerPage from './pages/InvitationMakerPage'
import InvoiceMakerPage from './pages/InvoiceMakerPage'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import InvoiceGuidePage from './pages/InvoiceGuidePage'
import GuidesPage from './pages/GuidesPage'
import GuidePage from './pages/GuidePage'
import InvitationCategoryPage from './pages/InvitationCategoryPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools/invitation-maker" element={<InvitationMakerPage />} />
        <Route path="/tools/invoice-maker" element={<InvoiceMakerPage />} />
        <Route path="/tools/resume-builder" element={<ResumeBuilderPage />} />
        <Route path="/invitations/:category" element={<InvitationCategoryPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/guides/:slug" element={<GuidePage />} />
        <Route path="/guides/how-to-create-an-invoice" element={<InvoiceGuidePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* Backward compatibility redirects */}
        <Route path="/invitation-maker" element={<Navigate to="/tools/invitation-maker" replace />} />
        <Route path="/resume-builder" element={<Navigate to="/tools/resume-builder" replace />} />
      </Route>
    </Routes>
  )
}