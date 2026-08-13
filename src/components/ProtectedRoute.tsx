import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useApp } from '../context/app-context'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, openAuth } = useApp()
  const location = useLocation()

  useEffect(() => {
    if (!user) openAuth(`${location.pathname}${location.search}`)
  }, [location.pathname, location.search, openAuth, user])

  if (!user) return <div className="protected-route-screen" aria-label="该页面需要登录后查看" />
  return children
}
