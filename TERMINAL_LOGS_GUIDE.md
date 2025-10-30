# 📊 Terminal Logs Guide

## What You'll See When Saving an Intro

### 1. **Submission Header**
```
██████████████████████████████████████████████████████████████████
📝 NEW INTRO SUBMISSION
   Video: Video Title Here
   Channel: Channel Name
   Duration: 10s (0s - 10s)
   Category: Tech
██████████████████████████████████████████████████████████████████
```

### 2. **Download Phase** (Step 1/3)
```
⏬ STEP 1/3: DOWNLOADING VIDEO CLIP
============================================================
📥 DOWNLOADING VIDEO: abc123xyz
   Time Range: 0s - 10s (10s duration)
============================================================

🎯 STRATEGY 1: Direct extraction with yt-dlp + ffmpeg
   Executing download...
✅ SUCCESS! Downloaded 2.34 MB

✅ Downloaded successfully in 18.5s
```

**What's happening:**
- System tries Strategy 1 first (fastest method)
- If it fails, automatically tries Strategy 2
- If that fails, tries Strategy 3
- Shows file size and time taken

### 3. **AI Analysis Phase** (Step 2/3)
```
🤖 STEP 2/3: AI ANALYSIS WITH GEMINI 2.5 PRO
   Reading video file...
   Video size: 2.34 MB
   Encoding to base64...
   Initializing Gemini 2.5 Pro model...
   Sending video for analysis...
   ✅ Gemini response received
   Response length: 1245 characters
   ✅ Analysis parsed successfully
   📊 Mood: Energetic | Style: Cinematic | Pace: fast
   🏷️  Tags: dynamic, modern, professional, sleek, high-energy
✅ AI Analysis complete in 15.2s
```

**What's happening:**
- Reads the downloaded video
- Encodes it for Gemini
- Sends to Gemini 2.5 Pro for analysis
- Parses JSON response
- Shows mood, style, and tags

### 4. **Database Save** (Step 3/3)
```
💾 STEP 3/3: Saving to database...
🗑️  Cleaning up temporary files...
```

**What's happening:**
- Saves intro with all metadata to JSON database
- Deletes temporary video files
- Cleans up any partial downloads

### 5. **Success Summary**
```
██████████████████████████████████████████████████████████████████
✅ INTRO SAVED SUCCESSFULLY!
   Intro ID: f8e4a2b1-9c3d-4e7f-a1b2-3c4d5e6f7g8h
   Mood: Energetic | Style: Cinematic | Pace: fast
   Download: 18.5s | Analysis: 15.2s | Total: 33.7s
██████████████████████████████████████████████████████████████████
```

**What's included:**
- Unique intro ID (for database lookup)
- Quick summary of AI findings
- Time breakdown for each phase

---

## 🚨 Error Scenarios

### Download Failed (All Strategies)
```
🎯 STRATEGY 1: Direct extraction with yt-dlp + ffmpeg
   ⚠️  Strategy 1 failed: timeout exceeded

🎯 STRATEGY 2: Download worst quality + ffmpeg extract
   ⚠️  Strategy 2 failed: Video unavailable

🎯 STRATEGY 3: Simple download + extract
   ⚠️  Strategy 3 failed: Connection timeout

❌ DOWNLOAD FAILED: All download strategies failed
```

**Common reasons:**
- Video is private/deleted/region-blocked
- Network issues
- YouTube throttling
- Age-restricted (requires sign-in)

### AI Analysis Failed
```
❌ Gemini analysis error: Invalid API key
```

**Common reasons:**
- API key not set or invalid
- API quota exceeded
- Network issues
- Video file corrupted

---

## ⏱️ Expected Times

| Intro Length | Download | AI Analysis | Total |
|--------------|----------|-------------|-------|
| 5-10 seconds | 10-20s   | 8-15s       | 18-35s |
| 15-30 seconds | 20-40s  | 12-20s      | 32-60s |
| 40-60 seconds | 40-80s  | 15-30s      | 55-110s |

*Times vary based on:*
- Video quality/size
- Network speed
- Gemini API response time
- Server load

---

## 🎯 Monitoring Tips

### ✅ Everything is Working When:
- You see "SUCCESS!" after strategy attempts
- Analysis shows mood, style, pace
- Total time under 60s for short intros
- Intro ID appears at the end

### ⚠️ Issues When:
- All 3 strategies fail
- "timeout" appears multiple times
- "Video unavailable" or "Sign in required"
- No Gemini response after 30+ seconds

### 🔧 Quick Fixes:
- **All strategies fail**: Try a different video (may be restricted)
- **Timeout**: Video might be too long or slow network
- **API key error**: Check `.env` file has valid key
- **Gemini slow**: Normal for first request, should be faster after

---

## 📝 Log Levels Explained

| Symbol | Meaning |
|--------|---------|
| 📝 | New submission received |
| ⏬ | Download in progress |
| 🎯 | Strategy being attempted |
| ✅ | Success |
| ⚠️ | Warning/strategy failed |
| ❌ | Error/fatal failure |
| 🤖 | AI processing |
| 💾 | Database operation |
| 🗑️ | Cleanup operation |
| 📊 | Data/statistics |
| 🏷️ | Tags/metadata |

---

## 🚀 Pro Tips

1. **Watch download time**: If consistently over 30s, consider:
   - Checking network speed
   - Selecting shorter intro sections

2. **Monitor strategy success**: 
   - Strategy 1 or 2 should usually work
   - If only Strategy 3 works, video format might be unusual

3. **AI analysis time**:
   - First analysis after server restart is slower (~20-30s)
   - Subsequent analyses faster (~10-15s)

4. **Total time benchmark**:
   - Under 40s for 10s intro = Excellent
   - 40-60s for 10s intro = Good
   - Over 60s for 10s intro = Check network/video

---

## 🎬 Ready to Test!

Your terminal will now show all these logs in real-time. Just:
1. Open Chrome extension
2. Save an intro
3. Watch the magic happen! ✨

