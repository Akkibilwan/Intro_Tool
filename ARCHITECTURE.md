# System Architecture - YouTube Intro Analyzer

## Overview

The YouTube Intro Analyzer is a three-tier architecture consisting of a Chrome Extension, Backend API, and Web Application.

```
┌─────────────────┐
│     Chrome      │
│   Extension     │◄──── User captures intro on YouTube
└────────┬────────┘
         │
         │ POST /api/intros
         │ (videoUrl, times, category)
         ▼
┌─────────────────┐
│   Backend API   │
│   (Express.js)  │
└────────┬────────┘
         │
         ├──► yt-dlp (download video clip)
         │
         ├──► Gemini AI (analyze video)
         │
         ├──► PostgreSQL (store data)
         │
         └──► Cleanup Service (delete temp files)
         
         │
         │ GET/POST /api/*
         ▼
┌─────────────────┐
│   Web App       │
│   (Next.js)     │◄──── Users search and browse
└─────────────────┘
```

---

## Component Details

### 1. Chrome Extension

**Purpose**: Capture YouTube intro timestamps

**Technologies**:
- Vanilla JavaScript
- Chrome Extension Manifest V3
- Chrome Storage API
- Chrome Messaging API

**Architecture**:
```
┌──────────────┐
│   Popup UI   │◄──── User interface
└──────┬───────┘
       │
       ├──► Content Script (reads YouTube page)
       │
       ├──► Background Worker (API communication)
       │
       └──► Chrome Storage (temporary data)
```

**Data Flow**:
1. User opens popup on YouTube video
2. Content script extracts video metadata
3. User enters time range and category
4. Popup validates input
5. Background worker sends to backend API
6. User sees success/error message

**Key Files**:
- `manifest.json` - Extension configuration
- `popup/popup.html/css/js` - User interface
- `content.js` - YouTube page interaction
- `background.js` - Service worker

---

### 2. Backend API

**Purpose**: Process videos and manage data

**Technologies**:
- Node.js + Express.js
- PostgreSQL
- Google Gemini AI API
- yt-dlp (Python tool)

**Architecture**:
```
┌─────────────────────────────────────┐
│           Express App               │
├─────────────────────────────────────┤
│  ┌──────────┐    ┌──────────────┐  │
│  │  Routes  │───►│ Controllers  │  │
│  └──────────┘    └───────┬──────┘  │
│                           │          │
│  ┌──────────┐    ┌───────▼──────┐  │
│  │ Services │◄───│    Models    │  │
│  └────┬─────┘    └──────────────┘  │
└───────┼──────────────────────────────┘
        │
        ├──► yt-dlp (video download)
        ├──► Gemini AI (analysis)
        ├──► PostgreSQL (data)
        └──► File System (temp storage)
```

**Processing Pipeline**:
```
Request → Validation → Download → Analyze → Store → Cleanup → Response
   │          │           │          │         │        │         │
   │          │           │          │         │        │         └─► JSON response
   │          │           │          │         │        └─► Delete video file
   │          │           │          │         └─► Save to PostgreSQL
   │          │           │          └─► AI analysis with Gemini
   │          │           └─► yt-dlp downloads clip
   │          └─► Check inputs
   └─► POST /api/intros
```

**Key Services**:

1. **Video Downloader**
   - Uses yt-dlp to download specific time range
   - Saves to temp folder
   - Error handling for unavailable videos

2. **Gemini Analyzer**
   - Sends video to Gemini Vision API
   - Extracts visual characteristics
   - Parses JSON response

3. **Cleanup Service**
   - Runs every 5 minutes
   - Deletes files older than 10 minutes
   - Prevents disk space issues

**Database Schema**:
```sql
intros
├── id (SERIAL PRIMARY KEY)
├── video_url
├── video_id
├── start_time, end_time, duration
├── channel_name, video_title
├── user_category
├── ai_description
├── ai_tags (TEXT[])
├── mood, visual_style, pace
├── color_scheme
├── has_text, has_person, has_music
├── transition_count
└── created_at, updated_at
```

**Indexes**:
- `video_id` - Fast video lookups
- `user_category` - Category filtering
- `mood` - Mood filtering
- `created_at` - Sorting
- `ai_tags` - Array searches (GIN index)
- Full-text search index

---

### 3. Web Application

**Purpose**: Browse and search intros

**Technologies**:
- Next.js 14 (App Router)
- React 18
- Tailwind CSS

**Architecture**:
```
App Router Pages
├── / (Homepage)
│   ├── Hero + Search
│   ├── Stats Cards
│   ├── Trending Intros
│   └── How It Works
│
├── /search (Search Results)
│   ├── Search Bar
│   ├── Filter Sidebar
│   └── Results Grid
│
├── /browse (Browse All)
│   ├── Filter Sidebar
│   ├── Sort Options
│   └── Paginated Grid
│
└── /intro/[id] (Detail Page)
    ├── YouTube Embed
    ├── AI Analysis
    ├── Technical Details
    └── Similar Intros
```

**Component Hierarchy**:
```
RootLayout
└── Header (Navigation)
    │
    ├── Page Components
    │   ├── SearchBar
    │   ├── IntroCard (reusable)
    │   ├── FilterPanel
    │   └── LoadingSpinner
    │
    └── Footer
```

**Data Flow**:
```
User Action → Component → API Client → Backend → Database
                                ▼
                         Response → State Update → Re-render
```

**API Client** (`lib/api.js`):
- Centralized API communication
- Error handling
- Response formatting
- Helper functions

---

## Data Flow Examples

### 1. Capturing an Intro

```
User on YouTube
    │
    ▼
Opens Extension
    │
    ▼
Enters times & category
    │
    ▼
Extension validates input
    │
    ▼
POST to /api/intros
    │
    ▼
Backend receives request
    │
    ├──► Download video clip (30s)
    │
    ├──► Analyze with Gemini (20s)
    │
    ├──► Save to database (1s)
    │
    └──► Delete temp file (1s)
    │
    ▼
Return success response
    │
    ▼
Extension shows success
    │
    ▼
User can browse in web app
```

### 2. Searching Intros

```
User types query
    │
    ▼
SearchBar component
    │
    ▼
API client calls /api/search
    │
    ▼
Backend performs full-text search
    │
    ├──► Search ai_description
    ├──► Search ai_tags
    └──► Rank by relevance
    │
    ▼
Return ranked results
    │
    ▼
Display IntroCards
```

---

## Security Architecture

### 1. Input Validation
- Extension validates times and categories
- Backend validates all inputs
- SQL injection prevention (parameterized queries)

### 2. Rate Limiting
- General API: 100 requests per 15 minutes
- Intro creation: 10 requests per hour
- Per IP address

### 3. CORS Configuration
- Whitelist frontend domain
- Whitelist extension origin
- Reject all other origins

### 4. API Key Protection
- Stored in environment variables only
- Never exposed to client
- Gemini API called from backend only

### 5. File System Safety
- Temp files auto-deleted
- Restricted file access
- No user-uploaded files

---

## Performance Optimizations

### Backend
- Database indexes for fast queries
- Connection pooling
- Async/await for non-blocking operations
- Auto cleanup of temp files

### Frontend
- Server-side rendering (Next.js)
- Image optimization
- Code splitting
- Lazy loading

### Database
- Full-text search indexes
- Array indexes for tags
- Query optimization

---

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (can run multiple instances)
- Load balancer ready
- Database connection pooling

### Vertical Scaling
- Efficient video processing
- Minimal memory footprint
- Fast AI analysis

### Caching Opportunities
- Popular search results
- Homepage data
- Category statistics

---

## Monitoring & Logging

### Backend Logs
- Request/response times
- Database query performance
- AI API calls
- Errors and exceptions

### Error Handling
- Try-catch blocks
- Graceful degradation
- User-friendly error messages
- Cleanup on failure

---

## Technology Choices Rationale

**Why Node.js?**
- Fast for I/O operations
- Same language as frontend
- Large ecosystem
- Async by default

**Why PostgreSQL?**
- Robust full-text search
- Array data types
- ACID compliance
- JSON support

**Why Next.js?**
- React framework with SSR
- File-based routing
- Optimized out of the box
- Great developer experience

**Why yt-dlp?**
- Reliable YouTube downloads
- Active maintenance
- Precise time-range extraction
- Format selection

**Why Gemini AI?**
- Vision API for video
- High-quality analysis
- Reasonable pricing
- Easy integration

---

## Deployment Architecture

```
Production Setup:

┌──────────────────┐
│  Chrome Store    │
│   (Extension)    │
└──────────────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│  Railway/Render  │────►│   PostgreSQL     │
│   (Backend API)  │     │   (Managed DB)   │
└──────────────────┘     └──────────────────┘
         │
         ▼
┌──────────────────┐
│     Vercel       │
│   (Frontend)     │
└──────────────────┘
```

---

## Future Architecture Enhancements

1. **Caching Layer**: Redis for search results
2. **Queue System**: Bull/RabbitMQ for video processing
3. **CDN**: CloudFlare for static assets
4. **Analytics**: Mixpanel or Google Analytics
5. **Monitoring**: Sentry for error tracking
6. **Search**: Elasticsearch for advanced search
7. **Storage**: S3 for video thumbnails
8. **Authentication**: Auth0 or Firebase

---

## API Design Principles

1. **RESTful**: Standard HTTP methods
2. **JSON**: All data in JSON format
3. **Pagination**: Large datasets paginated
4. **Filtering**: Query params for filters
5. **Errors**: Consistent error responses
6. **Versioning**: Ready for /api/v2

---

This architecture provides a solid foundation for the YouTube Intro Analyzer platform with room for growth and optimization.

