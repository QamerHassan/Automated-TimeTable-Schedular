// "use client"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Settings, LogOut, User } from 'lucide-react'
// import { useAuth } from "@/components/auth-context"
// import { useRouter } from "next/navigation"

// export function UserProfileDropdown() {
//   const { user, logout } = useAuth()
//   const router = useRouter()

//   if (!user) return null

//   const handleLogout = () => {
//     logout()
//     router.push("/")
//   }

//   const getInitials = (firstName: string, lastName: string, username: string) => {
//     if (firstName && lastName) {
//       return `${firstName[0]}${lastName[0]}`.toUpperCase()
//     }
//     return username.slice(0, 2).toUpperCase()
//   }

//   const getDisplayName = () => {
//     if (user.first_name && user.last_name) {
//       return `${user.first_name} ${user.last_name}`
//     }
//     return user.username
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="/placeholder.svg" alt={user.username} />
//             <AvatarFallback className="bg-primary text-primary-foreground">
//               {getInitials(user.first_name, user.last_name, user.username)}
//             </AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
//             <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
//           <Settings className="mr-2 h-4 w-4" />
//           <span>Settings</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
//           <User className="mr-2 h-4 w-4" />
//           <span>Profile</span>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleLogout}>
//           <LogOut className="mr-2 h-4 w-4" />
//           <span>Log out</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }






"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut, User, ChevronDown } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function UserProfileDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    console.log("UserProfileDropdown: No user found")
    return null
  }

  const handleLogout = () => {
    console.log("Logout clicked")
    logout()
    router.push("/")
  }

  const getInitials = (firstName: string, lastName: string, username: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return username.slice(0, 2).toUpperCase()
  }

  const getDisplayName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user.username
  }

  console.log("UserProfileDropdown rendering for user:", user.username)

  return (
    <div className="flex items-center gap-2">
      {/* User Info Display */}
      <div className="hidden md:flex flex-col items-end">
        <span className="text-sm font-medium">{getDisplayName()}</span>
        <span className="text-xs text-muted-foreground">{user.email}</span>
      </div>

      {/* Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg" alt={user.username} />
        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
          {getInitials(user.first_name, user.last_name, user.username)}
        </AvatarFallback>
      </Avatar>

      {/* Dropdown Menu */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              console.log("Dropdown trigger clicked, current state:", isOpen)
              setIsOpen(!isOpen)
            }}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          forceMount
          onCloseAutoFocus={(e) => {
            console.log("Dropdown closing")
          }}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              console.log("Settings clicked")
              router.push("/dashboard/settings")
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              console.log("Profile clicked")
              router.push("/dashboard/profile")
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


// "use client"

// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Settings, LogOut, User } from "lucide-react"
// import { useAuth } from "@/components/auth-context"
// import { useRouter } from "next/navigation"

// export function UserProfileDropdown() {
//   const { user, logout } = useAuth()
//   const router = useRouter()

//   console.log("UserProfileDropdown rendered, user:", user) // Debug log

//   if (!user) {
//     console.log("No user found, not rendering dropdown") // Debug log
//     return null
//   }

//   const handleLogout = () => {
//     console.log("Logout clicked") // Debug log
//     logout()
//     router.push("/")
//   }

//   const getInitials = (firstName: string, lastName: string, username: string) => {
//     if (firstName && lastName) {
//       return `${firstName[0]}${lastName[0]}`.toUpperCase()
//     }
//     return username.slice(0, 2).toUpperCase()
//   }

//   const getDisplayName = () => {
//     if (user.first_name && user.last_name) {
//       return `${user.first_name} ${user.last_name}`
//     }
//     return user.username
//   }

//   const handleDropdownClick = () => {
//     console.log("Dropdown trigger clicked!") // Debug log
//   }

//   return (
//     <div className="relative">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="relative h-10 w-10 rounded-full" onClick={handleDropdownClick}>
//             <Avatar className="h-10 w-10">
//               <AvatarImage src="/placeholder.svg" alt={user.username} />
//               <AvatarFallback className="bg-primary text-primary-foreground">
//                 {getInitials(user.first_name, user.last_name, user.username)}
//               </AvatarFallback>
//             </Avatar>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56" align="end" forceMount>
//           <DropdownMenuLabel className="font-normal">
//             <div className="flex flex-col space-y-1">
//               <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
//               <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//             </div>
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem
//             onClick={() => {
//               console.log("Settings clicked") // Debug log
//               router.push("/dashboard/settings")
//             }}
//           >
//             <Settings className="mr-2 h-4 w-4" />
//             <span>Settings</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => {
//               console.log("Profile clicked") // Debug log
//               router.push("/dashboard/profile")
//             }}
//           >
//             <User className="mr-2 h-4 w-4" />
//             <span>Profile</span>
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={handleLogout}>
//             <LogOut className="mr-2 h-4 w-4" />
//             <span>Log out</span>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }
