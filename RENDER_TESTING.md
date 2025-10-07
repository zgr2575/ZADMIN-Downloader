# Render Deployment Testing Guide

This document helps verify that the Render deployment works correctly.

## What Was Fixed

The issue was that yt-dlp wasn't automatically installing on Render. This was fixed by:

1. **Created `render.yaml`**: Automatic configuration file that Render detects
2. **Created `scripts/render-build.sh`**: Custom build script that:
   - Installs yt-dlp via pip (Python package manager)
   - Builds the Next.js application
   - Verifies installation
3. **Updated build command**: Uses `npm install --ignore-scripts` to skip the problematic postinstall script that downloads yt-dlp binary (which was hanging)
4. **Updated documentation**: Added comprehensive Render deployment instructions

## How It Works

### The Build Process

1. Render detects `render.yaml` in the repository root
2. Runs: `npm install --ignore-scripts` - Installs Node.js dependencies without running postinstall
3. Runs: `chmod +x ./scripts/render-build.sh` - Makes build script executable
4. Runs: `./scripts/render-build.sh` which:
   - Installs yt-dlp using `pip3 install --user yt-dlp`
   - Verifies yt-dlp is installed and working
   - Runs `npm run build` to build the Next.js app
5. Starts the app with: `npm start`

### Why This Solution Works

- **Render provides Python by default**: No need to install Python separately
- **pip installation is reliable**: Unlike downloading binaries which can hang
- **--ignore-scripts flag**: Prevents the problematic postinstall script from running
- **--user flag for pip**: Installs yt-dlp in user space (no root required)

## Testing Checklist

### Pre-Deployment
- [x] `render.yaml` exists and is properly formatted
- [x] `scripts/render-build.sh` exists and is executable
- [x] Build script installs yt-dlp via pip
- [x] Build script runs `npm run build`
- [x] Documentation updated in DEPLOYMENT.md and README.md

### Local Testing (Simulating Render Build)
- [x] `npm install --ignore-scripts` completes without hanging
- [x] `./scripts/render-build.sh` successfully installs yt-dlp
- [x] `./scripts/render-build.sh` successfully builds the Next.js app
- [x] `yt-dlp --version` shows version number
- [x] Build creates `.next/` directory with all required files

### On Render (Manual Testing)
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Render detects `render.yaml`
- [ ] Build logs show "Installing yt-dlp via pip..."
- [ ] Build logs show "yt-dlp installed successfully: [version]"
- [ ] Build logs show Next.js build completing
- [ ] Deployment succeeds
- [ ] App is accessible at Render URL
- [ ] Video download functionality works

## Expected Build Output

You should see output similar to:
```
==> Installing dependencies
==> npm install --ignore-scripts
added 412 packages in 13s

==> Running build command
Installing yt-dlp via pip...
Requirement already satisfied: yt-dlp in /opt/render/.local/lib/python3.X/site-packages (2025.X.XX)
yt-dlp installed successfully: 2025.X.XX
Building Next.js application...
▲ Next.js 15.5.4
Creating an optimized production build ...
✓ Compiled successfully
...
Build complete!
```

## Troubleshooting

### Build fails during npm install
- Check if `--ignore-scripts` flag is present in render.yaml
- Verify package.json is valid JSON

### yt-dlp installation fails
- Check build logs for pip errors
- Verify Python is available (should be by default on Render)
- Try manual installation in Render shell

### Build succeeds but app doesn't work
- Check start command is `npm start`
- Verify environment variables if any are set
- Check runtime logs for errors

## Files Changed

- `render.yaml` - New file (Render configuration)
- `scripts/render-build.sh` - New file (Build script for Render)
- `DEPLOYMENT.md` - Updated with Render instructions
- `README.md` - Updated to recommend Render and document new files

## Migration Notes

If you previously deployed to Render manually:
1. Delete the existing service
2. Create a new Web Service
3. Let Render auto-detect the `render.yaml`
4. Deploy

Or update your existing service:
1. Go to service settings
2. Update build command to: `npm install --ignore-scripts && chmod +x ./scripts/render-build.sh && ./scripts/render-build.sh`
3. Update start command to: `npm start`
4. Trigger a manual deploy
