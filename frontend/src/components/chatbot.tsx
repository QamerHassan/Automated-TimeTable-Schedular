"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Bot, User, AlertCircle, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { useAuth } from "../contexts/auth-context"
import { useTheme } from "../contexts/theme-context"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  error?: boolean
}

interface ChatbotProps {
  className?: string
}

export default function Chatbot({ className }: ChatbotProps) {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: `Hello${user ? ` ${user.first_name}` : ""}! I'm Quantime Assistant. How can I help you with your timetable scheduling today?`,
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [retryMessage, setRetryMessage] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: messageText.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setRetryMessage(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      console.log("Client - Sending message to API:", messageText.trim()) // Debug from history

      const recentHistory = messages.slice(-4).map(m => ({
        role: m.isUser ? 'user' : 'model',
        parts: [{ text: m.text }]
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText.trim(),
          context: {
            user: user ? { name: user.first_name, id: user.id } : null,
            timestamp: new Date().toISOString(),
          },
          history: recentHistory,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("Client - API response status:", response.status) // Debug from history

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Client - API error details:", errorData) // Debug from history
        if (response.status === 429) {
          throw new Error("API quota exceeded. Please try again later or upgrade your plan.")
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Client - Full API response data:", data) // Debug from history

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: data.response || "I couldn't generate a proper response. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => {
        const newMessages = [...prev, botMessage]
        console.log("Client - Updated messages state:", newMessages) // Debug from history
        return newMessages
      })
    } catch (error) {
      console.error("Client - Chat error details:", error) // Debug from history

      let errorText = "I'm having trouble connecting right now. Please check your internet connection and try again."

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorText = "The request timed out. Please try again with a shorter message."
        } else if (error.message.includes("429") || error.message.includes("quota")) {
          errorText = "API quota exceeded. Please try again later."
        } else {
          errorText = error.message || errorText
        }
      }

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        error: true,
      }

      setMessages((prev) => {
        const newMessages = [...prev, errorMessage]
        console.log("Client - Updated messages with error:", newMessages) // Debug from history
        return newMessages
      })
      setRetryMessage(messageText.trim())
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, user, messages])

  const handleSendMessage = () => {
    sendMessage(inputValue)
  }

  const handleRetry = () => {
    if (retryMessage) {
      sendMessage(retryMessage)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        text: `Hello${user ? ` ${user.first_name}` : ""}! I'm Quantime Assistant. How can I help you with your timetable scheduling today?`,
        isUser: false,
        timestamp: new Date(),
      },
    ])
    setRetryMessage(null)
  }

  const handleToggleChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const currentScrollY = window.scrollY
    document.documentElement.classList.add("no-smooth-scroll")
    setIsOpen(!isOpen)
    setTimeout(() => {
      window.scrollTo(0, currentScrollY)
      document.documentElement.classList.remove("no-smooth-scroll")
    }, 100)
  }

  return (
    <React.Fragment>
      <div className={className}>
        <div
          className="fixed z-50"
          style={{ bottom: "1.5rem", right: "1.5rem" }}
        >
          <Button
            onClick={handleToggleChat}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 chatbot-icon-enhanced"
            aria-label={isOpen ? "Close chat" : "Open chat"}
            type="button"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <div className="relative">
                <MessageCircle className="h-6 w-6 text-gray-900" />
                <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
            )}
          </Button>
        </div>

        {isOpen && (
          <div
            className="fixed z-40 rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 glass-card-enhanced bg-white/95 animate-chatbox-in"
            style={{
              bottom: "5.5rem",
              right: "1.5rem",
              width: "24rem",
              height: "31.25rem",
              maxWidth: "calc(100vw - 3rem)",
              maxHeight: "calc(100vh - 8rem)",
              transformOrigin: "bottom right",
            }}
          >
            <div className="bg-gradient-to-r from-primary to-accent text-gray-900 p-4 glass-header-enhanced">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/30 rounded-full backdrop-blur-sm">
                    <Bot className="h-5 w-5 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg font-display">Quantime Assistant</h3>
                    <p className="text-sm text-gray-700 font-ai">
                      {isLoading ? "Thinking..." : "AI-powered • Always here to help"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={clearChat}
                    variant="ghost"
                    size="sm"
                    className="text-gray-900 hover:bg-white/30 h-8 w-8 p-0"
                    title="Clear chat"
                    type="button"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-900 hover:bg-white/30 h-8 w-8 p-0"
                    title="Close chat"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/95">
              <ScrollArea className="h-[340px] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.isUser
                            ? "bg-gradient-to-r from-primary to-accent text-gray-900 border border-primary/30 shadow-sm"
                            : message.error
                              ? "bg-red-50 text-red-800 border border-red-200"
                              : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {!message.isUser && (message.error ? (
                            <AlertCircle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                          ) : (
                            <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                          ))}
                          {message.isUser && <User className="h-4 w-4 mt-0.5 text-gray-900 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap font-ai">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.isUser ? "text-gray-600" : message.error ? "text-red-600/70" : "text-gray-500"
                            }`}>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2 max-w-[80%] bg-white border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-primary" />
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 font-ai">Quantime AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            <div className="border-t border-gray-200 p-4 bg-white/95">
              {retryMessage && (
                <div className="mb-2">
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent border-primary/30 text-primary hover:bg-primary/10"
                    disabled={isLoading}
                    type="button"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry last message
                  </Button>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about timetable scheduling..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white text-gray-800 placeholder-gray-500"
                  disabled={isLoading}
                  maxLength={500}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                  type="button"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs mt-1 text-gray-500 font-ai">{inputValue.length}/500 characters</p>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
