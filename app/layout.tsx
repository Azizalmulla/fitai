import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitAI - Science-Based Fitness Intelligence",
  description: "Personalized workout plans and nutrition guidance powered by science and artificial intelligence.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body
        className={`${inter.className} antialiased bg-pearl-glass text-gray-900`}
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px) saturate(180%)",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  )
}
