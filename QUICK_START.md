# Quick Start - YouTube Intro Analyzer

Get up and running in 5 minutes! ⚡

## Prerequisites Check

```bash
# Check you have these installed:
node --version    # Need 16+
psql --version    # PostgreSQL
yt-dlp --version  # Video downloader
python3 --version # Need for yt-dlp
```

## 1. Database Setup (2 minutes)

```bash
# Create database
psql postgres
CREATE DATABASE intro_analyzer;
CREATE USER intro_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE intro_analyzer TO intro_user;
\q
```

## 2. Backend Setup (2 minutes)

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=3000
DATABASE_URL=postgresql://intro_user:password123@localhost:5432/intro_analyzer
GEMINI_API_KEY=YOUR_API_KEY_HERE
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
EOF

# Initialize database and start
npm run init-db
npm run dev
```

✅ Backend running at http://localhost:3000

## 3. Frontend Setup (1 minute)

```bash
# Open new terminal
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local

npm run dev
```

✅ Frontend running at http://localhost:3001

## 4. Extension Setup (1 minute)

1. Create simple icons (or skip for now):
```bash
cd extension/icons
# Create placeholder files or use any PNG images
touch icon16.png icon48.png icon128.png
```

2. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `extension` folder

✅ Extension loaded!

## 5. Test It! (1 minute)

1. Open YouTube video
2. Click extension icon
3. Set start: `0`, end: `15`
4. Category: `Educational`
5. Click "Save Intro"
6. Wait 30-60 seconds
7. Check http://localhost:3001

## That's It! 🎉

## Next Steps

- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Read [README.md](README.md) for full documentation
- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system

## Common Issues

**"yt-dlp not installed"**
```bash
pip3 install yt-dlp
# or: brew install yt-dlp
```

**"Database connection failed"**
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
```

**"Gemini API error"**
- Get API key: https://makersuite.google.com/app/apikey
- Add to backend/.env

## Quick Commands

```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev

# Database
psql -U intro_user -d intro_analyzer
```

## Port Reference

- Backend: 3000
- Frontend: 3001
- PostgreSQL: 5432

## Files You Need to Edit

1. `backend/.env` - Add your Gemini API key
2. `extension/icons/` - Add PNG icons (or use placeholders)

That's all! Everything else works out of the box.

---

**Need help?** Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for troubleshooting.

