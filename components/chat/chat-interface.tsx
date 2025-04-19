"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  onSendMessage: (message: string) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function ChatInterface({
  initialMessages = [],
  onSendMessage,
  isLoading = false,
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    // Add user message to the UI
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    // Call the parent component's handler to process the message
    await onSendMessage(userMessage.content)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Add a new message from the assistant (called by parent component)
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex items-start gap-3 max-w-[85%]", message.role === "user" ? "ml-auto" : "")}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2 text-sm",
                message.role === "user" ? "bg-white text-black" : "bg-white/10 text-white",
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.timestamp && <div className="text-xs opacity-50 mt-1">{message.timestamp}</div>}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white/10 text-white rounded-lg px-4 py-2 text-sm">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI coach a question..."
            className="min-h-[50px] max-h-[200px] resize-none bg-black border-white/10 focus-visible:ring-white"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-white text-black hover:bg-white/90 h-[50px] px-4"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          AI coach can provide fitness advice, nutrition tips, and workout suggestions.
        </div>
      </div>
    </div>
  )
}
