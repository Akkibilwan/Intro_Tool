/**
 * Visual Direction API Client
 * Handles VD-specific API requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Smart search intros
 * @param {string} query - Search query
 * @param {string} userContext - Optional user context
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Search results with relevance scores
 */
export async function smartSearch(query, userContext = '', filters = {}) {
  const response = await fetch(`${API_BASE_URL}/search/smart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, userContext, filters }),
  });
  
  if (!response.ok) {
    throw new Error('Smart search failed');
  }
  
  return response.json();
}

/**
 * Generate visual direction from selected intros
 * @param {Array<number>} selectedIntroIds - Array of 3 intro IDs
 * @param {string} userDescription - User's description
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} Generated visual direction
 */
export async function generateVisualDirection(selectedIntroIds, userDescription, preferences = {}) {
  const response = await fetch(`${API_BASE_URL}/generate-vd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selectedIntroIds,
      userDescription,
      preferences
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Visual Direction generation failed');
  }
  
  return response.json();
}

/**
 * Get a saved visual direction by ID
 * @param {number} id - VD ID
 * @returns {Promise<Object>} Visual direction data
 */
export async function getVisualDirection(id) {
  const response = await fetch(`${API_BASE_URL}/generate-vd/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Visual Direction');
  }
  
  return response.json();
}

/**
 * Get all saved visual directions
 * @returns {Promise<Object>} List of visual directions
 */
export async function getAllVisualDirections() {
  const response = await fetch(`${API_BASE_URL}/generate-vd`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch Visual Directions');
  }
  
  return response.json();
}

