'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SearchBar from '../../components/SearchBar'
import IntroCard from '../../components/IntroCard'
import FilterPanel from '../../components/FilterPanel'
import LoadingSpinner from '../../components/LoadingSpinner'
import { searchIntros } from '../../lib/api'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    categories: [],
    moods: [],
    visualStyles: [],
    pace: null
  })

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams])

  async function performSearch(searchQuery) {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const data = await searchIntros(searchQuery, {
        category: filters.categories[0], // Use first category for now
        mood: filters.moods[0], // Use first mood for now
        limit: 50
      })
      
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(newQuery) {
    setQuery(newQuery)
    router.push(`/search?q=${encodeURIComponent(newQuery)}`)
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters)
    // Re-run search with new filters
    if (query) {
      performSearch(query)
    }
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} defaultValue={query} />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Suspense', 'Comedy', 'Educational', 'Dramatic', 'Energetic'].map(category => (
            <button
              key={category}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  categories: [category]
                }))
                if (query) performSearch(query)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.categories.includes(category)
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner message="Searching..." />
            ) : results.length > 0 ? (
              <>
                <div className="mb-6 text-text-secondary">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(intro => (
                    <IntroCard
                      key={intro.id}
                      intro={intro}
                      matchScore={intro.matchScore}
                    />
                  ))}
                </div>
              </>
            ) : query ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-2">No intros found</h2>
                <p className="text-text-secondary mb-6">
                  Try different keywords or adjust your filters
                </p>
                <button
                  onClick={() => router.push('/browse')}
                  className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Browse All Intros
                </button>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold mb-2">Start Searching</h2>
                <p className="text-text-secondary">
                  Enter a search query to find the perfect intro style
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

