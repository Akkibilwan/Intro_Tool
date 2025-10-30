/**
 * Background Service Worker
 * Handles extension background tasks and messaging
 */

console.log('YouTube Intro Analyzer background service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    
    // Open welcome page or setup instructions
    // chrome.tabs.create({ url: 'https://your-webapp-url.com/welcome' });
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);
  
  // Handle different message types
  if (request.action === 'saveIntro') {
    handleSaveIntro(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // Keep message channel open for async response
  }
  
  return false;
});

/**
 * Handle saving intro to backend
 * @param {Object} data - Intro data
 */
async function handleSaveIntro(data) {
  const API_URL = 'http://localhost:3000/api';
  
  try {
    const response = await fetch(`${API_URL}/intros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error saving intro:', error);
    throw error;
  }
}

/**
 * Listen for tab updates to detect YouTube video navigation
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('youtube.com/watch')) {
    console.log('YouTube video page loaded:', tab.url);
    
    // Send message to content script if needed
    chrome.tabs.sendMessage(tabId, { action: 'videoPageLoaded' }).catch(() => {
      // Ignore errors if content script isn't ready
    });
  }
});

/**
 * Handle extension icon click (if not using popup)
 */
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
  
  // This won't be called if popup is defined in manifest
  // But kept here for reference if you want to handle it programmatically
});

/**
 * Context menu integration (optional)
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'captureIntro',
    title: 'Capture YouTube Intro',
    contexts: ['page'],
    documentUrlPatterns: ['*://www.youtube.com/watch*']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'captureIntro') {
    // Open popup or trigger action
    chrome.action.openPopup();
  }
});

