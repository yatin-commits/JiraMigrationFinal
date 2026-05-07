import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-sm">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-4 sm:px-6">
        <div className="justify-self-start" />
        <Link
          to="/"
          className="justify-self-center min-w-0 max-w-full px-1 sm:px-2 text-center font-semibold tracking-tight whitespace-nowrap text-[clamp(0.95rem,3.4vw,1.25rem)] sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
        >
          Descartes Jira History
        </Link>

        <div className="flex justify-self-end gap-2">
        {/* <Link to="/" className="text-white text-sm px-4 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
          Project Issues
        </Link> */}
        {/* <Link to="/users" className="text-white text-sm px-4 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors">
          User Filter
        </Link> */}
        </div>
      </div>
    </header>
  )
}