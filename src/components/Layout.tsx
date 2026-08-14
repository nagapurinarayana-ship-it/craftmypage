import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import RouteSeo from './RouteSeo'
import RouteSeoDynamic from './RouteSeoDynamic'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <RouteSeo />
      <RouteSeoDynamic />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
