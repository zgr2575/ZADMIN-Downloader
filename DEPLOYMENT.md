# Deployment Guide

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

#### 2. Render
- Create a new Web Service
- Connect your GitHub repository
- Set build command: `npm install && npm run build`
- Set start command: `npm start`

#### 3. DigitalOcean App Platform
- Import from GitHub
- Select Node.js
- Configure build and run commands

#### 4. Self-hosted (VPS)
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
