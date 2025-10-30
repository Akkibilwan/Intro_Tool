# YouTube Intro Analyzer

A complete platform for capturing, analyzing, and discovering YouTube video intros using AI-powered analysis.

## 🎯 Overview

This project consists of three main components:

1. **Chrome Extension** - Capture intro timestamps from YouTube videos
2. **Backend API** - Process videos and analyze with Google Gemini AI
3. **Web Application** - Browse and search analyzed intros

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini Vision API to analyze video content
- **Smart Search**: Full-text search with semantic matching
- **Advanced Filters**: Filter by category, mood, visual style, and pace
- **Video Processing**: Automatic download and processing with yt-dlp
- **Dark Theme**: Beautiful, modern interface
- **Real-time Stats**: Platform analytics and trending intros

## 📦 Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL with full-text search
- Google Gemini AI API
- yt-dlp for video downloading

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS

### Extension
- Vanilla JavaScript
- Chrome Extension Manifest V3

## 🛠️ Installation

### Prerequisites

- Node.js 16+
- PostgreSQL 13+
- Python 3.7+ (for yt-dlp)
- Google Gemini API key

### 1. Backend Setup

```bash
cd backend
npm install

# Install yt-dlp
pip install yt-dlp
# or on macOS: brew install yt-dlp

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Initialize database
npm run init-db

# Start server
npm run dev
```

Backend runs on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local if needed

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:3001`

### 3. Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. Pin the extension to your toolbar

**Note**: You need to create icon files (see `extension/icons/README.md`)

## 📖 Usage

### Capturing Intros

1. Install the Chrome extension
2. Navigate to a YouTube video
3. Click the extension icon
4. Enter start and end times (or capture from current video position)
5. Select a category
6. Click "Save Intro"
7. Wait 30-60 seconds for AI analysis

### Searching Intros

1. Open the web app at `http://localhost:3001`
2. Use the search bar to describe what you're looking for
3. Apply filters for refined results
4. Click any intro card to see full details

### Browsing Intros

1. Go to the Browse page
2. Use filters and sorting options
3. Paginate through all intros

## 🏗️ Project Structure

```
/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── config/      # Database & API config
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── models/      # Database models
│   │   └── middleware/  # Express middleware
│   └── temp/            # Temporary video storage
│
├── frontend/            # Next.js web app
│   └── src/
│       ├── app/        # Pages (App Router)
│       ├── components/ # React components
│       ├── lib/        # API client
│       └── styles/     # Global CSS
│
└── extension/          # Chrome extension
    ├── popup/         # Extension popup UI
    ├── content.js     # YouTube page script
    ├── background.js  # Service worker
    └── manifest.json  # Extension config
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/intro_analyzer
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🎨 Design System

**Colors**:
- Background Primary: `#0a0a0a`
- Background Secondary: `#1a1a1a`
- Accent Blue: `#3b82f6`
- Accent Purple: `#8b5cf6`

**Typography**:
- Font: Inter or system font stack
- Headings: Bold, 24-32px
- Body: Regular, 14-16px

## 📡 API Endpoints

### POST `/api/intros`
Create and process a new intro
- Accepts: video URL, timestamps, category, metadata
- Returns: Processed intro with AI analysis

### GET `/api/intros`
Get all intros with pagination
- Query params: page, limit, category, mood, sortBy
- Returns: Paginated intro list

### GET `/api/intros/:id`
Get single intro details
- Returns: Full intro data

### POST `/api/search`
Search intros
- Body: query, filters, limit
- Returns: Matching intros with relevance scores

### GET `/api/stats`
Get platform statistics
- Returns: Total intros, top categories, top moods

## 🧪 Testing

### Backend
```bash
cd backend
npm test  # (if tests are implemented)
```

### Frontend
```bash
cd frontend
npm run lint
```

### Extension
Load in Chrome and test on YouTube videos

## 🚢 Deployment

### Backend
Recommended platforms:
- Railway
- Render
- DigitalOcean

Requirements:
- Install yt-dlp on server
- Set up managed PostgreSQL
- Configure environment variables

### Frontend
Recommended: Vercel

```bash
cd frontend
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

### Extension
1. Create required icons
2. Zip the extension folder
3. Submit to Chrome Web Store
4. Update API URL to production in `popup.js`

## 🔒 Security

- Input validation on all endpoints
- Rate limiting (100 req/15min general, 10 req/hour for intro creation)
- SQL injection prevention (parameterized queries)
- CORS configuration
- Environment variable protection

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure yt-dlp is installed: `yt-dlp --version`
- Check Gemini API key is valid

### Extension not working
- Only works on `youtube.com/watch*` URLs
- Refresh YouTube page after installing
- Check browser console for errors
- Verify backend is running

### Frontend can't connect to API
- Check backend is running on port 3000
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check CORS settings in backend

## 📝 Development Workflow

1. Start PostgreSQL
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Load extension in Chrome
5. Test full workflow: capture → process → search

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Google Gemini AI for video analysis
- yt-dlp for video downloading
- Next.js team for the amazing framework
- YouTube for the platform

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review component-specific READMEs
3. Open an issue on GitHub

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Favorites and collections
- [ ] GIF preview generation
- [ ] Advanced analytics
- [ ] API for third-party integrations
- [ ] Video editing software integration
- [ ] Mobile app
- [ ] Browser support (Firefox, Safari)

## 📊 Database Schema

```sql
CREATE TABLE intros (
    id SERIAL PRIMARY KEY,
    video_url VARCHAR(500) NOT NULL,
    video_id VARCHAR(100) NOT NULL,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    thumbnail_url VARCHAR(500),
    channel_name VARCHAR(255) NOT NULL,
    video_title VARCHAR(500) NOT NULL,
    user_category VARCHAR(100) NOT NULL,
    ai_description TEXT NOT NULL,
    ai_tags TEXT[],
    mood VARCHAR(50),
    visual_style VARCHAR(50),
    pace VARCHAR(50),
    color_scheme VARCHAR(100),
    has_text BOOLEAN DEFAULT false,
    has_person BOOLEAN DEFAULT false,
    has_music BOOLEAN DEFAULT false,
    transition_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Gemini AI Documentation](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built with ❤️ for content creators**

