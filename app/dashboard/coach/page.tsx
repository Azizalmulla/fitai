"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Dumbbell, Apple, MessageSquare, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { AICoachContainer } from "@/components/chat/ai-coach-container";

export default function CoachPage() {
  return (
    <div className="w-full h-screen bg-[#121212] text-white antialiased font-sans">
      <AICoachContainer />
    </div>
  )
}
