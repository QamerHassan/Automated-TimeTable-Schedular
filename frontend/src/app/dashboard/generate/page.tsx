// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Upload, FileSpreadsheet, Loader2, Database } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { apiService, type TimetableData } from "@/lib/api"

// export default function GeneratePage() {
//   const [maxSemester, setMaxSemester] = useState<number>(8)
//   const [file, setFile] = useState<File | null>(null)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generatedTimetable, setGeneratedTimetable] = useState<TimetableData | null>(null)
//   const [isSaving, setIsSaving] = useState(false)
//   const [useEnhancedMode, setUseEnhancedMode] = useState(false)
//   const { toast } = useToast()

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile) {
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

//     if (!file && !useEnhancedMode) {
//       toast({
//         title: "No file selected",
//         description: "Please upload an Excel file or enable enhanced mode",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGenerating(true)

//     try {
//       let response

//       if (useEnhancedMode) {
//         response = await fetch("http://localhost:8000/api/generate-enhanced/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             max_semester: maxSemester.toString(),
//           }),
//         })

//         const result = await response.json()

//         if (result.status === "success") {
//           setGeneratedTimetable(result.schedule)

//           if (result.conflicts && result.conflicts > 0) {
//             toast({
//               title: "Timetable Generated with Conflicts",
//               description: `Generated timetable has ${result.conflicts} conflicts. Fitness: ${result.fitness}. Conflicts are flagged in red.`,
//               variant: "default",
//             })
//           } else {
//             toast({
//               title: "Perfect Timetable Generated!",
//               description: `Conflict-free timetable created. Fitness: ${result.fitness}`,
//             })
//           }
//         } else {
//           throw new Error(result.message || "Enhanced generation failed")
//         }
//       } else {
//         const apiResponse = await apiService.generateTimetable(maxSemester, file!)
//         setGeneratedTimetable(apiResponse.timetable_data)
//         toast({
//           title: "Success!",
//           description: apiResponse.message,
//         })
//       }
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
//     if (!generatedTimetable) {
//       console.log("No generated timetable to save")
//       return
//     }

//     console.log("Attempting to save timetable:", {
//       maxSemester,
//       timetableData: generatedTimetable,
//     })

//     setIsSaving(true)

//     try {
//       if (useEnhancedMode) {
//         const response = await fetch("http://localhost:8000/api/save/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             schedule: generatedTimetable,
//             max_semester: maxSemester,
//           }),
//         })

//         const result = await response.json()

//         if (result.status === "success") {
//           toast({
//             title: "Saved!",
//             description: "Enhanced timetable has been saved successfully",
//           })
//         } else {
//           throw new Error(result.message || "Save failed")
//         }
//       } else {
//         const response = await apiService.saveTimetable(maxSemester, generatedTimetable)
//         console.log("Save response:", response)
//         toast({
//           title: "Saved!",
//           description: "Timetable has been saved successfully",
//         })
//       }

//       setGeneratedTimetable(null)
//       setFile(null)
//       setMaxSemester(8)
//       setUseEnhancedMode(false)
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

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//   const timeSlots = [
//     "08:00-09:15",
//     "09:30-10:45",
//     "11:00-12:15",
//     "12:30-13:45",
//     "14:00-15:15",
//     "15:30-16:45",
//     "17:00-18:15",
//     "18:30-19:45",
//     "20:00-21:15",
//   ]

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold font-display" style={{ color: "var(--foreground)" }}>
//             Smart Timetable Generator
//           </h1>
//           <p className="text-muted-foreground font-ai mt-2">
//             Upload your data and let quantum AI create the perfect schedule
//           </p>
//         </div>
//       </div>

//       <Card className="glass-card border-0">
//         <CardHeader>
//           <CardTitle className="font-display" style={{ color: "var(--foreground)" }}>
//             Quantum Generation Options
//           </CardTitle>
//           <CardDescription className="font-ai" style={{ color: "var(--secondary-text)" }}>
//             Choose between single-program upload or comprehensive multi-program generation
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* Enhanced Mode Toggle */}
//           <div className="mb-6 p-4 border rounded-lg glass-card">
//             <div className="flex items-center space-x-3">
//               <input
//                 type="checkbox"
//                 id="enhancedMode"
//                 checked={useEnhancedMode}
//                 onChange={(e) => setUseEnhancedMode(e.target.checked)}
//                 className="w-4 h-4 text-primary accent-primary"
//               />
//               <div className="flex items-center space-x-2">
//                 <Database className="h-5 w-5" style={{ color: "var(--primary)" }} />
//                 <Label
//                   htmlFor="enhancedMode"
//                   className="text-sm font-medium cursor-pointer font-ai"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   Enhanced Mode - Generate from comprehensive database (All 6 programs, 240+ rooms)
//                 </Label>
//               </div>
//             </div>
//             {useEnhancedMode && (
//               <p className="mt-2 text-xs font-ai" style={{ color: "var(--primary)" }}>
//                 Using pre-loaded institutional data with Genetic Algorithm optimization
//               </p>
//             )}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="maxSemester" className="font-ai" style={{ color: "var(--foreground)" }}>
//                   Maximum Semester
//                 </Label>
//                 <Input
//                   id="maxSemester"
//                   type="number"
//                   min="1"
//                   max="8"
//                   value={maxSemester}
//                   onChange={(e) => setMaxSemester(Number.parseInt(e.target.value))}
//                   required
//                   className="font-ai"
//                 />
//                 {useEnhancedMode && (
//                   <p className="text-xs font-ai" style={{ color: "var(--secondary-text)" }}>
//                     Recommended: 8 (covers all programs in database)
//                   </p>
//                 )}
//               </div>

//               {!useEnhancedMode && (
//                 <div className="space-y-2">
//                   <Label htmlFor="file" className="font-ai" style={{ color: "var(--foreground)" }}>
//                     Course Data File
//                   </Label>
//                   <div className="flex items-center space-x-2">
//                     <Input
//                       id="file"
//                       type="file"
//                       accept=".xlsx,.xls"
//                       onChange={handleFileChange}
//                       required
//                       className="font-ai"
//                     />
//                     <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   {file && (
//                     <p className="text-sm font-ai" style={{ color: "var(--secondary-text)" }}>
//                       Selected: {file.name}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             <Button
//               type="submit"
//               disabled={isGenerating}
//               className="w-full btn-primary text-lg py-6 rounded-xl font-display"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   {useEnhancedMode ? "Running Genetic Algorithm..." : "Generating Perfect Timetable..."}
//                 </>
//               ) : (
//                 <>
//                   {useEnhancedMode ? <Database className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
//                   {useEnhancedMode ? "Generate Multi-Program Timetable" : "Generate Perfect Timetable"}
//                 </>
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {generatedTimetable && (
//         <Card className="glass-card border-0">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <div>
//               <CardTitle className="font-display" style={{ color: "var(--foreground)" }}>
//                 Generated Smart Schedule
//               </CardTitle>
//               <CardDescription className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                 {useEnhancedMode
//                   ? "Multi-program institutional timetable with Genetic Algorithm optimization"
//                   : "Review the generated timetable before saving"}
//               </CardDescription>
//             </div>
//             <Button onClick={handleSave} disabled={isSaving} className="btn-primary font-display">
//               {isSaving ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save to Smart Network"
//               )}
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {Object.entries(generatedTimetable).map(([semesterSection, schedule]) => (
//                 <div key={semesterSection} className="space-y-4">
//                   <h3 className="text-lg font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                     {semesterSection}
//                   </h3>
//                   <div className="overflow-x-auto">
//                     <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
//                       <thead>
//                         <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
//                           <th
//                             className="border border-gray-300 p-3 font-ai font-semibold"
//                             style={{ color: "var(--foreground)" }}
//                           >
//                             Time
//                           </th>
//                           {days.map((day) => (
//                             <th
//                               key={day}
//                               className="border border-gray-300 p-3 font-ai font-semibold"
//                               style={{ color: "var(--foreground)" }}
//                             >
//                               {day}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {timeSlots.map((slot, index) => (
//                           <tr key={slot} className={index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"}>
//                             <td
//                               className="border border-gray-300 p-3 font-medium font-ai"
//                               style={{ color: "var(--foreground)" }}
//                             >
//                               {slot.replace("-", " - ")}
//                             </td>
//                             {days.map((day) => {
//                               const cellContent = schedule[day]?.[slot]
//                               return (
//                                 <td key={day} className="border border-gray-300 p-2 text-sm font-ai min-h-[60px]">
//                                   {cellContent === "BLOCKED" ? (
//                                     <span className="text-gray-400 text-center block">-</span>
//                                   ) : cellContent ? (
//                                     <div
//                                       className={`p-2 rounded-lg text-center min-h-[50px] flex items-center justify-center ${
//                                         cellContent.includes("CONFLICT") ? "bg-red-500 text-white" : "text-white"
//                                       }`}
//                                       style={
//                                         !cellContent.includes("CONFLICT") ? { backgroundColor: "var(--primary)" } : {}
//                                       }
//                                     >
//                                       <div>
//                                         <div className="font-semibold text-xs leading-tight">
//                                           {cellContent.split(" - Room")[0]}
//                                         </div>
//                                         {cellContent.includes(" - Room") && !cellContent.includes("CONFLICT") && (
//                                           <div className="text-xs opacity-80 mt-1">
//                                             {cellContent.split(" - Room")[1]
//                                               ? `Room ${cellContent.split(" - Room")[1]}`
//                                               : ""}
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <span className="text-gray-400 text-center block">Free</span>
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







// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useAuth } from "@/contexts/auth-context"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Upload, Zap, Brain, Settings, AlertCircle } from "lucide-react"
// import { MainNav } from "@/components/main-nav"
// import { Footer } from "@/components/footer"

// export default function GeneratePage() {
//   const { user } = useAuth()
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generationSettings, setGenerationSettings] = useState({
//     algorithm: "enhanced",
//     optimization: "balanced",
//     constraints: "standard",
//   })

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       setUploadedFile(file)
//     }
//   }

//   const handleGenerate = async () => {
//     if (!uploadedFile) return

//     setIsGenerating(true)
//     // Simulate generation process
//     setTimeout(() => {
//       setIsGenerating(false)
//     }, 5000)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted">
//       <MainNav />

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold font-display text-gray-800 mb-4">Quantum Timetable Generator</h1>
//             <p className="text-xl font-ai text-gray-600">Upload your data and let our AI create the perfect schedule</p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8">
//             {/* Upload Section */}
//             <Card className="glass-card-enhanced border-0 bg-white/90">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 font-display text-gray-800">
//                   <Upload className="h-5 w-5 text-primary" />
//                   Data Upload
//                 </CardTitle>
//                 <CardDescription className="font-ai text-gray-600">
//                   Upload your course, faculty, and room data
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <Label htmlFor="file-upload" className="font-ai text-gray-800">
//                     Excel/CSV File
//                   </Label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
//                     <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
//                     <p className="text-sm font-ai text-gray-600 mb-2">
//                       Drag and drop your file here, or click to browse
//                     </p>
//                     <Input
//                       id="file-upload"
//                       type="file"
//                       accept=".xlsx,.xls,.csv"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                     />
//                     <Button
//                       variant="outline"
//                       onClick={() => document.getElementById("file-upload")?.click()}
//                       className="font-display"
//                     >
//                       Choose File
//                     </Button>
//                   </div>
//                   {uploadedFile && (
//                     <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
//                       <Upload className="h-4 w-4 text-green-600" />
//                       <span className="text-sm font-ai text-green-800">{uploadedFile.name}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   <Label className="font-ai text-gray-800">Additional Notes</Label>
//                   <Textarea
//                     placeholder="Any specific requirements or constraints..."
//                     className="font-ai bg-white border-gray-300 text-gray-800 placeholder-gray-500"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Settings Section */}
//             <Card className="glass-card-enhanced border-0 bg-white/90">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 font-display text-gray-800">
//                   <Settings className="h-5 w-5 text-primary" />
//                   Generation Settings
//                 </CardTitle>
//                 <CardDescription className="font-ai text-gray-600">
//                   Configure your timetable generation preferences
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="font-ai text-gray-800">Algorithm Type</Label>
//                     <Select
//                       value={generationSettings.algorithm}
//                       onValueChange={(value) => setGenerationSettings({ ...generationSettings, algorithm: value })}
//                     >
//                       <SelectTrigger className="font-ai">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="enhanced">Enhanced Genetic Algorithm</SelectItem>
//                         <SelectItem value="quantum">Quantum Optimization</SelectItem>
//                         <SelectItem value="hybrid">Hybrid AI Approach</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="font-ai text-gray-800">Optimization Focus</Label>
//                     <Select
//                       value={generationSettings.optimization}
//                       onValueChange={(value) => setGenerationSettings({ ...generationSettings, optimization: value })}
//                     >
//                       <SelectTrigger className="font-ai">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="balanced">Balanced Optimization</SelectItem>
//                         <SelectItem value="time">Time Efficiency</SelectItem>
//                         <SelectItem value="resource">Resource Utilization</SelectItem>
//                         <SelectItem value="conflict">Conflict Minimization</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label className="font-ai text-gray-800">Constraint Level</Label>
//                     <Select
//                       value={generationSettings.constraints}
//                       onValueChange={(value) => setGenerationSettings({ ...generationSettings, constraints: value })}
//                     >
//                       <SelectTrigger className="font-ai">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="flexible">Flexible</SelectItem>
//                         <SelectItem value="standard">Standard</SelectItem>
//                         <SelectItem value="strict">Strict</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//                   <div className="flex items-start gap-2">
//                     <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
//                     <div className="text-sm font-ai text-blue-800">
//                       <p className="font-semibold mb-1">Pro Tip:</p>
//                       <p>Use "Enhanced Genetic Algorithm" with "Balanced Optimization" for best results.</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Generate Button */}
//           <div className="mt-8 text-center">
//             <Button
//               onClick={handleGenerate}
//               disabled={!uploadedFile || isGenerating}
//               className="btn-primary-enhanced text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-display"
//             >
//               {isGenerating ? (
//                 <>
//                   <Brain className="mr-3 h-6 w-6 animate-pulse" />
//                   Quantum Processing... Please Wait
//                 </>
//               ) : (
//                 <>
//                   <Zap className="mr-3 h-6 w-6" />
//                   Generate Smart Timetable
//                 </>
//               )}
//             </Button>
//           </div>

//           {/* Results Section (shown when generating or completed) */}
//           {isGenerating && (
//             <Card className="glass-card-enhanced border-0 bg-white/90 mt-8">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 font-display text-gray-800">
//                   <Brain className="h-5 w-5 text-primary animate-pulse" />
//                   Generation Progress
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between text-sm font-ai">
//                     <span className="text-gray-600">Parsing data...</span>
//                     <span className="text-green-600">✓ Complete</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm font-ai">
//                     <span className="text-gray-600">Analyzing constraints...</span>
//                     <span className="text-green-600">✓ Complete</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm font-ai">
//                     <span className="text-gray-600">Optimizing schedule...</span>
//                     <span className="text-blue-600 animate-pulse">⟳ Processing</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm font-ai">
//                     <span className="text-gray-600">Validating results...</span>
//                     <span className="text-gray-400">⏳ Pending</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   )
// }






































// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Upload, FileSpreadsheet, Loader2, Database, Zap, Brain } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { apiService, type TimetableData } from "@/lib/api"
// import { MainNav } from "@/components/main-nav"
// import { Footer } from "@/components/footer"

// export default function GeneratePage() {
//   const [maxSemester, setMaxSemester] = useState<number>(8)
//   const [file, setFile] = useState<File | null>(null)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generatedTimetable, setGeneratedTimetable] = useState<TimetableData | null>(null)
//   const [isSaving, setIsSaving] = useState(false)
//   const [useEnhancedMode, setUseEnhancedMode] = useState(false)
//   const { toast } = useToast()

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile) {
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

//     if (!file && !useEnhancedMode) {
//       toast({
//         title: "No file selected",
//         description: "Please upload an Excel file or enable enhanced mode",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGenerating(true)

//     try {
//       let response

//       if (useEnhancedMode) {
//         response = await fetch("http://localhost:8000/api/generate-enhanced/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             max_semester: maxSemester.toString(),
//           }),
//         })

//         const result = await response.json()

//         if (result.status === "success") {
//           setGeneratedTimetable(result.schedule)

//           if (result.conflicts && result.conflicts > 0) {
//             toast({
//               title: "Timetable Generated with Conflicts",
//               description: `Generated timetable has ${result.conflicts} conflicts. Fitness: ${result.fitness}. Conflicts are flagged in red.`,
//               variant: "default",
//             })
//           } else {
//             toast({
//               title: "Perfect Timetable Generated!",
//               description: `Conflict-free timetable created. Fitness: ${result.fitness}`,
//             })
//           }
//         } else {
//           throw new Error(result.message || "Enhanced generation failed")
//         }
//       } else {
//         const apiResponse = await apiService.generateTimetable(maxSemester, file!)
//         setGeneratedTimetable(apiResponse.timetable_data)
//         toast({
//           title: "Success!",
//           description: apiResponse.message,
//         })
//       }
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
//     if (!generatedTimetable) {
//       console.log("No generated timetable to save")
//       return
//     }

//     setIsSaving(true)

//     try {
//       if (useEnhancedMode) {
//         const response = await fetch("http://localhost:8000/api/save/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             schedule: generatedTimetable,
//             max_semester: maxSemester,
//           }),
//         })

//         const result = await response.json()

//         if (result.status === "success") {
//           toast({
//             title: "Saved!",
//             description: "Enhanced timetable has been saved successfully",
//           })
//         } else {
//           throw new Error(result.message || "Save failed")
//         }
//       } else {
//         const response = await apiService.saveTimetable(maxSemester, generatedTimetable)
//         toast({
//           title: "Saved!",
//           description: "Timetable has been saved successfully",
//         })
//       }

//       setGeneratedTimetable(null)
//       setFile(null)
//       setMaxSemester(8)
//       setUseEnhancedMode(false)
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

//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//   const timeSlots = [
//     "08:00-09:15",
//     "09:30-10:45",
//     "11:00-12:15",
//     "12:30-13:45",
//     "14:00-15:15",
//     "15:30-16:45",
//     "17:00-18:15",
//     "18:30-19:45",
//     "20:00-21:15",
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted">
//       <MainNav />

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold font-hero text-primary-dark mb-4">Quantum Timetable Generator</h1>
//             <p className="text-xl font-body text-primary-dark/70">Upload your data and let our AI create the perfect schedule</p>
//           </div>

//           <Card className="glass-card-enhanced border-0 bg-white/90 mb-8">
//             <CardHeader>
//               <CardTitle className="font-display text-primary-dark">
//                 Quantum Generation Options
//               </CardTitle>
//               <CardDescription className="font-body text-primary-dark/70">
//                 Choose between single-program upload or comprehensive multi-program generation
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {/* Enhanced Mode Toggle */}
//               <div className="mb-6 p-4 border rounded-lg glass-card-enhanced bg-white/50">
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="checkbox"
//                     id="enhancedMode"
//                     checked={useEnhancedMode}
//                     onChange={(e) => setUseEnhancedMode(e.target.checked)}
//                     className="w-4 h-4 text-primary accent-primary"
//                   />
//                   <div className="flex items-center space-x-2">
//                     <Database className="h-5 w-5 text-primary" />
//                     <Label
//                       htmlFor="enhancedMode"
//                       className="text-sm font-medium cursor-pointer font-body text-primary-dark"
//                     >
//                       Enhanced Mode - Generate from comprehensive database (All 6 programs, 240+ rooms)
//                     </Label>
//                   </div>
//                 </div>
//                 {useEnhancedMode && (
//                   <p className="mt-2 text-xs font-body text-primary">
//                     Using pre-loaded institutional data with Genetic Algorithm optimization
//                   </p>
//                 )}
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="maxSemester" className="font-body text-primary-dark">
//                       Maximum Semester
//                     </Label>
//                     <Input
//                       id="maxSemester"
//                       type="number"
//                       min="1"
//                       max="8"
//                       value={maxSemester}
//                       onChange={(e) => setMaxSemester(Number.parseInt(e.target.value))}
//                       required
//                       className="font-body bg-white border-gray-300 text-primary-dark"
//                     />
//                     {useEnhancedMode && (
//                       <p className="text-xs font-body text-primary-dark/70">
//                         Recommended: 8 (covers all programs in database)
//                       </p>
//                     )}
//                   </div>

//                   {!useEnhancedMode && (
//                     <div className="space-y-2">
//                       <Label htmlFor="file" className="font-body text-primary-dark">
//                         Course Data File
//                       </Label>
//                       <div className="flex items-center space-x-2">
//                         <Input
//                           id="file"
//                           type="file"
//                           accept=".xlsx,.xls"
//                           onChange={handleFileChange}
//                           required
//                           className="font-body bg-white border-gray-300 text-primary-dark"
//                         />
//                         <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
//                       </div>
//                       {file && (
//                         <p className="text-sm font-body text-primary-dark/70">
//                           Selected: {file.name}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={isGenerating}
//                   className="w-full btn-primary-enhanced text-lg py-6 rounded-xl font-display"
//                 >
//                   {isGenerating ? (
//                     <>
//                       <Brain className="mr-2 h-5 w-5 animate-pulse" />
//                       {useEnhancedMode ? "Running Genetic Algorithm..." : "Generating Perfect Timetable..."}
//                     </>
//                   ) : (
//                     <>
//                       {useEnhancedMode ? <Database className="mr-2 h-5 w-5" /> : <Zap className="mr-2 h-5 w-5" />}
//                       {useEnhancedMode ? "Generate Multi-Program Timetable" : "Generate Perfect Timetable"}
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {generatedTimetable && (
//             <Card className="glass-card-enhanced border-0 bg-white/90">
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <div>
//                   <CardTitle className="font-display text-primary-dark">
//                     Generated Smart Schedule
//                   </CardTitle>
//                   <CardDescription className="font-body text-primary-dark/70">
//                     {useEnhancedMode
//                       ? "Multi-program institutional timetable with Genetic Algorithm optimization"
//                       : "Review the generated timetable before saving"}
//                   </CardDescription>
//                 </div>
//                 <Button onClick={handleSave} disabled={isSaving} className="btn-primary-enhanced font-display">
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save to Smart Network"
//                   )}
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {Object.entries(generatedTimetable).map(([semesterSection, schedule]) => (
//                     <div key={semesterSection} className="space-y-4">
//                       <h3 className="text-lg font-semibold font-display text-primary-dark">
//                         {semesterSection}
//                       </h3>
//                       <div className="overflow-x-auto">
//                         <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
//                           <thead>
//                             <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
//                               <th className="border border-gray-300 p-3 font-body font-semibold text-primary-dark">
//                                 Time
//                               </th>
//                               {days.map((day) => (
//                                 <th
//                                   key={day}
//                                   className="border border-gray-300 p-3 font-body font-semibold text-primary-dark"
//                                 >
//                                   {day}
//                                 </th>
//                               ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {timeSlots.map((slot, index) => (
//                               <tr key={slot} className={index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"}>
//                                 <td className="border border-gray-300 p-3 font-medium font-body text-primary-dark">
//                                   {slot.replace("-", " - ")}
//                                 </td>
//                                 {days.map((day) => {
//                                   const cellContent = schedule[day]?.[slot]
//                                   return (
//                                     <td key={day} className="border border-gray-300 p-2 text-sm font-body min-h-[60px]">
//                                       {cellContent === "BLOCKED" ? (
//                                         <span className="text-gray-400 text-center block">-</span>
//                                       ) : cellContent ? (
//                                         <div
//                                           className={`p-2 rounded-lg text-center min-h-[50px] flex items-center justify-center ${
//                                             cellContent.includes("CONFLICT") ? "bg-red-500 text-white" : "text-white"
//                                           }`}
//                                           style={
//                                             !cellContent.includes("CONFLICT") ? { backgroundColor: "var(--primary)" } : {}
//                                           }
//                                         >
//                                           <div>
//                                             <div className="font-semibold text-xs leading-tight">
//                                               {cellContent.split(" - Room")[0]}
//                                             </div>
//                                             {cellContent.includes(" - Room") && !cellContent.includes("CONFLICT") && (
//                                               <div className="text-xs opacity-80 mt-1">
//                                                 {cellContent.split(" - Room")[1]
//                                                   ? `Room ${cellContent.split(" - Room")[1]}`
//                                                   : ""}
//                                               </div>
//                                             )}
//                                           </div>
//                                         </div>
//                                       ) : (
//                                         <span className="text-gray-400 text-center block">Free</span>
//                                       )}
//                                     </td>
//                                   )
//                                 })}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       <Footer />
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
import { Upload, FileSpreadsheet, Loader2, Database, Zap, Brain } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService, type TimetableData } from "@/lib/api"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

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
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <MainNav />

        {/* Main Content Container - Expanded width and proper spacing */}
        <div className="container mx-auto px-4 py-8 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold font-hero text-primary-dark mb-4">Quantum Timetable Generator</h1>
              <p className="text-xl font-body text-primary-dark/70">Upload your data and let our AI create the perfect schedule</p>
            </div>

            {/* Main Generation Card - Expanded */}
            <Card className="glass-card-enhanced border-0 bg-white/90 mb-12">
              <CardHeader className="pb-6">
                <CardTitle className="font-display text-primary-dark text-2xl">
                  Quantum Generation Options
                </CardTitle>
                <CardDescription className="font-body text-primary-dark/70 text-lg">
                  Choose between single-program upload or comprehensive multi-program generation
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 py-6">
                {/* Enhanced Mode Toggle - Improved spacing */}
                <div className="mb-8 p-6 border rounded-xl glass-card-enhanced bg-white/50">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="enhancedMode"
                      checked={useEnhancedMode}
                      onChange={(e) => setUseEnhancedMode(e.target.checked)}
                      className="w-5 h-5 text-primary accent-primary"
                    />
                    <div className="flex items-center space-x-3">
                      <Database className="h-6 w-6 text-primary" />
                      <Label
                        htmlFor="enhancedMode"
                        className="text-base font-medium cursor-pointer font-body text-primary-dark"
                      >
                        Enhanced Mode - Generate from comprehensive database (All 6 programs, 240+ rooms)
                      </Label>
                    </div>
                  </div>
                  {useEnhancedMode && (
                    <p className="mt-3 text-sm font-body text-primary">
                      Using pre-loaded institutional data with Genetic Algorithm optimization
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="maxSemester" className="font-body text-primary-dark text-base">
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
                        className="font-body bg-white border-gray-300 text-primary-dark text-base py-3"
                      />
                      {useEnhancedMode && (
                        <p className="text-sm font-body text-primary-dark/70">
                          Recommended: 8 (covers all programs in database)
                        </p>
                      )}
                    </div>

                    {!useEnhancedMode && (
                      <div className="space-y-3">
                        <Label htmlFor="file" className="font-body text-primary-dark text-base">
                          Course Data File
                        </Label>
                        <div className="flex items-center space-x-3">
                          <Input
                            id="file"
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            required
                            className="font-body bg-white border-gray-300 text-primary-dark text-base py-3"
                          />
                          <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
                        </div>
                        {file && (
                          <p className="text-base font-body text-primary-dark/70">
                            Selected: {file.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full btn-primary-enhanced text-xl py-8 rounded-xl font-display"
                  >
                    {isGenerating ? (
                      <>
                        <Brain className="mr-3 h-6 w-6 animate-pulse" />
                        {useEnhancedMode ? "Running Genetic Algorithm..." : "Generating Perfect Timetable..."}
                      </>
                    ) : (
                      <>
                        {useEnhancedMode ? <Database className="mr-3 h-6 w-6" /> : <Zap className="mr-3 h-6 w-6" />}
                        {useEnhancedMode ? "Generate Multi-Program Timetable" : "Generate Perfect Timetable"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Generated Timetable Results */}
            {generatedTimetable && (
              <Card className="glass-card-enhanced border-0 bg-white/90 mb-12">
                <CardHeader className="flex flex-row items-center justify-between p-8">
                  <div>
                    <CardTitle className="font-display text-primary-dark text-2xl">
                      Generated Smart Schedule
                    </CardTitle>
                    <CardDescription className="font-body text-primary-dark/70 text-lg">
                      {useEnhancedMode
                        ? "Multi-program institutional timetable with Genetic Algorithm optimization"
                        : "Review the generated timetable before saving"}
                    </CardDescription>
                  </div>
                  <Button onClick={handleSave} disabled={isSaving} className="btn-primary-enhanced font-display px-8 py-4">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save to Smart Network"
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="px-8 py-6">
                  <div className="space-y-8">
                    {Object.entries(generatedTimetable).map(([semesterSection, schedule]) => (
                      <div key={semesterSection} className="space-y-6">
                        <h3 className="text-xl font-semibold font-display text-primary-dark">
                          {semesterSection}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                            <thead>
                              <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
                                <th className="border border-gray-300 p-4 font-body font-semibold text-primary-dark">
                                  Time
                                </th>
                                {days.map((day) => (
                                  <th
                                    key={day}
                                    className="border border-gray-300 p-4 font-body font-semibold text-primary-dark"
                                  >
                                    {day}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {timeSlots.map((slot, index) => (
                                <tr key={slot} className={index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"}>
                                  <td className="border border-gray-300 p-4 font-medium font-body text-primary-dark">
                                    {slot.replace("-", " - ")}
                                  </td>
                                  {days.map((day) => {
                                    const cellContent = schedule[day]?.[slot]
                                    return (
                                      <td key={day} className="border border-gray-300 p-3 text-sm font-body min-h-[60px]">
                                        {cellContent === "BLOCKED" ? (
                                          <span className="text-gray-400 text-center block">-</span>
                                        ) : cellContent ? (
                                          <div
                                            className={`p-3 rounded-lg text-center min-h-[50px] flex items-center justify-center ${
                                              cellContent.includes("CONFLICT") ? "bg-red-500 text-white" : "text-white"
                                            }`}
                                            style={
                                              !cellContent.includes("CONFLICT") ? { backgroundColor: "var(--primary)" } : {}
                                            }
                                          >
                                            <div>
                                              <div className="font-semibold text-xs leading-tight">
                                                {cellContent.split(" - ")[0]}
                                              </div>
                                              <div className="text-xs opacity-90">
                                                {cellContent.split(" - ")[1]}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-gray-400 text-center block">-</span>
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
        </div>

        <Footer />
      </div>
    </>
  )
}


