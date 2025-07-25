// "use client"
// import { useState } from "react"
// import type React from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import Link from "next/link"
// import { useToast } from "@/components/ui/use-toast"
// import { useAuth } from "@/components/auth-context"
// import { LogIn, Eye, EyeOff, CalendarDays, Lock } from "lucide-react"
// import Image from "next/image"
// import User from "lucide-react/dist/esm/icons/User"

// export default function LoginPage() {
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()
//   const { login } = useAuth()
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     if (username && password) {
//       login(username)
//       toast({
//         title: "Welcome back!",
//         description: "You have successfully logged in.",
//       })
//     } else {
//       toast({
//         title: "Login Failed",
//         description: "Please enter both username and password.",
//         variant: "destructive",
//       })
//     }
//     setIsLoading(false)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
//       <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
//         {/* Left Side - Branding */}
//         <div className="hidden lg:block space-y-8 animate-slide-in-left">
//           <div className="space-y-6">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl">
//                 <CalendarDays className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gradient">UMT Timetable</h1>
//                 <p className="text-muted-foreground">Professional Scheduler</p>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <h2 className="text-4xl font-bold text-secondary leading-tight">
//                 Welcome Back to the Future of Scheduling
//               </h2>
//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 Access your dashboard and continue creating amazing timetables with our intelligent scheduling system.
//               </p>
//             </div>
//           </div>

//           <div className="relative">
//             <Image
//               src="/placeholder.svg?height=400&width=500"
//               alt="Login Illustration"
//               width={500}
//               height={400}
//               className="rounded-2xl shadow-2xl"
//             />
//             <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
//             <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="w-full max-w-md mx-auto animate-slide-in-right">
//           <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//             <CardHeader className="text-center space-y-4 pb-8">
//               <div className="mx-auto p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl w-fit">
//                 <LogIn className="h-8 w-8 text-white" />
//               </div>
//               <div className="space-y-2">
//                 <CardTitle className="text-3xl font-bold text-secondary">Welcome Back</CardTitle>
//                 <CardDescription className="text-base">Sign in to your account to continue</CardDescription>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="username" className="text-sm font-medium">
//                     Username
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="username"
//                       type="text"
//                       placeholder="Enter your username"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       className="h-12 text-base pl-10"
//                       required
//                     />
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-sm font-medium">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="h-12 text-base pl-10 pr-12"
//                       required
//                     />
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="remember"
//                       checked={rememberMe}
//                       onCheckedChange={(checked) => setRememberMe(checked as boolean)}
//                     />
//                     <Label htmlFor="remember" className="text-sm">
//                       Remember me
//                     </Label>
//                   </div>
//                   <Link href="#" className="text-sm text-primary hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-base bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Signing in..." : "Sign In"}
//                 </Button>
//               </form>

//               <div className="text-center space-y-4">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <span className="w-full border-t" />
//                   </div>
//                   <div className="relative flex justify-center text-xs uppercase">
//                     <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <Button variant="outline" className="h-12 bg-transparent">
//                     <Image
//                       src="/placeholder.svg?height=20&width=20"
//                       alt="Google"
//                       width={20}
//                       height={20}
//                       className="mr-2"
//                     />
//                     Google
//                   </Button>
//                   <Button variant="outline" className="h-12 bg-transparent">
//                     <Image
//                       src="/placeholder.svg?height=20&width=20"
//                       alt="Microsoft"
//                       width={20}
//                       height={20}
//                       className="mr-2"
//                     />
//                     Microsoft
//                   </Button>
//                 </div>
//               </div>

//               <div className="text-center text-sm">
//                 Don't have an account?{" "}
//                 <Link href="/signup" className="font-medium text-primary hover:underline">
//                   Sign up for free
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Loader2, LogIn } from "lucide-react"

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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
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
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
