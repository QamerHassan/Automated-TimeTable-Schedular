"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { CalendarDays, LogIn, UserPlus, LayoutDashboard, Zap } from "lucide-react"
import { SimpleUserMenu } from "@/components/simple-user-menu"

export function MainNav() {
  const { isAuthenticated, user } = useAuth()

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-2xl group-hover:scale-105 transition-transform duration-200 shadow-lg">
              <CalendarDays className="h-7 w-7 text-white" />
              <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full animate-pulse">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient font-display">Quantime AI</span>
              <p className="text-xs font-ai -mt-1" style={{ color: "var(--secondary-text)" }}>
                Smart Scheduler
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="font-medium relative group font-display transition-colors duration-200"
              style={{ color: "var(--foreground)" }}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="#features"
              className="font-medium relative group font-display transition-colors duration-200"
              style={{ color: "var(--foreground)" }}
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="#how-it-works"
              className="font-medium relative group font-display transition-colors duration-200"
              style={{ color: "var(--foreground)" }}
            >
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="#team"
              className="font-medium relative group font-display transition-colors duration-200"
              style={{ color: "var(--foreground)" }}
            >
              Team
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="#contact"
              className="font-medium relative group font-display transition-colors duration-200"
              style={{ color: "var(--foreground)" }}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-2 hover:bg-primary/10 font-display"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <SimpleUserMenu />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 font-display">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 font-display">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
