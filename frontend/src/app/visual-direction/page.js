'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getVisualDirection } from '../../lib/vdApi'

function VisualDirectionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const vdId = searchParams.get('id')
  
  const [vd, setVd] = useState(null)
  const [selectedIntros, setSelectedIntros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (vdId) {
      loadVD()
    } else {
      setError('No Visual Direction ID provided')
      setLoading(false)
    }
  }, [vdId])

  async function loadVD() {
    try {
      setLoading(true)
      const response = await getVisualDirection(vdId)
      
      if (response.success) {
        setVd(response.vd)
        setSelectedIntros(response.selectedIntros || [])
      } else {
        setError('Failed to load Visual Direction')
      }
    } catch (err) {
      console.error('Error loading VD:', err)
      setError('Failed to load Visual Direction')
    } finally {
      setLoading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  function handleStartOver() {
    router.push('/search-enhanced')
  }

  if (loading) {
    return <LoadingSpinner message="Loading your Visual Direction..." />
  }

  if (error || !vd) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">{error || 'Visual Direction not found'}</h2>
        <button
          onClick={handleStartOver}
          className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors mt-4"
        >
          Start Over
        </button>
      </div>
    )
  }

  const visualDirection = vd.generatedVD

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h1 className="text-3xl font-bold">🎬 Your Visual Direction</h1>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg font-medium hover:bg-bg-secondary transition-colors flex items-center gap-2"
            >
              📄 Download PDF
            </button>
            <button
              onClick={handleStartOver}
              className="px-4 py-2 bg-accent-blue text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>

        {/* Title Card */}
        <div className="card mb-8">
          <h2 className="text-3xl font-bold mb-4">{visualDirection.title}</h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            {visualDirection.overviewSummary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {visualDirection.keywords && visualDirection.keywords.map((keyword, i) => (
              <span key={i} className="px-3 py-1 bg-accent-blue bg-opacity-20 text-accent-blue rounded-full text-sm font-medium">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* User Request */}
        <div className="card mb-8 print:break-inside-avoid">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span>📝</span> Your Request
          </h3>
          <p className="text-text-secondary italic">"{vd.userDescription}"</p>
        </div>

        {/* Timeline Breakdown */}
        {visualDirection.sections && visualDirection.sections.length > 0 && (
          <div className="card mb-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>⏱️</span> Timeline Breakdown
            </h3>
            <div className="space-y-6">
              {visualDirection.sections.map((section, i) => (
                <div key={i} className="border-l-4 border-accent-blue pl-6 py-2">
                  <div className="font-bold text-accent-blue mb-2">{section.timecode}</div>
                  <h4 className="font-semibold mb-2">{section.description}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Visual Style:</span>
                      <p className="text-text-secondary mt-1">{section.visualStyle}</p>
                    </div>
                    <div>
                      <span className="font-medium">Camera Work:</span>
                      <p className="text-text-secondary mt-1">{section.cameraWork}</p>
                    </div>
                    {section.effects && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Effects:</span>
                        <p className="text-text-secondary mt-1">{section.effects}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cinematography */}
        {visualDirection.cinematography && (
          <div className="card mb-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>📹</span> Cinematography
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Shot Types</h4>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {visualDirection.cinematography.shotTypes?.map((shot, i) => (
                    <li key={i}>{shot}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Camera Movements</h4>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {visualDirection.cinematography.cameraMovements?.map((movement, i) => (
                    <li key={i}>{movement}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lighting</h4>
                <p className="text-text-secondary">{visualDirection.cinematography.lighting}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Color Grading</h4>
                <p className="text-text-secondary">{visualDirection.cinematography.colorGrading}</p>
              </div>
            </div>
          </div>
        )}

        {/* Editing */}
        {visualDirection.editing && (
          <div className="card mb-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>✂️</span> Editing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Pace</h4>
                <p className="text-text-secondary">{visualDirection.editing.pace}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estimated Cuts</h4>
                <p className="text-text-secondary">{visualDirection.editing.cuts} cuts</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Transitions</h4>
                <p className="text-text-secondary">{visualDirection.editing.transitions}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rhythm</h4>
                <p className="text-text-secondary">{visualDirection.editing.rhythm}</p>
              </div>
            </div>
          </div>
        )}

        {/* Motion Graphics */}
        {visualDirection.motionGraphics && (
          <div className="card mb-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>✨</span> Motion Graphics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Text Style</h4>
                <p className="text-text-secondary">{visualDirection.motionGraphics.textStyle}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Typography</h4>
                <p className="text-text-secondary">{visualDirection.motionGraphics.typography}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Graphic Elements</h4>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {visualDirection.motionGraphics.graphicElements?.map((element, i) => (
                    <li key={i}>{element}</li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Animation Approach</h4>
                <p className="text-text-secondary">{visualDirection.motionGraphics.animations}</p>
              </div>
            </div>
          </div>
        )}

        {/* Audio Suggestions */}
        {visualDirection.audioSuggestions && (
          <div className="card mb-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>🎵</span> Audio Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Music Type</h4>
                <p className="text-text-secondary">{visualDirection.audioSuggestions.musicType}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tempo</h4>
                <p className="text-text-secondary">{visualDirection.audioSuggestions.tempo}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sound Design</h4>
                <p className="text-text-secondary">{visualDirection.audioSuggestions.soundDesign}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Structure</h4>
                <p className="text-text-secondary">{visualDirection.audioSuggestions.structure}</p>
              </div>
            </div>
          </div>
        )}

        {/* Inspiration Breakdown */}
        {visualDirection.inspirationBreakdown && selectedIntros.length > 0 && (
          <div className="card mb-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>💡</span> Inspiration Breakdown
            </h3>
            <div className="space-y-4">
              {selectedIntros.map((intro, i) => (
                <div key={i} className="p-4 bg-bg-tertiary rounded-lg">
                  <h4 className="font-semibold mb-2">
                    From "{intro.videoTitle}" ({intro.channelName})
                  </h4>
                  <p className="text-text-secondary">
                    {visualDirection.inspirationBreakdown[`fromIntro${i + 1}`]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Production Notes */}
        {visualDirection.productionNotes && (
          <div className="card mb-8 print:break-inside-avoid">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>📦</span> Production Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Complexity</h4>
                <p className="text-text-secondary">{visualDirection.productionNotes.estimatedComplexity}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Time Estimate</h4>
                <p className="text-text-secondary">{visualDirection.productionNotes.timeEstimate}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recommended Tools</h4>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {visualDirection.productionNotes.recommendedTools?.map((tool, i) => (
                    <li key={i}>{tool}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Shooting Requirements</h4>
                <p className="text-text-secondary">{visualDirection.productionNotes.shootingRequirements}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-text-secondary text-sm pt-8 border-t border-border-color print:hidden">
          <p>Generated by YouTube Intro Analyzer - Powered by Gemini AI</p>
          <p className="mt-2">Created: {new Date(vd.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .card {
            border: 1px solid #ddd;
            box-shadow: none;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default function VisualDirectionPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <VisualDirectionContent />
    </Suspense>
  )
}

