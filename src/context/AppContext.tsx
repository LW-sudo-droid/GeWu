import { useMemo, useState, type ReactNode } from 'react'
import { AppContext, type AppContextValue, type DemoUser } from './app-context'

const STORAGE_KEY = 'gewuyuku-demo-user'
function loadStoredUser(): DemoUser | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? (JSON.parse(value) as DemoUser) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState<DemoUser | null>(loadStoredUser)

  const value = useMemo<AppContextValue>(() => ({
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => setAuthOpen(false),
    user,
    signIn: (nextUser) => {
      setUser(nextUser)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      setAuthOpen(false)
    },
    signOut: () => {
      setUser(null)
      window.localStorage.removeItem(STORAGE_KEY)
    },
  }), [authOpen, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
