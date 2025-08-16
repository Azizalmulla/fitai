import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="/images/science-logo.png.png"
              alt="Zentra Logo"
              width={42}
              height={42}
              className="object-contain"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Zentra</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-16 uppercase text-sm font-semibold tracking-wider text-gray-400">
            <li>
              <Link href="/science" className="px-3 py-2 transition-colors duration-200 text-gray-400 hover:text-white">
                Science
              </Link>
            </li>
            <li>
              <Link href="/features" className="px-3 py-2 text-white">
                Features
              </Link>
            </li>
            <li>
              <a href="#pricing" className="px-3 py-2 transition-colors duration-200 text-gray-400 hover:text-white">
                Pricing
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow px-8 py-32 max-w-4xl mx-auto space-y-8">
        <h2 className="text-5xl font-thin">Features</h2>
        <ul className="list-disc list-inside text-lg text-gray-300 space-y-4">
          <li>Personalized workout plans tailored by AI based on your profile.</li>
          <li>Dynamic adaptation to fatigue, performance, and recovery metrics.</li>
          <li>Nutrition guidance optimized for macronutrient balance and timing.</li>
          <li>Progress tracking with data visualizations and insights.</li>
          <li>Seamless integration with wearables for real-time biofeedback.</li>
        </ul>
        <p className="text-lg leading-relaxed text-gray-300">
          All features are underpinned by rigorous scientific research and cutting-edge machine learning
          models to deliver results, not just promises.
        </p>
      </main>

      <footer className="py-4 text-center text-sm text-white/50">
        © 2025 Zentra. All rights reserved.
      </footer>
    </div>
  )
}
