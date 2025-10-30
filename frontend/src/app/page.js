'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from '../components/SearchBar'
import IntroCard from '../components/IntroCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllIntros, getStats } from '../lib/api'

export default function Home() {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [trendingIntros, setTrendingIntros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [statsData, introsData] = await Promise.all([
        getStats(),
        getAllIntros(1, 10)
      ])
      
      setStats(statsData.data)
      setTrendingIntros(introsData.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(query) {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  function handleDelete(introId) {
    setTrendingIntros(prevIntros => prevIntros.filter(intro => intro.id !== introId))
  }

  if (loading) {
    return <LoadingSpinner message="Loading..." />
  }

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="container-custom text-center mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
          Find Perfect Intro Inspiration
        </h1>
        <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
          AI-powered intro suggestions based on thousands of analyzed YouTube videos
        </p>
        
        <div className="max-w-3xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} placeholder="Describe the intro style you're looking for..." />
        </div>
        
        <button
          onClick={() => router.push('/browse')}
          className="px-8 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Browse All Intros
        </button>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="container-custom mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-4xl font-bold text-accent-blue mb-2">
                {stats.totalIntros || 0}
              </div>
              <div className="text-text-secondary">Intros Analyzed</div>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl font-bold text-accent-purple mb-2">
                {stats.topCategories?.length || 0}
              </div>
              <div className="text-text-secondary">Categories</div>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl font-bold text-accent-blue mb-2">
                AI
              </div>
              <div className="text-text-secondary">Powered Analysis</div>
            </div>
          </div>
        </section>
      )}

      {/* Trending Intros */}
      {trendingIntros.length > 0 && (
        <section className="container-custom mb-20">
          <h2 className="text-3xl font-bold mb-8">Recent Intros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingIntros.map((intro) => (
              <IntroCard key={intro.id} intro={intro} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="container-custom">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Install Extension</h3>
            <p className="text-text-secondary">
              Add our Chrome extension to capture intros while browsing YouTube
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-purple rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Mark Great Intros</h3>
            <p className="text-text-secondary">
              Select start and end times of impressive video intros you discover
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Get AI Suggestions</h3>
            <p className="text-text-secondary">
              Search our database and get AI-analyzed suggestions for your videos
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

