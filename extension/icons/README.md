# Extension Icons

Place your extension icons here:

- `icon16.png` (16x16 pixels) - Browser toolbar
- `icon48.png` (48x48 pixels) - Extension management page
- `icon128.png` (128x128 pixels) - Chrome Web Store

## Creating Icons

You can:
1. Use an online icon generator (search "chrome extension icon generator")
2. Design in Figma/Sketch/Illustrator
3. Use a simple blue square with a play icon
4. Hire a designer on Fiverr

## Quick Solution

For development, you can create a simple colored square in any image editor or use this command if you have ImageMagick installed:

```bash
# Create simple blue icons
convert -size 16x16 xc:#3b82f6 icon16.png
convert -size 48x48 xc:#3b82f6 icon48.png
convert -size 128x128 xc:#3b82f6 icon128.png
```

## Design Tips

- Use the brand colors: `#3b82f6` (blue) or `#8b5cf6` (purple)
- Simple, recognizable design works best
- Ensure it looks good on both light and dark backgrounds
- Consider using a play button or video-related icon
- Match your web app's branding

