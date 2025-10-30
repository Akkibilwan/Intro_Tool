'use client'

import { useState, useEffect } from 'react'
import IntroCard from '../../components/IntroCard'
import FilterPanel from '../../components/FilterPanel'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAllIntros } from '../../lib/api'

export default function BrowsePage() {
  const [intros, setIntros] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('created_at')
  const [filters, setFilters] = useState({
    categories: [],
    moods: [],
    visualStyles: [],
    pace: null
  })

  useEffect(() => {
    loadIntros()
  }, [page, sortBy, filters])

  async function loadIntros() {
    setLoading(true)
    try {
      const filterParams = {}
      if (filters.categories?.length > 0) {
        filterParams.category = filters.categories[0]
      }
      if (filters.moods?.length > 0) {
        filterParams.mood = filters.moods[0]
      }
      
      const data = await getAllIntros(page, 18, {
        sortBy,
        ...filterParams
      })
      
      setIntros(data.data || [])
      if (data.pagination) {
        setTotalPages(data.pagination.pages)
      }
    } catch (error) {
      console.error('Error loading intros:', error)
      setIntros([])
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse All Intros</h1>
            <p className="text-text-secondary">
              Explore our collection of AI-analyzed video intros
            </p>
          </div>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-bg-secondary border border-border-color rounded-lg focus:border-accent-blue focus:ring-2 focus:ring-accent-blue focus:ring-opacity-20"
          >
            <option value="created_at">Most Recent</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Intros Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner message="Loading intros..." />
            ) : intros.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {intros.map(intro => (
                    <IntroCard key={intro.id} intro={intro} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-bg-secondary border border-border-color rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-tertiary transition-colors"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-text-secondary">
                      Page {page} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-bg-secondary border border-border-color rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-tertiary transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📽️</div>
                <h2 className="text-2xl font-bold mb-2">No intros found</h2>
                <p className="text-text-secondary">
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

