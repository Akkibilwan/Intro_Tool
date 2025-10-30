# YouTube Intro Analyzer - Chrome Extension

Chrome extension for capturing and submitting YouTube video intros for AI analysis.

## Installation

### For Development

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension icon should appear in your toolbar

### Creating Icons

You need to create three icon files and place them in the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any PNG image. For a quick start, create a simple blue square or use an icon generator online.

## Usage

1. **Navigate to YouTube**: Open any YouTube video
2. **Click Extension Icon**: The popup will open
3. **Capture Times**: 
   - Play the video to the start of the intro
   - Click "Capture" next to "Start Time"
   - Play to the end of the intro
   - Click "Capture" next to "End Time"
   - Or manually enter times in formats like `0:05` or `5`
4. **Select Category**: Choose from dropdown or use custom category
5. **Save**: Click "Save Intro" button
6. **Wait**: Processing takes 30-60 seconds
7. **Done**: You'll see a success message when complete

## Features

- **Time Capture**: Capture current video time with one click
- **Multiple Input Methods**: Enter times manually or capture from video
- **Category Selection**: Predefined categories + custom option
- **Real-time Validation**: Form validates as you type
- **Visual Feedback**: Duration preview, loading states, success/error messages
- **Dark Theme**: Matches YouTube's dark mode

## Configuration

To change the backend API URL, edit `popup/popup.js`:

```javascript
const API_URL = 'http://localhost:3000/api';
```

Change to your production API URL when deploying.

## Troubleshooting

**Extension doesn't load:**
- Make sure all files are present
- Check browser console for errors
- Try removing and re-adding the extension

**"Not on YouTube" message:**
- Only works on `youtube.com/watch?v=...` pages
- Refresh the page after installing extension

**"Network error" when saving:**
- Make sure backend server is running on `http://localhost:3000`
- Check CORS settings in backend
- Verify API URL in `popup.js`

**Times not capturing:**
- Make sure video is playing or has loaded
- Try refreshing the page
- Check browser console for errors

## Publishing to Chrome Web Store

1. Create icons (16px, 48px, 128px)
2. Zip the extension folder (exclude README.md)
3. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Pay one-time $5 developer fee
5. Upload zip file
6. Fill in description, screenshots, etc.
7. Submit for review

## Security Notes

- Extension only runs on YouTube.com
- Only sends data to configured API URL
- Stores minimal data locally (just time selections)
- No tracking or analytics
- Open source - review the code!

## Development

The extension consists of:

- **manifest.json**: Extension configuration
- **popup/**: Popup UI (HTML, CSS, JS)
- **content.js**: Runs on YouTube pages
- **background.js**: Background service worker
- **icons/**: Extension icons

## Permissions Explained

- `activeTab`: Access current tab to get video info
- `storage`: Store time selections between sessions
- `tabs`: Query active tab information
- `youtube.com`: Run on YouTube pages only
- `localhost:3000`: Send data to local backend

## Future Features

- Video preview before submission
- History of submitted intros
- Keyboard shortcuts
- Bulk capture mode
- Export/import settings

