"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "How does the Quantum AI scheduling algorithm work?",
    answer:
      "Our smart network processes thousands of constraint combinations simultaneously using quantum-inspired algorithms. It analyzes course requirements, faculty availability, room capacity, and student preferences to generate optimal, conflict-free schedules in milliseconds.",
  },
  {
    question: "Can the system handle complex scheduling constraints?",
    answer:
      "Our AI engine handles multiple constraint types including time preferences, room specifications, faculty availability, course prerequisites, lab requirements, and even custom institutional policies. The more constraints you provide, the more optimized your schedule becomes.",
  },
  {
    question: "What file formats does the smart upload system support?",
    answer:
      "The quantum data ingestion system supports Excel files (.xlsx, .xls), CSV files, PDF documents, and plain text files. You can upload up to 20 files simultaneously, and our AI will intelligently parse and integrate all the data.",
  },
  {
    question: "How accurate is the conflict detection system?",
    answer:
      "Our smart conflict detection achieves 99.9% accuracy through advanced machine learning algorithms. The system not only prevents scheduling conflicts but also predicts potential issues before they occur, ensuring perfect timetables every time.",
  },
  {
    question: "Can I export schedules to different formats?",
    answer:
      "Yes! Our universal export matrix supports multiple formats including PDF, Excel, CSV, and direct integration with popular calendar systems. The AI automatically formats the output based on your specific requirements and institutional standards.",
  },
  {
    question: "Is there a limit to the number of courses or students?",
    answer:
      "Our quantum processing engine scales infinitely. Whether you're scheduling for 100 students or 10,000, the system maintains the same lightning-fast performance and accuracy. The smart architecture adapts to your institution's size automatically.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-primary/10 border-primary/20 font-ai" style={{ color: "var(--primary)" }}>
            QUANTIME_FAQ.database
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-bold font-display" style={{ color: "var(--secondary-text)" }}>
            Quantum
            <span className="block text-gradient font-ai">Knowledge Base</span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto font-ai" style={{ color: "var(--secondary-text)" }}>
            Access our smart database for answers to common quantum scheduling queries
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold font-display pr-4" style={{ color: "var(--foreground)" }}>
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5" style={{ color: "var(--primary)" }} />
                      ) : (
                        <ChevronDown className="w-5 h-5" style={{ color: "var(--primary)" }} />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-gray-200/50">
                          <p className="pt-4 leading-relaxed font-ai" style={{ color: "var(--secondary-text)" }}>
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
