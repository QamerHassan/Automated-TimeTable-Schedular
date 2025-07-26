"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

const botResponses = {
  greeting: [
    "Hello! I'm your UMT Timetable Assistant. How can I help you today?",
    "Hi there! I'm here to help you with any questions about our timetable scheduling system.",
    "Welcome! I'm the UMT Timetable bot. What would you like to know?",
  ],
  creators: [
    "This amazing software was created by a talented team of four developers: Awais (Team Lead), Mahad, Kamran, and Qamar. They're final year students at UMT who built this as their capstone project!",
    "Our development team consists of four brilliant minds: Awais, Mahad, Kamran, and Qamar. They've put their heart and soul into creating this intelligent scheduling system.",
  ],
  features: [
    "Our system offers AI-powered scheduling, conflict detection, multi-format export, real-time updates, and support for university, school, and personal timetables! It solves the complex problem of manual timetable creation, saving countless hours and ensuring optimal resource utilization.",
    "Key features include: automatic timetable generation, Excel/CSV import, conflict-free scheduling, room optimization, and beautiful export options. This drastically reduces the time and effort traditionally required for academic scheduling.",
  ],
  help: [
    "I can help you with: understanding features, learning about the creators, getting started guides, troubleshooting, and general questions about the system.",
    "Feel free to ask me about: how to create timetables, file formats, team information, system features, or any technical questions!",
  ],
  default: [
    "I'm not sure about that specific question, but I'm here to help! Try asking about our features, the development team, or how to use the system.",
    "That's an interesting question! While I might not have that exact information, I can tell you about our timetable features, the amazing team behind this project, or help you get started.",
  ],
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your UMT Timetable Assistant. I can help you learn about our features, meet our development team, or answer any questions about the system. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return getRandomResponse(botResponses.greeting)
    }
    if (
      message.includes("creator") ||
      message.includes("developer") ||
      message.includes("team") ||
      message.includes("awais") ||
      message.includes("mahad") ||
      message.includes("kamran") ||
      message.includes("qamar") ||
      message.includes("who made") ||
      message.includes("who created")
    ) {
      return getRandomResponse(botResponses.creators)
    }
    if (
      message.includes("feature") ||
      message.includes("what can") ||
      message.includes("capability") ||
      message.includes("function") ||
      message.includes("solves") ||
      message.includes("problem")
    ) {
      return getRandomResponse(botResponses.features)
    }
    if (message.includes("help") || message.includes("support") || message.includes("assist")) {
      return getRandomResponse(botResponses.help)
    }
    return getRandomResponse(botResponses.default)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate bot thinking time
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button - Fixed Position */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl transition-all duration-300 border-2 border-white/20 glass-button-float"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
            boxShadow: "0 8px 32px rgba(110, 115, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <MessageCircle className="h-7 w-7 text-white drop-shadow-sm" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
        </Button>
      )}

      {/* Chat Window - Fixed Position */}
      {isOpen && (
        <div className="w-96 h-[500px] shadow-2xl border-0 glass-card-enhanced animate-slide-up-smooth bg-white rounded-lg overflow-hidden">
          {/* Header - Fixed at top with high z-index */}
          <div className="p-4 rounded-t-lg relative overflow-hidden glass-header z-50 bg-gradient-to-r from-blue-600 to-purple-600">
            <div
              className="absolute inset-0 z-0"
              style={{
                background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent z-1"></div>
            <div className="absolute inset-0 glass-shimmer-overlay z-2"></div>
            <div className="relative flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 glass-icon-float">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-white font-display font-semibold">Quantime Assistant</h3>
                  <p className="text-sm text-white/80 font-ai">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full glass-close-button z-60 relative"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Area - Below header with lower z-index */}
          <div className="flex flex-col h-[400px] relative bg-white z-10">
            <ScrollArea className="flex-1 p-4 bg-white" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isBot ? "justify-start" : "justify-end"} animate-message-appear`}
                  >
                    {message.isBot && (
                      <div
                        className="p-2 rounded-full flex-shrink-0 border glass-avatar"
                        style={{
                          backgroundColor: "var(--primary)",
                          borderColor: "rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm glass-message ${
                        message.isBot ? "bg-gray-50 border border-gray-200" : "text-white shadow-lg"
                      }`}
                      style={
                        !message.isBot
                          ? {
                              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                            }
                          : { color: "var(--foreground)" }
                      }
                    >
                      <p className="text-sm font-ai">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isBot ? "opacity-60" : "opacity-80"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!message.isBot && (
                      <div
                        className="p-2 rounded-full flex-shrink-0 border glass-avatar"
                        style={{
                          backgroundColor: "var(--accent)",
                          borderColor: "rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area - At bottom with medium z-index */}
            <div className="p-4 border-t border-gray-200 bg-white z-20">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 border border-gray-300 bg-white shadow-sm font-ai"
                />
                <Button
                  onClick={handleSendMessage}
                  className="px-4 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                  }}
                >
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
