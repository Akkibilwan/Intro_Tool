/**
 * Search Controller
 * Handles search requests
 */

const Intro = require('../models/Intro');

/**
 * Search intros based on user query
 * POST /api/search
 */
async function searchIntros(req, res, next) {
  try {
    const { query, category, mood, limit = 10 } = req.body;
    
    // Validate query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    console.log(`🔍 Searching for: "${query}"`);
    if (category) console.log(`   Category filter: ${category}`);
    if (mood) console.log(`   Mood filter: ${mood}`);
    
    // Perform search
    const results = await Intro.search(query, {
      category,
      mood,
      limit: parseInt(limit)
    });
    
    // Format results with match scores
    const formattedResults = results.map(intro => ({
      id: intro.id,
      videoUrl: intro.video_url,
      videoId: intro.video_id,
      thumbnailUrl: intro.thumbnail_url,
      channelName: intro.channel_name,
      videoTitle: intro.video_title,
      startTime: intro.start_time,
      endTime: intro.end_time,
      duration: intro.duration,
      category: intro.user_category,
      aiDescription: intro.ai_description,
      aiTags: intro.ai_tags,
      mood: intro.mood,
      visualStyle: intro.visual_style,
      pace: intro.pace,
      colorScheme: intro.color_scheme,
      hasText: intro.has_text,
      hasPerson: intro.has_person,
      hasMusic: intro.has_music,
      transitionCount: intro.transition_count,
      matchScore: parseFloat(intro.rank).toFixed(2),
      createdAt: intro.created_at
    }));
    
    console.log(`✅ Found ${formattedResults.length} results`);
    
    res.json({
      success: true,
      query,
      count: formattedResults.length,
      results: formattedResults
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  searchIntros
};

