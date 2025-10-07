# Deployment Guide

## Quick Start: Recommended Platforms

For the best experience with full yt-dlp functionality, we recommend:

1. **Render** (Easiest) - Includes `render.yaml` for one-click deployment
2. **Railway** - Simple deployment with good Node.js support  
3. **Self-hosted VPS** - Full control and no limitations

**Note**: Vercel is not recommended for production due to serverless limitations with yt-dlp binary execution.

---

## Deploying to Render (Recommended)

Render is the recommended platform for this application because:
- Python is available by default (needed for yt-dlp)
- No serverless limitations
- Simple configuration with `render.yaml`
- Free tier available

### Prerequisites
- A Render account (sign up at https://render.com)
- Your code pushed to GitHub

### Deployment Steps

1. **Push your code to GitHub** (if not already done)

2. **Create a Web Service on Render**:
   - Go to https://dashboard.render.com
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the `zgr2575/ZADMIN-Downloader` repository

3. **Configure the service**:
   - Render will automatically detect the `render.yaml` file
   - Review the configuration and click "Apply"
   - Click "Create Web Service"

4. **Wait for deployment**:
   - Render will automatically install dependencies and yt-dlp
   - The build logs will show the yt-dlp installation
   - Once complete, your app will be live!

### Manual Configuration (if not using render.yaml)

If Render doesn't detect `render.yaml` or you prefer manual setup:
- **Build Command**: `npm install --ignore-scripts && chmod +x ./scripts/render-build.sh && ./scripts/render-build.sh`
- **Start Command**: `npm start`

**Note**: We use `--ignore-scripts` to skip the postinstall script that tries to download yt-dlp binary (which can hang). Instead, the render-build.sh script installs yt-dlp via pip, which is more reliable on Render.

---

## Deploying to Vercel

### Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository with the code

### Step-by-Step Deployment

1. **Install Vercel CLI** (optional, but recommended):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from GitHub**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

4. **Configure Build Settings**:
   Vercel should automatically detect these, but verify:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. **Important: Install yt-dlp**:
   Since Vercel uses serverless functions, you need to ensure yt-dlp is available. Add this to your build process:
   
   Create a file `install-ytdlp.sh`:
   ```bash
   #!/bin/bash
   pip install yt-dlp
   ```

   Update `vercel.json`:
   ```json
   {
     "buildCommand": "chmod +x install-ytdlp.sh && ./install-ytdlp.sh && npm run build"
   }
   ```

### Alternative: Using Docker on Vercel

For better control, you can use a Docker container:

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

# Install Python and yt-dlp
RUN apk add --no-cache python3 py3-pip
RUN pip3 install yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

No environment variables are required for basic functionality. Gofile API works without authentication.

### Post-Deployment

After deployment:
1. Test the demo mode to ensure the UI works
2. Note: Actual downloads may not work on Vercel's free tier due to:
   - Serverless function timeout limits (10s on free tier)
   - File size limits
   - Network restrictions

### Production Recommendations

For production use with actual downloads:
1. **Use a VPS** or dedicated server instead of Vercel
2. **Set up caching** for frequently downloaded videos
3. **Implement rate limiting** to prevent abuse
4. **Add user authentication** for tracking and limits
5. **Use a CDN** for faster downloads

### Alternative Deployment Options

#### 1. Railway
```bash
railway login
railway init
railway up
```

#### 2. DigitalOcean App Platform
- Import from GitHub
- Select Node.js
- Configure build and run commands

#### 3. Self-hosted (VPS)
```bash
# Install Node.js and Python
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs python3 python3-pip

# Install yt-dlp
pip3 install yt-dlp

# Clone and setup
git clone <your-repo>
cd ZADMIN-Downloader
npm install
npm run build

# Run with PM2
npm install -g pm2
pm2 start npm --name "zadmin-downloader" -- start
pm2 startup
pm2 save
```

### Monitoring and Maintenance

1. **Monitor logs**: Use Vercel's built-in logging or set up external monitoring
2. **Update yt-dlp regularly**: `pip install --upgrade yt-dlp`
3. **Monitor API usage**: Track Gofile API calls
4. **Set up error tracking**: Use Sentry or similar service

### Troubleshooting

#### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

#### yt-dlp Not Found
- Ensure Python is installed in the build environment
- Verify yt-dlp installation in build logs
- Check that the binary is in PATH

#### Timeout Errors
- Increase function timeout in Vercel settings (Pro plan required)
- Or deploy to a platform without strict timeout limits

#### CORS Issues
- Add appropriate CORS headers in `next.config.js`
- Use Vercel's built-in CORS handling

### Cost Estimation

**Vercel Free Tier**:
- 100 GB bandwidth
- 100 GB-hours serverless function execution
- Suitable for testing and demo

**Vercel Pro** ($20/mo):
- 1 TB bandwidth
- 1000 GB-hours execution
- 60s function timeout
- Better for production

**Self-hosted VPS** (~$5-20/mo):
- Full control
- No timeout limits
- Best for production use
