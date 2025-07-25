// const API_BASE_URL = "http://localhost:8000" // Your Django server URL

// export interface TimetableData {
//   [key: string]: {
//     [day: string]: {
//       [timeSlot: string]: string | null
//     }
//   }
// }

// export interface Timetable {
//   id: number
//   semester: number
//   data: TimetableData
//   created_at: string
// }

// export interface GenerateTimetableResponse {
//   success: boolean
//   max_semester: number
//   timetable_data: TimetableData
//   message: string
// }

// export interface ApiResponse<T> {
//   success: boolean
//   data?: T
//   error?: string
//   message?: string
// }

// class ApiService {
//   private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
//     const url = `${API_BASE_URL}${endpoint}`

//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         ...options.headers,
//       },
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
//     }

//     return response.json()
//   }

//   async generateTimetable(maxSemester: number, file: File): Promise<GenerateTimetableResponse> {
//     const formData = new FormData()
//     formData.append("max_semester", maxSemester.toString())
//     formData.append("file", file)

//     return this.makeRequest<GenerateTimetableResponse>("/api/generate/", {
//       method: "POST",
//       body: formData,
//     })
//   }

//   async saveTimetable(maxSemester: number, timetableData: TimetableData): Promise<ApiResponse<Timetable>> {
//     return this.makeRequest<ApiResponse<Timetable>>("/api/save/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         max_semester: maxSemester,
//         timetable_data: timetableData,
//       }),
//     })
//   }

//   async getTimetables(): Promise<ApiResponse<Timetable[]>> {
//     return this.makeRequest<ApiResponse<Timetable[]>>("/api/timetables/")
//   }

//   async deleteTimetable(timetableId: number): Promise<ApiResponse<null>> {
//     return this.makeRequest<ApiResponse<null>>(`/api/timetables/${timetableId}/delete/`, {
//       method: "DELETE",
//     })
//   }

//   getDownloadUrl(timetableId: number): string {
//     return `${API_BASE_URL}/api/timetables/${timetableId}/download/`
//   }
// }

// export const apiService = new ApiService()
const API_BASE_URL = "http://localhost:8000" // Your Django server URL

export interface TimetableData {
  [key: string]: {
    [day: string]: {
      [timeSlot: string]: string | null
    }
  }
}

export interface Timetable {
  id: number
  semester: number
  data: TimetableData
  created_at: string
}

export interface GenerateTimetableResponse {
  success: boolean
  max_semester: number
  timetable_data: TimetableData
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async generateTimetable(maxSemester: number, file: File): Promise<GenerateTimetableResponse> {
    const formData = new FormData()
    formData.append("max_semester", maxSemester.toString())
    formData.append("file", file)

    return this.makeRequest<GenerateTimetableResponse>("/api/generate/", {
      method: "POST",
      body: formData,
    })
  }

  async saveTimetable(maxSemester: number, timetableData: TimetableData): Promise<ApiResponse<Timetable>> {
    console.log("API: Saving timetable with data:", { maxSemester, timetableData })

    const response = await this.makeRequest<ApiResponse<Timetable>>("/api/save/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_semester: maxSemester,
        timetable_data: timetableData,
      }),
    })

    console.log("API: Save response:", response)
    return response
  }

  async getTimetables(): Promise<ApiResponse<Timetable[]>> {
    return this.makeRequest<ApiResponse<Timetable[]>>("/api/timetables/")
  }

  async deleteTimetable(timetableId: number): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(`/api/timetables/${timetableId}/delete/`, {
      method: "DELETE",
    })
  }

  getDownloadUrl(timetableId: number): string {
    return `${API_BASE_URL}/api/timetables/${timetableId}/download/`
  }
}

export const apiService = new ApiService()
