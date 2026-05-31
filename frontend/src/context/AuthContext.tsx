import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  email: string
  role: 'admin' | 'user'
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Hardcoded users for now (will replace with Keycloak in JFS-004)
const USERS = [
  { email: 'admin@shopease.com', password: 'admin123', role: 'admin' as const, name: 'Admin' },
  { email: 'harshada@nextafield.com', password: 'user123', role: 'user' as const, name: 'Harshada' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shopease_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email: string, password: string): boolean => {
    const found = USERS.find(
      u => u.email === email && u.password === password
    )
    if (found) {
      const userData = {
        email: found.email,
        role: found.role,
        name: found.name
      }
      setUser(userData)
      localStorage.setItem('shopease_user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('shopease_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}