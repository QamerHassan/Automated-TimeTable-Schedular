// "use client"

// import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
// import { useRouter } from "next/navigation"

// interface User {
//   id: number
//   username: string
//   email: string
//   first_name: string
//   last_name: string
//   avatar?: string
// }

// interface AuthContextType {
//   isAuthenticated: boolean
//   user: User | null
//   token: string | null
//   login: (username: string, password: string) => Promise<void>
//   register: (userData: RegisterData) => Promise<void>
//   logout: () => void
//   loading: boolean
//   updateUser: (userData: Partial<User>) => void
//   refreshToken: () => Promise<void>
// }

// interface RegisterData {
//   username: string
//   email: string
//   password: string
//   first_name?: string
//   last_name?: string
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [user, setUser] = useState<User | null>(null)
//   const [token, setToken] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     const initializeAuth = async () => {
//       if (typeof window === "undefined") return

//       try {
//         const storedToken = localStorage.getItem("access_token")
//         const storedRefresh = localStorage.getItem("refresh_token")
//         const userData = localStorage.getItem("user")
//         const authFlag = localStorage.getItem("isAuthenticated")

//         console.log("InitializeAuth - checking stored data:", {
//           hasToken: !!storedToken,
//           hasRefresh: !!storedRefresh,
//           hasUserData: !!userData,
//           authFlag
//         })

//         if (storedToken && storedRefresh && userData && authFlag === "true") {
//           try {
//             // Validate token by making a test API call instead of refreshing immediately
//             const response = await fetch("http://localhost:8000/api/auth/profile/", {
//               method: "GET",
//               headers: {
//                 "Authorization": `Bearer ${storedToken}`,
//                 "Content-Type": "application/json",
//               },
//             })

//             if (response.ok) {
//               // Token is valid, restore session
//               const parsedUser = JSON.parse(userData)
//               setUser(parsedUser)
//               setToken(storedToken)
//               setIsAuthenticated(true)
//               console.log("Session restored successfully")
//             } else if (response.status === 401) {
//               // Token expired, try refresh
//               console.log("Token expired, attempting refresh...")
//               await attemptTokenRefresh(storedRefresh)
//             } else {
//               // Other error, clear session
//               clearAuthData()
//             }
//           } catch (error) {
//             console.error("Token validation failed:", error)
//             // Try refresh as fallback
//             try {
//               await attemptTokenRefresh(storedRefresh)
//             } catch (refreshError) {
//               console.error("Refresh also failed, clearing session")
//               clearAuthData()
//             }
//           }
//         } else {
//           console.log("No valid auth data found")
//           clearAuthData()
//         }
//       } catch (error) {
//         console.error("Error initializing auth:", error)
//         clearAuthData()
//       } finally {
//         setLoading(false)
//       }
//     }

//     const attemptTokenRefresh = async (refreshToken: string) => {
//       const response = await fetch("http://localhost:8000/api/auth/token/refresh/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         const userData = localStorage.getItem("user")
        
//         if (userData) {
//           const parsedUser = JSON.parse(userData)
//           setUser(parsedUser)
//           setToken(data.access)
//           setIsAuthenticated(true)
//           localStorage.setItem("access_token", data.access)
//           console.log("Token refreshed successfully")
//         }
//       } else {
//         throw new Error("Refresh token invalid")
//       }
//     }

//     const clearAuthData = () => {
//       setIsAuthenticated(false)
//       setUser(null)
//       setToken(null)
//       localStorage.removeItem("access_token")
//       localStorage.removeItem("refresh_token")
//       localStorage.removeItem("user")
//       localStorage.removeItem("isAuthenticated")
//       localStorage.removeItem("userData")
//     }

//     initializeAuth()
//   }, []) // Remove router dependency to prevent loops

//   const login = async (username: string, password: string) => {
//     try {
//       const response = await fetch("http://localhost:8000/api/auth/login/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Login failed")
//       }

//       if (data.success) {
//         const userData: User = {
//           ...data.user,
//           avatar: `/placeholder.svg?height=40&width=40`,
//         }

//         setUser(userData)
//         setToken(data.tokens.access)
//         setIsAuthenticated(true)

//         localStorage.setItem("access_token", data.tokens.access)
//         localStorage.setItem("refresh_token", data.tokens.refresh)
//         localStorage.setItem("user", JSON.stringify(userData))
//         localStorage.setItem("isAuthenticated", "true")

//         console.log("Login successful, redirecting to dashboard")
//         router.push("/dashboard")
//       } else {
//         throw new Error(data.error || "Login failed")
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       throw error
//     }
//   }

//   const register = async (userData: RegisterData) => {
//     try {
//       const response = await fetch("http://localhost:8000/api/auth/register/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         // Enhanced error handling with specific messages
//         if (response.status === 400) {
//           if (data.username || data.error?.includes('username')) {
//             throw new Error("Username already exists. Please choose a different username.")
//           }
//           if (data.email || data.error?.includes('email')) {
//             throw new Error("Email already exists. Please use a different email address.")
//           }
//           if (data.password || data.error?.includes('password')) {
//             throw new Error("Password is too weak. Please use a stronger password.")
//           }
//           // Generic 400 error
//           throw new Error(data.error || "Invalid registration data. Please check your information.")
//         }
//         throw new Error(data.error || "Registration failed")
//       }

//       if (data.success) {
//         const userDataWithAvatar: User = {
//           ...data.user,
//           avatar: `/placeholder.svg?height=40&width=40`,
//         }

//         setUser(userDataWithAvatar)
//         setToken(data.tokens.access)
//         setIsAuthenticated(true)

//         localStorage.setItem("access_token", data.tokens.access)
//         localStorage.setItem("refresh_token", data.tokens.refresh)
//         localStorage.setItem("user", JSON.stringify(userDataWithAvatar))
//         localStorage.setItem("isAuthenticated", "true")

//         console.log("Registration successful, redirecting to dashboard")
//         router.push("/dashboard")
//       } else {
//         throw new Error(data.error || "Registration failed")
//       }
//     } catch (error) {
//       console.error("Registration error:", error)
//       throw error
//     }
//   }

//   const logout = () => {
//     console.log("Logging out user")
//     setIsAuthenticated(false)
//     setUser(null)
//     setToken(null)

//     // Clear all related localStorage keys
//     localStorage.removeItem("access_token")
//     localStorage.removeItem("refresh_token")
//     localStorage.removeItem("user")
//     localStorage.removeItem("isAuthenticated")
//     localStorage.removeItem("userData")

//     // Navigate to home without forcing a refresh
//     router.push("/")
//   }

//   const refreshToken = async () => {
//     try {
//       const refresh = localStorage.getItem("refresh_token")
//       if (!refresh) throw new Error("No refresh token")

//       const response = await fetch("http://localhost:8000/api/auth/token/refresh/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refresh }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Token refresh failed")
//       }

//       setToken(data.access)
//       localStorage.setItem("access_token", data.access)
//       console.log("Token refreshed successfully")
//     } catch (error) {
//       console.error("Token refresh error:", error)
//       // Don't auto-logout here to prevent loops
//       throw error
//     }
//   }

//   const updateUser = (userData: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...userData }
//       setUser(updatedUser)
//       localStorage.setItem("user", JSON.stringify(updatedUser))
//     }
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         user,
//         token,
//         login,
//         register,
//         logout,
//         loading,
//         updateUser,
//         refreshToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
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

interface User { id:number; username:string; email:string; first_name:string; last_name:string; avatar?:string }
interface RegisterData { username:string; email:string; password:string; first_name?:string; last_name?:string }
interface AuthContextType {
  isAuthenticated:boolean; user:User|null; token:string|null; loading:boolean
  login:(u:string,p:string)=>Promise<void>; register:(d:RegisterData)=>Promise<void>
  logout:()=>void; refreshToken:()=>Promise<void>; updateUser:(d:Partial<User>)=>void
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children:ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser]                 = useState<User|null>(null)
  const [token, setToken]               = useState<string|null>(null)
  const [loading, setLoading]           = useState(true)
  const router = useRouter()

  /* ---------- SESSION RESTORE ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return
    const boot = async () => {
      const access  = localStorage.getItem("access_token")
      const refresh = localStorage.getItem("refresh_token")
      const cached  = localStorage.getItem("user")
      if (!access || !refresh || !cached) { setLoading(false); return }

      try {
        /* 1️⃣ probe profile with current access token */
        const r = await fetch("http://localhost:8000/api/auth/profile/",{
          headers:{ Authorization:`Bearer ${access}` }
        })
        if (r.ok) {
          setUser(JSON.parse(cached)); setToken(access); setIsAuthenticated(true)
        } else if (r.status === 401) {
          /* 2️⃣ access expired – try silent refresh */
          await silentRefresh(refresh)
        } else {
          clearSession()
        }
      } catch { clearSession() }
      setLoading(false)
    }
    boot()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const silentRefresh = async (refresh:string) => {
    const r = await fetch("http://localhost:8000/api/auth/token/refresh/",{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ refresh })
    })
    if (!r.ok) throw new Error("refresh failed")
    const { access } = await r.json()
    localStorage.setItem("access_token", access)
    const cached = JSON.parse(localStorage.getItem("user")!)
    setUser(cached); setToken(access); setIsAuthenticated(true)
  }

  const clearSession = () => {
    setIsAuthenticated(false); setUser(null); setToken(null)
    localStorage.removeItem("access_token"); localStorage.removeItem("refresh_token")
    localStorage.removeItem("user"); localStorage.removeItem("isAuthenticated")
  }

  /* ---------- LOGIN / REGISTER ---------- */
  const login = async (username:string, password:string) => {
    const r = await fetch("http://localhost:8000/api/auth/login/",{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ username,password })
    })
    const data = await r.json()
    if (!r.ok || !data.success) throw new Error(data.error || "login failed")

    persist(data.user, data.tokens); router.push("/dashboard")
  }

  const register = async (payload:RegisterData) => {
    const r = await fetch("http://localhost:8000/api/auth/register/",{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    })
    const data = await r.json()
    if (!r.ok || !data.success) throw new Error(data.error || "register failed")

    persist(data.user, data.tokens); router.push("/dashboard")
  }

  const persist = (rawUser:any, tokens:{access:string;refresh:string}) => {
    const u:User = { ...rawUser, avatar:"/placeholder.svg" }
    setUser(u); setToken(tokens.access); setIsAuthenticated(true)
    localStorage.setItem("access_token", tokens.access)
    localStorage.setItem("refresh_token", tokens.refresh)
    localStorage.setItem("user", JSON.stringify(u))
    localStorage.setItem("isAuthenticated","true")
  }

  const logout = () => { clearSession(); router.push("/") }

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token")
    if (!refresh) throw new Error("no refresh token")
    await silentRefresh(refresh)
  }

  const updateUser = (d:Partial<User>) => {
    if (!user) return
    const merged = { ...user, ...d }
    setUser(merged); localStorage.setItem("user", JSON.stringify(merged))
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated,user,token,loading,
      login,register,logout,refreshToken,updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
