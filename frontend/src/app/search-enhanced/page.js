'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SelectableIntroCard from '../../components/SelectableIntroCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { smartSearch, generateVisualDirection } from '../../lib/vdApi'

export default function SearchEnhancedPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [userContext, setUserContext] = useState('')
  const [results, setResults] = useState([])
  const [selectedIntros, setSelectedIntros] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setIsSearching(true)
    setError(null)
    setSelectedIntros([]) // Reset selections on new search

    try {
      const response = await smartSearch(query, userContext)
      
      if (response.success && response.results) {
        setResults(response.results)
        if (response.results.length === 0) {
          setError('No intros found matching your search. Try different keywords.')
        }
      } else {
        setError('Search failed. Please try again.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search intros. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  function handleSelectIntro(introId) {
    setSelectedIntros(prev => {
      if (prev.includes(introId)) {
        // Deselect
        return prev.filter(id => id !== introId)
      } else if (prev.length < 3) {
        // Select
        return [...prev, introId]
      }
      // Max selections reached
      return prev
    })
  }

  async function handleGenerateVD() {
    if (selectedIntros.length !== 3) {
      setError('Please select exactly 3 intros')
      return
    }

    if (!userContext.trim()) {
      setError('Please describe your video/channel')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await generateVisualDirection(
        selectedIntros,
        userContext,
        {
          duration: 20,
          includeText: true,
          includePerson: false
        }
      )

      if (response.success && response.vdId) {
        // Navigate to VD display page
        router.push(`/visual-direction?id=${response.vdId}`)
      } else {
        setError('Failed to generate Visual Direction. Please try again.')
      }
    } catch (err) {
      console.error('VD generation error:', err)
      setError(err.message || 'Failed to generate Visual Direction. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            AI-Powered Intro Generator
          </h1>
          <p className="text-text-secondary text-lg">
            Search for inspiration, select 3 intros, and get custom visual direction powered by AI
          </p>
        </div>

        {/* Search Section */}
        <div className="card mb-8">
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                What style are you looking for? *
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., epic dramatic with fast transitions and motion graphics"
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-color rounded-lg focus:border-accent-blue focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Describe your video/channel (optional)
              </label>
              <textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                placeholder="e.g., I create tech reviews for smartphones targeting young professionals"
                rows={3}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-color rounded-lg focus:border-accent-blue focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search Intros'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card bg-red-500 bg-opacity-10 border-red-500 mb-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Selection Bar */}
        {selectedIntros.length > 0 && (
          <div className="card bg-accent-blue bg-opacity-10 border-accent-blue mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">
                  Selected: {selectedIntros.length}/3 intros
                </h3>
                <p className="text-sm text-text-secondary">
                  {selectedIntros.length === 3 
                    ? 'Perfect! Now describe your video and generate your Visual Direction'
                    : `Select ${3 - selectedIntros.length} more intro${3 - selectedIntros.length === 1 ? '' : 's'}`
                  }
                </p>
              </div>
              <button
                onClick={handleGenerateVD}
                disabled={selectedIntros.length !== 3 || isGenerating || !userContext.trim()}
                className="px-6 py-3 bg-accent-purple text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : '🎬 Generate Visual Direction'}
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isSearching && (
          <LoadingSpinner message="Searching for perfect matches..." />
        )}

        {/* Generating Modal */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card max-w-md text-center">
              <div className="mb-4">
                <div className="w-16 h-16 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Creating Your Visual Direction</h3>
              <p className="text-text-secondary">
                AI is analyzing your selections and generating comprehensive video direction...
              </p>
              <p className="text-sm text-text-secondary mt-4">
                This usually takes 10-20 seconds
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && !isSearching && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Found {results.length} matching intro{results.length === 1 ? '' : 's'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((intro) => (
                <SelectableIntroCard
                  key={intro.id}
                  intro={intro}
                  relevanceScore={intro.relevanceScore}
                  isSelected={selectedIntros.includes(intro.id)}
                  onSelect={handleSelectIntro}
                  canSelect={selectedIntros.length < 3 || selectedIntros.includes(intro.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && !isSearching && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Start Your Search</h3>
            <p className="text-text-secondary">
              Enter keywords to find intros that match your vision
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

