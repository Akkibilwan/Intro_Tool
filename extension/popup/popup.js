/**
 * Popup Script - hh:mm:ss Format
 * Handles the extension popup UI with time format hh:mm:ss
 */

const API_URL = 'http://localhost:3000/api';

// DOM Elements
let elements = {};
let currentTab = null;

/**
 * Initialize popup
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Cache DOM elements
  elements = {
    notYouTube: document.getElementById('notYouTube'),
    mainContent: document.getElementById('mainContent'),
    channelName: document.getElementById('channelName'),
    videoTitle: document.getElementById('videoTitle'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime'),
    duration: document.getElementById('duration'),
    preview: document.getElementById('preview'),
    category: document.getElementById('category'),
    customCategoryToggle: document.getElementById('customCategoryToggle'),
    customCategory: document.getElementById('customCategory'),
    saveIntro: document.getElementById('saveIntro'),
    clearForm: document.getElementById('clearForm'),
    statusMessage: document.getElementById('statusMessage'),
    statusText: document.getElementById('statusText'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText')
  };

  // Check if on YouTube
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  
  if (!tab.url || !tab.url.includes('youtube.com/watch')) {
    elements.notYouTube.style.display = 'block';
    return;
  }

  elements.mainContent.style.display = 'block';

  // Get video info with timeout
  getVideoInfoWithTimeout();

  // Event listeners
  elements.startTime.addEventListener('input', handleTimeInput);
  elements.endTime.addEventListener('input', handleTimeInput);
  elements.startTime.addEventListener('blur', formatTimeInput);
  elements.endTime.addEventListener('blur', formatTimeInput);
  elements.category.addEventListener('change', validateForm);
  elements.customCategoryToggle.addEventListener('change', toggleCustomCategory);
  elements.customCategory.addEventListener('input', validateForm);
  elements.saveIntro.addEventListener('click', saveIntro);
  elements.clearForm.addEventListener('click', clearForm);

  // Initial validation
  updateDuration();
  validateForm();
});

/**
 * Get video info with timeout handling
 */
function getVideoInfoWithTimeout() {
  const timeout = setTimeout(() => {
    console.log('⚠️ Video info timeout, using fallback');
    elements.channelName.textContent = 'Loading...';
    elements.videoTitle.textContent = 'Please refresh the page and try again';
  }, 3000);

  chrome.tabs.sendMessage(currentTab.id, { action: 'getVideoInfo' }, (response) => {
    clearTimeout(timeout);
    
    if (chrome.runtime.lastError) {
      console.error('❌ Message error:', chrome.runtime.lastError);
      elements.channelName.textContent = 'Error';
      elements.videoTitle.textContent = 'Please refresh YouTube page and try again';
      return;
    }
    
    if (response && response.success) {
      console.log('✅ Video info received:', response);
      elements.channelName.textContent = response.channelName || 'Unknown Channel';
      elements.videoTitle.textContent = response.videoTitle || 'Unknown Video';
    } else {
      console.error('❌ Failed to get video info:', response);
      elements.channelName.textContent = 'Could not load';
      elements.videoTitle.textContent = 'Try refreshing YouTube page';
    }
  });
}

/**
 * Handle time input - auto-format with colons
 */
function handleTimeInput(e) {
  let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digits
  
  // Limit to 6 digits (HHMMSS)
  if (value.length > 6) {
    value = value.substring(0, 6);
  }
  
  // Auto-format as user types
  if (value.length >= 5) {
    value = value.substring(0, 2) + ':' + value.substring(2, 4) + ':' + value.substring(4);
  } else if (value.length >= 3) {
    value = value.substring(0, 2) + ':' + value.substring(2, 4);
  } else if (value.length >= 1) {
    value = value;
  }
  
  e.target.value = value;
  updateDuration();
  validateForm();
}

/**
 * Format time input on blur - ensure proper hh:mm:ss format
 */
function formatTimeInput(e) {
  let value = e.target.value.replace(/[^0-9]/g, '');
  
  // Pad with zeros if needed
  while (value.length < 6) {
    value = '0' + value;
  }
  
  // Format as hh:mm:ss
  const formatted = value.substring(0, 2) + ':' + value.substring(2, 4) + ':' + value.substring(4, 6);
  e.target.value = formatted;
  
  updateDuration();
  validateForm();
}

/**
 * Parse hh:mm:ss to total seconds
 */
function parseTimeToSeconds(timeStr) {
  if (!timeStr) return null;
  
  timeStr = timeStr.trim();
  
  // Match hh:mm:ss format
  const match = timeStr.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseInt(match[3]);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return null;
}

/**
 * Format seconds to hh:mm:ss
 */
function formatSecondsToTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Update duration preview
 */
function updateDuration() {
  const start = parseTimeToSeconds(elements.startTime.value);
  const end = parseTimeToSeconds(elements.endTime.value);
  
  if (start !== null && end !== null && end > start) {
    const duration = end - start;
    elements.duration.textContent = duration;
    elements.preview.style.display = 'block';
  } else {
    elements.duration.textContent = '--';
  }
  
  validateForm();
}

/**
 * Toggle custom category input
 */
function toggleCustomCategory() {
  const isCustom = elements.customCategoryToggle.checked;
  
  if (isCustom) {
    elements.category.style.display = 'none';
    elements.customCategory.style.display = 'block';
    elements.customCategory.focus();
  } else {
    elements.category.style.display = 'block';
    elements.customCategory.style.display = 'none';
  }
  
  validateForm();
}

/**
 * Validate form
 */
function validateForm() {
  const start = parseTimeToSeconds(elements.startTime.value);
  const end = parseTimeToSeconds(elements.endTime.value);
  const isCustom = elements.customCategoryToggle.checked;
  const category = isCustom 
    ? elements.customCategory.value.trim()
    : elements.category.value;
  
  const isValid = 
    start !== null &&
    end !== null &&
    end > start &&
    category.length > 0;
  
  elements.saveIntro.disabled = !isValid;
}

/**
 * Save intro
 */
async function saveIntro() {
  // Get fresh video info
  chrome.tabs.sendMessage(currentTab.id, { action: 'getVideoInfo' }, async (response) => {
    if (!response || !response.success) {
      showError('Failed to get video information. Please refresh YouTube page.');
      return;
    }
    
    const startTime = parseTimeToSeconds(elements.startTime.value);
    const endTime = parseTimeToSeconds(elements.endTime.value);
    const isCustom = elements.customCategoryToggle.checked;
    const category = isCustom 
      ? elements.customCategory.value.trim()
      : elements.category.value;
    
    // Validate
    if (endTime - startTime > 60) {
      showError('Intro duration cannot exceed 60 seconds');
      return;
    }
    
    if (startTime < 0 || endTime < 0) {
      showError('Invalid time format');
      return;
    }
    
    const data = {
      videoUrl: response.videoUrl,
      startTime,
      endTime,
      category,
      channelName: response.channelName || 'Unknown Channel',
      videoTitle: response.videoTitle || 'Unknown Video',
      thumbnailUrl: response.thumbnailUrl || ''
    };
    
    console.log('📤 Sending intro data:', data);
    
    // Show loading
    showLoading();
    
    try {
      const apiResponse = await fetch(`${API_URL}/intros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await apiResponse.json();
      
      hideLoading();
      
      if (result.success) {
        showSuccess('Intro saved successfully!');
        
        // Close popup after 2 seconds
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        showError(result.message || 'Failed to save intro');
      }
    } catch (error) {
      hideLoading();
      console.error('❌ Error saving intro:', error);
      showError('Network error. Make sure backend is running at localhost:3000');
    }
  });
}

/**
 * Clear form
 */
function clearForm() {
  elements.startTime.value = '00:00:00';
  elements.endTime.value = '00:00:30';
  elements.category.value = '';
  elements.customCategory.value = '';
  elements.customCategoryToggle.checked = false;
  elements.customCategory.style.display = 'none';
  elements.category.style.display = 'block';
  updateDuration();
  hideStatus();
}

/**
 * Show loading overlay
 */
function showLoading() {
  elements.loadingOverlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  elements.loadingOverlay.style.display = 'none';
}

/**
 * Show success message
 */
function showSuccess(message) {
  elements.statusMessage.className = 'status-message success';
  elements.statusText.textContent = message;
  elements.statusMessage.style.display = 'block';
  
  setTimeout(hideStatus, 3000);
}

/**
 * Show error message
 */
function showError(message) {
  elements.statusMessage.className = 'status-message error';
  elements.statusText.textContent = message;
  elements.statusMessage.style.display = 'block';
  
  setTimeout(hideStatus, 5000);
}

/**
 * Hide status message
 */
function hideStatus() {
  elements.statusMessage.style.display = 'none';
}
