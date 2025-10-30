# YouTube Intro Analyzer - Frontend

Modern Next.js web application for browsing and searching AI-analyzed YouTube intros.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **Dark Theme Design**

## Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:3000`

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Run development server:**
```bash
npm run dev
```

The app will open at `http://localhost:3001`

## Features

### Homepage
- Hero section with search
- Platform statistics
- Trending/recent intros
- "How It Works" section

### Search Page
- Full-text search powered by backend
- Real-time results
- Filter panel (categories, moods, styles, pace)
- Quick filter pills
- Match score display

### Browse Page
- View all intros with pagination
- Filter sidebar
- Sort options (recent, duration)
- Grid layout

### Intro Detail Page
- Embedded YouTube video (starts at intro time)
- Full AI analysis display
- Visual characteristics
- Technical details
- Similar intros suggestions
- Direct YouTube link with timestamp

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Homepage
│   │   ├── search/
│   │   │   └── page.js        # Search page
│   │   ├── browse/
│   │   │   └── page.js        # Browse page
│   │   └── intro/
│   │       └── [id]/
│   │           └── page.js    # Detail page
│   ├── components/
│   │   ├── Header.jsx         # Navigation header
│   │   ├── SearchBar.jsx      # Search input
│   │   ├── IntroCard.jsx      # Intro preview card
│   │   ├── FilterPanel.jsx    # Sidebar filters
│   │   ├── LoadingSpinner.jsx # Loading state
│   │   └── Toast.jsx          # Notifications
│   ├── lib/
│   │   └── api.js             # API client
│   └── styles/
│       └── globals.css        # Global styles
```

## Components

### Header
Sticky navigation with logo, links, and "Install Extension" CTA.

### SearchBar
Large search input with clear button and submit button. Supports Enter key.

### IntroCard
Preview card with:
- Thumbnail image
- Channel name and video title
- Category and duration badges
- Tags and characteristics
- Hover effects

### FilterPanel
Collapsible filter sections:
- Categories (checkboxes)
- Moods (checkboxes)
- Visual Styles (checkboxes)
- Pace (radio buttons)
- Clear all button

### LoadingSpinner
Centered spinner with customizable message.

### Toast
Notification component for success/error messages.

## Styling

### Color Palette
- Background Primary: `#0a0a0a`
- Background Secondary: `#1a1a1a`
- Background Tertiary: `#2a2a2a`
- Accent Blue: `#3b82f6`
- Accent Purple: `#8b5cf6`
- Text Primary: `#ffffff`
- Text Secondary: `#a0a0a0`
- Border: `#333333`

### Design Principles
- Clean, minimal interface
- Solid colors only
- Smooth transitions (200ms)
- Cards with subtle borders
- Generous spacing
- Clear visual hierarchy

## API Integration

The app uses the API client (`src/lib/api.js`) to communicate with the backend:

- `searchIntros(query, filters)` - Search intros
- `getAllIntros(page, limit, filters)` - Get paginated intros
- `getIntroById(id)` - Get single intro
- `getStats()` - Get platform statistics

## Build & Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## Development Tips

- Use React DevTools for component debugging
- Hot reload enabled in dev mode
- Tailwind IntelliSense recommended
- ESLint configured for code quality

## Troubleshooting

**API connection errors:**
- Make sure backend is running on port 3000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend

**Images not loading:**
- YouTube thumbnail domains are whitelisted in `next.config.js`
- Check network tab for 404 errors

**Build errors:**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check for TypeScript/ESLint errors

## Future Enhancements

- User authentication
- Saved favorites
- Advanced search filters
- Video preview on hover
- Keyboard shortcuts
- Dark/light theme toggle
- Export functionality
- Analytics dashboard

