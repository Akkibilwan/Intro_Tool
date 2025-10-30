# Complete Setup Guide - YouTube Intro Analyzer

This guide will walk you through setting up the entire YouTube Intro Analyzer platform from scratch.

## ⏱️ Estimated Time: 30-45 minutes

---

## Part 1: Prerequisites (5 minutes)

### 1. Install Required Software

**Node.js and npm:**
```bash
# Check if installed
node --version  # Should be 16+
npm --version

# If not installed, download from:
# https://nodejs.org/
```

**PostgreSQL:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

**Python and yt-dlp:**
```bash
# Install Python 3.7+
python3 --version

# Install yt-dlp
pip3 install yt-dlp

# Or on macOS
brew install yt-dlp

# Verify installation
yt-dlp --version
```

### 2. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (you'll need it later)

---

## Part 2: Database Setup (5 minutes)

### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# In psql prompt:
CREATE DATABASE intro_analyzer;
CREATE USER intro_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE intro_analyzer TO intro_user;
\q
```

### Test Connection

```bash
psql -U intro_user -d intro_analyzer -h localhost
# Enter password when prompted
# Type \q to exit
```

---

## Part 3: Backend Setup (10 minutes)

### 1. Navigate to Backend

```bash
cd "backend"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=3000
DATABASE_URL=postgresql://intro_user:your_secure_password@localhost:5432/intro_analyzer
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### 4. Initialize Database

```bash
npm run init-db
```

You should see:
```
✅ Database tables and indexes created successfully!
```

### 5. Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Database connection successful
✅ yt-dlp is installed
✅ Gemini API connection successful
🚀 Server running on http://localhost:3000
```

**Keep this terminal open!**

---

## Part 4: Frontend Setup (10 minutes)

### 1. Open New Terminal

Navigate to frontend:
```bash
cd "frontend"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Content should be:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Start Frontend Server

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local: http://localhost:3001
```

### 5. Test Frontend

Open browser and go to: `http://localhost:3001`

You should see the homepage with "Find Perfect Intro Inspiration" heading.

**Keep this terminal open!**

---

## Part 5: Chrome Extension Setup (10 minutes)

### 1. Create Extension Icons

You need three PNG icons. Quick option:

**Option A: Use online generator**
- Go to https://www.favicon-generator.org/
- Upload any image or create a simple design
- Download 16x16, 48x48, and 128x128 versions
- Rename them to `icon16.png`, `icon48.png`, `icon128.png`
- Place in `extension/icons/` folder

**Option B: Use ImageMagick (if installed)**
```bash
cd extension/icons
convert -size 16x16 xc:#3b82f6 icon16.png
convert -size 48x48 xc:#3b82f6 icon48.png
convert -size 128x128 xc:#3b82f6 icon128.png
```

### 2. Load Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Navigate to and select the `extension` folder
6. Extension should appear with your icons
7. Pin it to toolbar (click puzzle icon → pin)

---

## Part 6: Test Complete Workflow (5-10 minutes)

### 1. Capture an Intro

1. Open YouTube in Chrome
2. Find a video with a good intro (try any popular video)
3. Click the extension icon
4. Enter start time: `0:00` or `0`
5. Enter end time: `0:15` or `15`
6. Select category: `Educational` (or any)
7. Click "Save Intro"
8. Wait for processing (30-60 seconds)
9. You should see "Intro saved successfully!"

### 2. View in Web App

1. Go back to `http://localhost:3001`
2. Refresh the page
3. You should see your intro in "Recent Intros"
4. Click on it to see full details with AI analysis

### 3. Test Search

1. Click "Search" in navigation
2. Enter: "educational intro"
3. Your intro should appear in results

---

## Part 7: Troubleshooting

### Backend Issues

**"yt-dlp is not installed"**
```bash
# macOS
brew install yt-dlp

# Linux/Windows
pip3 install yt-dlp

# Verify
yt-dlp --version
```

**"Database connection failed"**
```bash
# Check PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Test connection
psql -U intro_user -d intro_analyzer -h localhost
```

**"Gemini API connection failed"**
- Verify API key is correct
- Check you have API quota available
- Try regenerating the key

### Frontend Issues

**"Cannot connect to API"**
- Ensure backend is running on port 3000
- Check `.env.local` has correct API URL
- Open browser console for detailed errors

### Extension Issues

**"Not on YouTube" message**
- Only works on `youtube.com/watch?v=...` URLs
- Try refreshing the page
- Make sure extension is enabled

**"Network error"**
- Verify backend is running
- Check extension console for errors (Inspect views → service worker)
- Ensure popup.js has correct API URL

---

## Part 8: Next Steps

### Add More Intros

1. Watch different types of YouTube videos
2. Capture various intro styles
3. Use different categories
4. Build your database

### Explore Features

- **Browse Page**: See all intros with filters
- **Search**: Try different search queries
- **Filters**: Use category, mood, pace filters
- **Detail Pages**: Click intros to see full AI analysis

### Customize

**Change Extension API URL:**
Edit `extension/popup/popup.js`:
```javascript
const API_URL = 'your-production-url/api';
```

**Change App Port:**
Edit `frontend/package.json`:
```json
"dev": "next dev -p 3002"
```

**Change Backend Port:**
Edit `backend/.env`:
```env
PORT=3001
```

---

## Part 9: Production Deployment

### Backend to Railway

1. Create account at [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Frontend to Vercel

1. Push code to GitHub
2. Create account at [Vercel.com](https://vercel.com)
3. Import GitHub repository
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

### Extension to Chrome Web Store

1. Create icons (if not done)
2. Zip extension folder
3. Pay $5 developer fee
4. Submit at [Chrome Web Store](https://chrome.google.com/webstore/devconsole)

---

## Part 10: Common Commands Reference

### Backend
```bash
# Development
cd backend
npm run dev

# Initialize database
npm run init-db

# Production
npm start
```

### Frontend
```bash
# Development
cd frontend
npm run dev

# Build
npm run build

# Production
npm start
```

### Database
```bash
# Connect
psql -U intro_user -d intro_analyzer

# View tables
\dt

# View intros
SELECT id, video_title, category FROM intros;

# Clear all data
TRUNCATE intros CASCADE;
```

---

## 🎉 Success Checklist

- [ ] PostgreSQL installed and running
- [ ] yt-dlp installed and working
- [ ] Gemini API key obtained
- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Extension loaded in Chrome
- [ ] Successfully captured and analyzed an intro
- [ ] Can view intro in web app
- [ ] Search functionality working

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review README.md files in each directory
3. Check browser/terminal console for error messages
4. Verify all prerequisites are installed
5. Ensure all three components are running simultaneously

---

## 📝 Development Tips

- Keep three terminals open (backend, frontend, database)
- Use browser DevTools for frontend debugging
- Check backend logs for API errors
- Use PostgreSQL GUI tools like pgAdmin or TablePlus
- Test with short videos (< 30 seconds) first

---

**Happy analyzing! 🎬**

