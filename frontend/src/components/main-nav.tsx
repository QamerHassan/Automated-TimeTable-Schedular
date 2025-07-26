"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { CalendarDays, LogIn, UserPlus, LayoutDashboard } from "lucide-react"
import { SimpleUserMenu } from "@/components/simple-user-menu"

export function MainNav() {
  const { isAuthenticated, user } = useAuth()

  console.log("MainNav - isAuthenticated:", isAuthenticated, "user:", user?.username)

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-200">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">QuantimeAI</span>
              <p className="text-xs text-muted-foreground -mt-1">AI Scheduler</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link
              href="#features"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              How it Works
            </Link>
            <Link
              href="#contact"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="hidden md:flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <SimpleUserMenu />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
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