"use client"

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Dumbbell, Apple, MessageSquare, Settings, ArrowUp } from "lucide-react"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

interface ChatInterfaceProps {
  initialMessages?: ChatMessage[]
  onSendMessageAction: (message: string) => Promise<void>
  isLoading?: boolean
  className?: string
}

export function ChatInterface({
  initialMessages = [],
  onSendMessageAction,
  isLoading = false,
  className,
}: ChatInterfaceProps) {
  const { usePathname } = require("next/navigation");
  const pathname = usePathname ? usePathname() : "";

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  // sync state when parent initialMessages changes
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    await onSendMessageAction(userMessage.content)
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Suggested questions when chat is empty
  const SUGGESTIONS = [
    "Analyze my recent workouts and suggest improvements",
    "Plan a high-intensity interval session for weight loss",
    "Design a muscle recovery routine for my last session",
    "Create a personalized strength progression for this month",
  ]
  const sendSuggestion = async (suggestion: string) => {
    // simulate user typing and sending
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: suggestion, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    await onSendMessageAction(suggestion)
  }

  return (
    <div className="flex h-screen bg-[#121212] text-white antialiased font-sans">
      {/* Sidebar (copied from dashboard) */}
      <aside className="w-64 bg-gradient-to-b from-black via-zinc-900 to-zinc-950 border-r border-white/5 flex flex-col items-center py-8 space-y-2 sticky top-0 z-30 shadow-lg">
        {/* Science Logo at the top, as in dashboard */}
        <div className="mb-8 mt-2 flex items-center justify-center">
          <Image
            src="/images/science-logo.png.png"
            alt="Science Logo"
            width={44}
            height={44}
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
        <nav className="flex flex-col items-center gap-1 w-full mt-2">
          <Link href="/dashboard" className={`group flex flex-row items-center gap-3 w-full px-6 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-colors duration-200 ${pathname && pathname.startsWith('/dashboard') && !pathname.includes('coach') ? 'text-white bg-zinc-900/80 font-semibold' : ''}`}>
            <LayoutDashboard className="w-[22px] h-[22px]" strokeWidth={1.6} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/workout" className={`group flex flex-row items-center gap-3 w-full px-6 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-colors duration-200 ${pathname && pathname.startsWith('/workout') ? 'text-white bg-zinc-900/80 font-semibold' : ''}`}>
            <Dumbbell className="w-[22px] h-[22px]" strokeWidth={1.6} />
            <span className="text-sm">Workout</span>
          </Link>
          <Link href="/nutrition" className={`group flex flex-row items-center gap-3 w-full px-6 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-colors duration-200 ${pathname && pathname.startsWith('/nutrition') ? 'text-white bg-zinc-900/80 font-semibold' : ''}`}>
            <Apple className="w-[22px] h-[22px]" strokeWidth={1.6} />
            <span className="text-sm">Nutrition</span>
          </Link>
          <Link href="/dashboard/coach" className={`group flex flex-row items-center gap-3 w-full px-6 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-colors duration-200 ${pathname && pathname.includes('coach') ? 'text-white bg-zinc-900/80 font-semibold' : ''}`}>
            <MessageSquare className="w-[22px] h-[22px]" strokeWidth={1.6} />
            <span className="text-sm">AI Coach</span>
          </Link>
          <Link href="/settings" className={`group flex flex-row items-center gap-3 w-full px-6 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-colors duration-200 ${pathname && pathname.startsWith('/settings') ? 'text-white bg-zinc-900/80 font-semibold' : ''}`}>
            <Settings className="w-[22px] h-[22px]" strokeWidth={1.6} />
            <span className="text-sm">Settings</span>
          </Link>
        </nav>
      </aside>
      {/* Chat Content */}
      <main className={cn("flex-1 h-full flex flex-col", className)}>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent bg-black">
          {/* Suggestions when empty */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full space-y-3 max-w-md mx-auto">
              <Image src="/images/science-logo.png.png" width={64} height={64} alt="Science Logo" className="object-contain mb-4" />
              <h2 className="text-xl font-medium text-white">How can I help you today?</h2>
              <p className="text-sm text-zinc-400 text-center mb-4">Ask me about your fitness plan, nutrition advice, or workout tips</p>
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendSuggestion(q)}
                  className="px-4 py-3 w-full bg-zinc-800/60 border border-zinc-700 rounded-full text-white text-left text-sm transition-transform transform hover:scale-105 hover:bg-zinc-700"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          {messages.map((message, index) => (
            <div 
            key={message.id} 
            className={cn(
              "flex w-full items-start gap-3",  
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role !== "user" && (
              <Image src="/images/science-logo.png.png" width={20} height={20} alt="Science Logo" className="object-contain flex-shrink-0" />
            )}
            <div className={cn(
              message.role === "user"
                ? "bg-white text-zinc-900 border border-[#ececec] drop-shadow-lg rounded-full px-6 py-3 font-medium text-base max-w-[75%] ml-auto relative"
                : "p-4 rounded-3xl text-sm max-w-[75%] whitespace-pre-wrap shadow-lg bg-[#1f1f1f]/80 backdrop-blur-sm text-zinc-100"
            )}>
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.timestamp && index === messages.length - 1 && (
                <div className="text-[10px] opacity-60 mt-1.5 text-right">{message.timestamp}</div>
              )}
            </div>
            
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start items-start gap-3">
            <Image src="/images/science-logo.png.png" width={20} height={20} alt="Science Logo" className="object-contain flex-shrink-0" />
            <div className="p-3 rounded-2xl text-sm max-w-[75%] bg-zinc-800 text-zinc-100">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
        <div className="sticky bottom-0 px-6 py-4 bg-black">
          <div className="flex items-center w-full max-w-3xl mx-auto bg-black rounded-none px-4 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message..."
              className="flex-1 bg-white text-zinc-900 placeholder-gray-400 border-none resize-none focus:outline-none py-3 px-5 text-base min-h-[40px] max-h-[150px] rounded-full shadow-md transition-colors"
              style={{ scrollbarWidth: 'none' }}
            />
            <div className="flex-shrink-0 pl-2">
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-3 rounded-full transition-transform shadow-md disabled:cursor-not-allowed",
                  input.trim() && !isLoading
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-700"
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-xs text-center mt-2 text-zinc-500">Powered by 
            <span className="inline-flex items-center justify-center gap-1 ml-1">
              <Image src="/images/science-logo.png.png" width={14} height={14} alt="Science Logo" className="object-contain" />
              Zentra FIT
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
