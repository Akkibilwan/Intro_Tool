# YouTube Intro Analyzer - Backend

Backend API for processing and analyzing YouTube video intros using AI.

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL database
- yt-dlp installed (`pip install yt-dlp` or `brew install yt-dlp`)
- Google Gemini API key

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the backend directory:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/intro_analyzer
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

3. **Initialize database:**
```bash
npm run init-db
```

4. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### POST /api/intros
Create and process a new intro.

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "startTime": 5,
  "endTime": 25,
  "category": "Suspense",
  "channelName": "Channel Name",
  "videoTitle": "Video Title",
  "thumbnailUrl": "https://..."
}
```

### GET /api/intros
Get all intros with pagination.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `category` (optional)
- `mood` (optional)
- `sortBy` (default: created_at)

### GET /api/intros/:id
Get a single intro by ID.

### POST /api/search
Search intros using full-text search.

**Request Body:**
```json
{
  "query": "dramatic opening with text",
  "category": "Suspense",
  "mood": "dramatic",
  "limit": 10
}
```

### GET /api/stats
Get platform statistics.

### GET /health
Health check endpoint.

## Architecture

- **Express.js**: Web framework
- **PostgreSQL**: Database with full-text search
- **yt-dlp**: Video downloading
- **Google Gemini AI**: Video analysis
- **Auto-cleanup**: Temp files deleted automatically

## Processing Flow

1. Receive intro data from Chrome extension
2. Download video clip using yt-dlp (specific time range)
3. Analyze video with Gemini Vision API
4. Extract visual characteristics, mood, style, etc.
5. Save to PostgreSQL database
6. Delete temporary video file
7. Return analysis results

## Error Handling

The API includes comprehensive error handling for:
- Invalid video URLs
- Download failures (private/deleted videos)
- AI analysis errors
- Database errors
- Rate limiting

## Rate Limits

- General API: 100 requests per 15 minutes
- Intro creation: 10 requests per hour

## Development

The server performs startup checks for:
- Database connectivity
- yt-dlp installation
- Gemini API access

Files in `temp/` folder are auto-deleted every 5 minutes if older than 10 minutes.

## Troubleshooting

**Database connection failed:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

**yt-dlp not found:**
- Install with: `pip install yt-dlp`

**Gemini API errors:**
- Verify GEMINI_API_KEY is correct
- Check API quota limits

