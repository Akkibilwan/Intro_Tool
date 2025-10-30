/**
 * Intro Controller - FULL VERSION with AI Analysis
 * Handles intro-related requests with complete video processing pipeline
 */

const { downloadIntroClip } = require('../services/videoDownloader');
const { analyzeIntroVideo } = require('../services/geminiAnalyzer');
const { deleteVideoFile } = require('../services/cleanupService');
const Intro = require('../models/Intro');

/**
 * Extract YouTube video ID from URL
 */
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
    /youtube\.com\/v\/([^&\s]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Create a new intro with FULL AI ANALYSIS
 * POST /api/intros
 */
async function createIntro(req, res, next) {
  let videoPath = null;
  
  try {
    const {
      videoUrl,
      startTime,
      endTime,
      category,
      channelName,
      videoTitle,
      thumbnailUrl
    } = req.body;
    
    // Validate required fields
    if (!videoUrl || startTime === undefined || endTime === undefined || !category || !channelName || !videoTitle) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Extract video ID
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }
    
    // Validate time range
    const duration = endTime - startTime;
    if (duration <= 0) {
      return res.status(400).json({
        success: false,
        message: 'End time must be greater than start time'
      });
    }
    
    if (duration > 60) {
      return res.status(400).json({
        success: false,
        message: 'Intro duration cannot exceed 60 seconds'
      });
    }
    
    const startTime_total = Date.now();
    
    console.log(`\n${'█'.repeat(70)}`);
    console.log(`📝 NEW INTRO SUBMISSION`);
    console.log(`   Video: ${videoTitle}`);
    console.log(`   Channel: ${channelName}`);
    console.log(`   Duration: ${duration}s (${startTime}s - ${endTime}s)`);
    console.log(`   Category: ${category}`);
    console.log(`${'█'.repeat(70)}\n`);
    
    // STEP 1: Download video clip
    console.log('⏬ STEP 1/3: DOWNLOADING VIDEO CLIP');
    const downloadStart = Date.now();
    videoPath = await downloadIntroClip(videoUrl, startTime, endTime, videoId);
    const downloadTime = ((Date.now() - downloadStart) / 1000).toFixed(1);
    console.log(`✅ Downloaded successfully in ${downloadTime}s\n`);
    
    // STEP 2: Analyze with Gemini AI
    console.log('🤖 STEP 2/3: AI ANALYSIS WITH GEMINI 2.5 PRO');
    const analysisStart = Date.now();
    const aiAnalysis = await analyzeIntroVideo(videoPath);
    const analysisTime = ((Date.now() - analysisStart) / 1000).toFixed(1);
    console.log(`✅ AI Analysis complete in ${analysisTime}s\n`);
    
    // STEP 3: Save to database
    console.log('💾 STEP 3/3: Saving to database...');
    const intro = await Intro.create({
      videoUrl,
      videoId,
      startTime,
      endTime,
      duration,
      thumbnailUrl: thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      channelName,
      videoTitle,
      userCategory: category,
      aiDescription: aiAnalysis.description,
      aiTags: aiAnalysis.keywords,
      mood: aiAnalysis.mood,
      visualStyle: aiAnalysis.visualStyle,
      pace: aiAnalysis.pace,
      colorScheme: aiAnalysis.colorScheme,
      hasText: aiAnalysis.hasText,
      hasPerson: aiAnalysis.hasPerson,
      hasMusic: aiAnalysis.musicType !== 'none',
      transitionCount: aiAnalysis.transitionCount
    });
    
    // STEP 4: Cleanup
    console.log('🗑️  Cleaning up temporary files...');
    await deleteVideoFile(videoPath);
    
    const totalTime = ((Date.now() - startTime_total) / 1000).toFixed(1);
    console.log(`\n${'█'.repeat(70)}`);
    console.log(`✅ INTRO SAVED SUCCESSFULLY!`);
    console.log(`   Intro ID: ${intro.id}`);
    console.log(`   Mood: ${intro.mood} | Style: ${intro.visualStyle} | Pace: ${intro.pace}`);
    console.log(`   Download: ${downloadTime}s | Analysis: ${analysisTime}s | Total: ${totalTime}s`);
    console.log(`${'█'.repeat(70)}\n`);
    
    res.status(201).json({
      success: true,
      message: 'Intro processed successfully with AI analysis',
      data: intro
    });
    
  } catch (error) {
    console.error('\n❌ ❌ ❌ ERROR PROCESSING INTRO:', error.message);
    console.error(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    // Cleanup on error
    if (videoPath) {
      await deleteVideoFile(videoPath);
    }
    
    next(error);
  }
}

/**
 * Get all intros with pagination
 * GET /api/intros
 */
async function getAllIntros(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      mood,
      sortBy = 'created_at'
    } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      mood,
      sortBy
    };
    
    const [intros, total] = await Promise.all([
      Intro.findAll(options),
      Intro.count({ category, mood })
    ]);
    
    res.json({
      success: true,
      data: intros,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Get single intro by ID
 * GET /api/intros/:id
 */
async function getIntroById(req, res, next) {
  try {
    const { id } = req.params;
    
    const intro = await Intro.findById(id);
    
    if (!intro) {
      return res.status(404).json({
        success: false,
        message: 'Intro not found'
      });
    }
    
    res.json({
      success: true,
      data: intro
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an intro by ID
 * DELETE /api/intros/:id
 */
async function deleteIntro(req, res, next) {
  try {
    const { id } = req.params;
    
    console.log(`🗑️  Deleting intro: ${id}`);
    
    const deleted = await Intro.deleteById(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Intro not found'
      });
    }
    
    console.log(`✅ Intro deleted successfully: ${id}`);
    
    res.json({
      success: true,
      message: 'Intro deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting intro:', error);
    next(error);
  }
}

module.exports = {
  createIntro,
  getAllIntros,
  getIntroById,
  deleteIntro
};
