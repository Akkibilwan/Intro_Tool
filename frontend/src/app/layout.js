import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YouTube Intro Analyzer',
  description: 'AI-powered intro suggestions for content creators',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-bg-secondary border-t border-border-color py-8 mt-20">
          <div className="container-custom text-center text-text-secondary text-sm">
            <p>YouTube Intro Analyzer &copy; 2025</p>
            <p className="mt-2">AI-powered intro analysis for content creators</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

