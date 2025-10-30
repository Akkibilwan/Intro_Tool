/**
 * API Client
 * Handles all API requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Search intros based on query
 * @param {string} query - Search query
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Search results
 */
export async function searchIntros(query, filters = {}) {
  return apiRequest('/search', {
    method: 'POST',
    body: JSON.stringify({ query, ...filters }),
  });
}

/**
 * Get all intros with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Paginated intros
 */
export async function getAllIntros(page = 1, limit = 20, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });
  
  return apiRequest(`/intros?${params}`);
}

/**
 * Get intro by ID
 * @param {string|number} id - Intro ID
 * @returns {Promise<Object>} Intro details
 */
export async function getIntroById(id) {
  return apiRequest(`/intros/${id}`);
}

/**
 * Get platform statistics
 * @returns {Promise<Object>} Statistics
 */
export async function getStats() {
  return apiRequest('/stats');
}

/**
 * Create a new intro (called from extension)
 * @param {Object} introData - Intro data
 * @returns {Promise<Object>} Created intro
 */
export async function createIntro(introData) {
  return apiRequest('/intros', {
    method: 'POST',
    body: JSON.stringify(introData),
  });
}

/**
 * Delete an intro by ID
 * @param {string|number} id - Intro ID
 * @returns {Promise<Object>} Delete confirmation
 */
export async function deleteIntro(id) {
  return apiRequest(`/intros/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Format time for display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (MM:SS)
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get YouTube embed URL with start time
 * @param {string} videoId - YouTube video ID
 * @param {number} startTime - Start time in seconds
 * @returns {string} Embed URL
 */
export function getYouTubeEmbedUrl(videoId, startTime = 0) {
  return `https://www.youtube.com/embed/${videoId}?start=${startTime}&autoplay=0`;
}

/**
 * Get YouTube watch URL with timestamp
 * @param {string} videoUrl - YouTube video URL or video ID
 * @param {number} startTime - Start time in seconds
 * @returns {string} Watch URL with timestamp
 */
export function getYouTubeWatchUrl(videoUrl, startTime = 0) {
  // Handle empty or invalid input
  if (!videoUrl || typeof videoUrl !== 'string') {
    console.error('Invalid videoUrl:', videoUrl);
    return '#';
  }
  
  // If it's already a full URL, use it
  if (videoUrl.startsWith('http')) {
    try {
      const url = new URL(videoUrl);
      url.searchParams.set('t', `${startTime}s`);
      return url.toString();
    } catch (error) {
      console.error('Error parsing URL:', error);
      // Fallback: try to extract video ID
      const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/watch?v=${match[1]}&t=${startTime}s`;
      }
      return videoUrl;
    }
  }
  
  // If it's just a video ID, construct the URL
  return `https://www.youtube.com/watch?v=${videoUrl}&t=${startTime}s`;
}

