/**
 * Server Entry Point - Simplified Version
 */

const app = require('./app');
const { initDatabase } = require('./config/database');
const { startCleanupSchedule } = require('./services/cleanupService');
const { checkYtDlpInstalled } = require('./services/videoDownloader');
const { testGeminiConnection } = require('./services/geminiAnalyzer');

const PORT = process.env.PORT || 3000;

/**
 * Perform startup checks
 */
async function performStartupChecks() {
  console.log('\n🔍 Performing startup checks...\n');
  
  // Initialize database
  try {
    await initDatabase();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
  
  // Check yt-dlp installation
  const ytDlpInstalled = await checkYtDlpInstalled();
  if (!ytDlpInstalled) {
    console.error('❌ yt-dlp is required but not installed');
    console.error('   Install with: pip install yt-dlp');
    console.error('   Or: brew install yt-dlp (macOS)');
    console.error('   Continuing anyway - intro processing will fail until installed');
  } else {
    console.log('✅ yt-dlp is installed');
  }
  
  // Check Gemini API
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.error('   Please add it to your .env file');
    console.error('   Get it from: https://makersuite.google.com/app/apikey');
    console.error('   Continuing anyway - intro analysis will fail until added');
  } else {
    const geminiWorking = await testGeminiConnection();
    if (!geminiWorking) {
      console.error('⚠️  Gemini API connection failed');
      console.error('   Check your GEMINI_API_KEY in .env file');
      console.error('   Continuing anyway - intro analysis will fail');
    } else {
      console.log('✅ Gemini API connected');
    }
  }
  
  console.log('\n✅ Server ready to start!\n');
}

/**
 * Start server
 */
async function startServer() {
  try {
    // Perform checks
    await performStartupChecks();
    
    // Start cleanup schedule
    startCleanupSchedule(5); // Clean temp folder every 5 minutes
    
    // Start server
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════════════════');
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('═══════════════════════════════════════════════════');
      console.log('\nAPI Endpoints:');
      console.log(`  POST   http://localhost:${PORT}/api/intros`);
      console.log(`  GET    http://localhost:${PORT}/api/intros`);
      console.log(`  GET    http://localhost:${PORT}/api/intros/:id`);
      console.log(`  GET    http://localhost:${PORT}/api/stats`);
      console.log(`  POST   http://localhost:${PORT}/api/search`);
      console.log(`  GET    http://localhost:${PORT}/health`);
      console.log('═══════════════════════════════════════════════════\n');
      console.log('💡 Add your Gemini API key to backend/.env to enable AI analysis\n');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
