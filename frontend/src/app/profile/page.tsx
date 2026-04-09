"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Calendar, 
  Save, 
  ArrowLeft, 
  Shield,
  Clock,
  Edit3,
  Check,
  X,
  Camera,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
  last_login: string | null
  avatar?: string
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: ""
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Fetch complete user profile from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        const response = await fetch("http://localhost:8000/api/auth/profile/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUserProfile(data.user)
            setFormData({
              first_name: data.user.first_name || "",
              last_name: data.user.last_name || "",
              email: data.user.email || "",
              username: data.user.username || ""
            })
            // Set profile image if exists
            if (data.user.avatar) {
              setProfileImage(data.user.avatar)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      })
      return
    }

    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch("http://localhost:8000/api/auth/profile/upload-avatar/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      if (data.success) {
        // Construct full URL for the image
        const fullImageUrl = `http://localhost:8000${data.avatar_url}`
        console.log("Avatar URL received:", data.avatar_url)
        console.log("Full image URL:", fullImageUrl)
        
        setProfileImage(fullImageUrl)
        
        // Update user context with new avatar
        updateUser({ avatar: fullImageUrl })
        
        toast({
          title: "Profile Picture Updated!",
          description: "Your profile picture has been updated successfully"
        })
      }
    } catch (error) {
      console.error("Image upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch("http://localhost:8000/api/auth/profile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      if (data.success) {
        // Update the user context
        updateUser({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email
        })

        // Update local profile state
        setUserProfile(prev => prev ? {...prev, ...data.user} : null)

        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully"
        })

        setIsEditing(false)
      }
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        email: userProfile.email || "",
        username: userProfile.username || ""
      })
    }
    setIsEditing(false)
  }

  const getInitials = () => {
    const profile = userProfile || user
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }
    return profile?.username?.slice(0, 2).toUpperCase() || "U"
  }

  const getDisplayName = () => {
    const profile = userProfile || user
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`
    }
    return profile?.username || "User"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return "Unknown"
    }
  }

  // Loading state
  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <MainNav />

      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-primary/10 font-display text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-bold font-hero text-primary-dark">Profile Settings</h1>
                <p className="text-xl font-body text-primary-dark/70">Manage your account information</p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="btn-primary-enhanced font-display px-6 py-3"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile Card */}
          <Card className="glass-card-enhanced border-0 bg-white/90 mb-8">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 glass-avatar">
                    {profileImage || user.avatar ? (
                      <AvatarImage 
                        src={profileImage || user.avatar} 
                        alt="Profile Picture"
                        className="object-cover"
                        onLoad={() => console.log("Image loaded successfully")}
                        onError={(e) => {
                          console.log("Image failed to load:", profileImage || user.avatar)
                          console.log("Error:", e)
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary text-white text-2xl font-display">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Camera Icon for Upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors shadow-lg disabled:opacity-50"
                    title="Change profile picture"
                  >
                    {isUploadingImage ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                  
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1">
                  <CardTitle className="text-3xl font-display text-primary-dark mb-2">
                    {getDisplayName()}
                  </CardTitle>
                  <CardDescription className="text-lg font-body text-primary-dark/70 mb-3">
                    @{userProfile.username}
                  </CardDescription>
                  <div className="flex items-center gap-4">
                    <Badge className="glass-badge-primary font-body">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified User
                    </Badge>
                    <div className="flex items-center gap-2 text-sm font-body text-primary-dark/70">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {formatDate(userProfile.date_joined)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Information */}
          <Card className="glass-card-enhanced border-0 bg-white/90 mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display text-primary-dark">
                  Personal Information
                </CardTitle>
                <CardDescription className="font-body text-primary-dark/70">
                  Update your personal details and contact information
                </CardDescription>
              </div>
              {isEditing && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="font-display"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary-enhanced font-display"
                  >
                    {isSaving ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="font-body text-primary-dark text-base">
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      className="font-body bg-white border-gray-300 text-primary-dark text-base py-3"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-body text-primary-dark text-base">
                        {userProfile.first_name || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="font-body text-primary-dark text-base">
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      className="font-body bg-white border-gray-300 text-primary-dark text-base py-3"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-body text-primary-dark text-base">
                        {userProfile.last_name || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body text-primary-dark text-base">
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSaving}
                      className="font-body bg-white border-gray-300 text-primary-dark text-base py-3"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="font-body text-primary-dark text-base">
                        {userProfile.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Username (Read-only) */}
                <div className="space-y-2">
                  <Label className="font-body text-primary-dark text-base">
                    Username
                  </Label>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg opacity-75">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-body text-gray-600 text-base">
                      {userProfile.username}
                    </span>
                    <Badge variant="secondary" className="ml-auto font-body text-xs">
                      Read-only
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Last Login Info */}
              {userProfile.last_login && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm font-body text-primary-dark/70">
                    <Clock className="h-4 w-4" />
                    <span>Last login: {formatDate(userProfile.last_login)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card className="glass-card-enhanced border-0 bg-white/90">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-primary-dark">
                Account Statistics
              </CardTitle>
              <CardDescription className="font-body text-primary-dark/70">
                Your account activity and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-xl">
                  <div className="text-3xl font-bold font-hero text-primary mb-2">5</div>
                  <div className="font-body text-primary-dark/70">Timetables Created</div>
                </div>
                <div className="text-center p-6 bg-accent/5 rounded-xl">
                  <div className="text-3xl font-bold font-hero text-accent mb-2">24h</div>
                  <div className="font-body text-primary-dark/70">Time Saved</div>
                </div>
                <div className="text-center p-6 bg-green-500/5 rounded-xl">
                  <div className="text-3xl font-bold font-hero text-green-600 mb-2">100%</div>
                  <div className="font-body text-primary-dark/70">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
