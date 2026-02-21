# Troubleshooting Chunk Loading Errors

## Common Issue: ChunkLoadError
If you see `Loading chunk app/layout failed` or similar chunk loading errors, follow these steps:

## Quick Fix (Most Common)

### Option 1: Clean Restart
```bash
cd tax-frontend
npm run dev:clean
```

### Option 2: Manual Clean
```bash
cd tax-frontend
# Clear Next.js cache
rm -rf .next

# Clear node modules cache (optional)
rm -rf node_modules/.cache

# Restart dev server
npm run dev
```

### Option 3: Hard Browser Refresh
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or open DevTools → Network tab → Check "Disable cache"

## If Issue Persists

### 1. Full Clean Install
```bash
cd tax-frontend
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### 2. Check Port Conflicts
Make sure port 3000 is not being used by another process:
```bash
# Windows
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <process_id> /F
```

### 3. Clear Browser Data
- Open browser settings
- Clear all cached images and files
- Close all browser tabs
- Restart browser

## Prevention

### Optimizations Applied
We've added the following to prevent chunk loading issues:

1. **Webpack Configuration** (`next.config.mjs`):
   - Optimized chunk splitting for PDF libraries
   - Separate chunks for large dependencies (jspdf, html2canvas, jszip)
   - Better caching strategy

2. **Logo Loading** (`BatchReportGenerator.jsx`):
   - 5-second timeout for image loading
   - Graceful fallback if logo fails to load
   - Browser cache utilization

3. **Helper Scripts** (`package.json`):
   - `npm run clean` - Clear Next.js cache (Unix/Mac)
   - `npm run clean:win` - Clear Next.js cache (Windows)
   - `npm run dev:clean` - Clean and start dev server

## Root Causes

Chunk loading errors typically occur due to:
1. **Stale Build Cache**: `.next` folder contains outdated chunks
2. **Browser Cache**: Browser cached old chunk references
3. **Large Files**: Files over 50KB can cause timeout issues
4. **Network Issues**: Slow connection or timeout during chunk load
5. **Hot Module Replacement**: Dev server didn't properly reload after changes

## When to Use Each Fix

- **After code changes**: Use `npm run dev:clean`
- **Random occurrence**: Hard refresh browser (`Ctrl + Shift + R`)
- **Persistent issues**: Full clean install
- **After pulling updates**: Clear `.next` and restart

## Monitoring

If chunk errors continue:
1. Check browser console for specific chunk names
2. Look for network errors in DevTools
3. Check if specific routes/pages are affected
4. Monitor file sizes in `_next/static/chunks/`

## Contact

If none of these solutions work, the issue might be:
- Network/firewall blocking chunk downloads
- Antivirus interfering with file access
- Disk space issues
- Node.js version incompatibility (use Node 18+)
