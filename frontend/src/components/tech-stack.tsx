"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image" // Import for logos

export function TechStack() {
  const technologies = [
    {
      name: "React",
      category: "Frontend",
      color: "#61DAFB",
      description: "Modern UI Library",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", // Paste your logo URL here (e.g., /public/tech/react.svg)
    },
    {
      name: "Next.js",
      category: "Framework",
      color: "#000000",
      description: "Full-Stack React Framework",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", // Paste your logo URL here
    },
    {
      name: "Django",
      category: "Backend",
      color: "#092E20",
      description: "Python Web Framework",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg", // Paste your logo URL here
    },
    {
      name: "Python",
      category: "Language",
      color: "#3776AB",
      description: "AI & Backend Logic",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", // Paste your logo URL here
    },
    {
      name: "SQLite",
      category: "Database",
      color: "#003B57",
      description: "Lightweight Relational Database",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg", // Paste your logo URL here
    },
    {
      name: "TypeScript",
      category: "Language",
      color: "#3178C6",
      description: "Type-Safe JavaScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", // Paste your logo URL here
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-ai">QUANTIME TECH.stack</Badge>
          <h2 className="text-4xl lg:text-6xl font-bold font-display text-gray-800">
            Built with
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cutting-Edge Tech
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto font-ai text-gray-600">
            Our quantum platform leverages the most advanced technologies for unparalleled performance
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"> {/* Responsive grid: 2 on mobile, 3 on md, 6 on lg */}
          {technologies.map((tech, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/95 glass-card-enhanced card-hover-enhanced hover:scale-105" // Enhanced hover: scale + shadow
              style={{ animationDelay: `${index * 100}ms` }} // Staggered fade-in
            >
              <CardContent className="p-6 text-center space-y-4 flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-300" // Circular frame with hover scale
                  style={{ backgroundColor: `${tech.color}10` }} // Subtle color tint
                >
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold font-display text-lg text-gray-800">{tech.name}</h3>
                  <p className="text-sm font-ai text-gray-600">{tech.description}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs font-ai bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-full px-3 py-1" // Rounded badge for fresh look
                >
                  {tech.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
