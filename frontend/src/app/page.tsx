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
} from "lucide-react"
import Image from "next/image"
import { Chatbot } from "@/components/chatbot"

export default function HomePage() {
  const teamMembers = [
    {
      name: "Awais",
      role: "Team Lead & Full-Stack Developer",
      description:
        "Leading the project with expertise in system architecture and backend development. Passionate about creating scalable solutions.",
      skills: ["Django", "React", "System Design", "Leadership"],
      image: "/placeholder.svg?height=300&width=300",
      icon: Trophy,
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Mahad",
      role: "Frontend Developer & UI/UX Designer",
      description:
        "Crafting beautiful and intuitive user interfaces. Specializes in modern web technologies and user experience design.",
      skills: ["React", "Next.js", "UI/UX", "Tailwind CSS"],
      image: "/placeholder.svg?height=300&width=300",
      icon: Palette,
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Kamran",
      role: "Backend Developer & Database Architect",
      description:
        "Building robust backend systems and optimizing database performance. Expert in server-side technologies and API development.",
      skills: ["Python", "PostgreSQL", "API Design", "DevOps"],
      image: "/placeholder.svg?height=300&width=300",
      icon: Server,
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Qamar",
      role: "AI/ML Engineer & Algorithm Specialist",
      description:
        "Developing intelligent algorithms for optimal timetable generation. Specializes in machine learning and optimization techniques.",
      skills: ["Python", "Machine Learning", "Algorithms", "Data Science"],
      image: "/placeholder.svg?height=300&width=300",
      icon: Lightbulb,
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 mesh-bg"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Scheduling Revolution
                </Badge>
                <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight">
                  Next-Gen
                  <span className="block text-yellow-300 animate-pulse">Timetable</span>
                  Intelligence
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                  Experience the future of academic scheduling with our revolutionary AI system. Create perfect
                  timetables in seconds, not hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-white/80 text-sm">Schedules Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-white/80 text-sm">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-white/80 text-sm">AI Support</div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative z-10">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="AI Timetable Dashboard"
                  width={800}
                  height={600}
                  className="rounded-3xl shadow-2xl border border-white/20 animate-float"
                />
              </div>
              <div className="absolute -top-8 -right-8 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <Badge className="bg-primary/10 text-primary border-primary/20">Revolutionary Features</Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-secondary">
              Powered by
              <span className="block text-gradient">Artificial Intelligence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the next generation of scheduling with our AI-driven platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Engine",
                description: "Advanced machine learning algorithms optimize your schedules automatically",
                color: "text-purple-500",
                gradient: "from-purple-500/10 to-purple-600/10",
              },
              {
                icon: Zap,
                title: "Lightning Speed",
                description: "Generate complex timetables in milliseconds with quantum-fast processing",
                color: "text-yellow-500",
                gradient: "from-yellow-500/10 to-yellow-600/10",
              },
              {
                icon: Shield,
                title: "Zero Conflicts",
                description: "Intelligent conflict detection ensures perfect scheduling every time",
                color: "text-green-500",
                gradient: "from-green-500/10 to-green-600/10",
              },
              {
                icon: Users,
                title: "Smart Collaboration",
                description: "Real-time multi-user editing with intelligent merge capabilities",
                color: "text-blue-500",
                gradient: "from-blue-500/10 to-blue-600/10",
              },
              {
                icon: BarChart3,
                title: "Predictive Analytics",
                description: "AI insights predict optimal room utilization and resource allocation",
                color: "text-indigo-500",
                gradient: "from-indigo-500/10 to-indigo-600/10",
              },
              {
                icon: Download,
                title: "Universal Export",
                description: "Export to any format with intelligent formatting and styling",
                color: "text-red-500",
                gradient: "from-red-500/10 to-red-600/10",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`group card-hover border-0 shadow-xl bg-gradient-to-br ${feature.gradient} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`inline-flex p-4 rounded-3xl bg-gradient-to-br from-white to-gray-50 group-hover:scale-110 transition-transform duration-300 ${feature.color} shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-secondary via-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <Badge className="bg-white/20 text-white border-white/30">AI Workflow</Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-white">Intelligent 3-Step Process</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From data upload to perfect AI-optimized schedule in three revolutionary steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Smart Data Ingestion",
                description:
                  "AI automatically analyzes and validates your course data, detecting patterns and constraints",
                image: "/placeholder.svg?height=300&width=400",
                icon: Database,
              },
              {
                step: "02",
                title: "Neural Processing",
                description:
                  "Advanced neural networks generate thousands of optimal scheduling combinations in real-time",
                image: "/placeholder.svg?height=300&width=400",
                icon: Brain,
              },
              {
                step: "03",
                title: "Intelligent Export",
                description: "AI formats and optimizes your perfect timetable for any platform or format you need",
                image: "/placeholder.svg?height=300&width=400",
                icon: Sparkles,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center space-y-6 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <div className="text-8xl font-bold text-white/10 mb-4">{step.step}</div>
                  <div className="relative">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      width={400}
                      height={300}
                      className="rounded-2xl shadow-2xl border border-white/20 mx-auto hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  <p className="text-white/80 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <Badge className="bg-accent/10 text-accent border-accent/20">Meet Our Team</Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-secondary">
              The Brilliant Minds
              <span className="block text-gradient">Behind the Magic</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Four exceptional developers who turned their vision into reality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="team-card-inner relative h-96">
                  {/* Front of card */}
                  <Card className="team-card-front absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
                    <div className="relative h-full">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16"></div>
                      <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative">
                          <Image
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-white shadow-xl"
                          />
                          <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-primary to-accent rounded-full">
                            <member.icon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-secondary">{member.name}</h3>
                          <p className="text-sm text-primary font-medium">{member.role}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {member.skills.slice(0, 2).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </Card>

                  {/* Back of card */}
                  <Card className="team-card-back absolute inset-0 border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                    <CardContent className="p-6 h-full flex flex-col justify-center space-y-4">
                      <div className="text-center space-y-3">
                        <h3 className="text-lg font-bold text-secondary">{member.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {member.skills.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-center gap-3">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Github className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Twitter className="h-4 w-4" />
                          </Button>
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

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-secondary via-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <Badge className="bg-white/20 text-white border-white/30">Get In Touch</Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-white">Contact Our Team</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Send us a Message</CardTitle>
                <CardDescription className="text-white/80">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">First Name</label>
                    <Input
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Last Name</label>
                    <Input
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input
                    type="email"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Subject</label>
                  <Input
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Message</label>
                  <Textarea
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-[120px]"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <Button className="w-full bg-white text-primary hover:bg-white/90 text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Send Message
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8 animate-slide-in-right">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">Get in Touch</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  We're here to help and answer any question you might have. We look forward to hearing from you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Email Us</h4>
                    <p className="text-white/80">team@umttimetable.edu.pk</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Call Us</h4>
                    <p className="text-white/80">+92 42 111 300 200</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Visit Us</h4>
                    <p className="text-white/80">
                      University of Management and Technology
                      <br />
                      Lahore, Pakistan
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <h4 className="font-semibold text-white mb-4">Office Hours</h4>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="text-4xl lg:text-6xl font-bold text-white">Ready for the Future?</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of institutions already using our AI-powered platform to revolutionize their scheduling
              process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 animate-glow-pulse"
                >
                  Start Your AI Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-2xl bg-transparent backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 pt-8">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
