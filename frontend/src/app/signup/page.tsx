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
// import { UserPlus, Eye, EyeOff, CalendarDays, CheckCircle, User, Mail, Lock } from "lucide-react"
// import Image from "next/image"

// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [agreeToTerms, setAgreeToTerms] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()
//   const router = useRouter()

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     if (formData.username && formData.email && formData.password && formData.confirmPassword && agreeToTerms) {
//       if (formData.password !== formData.confirmPassword) {
//         toast({
//           title: "Password Mismatch",
//           description: "Passwords do not match. Please try again.",
//           variant: "destructive",
//         })
//         setIsLoading(false)
//         return
//       }

//       toast({
//         title: "Account Created Successfully!",
//         description: "Welcome to UMT Timetable Scheduler. You can now log in.",
//       })
//       router.push("/login")
//     } else {
//       toast({
//         title: "Signup Failed",
//         description: "Please fill in all fields and agree to the terms.",
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
//               <h2 className="text-4xl font-bold text-secondary leading-tight">Join Thousands of Satisfied Users</h2>
//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 Create your account and start building perfect timetables with our intelligent scheduling system.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span className="text-muted-foreground">Free 14-day trial</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span className="text-muted-foreground">No credit card required</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span className="text-muted-foreground">Cancel anytime</span>
//               </div>
//             </div>
//           </div>

//           <div className="relative">
//             <Image
//               src="/placeholder.svg?height=400&width=500"
//               alt="Signup Illustration"
//               width={500}
//               height={400}
//               className="rounded-2xl shadow-2xl"
//             />
//             <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
//             <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
//           </div>
//         </div>

//         {/* Right Side - Signup Form */}
//         <div className="w-full max-w-md mx-auto animate-slide-in-right">
//           <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//             <CardHeader className="text-center space-y-4 pb-8">
//               <div className="mx-auto p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl w-fit">
//                 <UserPlus className="h-8 w-8 text-white" />
//               </div>
//               <div className="space-y-2">
//                 <CardTitle className="text-3xl font-bold text-secondary">Create Account</CardTitle>
//                 <CardDescription className="text-base">Get started with your free account today</CardDescription>
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
//                       name="username"
//                       type="text"
//                       placeholder="Choose a username"
//                       value={formData.username}
//                       onChange={handleInputChange}
//                       className="h-12 text-base pl-10"
//                       required
//                     />
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium">
//                     Email Address
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="h-12 text-base pl-10"
//                       required
//                     />
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-sm font-medium">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Create a password"
//                       value={formData.password}
//                       onChange={handleInputChange}
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

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword" className="text-sm font-medium">
//                     Confirm Password
//                   </Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm your password"
//                       value={formData.confirmPassword}
//                       onChange={handleInputChange}
//                       className="h-12 text-base pl-10 pr-12"
//                       required
//                     />
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="terms"
//                     checked={agreeToTerms}
//                     onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
//                   />
//                   <Label htmlFor="terms" className="text-sm">
//                     I agree to the{" "}
//                     <Link href="#" className="text-primary hover:underline">
//                       Terms of Service
//                     </Link>{" "}
//                     and{" "}
//                     <Link href="#" className="text-primary hover:underline">
//                       Privacy Policy
//                     </Link>
//                   </Label>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-12 text-base bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Creating Account..." : "Create Account"}
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
//                 Already have an account?{" "}
//                 <Link href="/login" className="font-medium text-primary hover:underline">
//                   Sign in here
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
import { Loader2, UserPlus } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Signup form submitted with data:", formData) // Debug log

    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      }

      console.log("Calling register with:", registerData) // Debug log
      await register(registerData)

      toast({
        title: "Success!",
        description: "Account created successfully",
      })
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account",
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
          <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
          <CardDescription className="text-center">Enter your information to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
