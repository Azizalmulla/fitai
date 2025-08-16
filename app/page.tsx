import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/images/science-logo.png.png" 
            alt="Zentra Science Logo" 
            width={42} 
            height={42} 
            style={{ objectFit: 'contain' }}
          />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Zentra</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-16 uppercase text-sm font-semibold tracking-wider text-gray-400">
            <li className="relative group transform transition-transform duration-300 hover:scale-105">
              <Link href="/science" className="px-3 py-2 transition-colors duration-200 text-gray-400 group-hover:text-white">
                Science
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li className="relative group transform transition-transform duration-300 hover:scale-105">
              <Link href="/features" className="px-3 py-2 transition-colors duration-200 text-gray-400 group-hover:text-white">
                Features
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
            <li className="relative group transform transition-transform duration-300 hover:scale-105">
              <a href="#pricing" className="px-3 py-2 transition-colors duration-200 text-gray-400 group-hover:text-white">
                Pricing
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center space-y-8 p-6">
        <div className="mb-8">
          <img
            src="/images/science-logo.png.png"
            alt="Evidence-Based Fitness Science"
            width={180}
            height={180}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h2 className="text-6xl font-thin text-center">The future of fitness is intelligent.</h2>
        <p className="text-xl max-w-lg text-center font-light">
          Evidence-based workouts and training plans powered by scientific research.
        </p>
        <Link
          href="/questionnaire"
          className="bg-white text-black rounded-full px-8 py-3 font-medium hover:bg-gray-200 transition"
        >
          Change Your Life
        </Link>
      </main>

      <footer className="py-4 text-center text-sm text-white/50"> 2024 Zentra. All rights reserved.</footer>
    </div>
  )
}
