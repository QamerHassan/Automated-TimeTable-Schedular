"use client"
import type React from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ToastProvider } from "@/hooks/use-toast" // Use our custom ToastProvider
import Chatbot from "@/components/chatbot"
import AuthWrapper from "@/components/auth-wrapper"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider> {/* Use our custom ToastProvider instead of Toaster */}
          <AuthWrapper>
            {children}
            <Chatbot />
          </AuthWrapper>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
