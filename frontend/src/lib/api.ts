const API = "http://localhost:8000"

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
  timetables?: T // For backward compatibility
  error?: string
  message?: string
}

class ApiService {
  private authHeaders(): HeadersInit {
    const t = localStorage.getItem("access_token")
    return t ? { Authorization:`Bearer ${t}` } : {}
  }

  private async fetchJSON<T>(path:string, opts:RequestInit={}):Promise<T>{
    const res = await fetch(`${API}${path}`, { ...opts, headers:{ ...opts.headers, ...this.authHeaders() } })
    if (res.status === 401) {          // try once to refresh
      const ok = await this.tryRefresh()
      if (ok) return this.fetchJSON<T>(path, opts)   // retry once
    }
    if (!res.ok) throw new Error((await res.json()).error || res.statusText)
    return res.json()
  }

  private async tryRefresh():Promise<boolean>{
    const refresh = localStorage.getItem("refresh_token")
    if (!refresh) return false
    const r = await fetch(`${API}/api/auth/token/refresh/`,{
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ refresh })
    })
    if (!r.ok) { localStorage.clear(); return false }
    const { access } = await r.json()
    localStorage.setItem("access_token", access)
    return true
  }

  /* ---- public helpers ---- */
  async generateTimetable(max:number, file:File): Promise<GenerateTimetableResponse>{
    const F = new FormData(); F.append("max_semester", String(max)); F.append("file", file)
    return this.fetchJSON("/api/generate/", { method:"POST", body:F })
  }
  
  async saveTimetable(max:number, data:any): Promise<ApiResponse<Timetable>>{
    return this.fetchJSON("/api/save/",{
      method:"POST", body:JSON.stringify({ max_semester:max, timetable_data:data }),
      headers:{ "Content-Type":"application/json" }
    })
  }
  
  async getTimetables(): Promise<ApiResponse<Timetable[]>>{ 
    return this.fetchJSON("/api/timetables/") 
  }
  
  async deleteTimetable(id:number): Promise<ApiResponse<null>>{
    return this.fetchJSON(`/api/timetables/${id}/delete/`,{ method:"DELETE" })
  }
  
  getDownloadUrl(id:number): string { 
    return `${API}/api/timetables/${id}/download/` 
  }
}

export const apiService = new ApiService()
