// "use client"
// import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
// import { useRouter } from "next/navigation"

// interface User {
//   id: string
//   username: string
//   email: string
//   avatar?: string
// }

// interface AuthContextType {
//   isAuthenticated: boolean
//   user: User | null
//   login: (username: string, email?: string) => void
//   logout: () => void
//   loading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     // Check auth status on mount
//     if (typeof window !== "undefined") {
//       const authStatus = localStorage.getItem("isAuthenticated") === "true"
//       const userData = localStorage.getItem("userData")

//       if (authStatus && userData) {
//         setIsAuthenticated(true)
//         setUser(JSON.parse(userData))
//       }
//       setLoading(false)
//     }
//   }, [])

//   const login = (username: string, email?: string) => {
//     const userData: User = {
//       id: Date.now().toString(),
//       username,
//       email: email || `${username}@umt.edu.pk`,
//       avatar: `/placeholder.svg?height=40&width=40`,
//     }

//     setIsAuthenticated(true)
//     setUser(userData)
//     localStorage.setItem("isAuthenticated", "true")
//     localStorage.setItem("userData", JSON.stringify(userData))
//     router.push("/dashboard")
//   }

//   const logout = () => {
//     setIsAuthenticated(false)
//     setUser(null)
//     localStorage.removeItem("isAuthenticated")
//     localStorage.removeItem("userData")
//     router.push("/")
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>{children}</AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  avatar?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
  updateUser: (userData: Partial<User>) => void
}

interface RegisterData {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check auth status on mount
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("access_token")
      const userData = localStorage.getItem("user")

      console.log("AuthProvider init - storedToken:", !!storedToken, "userData:", !!userData) // Debug log

      if (storedToken && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setIsAuthenticated(true)
          setUser(parsedUser)
          setToken(storedToken)
          console.log("Auth restored from localStorage:", parsedUser) // Debug log
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          // Clear invalid data
          localStorage.removeItem("access_token")
          localStorage.removeItem("user")
        }
      }
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      console.log("Attempting login for:", username) // Debug log

      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log("Login response:", data) // Debug log

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      if (data.success) {
        const userData: User = {
          ...data.user,
          avatar: `/placeholder.svg?height=40&width=40`,
        }

        setUser(userData)
        setToken(data.tokens.access)
        setIsAuthenticated(true)

        // Store in localStorage
        localStorage.setItem("access_token", data.tokens.access)
        localStorage.setItem("refresh_token", data.tokens.refresh)
        localStorage.setItem("user", JSON.stringify(userData))

        console.log("Login successful, user set:", userData) // Debug log
        router.push("/dashboard")
      } else {
        throw new Error(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      if (data.success) {
        const userDataWithAvatar: User = {
          ...data.user,
          avatar: `/placeholder.svg?height=40&width=40`,
        }

        setUser(userDataWithAvatar)
        setToken(data.tokens.access)
        setIsAuthenticated(true)

        // Store in localStorage
        localStorage.setItem("access_token", data.tokens.access)
        localStorage.setItem("refresh_token", data.tokens.refresh)
        localStorage.setItem("user", JSON.stringify(userDataWithAvatar))

        router.push("/dashboard")
      } else {
        throw new Error(data.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    console.log("Logging out user") // Debug log
    setIsAuthenticated(false)
    setUser(null)
    setToken(null)

    // Clear localStorage
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")

    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const contextValue = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    loading,
    updateUser,
  }

  console.log("AuthProvider context value:", { isAuthenticated, user: !!user, loading }) // Debug log

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
