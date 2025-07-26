"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, FileSpreadsheet, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface FileWithProgress {
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
  id: string
}

export function EnhancedFileUpload() {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, 20 - files.length).map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
        id: Math.random().toString(36).substr(2, 9),
      }))

      setFiles((prev) => [...prev, ...newFiles])

      // Simulate upload progress
      newFiles.forEach((fileWithProgress) => {
        simulateUpload(fileWithProgress.id)
      })
    },
    [files.length],
  )

  const simulateUpload = (fileId: string) => {
    setIsUploading(true)
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100)
            const newStatus = newProgress === 100 ? "completed" : "uploading"

            if (newProgress === 100) {
              setTimeout(() => setIsUploading(false), 500)
            }

            return { ...f, progress: newProgress, status: newStatus }
          }
          return f
        }),
      )
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: "completed" } : f)))
    }, 2000)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />
      case "csv":
        return <FileText className="h-4 w-4 text-blue-600" />
      default:
        return <File className="h-4 w-4 text-gray-600" />
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxFiles: 20 - files.length,
    disabled: files.length >= 20,
  })

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${
            isDragActive
              ? "border-primary bg-primary/5 scale-105"
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50/50"
          }
          ${files.length >= 20 ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8" style={{ color: "var(--primary)" }} />
          </div>

          {isDragActive ? (
            <div>
              <p className="text-lg font-semibold font-display" style={{ color: "var(--primary)" }}>
                Drop files here...
              </p>
              <p className="text-sm font-ai" style={{ color: "var(--secondary-text)" }}>
                Release to upload your files
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold font-display" style={{ color: "var(--foreground)" }}>
                {files.length >= 20 ? "Maximum files reached" : "Drag & drop files here"}
              </p>
              <p className="text-sm font-ai" style={{ color: "var(--secondary-text)" }}>
                or <span className="text-primary font-medium">click to browse</span>
              </p>
              <p className="text-xs font-ai mt-2" style={{ color: "var(--secondary-text)" }}>
                Supports Excel (.xlsx, .xls) and CSV files • Max {20 - files.length} more files
              </p>
            </div>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
              Uploaded Files ({files.length}/20)
            </h4>
            {isUploading && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--primary)" }} />
                <span className="text-sm font-ai" style={{ color: "var(--secondary-text)" }}>
                  Processing...
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-3 max-h-60 overflow-y-auto">
            {files.map((fileWithProgress) => (
              <Card key={fileWithProgress.id} className="glass-card border-0 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{getFileIcon(fileWithProgress.file.name)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium font-ai truncate" style={{ color: "var(--foreground)" }}>
                        {fileWithProgress.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {fileWithProgress.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {fileWithProgress.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileWithProgress.id)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Progress value={fileWithProgress.progress} className="flex-1 h-2" />
                      <span className="text-xs font-ai" style={{ color: "var(--secondary-text)" }}>
                        {Math.round(fileWithProgress.progress)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-ai" style={{ color: "var(--secondary-text)" }}>
                        {(fileWithProgress.file.size / 1024).toFixed(1)} KB
                      </span>
                      <Badge
                        variant={
                          fileWithProgress.status === "completed"
                            ? "default"
                            : fileWithProgress.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs font-ai"
                      >
                        {fileWithProgress.status === "uploading"
                          ? "Uploading"
                          : fileWithProgress.status === "completed"
                            ? "Ready"
                            : "Error"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
