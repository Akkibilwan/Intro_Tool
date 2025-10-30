'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-color backdrop-blur-sm bg-opacity-95">
      <div className="container-custom">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent-blue rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold">Intro Analyzer</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isActive('/')
                  ? 'text-accent-blue'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              href="/browse"
              className={`font-medium transition-colors ${
                isActive('/browse')
                  ? 'text-accent-blue'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Browse
            </Link>
            <Link
              href="/search"
              className={`font-medium transition-colors ${
                isActive('/search')
                  ? 'text-accent-blue'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Search
            </Link>
            
            {/* CTA Button */}
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
            >
              Install Extension
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

