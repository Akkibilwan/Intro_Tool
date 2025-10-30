/**
 * Gemini AI Analyzer Service
 * Analyzes video intros using Google Gemini Vision API
 * Using gemini-2.5-pro (current working model)
 */

const fs = require('fs').promises;
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze a video intro using Gemini AI
 * @param {string} videoPath - Path to video file
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeIntroVideo(videoPath) {
  try {
    console.log('   Reading video file...');
    const videoData = await fs.readFile(videoPath);
    const videoSizeMB = (videoData.length / 1024 / 1024).toFixed(2);
    console.log(`   Video size: ${videoSizeMB} MB`);
    
    console.log('   Encoding to base64...');
    const base64Video = videoData.toString('base64');
    
    console.log('   Initializing Gemini 2.5 Pro model...');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro'
    });
    
    console.log('   Sending video for analysis...');
    
    const prompt = `You are an expert film director and cinematographer. Analyze this video intro with professional precision.

CRITICAL REQUIREMENT: Your response MUST be ONLY valid JSON. No markdown, no explanations, no prose outside the JSON structure.

Perform a detailed frame-by-frame analysis covering:

1. CINEMATOGRAPHY: Camera angles, shot types (wide/medium/close-up), camera movements (pan/tilt/zoom/tracking), focal depth, framing composition
2. EDITING: Cut frequency, transition types (hard cuts/fades/wipes), pacing rhythm, montage style
3. VISUAL DESIGN: Color grading, lighting setup, color palette dominance, contrast levels, visual hierarchy
4. MOTION GRAPHICS: Text overlays, animated elements, graphic design style, typography treatment
5. PRODUCTION QUALITY: Professional polish, effects complexity, technical execution
6. EMOTIONAL TONE: Mood evoked by visuals, energy level, atmospheric feeling, intended viewer response

Return this EXACT JSON structure:

{
  "description": "Detailed 3-4 sentence description of the visual journey. Describe HOW it's shot and edited, not just WHAT is shown. Include camera work, composition, editing rhythm, and visual progression. Be specific about cinematic techniques used.",
  "mood": "Single descriptive word (Dramatic/Energetic/Calm/Mysterious/Epic/Intimate/Playful/Serious/Inspiring/Tense/etc)",
  "visualStyle": "Single style descriptor (Cinematic/Documentary/Animated/Motion-Graphics/Minimalist/Stylized/Raw/Polished/Vintage/Modern/etc)",
  "pace": "slow or medium or fast",
  "colorScheme": "Detailed color description including dominant colors, contrast style, grading approach, and overall color mood (e.g., 'Warm golden tones with high contrast blacks, cinematic orange-teal grading')",
  "hasText": true or false,
  "hasPerson": true or false,
  "musicType": "Specific music genre or 'none' (Epic-Orchestral/Electronic/Ambient/Hip-hop/Rock/Acoustic/Upbeat/Dramatic/none)",
  "transitionCount": number_of_visible_cuts_or_transitions,
  "technicalDetails": "Comprehensive description of technical execution: camera techniques, special effects, motion graphics, editing style, production elements, visual effects, overlays, and any notable technical choices",
  "keywords": ["5-7 descriptive tags covering: visual style, mood, technique, genre, energy, composition, and distinctive elements"]
}

RESPONSE RULES:
- Output ONLY the JSON object
- Start response with { and end with }
- No markdown code blocks, no \`\`\`json
- Keep description detailed (3-4 sentences) but under 500 characters
- Keep technicalDetails comprehensive but under 400 characters
- All other fields follow the format specified above
- Ensure valid JSON syntax with proper quotes and commas`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Video,
          mimeType: 'video/mp4'
        }
      },
      prompt
    ]);

    const response = await result.response.text();
    console.log('   ✅ Gemini response received');
    console.log(`   Response length: ${response.length} characters`);
    
    // Try to extract JSON from response
    let jsonText = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    }
    
    // Find JSON object in response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in Gemini response');
      console.error('Full response:', response);
      throw new Error('Failed to parse Gemini response as JSON');
    }
    
    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('Attempted to parse:', jsonMatch[0].substring(0, 500));
      throw new Error('Failed to parse Gemini response as JSON');
    }
    
    // Validate required fields
    const requiredFields = ['description', 'mood', 'visualStyle', 'pace', 'colorScheme', 'keywords'];
    for (const field of requiredFields) {
      if (!analysis[field]) {
        throw new Error(`Missing required field in analysis: ${field}`);
      }
    }
    
    // Set defaults for optional fields
    analysis.hasText = analysis.hasText || false;
    analysis.hasPerson = analysis.hasPerson || false;
    analysis.musicType = analysis.musicType || 'none';
    analysis.transitionCount = analysis.transitionCount || 0;
    analysis.technicalDetails = analysis.technicalDetails || 'No special effects detected';

    console.log('   ✅ Analysis parsed successfully');
    console.log(`   📊 Mood: ${analysis.mood} | Style: ${analysis.visualStyle} | Pace: ${analysis.pace}`);
    console.log(`   🏷️  Tags: ${analysis.keywords.join(', ')}`);
    
    return analysis;
    
  } catch (error) {
    console.error('❌ Gemini analysis error:', error);
    
    if (error.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error.message.includes('API key')) {
      throw new Error('Invalid Gemini API key');
    } else {
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }
}

/**
 * Test Gemini API connection
 * @returns {Promise<boolean>}
 */
async function testGeminiConnection() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const result = await model.generateContent('Hello, are you working?');
    const response = await result.response.text();
    console.log('✅ Gemini API connection successful (gemini-2.5-pro)');
    return true;
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error.message);
    return false;
  }
}

module.exports = {
  analyzeIntroVideo,
  testGeminiConnection
};
