"use client";

import Link from "next/link";
import { AICoachContainer } from "@/components/chat/ai-coach-container";

export default function CoachPage() {
  return (
    <div className="flex h-screen bg-black text-white antialiased font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-black/90 p-8 flex flex-col space-y-4 sticky top-0 shadow-xl">
        <nav className="flex flex-col space-y-4">
          <Link
            href="/dashboard"
            className="py-2 px-4 rounded-lg hover:bg-white/10 transition flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </nav>
      </aside>

      {/* Chat Panel */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 bg-black border-b border-white/20">
          <h1 className="text-xl font-semibold uppercase tracking-wide">
            AI Coach
          </h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AICoachContainer />
        </div>

        {/* Input */}
        <footer className="px-6 py-4 bg-black border-t border-white/20">
          <input
            type="text"
            placeholder="Type your message…"
            className="w-full bg-black/80 text-white p-3 rounded-lg placeholder-white/60 focus:outline-none"
          />
        </footer>
      </main>
    </div>
  );
}