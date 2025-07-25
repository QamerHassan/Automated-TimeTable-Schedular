// "use client"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "@/components/auth-context"
// import { CalendarDays, LogIn, UserPlus, LayoutDashboard, User, LogOut } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// export function MainNav() {
//   const { isAuthenticated, user, logout } = useAuth()

//   return (
//     <nav className="bg-white/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 shadow-sm">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <Link href="/" className="flex items-center gap-3 group">
//             <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-200">
//               <CalendarDays className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <span className="text-xl font-bold text-gradient">UMT Timetable</span>
//               <p className="text-xs text-muted-foreground -mt-1">Scheduler</p>
//             </div>
//           </Link>

//           <div className="hidden md:flex items-center gap-6">
//             <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
//               Home
//             </Link>
//             <Link
//               href="#features"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               Features
//             </Link>
//             <Link
//               href="#how-it-works"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               How it Works
//             </Link>
//             <Link
//               href="#contact"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               Contact
//             </Link>
//           </div>

//           <div className="flex items-center gap-4">
//             {isAuthenticated && user ? (
//               <>
//                 <Link href="/dashboard">
//                   <Button variant="ghost" className="hidden md:flex items-center gap-2">
//                     <LayoutDashboard className="h-4 w-4" />
//                     Dashboard
//                   </Button>
//                 </Link>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                       <Avatar className="h-10 w-10">
//                         <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
//                         <AvatarFallback className="bg-primary text-primary-foreground">
//                           {user.username.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56" align="end" forceMount>
//                     <DropdownMenuLabel className="font-normal">
//                       <div className="flex flex-col space-y-1">
//                         <p className="text-sm font-medium leading-none">{user.username}</p>
//                         <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                       <Link href="/dashboard" className="flex items-center gap-2">
//                         <LayoutDashboard className="h-4 w-4" />
//                         Dashboard
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="/profile" className="flex items-center gap-2">
//                         <User className="h-4 w-4" />
//                         Profile
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
//                       <LogOut className="h-4 w-4" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </>
//             ) : (
//               <>
//                 <Link href="/login">
//                   <Button variant="ghost" className="flex items-center gap-2">
//                     <LogIn className="h-4 w-4" />
//                     Login
//                   </Button>
//                 </Link>
//                 <Link href="/signup">
//                   <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
//                     <UserPlus className="h-4 w-4" />
//                     Sign Up
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }










// ===========================================================================================

// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "@/components/auth-context"
// import { CalendarDays, LogIn, UserPlus, LayoutDashboard } from "lucide-react"
// import { UserMenuButton } from "@/components/user-menu-button"

// export function MainNav() {
//   const { isAuthenticated, user } = useAuth()

//   console.log("MainNav - isAuthenticated:", isAuthenticated, "user:", user?.username)

//   return (
//     <nav className="bg-white/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 shadow-sm">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <Link href="/" className="flex items-center gap-3 group">
//             <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-200">
//               <CalendarDays className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <span className="text-xl font-bold text-gradient">UMT Timetable</span>
//               <p className="text-xs text-muted-foreground -mt-1">Scheduler</p>
//             </div>
//           </Link>

//           <div className="hidden md:flex items-center gap-6">
//             <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
//               Home
//             </Link>
//             <Link
//               href="#features"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               Features
//             </Link>
//             <Link
//               href="#how-it-works"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               How it Works
//             </Link>
//             <Link
//               href="#contact"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               Contact
//             </Link>
//           </div>

//           <div className="flex items-center gap-4">
//             {isAuthenticated && user ? (
//               <>
//                 <Link href="/dashboard">
//                   <Button variant="ghost" className="hidden md:flex items-center gap-2">
//                     <LayoutDashboard className="h-4 w-4" />
//                     Dashboard
//                   </Button>
//                 </Link>
//                 <UserMenuButton />
//               </>
//             ) : (
//               <>
//                 <Link href="/login">
//                   <Button variant="ghost" className="flex items-center gap-2">
//                     <LogIn className="h-4 w-4" />
//                     Login
//                   </Button>
//                 </Link>
//                 <Link href="/signup">
//                   <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
//                     <UserPlus className="h-4 w-4" />
//                     Sign Up
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }


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
              <span className="text-xl font-bold text-gradient">UMT Timetable</span>
              <p className="text-xs text-muted-foreground -mt-1">Scheduler</p>
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


// ====================================================================================
// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "@/components/auth-context"
// import { CalendarDays, LogIn, UserPlus, LayoutDashboard, User, LogOut } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// export function MainNav() {
//   const { isAuthenticated, user, logout } = useAuth()

//   const getInitials = (user: any) => {
//     if (user?.first_name && user?.last_name) {
//       return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
//     }
//     return user?.username?.charAt(0).toUpperCase() || "U"
//   }

//   const getDisplayName = (user: any) => {
//     if (user?.first_name && user?.last_name) {
//       return `${user.first_name} ${user.last_name}`
//     }
//     return user?.username || "User"
//   }

//   return (
//     <nav className="bg-white/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 shadow-sm">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <Link href="/" className="flex items-center gap-3 group">
//             <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl group-hover:scale-105 transition-transform duration-200">
//               <CalendarDays className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <span className="text-xl font-bold text-gradient">UMT Timetable</span>
//               <p className="text-xs text-muted-foreground -mt-1">Scheduler</p>
//             </div>
//           </Link>
//           <div className="hidden md:flex items-center gap-6">
//             <Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
//               Home
//             </Link>
//             <Link
//               href="#features"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               Features
//             </Link>
//             <Link
//               href="#how-it-works"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               How it Works
//             </Link>
//             <Link
//               href="#contact"
//               className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
//             >
//               Contact
//             </Link>
//           </div>
//           <div className="flex items-center gap-4">
//             {isAuthenticated && user ? (
//               <>
//                 <Link href="/dashboard">
//                   <Button variant="ghost" className="hidden md:flex items-center gap-2">
//                     <LayoutDashboard className="h-4 w-4" />
//                     Dashboard
//                   </Button>
//                 </Link>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//                       <Avatar className="h-10 w-10">
//                         <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
//                         <AvatarFallback className="bg-primary text-primary-foreground">
//                           {getInitials(user)}
//                         </AvatarFallback>
//                       </Avatar>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent className="w-56" align="end" forceMount>
//                     <DropdownMenuLabel className="font-normal">
//                       <div className="flex flex-col space-y-1">
//                         <p className="text-sm font-medium leading-none">{getDisplayName(user)}</p>
//                         <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                       <Link href="/dashboard" className="flex items-center gap-2">
//                         <LayoutDashboard className="h-4 w-4" />
//                         Dashboard
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem asChild>
//                       <Link href="/dashboard/settings" className="flex items-center gap-2">
//                         <User className="h-4 w-4" />
//                         Settings
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
//                       <LogOut className="h-4 w-4" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </>
//             ) : (
//               <>
//                 <Link href="/login">
//                   <Button variant="ghost" className="flex items-center gap-2">
//                     <LogIn className="h-4 w-4" />
//                     Login
//                   </Button>
//                 </Link>
//                 <Link href="/signup">
//                   <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
//                     <UserPlus className="h-4 w-4" />
//                     Sign Up
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }
