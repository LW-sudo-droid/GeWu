import { createContext, useContext } from 'react'

export type DemoUser = {
  name: string
  account: string
}

export type AppContextValue = {
  authOpen: boolean
  openAuth: () => void
  closeAuth: () => void
  user: DemoUser | null
  signIn: (user: DemoUser) => void
  signOut: () => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
