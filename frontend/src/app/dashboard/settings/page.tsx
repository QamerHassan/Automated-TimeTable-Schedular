"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Camera } from "lucide-react"

export default function SettingsPage() {
  const { user, updateUser, token } = useAuth()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  })

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const response = await fetch("http://localhost:8000/api/auth/profile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Update failed")
      }

      if (data.success) {
        updateUser(data.user)
        toast({
          title: "Success!",
          description: "Profile updated successfully",
        })
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("http://localhost:8000/api/auth/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Password change failed")
      }

      if (data.success) {
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        })
        toast({
          title: "Success!",
          description: "Password changed successfully",
        })
      }
    } catch (error) {
      console.error("Password change error:", error)
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (!user) return null

  const getInitials = (firstName: string, lastName: string, username: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt={user.username} />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {getInitials(user.first_name, user.last_name, user.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Change Avatar
                </Button>
                <p className="text-sm text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <Separator />

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user.username} disabled className="bg-muted" />
                <p className="text-sm text-muted-foreground">Username cannot be changed</p>
              </div>

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old_password">Current Password</Label>
                <Input
                  id="old_password"
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  placeholder="Enter your new password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
