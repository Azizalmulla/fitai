"use client"

import { useState, useCallback } from "react"
import { ChatInterface, type ChatMessage } from "./chat-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Initial welcome message
const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi there! I'm your AI fitness coach. How can I help you with your fitness journey today?",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
}

export function AICoachContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)

  // This function will be replaced with your actual GPT integration
  const handleSendMessage = useCallback(async (message: string) => {
    setIsLoading(true)

    try {
      // This is where you'll integrate with GPT API
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, you would:
      // 1. Call your GPT API endpoint
      // 2. Process the response
      // 3. Add the assistant's response to the messages

      // Placeholder for GPT response
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "This is a placeholder response. Replace this with your GPT integration.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message to GPT:", error)

      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <Card className="bg-black border-white/10 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white"></span>
          AI Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-60px)]">
        <ChatInterface
          initialMessages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          className="h-full"
        />
      </CardContent>
    </Card>
  )
}
