"use client"

import * as React from "react";
import { useState } from "react";
import { ChatInterface, type ChatMessage } from "./chat-interface"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"

export function AICoachContainer({ className }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (message: string) => {
    setIsLoading(true)
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])

    // Get user's fitness data from localStorage
    let fitnessData = null;
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem("fitnessData");
        if (storedData) {
          fitnessData = JSON.parse(storedData);
        }
      } catch (error) {
        console.error("Error parsing fitness data from localStorage:", error);
      }
    }

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          fitnessData: fitnessData
        }),
      })
      // parse response JSON and append assistant message
      const data = await response.json().catch(() => ({ content: "Invalid server response" }))
      const assistantMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.content || "No response content",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (error) {
      console.error("Error sending message to GPT:", error)
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <ChatInterface
        initialMessages={messages}
        onSendMessageAction={handleSendMessage}
        isLoading={isLoading}
        className="flex-1 w-full h-full"
      />
    </div>
  )
}
