# Troubleshooting Guide

## Common Issues & Solutions

### ❌ Backend: "GEMINI_API_KEY not found"

**Problem:** API key is missing or not set correctly

**Solution:**
1. Open `backend/.env`
2. Make sure it looks like this:
   ```
   GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. No spaces, no quotes
4. Save the file
5. Restart backend: Stop (Ctrl+C) and run `npm run dev` again

**Get API Key:** https://makersuite.google.com/app/apikey

---

### ❌ Backend: "yt-dlp is not installed"

**Problem:** Video downloader tool is missing

**Solution:**

**On macOS:**
```bash
brew install yt-dlp
```

**On Windows:**
```bash
pip install yt-dlp
```

**On Linux:**
```bash
pip3 install yt-dlp
# or
sudo apt install yt-dlp
```

**Verify:**
```bash
yt-dlp --version
```

---

### ❌ Frontend: "Cannot connect to API"

**Problem:** Backend is not running or wrong port

**Solution:**
1. Make sure backend is running first
2. Check backend terminal shows: `🚀 Server running on http://localhost:3000`
3. Test backend directly: Open http://localhost:3000/health in browser
   - Should show: `{"status":"ok","timestamp":"..."}`
4. If backend is on different port, update `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:YOUR_PORT/api
   ```

---

### ❌ Extension: "Not on YouTube" message

**Problem:** Extension only works on YouTube video pages

**Solution:**
1. Make sure you're on a URL like: `https://www.youtube.com/watch?v=VIDEO_ID`
2. Not the homepage, not search results, not playlists
3. Refresh the page after installing extension
4. Try a different video

---

### ❌ Extension: "Network error"

**Problem:** Can't reach backend server

**Solution:**
1. Check backend is running: http://localhost:3000/health
2. Look at backend terminal for errors
3. Check browser console (F12) for detailed error
4. Verify `extension/popup/popup.js` line 7 has correct URL:
   ```javascript
   const API_URL = 'http://localhost:3000/api';
   ```

---

### ❌ Extension: Icons not showing

**Problem:** Icon files are missing

**Solution:**
1. Create placeholder icons:
   ```bash
   cd extension/icons
   # Download any 3 PNG images or create simple colored squares
   # Name them: icon16.png, icon48.png, icon128.png
   ```

2. Or use command to create solid color icons:
   ```bash
   # If you have ImageMagick:
   convert -size 16x16 xc:#3b82f6 icon16.png
   convert -size 48x48 xc:#3b82f6 icon48.png
   convert -size 128x128 xc:#3b82f6 icon128.png
   ```

3. Reload extension in chrome://extensions

---

### ❌ "Processing took too long"

**Problem:** Video download or AI analysis timeout

**Solution:**
1. Try shorter intros (5-15 seconds)
2. Check internet connection
3. Verify Gemini API key is valid
4. Check backend logs for specific error
5. Some videos are restricted - try a different video

---

### ❌ Port Already in Use

**Problem:** Port 3000 or 3001 is already used

**Backend (port 3000):**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 PID_NUMBER

# Or change port in backend/.env:
PORT=3002
```

**Frontend (port 3001):**
```bash
# Change port in package.json:
"dev": "next dev -p 3002"
```

---

### ❌ "npm command not found"

**Problem:** Node.js is not installed

**Solution:**
1. Download Node.js from: https://nodejs.org/
2. Install it
3. Restart terminal
4. Verify: `node --version` and `npm --version`

---

### ❌ Database Errors

**Problem:** JSON database file issues

**Solution:**
```bash
# Delete and recreate database
cd backend
rm -rf data
mkdir data

# Restart backend
npm run dev
```

---

### ❌ Frontend: Blank Page

**Problem:** Frontend build issue

**Solution:**
```bash
cd frontend

# Clear cache
rm -rf .next
rm -rf node_modules
npm install

# Restart
npm run dev
```

---

### ❌ Extension: Can't Save Intro

**Problem:** Form validation failing

**Solution:**
1. Make sure end time > start time
2. Category is selected
3. Times are in format: `5` or `0:05`
4. Check browser console for specific error (F12)
5. Try entering times manually instead of capturing

---

### ❌ "Too many requests"

**Problem:** Hit rate limit

**Solution:**
1. Wait 1 hour (limit resets)
2. Or restart backend to reset counter:
   ```bash
   # In backend terminal, press Ctrl+C
   npm run dev
   ```

---

## Debugging Tips

### Check Backend Status:
```bash
# Visit in browser:
http://localhost:3000/health

# Should return:
{"status":"ok","timestamp":"..."}
```

### Check Frontend Status:
```bash
# Visit in browser:
http://localhost:3001

# Should show homepage
```

### View Backend Logs:
Look at terminal where backend is running - it shows:
- Requests received
- Processing steps
- Errors (in red)
- Success messages (in green)

### View Frontend Errors:
1. Press F12 in browser
2. Go to Console tab
3. Look for red error messages

### View Extension Errors:
1. Go to chrome://extensions/
2. Find YouTube Intro Analyzer
3. Click "service worker" under "Inspect views"
4. Console shows errors

---

## Quick Fixes Checklist

- [ ] Backend is running
- [ ] Frontend is running
- [ ] API key is set in backend/.env
- [ ] Extension is loaded in Chrome
- [ ] On a YouTube video page (watch?v=...)
- [ ] Both terminals are open and showing no errors
- [ ] Browser console shows no red errors

---

## Still Having Issues?

1. **Restart Everything:**
   ```bash
   # Stop backend (Ctrl+C in terminal)
   # Stop frontend (Ctrl+C in terminal)
   # Close browser
   # Restart backend: npm run dev
   # Restart frontend: npm run dev
   # Reload extension in chrome://extensions/
   ```

2. **Check File Locations:**
   ```bash
   # Make sure you're in right directory:
   cd "/Users/ankushchaudhary/Desktop/Intro Tool"
   
   # Verify structure:
   ls -la
   # Should see: backend/, frontend/, extension/
   ```

3. **Verify Installation:**
   ```bash
   # Check Node.js
   node --version  # Should be 16+
   
   # Check npm
   npm --version
   
   # Check yt-dlp (optional for testing)
   yt-dlp --version
   ```

---

## Error Messages Dictionary

| Error | Meaning | Fix |
|-------|---------|-----|
| ECONNREFUSED | Backend not running | Start backend first |
| EADDRINUSE | Port already used | Kill process or change port |
| 404 Not Found | Wrong URL | Check API endpoints |
| 401 Unauthorized | API key issue | Check Gemini key |
| 429 Too Many Requests | Rate limited | Wait or restart |
| Network Error | Can't reach server | Check backend is running |

---

**Most issues are solved by restarting both servers! 🔄**

