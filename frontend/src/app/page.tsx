// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   CheckCircle,
//   ArrowRight,
//   Play,
//   Sparkles,
//   Mail,
//   Phone,
//   MapPin,
//   Github,
//   Linkedin,
//   Twitter,
//   Brain,
//   Database,
//   Trophy,
//   Zap,
//   Shield,
//   Users,
//   BarChart3,
//   Download,
//   Palette,
//   Server,
//   Lightbulb,
//   Calendar,
// } from "lucide-react"
// import Image from "next/image"
// import { Chatbot } from "@/components/chatbot"
// import { TechStack } from "@/components/tech-stack"
// import { FAQSection } from "@/components/faq-section"

// export default function HomePage() {
//   const teamMembers = [
//     {
//       name: "Awais Ali",
//       role: "Full-Stack & AI Engineer",
//       description:
//         "Led system architecture, full-stack development, and AI integration. Built core logic using Django, React, and Next.js. Managed AWS deployment, Git workflows, and overall coordination.",
//       skills: ["Django", "React", "Next.js", "Python", "System Design", "Algorithm", "AWS", "Git & GitHub"],
//       image: "/images/Awais.jpg",
//       icon: Trophy,
//       social: {
//         github: "https://github.com/bettercallawais",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//     {
//       name: "Mehdi Ishaq",
//       role: "Backend Logic & AI Engineer",
//       description:
//         "Focused on backend logic, algorithm optimization, and AI integration. Ensured conflict-free scheduling and robust performance.",
//       skills: ["Python", "Backend", "Logic Design", "AI Integration", "Optimization", "Git & GitHub"],
//       image: "/images/Mahad.jpg",
//       icon: Server,
//       social: {
//         github: "#",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//     {
//       name: "Kamran Hussain",
//       role: "UI/UX Designer & AWS Support",
//       description:
//         "Handled visuals, branding, and AWS deployment. Created logos, banners, and presentation assets for a cohesive visual identity.",
//       skills: ["UI/UX", "Graphic Design", "Branding", "AWS", "Documentation"],
//       image: "/images/Kamran.jpg",
//       icon: Palette,
//       social: {
//         github: "#",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//     {
//       name: "Qamar Hassan",
//       role: "Team Ops & Research",
//       description: "Managed documentation, prompt writing, budgeting, and assisted in presentations and research.",
//       skills: ["Documentation", "Prompt Engineering", "Research", "Budget Management", "Team Support"],
//       image: "/images/Qamar.jpg",
//       icon: Lightbulb,
//       social: {
//         github: "#",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//   ]

//   // Sample course data for the schedule preview
//   const sampleSchedule = [
//     { day: 0, time: 0, course: "AI Ethics", type: "lecture", color: "#6e73ff" },
//     { day: 0, time: 2, course: "Data Structures", type: "lab", color: "#8ac5ff" },
//     { day: 1, time: 1, course: "Machine Learning", type: "lecture", color: "#b388ff" },
//     { day: 1, time: 3, course: "Web Dev", type: "lab", color: "#6e73ff" },
//     { day: 2, time: 0, course: "Algorithms", type: "lecture", color: "#8ac5ff" },
//     { day: 2, time: 4, course: "Database", type: "lecture", color: "#b388ff" },
//     { day: 3, time: 1, course: "Software Eng", type: "lecture", color: "#6e73ff" },
//     { day: 3, time: 3, course: "AI Lab", type: "lab", color: "#8ac5ff" },
//     { day: 4, time: 2, course: "Networks", type: "lecture", color: "#b388ff" },
//     { day: 4, time: 4, course: "Project", type: "lab", color: "#6e73ff" },
//   ]

//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
//   const timeSlots = ["9:00", "10:30", "12:00", "1:30", "3:00", "4:30"]

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden hero-gradient">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
//         </div>
//         <div className="relative container mx-auto px-4 py-20 lg:py-32">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8 animate-fade-in-up">
//               <div className="space-y-4">
//                 <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-ai">
//                   <Sparkles className="h-3 w-3 mr-1" />
//                   QUANTIME_AI_POWERED
//                 </Badge>
//                 <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight font-display">
//                   Quantum
//                   <span className="block text-yellow-300 animate-pulse font-ai">Timetabling</span>
//                   Intelligence
//                 </h1>
//                 <p className="text-xl text-white/90 leading-relaxed max-w-lg">
//                   Revolutionary AI algorithms that eliminate scheduling conflicts and optimize resource allocation in
//                   milliseconds.
//                 </p>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link href="/signup">
//                   <Button
//                     size="lg"
//                     className="btn-primary text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse font-display"
//                   >
//                     Initialize AI
//                     <ArrowRight className="ml-2 h-5 w-5" />
//                   </Button>
//                 </Link>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm font-display"
//                 >
//                   <Play className="mr-2 h-5 w-5" />
//                   Smart Demo
//                 </Button>
//               </div>
//               <div className="flex items-center gap-8 pt-4">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-white font-ai">500+</div>
//                   <div className="text-white/80 text-sm">Timetables</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-white font-ai">90%</div>
//                   <div className="text-white/80 text-sm">Accuracy</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-white font-ai">24/7</div>
//                   <div className="text-white/80 text-sm">AI Active</div>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Schedule Preview */}
//             <div className="relative animate-slide-in-right">
//               <div className="relative z-10">
//                 <div className="glass-hero p-8 rounded-3xl">
//                   <div className="space-y-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
//                           <Calendar className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                             Smart Schedule Matrix
//                           </h3>
//                           <p className="text-sm font-ai opacity-70" style={{ color: "var(--secondary-text)" }}>
//                             CS_DEPT_SEM_4.quantime
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
//                         <div
//                           className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
//                           style={{ animationDelay: "0.5s" }}
//                         ></div>
//                         <div
//                           className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
//                           style={{ animationDelay: "1s" }}
//                         ></div>
//                       </div>
//                     </div>

//                     {/* Time slots header */}
//                     <div
//                       className="grid grid-cols-6 gap-2 text-xs text-center font-medium font-ai mb-4"
//                       style={{ color: "var(--secondary-text)" }}
//                     >
//                       <div></div>
//                       {days.map((day) => (
//                         <div key={day} className="py-2">
//                           {day}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Schedule grid */}
//                     <div className="space-y-2">
//                       {timeSlots.map((time, timeIndex) => (
//                         <div key={time} className="grid grid-cols-6 gap-2">
//                           <div className="text-xs font-ai py-3 text-center" style={{ color: "var(--secondary-text)" }}>
//                             {time}
//                           </div>
//                           {days.map((day, dayIndex) => {
//                             const courseData = sampleSchedule.find(
//                               (item) => item.day === dayIndex && item.time === timeIndex,
//                             )
//                             return (
//                               <div
//                                 key={`${day}-${time}`}
//                                 className={`h-12 rounded-lg schedule-block flex items-center justify-center text-xs font-medium text-white transition-all duration-300 ${
//                                   courseData ? "animate-schedule-pulse" : "opacity-20"
//                                 }`}
//                                 style={{
//                                   backgroundColor: courseData?.color || "#f3f4f6",
//                                   animationDelay: `${(dayIndex + timeIndex) * 0.1}s`,
//                                 }}
//                               >
//                                 {courseData && (
//                                   <div className="text-center">
//                                     <div className="font-semibold text-xs">{courseData.course}</div>
//                                     <div className="text-xs opacity-80 font-ai">
//                                       {courseData.type === "lab" ? "LAB" : "LEC"}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )
//                           })}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Status indicators */}
//                     <div className="flex items-center justify-between pt-4 border-t border-white/20">
//                       <div className="flex items-center gap-4 text-xs font-ai">
//                         <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#6e73ff" }}></div>
//                           <span style={{ color: "var(--secondary-text)" }}>Core</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#8ac5ff" }}></div>
//                           <span style={{ color: "var(--secondary-text)" }}>Lab</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#b388ff" }}></div>
//                           <span style={{ color: "var(--secondary-text)" }}>Elective</span>
//                         </div>
//                       </div>
//                       <div className="text-xs font-ai" style={{ color: "var(--secondary-text)" }}>
//                         ✓ Conflict-Free
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute -top-8 -right-8 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
//               <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gradient-to-b from-white to-gray-50/50">
//         <div className="container mx-auto px-4">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
//             {[
//               {
//                 icon: CheckCircle,
//                 title: "Zero Conflicts",
//                 description: "AI-guaranteed conflict-free schedules",
//                 color: "#6e73ff",
//               },
//               {
//                 icon: Zap,
//                 title: "Quantum Speed",
//                 description: "Millisecond processing with smart algorithms",
//                 color: "#8ac5ff",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Smart Analytics",
//                 description: "Predictive insights and optimization",
//                 color: "#b388ff",
//               },
//               {
//                 icon: Users,
//                 title: "Cognitive Interface",
//                 description: "Intuitive AI-powered user experience",
//                 color: "#6e73ff",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className="glass-card border-0 text-center p-6 card-hover"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className="p-4 rounded-2xl mb-4 mx-auto w-fit" style={{ backgroundColor: `${feature.color}20` }}>
//                   <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
//                 </div>
//                 <h3 className="font-semibold font-display mb-2" style={{ color: "var(--foreground)" }}>
//                   {feature.title}
//                 </h3>
//                 <p className="text-sm font-ai" style={{ color: "var(--secondary-text)" }}>
//                   {feature.description}
//                 </p>
//               </Card>
//             ))}
//           </div>

//           <div className="text-center space-y-4 mb-16 animate-fade-in-up">
//             <Badge className="bg-primary/10 border-primary/20 font-ai" style={{ color: "var(--primary)" }}>
//               QUANTIME_FEATURES.advanced
//             </Badge>
//             <h2 className="text-4xl lg:text-6xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//               Powered by
//               <span className="block text-gradient font-ai">Quantum Intelligence</span>
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--secondary-text)" }}>
//               Experience the next evolution of scheduling with our quantum-enhanced AI platform
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Brain,
//                 title: "Smart Processing Engine",
//                 description: "Advanced quantum algorithms that learn and adapt to your scheduling patterns",
//                 color: "#6e73ff",
//                 gradient: "from-purple-500/10 to-purple-600/10",
//               },
//               {
//                 icon: Zap,
//                 title: "Quantum Optimization",
//                 description: "Parallel processing across multiple dimensions for instant conflict resolution",
//                 color: "#8ac5ff",
//                 gradient: "from-cyan-500/10 to-cyan-600/10",
//               },
//               {
//                 icon: Shield,
//                 title: "Predictive Conflict Shield",
//                 description: "AI predicts and prevents conflicts before they occur using machine learning",
//                 color: "#b388ff",
//                 gradient: "from-violet-500/10 to-violet-600/10",
//               },
//               {
//                 icon: Users,
//                 title: "Collaborative Intelligence",
//                 description: "Multi-agent AI system that coordinates across departments seamlessly",
//                 color: "#6e73ff",
//                 gradient: "from-blue-500/10 to-blue-600/10",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Quantum Analytics",
//                 description: "Deep learning insights that optimize resource utilization and predict trends",
//                 color: "#8ac5ff",
//                 gradient: "from-teal-500/10 to-teal-600/10",
//               },
//               {
//                 icon: Download,
//                 title: "Universal Export Matrix",
//                 description: "AI-powered formatting that adapts to any system or platform automatically",
//                 color: "#b388ff",
//                 gradient: "from-pink-500/10 to-pink-600/10",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className={`group card-hover border-0 shadow-xl bg-gradient-to-br ${feature.gradient} animate-fade-in`}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <CardHeader className="text-center pb-4">
//                   <div
//                     className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-white to-gray-50 group-hover:scale-110 transition-transform duration-300 shadow-lg"
//                     style={{ color: feature.color }}
//                   >
//                     <feature.icon className="h-8 w-8" />
//                   </div>
//                   <CardTitle
//                     className="text-xl font-bold font-display group-hover:text-primary transition-colors"
//                     style={{ color: "var(--secondary-text)" }}
//                   >
//                     {feature.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center">
//                   <CardDescription
//                     className="text-base leading-relaxed font-ai"
//                     style={{ color: "var(--secondary-text)" }}
//                   >
//                     {feature.description}
//                   </CardDescription>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Tech Stack Section */}
//       <TechStack />

//       {/* How It Works Section - Fixed Colors */}
//       <section id="how-it-works" className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center space-y-4 mb-16 animate-fade-in-up">
//             <Badge className="bg-primary/10 text-primary border-primary/20 font-ai">QUANTIME_WORKFLOW.smart</Badge>
//             <h2 className="text-4xl lg:text-6xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//               Smart 3-Phase Process
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
//               From data ingestion to quantum-optimized schedule deployment in three revolutionary phases
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-3 gap-8">
//             {[
//               {
//                 step: "01",
//                 title: "Data Smart Ingestion",
//                 description:
//                   "Advanced AI parsers intelligently extract and validate course, faculty, and resource data from multiple formats with quantum accuracy.",
//                 icon: Database,
//                 color: "#6e73ff",
//                 bgGradient: "from-purple-50 to-purple-100",
//               },
//               {
//                 step: "02",
//                 title: "Quantum Processing Matrix",
//                 description:
//                   "Our smart engine processes infinite constraint combinations using quantum algorithms to generate optimal, conflict-free timetables.",
//                 icon: Brain,
//                 color: "#8ac5ff",
//                 bgGradient: "from-cyan-50 to-cyan-100",
//               },
//               {
//                 step: "03",
//                 title: "Intelligent Export Synthesis",
//                 description:
//                   "AI-powered formatters generate beautiful, customized outputs optimized for any platform or printing requirement.",
//                 icon: Sparkles,
//                 color: "#b388ff",
//                 bgGradient: "from-violet-50 to-violet-100",
//               },
//             ].map((step, index) => (
//               <div
//                 key={index}
//                 className="text-center space-y-6 animate-fade-in"
//                 style={{ animationDelay: `${index * 200}ms` }}
//               >
//                 <Card className={`glass-card border-0 p-8 bg-gradient-to-br ${step.bgGradient}`}>
//                   <div className="relative mb-6">
//                     <div className="text-6xl font-bold opacity-10 mb-4 font-ai" style={{ color: step.color }}>
//                       {step.step}
//                     </div>
//                     <div className="relative -mt-12">
//                       <div
//                         className="inline-flex p-6 rounded-3xl shadow-lg mb-4"
//                         style={{ backgroundColor: step.color }}
//                       >
//                         <step.icon className="w-12 h-12 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h3 className="text-2xl font-bold font-display" style={{ color: "var(--foreground)" }}>
//                       {step.title}
//                     </h3>
//                     <p className="leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//                       {step.description}
//                     </p>
//                   </div>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section id="team" className="py-20 bg-gradient-to-b from-gray-50 to-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center space-y-4 mb-16 animate-fade-in-up">
//             <Badge className="bg-accent/10 border-accent/20 font-ai" style={{ color: "var(--accent)" }}>
//               QUANTIME_ARCHITECTS.team
//             </Badge>
//             <h2 className="text-4xl lg:text-6xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//               The Quantum Minds
//               <span className="block text-gradient font-ai">Behind the Intelligence</span>
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
//               Four exceptional quantum architects who engineered the future of scheduling
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {teamMembers.map((member, index) => (
//               <div key={index} className="team-card animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
//                 <div className="team-card-inner relative h-96">
//                   {/* Front of card */}
//                   <Card className="team-card-front absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
//                     <div className="relative h-full">
//                       <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16"></div>
//                       <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
//                         <div className="relative">
//                           <Image
//                             src={member.image || "/placeholder.svg"}
//                             alt={member.name}
//                             width={120}
//                             height={120}
//                             className="rounded-full border-4 border-white shadow-xl"
//                           />
//                           <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-primary to-accent rounded-full">
//                             <member.icon className="h-4 w-4 text-white" />
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <h3 className="text-xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//                             {member.name}
//                           </h3>
//                           <p className="text-sm font-medium font-ai" style={{ color: "var(--primary)" }}>
//                             {member.role}
//                           </p>
//                         </div>
//                         <div className="flex flex-wrap gap-1 justify-center">
//                           {member.skills.slice(0, 2).map((skill, skillIndex) => (
//                             <Badge key={skillIndex} variant="secondary" className="text-xs font-ai">
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </div>
//                   </Card>
//                   {/* Back of card */}
//                   <Card className="team-card-back absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
//                     <CardContent className="p-6 h-full flex flex-col justify-center space-y-4">
//                       <div className="text-center space-y-3">
//                         <h3 className="text-lg font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//                           {member.name}
//                         </h3>
//                         <p className="text-sm leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//                           {member.description}
//                         </p>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex flex-wrap gap-1 justify-center">
//                           {member.skills.map((skill, skillIndex) => (
//                             <Badge key={skillIndex} variant="outline" className="text-xs font-ai">
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>
//                         <div className="flex justify-center gap-3">
//                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
//                             <Github className="h-4 w-4" />
//                           </Button>
//                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
//                             <Linkedin className="h-4 w-4" />
//                           </Button>
//                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
//                             <Twitter className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section - Moved below team */}
//       <FAQSection />

//       {/* Contact Us Section - Fixed Colors */}
//       <section id="contact" className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center space-y-4 mb-16 animate-fade-in-up">
//             <Badge className="bg-primary/10 text-primary border-primary/20 font-ai">QUANTIME_CONTACT.interface</Badge>
//             <h2 className="text-4xl lg:text-6xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//               Connect with Our Smart Network
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
//               Initialize communication protocol. Our AI agents respond within quantum time.
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
//             {/* Contact Form */}
//             <Card className="glass-card border-0 animate-slide-in-left">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-bold font-display" style={{ color: "var(--foreground)" }}>
//                   Transmit Message
//                 </CardTitle>
//                 <CardDescription className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                   Smart processing initiated. Response time: &lt; 24 hours.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                       First Name
//                     </label>
//                     <Input className="font-ai" placeholder="John" />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                       Last Name
//                     </label>
//                     <Input className="font-ai" placeholder="Doe" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                     Email
//                   </label>
//                   <Input type="email" className="font-ai" placeholder="john@quantime.ai" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                     Subject
//                   </label>
//                   <Input className="font-ai" placeholder="Smart inquiry protocol" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                     Message
//                   </label>
//                   <Textarea
//                     className="min-h-[120px] font-ai"
//                     placeholder="Describe your quantum scheduling requirements..."
//                   />
//                 </div>
//                 <Button className="w-full btn-primary text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-display">
//                   Transmit to Smart Network
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </CardContent>
//             </Card>
//             {/* Contact Information */}
//             <div className="space-y-8 animate-slide-in-right">
//               <div className="space-y-6">
//                 <h3 className="text-3xl font-bold font-display" style={{ color: "var(--foreground)" }}>
//                   Smart Interface
//                 </h3>
//                 <p className="text-lg leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//                   Our quantum communication channels are always active. Connect with our smart architects.
//                 </p>
//               </div>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-primary/10 rounded-2xl">
//                     <Mail className="h-6 w-6" style={{ color: "var(--primary)" }} />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                       Smart Mail
//                     </h4>
//                     <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                       E.admissions@umt.edu.pk
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-primary/10 rounded-2xl">
//                     <Phone className="h-6 w-6" style={{ color: "var(--primary)" }} />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                       Quantum Line
//                     </h4>
//                     <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                       T. 042-111868868 - 111300200
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 bg-primary/10 rounded-2xl">
//                     <MapPin className="h-6 w-6" style={{ color: "var(--primary)" }} />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                       Smart Hub
//                     </h4>
//                     <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                       Department of AI, UMT Lahore, Pakistan
                      
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="glass-card p-6 rounded-2xl border-0">
//                 <h4 className="font-semibold font-display mb-4" style={{ color: "var(--foreground)" }}>
//                   Smart Activity Hours
//                 </h4>
//                 <div className="space-y-2 font-ai" style={{ color: "var(--secondary-text)" }}>
//                   <div className="flex justify-between">
//                     <span>Monday - Friday</span>
//                     <span>09:00 - 18:00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Saturday</span>
//                     <span>10:00 - 16:00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Sunday</span>
//                     <span>Smart Rest Mode</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section - Fixed Colors */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4 text-center">
//           <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
//             <h2 className="text-4xl lg:text-6xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//               Ready for Quantum Evolution?
//             </h2>
//             <p className="text-xl leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//               Join the smart revolution. Thousands of institutions already use our quantum AI platform.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/signup">
//                 <Button
//                   size="lg"
//                   className="btn-primary text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse font-display"
//                 >
//                   Initialize Smart Journey
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Link href="/login">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm font-display border-primary/30 hover:bg-primary/10"
//                   style={{ color: "var(--primary)" }}
//                 >
//                   Access Smart Network
//                 </Button>
//               </Link>
//             </div>
//             <div className="flex items-center justify-center gap-6 pt-8">
//               <div className="flex items-center gap-2 font-ai" style={{ color: "var(--secondary-text)" }}>
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span>No quantum credits required</span>
//               </div>
//               <div className="flex items-center gap-2 font-ai" style={{ color: "var(--secondary-text)" }}>
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span>14-day smart trial</span>
//               </div>
//               <div className="flex items-center gap-2 font-ai" style={{ color: "var(--secondary-text)" }}>
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span>Quantum flexibility</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   )
// }































// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   CheckCircle,
//   ArrowRight,
//   Play,
//   Sparkles,
//   Mail,
//   Phone,
//   MapPin,
//   Github,
//   Linkedin,
//   Twitter,
//   Brain,
//   Database,
//   Trophy,
//   Zap,
//   Shield,
//   Users,
//   BarChart3,
//   Download,
//   Palette,
//   Server,
//   Lightbulb,
//   Calendar,
// } from "lucide-react"
// import Image from "next/image"
// import { TechStack } from "@/components/tech-stack"
// import { FAQSection } from "@/components/faq-section"
// import { MainNav } from "@/components/main-nav"

// export default function HomePage() {
//   const teamMembers = [
//     {
//       name: "Awais Ali",
//       role: "Full-Stack & AI Engineer",
//       description:
//         "Led system architecture, full-stack development, and AI integration. Built core logic using Django, React, and Next.js. Managed AWS deployment, Git workflows, and overall coordination.",
//       skills: ["Django", "React", "Next.js", "Python", "System Design", "Algorithm", "AWS", "Git & GitHub"],
//       image: "/Images/Awais.jpg",
//       icon: Trophy,
//       social: {
//         github: "https://github.com/bettercallawais",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//     {
//       name: "Mehdi Ishaq",
//       role: "Backend Logic & AI Engineer",
//       description:
//         "Focused on backend logic, algorithm optimization, and AI integration. Ensured conflict-free scheduling and robust performance.",
//       skills: ["Python", "Backend", "Logic Design", "AI Integration", "Optimization", "Git & GitHub"],
//       image: "/Images/Mahad.jpg",
//       icon: Server,
//       social: {
//         github: "#",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//     {
//       name: "Kamran Hussain",
//       role: "UI/UX Designer & AWS Support",
//       description:
//         "Handled visuals, branding, and AWS deployment. Created logos, banners, and presentation assets for a cohesive visual identity.",
//       skills: ["UI/UX", "Graphic Design", "Branding", "AWS", "Documentation"],
//       image: "/placeholder.svg?height=300&width=300",
//       icon: Palette,
//       social: {
//         github: "#",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//     {
//       name: "Qamar Hassan",
//       role: "Team Ops & Research",
//       description: "Managed documentation, prompt writing, budgeting, and assisted in presentations and research.",
//       skills: ["Documentation", "Prompt Engineering", "Research", "Budget Management", "Team Support"],
//       image: "/Images/Qamar.jpg",
//       icon: Lightbulb,
//       social: {
//         github: "#",
//         linkedin: "#",
//         twitter: "#",
//       },
//     },
//   ]

//   // Sample course data for the schedule preview
//   const sampleSchedule = [
//     { day: 0, time: 0, course: "AI Ethics", type: "lecture", color: "#6e73ff" },
//     { day: 0, time: 2, course: "Data Structures", type: "lab", color: "#8ac5ff" },
//     { day: 1, time: 1, course: "Machine Learning", type: "lecture", color: "#b388ff" },
//     { day: 1, time: 3, course: "Web Dev", type: "lab", color: "#6e73ff" },
//     { day: 2, time: 0, course: "Algorithms", type: "lecture", color: "#8ac5ff" },
//     { day: 2, time: 4, course: "Database", type: "lecture", color: "#b388ff" },
//     { day: 3, time: 1, course: "Software Eng", type: "lecture", color: "#6e73ff" },
//     { day: 3, time: 3, course: "AI Lab", type: "lab", color: "#8ac5ff" },
//     { day: 4, time: 2, course: "Networks", type: "lecture", color: "#b388ff" },
//     { day: 4, time: 4, course: "Project", type: "lab", color: "#6e73ff" },
//   ]

//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
//   const timeSlots = ["9:00", "10:30", "12:00", "1:30", "3:00", "4:30"]

//   return (
//     <div className="min-h-screen smooth-scroll-container">
//       {/* Main Navigation */}
//       <MainNav />

//       {/* Hero Section */}
//       <section className="relative overflow-hidden hero-gradient glass-section">
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
//           <div className="absolute inset-0 glass-particles"></div>
//         </div>
//         <div className="relative container mx-auto px-4 py-20 lg:py-32">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8 animate-fade-in-up-smooth">
//               <div className="space-y-4">
//                 <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-ai glass-badge">
//                   <Sparkles className="h-3 w-3 mr-1" />
//                   QUANTIME_AI_POWERED.v2.0
//                 </Badge>
//                 <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight font-display glass-text-glow">
//                   Quantum
//                   <span className="block text-yellow-300 animate-pulse font-ai">Timetabling</span>
//                   Intelligence
//                 </h1>
//                 <p className="text-xl text-white/90 leading-relaxed max-w-lg">
//                   Revolutionary AI algorithms that eliminate scheduling conflicts and optimize resource allocation in
//                   milliseconds.
//                 </p>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link href="/signup">
//                   <Button
//                     size="lg"
//                     className="btn-primary-enhanced text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse font-display"
//                   >
//                     Initialize AI
//                     <ArrowRight className="ml-2 h-5 w-5" />
//                   </Button>
//                 </Link>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm font-display glass-button-secondary"
//                 >
//                   <Play className="mr-2 h-5 w-5" />
//                   Smart Demo
//                 </Button>
//               </div>
//               <div className="flex items-center gap-8 pt-4">
//                 <div className="text-center glass-stat">
//                   <div className="text-3xl font-bold text-white font-ai">99.9%</div>
//                   <div className="text-white/80 text-sm">Accuracy</div>
//                 </div>
//                 <div className="text-center glass-stat">
//                   <div className="text-3xl font-bold text-white font-ai">0.3s</div>
//                   <div className="text-white/80 text-sm">Processing</div>
//                 </div>
//                 <div className="text-center glass-stat">
//                   <div className="text-3xl font-bold text-white font-ai">24/7</div>
//                   <div className="text-white/80 text-sm">AI Active</div>
//                 </div>
//               </div>
//             </div>
//             {/* Enhanced Schedule Preview */}
//             <div className="relative animate-slide-in-right-smooth">
//               <div className="relative z-10">
//                 <div className="glass-hero-enhanced p-8 rounded-3xl">
//                   <div className="space-y-6">
//                     <div className="flex items-center justify-between mb-6">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg glass-icon-container">
//                           <Calendar className="h-5 w-5 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                             Smart Schedule Matrix
//                           </h3>
//                           <p className="text-sm font-ai opacity-70" style={{ color: "var(--secondary-text)" }}>
//                             CS_DEPT_SEM_4.quantime
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse glass-indicator"></div>
//                         <div
//                           className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse glass-indicator"
//                           style={{ animationDelay: "0.5s" }}
//                         ></div>
//                         <div
//                           className="w-3 h-3 bg-green-400 rounded-full animate-pulse glass-indicator"
//                           style={{ animationDelay: "1s" }}
//                         ></div>
//                       </div>
//                     </div>
//                     {/* Time slots header */}
//                     <div
//                       className="grid grid-cols-6 gap-2 text-xs text-center font-medium font-ai mb-4"
//                       style={{ color: "var(--secondary-text)" }}
//                     >
//                       <div></div>
//                       {days.map((day) => (
//                         <div key={day} className="py-2 glass-day-header">
//                           {day}
//                         </div>
//                       ))}
//                     </div>
//                     {/* Schedule grid */}
//                     <div className="space-y-2">
//                       {timeSlots.map((time, timeIndex) => (
//                         <div key={time} className="grid grid-cols-6 gap-2">
//                           <div
//                             className="text-xs font-ai py-3 text-center glass-time-slot"
//                             style={{ color: "var(--secondary-text)" }}
//                           >
//                             {time}
//                           </div>
//                           {days.map((day, dayIndex) => {
//                             const courseData = sampleSchedule.find(
//                               (item) => item.day === dayIndex && item.time === timeIndex,
//                             )
//                             return (
//                               <div
//                                 key={`${day}-${time}`}
//                                 className={`h-12 rounded-lg schedule-block-enhanced flex items-center justify-center text-xs font-medium text-white transition-all duration-300 ${
//                                   courseData ? "animate-schedule-pulse-enhanced" : "opacity-20"
//                                 }`}
//                                 style={{
//                                   backgroundColor: courseData?.color || "#f3f4f6",
//                                   animationDelay: `${(dayIndex + timeIndex) * 0.1}s`,
//                                 }}
//                               >
//                                 {courseData && (
//                                   <div className="text-center">
//                                     <div className="font-semibold text-xs">{courseData.course}</div>
//                                     <div className="text-xs opacity-80 font-ai">
//                                       {courseData.type === "lab" ? "LAB" : "LEC"}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             )
//                           })}
//                         </div>
//                       ))}
//                     </div>
//                     {/* Status indicators */}
//                     <div className="flex items-center justify-between pt-4 border-t border-white/20 glass-status-bar">
//                       <div className="flex items-center gap-4 text-xs font-ai">
//                         <div className="flex items-center gap-2">
//                           <div
//                             className="w-2 h-2 rounded-full glass-legend-dot"
//                             style={{ backgroundColor: "#6e73ff" }}
//                           ></div>
//                           <span style={{ color: "var(--secondary-text)" }}>Core</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div
//                             className="w-2 h-2 rounded-full glass-legend-dot"
//                             style={{ backgroundColor: "#8ac5ff" }}
//                           ></div>
//                           <span style={{ color: "var(--secondary-text)" }}>Lab</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <div
//                             className="w-2 h-2 rounded-full glass-legend-dot"
//                             style={{ backgroundColor: "#b388ff" }}
//                           ></div>
//                           <span style={{ color: "var(--secondary-text)" }}>Elective</span>
//                         </div>
//                       </div>
//                       <div className="text-xs font-ai glass-status-text" style={{ color: "var(--secondary-text)" }}>
//                         ✓ Conflict-Free
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="absolute -top-8 -right-8 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse glass-orb"></div>
//               <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000 glass-orb"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-gradient-to-b from-white to-gray-50/50 glass-section-light">
//         <div className="container mx-auto px-4">
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
//             {[
//               {
//                 icon: CheckCircle,
//                 title: "Zero Conflicts",
//                 description: "AI-guaranteed conflict-free schedules",
//                 color: "#6e73ff",
//               },
//               {
//                 icon: Zap,
//                 title: "Quantum Speed",
//                 description: "Millisecond processing with smart algorithms",
//                 color: "#8ac5ff",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Smart Analytics",
//                 description: "Predictive insights and optimization",
//                 color: "#b388ff",
//               },
//               {
//                 icon: Users,
//                 title: "Cognitive Interface",
//                 description: "Intuitive AI-powered user experience",
//                 color: "#6e73ff",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className="glass-card-enhanced border-0 text-center p-6 card-hover-enhanced"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div
//                   className="p-4 rounded-2xl mb-4 mx-auto w-fit glass-feature-icon"
//                   style={{ backgroundColor: `${feature.color}20` }}
//                 >
//                   <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
//                 </div>
//                 <h3 className="font-semibold font-display mb-2" style={{ color: "var(--foreground)" }}>
//                   {feature.title}
//                 </h3>
//                 <p className="text-sm font-ai" style={{ color: "var(--secondary-text)" }}>
//                   {feature.description}
//                 </p>
//               </Card>
//             ))}
//           </div>
//           <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
//             <Badge
//               className="bg-primary/10 border-primary/20 font-ai glass-badge-primary"
//               style={{ color: "var(--primary)" }}
//             >
//               QUANTIME_FEATURES.advanced
//             </Badge>
//             <h2
//               className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
//               style={{ color: "var(--secondary-text)" }}
//             >
//               Powered by
//               <span className="block text-gradient font-ai">Quantum Intelligence</span>
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--secondary-text)" }}>
//               Experience the next evolution of scheduling with our quantum-enhanced AI platform
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Brain,
//                 title: "Smart Processing Engine",
//                 description: "Advanced quantum algorithms that learn and adapt to your scheduling patterns",
//                 color: "#6e73ff",
//                 gradient: "from-purple-500/10 to-purple-600/10",
//               },
//               {
//                 icon: Zap,
//                 title: "Quantum Optimization",
//                 description: "Parallel processing across multiple dimensions for instant conflict resolution",
//                 color: "#8ac5ff",
//                 gradient: "from-cyan-500/10 to-cyan-600/10",
//               },
//               {
//                 icon: Shield,
//                 title: "Predictive Conflict Shield",
//                 description: "AI predicts and prevents conflicts before they occur using machine learning",
//                 color: "#b388ff",
//                 gradient: "from-violet-500/10 to-violet-600/10",
//               },
//               {
//                 icon: Users,
//                 title: "Collaborative Intelligence",
//                 description: "Multi-agent AI system that coordinates across departments seamlessly",
//                 color: "#6e73ff",
//                 gradient: "from-blue-500/10 to-blue-600/10",
//               },
//               {
//                 icon: BarChart3,
//                 title: "Quantum Analytics",
//                 description: "Deep learning insights that optimize resource utilization and predict trends",
//                 color: "#8ac5ff",
//                 gradient: "from-teal-500/10 to-teal-600/10",
//               },
//               {
//                 icon: Download,
//                 title: "Universal Export Matrix",
//                 description: "AI-powered formatting that adapts to any system or platform automatically",
//                 color: "#b388ff",
//                 gradient: "from-pink-500/10 to-pink-600/10",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className={`group card-hover-enhanced border-0 shadow-xl bg-gradient-to-br ${feature.gradient} animate-fade-in-smooth glass-feature-card`}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <CardHeader className="text-center pb-4">
//                   <div
//                     className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-white to-gray-50 group-hover:scale-110 transition-transform duration-300 shadow-lg glass-feature-icon-large"
//                     style={{ color: feature.color }}
//                   >
//                     <feature.icon className="h-8 w-8" />
//                   </div>
//                   <CardTitle
//                     className="text-xl font-bold font-display group-hover:text-primary transition-colors"
//                     style={{ color: "var(--secondary-text)" }}
//                   >
//                     {feature.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center">
//                   <CardDescription
//                     className="text-base leading-relaxed font-ai"
//                     style={{ color: "var(--secondary-text)" }}
//                   >
//                     {feature.description}
//                   </CardDescription>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Tech Stack Section */}
//       <TechStack />

//       {/* How It Works Section */}
//       <section id="how-it-works" className="py-20 bg-white glass-section-light">
//         <div className="container mx-auto px-4">
//           <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
//             <Badge className="bg-primary/10 text-primary border-primary/20 font-ai glass-badge-primary">
//               QUANTIME_WORKFLOW.smart
//             </Badge>
//             <h2
//               className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
//               style={{ color: "var(--secondary-text)" }}
//             >
//               Smart 3-Phase Process
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
//               From data ingestion to quantum-optimized schedule deployment in three revolutionary phases
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-3 gap-8">
//             {[
//               {
//                 step: "01",
//                 title: "Data Smart Ingestion",
//                 description:
//                   "Advanced AI parsers intelligently extract and validate course, faculty, and resource data from multiple formats with quantum accuracy.",
//                 icon: Database,
//                 color: "#6e73ff",
//                 bgGradient: "from-purple-50 to-purple-100",
//               },
//               {
//                 step: "02",
//                 title: "Quantum Processing Matrix",
//                 description:
//                   "Our smart engine processes infinite constraint combinations using quantum algorithms to generate optimal, conflict-free timetables.",
//                 icon: Brain,
//                 color: "#8ac5ff",
//                 bgGradient: "from-cyan-50 to-cyan-100",
//               },
//               {
//                 step: "03",
//                 title: "Intelligent Export Synthesis",
//                 description:
//                   "AI-powered formatters generate beautiful, customized outputs optimized for any platform or printing requirement.",
//                 icon: Sparkles,
//                 color: "#b388ff",
//                 bgGradient: "from-violet-50 to-violet-100",
//               },
//             ].map((step, index) => (
//               <div
//                 key={index}
//                 className="text-center space-y-6 animate-fade-in-smooth"
//                 style={{ animationDelay: `${index * 200}ms` }}
//               >
//                 <Card
//                   className={`glass-card-enhanced border-0 p-8 bg-gradient-to-br ${step.bgGradient} glass-workflow-card`}
//                 >
//                   <div className="relative mb-6">
//                     <div
//                       className="text-6xl font-bold opacity-10 mb-4 font-ai glass-step-number"
//                       style={{ color: step.color }}
//                     >
//                       {step.step}
//                     </div>
//                     <div className="relative -mt-12">
//                       <div
//                         className="inline-flex p-6 rounded-3xl shadow-lg mb-4 glass-step-icon"
//                         style={{ backgroundColor: step.color }}
//                       >
//                         <step.icon className="w-12 h-12 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h3 className="text-2xl font-bold font-display" style={{ color: "var(--foreground)" }}>
//                       {step.title}
//                     </h3>
//                     <p className="leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//                       {step.description}
//                     </p>
//                   </div>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section id="team" className="py-20 bg-gradient-to-b from-gray-50 to-white glass-section-light">
//         <div className="container mx-auto px-4">
//           <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
//             <Badge
//               className="bg-accent/10 border-accent/20 font-ai glass-badge-accent"
//               style={{ color: "var(--accent)" }}
//             >
//               QUANTIME_ARCHITECTS.team
//             </Badge>
//             <h2
//               className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
//               style={{ color: "var(--secondary-text)" }}
//             >
//               The Quantum Minds
//               <span className="block text-gradient font-ai">Behind the Intelligence</span>
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
//               Four exceptional quantum architects who engineered the future of scheduling
//             </p>
//           </div>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {teamMembers.map((member, index) => (
//               <div
//                 key={index}
//                 className="team-card-enhanced animate-fade-in-smooth"
//                 style={{ animationDelay: `${index * 150}ms` }}
//               >
//                 <div className="team-card-inner relative h-96">
//                   {/* Front of card */}
//                   <Card className="team-card-front absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden glass-team-card">
//                     <div className="relative h-full">
//                       <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16 glass-team-decoration"></div>
//                       <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
//                         <div className="relative">
//                           <Image
//                             src={member.image || "/placeholder.svg"}
//                             alt={member.name}
//                             width={120}
//                             height={120}
//                             className="rounded-full border-4 border-white shadow-xl glass-team-avatar"
//                           />
//                           <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-primary to-accent rounded-full glass-team-icon">
//                             <member.icon className="h-4 w-4 text-white" />
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <h3 className="text-xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//                             {member.name}
//                           </h3>
//                           <p className="text-sm font-medium font-ai" style={{ color: "var(--primary)" }}>
//                             {member.role}
//                           </p>
//                         </div>
//                         <div className="flex flex-wrap gap-1 justify-center">
//                           {member.skills.slice(0, 2).map((skill, skillIndex) => (
//                             <Badge key={skillIndex} variant="secondary" className="text-xs font-ai glass-skill-badge">
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </div>
//                   </Card>
//                   {/* Back of card */}
//                   <Card className="team-card-back absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden glass-team-card">
//                     <CardContent className="p-6 h-full flex flex-col justify-center space-y-4">
//                       <div className="text-center space-y-3">
//                         <h3 className="text-lg font-bold font-display" style={{ color: "var(--secondary-text)" }}>
//                           {member.name}
//                         </h3>
//                         <p className="text-sm leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//                           {member.description}
//                         </p>
//                       </div>
//                       <div className="space-y-3">
//                         <div className="flex flex-wrap gap-1 justify-center">
//                           {member.skills.map((skill, skillIndex) => (
//                             <Badge
//                               key={skillIndex}
//                               variant="outline"
//                               className="text-xs font-ai glass-skill-badge-outline"
//                             >
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>
//                         <div className="flex justify-center gap-3">
//                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0 glass-social-button">
//                             <Github className="h-4 w-4" />
//                           </Button>
//                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0 glass-social-button">
//                             <Linkedin className="h-4 w-4" />
//                           </Button>
//                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0 glass-social-button">
//                             <Twitter className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <FAQSection />

//       {/* Contact Us Section */}
//       <section id="contact" className="py-20 bg-white glass-section-light">
//         <div className="container mx-auto px-4">
//           <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
//             <Badge className="bg-primary/10 text-primary border-primary/20 font-ai glass-badge-primary">
//               QUANTIME_CONTACT.interface
//             </Badge>
//             <h2
//               className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
//               style={{ color: "var(--secondary-text)" }}
//             >
//               Connect with Our Smart Network
//             </h2>
//             <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
//               Initialize communication protocol. Our AI agents respond within quantum time.
//             </p>
//           </div>
//           <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
//             {/* Contact Form */}
//             <Card className="glass-card-enhanced border-0 animate-slide-in-left-smooth">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-bold font-display" style={{ color: "var(--foreground)" }}>
//                   Transmit Message
//                 </CardTitle>
//                 <CardDescription className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                   Smart processing initiated. Response time: &lt; 24 hours.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                       First Name
//                     </label>
//                     <Input className="font-ai glass-input-enhanced" placeholder="John" />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                       Last Name
//                     </label>
//                     <Input className="font-ai glass-input-enhanced" placeholder="Doe" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                     Email
//                   </label>
//                   <Input type="email" className="font-ai glass-input-enhanced" placeholder="john@quantime.ai" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                     Subject
//                   </label>
//                   <Input className="font-ai glass-input-enhanced" placeholder="Smart inquiry protocol" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
//                     Message
//                   </label>
//                   <Textarea
//                     className="min-h-[120px] font-ai glass-input-enhanced"
//                     placeholder="Describe your quantum scheduling requirements..."
//                   />
//                 </div>
//                 <Button className="w-full btn-primary-enhanced text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-display">
//                   Transmit to Smart Network
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </CardContent>
//             </Card>
//             {/* Contact Information */}
//             <div className="space-y-8 animate-slide-in-right-smooth">
//               <div className="space-y-6">
//                 <h3 className="text-3xl font-bold font-display glass-text-glow" style={{ color: "var(--foreground)" }}>
//                   Smart Interface
//                 </h3>
//                 <p className="text-lg leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//                   Our quantum communication channels are always active. Connect with our smart architects.
//                 </p>
//               </div>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 glass-contact-item">
//                   <div className="p-3 bg-primary/10 rounded-2xl glass-contact-icon">
//                     <Mail className="h-6 w-6" style={{ color: "var(--primary)" }} />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                       Smart Mail
//                     </h4>
//                     <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                       E.admissions@umt.edu.pk
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 glass-contact-item">
//                   <div className="p-3 bg-primary/10 rounded-2xl glass-contact-icon">
//                     <Phone className="h-6 w-6" style={{ color: "var(--primary)" }} />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                       Quantum Line
//                     </h4>
//                     <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                       T. 042-111868868 - 111300200
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 glass-contact-item">
//                   <div className="p-3 bg-primary/10 rounded-2xl glass-contact-icon">
//                     <MapPin className="h-6 w-6" style={{ color: "var(--primary)" }} />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
//                       Smart Hub
//                     </h4>
//                     <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
//                       Department of AI, UMT Lahore, Pakistan
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="glass-card-enhanced p-6 rounded-2xl border-0">
//                 <h4 className="font-semibold font-display mb-4" style={{ color: "var(--foreground)" }}>
//                   Smart Activity Hours
//                 </h4>
//                 <div className="space-y-2 font-ai" style={{ color: "var(--secondary-text)" }}>
//                   <div className="flex justify-between">
//                     <span>Monday - Friday</span>
//                     <span>09:00 - 18:00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Saturday</span>
//                     <span>10:00 - 16:00</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Sunday</span>
//                     <span>Smart Rest Mode</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-white glass-section-light">
//         <div className="container mx-auto px-4 text-center">
//           <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up-smooth">
//             <h2
//               className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
//               style={{ color: "var(--secondary-text)" }}
//             >
//               Ready for Quantum Evolution?
//             </h2>
//             <p className="text-xl leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
//               Join the smart revolution. Thousands of institutions already use our quantum AI platform.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/signup">
//                 <Button
//                   size="lg"
//                   className="btn-primary-enhanced text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse font-display"
//                 >
//                   Initialize Smart Journey
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Button>
//               </Link>
//               <Link href="/login">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm font-display border-primary/30 hover:bg-primary/10 glass-button-secondary"
//                   style={{ color: "var(--primary)" }}
//                 >
//                   Access Smart Network
//                 </Button>
//               </Link>
//             </div>
//             <div className="flex items-center justify-center gap-6 pt-8">
//               <div
//                 className="flex items-center gap-2 font-ai glass-cta-feature"
//                 style={{ color: "var(--secondary-text)" }}
//               >
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span>No quantum credits required</span>
//               </div>
//               <div
//                 className="flex items-center gap-2 font-ai glass-cta-feature"
//                 style={{ color: "var(--secondary-text)" }}
//               >
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span>14-day smart trial</span>
//               </div>
//               <div
//                 className="flex items-center gap-2 font-ai glass-cta-feature"
//                 style={{ color: "var(--secondary-text)" }}
//               >
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span>Quantum flexibility</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }








import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Brain,
  Database,
  Trophy,
  Zap,
  Shield,
  Users,
  BarChart3,
  Download,
  Palette,
  Server,
  Lightbulb,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import { TechStack } from "@/components/tech-stack"
import { FAQSection } from "@/components/faq-section"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

// Imports for chatbot and contexts (from previous fixes)
import Chatbot from "@/components/chatbot" // Adjust path if needed
import { AuthProvider } from "@/contexts/auth-context" // Adjust path if needed
import { ThemeProvider } from "@/contexts/theme-context" // Adjust path if needed

export default function HomePage() {
  const teamMembers = [
  {
    name: "Awais Ali",
    role: "Full-Stack & AI Engineer",
    description:
      "Led system architecture, full-stack development, and AI integration. Built core logic using Django, React, and Next.js. Managed AWS deployment, Git workflows, and overall coordination.",
    skills: ["Django", "React", "Next.js", "Python", "System Design", "Algorithm", "AWS", "Git & GitHub"],
    image: "/Images/Awais.jpg",
    icon: Trophy,
    social: {
      github: "https://github.com/bettercallawais", // From your original code
      linkedin: "https://www.linkedin.com/in/awaisali-bi/",
    },
  },
  {
    name: "Mehdi Ishaq",
    role: "Backend Logic & AI Engineer",
    description:
      "Focused on backend logic, algorithm optimization, and AI integration. Ensured conflict-free scheduling and robust performance.",
    skills: ["Python", "Backend", "Logic Design", "AI Integration", "Optimization", "Git & GitHub"],
    image: "/Images/Mahad.jpg",
    icon: Server,
    social: {
      github: "https://github.com/mehdi060", // Based on search; update if incorrect
      linkedin: "https://www.linkedin.com/in/mehdi-ishaq-86505b227/",
    },
  },
  {
    name: "Kamran Hussain",
    role: "UI/UX Designer & AWS Support",
    description:
      "Handled visuals, branding, and AWS deployment. Created logos, banners, and presentation assets for a cohesive visual identity.",
    skills: ["UI/UX", "Graphic Design", "Branding", "AWS", "Documentation"],
    image: "/Images/Kamran.jpg",
    icon: Palette,
    social: {
      github: "https://github.com/Muhammad-Kamran-Hussain", // Based on search; update if incorrect
      linkedin: "https://www.linkedin.com/in/muhammad-kamran-hussain/",
    },
  },
  {
    name: "Qamar Hassan",
    role: "Team Ops & Research",
    description: "Managed documentation, prompt writing, budgeting, and assisted in presentations and research.",
    skills: ["Documentation", "Prompt Engineering", "Research", "Budget Management", "Team Support"],
    image: "/Images/Qamar.jpg",
    icon: Lightbulb,
    social: {
      github: "https://github.com/QamerHassan", // Based on search; update if incorrect
      linkedin: "https://www.linkedin.com/in/qamer-hassan-743a87226/",
    },
  },
]


  // Sample course data for the schedule preview
  // WHERE TO CHANGE: Fixed the syntax error here (changed "0operational" to "0" – this was the invalid octal literal)
  const sampleSchedule = [
    { day: 0, time: 0, course: "AI Ethics", type: "lecture", color: "#6e73ff" }, // Fixed: Removed "operational" typo
    { day: 0, time: 2, course: "Data Structures", type: "lab", color: "#8ac5ff" },
    { day: 1, time: 1, course: "Machine Learning", type: "lecture", color: "#b388ff" },
    { day: 1, time: 3, course: "Web Dev", type: "lab", color: "#6e73ff" },
    { day: 2, time: 0, course: "Algorithms", type: "lecture", color: "#8ac5ff" },
    { day: 2, time: 4, course: "Database", type: "lecture", color: "#b388ff" },
    { day: 3, time: 1, course: "Software Eng", type: "lecture", color: "#6e73ff" },
    { day: 3, time: 3, course: "AI Lab", type: "lab", color: "#8ac5ff" },
    { day: 4, time: 2, course: "Networks", type: "lecture", color: "#b388ff" },
    { day: 4, time: 4, course: "Project", type: "lab", color: "#6e73ff" },
  ]

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  const timeSlots = ["9:00", "10:30", "12:00", "1:30", "3:00", "4:30"]

  return (
    // Wrap everything in ThemeProvider and AuthProvider for chatbot contexts (from previous fixes)
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen smooth-scroll-container">
          {/* Main Navigation */}
          <MainNav />

          {/* Hero Section */}
          <section id="home" className="relative overflow-hidden hero-gradient glass-section">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
              <div className="absolute inset-0 glass-particles"></div>
            </div>
            <div className="relative container mx-auto px-4 py-20 lg:py-32">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-fade-in-up-smooth">
                  <div className="space-y-4">
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-ai glass-badge">
                      <Sparkles className="h-3 w-3 mr-1" />
                      QUANTIME_AI_POWERED.v2.0
                    </Badge>
                    <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight font-display glass-text-glow">
                      Quantum
                      <span className="block text-yellow-300 animate-pulse font-ai">Timetabling</span>
                      Intelligence
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                      Revolutionary AI algorithms that eliminate scheduling conflicts and optimize resource allocation in
                      milliseconds.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="btn-primary-enhanced text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse font-display"
                      >
                        Initialize AI
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm font-display glass-button-secondary"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Smart Demo
                    </Button>
                  </div>
                  <div className="flex items-center gap-8 pt-4">
                    <div className="text-center glass-stat">
                      <div className="text-3xl font-bold text-white font-ai">90%</div>
                      <div className="text-white/80 text-sm">Accuracy</div>
                    </div>
                    <div className="text-center glass-stat">
                      <div className="text-3xl font-bold text-white font-ai">200+</div>
                      <div className="text-white/80 text-sm">Timetables</div>
                    </div>
                    <div className="text-center glass-stat">
                      <div className="text-3xl font-bold text-white font-ai">24/7</div>
                      <div className="text-white/80 text-sm">AI Active</div>
                    </div>
                  </div>
                </div>
                {/* Enhanced Schedule Preview */}
                <div className="relative animate-slide-in-right-smooth">
                  <div className="relative z-10">
                    <div className="glass-hero-enhanced p-8 rounded-3xl">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg glass-icon-container">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold font-display text-gray-800">Smart Schedule Matrix</h3>
                              <p className="text-sm font-ai opacity-70 text-gray-600">CS_DEPT_SEM_4.quantime</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse glass-indicator"></div>
                            <div
                              className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse glass-indicator"
                              style={{ animationDelay: "0.5s" }}
                            ></div>
                            <div
                              className="w-3 h-3 bg-green-400 rounded-full animate-pulse glass-indicator"
                              style={{ animationDelay: "1s" }}
                            ></div>
                          </div>
                        </div>
                        {/* Time slots header */}
                        <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium font-ai mb-4 text-gray-700">
                          <div></div>
                          {days.map((day) => (
                            <div key={day} className="py-2 glass-day-header">
                              {day}
                            </div>
                          ))}
                        </div>
                        {/* Schedule grid */}
                        <div className="space-y-2">
                          {timeSlots.map((time, timeIndex) => (
                            <div key={time} className="grid grid-cols-6 gap-2">
                              <div className="text-xs font-ai py-3 text-center glass-time-slot text-gray-700">{time}</div>
                              {days.map((day, dayIndex) => {
                                const courseData = sampleSchedule.find(
                                  (item) => item.day === dayIndex && item.time === timeIndex,
                                )
                                return (
                                  <div
                                    key={`${day}-${time}`}
                                    className={`h-12 rounded-lg schedule-block-enhanced flex items-center justify-center text-xs font-medium text-white transition-all duration-300 ${
                                      courseData ? "animate-schedule-pulse-enhanced" : "opacity-20"
                                    }`}
                                    style={{
                                      backgroundColor: courseData?.color || "#f3f4f6",
                                      animationDelay: `${(dayIndex + timeIndex) * 0.1}s`,
                                    }}
                                  >
                                    {courseData && (
                                      <div className="text-center">
                                        <div className="font-semibold text-xs">{courseData.course}</div>
                                        <div className="text-xs opacity-80 font-ai">
                                          {courseData.type === "lab" ? "LAB" : "LEC"}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          ))}
                        </div>
                        {/* Status indicators */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/20 glass-status-bar">
                          <div className="flex items-center gap-4 text-xs font-ai">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full glass-legend-dot"
                                style={{ backgroundColor: "#6e73ff" }}
                              ></div>
                              <span className="text-gray-700">Core</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full glass-legend-dot"
                                style={{ backgroundColor: "#8ac5ff" }}
                              ></div>
                              <span className="text-gray-700">Lab</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full glass-legend-dot"
                                style={{ backgroundColor: "#b388ff" }}
                              ></div>
                              <span className="text-gray-700">Elective</span>
                            </div>
                          </div>
                          <div className="text-xs font-ai glass-status-text text-gray-700">✓ Conflict-Free</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-8 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse glass-orb"></div>
                  <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000 glass-orb"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {[
                  {
                    icon: CheckCircle,
                    title: "Zero Conflicts",
                    description: "AI-guaranteed conflict-free schedules",
                    color: "#6e73ff",
                  },
                  {
                    icon: Zap,
                    title: "Quantum Speed",
                    description: "Millisecond processing with smart algorithms",
                    color: "#8ac5ff",
                  },
                  {
                    icon: BarChart3,
                    title: "Smart Analytics",
                    description: "Predictive insights and optimization",
                    color: "#b388ff",
                  },
                  {
                    icon: Users,
                    title: "Cognitive Interface",
                    description: "Intuitive AI-powered user experience",
                    color: "#6e73ff",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="glass-card-enhanced border-0 text-center p-6 card-hover-enhanced bg-white/90"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className="p-4 rounded-2xl mb-4 mx-auto w-fit glass-feature-icon"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                    </div>
                    <h3 className="font-semibold font-display mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-sm font-ai text-gray-600">{feature.description}</p>
                  </Card>
                ))}
              </div>
              <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
                <Badge className="bg-primary/10 border-primary/20 font-ai glass-badge-primary text-primary">
                  QUANTIME_FEATURES.advanced
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold font-display glass-text-glow text-gray-800">
                  Powered by
                  <span className="block text-gradient font-ai">Quantum Intelligence</span>
                </h2>
                <p className="text-xl max-w-3xl mx-auto text-gray-600">
                  Experience the next evolution of scheduling with our quantum-enhanced AI platform
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Brain,
                    title: "Smart Processing Engine",
                    description: "Advanced quantum algorithms that learn and adapt to your scheduling patterns",
                    color: "#6e73ff",
                    gradient: "from-purple-500/10 to-purple-600/10",
                  },
                  {
                    icon: Zap,
                    title: "Quantum Optimization",
                    description: "Parallel processing across multiple dimensions for instant conflict resolution",
                    color: "#8ac5ff",
                    gradient: "from-cyan-500/10 to-cyan-600/10",
                  },
                  {
                    icon: Shield,
                    title: "Predictive Conflict Shield",
                    description: "AI predicts and prevents conflicts before they occur using machine learning",
                    color: "#b388ff",
                    gradient: "from-violet-500/10 to-violet-600/10",
                  },
                  {
                    icon: Users,
                    title: "Collaborative Intelligence",
                    description: "Multi-agent AI system that coordinates across departments seamlessly",
                    color: "#6e73ff",
                    gradient: "from-blue-500/10 to-blue-600/10",
                  },
                  {
                    icon: BarChart3,
                    title: "Quantum Analytics",
                    description: "Deep learning insights that optimize resource utilization and predict trends",
                    color: "#8ac5ff",
                    gradient: "from-teal-500/10 to-teal-600/10",
                  },
                  {
                    icon: Download,
                    title: "Universal Export Matrix",
                    description: "AI-powered formatting that adapts to any system or platform automatically",
                    color: "#b388ff",
                    gradient: "from-pink-500/10 to-pink-600/10",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className={`group card-hover-enhanced border-0 shadow-xl bg-gradient-to-br ${feature.gradient} animate-fade-in-smooth glass-feature-card bg-white/95`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-white to-gray-50 group-hover:scale-110 transition-transform duration-300 shadow-lg glass-feature-icon-large"
                        style={{ color: feature.color }}
                      >
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl font-bold font-display group-hover:text-primary transition-colors text-gray-800">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-base leading-relaxed font-ai text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <TechStack />

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-ai glass-badge-primary">
                  QUANTIME_WORKFLOW.smart
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold font-display glass-text-glow text-gray-800">
                  Smart 3-Phase Process
                </h2>
                <p className="text-xl max-w-3xl mx-auto font-ai text-gray-600">
                  From data ingestion to quantum-optimized schedule deployment in three revolutionary phases
                </p>
              </div>
              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Data Smart Ingestion",
                    description:
                      "Advanced AI parsers intelligently extract and validate course, faculty, and resource data from multiple formats with quantum accuracy.",
                    icon: Database,
                    color: "#6e73ff",
                    bgGradient: "from-purple-50 to-purple-100",
                  },
                  {
                    step: "02",
                    title: "Quantum Processing Matrix",
                    description:
                      "Our smart engine processes infinite constraint combinations using quantum algorithms to generate optimal, conflict-free timetables.",
                    icon: Brain,
                    color: "#8ac5ff",
                    bgGradient: "from-cyan-50 to-cyan-100",
                  },
                  {
                    step: "03",
                    title: "Intelligent Export Synthesis",
                    description:
                      "AI-powered formatters generate beautiful, customized outputs optimized for any platform or printing requirement.",
                    icon: Sparkles,
                    color: "#b388ff",
                    bgGradient: "from-violet-50 to-violet-100",
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="text-center space-y-6 animate-fade-in-smooth"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <Card
                      className={`glass-card-enhanced border-0 p-8 bg-gradient-to-br ${step.bgGradient} glass-workflow-card bg-white/95`}
                    >
                      <div className="relative mb-6">
                        <div
                          className="text-6xl font-bold opacity-10 mb-4 font-ai glass-step-number"
                          style={{ color: step.color }}
                        >
                          {step.step}
                        </div>
                        <div className="relative -mt-12">
                          <div
                            className="inline-flex p-6 rounded-3xl shadow-lg mb-4 glass-step-icon"
                            style={{ backgroundColor: step.color }}
                          >
                            <step.icon className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold font-display text-gray-800">{step.title}</h3>
                        <p className="leading-relaxed font-ai text-gray-600">{step.description}</p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>

          
          {/* Team Section - Enhanced with restored flip animation and fixed layering */}
          <section id="team" className="py-20 bg-gradient-to-b from-gray-50 to-white glass-section-light">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
              <Badge
                className="bg-accent/10 border-accent/20 font-ai glass-badge-accent"
                style={{ color: "var(--accent)" }}
              >
                QUANTIME_ARCHITECTS.team
              </Badge>
              <h2
                className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
                style={{ color: "var(--secondary-text)" }}
              >
                The Quantum Minds
                <span className="block text-gradient font-ai">Behind the Intelligence</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
                Four exceptional quantum architects who engineered the future of scheduling
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="team-card-enhanced animate-fade-in-smooth"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="team-card-inner relative h-96 transition-transform duration-800" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Front of card */}
                    <Card className="team-card-front absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden glass-team-card" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="relative h-full z-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16 glass-team-decoration"></div>
                        <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
                          <div className="relative z-20">
                            <Image
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              width={120}
                              height={120}
                              className="rounded-full border-4 border-white shadow-xl glass-team-avatar object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-primary to-accent rounded-full glass-team-icon z-30 scale-110">
                              <member.icon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="space-y-2 z-10">
                            <h3 className="text-xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
                              {member.name}
                            </h3>
                            <p className="text-sm font-medium font-ai" style={{ color: "var(--primary)" }}>
                              {member.role}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center z-10">
                            {member.skills.slice(0, 2).map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs font-ai glass-skill-badge rounded-md border border-gray-300 px-2 py-1">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                    {/* Back of card */}
                    <Card className="team-card-back absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden glass-team-card" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                      <CardContent className="p-6 h-full flex flex-col justify-center space-y-4">
                        <div className="text-center space-y-3">
                          <h3 className="text-lg font-bold font-display" style={{ color: "var(--secondary-text)" }}>
                            {member.name}
                          </h3>
                          <p className="text-sm leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
                            {member.description}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {member.skills.map((skill, skillIndex) => (
                              <Badge
                                key={skillIndex}
                                variant="outline"
                                className="text-xs font-ai glass-skill-badge-outline rounded-md border border-gray-300 px-2 py-1"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-center gap-3">
                            <Link href={member.social.github}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 glass-social-button">
                                <Github className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={member.social.linkedin}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 glass-social-button">
                                <Linkedin className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


          {/* FAQ Section */}
          <FAQSection />

          {/* Contact Us Section */}
          <section id="contact" className="py-20 bg-white glass-section-light">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4 mb-16 animate-fade-in-up-smooth">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-ai glass-badge-primary">
                  QUANTIME_CONTACT.interface
                </Badge>
                <h2
                  className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
                  style={{ color: "var(--secondary-text)" }}
                >
                  Connect with Our Smart Network
                </h2>
                <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
                  Initialize communication protocol. Our AI agents respond within quantum time.
                </p>
              </div>
              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <Card className="glass-card-enhanced border-0 animate-slide-in-left-smooth">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold font-display" style={{ color: "var(--foreground)" }}>
                      Transmit Message
                    </CardTitle>
                    <CardDescription className="font-ai" style={{ color: "var(--secondary-text)" }}>
                      Smart processing initiated. Response time: &lt; 24 hours.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
                          First Name
                        </label>
                        <Input className="font-ai glass-input-enhanced" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
                          Last Name
                        </label>
                        <Input className="font-ai glass-input-enhanced" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
                        Email
                      </label>
                      <Input type="email" className="font-ai glass-input-enhanced" placeholder="john@quantime.ai" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
                        Subject
                      </label>
                      <Input className="font-ai glass-input-enhanced" placeholder="Smart inquiry protocol" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium font-ai" style={{ color: "var(--foreground)" }}>
                        Message
                      </label>
                      <Textarea
                        className="min-h-[120px] font-ai glass-input-enhanced"
                        placeholder="Describe your quantum scheduling requirements..."
                      />
                    </div>
                    <Button className="w-full btn-primary-enhanced text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-display">
                      Transmit to Smart Network
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
                {/* Contact Information */}
                <div className="space-y-8 animate-slide-in-right-smooth">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold font-display glass-text-glow" style={{ color: "var(--foreground)" }}>
                      Smart Interface
                    </h3>
                    <p className="text-lg leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
                      Our quantum communication channels are always active. Connect with our smart architects.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 glass-contact-item">
                      <div className="p-3 bg-primary/10 rounded-2xl glass-contact-icon">
                        <Mail className="h-6 w-6" style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
                          Smart Mail
                        </h4>
                        <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
                          E.admissions@umt.edu.pk
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 glass-contact-item">
                      <div className="p-3 bg-primary/10 rounded-2xl glass-contact-icon">
                        <Phone className="h-6 w-6" style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
                          Quantum Line
                        </h4>
                        <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
                          T. 042-111868868 - 111300200
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 glass-contact-item">
                      <div className="p-3 bg-primary/10 rounded-2xl glass-contact-icon">
                        <MapPin className="h-6 w-6" style={{ color: "var(--primary)" }} />
                      </div>
                      <div>
                        <h4 className="font-semibold font-display" style={{ color: "var(--foreground)" }}>
                          Smart Hub
                        </h4>
                        <p className="font-ai" style={{ color: "var(--secondary-text)" }}>
                          Department of AI, UMT Lahore, Pakistan
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card-enhanced p-6 rounded-2xl border-0">
                    <h4 className="font-semibold font-display mb-4" style={{ color: "var(--foreground)" }}>
                      Smart Activity Hours
                    </h4>
                    <div className="space-y-2 font-ai" style={{ color: "var(--secondary-text)" }}>
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 - 16:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Smart Rest Mode</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white glass-section-light">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up-smooth">
                <h2
                  className="text-4xl lg:text-6xl font-bold font-display glass-text-glow"
                  style={{ color: "var(--secondary-text)" }}
                >
                  Ready for Quantum Evolution?
                </h2>
                <p className="text-xl leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
                  Join the smart revolution. Thousands of institutions already use our quantum AI platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="btn-primary-enhanced text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse font-display"
                    >
                      Initialize Smart Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm font-display border-primary/30 hover:bg-primary/10 glass-button-secondary"
                      style={{ color: "var(--primary)" }}
                    >
                      Access Smart Network
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-6 pt-8">
                  <div
                    className="flex items-center gap-2 font-ai glass-cta-feature"
                    style={{ color: "var(--secondary-text)" }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>No quantum credits required</span>
                  </div>
                  <div
                    className="flex items-center gap-2 font-ai glass-cta-feature"
                    style={{ color: "var(--secondary-text)" }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>14-day smart trial</span>
                  </div>
                  <div
                    className="flex items-center gap-2 font-ai glass-cta-feature"
                    style={{ color: "var(--secondary-text)" }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Quantum flexibility</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />

          {/* Add the Chatbot here (it floats over everything) – from previous fixes */}
          <Chatbot />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

