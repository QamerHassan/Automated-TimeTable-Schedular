// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Upload, FileSpreadsheet, Loader2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { apiService, type TimetableData } from "@/lib/api"

// export default function GeneratePage() {
//   const [maxSemester, setMaxSemester] = useState<number>(4)
//   const [file, setFile] = useState<File | null>(null)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generatedTimetable, setGeneratedTimetable] = useState<TimetableData | null>(null)
//   const [isSaving, setIsSaving] = useState(false)
//   const { toast } = useToast()

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile) {
//       // Validate file type
//       if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
//         toast({
//           title: "Invalid file type",
//           description: "Please upload an Excel file (.xlsx or .xls)",
//           variant: "destructive",
//         })
//         return
//       }
//       setFile(selectedFile)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!file) {
//       toast({
//         title: "No file selected",
//         description: "Please upload an Excel file with course data",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGenerating(true)

//     try {
//       const response = await apiService.generateTimetable(maxSemester, file)

//       setGeneratedTimetable(response.timetable_data)
//       toast({
//         title: "Success!",
//         description: response.message,
//       })
//     } catch (error) {
//       console.error("Error generating timetable:", error)
//       toast({
//         title: "Generation failed",
//         description: error instanceof Error ? error.message : "Failed to generate timetable",
//         variant: "destructive",
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleSave = async () => {
//     if (!generatedTimetable) return

//     setIsSaving(true)

//     try {
//       await apiService.saveTimetable(maxSemester, generatedTimetable)

//       toast({
//         title: "Saved!",
//         description: "Timetable has been saved successfully",
//       })

//       // Reset form
//       setGeneratedTimetable(null)
//       setFile(null)
//       setMaxSemester(4)
//     } catch (error) {
//       console.error("Error saving timetable:", error)
//       toast({
//         title: "Save failed",
//         description: error instanceof Error ? error.message : "Failed to save timetable",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
//   const timeSlots = [
//     "08:00 - 09:15",
//     "09:30 - 10:45",
//     "11:00 - 12:15",
//     "12:30 - 13:45",
//     "14:00 - 15:15",
//     "15:30 - 16:45",
//   ]
//   const labSlots = ["08:00 - 10:30", "11:00 - 13:30", "14:00 - 16:30"]
//   const allSlots = [...timeSlots, ...labSlots]

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Generate Timetable</h1>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Upload Course Data</CardTitle>
//           <CardDescription>Upload an Excel file containing course information, rooms, and student data</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="maxSemester">Maximum Semester</Label>
//                 <Input
//                   id="maxSemester"
//                   type="number"
//                   min="1"
//                   max="8"
//                   value={maxSemester}
//                   onChange={(e) => setMaxSemester(Number.parseInt(e.target.value))}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="file">Course Data File</Label>
//                 <div className="flex items-center space-x-2">
//                   <Input id="file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} required />
//                   <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
//               </div>
//             </div>

//             <Button type="submit" disabled={isGenerating} className="w-full">
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Generating Perfect Timetable...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="mr-2 h-4 w-4" />
//                   Generate Perfect Timetable
//                 </>
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {generatedTimetable && (
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <div>
//               <CardTitle>Generated Timetable Preview</CardTitle>
//               <CardDescription>Review the generated timetable before saving</CardDescription>
//             </div>
//             <Button onClick={handleSave} disabled={isSaving}>
//               {isSaving ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Timetable"
//               )}
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {Object.entries(generatedTimetable).map(([semesterSection, schedule]) => (
//                 <div key={semesterSection} className="space-y-4">
//                   <h3 className="text-lg font-semibold">{semesterSection}</h3>
//                   <div className="overflow-x-auto">
//                     <table className="w-full border-collapse border border-gray-300">
//                       <thead>
//                         <tr>
//                           <th className="border border-gray-300 p-2 bg-gray-50">Time</th>
//                           {days.map((day) => (
//                             <th key={day} className="border border-gray-300 p-2 bg-gray-50">
//                               {day}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {allSlots.map((slot) => (
//                           <tr key={slot}>
//                             <td className="border border-gray-300 p-2 font-medium bg-gray-50">{slot}</td>
//                             {days.map((day) => {
//                               const cellContent = schedule[day]?.[slot]
//                               return (
//                                 <td key={day} className="border border-gray-300 p-2 text-sm">
//                                   {cellContent === "BLOCKED" ? (
//                                     <span className="text-gray-400">-</span>
//                                   ) : cellContent ? (
//                                     <span className="text-blue-600">{cellContent}</span>
//                                   ) : (
//                                     <span className="text-gray-400">Free</span>
//                                   )}
//                                 </td>
//                               )
//                             })}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type TimetableData } from "@/lib/api"

export default function GeneratePage() {
  const [maxSemester, setMaxSemester] = useState<number>(4)
  const [file, setFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTimetable, setGeneratedTimetable] = useState<TimetableData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
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

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an Excel file with course data",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await apiService.generateTimetable(maxSemester, file)

      setGeneratedTimetable(response.timetable_data)
      toast({
        title: "Success!",
        description: response.message,
      })
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
      const response = await apiService.saveTimetable(maxSemester, generatedTimetable)
      console.log("Save response:", response)

      toast({
        title: "Saved!",
        description: "Timetable has been saved successfully",
      })

      // Reset form
      setGeneratedTimetable(null)
      setFile(null)
      setMaxSemester(4)

      // Optional: Redirect to view page
      // window.location.href = '/dashboard/view'
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Generate Timetable</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Course Data</CardTitle>
          <CardDescription>Upload an Excel file containing course information, rooms, and student data</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxSemester">Maximum Semester</Label>
                <Input
                  id="maxSemester"
                  type="number"
                  min="1"
                  max="8"
                  value={maxSemester}
                  onChange={(e) => setMaxSemester(Number.parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Course Data File</Label>
                <div className="flex items-center space-x-2">
                  <Input id="file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} required />
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                </div>
                {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
              </div>
            </div>

            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Perfect Timetable...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Generate Perfect Timetable
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedTimetable && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Timetable Preview</CardTitle>
              <CardDescription>Review the generated timetable before saving</CardDescription>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Timetable"
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(generatedTimetable).map(([semesterSection, schedule]) => (
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
      )}
    </div>
  )
}
