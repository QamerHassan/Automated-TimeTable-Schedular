"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, School, User, ArrowRight, Sparkles, Clock, Users, ListFilter, LayoutGrid } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="text-center space-y-6 mb-16 animate-fade-in-up">
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Welcome to Your Dashboard
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary">Hello, {user?.username}! 👋</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              What type of timetable would you like to create today? Choose from our specialized scheduling options.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            className="animate-fade-in hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: "100ms" }}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-muted-foreground">Timetables Created</div>
            </CardContent>
          </Card>
          <Card
            className="animate-fade-in hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">24</div>
              <div className="text-muted-foreground">Hours Saved</div>
            </CardContent>
          </Card>
          <Card
            className="animate-fade-in hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: "300ms" }}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Conflict-Free</div>
            </CardContent>
          </Card>
        </div>

        {/* Timetable Type Selection */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-in-left border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">Most Popular</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-secondary group-hover:text-blue-600 transition-colors">
                University
              </CardTitle>
              <CardDescription className="text-base">
                Advanced scheduling for university courses, semesters, and complex academic requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Multi-semester support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Department management</span>
                </div>
              </div>
              <Link href="/dashboard/generate">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white group-hover:shadow-lg transition-all duration-300">
                  Create University Timetable
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-in border-0 bg-gradient-to-br from-green-50 to-green-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <School className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Coming Soon</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-secondary group-hover:text-green-600 transition-colors">
                School
              </CardTitle>
              <CardDescription className="text-base">
                Simplified scheduling for schools with class periods, subjects, and teacher assignments.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Class period management</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Teacher scheduling</span>
                </div>
              </div>
              <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed">
                Available Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 animate-slide-in-right border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <User className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Coming Soon</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-secondary group-hover:text-purple-600 transition-colors">
                Personal
              </CardTitle>
              <CardDescription className="text-base">
                Personal schedule management for appointments, meetings, and daily activities.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Flexible time slots</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Personal calendar sync</span>
                </div>
              </div>
              <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed">
                Available Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in-up bg-gradient-to-r from-primary/5 to-secondary/5 border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-secondary">Quick Actions</CardTitle>
            <CardDescription>Jump right into your most common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/dashboard/view">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                      <ListFilter className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                        View Saved Timetables
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Access and manage your previously created schedules
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/generate">
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="p-3 bg-secondary/10 rounded-xl w-fit mx-auto group-hover:bg-secondary/20 transition-colors">
                      <LayoutGrid className="h-10 w-10 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                        Generate New Timetable
                      </h3>
                      <p className="text-sm text-muted-foreground">Create a fresh schedule from your course data</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
