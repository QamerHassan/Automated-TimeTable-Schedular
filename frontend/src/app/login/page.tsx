"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Loader2, LogIn, ArrowLeft } from "lucide-react" // Added ArrowLeft for back icon

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with data:", formData) // Debug log

    if (!formData.username || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("Calling login with:", formData.username, formData.password) // Debug log
      await login(formData.username, formData.password)
      toast({
        title: "Success!",
        description: "Logged in successfully",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md glass-card-enhanced border-0 bg-white/95 relative"> {/* Added relative for positioning */}
        {/* New Back to Home Button */}
        <Link href="/" className="absolute top-4 left-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-200 font-display text-base"
            aria-label="Back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <CardHeader className="space-y-1 pt-12"> {/* Added pt-12 to offset the back button */}
          <CardTitle className="text-2xl font-bold text-center font-display text-gray-800">Welcome back</CardTitle>
          <CardDescription className="text-center font-ai text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-ai text-gray-800">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-ai text-gray-800">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full btn-primary-enhanced font-display rounded-full py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600 font-ai">Don't have an account? </span>
            <Link href="/signup" className="text-primary hover:underline font-display font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
