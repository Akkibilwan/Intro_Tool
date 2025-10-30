'use client'

import { useState } from 'react'

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search intros...', 
  defaultValue = '' 
}) {
  const [query, setQuery] = useState(defaultValue)

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  function handleClear() {
    setQuery('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 pr-32 bg-bg-secondary border border-border-color rounded-xl text-lg focus:border-accent-blue focus:ring-2 focus:ring-accent-blue focus:ring-opacity-20 transition-all"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-28 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}

