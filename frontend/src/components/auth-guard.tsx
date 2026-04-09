// "use client"

// import type React from "react"
// import { useAuth } from "@/components/auth-context"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"
// import { Loader2 } from "lucide-react"

// interface AuthGuardProps {
//   children: React.ReactNode
// }

// export function AuthGuard({ children }: AuthGuardProps) {
//   const { isAuthenticated, loading } = useAuth()
//   const router = useRouter()

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push("/login")
//     }
//   }, [isAuthenticated, loading, router])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!isAuthenticated) {
//     return null
//   }

//   return <>{children}</>
// }
"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const PUBLIC_ROUTES = ["/", "/login", "/signup"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

      if (!user && !isPublicRoute) {
        router.push("/login")
      } else if (user && (pathname === "/login" || pathname === "/signup")) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, mounted, router, pathname])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Loading Quantime...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
