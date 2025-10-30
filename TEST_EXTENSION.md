# 🧪 Extension Test Instructions

## ✅ System Status

Backend: http://localhost:3000 ✅ WORKING
Frontend: http://localhost:3001 ✅ WORKING  
Database: 3 intros saved ✅ WORKING

## 🎯 How to Test Extension

### Step 1: Install Extension

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Turn ON "Developer mode" (toggle top-right)
4. Click "Load unpacked"
5. Select: `/Users/ankushchaudhary/Desktop/Intro Tool/extension`
6. Extension should appear with icon

### Step 2: Test Saving an Intro

1. **Go to YouTube:** https://www.youtube.com/watch?v=jNQXAC9IVRw

2. **Click extension icon** in Chrome toolbar

3. **Wait for video info to load** (should show title, channel, thumbnail)

4. **Enter times:**
   - Start: `00:00:00`
   - End: `00:00:05`

5. **Select category:** Educational

6. **Click "Save Intro"**

7. **Watch for messages:**
   - Should show "Saving..."
   - Then "Intro saved successfully!"

8. **Verify it saved:**
   - Go to: http://localhost:3001
   - Refresh the page
   - Should now see 4 intros

### Step 3: Debug Extension (if not working)

**Open Extension Console:**
1. Click extension icon
2. Right-click popup → "Inspect"
3. Go to "Console" tab
4. Try saving again
5. Look for RED errors

**Common Issues:**

**"Loading video information..." forever**
→ Refresh YouTube page
→ Make sure video is playing

**"Failed to save intro"**
→ Check backend terminal for errors
→ Verify backend is running: `curl http://localhost:3000/health`

**Nothing happens when clicking Save**
→ Check extension console for JavaScript errors
→ Reload extension: chrome://extensions → Reload button

**Extension can't connect to backend**
→ Check extension console for "Failed to fetch" or "Network error"
→ Verify API URL in extension/background.js is: http://localhost:3000/api

### Expected Backend Output

When you save, backend terminal should show:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Processing new intro: Video Title
   Channel: Channel Name
   Duration: 5s (0s - 5s)
   Category: Educational
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏬ STEP 1/3: Downloading video clip...
   Step 1: Downloading full video...
   Step 2: Extracting intro section with ffmpeg...
   Step 3: Cleaning up full video...
✅ Video downloaded successfully

🤖 STEP 2/3: Analyzing with Gemini AI...
✅ AI Analysis complete

💾 STEP 3/3: Saving to database...
✅ ✅ ✅ INTRO SAVED SUCCESSFULLY! ID: 4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Processing Time:** 20-40 seconds

## ✅ Success Checklist

- [ ] Extension loads in Chrome
- [ ] Extension shows video info on YouTube
- [ ] Can enter times in hh:mm:ss format
- [ ] Save button is clickable
- [ ] Shows "Saving..." message
- [ ] Backend terminal shows processing
- [ ] Shows "Success!" message in extension
- [ ] New intro appears in frontend (http://localhost:3001)
- [ ] New intro has AI analysis details

## 🐛 If Still Not Working

Share with me:
1. **Extension console errors** (right-click popup → Inspect → Console)
2. **Backend terminal output** when you try to save
3. **Which YouTube video URL** you're testing with
4. **Screenshot of extension** (if helpful)

I'll debug from there!
