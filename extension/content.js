/**
 * Content Script - Fixed Version
 * Runs on YouTube video pages with improved selectors
 */

console.log('✅ YouTube Intro Analyzer loaded');

let videoElement = null;

/**
 * Get YouTube video player
 */
function getVideoElement() {
  return document.querySelector('video');
}

/**
 * Get current video time in seconds
 */
function getCurrentTime() {
  const video = getVideoElement();
  return video ? Math.floor(video.currentTime) : 0;
}

/**
 * Extract video ID from URL
 */
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('v');
}

/**
 * Get video information with multiple fallback methods
 */
function getVideoInfo() {
  try {
    const videoId = getVideoId();
    
    if (!videoId) {
      return {
        success: false,
        error: 'No video ID found'
      };
    }
    
    // Method 1: Try modern YouTube selectors
    let channelName = '';
    let videoTitle = '';
    
    // Try multiple selectors for channel name
    const channelSelectors = [
      'ytd-channel-name a',
      'ytd-video-owner-renderer a',
      '#channel-name a',
      '#owner-name a',
      'yt-formatted-string.ytd-channel-name a'
    ];
    
    for (const selector of channelSelectors) {
      const elem = document.querySelector(selector);
      if (elem && elem.textContent.trim()) {
        channelName = elem.textContent.trim();
        break;
      }
    }
    
    // Fallback: Try to get from meta tags
    if (!channelName) {
      const metaChannel = document.querySelector('link[itemprop="name"]');
      if (metaChannel) {
        channelName = metaChannel.getAttribute('content') || '';
      }
    }
    
    // Try multiple selectors for video title
    const titleSelectors = [
      'h1.ytd-watch-metadata yt-formatted-string',
      'h1.ytd-video-primary-info-renderer',
      'h1 yt-formatted-string',
      '#title h1 yt-formatted-string',
      'ytd-watch-metadata h1'
    ];
    
    for (const selector of titleSelectors) {
      const elem = document.querySelector(selector);
      if (elem && elem.textContent.trim()) {
        videoTitle = elem.textContent.trim();
        break;
      }
    }
    
    // Fallback: Use document title
    if (!videoTitle) {
      videoTitle = document.title.replace(' - YouTube', '').trim();
    }
    
    // Fallback defaults if still empty
    if (!channelName) {
      channelName = 'Unknown Channel';
    }
    
    if (!videoTitle) {
      videoTitle = 'YouTube Video';
    }
    
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    
    console.log('✅ Video info extracted:', { videoId, channelName, videoTitle });
    
    return {
      success: true,
      videoId,
      videoUrl: window.location.href.split('&')[0], // Clean URL
      channelName,
      videoTitle,
      thumbnailUrl
    };
  } catch (error) {
    console.error('❌ Error getting video info:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Wait for YouTube to be ready
 */
function waitForYouTube() {
  return new Promise((resolve) => {
    // Check if video element exists
    const checkVideo = setInterval(() => {
      videoElement = getVideoElement();
      const videoId = getVideoId();
      
      if (videoElement && videoId) {
        clearInterval(checkVideo);
        console.log('✅ YouTube video ready');
        resolve(true);
      }
    }, 500);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkVideo);
      resolve(false);
    }, 10000);
  });
}

/**
 * Listen for messages from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📩 Message received:', request.action);
  
  if (request.action === 'getVideoInfo') {
    const info = getVideoInfo();
    console.log('📤 Sending video info:', info);
    sendResponse(info);
  } else if (request.action === 'getCurrentTime') {
    const time = getCurrentTime();
    console.log('📤 Sending current time:', time);
    sendResponse({
      success: true,
      time: time
    });
  }
  
  return true; // Keep channel open for async response
});

/**
 * Initialize
 */
async function init() {
  console.log('🔄 Initializing YouTube Intro Analyzer...');
  await waitForYouTube();
  console.log('✅ Extension ready!');
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-initialize on YouTube navigation (SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('🔄 YouTube navigation detected, reinitializing...');
    init();
  }
}).observe(document, { subtree: true, childList: true });
