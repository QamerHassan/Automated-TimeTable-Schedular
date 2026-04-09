"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How does QuantiMe's AI algorithm work?",
    answer:
      "QuantiMe uses advanced quantum-inspired algorithms that process multiple constraint dimensions simultaneously. Our AI learns from scheduling patterns and optimizes resource allocation while ensuring zero conflicts.",
  },
  {
    question: "What file formats does QuantiMe support?",
    answer:
      "QuantiMe supports Excel (.xlsx, .xls), CSV, and JSON formats. Our smart parsers can intelligently extract course, faculty, and resource data from various structured formats.",
  },
  {
    question: "How long does it take to generate a timetable?",
    answer:
      "With our quantum processing engine, most timetables are generated in milliseconds to a few seconds, depending on complexity. Large institutional schedules typically complete within 30 seconds.",
  },
  {
    question: "Can QuantiMe handle complex scheduling constraints?",
    answer:
      "Yes! QuantiMe excels at managing complex constraints including faculty availability, room capacity, equipment requirements, student conflicts, and departmental preferences simultaneously.",
  },
  {
    question: "Is there a limit to the number of courses or students?",
    answer:
      "QuantiMe scales dynamically. Our quantum algorithms can handle thousands of courses, faculty members, and students without performance degradation.",
  },
  {
    question: "How accurate is the conflict detection?",
    answer:
      "QuantiMe guarantees 100% conflict-free schedules. Our AI performs exhaustive validation across all dimensions including time, space, resources, and personnel.",
  },
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium font-ai">
            QUANTIME_FAQ.smart
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold font-display text-gray-800">
            Frequently Asked
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Questions
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto font-ai text-gray-600">
            Everything you need to know about our quantum scheduling intelligence
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/95 backdrop-blur-sm glass-card-enhanced hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full p-6 text-left justify-between hover:bg-gray-50/80 rounded-lg transition-all duration-200"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-lg font-semibold font-display text-gray-800">{faq.question}</span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-primary transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary transition-transform duration-200" />
                  )}
                </Button>

                {openItems.includes(index) && (
                  <div className="px-6 pb-6 animate-fade-in-smooth">
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-ai leading-relaxed text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
