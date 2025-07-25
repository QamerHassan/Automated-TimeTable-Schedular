"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export function DebugMenu() {
  const { user } = useAuth()
  const [clickCount, setClickCount] = useState(0)
  const [showMenu, setShowMenu] = useState(false)

  if (!user) return null

  const handleClick = () => {
    console.log("DEBUG: Button clicked!")
    setClickCount((prev) => prev + 1)
    setShowMenu(!showMenu)
    alert(`Button clicked ${clickCount + 1} times!`)
  }

  return (
    <div className="relative">
      <Button onClick={handleClick} className="bg-red-500 hover:bg-red-600 text-white">
        DEBUG MENU ({clickCount})
      </Button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
          <div className="p-4">
            <p>Menu is working!</p>
            <p>User: {user.username}</p>
            <p>Clicks: {clickCount}</p>
          </div>
        </div>
      )}
    </div>
  )
}
