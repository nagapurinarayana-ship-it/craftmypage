import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import RouteSeo from './RouteSeo'
import RouteSeoDynamic from './RouteSeoDynamic'
import EffectiveCpmHomeAds from './monetization/EffectiveCpmHomeAds'
import PopularSearches from './PopularSearches'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isInvoiceMaker = location.pathname === '/tools/invoice-maker'

  return (
    <div className={`min-h-screen flex flex-col font-sans text-gray-900 bg-white${isInvoiceMaker ? ' invoice-print-layout' : ''}`}>
      <RouteSeo />
      <RouteSeoDynamic />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <PopularSearches />
      {!isHome && (
        <div className="cmp-container py-10 sm:py-12">
          <EffectiveCpmHomeAds />
        </div>
      )}
      <Footer />
    </div>
  )
}
