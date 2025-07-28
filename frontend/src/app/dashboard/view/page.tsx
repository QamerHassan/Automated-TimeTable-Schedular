"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Trash2, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type Timetable } from "@/lib/api"

export default function ViewPage() {
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  const loadTimetables = async () => {
    try {
      const response = await apiService.data()
      if (response.success && response.data) {
        setTimetables(response.data)
      }
    } catch (error) {
      console.error("Error loading timetables:", error)
      toast({
        title: "Loading failed",
        description: "Failed to load timetables",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTimetables()
  }, [])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await apiService.deleteTimetable(id)
      setTimetables(timetables.filter((t) => t.id !== id))
      toast({
        title: "Deleted!",
        description: "Timetable has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting timetable:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete timetable",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = (id: number) => {
    const downloadUrl = apiService.getDownloadUrl(id)
    window.open(downloadUrl, "_blank")
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const timeSlots = [
    "08:00 - 09:15",
    "09:30 - 10:45",
    "11:00 - 12:15",
    "12:30 - 13:45",
    "14:00 - 15:15",
    "15:30 - 16:45",
  ]
  const labSlots = ["08:00 - 10:30", "11:00 - 13:30", "14:00 - 16:30"]
  const allSlots = [...timeSlots, ...labSlots]

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading timetables...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">View Timetables</h1>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">
            {timetables.length} timetable{timetables.length !== 1 ? "s" : ""} saved
          </span>
        </div>
      </div>

      {timetables.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No timetables found</h3>
            <p className="text-muted-foreground text-center">Generate your first timetable to see it here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {timetables.map((timetable) => (
            <Card key={timetable.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Timetable for Semesters 1-{timetable.semester}</CardTitle>
                  <CardDescription>Created on {new Date(timetable.created_at).toLocaleDateString()}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(timetable.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(timetable.id)}
                    disabled={deletingId === timetable.id}
                  >
                    {deletingId === timetable.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(timetable.data).map(([semesterSection, schedule]) => (
                    <div key={semesterSection} className="space-y-4">
                      <h3 className="text-lg font-semibold">{semesterSection}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr>
                              <th className="border border-gray-300 p-2 bg-gray-50">Time</th>
                              {days.map((day) => (
                                <th key={day} className="border border-gray-300 p-2 bg-gray-50">
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {allSlots.map((slot) => (
                              <tr key={slot}>
                                <td className="border border-gray-300 p-2 font-medium bg-gray-50">{slot}</td>
                                {days.map((day) => {
                                  const cellContent = schedule[day]?.[slot]
                                  return (
                                    <td key={day} className="border border-gray-300 p-2 text-sm">
                                      {cellContent === "BLOCKED" ? (
                                        <span className="text-gray-400">-</span>
                                      ) : cellContent ? (
                                        <span className="text-blue-600">{cellContent}</span>
                                      ) : (
                                        <span className="text-gray-400">Free</span>
                                      )}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
