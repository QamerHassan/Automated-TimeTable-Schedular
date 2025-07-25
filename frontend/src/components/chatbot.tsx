"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl animate-glow-pulse transition-all duration-300 ${isOpen ? "hidden" : "flex"}`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-md animate-slide-up">
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">UMT Assistant</CardTitle>
                  <p className="text-sm text-white/80">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[400px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.isBot ? "justify-start" : "justify-end"}`}>
                    {message.isBot && (
                      <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${message.isBot ? "bg-gray-100 text-gray-800" : "bg-gradient-to-r from-primary to-accent text-white"}`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!message.isBot && (
                      <div className="p-2 bg-accent/10 rounded-full flex-shrink-0">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50/50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 border-0 bg-white shadow-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
