# 🐛 Extension Debugging Guide

## ✅ System Status Check

Run this to verify everything is running:

```bash
# Check backend
curl http://localhost:3000/health

# Check frontend
curl -I http://localhost:3001

# Check extension (open Chrome DevTools on extension popup)
```

## 🔍 How to Debug the Extension

### Step 1: Check Extension Console

1. **Open Chrome**
2. **Click extension icon** (opens popup)
3. **Right-click anywhere** in the popup
4. **Select "Inspect"** (opens DevTools)
5. **Go to "Console" tab**
6. **Look for errors** (red messages)

### Step 2: Try to Save an Intro

1. Go to a YouTube video
2. Open extension
3. Enter times (e.g., `00:00:00` to `00:00:10`)
4. Select category
5. Click "Save Intro"
6. **Watch the console** for errors

### Step 3: Common Issues & Fixes

#### Issue 1: "Loading video information..."
**Cause:** Extension can't read YouTube page
**Fix:**
- Refresh YouTube page
- Reload extension
- Check if video is public

#### Issue 2: "Failed to save intro"
**Cause:** Backend not responding
**Fix:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# If not running, restart it
cd "/Users/ankushchaudhary/Desktop/Intro Tool/backend"
npm run dev
```

#### Issue 3: Nothing happens when clicking "Save"
**Cause:** JavaScript error in extension
**Fix:**
- Open extension console (right-click → Inspect)
- Look for red errors
- Share the error message

#### Issue 4: "Network error"
**Cause:** CORS or backend connection issue
**Fix:**
- Make sure backend is running on port 3000
- Check extension's `background.js` API_URL is correct

## 🧪 Manual Test

### Test Backend Directly:

```bash
curl -X POST http://localhost:3000/api/intros \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "startTime": 0,
    "endTime": 10,
    "category": "Educational",
    "channelName": "Test Channel",
    "videoTitle": "Test Video",
    "thumbnailUrl": "https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg"
  }'
```

If this works, the backend is fine. Issue is in the extension.

If this fails, the backend has an issue.

## 📝 Checklist

Before reporting an issue:

- [ ] Backend running? (`curl http://localhost:3000/health`)
- [ ] Frontend running? (`curl -I http://localhost:3001`)
- [ ] Extension console checked? (Right-click popup → Inspect)
- [ ] YouTube page refreshed?
- [ ] Extension reloaded? (chrome://extensions → Reload)
- [ ] Video is public and accessible?

## 🚨 Current Known Issues

### Video Download Issues

**Problem:** Some YouTube videos fail to download with format errors.

**Current Status:** We've tried 5 different download methods. The latest (Step 3 in videoDownloader.js) should work for most videos.

**Workaround:**
1. Try a different YouTube video
2. Try shorter videos (< 5 minutes)
3. Avoid live streams or age-restricted videos

**What we're downloading:**
- Full video (no format restrictions)
- Extract intro section with ffmpeg
- Delete full video

**Expected time:** 30-90 seconds per intro

## 🔧 Extension Files

Key files to check:

1. **`extension/popup/popup.js`** - Main logic
   - Line ~200: `handleSave()` function
   - Line ~250: API call

2. **`extension/background.js`** - API communication
   - Line 40: `handleSaveIntro()` function
   - Line 41: API URL (should be `http://localhost:3000/api`)

3. **`extension/manifest.json`** - Permissions
   - `host_permissions`: Should include `http://localhost:3000/*`

## 💡 Quick Fixes

### Fix 1: Reload Extension
```
1. Go to chrome://extensions
2. Find "YouTube Intro Analyzer"
3. Click the refresh icon
4. Try again
```

### Fix 2: Check Extension Permissions
```
1. Go to chrome://extensions
2. Click "Details" on your extension
3. Scroll to "Site access"
4. Make sure YouTube is allowed
```

### Fix 3: Clear Extension Storage
```javascript
// Open extension console and run:
chrome.storage.local.clear(() => {
  console.log('Storage cleared');
});
```

## 📊 Success Indicators

When saving works correctly, you should see:

**In Extension Console:**
```
Saving intro...
Response: { success: true, data: {...} }
Intro saved successfully!
```

**In Backend Terminal:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Processing new intro: Video Title
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏬ STEP 1/3: Downloading video clip...
   Step 1: Downloading full video...
   Step 2: Extracting intro section with ffmpeg...
   Step 3: Cleaning up full video...
✅ Video downloaded successfully

🤖 STEP 2/3: Analyzing with Gemini AI...
✅ AI Analysis complete

💾 STEP 3/3: Saving to database...
✅ ✅ ✅ INTRO SAVED SUCCESSFULLY!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎯 Next Steps

If extension still not working:

1. **Share exact error message** from extension console
2. **Share backend logs** from terminal
3. **Tell me what video URL** you're testing with
4. **Screenshot of extension popup** (if helpful)

I'll help debug from there!

