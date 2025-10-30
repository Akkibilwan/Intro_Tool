'use client'

import { useState } from 'react'

const CATEGORIES = [
  'Suspense', 'Comedy', 'Educational', 'Dramatic', 'Motivational',
  'Minimal', 'Energetic', 'Cinematic', 'Documentary', 'Tech Review'
]

const MOODS = [
  'dramatic', 'energetic', 'calm', 'mysterious', 'funny',
  'serious', 'upbeat', 'dark', 'bright'
]

const VISUAL_STYLES = [
  'minimal', 'busy', 'animated', 'live-action', 'mixed'
]

export default function FilterPanel({ filters, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    moods: true,
    visualStyles: false,
    pace: false
  })

  function toggleSection(section) {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  function handleCategoryChange(category) {
    const currentCategories = filters.categories || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    
    onFilterChange({ ...filters, categories: newCategories })
  }

  function handleMoodChange(mood) {
    const currentMoods = filters.moods || []
    const newMoods = currentMoods.includes(mood)
      ? currentMoods.filter(m => m !== mood)
      : [...currentMoods, mood]
    
    onFilterChange({ ...filters, moods: newMoods })
  }

  function handleVisualStyleChange(style) {
    const currentStyles = filters.visualStyles || []
    const newStyles = currentStyles.includes(style)
      ? currentStyles.filter(s => s !== style)
      : [...currentStyles, style]
    
    onFilterChange({ ...filters, visualStyles: newStyles })
  }

  function handlePaceChange(pace) {
    onFilterChange({ ...filters, pace })
  }

  function clearAll() {
    onFilterChange({
      categories: [],
      moods: [],
      visualStyles: [],
      pace: null
    })
  }

  const hasFilters = 
    (filters.categories?.length > 0) ||
    (filters.moods?.length > 0) ||
    (filters.visualStyles?.length > 0) ||
    filters.pace

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-accent-blue hover:text-blue-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full mb-3 font-medium"
        >
          <span>Categories</span>
          <span className="text-text-secondary">
            {expandedSections.categories ? '−' : '+'}
          </span>
        </button>
        
        {expandedSections.categories && (
          <div className="space-y-2">
            {CATEGORIES.map(category => (
              <label key={category} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category) || false}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 rounded border-border-color bg-bg-tertiary accent-accent-blue"
                />
                <span className="text-sm group-hover:text-accent-blue transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Moods */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('moods')}
          className="flex items-center justify-between w-full mb-3 font-medium"
        >
          <span>Moods</span>
          <span className="text-text-secondary">
            {expandedSections.moods ? '−' : '+'}
          </span>
        </button>
        
        {expandedSections.moods && (
          <div className="space-y-2">
            {MOODS.map(mood => (
              <label key={mood} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.moods?.includes(mood) || false}
                  onChange={() => handleMoodChange(mood)}
                  className="w-4 h-4 rounded border-border-color bg-bg-tertiary accent-accent-blue"
                />
                <span className="text-sm group-hover:text-accent-blue transition-colors capitalize">
                  {mood}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Visual Styles */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('visualStyles')}
          className="flex items-center justify-between w-full mb-3 font-medium"
        >
          <span>Visual Style</span>
          <span className="text-text-secondary">
            {expandedSections.visualStyles ? '−' : '+'}
          </span>
        </button>
        
        {expandedSections.visualStyles && (
          <div className="space-y-2">
            {VISUAL_STYLES.map(style => (
              <label key={style} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.visualStyles?.includes(style) || false}
                  onChange={() => handleVisualStyleChange(style)}
                  className="w-4 h-4 rounded border-border-color bg-bg-tertiary accent-accent-blue"
                />
                <span className="text-sm group-hover:text-accent-blue transition-colors capitalize">
                  {style}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Pace */}
      <div>
        <button
          onClick={() => toggleSection('pace')}
          className="flex items-center justify-between w-full mb-3 font-medium"
        >
          <span>Pace</span>
          <span className="text-text-secondary">
            {expandedSections.pace ? '−' : '+'}
          </span>
        </button>
        
        {expandedSections.pace && (
          <div className="space-y-2">
            {['slow', 'medium', 'fast'].map(pace => (
              <label key={pace} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="pace"
                  checked={filters.pace === pace}
                  onChange={() => handlePaceChange(pace)}
                  className="w-4 h-4 border-border-color bg-bg-tertiary accent-accent-blue"
                />
                <span className="text-sm group-hover:text-accent-blue transition-colors capitalize">
                  {pace}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

