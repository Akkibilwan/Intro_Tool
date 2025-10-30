/**
 * Visual Direction Generator Service
 * Uses Gemini AI to generate comprehensive video direction
 */

const { getModel } = require('../config/gemini');

/**
 * Generate Visual Direction from selected intros
 * @param {Array} selectedIntros - Array of 3 intro objects
 * @param {string} userDescription - User's description of their needs
 * @param {Object} preferences - User preferences (duration, includeText, includePerson)
 * @returns {Promise<Object>} Generated Visual Direction
 */
async function generateVisualDirection(selectedIntros, userDescription, preferences = {}) {
  try {
    console.log(`\n🎬 Generating Visual Direction...`);
    console.log(`   User Description: "${userDescription}"`);
    console.log(`   Selected Intros: ${selectedIntros.length}`);
    console.log(`   Preferences:`, preferences);
    
    const model = getModel('gemini-2.5-pro');
    
    // Build comprehensive prompt
    const prompt = `You are a professional film director and motion graphics designer specializing in video intro creation.

USER'S REQUEST:
"${userDescription}"

USER PREFERENCES:
- Target Duration: ${preferences.duration || 15} seconds
- Include Text: ${preferences.includeText !== false}
- Include Person: ${preferences.includePerson === true}

REFERENCE INTROS (Selected by User):
${selectedIntros.map((intro, i) => `
INTRO ${i + 1}: "${intro.videoTitle}" by ${intro.channelName}
- Category: ${intro.userCategory}
- Duration: ${intro.duration}s
- AI Description: ${intro.aiDescription}
- Mood: ${intro.mood}
- Visual Style: ${intro.visualStyle}
- Pace: ${intro.pace}
- Color Scheme: ${intro.colorScheme}
- Has Text: ${intro.hasText}
- Has Person: ${intro.hasPerson}
- Music Type: ${intro.hasMusic ? 'Present' : 'None'}
- Transition Count: ${intro.transitionCount}
- AI Tags: ${intro.aiTags ? intro.aiTags.join(', ') : 'N/A'}
`).join('\n')}

YOUR TASK:
Create a comprehensive Visual Direction (VD) document for a custom intro that:
1. Combines the best elements from the 3 reference intros
2. Aligns with the user's description and preferences
3. Provides actionable, specific direction for a video editor/director

Return ONLY valid JSON in this EXACT structure:
{
  "title": "Brief catchy title for this visual direction",
  "overviewSummary": "2-3 sentence overview of the intro concept",
  "sections": [
    {
      "timecode": "0:00 - 0:XX",
      "description": "What happens in this section - be specific",
      "visualStyle": "How it looks - describe colors, composition, mood",
      "cameraWork": "Camera techniques - angles, movements, framing",
      "effects": "VFX/editing effects - transitions, graphics, overlays"
    }
  ],
  "cinematography": {
    "shotTypes": ["list of 3-5 specific shot types"],
    "cameraMovements": ["list of 2-4 camera movements"],
    "lighting": "detailed lighting description",
    "colorGrading": "detailed color grading approach"
  },
  "editing": {
    "pace": "detailed pace description",
    "transitions": "specific transition types and when to use them",
    "rhythm": "rhythmic structure and timing",
    "cuts": estimated_number_of_cuts
  },
  "motionGraphics": {
    "textStyle": "typography style description",
    "animations": "animation approach and techniques",
    "graphicElements": ["list of 3-5 graphic elements"],
    "typography": "text element count and treatment"
  },
  "audioSuggestions": {
    "musicType": "specific genre/style recommendation",
    "soundDesign": "sound effects and audio elements",
    "tempo": "BPM range or tempo description",
    "structure": "audio structure breakdown"
  },
  "inspirationBreakdown": {
    "fromIntro1": "specific elements borrowed from first intro",
    "fromIntro2": "specific elements borrowed from second intro",
    "fromIntro3": "specific elements borrowed from third intro"
  },
  "productionNotes": {
    "estimatedComplexity": "Low/Medium/Medium-High/High",
    "recommendedTools": ["list of 2-4 software tools"],
    "shootingRequirements": "what needs to be filmed or captured",
    "timeEstimate": "realistic production time estimate"
  },
  "keywords": ["5-7 descriptive tags for this visual direction"]
}

CRITICAL RULES:
- Return ONLY the JSON object
- No markdown code blocks (\`\`\`json), no explanations, no prose
- Start with { and end with }
- Be specific and actionable - avoid generic advice
- Make the sections timeline coherent (add up to target duration)
- Ensure all object properties are properly quoted
- Use proper JSON syntax throughout`;

    console.log('   Sending to Gemini 2.5 Pro...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    console.log('   ✅ Gemini response received');
    console.log(`   Response length: ${response.length} characters`);
    
    // Parse and validate JSON
    let jsonText = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    }
    
    // Extract JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in Gemini response');
      console.error('Response preview:', response.substring(0, 500));
      throw new Error('Failed to parse Visual Direction from Gemini - no JSON found');
    }
    
    let vd;
    try {
      vd = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError.message);
      console.error('Attempted to parse:', jsonMatch[0].substring(0, 500));
      throw new Error('Failed to parse Visual Direction JSON: ' + parseError.message);
    }
    
    // Validate required fields
    const requiredFields = ['title', 'overviewSummary', 'sections', 'cinematography', 'editing'];
    for (const field of requiredFields) {
      if (!vd[field]) {
        throw new Error(`Missing required field in Visual Direction: ${field}`);
      }
    }
    
    // Validate sections array
    if (!Array.isArray(vd.sections) || vd.sections.length === 0) {
      throw new Error('Visual Direction must have at least one section');
    }
    
    console.log('   ✅ Visual Direction generated successfully');
    console.log(`   Title: "${vd.title}"`);
    console.log(`   Sections: ${vd.sections.length}`);
    console.log(`   Keywords: ${vd.keywords ? vd.keywords.join(', ') : 'N/A'}\n`);
    
    return vd;
    
  } catch (error) {
    console.error('❌ Visual Direction generation error:', error);
    
    if (error.message && error.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error.message && error.message.includes('API key')) {
      throw new Error('Invalid Gemini API key');
    } else {
      throw new Error(`Visual Direction generation failed: ${error.message}`);
    }
  }
}

/**
 * Test VD generation with sample data
 */
async function testVDGeneration() {
  try {
    const sampleIntros = [
      {
        videoTitle: "Sample Video 1",
        channelName: "Test Channel",
        userCategory: "Tech",
        duration: 30,
        aiDescription: "Fast-paced tech intro with motion graphics",
        mood: "Energetic",
        visualStyle: "Modern",
        pace: "fast",
        colorScheme: "Blue and white",
        hasText: true,
        hasPerson: false,
        hasMusic: true,
        transitionCount: 15,
        aiTags: ["tech", "modern", "fast"]
      }
    ];
    
    const userDescription = "I want a tech review intro that's modern and energetic";
    const preferences = { duration: 15, includeText: true, includePerson: false };
    
    const vd = await generateVisualDirection(sampleIntros, userDescription, preferences);
    console.log('✅ Test VD generation successful');
    return vd;
  } catch (error) {
    console.error('❌ Test VD generation failed:', error);
    throw error;
  }
}

module.exports = {
  generateVisualDirection,
  testVDGeneration
};

