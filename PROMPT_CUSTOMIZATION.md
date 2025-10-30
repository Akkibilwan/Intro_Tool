# 🎨 Gemini AI Prompt Customization Guide

## 📍 Where is the Prompt Located?

The AI analysis prompt is located in:
```
backend/src/services/geminiAnalyzer.js
```

Specifically at **lines 31-59**

## 📝 Current Prompt Structure

The prompt tells Gemini AI what to analyze in the video:

```javascript
const prompt = `Analyze this YouTube video intro in detail. Provide:

1. VISUAL DESCRIPTION: Describe what's happening visually (shots, camera movements, elements shown)
2. MOOD & TONE: What's the overall feeling? (dramatic, energetic, calm, mysterious, etc.)
3. VISUAL STYLE: Minimal, busy, animated, live-action, etc.
4. PACE: Slow, medium, or fast?
5. COLOR SCHEME: Dark, bright, colorful, monochrome, etc.
6. KEY ELEMENTS:
   - Does it have text/titles? (yes/no)
   - Does it show a person? (yes/no)
   - Background music type? (dramatic, upbeat, calm, none)
   - Number of cuts/transitions
7. TECHNICAL DETAILS: Any special effects, transitions, animations?
8. KEYWORDS: List 5-10 relevant tags that describe this intro style

Format your response as JSON:
{
  "description": "detailed visual description",
  "mood": "single word",
  "visualStyle": "single word",
  "pace": "slow/medium/fast",
  "colorScheme": "description",
  "hasText": boolean,
  "hasPerson": boolean,
  "musicType": "description or 'none'",
  "transitionCount": number,
  "technicalDetails": "string",
  "keywords": ["tag1", "tag2", ...]
}`;
```

## 🎯 How to Customize the Prompt

### Option 1: Add More Analysis Points

Add more sections to the prompt (before the JSON format section):

```javascript
9. BRANDING ELEMENTS: Logos, brand colors, consistent themes?
10. AUDIO ELEMENTS: Voice-over, sound effects, music style?
11. TARGET AUDIENCE: Who is this intro designed for?
```

Then update the JSON structure to include these fields.

### Option 2: Change Analysis Focus

Focus on specific aspects by modifying the prompt:

```javascript
const prompt = `Analyze this YouTube video intro with focus on VISUAL DIRECTION:

1. CINEMATOGRAPHY:
   - Camera angles and movements
   - Shot composition (rule of thirds, symmetry, etc.)
   - Depth of field and focus points

2. LIGHTING:
   - Lighting setup (3-point, natural, dramatic)
   - Light direction and intensity
   - Shadows and highlights

3. COLOR GRADING:
   - Color palette and harmony
   - Saturation and contrast levels
   - Color psychology and mood

4. EDITING STYLE:
   - Cut frequency and rhythm
   - Transition types (hard cuts, fades, wipes)
   - Pacing and flow

...
```

### Option 3: Change Output Format

You can ask for different JSON structures:

```javascript
{
  "visualDirection": {
    "cinematography": { ... },
    "lighting": { ... },
    "colorGrading": { ... }
  },
  "editingStyle": { ... },
  "overall": {
    "rating": "1-10",
    "strengths": ["..."],
    "suggestions": ["..."]
  }
}
```

## 🔧 Steps to Modify

1. **Edit the file:**
   ```
   backend/src/services/geminiAnalyzer.js
   ```

2. **Find line 31** (starts with `const prompt = `)

3. **Modify the prompt text** between the backticks

4. **Update the JSON structure** if you add new fields

5. **Update the database model** if needed:
   ```
   backend/src/models/Intro.js
   ```
   Add new fields to the `create()` method.

6. **Restart the backend** - Nodemon should auto-restart, or manually:
   ```bash
   pkill -f "nodemon src/server.js"
   cd backend && npm run dev
   ```

## 💡 Tips for Better Prompts

1. **Be Specific**: Instead of "describe the video", say "describe camera movements, shot types, and visual composition"

2. **Use Examples**: Include examples in the prompt:
   ```
   "Pace: Slow (like a documentary), Medium (standard vlog), or Fast (like a music video)"
   ```

3. **Request Structured Data**: Always ask for JSON format with clear field names

4. **Set Constraints**: Limit response length or format:
   ```
   "Description: 2-3 sentences maximum"
   "Keywords: Exactly 8 tags"
   ```

5. **Test Incrementally**: Change one thing at a time and test

## 🎬 Example: Visual Direction Focused Prompt

```javascript
const prompt = `As a professional video director, analyze this YouTube intro's visual direction:

**CINEMATOGRAPHY:**
- What camera angles are used? (eye-level, low-angle, high-angle, Dutch tilt)
- Describe camera movements (static, pan, tilt, dolly, handheld, drone)
- Shot types used (extreme close-up, close-up, medium, wide, extreme wide)

**COMPOSITION:**
- Framing techniques (rule of thirds, centered, asymmetric)
- Leading lines and visual flow
- Foreground/background relationship

**LIGHTING & COLOR:**
- Lighting style (natural, studio, dramatic, flat)
- Color palette (warm, cool, monochromatic, complementary)
- Mood created by lighting/color

**EDITING & MOTION:**
- Cut frequency (cuts per second)
- Transition styles (hard cut, dissolve, wipe, motion graphics)
- Motion graphics or animations
- Overall pace and rhythm

**VISUAL STORYTELLING:**
- What story is told visually?
- Key visual moments or highlights
- Professional production quality (1-10)

Return as JSON with this structure:
{
  "cinematography": {
    "angles": ["angle1", "angle2"],
    "movements": ["movement1", "movement2"],
    "shotTypes": ["type1", "type2"]
  },
  "composition": {
    "framing": "description",
    "visualFlow": "description",
    "depth": "description"
  },
  "lightingColor": {
    "lightingStyle": "description",
    "colorPalette": ["color1", "color2", "color3"],
    "mood": "single word"
  },
  "editing": {
    "cutFrequency": "number per second",
    "transitions": ["type1", "type2"],
    "pace": "slow/medium/fast"
  },
  "storytelling": {
    "narrative": "brief description",
    "keyMoments": ["moment1", "moment2"],
    "productionQuality": 8
  },
  "overallImpression": "2-3 sentence summary",
  "keywords": ["tag1", "tag2", ...]
}`;
```

## 🚀 After Customization

1. **Test with a sample video** via the extension
2. **Check the database** to see the new fields:
   ```bash
   cat backend/data/intros.json
   ```
3. **Update the frontend** to display new fields if needed
4. **Iterate and refine** based on results

---

**Current Model:** Gemini 2.5 Pro
**File Location:** `backend/src/services/geminiAnalyzer.js` (lines 31-59)

