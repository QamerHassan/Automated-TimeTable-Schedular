// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { useAuth } from "@/contexts/auth-context"
// import { CalendarDays, LogIn, UserPlus, LayoutDashboard, Zap } from "lucide-react"
// import { SimpleUserMenu } from "@/components/simple-user-menu"

// export function MainNav() {
//   const { user, isAuthenticated } = useAuth()

//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId)
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" })
//     }
//   }

//   return (
//     <nav className="glass-nav sticky top-0 z-50 shadow-sm">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex justify-between items-center">
//           <Link href="/" className="flex items-center gap-3 group">
//             <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-2xl group-hover:scale-105 transition-transform duration-200 shadow-lg">
//               <CalendarDays className="h-7 w-7 text-white" />
//               <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full animate-pulse">
//                 <Zap className="h-3 w-3 text-white" />
//               </div>
//             </div>
//             <div>
//               <span className="text-2xl font-bold text-gradient font-display">QUANTIME AI</span>
//               <p className="text-xs font-ai -mt-1 text-gray-700">Smart Scheduler</p>
//             </div>
//           </Link>

//           <div className="hidden md:flex items-center gap-8">
//             <button
//               onClick={() => scrollToSection("home")}
//               className="font-medium relative group font-display transition-colors duration-200 text-gray-800 hover:text-primary"
//             >
//               Home
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
//             </button>
//             <button
//               onClick={() => scrollToSection("features")}
//               className="font-medium relative group font-display transition-colors duration-200 text-gray-800 hover:text-primary"
//             >
//               Features
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
//             </button>
//             <button
//               onClick={() => scrollToSection("how-it-works")}
//               className="font-medium relative group font-display transition-colors duration-200 text-gray-800 hover:text-primary"
//             >
//               How it Works
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
//             </button>
//             <button
//               onClick={() => scrollToSection("team")}
//               className="font-medium relative group font-display transition-colors duration-200 text-gray-800 hover:text-primary"
//             >
//               Team
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
//             </button>
//             <button
//               onClick={() => scrollToSection("contact")}
//               className="font-medium relative group font-display transition-colors duration-200 text-gray-800 hover:text-primary"
//             >
//               Contact
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             {isAuthenticated && user ? (
//               <>
//                 <Link href="/dashboard">
//                   <Button
//                     variant="ghost"
//                     className="hidden md:flex items-center gap-2 hover:bg-primary/10 font-display text-gray-800"
//                   >
//                     <LayoutDashboard className="h-4 w-4" />
//                     Dashboard
//                   </Button>
//                 </Link>
//                 <SimpleUserMenu />
//               </>
//             ) : (
//               <>
//                 <Link href="/login">
//                 <Button
//                   variant="ghost"
//                   className="flex items-center gap-2 px-5 py-2 rounded-full font-display text-gray-800 text-base"
//                 >
//                   <LogIn className="h-4 w-4" />
//                   Login
//                 </Button>
//               </Link>
//               <Link href="/signup">
//                 <Button
//                   className="btn-primary-enhanced flex items-center gap-2 px-6 py-2 rounded-full min-w-[110px] text-base font-display"
//                   style={{ minWidth: 110 }}
//                 >
//                   <UserPlus className="h-4 w-4" />
//                   Sign Up
//                 </Button>
//               </Link>

//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }


"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { CalendarDays, LogIn, UserPlus, LayoutDashboard, Zap, Sparkles } from "lucide-react"
import { SimpleUserMenu } from "@/components/simple-user-menu"

export function MainNav() {
  const { user, isAuthenticated } = useAuth()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="glass-nav sticky top-0 z-50 shadow-sm backdrop-blur-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo with Working Animations */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
              <CalendarDays className="h-7 w-7 text-white transform transition-transform duration-300 group-hover:rotate-6" />
              <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full animate-pulse group-hover:animate-bounce transition-all duration-300">
                <Zap className="h-3 w-3 text-white" />
              </div>
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-30 transition-all duration-500 blur-lg transform scale-110"></div>
              {/* Sparkle effect */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            
            <div className="transform transition-all duration-300 group-hover:translate-x-2">
              <span className="text-2xl font-bold text-white font-display transform transition-all duration-300 group-hover:scale-105 group-hover:text-primary">
                QUANTIME AI
              </span>
              <p className="text-xs font-ai -mt-1 text-gray-300 transform transition-all duration-300 group-hover:text-primary/80">
                Smart Scheduler
              </p>
            </div>
          </Link>

          {/* Navigation Links with Enhanced Interactive Styling */}
          {isAuthenticated && user ? (
            // Dashboard Navigation - Enhanced
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                {/* Animated background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                {/* Text with enhanced styling */}
                <span className="relative z-10 transition-all duration-300 group-hover:text-primary group-hover:font-semibold group-hover:drop-shadow-sm">
                  Dashboard
                </span>
                
                {/* Multiple underline effects */}
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
              </Link>
              
              <Link
                href="/dashboard/generate"
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-accent/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                <span className="relative z-10 transition-all duration-300 group-hover:text-accent group-hover:font-semibold group-hover:drop-shadow-sm">
                  Generate
                </span>
                
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
              </Link>
              
              <Link
                href="/dashboard/view"
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-purple-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                <span className="relative z-10 transition-all duration-300 group-hover:text-purple-600 group-hover:font-semibold group-hover:drop-shadow-sm">
                  View Timetables
                </span>
                
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-purple-500/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
              </Link>
            </div>
          ) : (
            // Landing Page Navigation - Enhanced
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => scrollToSection("home")}
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                <span className="relative z-10 transition-all duration-300 group-hover:text-primary group-hover:font-semibold group-hover:drop-shadow-sm">
                  Home
                </span>
                
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </button>
              
              <button
                onClick={() => scrollToSection("features")}
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-accent/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                <span className="relative z-10 transition-all duration-300 group-hover:text-accent group-hover:font-semibold group-hover:drop-shadow-sm">
                  Features
                </span>
                
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-accent to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </button>
              
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-green-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                <span className="relative z-10 transition-all duration-300 group-hover:text-green-600 group-hover:font-semibold group-hover:drop-shadow-sm">
                  How it Works
                </span>
                
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </button>
              
              <button
                onClick={() => scrollToSection("team")}
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-purple-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                <span className="relative z-10 transition-all duration-300 group-hover:text-purple-600 group-hover:font-semibold group-hover:drop-shadow-sm">
                  Team
                </span>
                
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </button>
              
              <button
                onClick={() => scrollToSection("contact")}
                className="nav-link-enhanced relative px-5 py-3 font-medium font-display text-gray-300 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-orange-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                
                <span className="relative z-10 transition-all duration-300 group-hover:text-orange-600 group-hover:font-semibold group-hover:drop-shadow-sm">
                  Contact
                </span>
                
                <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </button>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    className="hidden md:flex items-center gap-2 font-display text-gray-300 relative group overflow-hidden px-5 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20"
                  >
                    {/* Ripple effect */}
                    <div className="absolute inset-0 bg-primary/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl"></div>
                    <LayoutDashboard className="h-4 w-4 relative z-10 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span className="relative z-10 font-medium">Dashboard</span>
                  </Button>
                </Link>
                
                <div className="transform transition-all duration-300 hover:scale-105">
                  <SimpleUserMenu />
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-display text-gray-300 text-base relative group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                    <LogIn className="h-4 w-4 relative z-10 transform transition-all duration-300 group-hover:-translate-x-1 group-hover:scale-110" />
                    <span className="relative z-10 font-medium">Login</span>
                  </Button>
                </Link>
                
                <Link href="/signup">
                  <Button
                    className="btn-primary-enhanced flex items-center gap-2 px-6 py-3 rounded-xl min-w-[120px] text-base font-display relative group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl transform hover:-translate-y-1"
                    style={{ minWidth: 120 }}
                  >
                    {/* Multiple animated layers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="absolute inset-0 bg-purple-200/50 rounded-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    <UserPlus className="h-4 w-4 relative z-10 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span className="relative z-10 font-semibold">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}



