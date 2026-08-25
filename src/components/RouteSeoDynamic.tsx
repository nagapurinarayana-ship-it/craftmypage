import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://craftmypage.pages.dev'

const titleize = (value: string) => value
  .split('-')
  .filter(Boolean)
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ')

function metadata(pathname: string) {
  const invoice = pathname.match(/^\/invoices\/([^/]+)$/)
  if (invoice) {
    const name = titleize(invoice[1])
    return {
      title: `${name} Invoice Template & Maker | CraftMyPage`,
      description: `Create a professional ${name.toLowerCase()} invoice in your browser with CraftMyPage. Customize the document and download your invoice PDF.`,
      canonical: `${SITE_URL}${pathname}`,
    }
  }

  const resume = pathname.match(/^\/resumes\/([^/]+)$/)
  if (resume) {
    const name = titleize(resume[1])
    return {
      title: `${name} Resume Template & Builder | CraftMyPage`,
      description: `Create a clean ${name.toLowerCase()} resume in your browser with CraftMyPage. Customize your content and download an A4 PDF.`,
      canonical: `${SITE_URL}${pathname}`,
    }
  }

  const invitation = pathname.match(/^\/invitations\/([^/]+)\/maker$/)
  if (invitation) {
    const name = titleize(invitation[1])
    return {
      title: `${name} Invitation Maker | Free Templates | CraftMyPage`,
      description: `Create and customize a ${name.toLowerCase()} invitation in your browser with CraftMyPage. Personalize the design and download or share it.`,
      canonical: `${SITE_URL}${pathname}`,
    }
  }

  return null
}

export default function RouteSeoDynamic() {
  const { pathname: rawPathname } = useLocation()
  const pathname = rawPathname === '/' ? '/' : rawPathname.replace(/\/+$/, '')
  const meta = metadata(pathname)
  if (!meta) return null

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="googlebot" content="index,follow" />
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="CraftMyPage" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={`${SITE_URL}/og-image.svg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.svg`} />
    </Helmet>
  )
}
