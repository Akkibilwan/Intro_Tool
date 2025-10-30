/**
 * Cleanup Service
 * Manages temporary video file deletion
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Delete a specific video file
 * @param {string} filePath - Path to file to delete
 */
async function deleteVideoFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`🗑️  Deleted: ${path.basename(filePath)}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Failed to delete ${filePath}:`, error.message);
    }
  }
}

/**
 * Clean old temp files (files older than maxAge)
 * @param {number} maxAge - Maximum age in milliseconds (default: 10 minutes)
 */
async function cleanupTempFolder(maxAge = 10 * 60 * 1000) {
  const tempDir = path.join(__dirname, '../../temp');
  
  try {
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });
    
    const files = await fs.readdir(tempDir);
    const now = Date.now();
    let deletedCount = 0;
    
    for (const file of files) {
      // Skip .gitkeep or other hidden files
      if (file.startsWith('.')) continue;
      
      const filePath = path.join(tempDir, file);
      
      try {
        const stats = await fs.stat(filePath);
        
        // Delete if older than maxAge
        if (now - stats.mtimeMs > maxAge) {
          await deleteVideoFile(filePath);
          deletedCount++;
        }
      } catch (error) {
        console.error(`Error checking file ${file}:`, error.message);
      }
    }
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleanup complete: Removed ${deletedCount} old file(s)`);
    }
  } catch (error) {
    console.error('❌ Cleanup error:', error.message);
  }
}

/**
 * Start automatic cleanup interval
 * @param {number} intervalMinutes - How often to run cleanup (default: 5 minutes)
 */
function startCleanupSchedule(intervalMinutes = 5) {
  const intervalMs = intervalMinutes * 60 * 1000;
  
  console.log(`🕐 Starting cleanup schedule: every ${intervalMinutes} minutes`);
  
  // Run immediately on startup
  cleanupTempFolder();
  
  // Then run on interval
  setInterval(() => {
    cleanupTempFolder();
  }, intervalMs);
}

module.exports = {
  deleteVideoFile,
  cleanupTempFolder,
  startCleanupSchedule
};

