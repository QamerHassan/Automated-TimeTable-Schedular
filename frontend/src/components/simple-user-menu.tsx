// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Settings, LogOut, User, MoreVertical } from "lucide-react"
// import { useAuth } from "@/components/auth-context"
// import { useRouter } from "next/navigation"

// export function SimpleUserMenu() {
//   const { user, logout } = useAuth()
//   const router = useRouter()
//   const [isOpen, setIsOpen] = useState(false)
//   const menuRef = useRef<HTMLDivElement>(null)

//   const handleLogout = () => {
//     console.log("Logout clicked")
//     logout()
//     router.push("/")
//     setIsOpen(false)
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

//   const toggleMenu = () => {
//     console.log("Menu button clicked, current state:", isOpen)
//     setIsOpen(!isOpen)
//   }

//   const handleMenuItemClick = (action: () => void) => {
//     action()
//     setIsOpen(false)
//   }

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen])

//   if (!user) return null

//   return (
//     <div className="relative flex items-center gap-3" ref={menuRef}>
//       {/* User Avatar and Info */}
//       <div className="flex items-center gap-2">
//         <Avatar className="h-8 w-8">
//           <AvatarImage src="/placeholder.svg" alt={user.username} />
//           <AvatarFallback className="bg-primary text-primary-foreground text-sm">
//             {getInitials(user.first_name, user.last_name, user.username)}
//           </AvatarFallback>
//         </Avatar>
//         <div className="hidden md:block">
//           <p className="text-sm font-medium">{getDisplayName()}</p>
//         </div>
//       </div>

//       {/* Menu Button */}
//       <Button
//         variant="outline"
//         size="sm"
//         className="h-8 w-8 p-0 border-2 bg-white hover:bg-gray-50"
//         onClick={toggleMenu}
//       >
//         <MoreVertical className="h-4 w-4" />
//         <span className="sr-only">Open user menu</span>
//       </Button>

//       {/* Custom Dropdown Menu */}
//       {isOpen && (
//         <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//           {/* User Info Header */}
//           <div className="px-4 py-3 border-b border-gray-100">
//             <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
//             <p className="text-xs text-gray-500">{user.email}</p>
//           </div>

//           {/* Menu Items */}
//           <div className="py-1">
//             <button
//               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//               onClick={() =>
//                 handleMenuItemClick(() => {
//                   console.log("Settings clicked")
//                   router.push("/dashboard/settings")
//                 })
//               }
//             >
//               <Settings className="mr-2 h-4 w-4" />
//               Settings
//             </button>

//             <button
//               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//               onClick={() =>
//                 handleMenuItemClick(() => {
//                   console.log("Profile clicked")
//                   router.push("/dashboard/profile")
//                 })
//               }
//             >
//               <User className="mr-2 h-4 w-4" />
//               Profile
//             </button>

//             <div className="border-t border-gray-100 my-1"></div>

//             <button
//               className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//               onClick={() => handleMenuItemClick(handleLogout)}
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Log out
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }













"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, LogOut, User, MoreVertical } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function SimpleUserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    console.log("Logout clicked")
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    return user?.username?.slice(0, 2).toUpperCase() || "U"
  }

  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user?.username || "User"
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  if (!user) return null

  return (
    <div className="relative flex items-center gap-3" ref={menuRef}>
      {/* User Avatar and Info */}
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 glass-avatar">
          <AvatarFallback className="bg-primary text-white text-sm font-display">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium font-display text-white">{getDisplayName()}</p>
        </div>
      </div>

      {/* Menu Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 border-0 bg-transparent hover:bg-primary/10 rounded-full" 
        onClick={toggleMenu}
      >
        <MoreVertical className="h-4 w-4 text-white" />
        <span className="sr-only">Open user menu</span>
      </Button>

      {/* Custom Dropdown Menu with Glass Theme */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 glass-card-enhanced border-0 bg-white/95 rounded-xl shadow-2xl z-50 animate-slide-up-smooth">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200/50">
            <p className="text-sm font-medium font-display text-primary-dark">{getDisplayName()}</p>
            <p className="text-xs font-body text-primary-dark/70">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              className="flex items-center w-full px-4 py-2 text-sm font-body text-primary-dark hover:bg-primary/10 transition-colors rounded-lg mx-1"
              onClick={() =>
                handleMenuItemClick(() => {
                  router.push("/dashboard/settings")
                })
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm font-body text-primary-dark hover:bg-primary/10 transition-colors rounded-lg mx-1"
              onClick={() =>
                handleMenuItemClick(() => {
                  router.push("/profile")
                })
              }
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </button>

            <div className="border-t border-gray-200/50 my-1"></div>

            <button
              className="flex items-center w-full px-4 py-2 text-sm font-body text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-1"
              onClick={() => handleMenuItemClick(handleLogout)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



