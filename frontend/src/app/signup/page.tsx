// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useAuth } from "@/contexts/auth-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"
// import { Loader2, UserPlus, ArrowLeft } from "lucide-react" // Added ArrowLeft for back icon

// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     first_name: "",
//     last_name: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const { register } = useAuth()
//   const { toast } = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("Signup form submitted with data:", formData) // Debug log

//     if (!formData.username || !formData.email || !formData.password) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       })
//       return
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast({
//         title: "Password mismatch",
//         description: "Passwords do not match",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLoading(true)
//     try {
//       const registerData = {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//       }
//       console.log("Calling register with:", registerData) // Debug log
//       await register(registerData)
//       toast({
//         title: "Success!",
//         description: "Account created successfully",
//       })
//     } catch (error) {
//       console.error("Registration error:", error)
//       toast({
//         title: "Registration failed",
//         description: error instanceof Error ? error.message : "Failed to create account",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
//       <Card className="w-full max-w-md glass-card-enhanced border-0 bg-white/95 relative"> {/* Added relative for positioning */}
//         {/* New Back to Home Button */}
//         <Link href="/" className="absolute top-4 left-4">
//           <Button
//             variant="ghost"
//             className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all duration-200 font-display text-base"
//             aria-label="Back to Home"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Home
//           </Button>
//         </Link>

//         <CardHeader className="space-y-1 pt-12"> {/* Added pt-12 to offset the back button */}
//           <CardTitle className="text-2xl font-bold text-center font-display text-gray-800">Create account</CardTitle>
//           <CardDescription className="text-center font-ai text-gray-600">
//             Enter your information to create your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="first_name" className="font-ai text-gray-800">
//                   First Name
//                 </Label>
//                 <Input
//                   id="first_name"
//                   name="first_name"
//                   type="text"
//                   placeholder="John"
//                   value={formData.first_name}
//                   onChange={handleChange}
//                   disabled={isLoading}
//                   className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="last_name" className="font-ai text-gray-800">
//                   Last Name
//                 </Label>
//                 <Input
//                   id="last_name"
//                   name="last_name"
//                   type="text"
//                   placeholder="Doe"
//                   value={formData.last_name}
//                   onChange={handleChange}
//                   disabled={isLoading}
//                   className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="username" className="font-ai text-gray-800">
//                 Username *
//               </Label>
//               <Input
//                 id="username"
//                 name="username"
//                 type="text"
//                 placeholder="johndoe"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email" className="font-ai text-gray-800">
//                 Email *
//               </Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password" className="font-ai text-gray-800">
//                 Password *
//               </Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword" className="font-ai text-gray-800">
//                 Confirm Password *
//               </Label>
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//                 className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
//               />
//             </div>
//             <Button 
//               type="submit" 
//               className="w-full btn-primary-enhanced font-display rounded-full py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2" 
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating account...
//                 </>
//               ) : (
//                 <>
//                   <UserPlus className="mr-2 h-4 w-4" />
//                   Create Account
//                 </>
//               )}
//             </Button>
//           </form>
//           <div className="mt-4 text-center text-sm">
//             <span className="text-gray-600 font-ai">Already have an account? </span>
//             <Link href="/login" className="text-primary hover:underline font-display font-medium">
//               Sign in
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }













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
import { Loader2, UserPlus, ArrowLeft } from "lucide-react"

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

    // Client-side validation
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

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
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
    console.log(`Field ${name} changed to:`, value) // Debug log
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md glass-card-enhanced border-0 bg-white/95 relative">
        {/* Back to Home Button */}
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

        <CardHeader className="space-y-1 pt-12">
          <CardTitle className="text-2xl font-bold text-center font-display text-gray-800">Create account</CardTitle>
          <CardDescription className="text-center font-ai text-gray-600">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="font-ai text-gray-800">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="font-ai text-gray-800">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="font-ai text-gray-800">
                Username *
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-ai text-gray-800">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-ai text-gray-800">
                Password *
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-ai text-gray-800">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
            <span className="text-gray-600 font-ai">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline font-display font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
