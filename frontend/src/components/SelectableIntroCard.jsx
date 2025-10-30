'use client'

import { useState } from 'react'
import { formatTime } from '../lib/api'

export default function SelectableIntroCard({ 
  intro, 
  relevanceScore = null,
  isSelected = false,
  onSelect,
  maxSelections = 3,
  canSelect = true
}) {
  const [showDetails, setShowDetails] = useState(false)

  function handleSelect(e) {
    e.stopPropagation()
    if (onSelect) {
      onSelect(intro.id)
    }
  }

  function handleClick() {
    setShowDetails(!showDetails)
  }

  return (
    <div
      onClick={handleClick}
      className={`card cursor-pointer group transition-all overflow-hidden p-0 ${
        isSelected ? 'border-accent-blue border-2 shadow-lg shadow-blue-500/20' : 'hover:border-accent-blue'
      } ${!canSelect && !isSelected ? 'opacity-60' : ''}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-bg-tertiary">
        <img
          src={intro.thumbnailUrl}
          alt={intro.videoTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://i.ytimg.com/vi/${intro.videoId}/maxresdefault.jpg`
          }}
        />
        
        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={handleSelect}
            disabled={!canSelect && !isSelected}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isSelected 
                ? 'bg-accent-blue text-white' 
                : 'bg-black bg-opacity-50 hover:bg-opacity-70 text-white'
            } ${!canSelect && !isSelected ? 'cursor-not-allowed opacity-50' : ''}`}
            title={isSelected ? 'Unselect' : canSelect ? 'Select' : 'Maximum selections reached'}
          >
            {isSelected ? '✓' : ''}
          </button>
        </div>
        
        {/* Relevance Score Badge */}
        {relevanceScore !== null && relevanceScore > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-accent-purple rounded-lg text-sm font-medium">
            Match: {Math.round(relevanceScore)}%
          </div>
        )}
        
        {/* Category Badge */}
        {!relevanceScore && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-accent-blue rounded-lg text-sm font-medium">
            {intro.userCategory}
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black bg-opacity-75 rounded-lg text-sm font-medium">
          {intro.duration}s
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-sm text-text-secondary mb-2">
          {intro.channelName}
        </div>
        <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
          {intro.videoTitle}
        </h3>
        
        {/* Tags */}
        {intro.aiTags && intro.aiTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {intro.aiTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-bg-tertiary rounded text-xs text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Characteristics */}
        <div className="flex items-center gap-4 mt-4 text-xs text-text-secondary">
          {intro.mood && (
            <span className="flex items-center gap-1">
              <span>😊</span> {intro.mood}
            </span>
          )}
          {intro.pace && (
            <span className="flex items-center gap-1">
              <span>⚡</span> {intro.pace}
            </span>
          )}
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border-color">
            <p className="text-sm text-text-secondary line-clamp-3">
              {intro.aiDescription}
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="px-2 py-1 bg-bg-tertiary rounded">
                {intro.visualStyle || 'N/A'}
              </span>
              <span className="px-2 py-1 bg-bg-tertiary rounded">
                {intro.colorScheme || 'N/A'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

