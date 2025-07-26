"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const techStack = [
  {
    name: "Django",
    icon: "🐍",
    color: "from-green-400 to-green-600",
    description: "Backend Framework",
  },
  {
    name: "Python",
    icon: "🔥",
    color: "from-blue-400 to-blue-600",
    description: "Core Language",
  },
  {
    name: "React",
    icon: "⚛️",
    color: "from-cyan-400 to-cyan-600",
    description: "Frontend Library",
  },
  {
    name: "Next.js",
    icon: "▲",
    color: "from-gray-700 to-gray-900",
    description: "React Framework",
  },
  {
    name: "TypeScript",
    icon: "📘",
    color: "from-blue-500 to-blue-700",
    description: "Type Safety",
  },
  {
    name: "Tailwind",
    icon: "🎨",
    color: "from-teal-400 to-teal-600",
    description: "CSS Framework",
  },
  {
    name: "AWS",
    icon: "☁️",
    color: "from-orange-400 to-orange-600",
    description: "Cloud Platform",
  },
  {
    name: "GitHub",
    icon: "🐙",
    color: "from-purple-400 to-purple-600",
    description: "Version Control",
  },
]

export function TechStack() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-ai">TECH_STACK.exe</Badge>
          <h2 className="text-4xl lg:text-6xl font-bold font-display" style={{ color: "var(--foreground)" }}>
            Powered by
            <span className="block text-gradient font-ai">Advanced Technology</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: "var(--secondary-text)" }}>
            Built with cutting-edge technologies for maximum performance and reliability
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-6xl mx-auto">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div
                className="glass-card p-6 text-center hover:scale-110 transition-all duration-300 animate-tech-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`text-4xl mb-3 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                  {tech.icon}
                </div>
                <h3 className="font-semibold font-ai text-sm mb-1" style={{ color: "var(--foreground)" }}>
                  {tech.name}
                </h3>
                <p className="text-xs opacity-70" style={{ color: "var(--secondary-text)" }}>
                  {tech.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
