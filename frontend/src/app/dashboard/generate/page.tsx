"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, Loader2, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type TimetableData } from "@/lib/api"

export default function GeneratePage() {
  const [maxSemester, setMaxSemester] = useState<number>(8)
  const [file, setFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTimetable, setGeneratedTimetable] = useState<TimetableData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [useEnhancedMode, setUseEnhancedMode] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file && !useEnhancedMode) {
      toast({
        title: "No file selected",
        description: "Please upload an Excel file or enable enhanced mode",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      let response

      if (useEnhancedMode) {
        response = await fetch("http://localhost:8000/api/generate-enhanced/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            max_semester: maxSemester.toString(),
          }),
        })

        const result = await response.json()

        if (result.status === "success") {
          setGeneratedTimetable(result.schedule)

          if (result.conflicts && result.conflicts > 0) {
            toast({
              title: "Timetable Generated with Conflicts",
              description: `Generated timetable has ${result.conflicts} conflicts. Fitness: ${result.fitness}. Conflicts are flagged in red.`,
              variant: "default",
            })
          } else {
            toast({
              title: "Perfect Timetable Generated!",
              description: `Conflict-free timetable created. Fitness: ${result.fitness}`,
            })
          }
        } else {
          throw new Error(result.message || "Enhanced generation failed")
        }
      } else {
        const apiResponse = await apiService.generateTimetable(maxSemester, file!)
        setGeneratedTimetable(apiResponse.timetable_data)
        toast({
          title: "Success!",
          description: apiResponse.message,
        })
      }
    } catch (error) {
      console.error("Error generating timetable:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate timetable",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedTimetable) {
      console.log("No generated timetable to save")
      return
    }

    console.log("Attempting to save timetable:", {
      maxSemester,
      timetableData: generatedTimetable,
    })

    setIsSaving(true)

    try {
      if (useEnhancedMode) {
        const response = await fetch("http://localhost:8000/api/save/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedule: generatedTimetable,
            max_semester: maxSemester,
          }),
        })

        const result = await response.json()

        if (result.status === "success") {
          toast({
            title: "Saved!",
            description: "Enhanced timetable has been saved successfully",
          })
        } else {
          throw new Error(result.message || "Save failed")
        }
      } else {
        const response = await apiService.saveTimetable(maxSemester, generatedTimetable)
        console.log("Save response:", response)
        toast({
          title: "Saved!",
          description: "Timetable has been saved successfully",
        })
      }

      setGeneratedTimetable(null)
      setFile(null)
      setMaxSemester(8)
      setUseEnhancedMode(false)
    } catch (error) {
      console.error("Error saving timetable:", error)
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save timetable",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const timeSlots = [
    "08:00-09:15",
    "09:30-10:45",
    "11:00-12:15",
    "12:30-13:45",
    "14:00-15:15",
    "15:30-16:45",
    "17:00-18:15",
    "18:30-19:45",
    "20:00-21:15",
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display" style={{ color: "var(--foreground)" }}>
            Smart Timetable Generator
          </h1>
          <p className="text-muted-foreground font-ai mt-2">
            Upload your data and let quantum AI create the perfect schedule
          </p>
        </div>
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="font-display" style={{ color: "var(--foreground)" }}>
            Quantum Generation Options
          </CardTitle>
          <CardDescription className="font-ai" style={{ color: "var(--secondary-text)" }}>
            Choose between single-program upload or comprehensive multi-program generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Enhanced Mode Toggle */}
          <div className="mb-6 p-4 border rounded-lg glass-card">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enhancedMode"
                checked={useEnhancedMode}
                onChange={(e) => setUseEnhancedMode(e.target.checked)}
                className="w-4 h-4 text-primary accent-primary"
              />
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" style={{ color: "var(--primary)" }} />
                <Label
                  htmlFor="enhancedMode"
                  className="text-sm font-medium cursor-pointer font-ai"
                  style={{ color: "var(--foreground)" }}
                >
                  Enhanced Mode - Generate from comprehensive database (All 6 programs, 240+ rooms)
                </Label>
              </div>
            </div>
            {useEnhancedMode && (
              <p className="mt-2 text-xs font-ai" style={{ color: "var(--primary)" }}>
                Using pre-loaded institutional data with Genetic Algorithm optimization
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxSemester" className="font-ai" style={{ color: "var(--foreground)" }}>
                  Maximum Semester
                </Label>
                <Input
                  id="maxSemester"
                  type="number"
                  min="1"
                  max="8"
                  value={maxSemester}
                  onChange={(e) => setMaxSemester(Number.parseInt(e.target.value))}
                  required
                  className="font-ai"
                />
                {useEnhancedMode && (
                  <p className="text-xs font-ai" style={{ color: "var(--secondary-text)" }}>
                    Recommended: 8 (covers all programs in database)
                  </p>
                )}
              </div>

              {!useEnhancedMode && (
                <div className="space-y-2">
                  <Label htmlFor="file" className="font-ai" style={{ color: "var(--foreground)" }}>
                    Course Data File
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="file"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      required
                      className="font-ai"
                    />
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {file && (
                    <p className="text-sm font-ai" style={{ color: "var(--secondary-text)" }}>
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-primary text-lg py-6 rounded-xl font-display"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {useEnhancedMode ? "Running Genetic Algorithm..." : "Generating Perfect Timetable..."}
                </>
              ) : (
                <>
                  {useEnhancedMode ? <Database className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                  {useEnhancedMode ? "Generate Multi-Program Timetable" : "Generate Perfect Timetable"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedTimetable && (
        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display" style={{ color: "var(--foreground)" }}>
                Generated Smart Schedule
              </CardTitle>
              <CardDescription className="font-ai" style={{ color: "var(--secondary-text)" }}>
                {useEnhancedMode
                  ? "Multi-program institutional timetable with Genetic Algorithm optimization"
                  : "Review the generated timetable before saving"}
              </CardDescription>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="btn-primary font-display">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save to Smart Network"
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(generatedTimetable).map(([semesterSection, schedule]) => (
                <div key={semesterSection} className="space-y-4">
                  <h3 className="text-lg font-semibold font-display" style={{ color: "var(--foreground)" }}>
                    {semesterSection}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
                          <th
                            className="border border-gray-300 p-3 font-ai font-semibold"
                            style={{ color: "var(--foreground)" }}
                          >
                            Time
                          </th>
                          {days.map((day) => (
                            <th
                              key={day}
                              className="border border-gray-300 p-3 font-ai font-semibold"
                              style={{ color: "var(--foreground)" }}
                            >
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((slot, index) => (
                          <tr key={slot} className={index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"}>
                            <td
                              className="border border-gray-300 p-3 font-medium font-ai"
                              style={{ color: "var(--foreground)" }}
                            >
                              {slot.replace("-", " - ")}
                            </td>
                            {days.map((day) => {
                              const cellContent = schedule[day]?.[slot]
                              return (
                                <td key={day} className="border border-gray-300 p-2 text-sm font-ai min-h-[60px]">
                                  {cellContent === "BLOCKED" ? (
                                    <span className="text-gray-400 text-center block">-</span>
                                  ) : cellContent ? (
                                    <div
                                      className={`p-2 rounded-lg text-center min-h-[50px] flex items-center justify-center ${
                                        cellContent.includes("CONFLICT") ? "bg-red-500 text-white" : "text-white"
                                      }`}
                                      style={
                                        !cellContent.includes("CONFLICT") ? { backgroundColor: "var(--primary)" } : {}
                                      }
                                    >
                                      <div>
                                        <div className="font-semibold text-xs leading-tight">
                                          {cellContent.split(" - Room")[0]}
                                        </div>
                                        {cellContent.includes(" - Room") && !cellContent.includes("CONFLICT") && (
                                          <div className="text-xs opacity-80 mt-1">
                                            {cellContent.split(" - Room")[1]
                                              ? `Room ${cellContent.split(" - Room")[1]}`
                                              : ""}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-center block">Free</span>
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
      )}
    </div>
  )
}
