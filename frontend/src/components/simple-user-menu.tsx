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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, LogOut, User, MoreVertical, Sun, Moon, Monitor } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"

export function SimpleUserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Default to light theme
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "system">("light")

  useEffect(() => {
    // Load theme from localStorage, default to light
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system"
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    } else {
      // Set default to light theme
      setCurrentTheme("light")
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleLogout = () => {
    console.log("Logout clicked")
    logout()
    router.push("/")
    setIsOpen(false)
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

  const toggleMenu = () => {
    console.log("Menu button clicked, current state:", isOpen)
    setIsOpen(!isOpen)
    setShowThemeSubmenu(false)
  }

  const handleMenuItemClick = (action: () => void) => {
    action()
    setIsOpen(false)
    setShowThemeSubmenu(false)
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    console.log("Theme changed to:", newTheme)
    setCurrentTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    // Apply theme to document
    const root = document.documentElement
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "light") {
      root.classList.remove("dark")
    } else {
      // System theme
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", systemDark)
    }

    setIsOpen(false)
    setShowThemeSubmenu(false)
  }

  const getThemeIcon = () => {
    switch (currentTheme) {
      case "dark":
        return <Moon className="mr-2 h-4 w-4" />
      case "light":
        return <Sun className="mr-2 h-4 w-4" />
      default:
        return <Monitor className="mr-2 h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (currentTheme) {
      case "dark":
        return "Dark"
      case "light":
        return "Light"
      case "system":
        return "System"
      default:
        return "Theme"
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowThemeSubmenu(false)
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
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt={user.username} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getInitials(user.first_name, user.last_name, user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">{getDisplayName()}</p>
        </div>
      </div>

      {/* Menu Button */}
      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-2 bg-transparent" onClick={toggleMenu}>
        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">Open user menu</span>
      </Button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-popover-foreground">{getDisplayName()}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() =>
                handleMenuItemClick(() => {
                  console.log("Settings clicked")
                  router.push("/dashboard/settings")
                })
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() =>
                handleMenuItemClick(() => {
                  console.log("Profile clicked")
                  router.push("/dashboard/profile")
                })
              }
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </button>

            {/* Theme Submenu */}
            <div className="relative">
              <button
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setShowThemeSubmenu(!showThemeSubmenu)}
              >
                <div className="flex items-center">
                  {getThemeIcon()}
                  Theme ({getThemeLabel()})
                </div>
                <span className="text-xs">▶</span>
              </button>

              {/* Theme Options Submenu */}
              {showThemeSubmenu && (
                <div className="absolute left-full top-0 ml-1 w-32 bg-popover border border-border rounded-md shadow-lg">
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    {currentTheme === "light" && <span className="ml-auto text-xs text-primary">✓</span>}
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    {currentTheme === "dark" && <span className="ml-auto text-xs text-primary">✓</span>}
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => handleThemeChange("system")}
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                    {currentTheme === "system" && <span className="ml-auto text-xs text-primary">✓</span>}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-border my-1"></div>

            <button
              className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
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

