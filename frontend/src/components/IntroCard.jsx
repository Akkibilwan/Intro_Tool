'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatTime, deleteIntro } from '../lib/api'

export default function IntroCard({ intro, matchScore = null, onDelete }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  function handleClick() {
    router.push(`/intro/${intro.id}`)
  }

  async function handleDelete(e) {
    e.stopPropagation() // Prevent card click
    
    if (!confirm('Are you sure you want to delete this intro?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteIntro(intro.id)
      if (onDelete) {
        onDelete(intro.id) // Notify parent to remove from list
      }
    } catch (error) {
      console.error('Error deleting intro:', error)
      alert('Failed to delete intro. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="card cursor-pointer group hover:scale-[1.02] hover:border-accent-blue transition-all overflow-hidden p-0"
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
        
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 left-3 p-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          title="Delete intro"
        >
          {isDeleting ? '...' : '🗑️'}
        </button>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-accent-blue rounded-lg text-sm font-medium">
          {intro.userCategory}
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black bg-opacity-75 rounded-lg text-sm font-medium">
          {intro.duration}s
        </div>
        
        {/* Match Score (if from search) */}
        {matchScore && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-accent-purple rounded-lg text-sm font-medium">
            Match: {Math.round(parseFloat(matchScore) * 100)}%
          </div>
        )}
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
      </div>
    </div>
  )
}

