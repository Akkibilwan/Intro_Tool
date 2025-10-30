#!/bin/bash

# Test the new download approach
echo "🧪 Testing new download method..."
echo ""

cd "/Users/ankushchaudhary/Desktop/Intro Tool/backend/temp"

# Clean up any old test files
rm -f test_*.mp4 2>/dev/null

echo "Step 1: Downloading full video (this will take 30-90 seconds)..."
yt-dlp --no-playlist -o "test_full.mp4" "https://www.youtube.com/watch?v=jNQXAC9IVRw"

if [ -f "test_full.mp4" ]; then
  echo "✅ Download successful!"
  ls -lh test_full.mp4
  
  echo ""
  echo "Step 2: Extracting 10-second intro with ffmpeg..."
  ffmpeg -i "test_full.mp4" -ss 0 -t 10 -c copy -avoid_negative_ts make_zero -y "test_intro.mp4" 2>&1 | grep -E "Duration|Output"
  
  if [ -f "test_intro.mp4" ]; then
    echo "✅ Extraction successful!"
    ls -lh test_intro.mp4
    
    echo ""
    echo "Step 3: Cleaning up..."
    rm -f test_full.mp4
    
    echo ""
    echo "🎉 SUCCESS! The new method works!"
    echo "You can now try saving an intro via the extension."
    echo ""
    echo "Cleanup: Removing test file..."
    rm -f test_intro.mp4
  else
    echo "❌ Extraction failed"
    rm -f test_full.mp4
  fi
else
  echo "❌ Download failed"
fi

