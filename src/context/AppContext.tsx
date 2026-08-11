import { useMemo, useState, type ReactNode } from 'react'
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
  const [user, setUser] = useState<DemoUser | null>(loadStoredUser)
  const [favorites, setFavorites] = useState<FavoriteCorpus[]>(loadStoredFavorites)

  const value = useMemo<AppContextValue>(() => ({
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => setAuthOpen(false),
    user,
    favorites,
    toggleFavorite: (item) => {
      setFavorites((current) => {
        const next = current.some((favorite) => favorite.id === item.id)
          ? current.filter((favorite) => favorite.id !== item.id)
          : [...current, item]
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
        return next
      })
    },
    signIn: (nextUser) => {
      setUser(nextUser)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      setAuthOpen(false)
    },
    signOut: () => {
      setUser(null)
      window.localStorage.removeItem(STORAGE_KEY)
    },
  }), [authOpen, favorites, user])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
