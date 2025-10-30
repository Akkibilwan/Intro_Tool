'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import IntroCard from '../../../components/IntroCard'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { getIntroById, formatTime, getYouTubeEmbedUrl, getYouTubeWatchUrl, getAllIntros } from '../../../lib/api'

export default function IntroDetailPage({ params }) {
  const router = useRouter()
  const [intro, setIntro] = useState(null)
  const [similarIntros, setSimilarIntros] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIntro()
  }, [params.id])

  async function loadIntro() {
    setLoading(true)
    try {
      const data = await getIntroById(params.id)
      setIntro(data.data)
      
      // Load similar intros (same category)
      if (data.data) {
        const similarData = await getAllIntros(1, 6, {
          category: data.data.userCategory
        })
        // Filter out current intro
        setSimilarIntros(
          (similarData.data || []).filter(i => i.id !== data.data.id).slice(0, 4)
        )
      }
    } catch (error) {
      console.error('Error loading intro:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading intro details..." />
  }

  if (!intro) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Intro not found</h1>
        <button
          onClick={() => router.push('/browse')}
          className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Browse All Intros
        </button>
      </div>
    )
  }

  const embedUrl = getYouTubeEmbedUrl(intro.videoId, intro.startTime)
  const watchUrl = getYouTubeWatchUrl(intro.videoUrl, intro.startTime)

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Video Section */}
        <div className="mb-8">
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{intro.videoTitle}</h1>
              <p className="text-text-secondary">{intro.channelName}</p>
            </div>
            
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Watch on YouTube
            </a>
          </div>

          {/* Info Card */}
          <div className="card flex items-center gap-6 mb-8">
            <div className="px-4 py-2 bg-accent-blue rounded-lg">
              <div className="text-sm text-white opacity-80">Category</div>
              <div className="font-semibold">{intro.userCategory}</div>
            </div>
            
            <div className="px-4 py-2 bg-bg-tertiary rounded-lg">
              <div className="text-sm text-text-secondary">Duration</div>
              <div className="font-semibold">{intro.duration}s</div>
            </div>
            
            <div className="px-4 py-2 bg-bg-tertiary rounded-lg">
              <div className="text-sm text-text-secondary">Time Range</div>
              <div className="font-semibold">
                {formatTime(intro.startTime)} - {formatTime(intro.endTime)}
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">🤖 AI Analysis</h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            {intro.aiDescription}
          </p>
          
          {/* Characteristics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-bg-tertiary rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎭</span>
                <span className="text-sm text-text-secondary">Mood</span>
              </div>
              <div className="font-semibold capitalize">{intro.mood || 'N/A'}</div>
            </div>
            
            <div className="p-4 bg-bg-tertiary rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎨</span>
                <span className="text-sm text-text-secondary">Visual Style</span>
              </div>
              <div className="font-semibold capitalize">{intro.visualStyle || 'N/A'}</div>
            </div>
            
            <div className="p-4 bg-bg-tertiary rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">⚡</span>
                <span className="text-sm text-text-secondary">Pace</span>
              </div>
              <div className="font-semibold capitalize">{intro.pace || 'N/A'}</div>
            </div>
            
            <div className="p-4 bg-bg-tertiary rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🌈</span>
                <span className="text-sm text-text-secondary">Color Scheme</span>
              </div>
              <div className="font-semibold capitalize">{intro.colorScheme || 'N/A'}</div>
            </div>
          </div>
          
          {/* Tags */}
          {intro.aiTags && intro.aiTags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {intro.aiTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent-blue bg-opacity-20 text-accent-blue rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Technical Details */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Technical Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{intro.hasText ? '✅' : '❌'}</span>
              <div>
                <div className="font-medium">Text Overlay</div>
                <div className="text-sm text-text-secondary">
                  {intro.hasText ? 'Present' : 'None'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">{intro.hasPerson ? '✅' : '❌'}</span>
              <div>
                <div className="font-medium">Features Person</div>
                <div className="text-sm text-text-secondary">
                  {intro.hasPerson ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">{intro.hasMusic ? '🎵' : '🔇'}</span>
              <div>
                <div className="font-medium">Background Music</div>
                <div className="text-sm text-text-secondary">
                  {intro.hasMusic ? 'Present' : 'None'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">✂️</span>
              <div>
                <div className="font-medium">Transitions</div>
                <div className="text-sm text-text-secondary">
                  {intro.transitionCount || 0} cuts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Intros */}
        {similarIntros.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {similarIntros.map(similarIntro => (
                <IntroCard key={similarIntro.id} intro={similarIntro} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

