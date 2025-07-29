"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Mail, 
  ArrowLeft, 
  Shield,
  Clock,
  Check,
  Bell,
  Eye,
  EyeOff,
  Key,
  Settings as SettingsIcon,
  HelpCircle,
  Info,
  Database,
  AlertTriangle,
  Download,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Save,
  Edit
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
    timetable_updates: boolean
  }
  privacy: {
    profile_visibility: 'public' | 'private'
    activity_status: boolean
    data_sharing: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
  }
}

export default function SettingsPage() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [activeSection, setActiveSection] = useState('notifications')
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      marketing: false,
      timetable_updates: true
    },
    privacy: {
      profile_visibility: 'public',
      activity_status: true,
      data_sharing: false
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC'
    }
  })

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const handleSettingsChange = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Updated!",
        description: "Your preferences have been saved successfully"
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast({
        title: "Password Mismatch",
        description: "New passwords don't match",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("http://localhost:8000/api/auth/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          old_password: passwordForm.current_password,
          new_password: passwordForm.new_password
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Password Changed!",
          description: "Your password has been updated successfully"
        })
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
        setShowPasswordFields(false)
      } else {
        throw new Error(data.error || "Failed to change password")
      }
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: error instanceof Error ? error.message : "Unable to change password",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Data Exported!",
        description: "Your account data has been downloaded"
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export data. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAccount = async () => {
    toast({
      title: "Feature Coming Soon",
      description: "Account deletion will be available in a future update",
      variant: "destructive"
    })
    setShowDeleteModal(false)
  }

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    return user?.username?.slice(0, 2).toUpperCase() || "U"
  }

  // Loading state
  if (loading) {
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

  const menuItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <MainNav />

      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-primary/10 font-display text-primary-dark"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-bold font-hero text-primary-dark">Settings</h1>
                <p className="text-xl font-body text-primary-dark/70">Manage your account preferences</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/profile')}
              className="btn-primary-enhanced font-display"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Menu */}
            <div className="lg:col-span-1">
              <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md sticky top-8">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt="Profile Picture" />
                      <AvatarFallback className="bg-primary text-white font-display">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-display text-primary-dark text-lg">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.username}
                      </CardTitle>
                      <p className="text-sm font-body text-primary-dark/70">@{user.username}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-body ${
                          activeSection === item.id
                            ? 'bg-primary text-white shadow-lg'
                            : 'hover:bg-primary/10 text-primary-dark hover:shadow-md'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {activeSection === 'notifications' && (
                <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-primary-dark text-2xl">Notification Preferences</CardTitle>
                    <CardDescription className="font-body text-primary-dark/70">
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                        <div>
                          <Label className="font-display text-primary-dark text-lg capitalize">
                            {key.replace('_', ' ')}
                          </Label>
                          <p className="text-sm font-body text-primary-dark/70 mt-1">
                            {key === 'email' && 'Receive notifications via email'}
                            {key === 'push' && 'Receive push notifications in browser'}
                            {key === 'marketing' && 'Receive marketing updates and newsletters'}
                            {key === 'timetable_updates' && 'Get notified about timetable changes'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => handleSettingsChange('notifications', key, checked)}
                          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
                        />
                      </div>
                    ))}
                    <Button onClick={handleSaveSettings} disabled={isSaving} className="btn-primary-enhanced font-display">
                      {isSaving ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Notification Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'security' && (
                <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-primary-dark text-2xl">Security Settings</CardTitle>
                    <CardDescription className="font-body text-primary-dark/70">
                      Manage your account security and password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex items-center justify-between p-6 bg-green-50/80 rounded-xl border border-green-200/50">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <Shield className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <Label className="font-display text-green-800 text-lg">Two-Factor Authentication</Label>
                          <p className="text-sm font-body text-green-700">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 font-body">Not Set Up</Badge>
                    </div>

                    <div className="p-6 bg-gray-50/80 rounded-xl border border-gray-200/50">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <Label className="font-display text-primary-dark text-lg">Change Password</Label>
                          <p className="text-sm font-body text-primary-dark/70">Update your account password</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setShowPasswordFields(!showPasswordFields)}
                          className="font-display border-primary/20 hover:bg-primary/10"
                        >
                          {showPasswordFields ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                          {showPasswordFields ? 'Hide' : 'Show'} Fields
                        </Button>
                      </div>

                      {showPasswordFields && (
                        <div className="space-y-4">
                          <div>
                            <Label className="font-body text-primary-dark">Current Password</Label>
                            <Input
                              type="password"
                              value={passwordForm.current_password}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                              className="font-body bg-white border-gray-300 text-primary-dark mt-2"
                            />
                          </div>
                          <div>
                            <Label className="font-body text-primary-dark">New Password</Label>
                            <Input
                              type="password"
                              value={passwordForm.new_password}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                              className="font-body bg-white border-gray-300 text-primary-dark mt-2"
                            />
                          </div>
                          <div>
                            <Label className="font-body text-primary-dark">Confirm New Password</Label>
                            <Input
                              type="password"
                              value={passwordForm.confirm_password}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                              className="font-body bg-white border-gray-300 text-primary-dark mt-2"
                            />
                          </div>
                          <Button onClick={handleChangePassword} disabled={isSaving} className="btn-primary-enhanced font-display">
                            {isSaving ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                            Update Password
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-blue-50/80 rounded-xl border border-blue-200/50">
                      <h3 className="font-display text-primary-dark text-lg mb-4">Active Sessions</h3>
                      <div className="flex items-center justify-between p-4 bg-white/80 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-body text-primary-dark font-medium">Current Device</p>
                            <p className="text-sm text-primary-dark/70">Chrome on Windows • Active now</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 font-body">Current</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'privacy' && (
                <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-primary-dark text-2xl">Privacy Settings</CardTitle>
                    <CardDescription className="font-body text-primary-dark/70">
                      Control your privacy and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                      <div>
                        <Label className="font-display text-primary-dark text-lg">Profile Visibility</Label>
                        <p className="text-sm font-body text-primary-dark/70">Control who can see your profile</p>
                      </div>
                      <select
                        value={settings.privacy.profile_visibility}
                        onChange={(e) => handleSettingsChange('privacy', 'profile_visibility', e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-body text-primary-dark"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                      <div>
                        <Label className="font-display text-primary-dark text-lg">Activity Status</Label>
                        <p className="text-sm font-body text-primary-dark/70">Show when you're online</p>
                      </div>
                      <Switch
                        checked={settings.privacy.activity_status}
                        onCheckedChange={(checked) => handleSettingsChange('privacy', 'activity_status', checked)}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                      <div>
                        <Label className="font-display text-primary-dark text-lg">Data Sharing</Label>
                        <p className="text-sm font-body text-primary-dark/70">Share usage data for improvements</p>
                      </div>
                      <Switch
                        checked={settings.privacy.data_sharing}
                        onCheckedChange={(checked) => handleSettingsChange('privacy', 'data_sharing', checked)}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
                      />
                    </div>

                    <Button onClick={handleSaveSettings} disabled={isSaving} className="btn-primary-enhanced font-display">
                      {isSaving ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Privacy Settings
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'preferences' && (
                <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-primary-dark text-2xl">App Preferences</CardTitle>
                    <CardDescription className="font-body text-primary-dark/70">
                      Customize your app experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div>
                      <Label className="font-display text-primary-dark text-lg">Theme</Label>
                      <p className="text-sm font-body text-primary-dark/70 mb-4">Choose your preferred app theme</p>
                      <div className="grid grid-cols-3 gap-4">
                        {['light', 'dark', 'system'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => handleSettingsChange('preferences', 'theme', theme)}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                              settings.preferences.theme === theme
                                ? 'border-primary bg-primary/10 shadow-lg'
                                : 'border-gray-300 hover:border-primary/50 bg-white/80'
                            }`}
                          >
                            {theme === 'light' && <Sun className="h-5 w-5 text-yellow-500" />}
                            {theme === 'dark' && <Moon className="h-5 w-5 text-gray-700" />}
                            {theme === 'system' && <Monitor className="h-5 w-5 text-blue-500" />}
                            <span className="font-body capitalize text-primary-dark">{theme}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="font-display text-primary-dark text-lg">Language</Label>
                      <p className="text-sm font-body text-primary-dark/70 mb-4">Select your preferred language</p>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => handleSettingsChange('preferences', 'language', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg font-body text-primary-dark"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <Button onClick={handleSaveSettings} disabled={isSaving} className="btn-primary-enhanced font-display">
                      {isSaving ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'data' && (
                <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-primary-dark text-2xl">Data & Storage</CardTitle>
                    <CardDescription className="font-body text-primary-dark/70">
                      Manage your data and account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="p-6 bg-blue-50/80 rounded-xl border border-blue-200/50">
                      <h3 className="font-display text-primary-dark text-lg mb-4">Storage Used</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div className="bg-primary h-3 rounded-full shadow-sm" style={{ width: '35%' }}></div>
                        </div>
                        <span className="font-body text-sm text-primary-dark font-medium">3.5 GB of 10 GB</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button onClick={handleExportData} variant="outline" className="w-full font-display justify-start h-16 border-primary/20 hover:bg-primary/5">
                        <Download className="h-5 w-5 mr-3 text-primary" />
                        <div className="text-left">
                          <div className="text-primary-dark">Export Account Data</div>
                          <div className="text-xs text-primary-dark/70">Download all your data in JSON format</div>
                        </div>
                      </Button>
                      
                      <Button onClick={() => setShowDeleteModal(true)} variant="destructive" className="w-full font-display justify-start h-16">
                        <Trash2 className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div>Delete Account</div>
                          <div className="text-xs opacity-80">Permanently remove your account</div>
                        </div>
                      </Button>
                    </div>

                    <div className="p-6 bg-yellow-50/80 border border-yellow-200/50 rounded-xl">
                      <div className="flex gap-4">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-display text-yellow-800 text-lg mb-2">Data Protection</h4>
                          <p className="font-body text-yellow-800 text-sm">
                            Your personal data is encrypted and stored securely. We never share your information 
                            with third parties without your explicit consent.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'help' && (
                <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-primary-dark text-2xl">Help & Support</CardTitle>
                    <CardDescription className="font-body text-primary-dark/70">
                      Get help and contact support
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Button variant="outline" className="h-20 font-display justify-start border-primary/20 hover:bg-primary/5">
                        <HelpCircle className="h-6 w-6 mr-4 text-primary" />
                        <div className="text-left">
                          <div className="text-primary-dark text-lg">Help Center</div>
                          <div className="text-sm text-primary-dark/70">Browse FAQ and guides</div>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="h-20 font-display justify-start border-primary/20 hover:bg-primary/5">
                        <Mail className="h-6 w-6 mr-4 text-primary" />
                        <div className="text-left">
                          <div className="text-primary-dark text-lg">Contact Support</div>
                          <div className="text-sm text-primary-dark/70">Get personalized help</div>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'about' && (
                <Card className="glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="font-display text-primary-dark text-2xl">About Quantime AI</CardTitle>
                    <CardDescription className="font-body text-primary-dark/70">
                      App information and version details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center py-8">
                      <div className="text-6xl mb-6">📅</div>
                      <h3 className="font-display text-3xl text-primary-dark mb-2">Quantime AI</h3>
                      <p className="font-body text-primary-dark/70 mb-6 text-lg">Smart Timetable Scheduling System</p>
                      <Badge className="glass-badge-primary font-body text-lg px-4 py-2">Version 1.0.0</Badge>
                    </div>
                    
                    <div className="space-y-4 p-6 bg-gray-50/80 rounded-xl border border-gray-200/50">
                      <div className="flex justify-between items-center">
                        <span className="font-display text-primary-dark">Last Updated</span>
                        <span className="font-body text-primary-dark/70">January 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-display text-primary-dark">Build</span>
                        <span className="font-body text-primary-dark/70">1.0.0-beta</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-display text-primary-dark">Developer</span>
                        <span className="font-body text-primary-dark/70">Quantime Team</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md glass-card-enhanced border-0 bg-white/95 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="font-display text-red-600 text-xl">Delete Account</CardTitle>
              <CardDescription className="font-body">
                This action cannot be undone. All your data will be permanently deleted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-body text-red-800 text-sm">
                  ⚠️ This will permanently delete your account, timetables, and all associated data.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 font-display"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex-1 font-display"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
