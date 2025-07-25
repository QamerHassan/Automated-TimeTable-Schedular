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
import { Settings, LogOut, User, MoreVertical } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"

export function UserMenuButton() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
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

  return (
    <div className="flex items-center gap-3">
      {/* User Avatar and Info */}
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt={user.username} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getInitials(user.first_name, user.last_name, user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block">
          <p className="text-sm font-medium">{getDisplayName()}</p>
        </div>
      </div>

      {/* Menu Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-2 bg-transparent">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
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
