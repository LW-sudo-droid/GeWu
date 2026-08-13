import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AppContext, type AppContextValue, type DemoUser, type FavoriteCorpus } from './app-context'

const STORAGE_KEY = 'gewuyuku-demo-user'
const FAVORITES_KEY = 'gewuyuku-favorite-corpora'
function loadStoredUser(): DemoUser | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? (JSON.parse(value) as DemoUser) : null
  } catch {
    return null
  }
}

function loadStoredFavorites(): FavoriteCorpus[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false)
  const [authReturnTo, setAuthReturnTo] = useState<string | null>(null)
  const [user, setUser] = useState<DemoUser | null>(loadStoredUser)
  const [favorites, setFavorites] = useState<FavoriteCorpus[]>(loadStoredFavorites)

  const openAuth = useCallback((returnTo?: string) => {
    setAuthReturnTo(returnTo ?? null)
    setAuthOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setAuthOpen(false)
    setAuthReturnTo(null)
  }, [])

  const toggleFavorite = useCallback((item: FavoriteCorpus) => {
    setFavorites((current) => {
      const next = current.some((favorite) => favorite.id === item.id)
        ? current.filter((favorite) => favorite.id !== item.id)
        : [...current, item]
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const signIn = useCallback((nextUser: DemoUser) => {
    setUser(nextUser)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    setAuthOpen(false)
    setAuthReturnTo(null)
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo<AppContextValue>(() => ({
    authOpen,
    authReturnTo,
    openAuth,
    closeAuth,
    user,
    favorites,
    toggleFavorite,
    signIn,
    signOut,
  }), [authOpen, authReturnTo, closeAuth, favorites, openAuth, signIn, signOut, toggleFavorite, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
