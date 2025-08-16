import Link from "next/link"

export default function SciencePage() {
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
              <Link href="/science" className="px-3 py-2 text-white">
                Science
              </Link>
            </li>
            <li>
              <Link href="/features" className="px-3 py-2 transition-colors duration-200 text-gray-400 hover:text-white">
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
        <h2 className="text-5xl font-thin">Science</h2>
        <p className="text-lg leading-relaxed text-gray-300">
          At Zentra, we harness the latest in exercise physiology and biomechanics to
          deliver training plans that adapt to your unique biology and goals.
        </p>
        <p className="text-lg leading-relaxed text-gray-300">
          Our AI algorithms analyze hundreds of peer-reviewed studies, leveraging meta-analyses
          and randomized trials to optimize workout intensity, volume, and recovery for you.
        </p>
        <p className="text-lg leading-relaxed text-gray-300">
          With continuous learning, your plan evolves as you progress—ensuring you stay challenged,
          motivated, and on a trajectory to your best self.
        </p>
      </main>

      <footer className="py-4 text-center text-sm text-white/50">
        © 2025 Zentra. All rights reserved.
      </footer>
    </div>
  )
}
