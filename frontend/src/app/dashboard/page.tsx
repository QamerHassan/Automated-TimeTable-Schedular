"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  School, 
  User, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Users, 
  ListFilter, 
  LayoutGrid,
  Calendar 
} from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <MainNav />

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="text-center space-y-6 mb-16 animate-fade-in-up">
          <div className="space-y-2">
            <Badge className="glass-badge-primary mb-4 font-ai">
              <Sparkles className="h-3 w-3 mr-1" />
              Welcome to Your Dashboard
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold font-hero text-primary-dark">
              Hello, {user?.first_name || user?.username}! 👋
            </h1>
            <p className="text-xl font-body text-primary-dark/70 max-w-2xl mx-auto">
              What type of timetable would you like to create today? Choose from our specialized scheduling options.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card-enhanced border-0 bg-white/90 animate-fade-in hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold font-hero text-primary mb-2">5</div>
              <div className="font-body text-primary-dark/70">Timetables Created</div>
            </CardContent>
          </Card>
          <Card className="glass-card-enhanced border-0 bg-white/90 animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold font-hero text-primary mb-2">24</div>
              <div className="font-body text-primary-dark/70">Hours Saved</div>
            </CardContent>
          </Card>
          <Card className="glass-card-enhanced border-0 bg-white/90 animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold font-hero text-primary mb-2">100%</div>
              <div className="font-body text-primary-dark/70">Conflict-Free</div>
            </CardContent>
          </Card>
        </div>

        {/* Timetable Type Selection */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-in-left glass-card-enhanced border-0 bg-gradient-to-br from-blue-50/80 to-blue-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-20">
                  <GraduationCap className="h-8 w-8 text-white relative z-30" style={{ color: 'white !important' }} />
                </div>
                <Badge className="glass-badge bg-green-100 text-green-700 border-green-200 font-ai">Most Popular</Badge>
              </div>
              <CardTitle className="text-2xl font-bold font-display text-primary-dark group-hover:text-primary transition-colors">
                University
              </CardTitle>
              <CardDescription className="text-base font-body text-primary-dark/70">
                Advanced scheduling for university courses, semesters, and complex academic requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-body text-primary-dark/70">
                  <Clock className="h-4 w-4" />
                  <span>Multi-semester support</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-primary-dark/70">
                  <Users className="h-4 w-4" />
                  <span>Department management</span>
                </div>
              </div>
              <Link href="/dashboard/generate" className="block w-full">
                <Button className="w-full btn-primary-enhanced font-display group-hover:shadow-lg transition-all duration-300 min-h-[48px] px-6 py-3 text-base rounded-full">
                  Create University Timetable
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-in glass-card-enhanced border-0 bg-gradient-to-br from-green-50/80 to-green-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-20">
                  <School className="h-8 w-8 text-white relative z-30" style={{ color: 'white !important' }} />
                </div>
                <Badge className="glass-badge bg-yellow-100 text-yellow-700 border-yellow-200 font-ai">Coming Soon</Badge>
              </div>
              <CardTitle className="text-2xl font-bold font-display text-primary-dark group-hover:text-green-600 transition-colors">
                School
              </CardTitle>
              <CardDescription className="text-base font-body text-primary-dark/70">
                Simplified scheduling for schools with class periods, subjects, and teacher assignments.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-body text-primary-dark/70">
                  <Clock className="h-4 w-4" />
                  <span>Class period management</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-primary-dark/70">
                  <Users className="h-4 w-4" />
                  <span>Teacher scheduling</span>
                </div>
              </div>
              <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed font-display min-h-[48px] px-6 py-3 text-base rounded-full">
                Available Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-in-right glass-card-enhanced border-0 bg-gradient-to-br from-purple-50/80 to-purple-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg relative z-20">
                  <User className="h-8 w-8 text-white relative z-30" style={{ color: 'white !important' }} />
                </div>
                <Badge className="glass-badge bg-yellow-100 text-yellow-700 border-yellow-200 font-ai">Coming Soon</Badge>
              </div>
              <CardTitle className="text-2xl font-bold font-display text-primary-dark group-hover:text-purple-600 transition-colors">
                Personal
              </CardTitle>
              <CardDescription className="text-base font-body text-primary-dark/70">
                Personal schedule management for appointments, meetings, and daily activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-body text-primary-dark/70">
                  <Clock className="h-4 w-4" />
                  <span>Flexible time slots</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-body text-primary-dark/70">
                  <Users className="h-4 w-4" />
                  <span>Personal calendar sync</span>
                </div>
              </div>
              <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed font-display min-h-[48px] px-6 py-3 text-base rounded-full">
                Available Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in-up glass-card-enhanced border-0 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-display text-primary-dark">Quick Actions</CardTitle>
            <CardDescription className="font-body text-primary-dark/70">Jump right into your most common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/dashboard/view">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group glass-card-enhanced border-0 bg-white/90">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                      <ListFilter className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold font-display text-primary-dark group-hover:text-primary transition-colors">
                        View Saved Timetables
                      </h3>
                      <p className="text-sm font-body text-primary-dark/70">
                        Access and manage your previously created schedules
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/generate">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group glass-card-enhanced border-0 bg-white/90">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="p-3 bg-accent/10 rounded-xl w-fit mx-auto group-hover:bg-accent/20 transition-colors">
                      <LayoutGrid className="h-10 w-10 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold font-display text-primary-dark group-hover:text-primary transition-colors">
                        Generate New Timetable
                      </h3>
                      <p className="text-sm font-body text-primary-dark/70">Create a fresh schedule from your course data</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
