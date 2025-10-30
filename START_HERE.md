# 🚀 START HERE - Quick Setup Guide

## ✅ Good News!
All dependencies are installed! Just follow these 3 simple steps.

---

## Step 1️⃣: Add Your Gemini API Key (2 minutes)

### Get Your API Key:
1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (looks like: `AIzaSyD...`)

### Paste Your API Key:
1. Open this file: **`backend/.env`**
2. Find the line that says: `GEMINI_API_KEY=`
3. Paste your key after the `=` sign

**Example:**
```
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. **Save the file** (Cmd+S or Ctrl+S)

---

## Step 2️⃣: Start the Servers (1 minute)

### Terminal 1 - Backend:
```bash
cd "/Users/ankushchaudhary/Desktop/Intro Tool/backend"
npm run dev
```

Wait until you see:
```
✅ Database initialized
🚀 Server running on http://localhost:3000
```

**Keep this terminal open!**

---

### Terminal 2 - Frontend:
Open a **NEW terminal window** and run:

```bash
cd "/Users/ankushchaudhary/Desktop/Intro Tool/frontend"
npm run dev
```

Wait until you see:
```
✓ Ready in 2.5s
○ Local: http://localhost:3001
```

**Keep this terminal open too!**

---

### ✅ Test It Works:
Open your browser and go to: **http://localhost:3001**

You should see the YouTube Intro Analyzer homepage!

---

## Step 3️⃣: Install Chrome Extension (2 minutes)

### Create Simple Icons (Quick Method):
```bash
cd "/Users/ankushchaudhary/Desktop/Intro Tool/extension/icons"

# Create placeholder icon files
touch icon16.png icon48.png icon128.png
```

Or download any 3 PNG images and rename them to `icon16.png`, `icon48.png`, `icon128.png`

### Load Extension in Chrome:

1. **Open Chrome**
2. Go to: `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"** button
5. Navigate to: `/Users/ankushchaudhary/Desktop/Intro Tool/extension`
6. Click **"Select"**

The extension is now installed! 🎉

### Pin Extension to Toolbar:
1. Click the puzzle icon in Chrome toolbar
2. Find "YouTube Intro Analyzer"
3. Click the pin icon next to it

---

## 🎬 How to Use

### Capture an Intro:
1. Open any YouTube video
2. Click the extension icon
3. Enter start time: `0` and end time: `15`
4. Select a category
5. Click "Save Intro"
6. Wait 30-60 seconds
7. See it on your web app!

---

## 📍 Important Locations

**API Key Location:**
```
backend/.env
```
Line that says: `GEMINI_API_KEY=`

**Backend Server:**
- URL: http://localhost:3000
- Start: `cd backend && npm run dev`

**Frontend App:**
- URL: http://localhost:3001
- Start: `cd frontend && npm run dev`

**Extension Folder:**
```
/Users/ankushchaudhary/Desktop/Intro Tool/extension
```

---

## 🔧 If Something Goes Wrong

### Backend won't start:
```bash
# Make sure you're in the right folder
cd "/Users/ankushchaudhary/Desktop/Intro Tool/backend"

# Check if .env file exists and has API key
cat .env

# Restart the server
npm run dev
```

### Frontend won't start:
```bash
# Make sure backend is running first!
# Then in a new terminal:
cd "/Users/ankushchaudhary/Desktop/Intro Tool/frontend"
npm run dev
```

### Extension not showing up:
- Refresh YouTube page
- Only works on `youtube.com/watch?v=...` URLs
- Check if backend is running

---

## 🎯 What's Next?

Once everything is running:
1. Test by capturing a YouTube intro
2. View it in the web app at http://localhost:3001
3. Try searching for intros
4. Explore the browse page

---

## 📦 How Extension Deployment Works

### For Testing (What you just did):
✅ You're using "Developer Mode" - perfect for testing!

### For Publishing to Chrome Web Store:

1. **Prepare Icons:**
   - Create professional 16x16, 48x48, 128x128 PNG icons
   - Use a tool like Canva or hire on Fiverr ($5-20)

2. **Update API URL:**
   - Open `extension/popup/popup.js`
   - Change line 7 from:
     ```javascript
     const API_URL = 'http://localhost:3000/api';
     ```
   - To your deployed backend URL:
     ```javascript
     const API_URL = 'https://your-backend.railway.app/api';
     ```

3. **Create ZIP File:**
   ```bash
   cd "/Users/ankushchaudhary/Desktop/Intro Tool"
   zip -r extension.zip extension/ -x "*.DS_Store" "*/README.md"
   ```

4. **Submit to Chrome Web Store:**
   - Go to: https://chrome.google.com/webstore/devconsole
   - Pay $5 one-time developer fee
   - Click "New Item"
   - Upload `extension.zip`
   - Fill in:
     - Name: YouTube Intro Analyzer
     - Description: AI-powered intro capture tool
     - Category: Productivity
     - Screenshots: Take 3-4 screenshots of your extension
     - Privacy: Add privacy policy (can be simple)
   - Submit for review (takes 1-3 days)

5. **Deployment Requirements:**
   - Privacy Policy URL (create a simple Google Doc)
   - Extension screenshots
   - Detailed description
   - Icon 128x128 minimum

### Recommended: Keep in Developer Mode
For personal use or small team, just keep using Developer Mode!
- No fees
- No review process
- Works perfectly
- Can share with friends (they also use Developer Mode)

---

## 💡 Pro Tips

1. **Always start backend before frontend**
2. **Keep both terminals open while working**
3. **Test with short videos first (10-20 seconds)**
4. **Check browser console if extension fails (F12)**
5. **Backend logs show what's happening during processing**

---

## 🆘 Need Help?

Check these files:
- `TROUBLESHOOTING.md` - Common issues
- `README.md` - Full documentation
- `ARCHITECTURE.md` - How it works

---

**You're all set! Enjoy analyzing intros! 🎬**

