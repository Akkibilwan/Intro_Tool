/**
 * Video Downloader Service
 * Downloads YouTube video clips using yt-dlp
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');

const execPromise = promisify(exec);

/**
 * Download a specific section of a YouTube video
 * @param {string} videoUrl - YouTube video URL
 * @param {number} startTime - Start time in seconds
 * @param {number} endTime - End time in seconds
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} Path to downloaded video file
 */
async function downloadIntroClip(videoUrl, startTime, endTime, videoId) {
  const tempDir = path.join(__dirname, '../../temp');
  const timestamp = Date.now();
  const outputPath = path.join(tempDir, `${videoId}_${timestamp}.mp4`);
  const duration = endTime - startTime;
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📥 DOWNLOADING VIDEO: ${videoId}`);
    console.log(`   Time Range: ${startTime}s - ${endTime}s (${duration}s duration)`);
    console.log(`${'='.repeat(60)}\n`);
    
    // STRATEGY 1: Format 18 (360p MP4) - Most reliable, always available
    try {
      console.log('🎯 STRATEGY 1: Format 18 (360p MP4) - Most Compatible');
      const tempFullPath = path.join(tempDir, `${videoId}_${timestamp}_f18.mp4`);
      
      console.log('   Downloading format 18...');
      const downloadCmd = `yt-dlp --no-playlist --no-check-certificate -f 18 -o "${tempFullPath}" "${videoUrl}" 2>&1`;
      
      await execPromise(downloadCmd, {
        timeout: 120000, // 2 minutes
        maxBuffer: 50 * 1024 * 1024
      });
      
      console.log('   Extracting section with ffmpeg...');
      const extractCmd = `ffmpeg -ss ${startTime} -i "${tempFullPath}" -t ${duration} -c copy -avoid_negative_ts make_zero -y "${outputPath}" 2>&1`;
      
      await execPromise(extractCmd, {
        timeout: 30000,
        maxBuffer: 20 * 1024 * 1024
      });
      
      try { await fs.unlink(tempFullPath); } catch {}
      
      const stats = await fs.stat(outputPath);
      if (stats.size > 1000) {
        console.log(`✅ SUCCESS! Downloaded ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);
        return outputPath;
      }
    } catch (error) {
      console.log(`   ⚠️  Strategy 1 failed: ${error.message.substring(0, 80)}...`);
      try { await fs.unlink(outputPath); } catch {}
    }
    
    // STRATEGY 2: Best video under 480p
    try {
      console.log('\n🎯 STRATEGY 2: Best Quality Under 480p');
      const tempFullPath = path.join(tempDir, `${videoId}_${timestamp}_best.mp4`);
      
      console.log('   Downloading...');
      const downloadCmd = `yt-dlp --no-playlist --no-check-certificate -f "bestvideo[height<=480]+bestaudio/best[height<=480]/18" -o "${tempFullPath}" "${videoUrl}" 2>&1`;
      
      await execPromise(downloadCmd, {
        timeout: 120000,
        maxBuffer: 50 * 1024 * 1024
      });
      
      console.log('   Extracting with ffmpeg...');
      const extractCmd = `ffmpeg -ss ${startTime} -i "${tempFullPath}" -t ${duration} -c:v libx264 -preset ultrafast -crf 28 -c:a aac -b:a 128k -y "${outputPath}" 2>&1`;
      
      await execPromise(extractCmd, {
        timeout: 60000,
        maxBuffer: 30 * 1024 * 1024
      });
      
      try { await fs.unlink(tempFullPath); } catch {}
      
      const stats = await fs.stat(outputPath);
      if (stats.size > 1000) {
        console.log(`✅ SUCCESS! Downloaded ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);
        return outputPath;
      }
    } catch (error) {
      console.log(`   ⚠️  Strategy 2 failed: ${error.message.substring(0, 80)}...`);
      try { await fs.unlink(outputPath); } catch {}
    }
    
    // STRATEGY 3: Worst quality (smallest file)
    try {
      console.log('\n🎯 STRATEGY 3: Worst Quality (Smallest File)');
      const tempFullPath = path.join(tempDir, `${videoId}_${timestamp}_worst.mp4`);
      
      console.log('   Downloading worst quality...');
      const downloadCmd = `yt-dlp --no-playlist --no-check-certificate -f worst -o "${tempFullPath}" "${videoUrl}" 2>&1`;
      
      await execPromise(downloadCmd, {
        timeout: 90000,
        maxBuffer: 50 * 1024 * 1024
      });
      
      console.log('   Extracting...');
      const extractCmd = `ffmpeg -ss ${startTime} -i "${tempFullPath}" -t ${duration} -c copy -y "${outputPath}" 2>&1`;
      
      await execPromise(extractCmd, {
        timeout: 30000,
        maxBuffer: 20 * 1024 * 1024
      });
      
      try { await fs.unlink(tempFullPath); } catch {}
      
      const stats = await fs.stat(outputPath);
      if (stats.size > 1000) {
        console.log(`✅ SUCCESS! Downloaded ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);
        return outputPath;
      }
    } catch (error) {
      console.log(`   ⚠️  Strategy 3 failed: ${error.message.substring(0, 80)}...`);
    }
    
    throw new Error('All download strategies failed. Video may be unavailable or restricted.');
    
  } catch (error) {
    console.error(`\n❌ DOWNLOAD FAILED: ${error.message}\n`);
    
    try { await fs.unlink(outputPath); } catch {}
    
    if (error.message.includes('timeout')) {
      throw new Error('Download timeout - video too large or slow connection');
    } else if (error.message.includes('unavailable')) {
      throw new Error('Video unavailable (private, deleted, or region-blocked)');
    } else if (error.message.includes('Sign in')) {
      throw new Error('Video requires sign-in (age-restricted)');
    } else {
      throw new Error(`Download failed: ${error.message}`);
    }
  }
}

/**
 * Check if yt-dlp is installed
 * @returns {Promise<boolean>}
 */
async function checkYtDlpInstalled() {
  try {
    await execPromise('yt-dlp --version');
    return true;
  } catch (error) {
    console.error('❌ yt-dlp is not installed. Install it with: pip install yt-dlp');
    return false;
  }
}

module.exports = {
  downloadIntroClip,
  checkYtDlpInstalled
};

