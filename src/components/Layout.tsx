import { Outlet } from 'react-router'
import Header from './Header'
import AuthDialog from './AuthDialog'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AuthDialog />
    </div>
  )
}
