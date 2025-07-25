import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UMT Timetable Scheduler - AI-Powered Academic Scheduling",
  description:
    "Revolutionary AI-powered timetable scheduling system for University of Management and Technology. Create, manage, and optimize academic schedules with artificial intelligence.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <MainNav />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
