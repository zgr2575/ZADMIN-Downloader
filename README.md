# ZADMIN Video Downloader 🎥

Advanced video downloader application built with Next.js, Material-UI, and yt-dlp. Download videos from YouTube and 1000+ platforms in any quality.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Material--UI](https://img.shields.io/badge/Material--UI-7-007FFF)
![yt-dlp](https://img.shields.io/badge/yt--dlp-latest-red)

## 🚀 Features

- **Multi-Platform Support**: Download from YouTube, Vimeo, TikTok, Facebook, Instagram, Twitter, and 1000+ more
- **Quality Selection**: Choose from 144p to 8K quality options
- **Multiple Formats**: MP4, WebM, MKV, M4A, and more
- **Audio Extraction**: Download audio-only in high quality
- **Modern UI**: Professional Material Design interface with MUI components
- **Private Download Links**: Files are stored on our server with unique 24-hour links
- **Direct Downloads**: Download files directly from our site, no third-party redirects
- **Auto-Cleanup**: Expired files are automatically removed after 24 hours
- **SEO Optimized**: Comprehensive meta tags and structured data

## 📋 Prerequisites

Before running this application, you need to install:

1. **Node.js** (v18 or higher)
2. **yt-dlp** - The video downloader binary

### Installing yt-dlp

#### On Linux/macOS:
```bash
# Option 1: Using the provided script
chmod +x scripts/install-ytdlp.sh
sudo ./scripts/install-ytdlp.sh

# Option 2: Manual installation with curl
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Option 3: Using pip
pip install -U yt-dlp

# Option 4: Using Homebrew (macOS)
brew install yt-dlp
```

#### On Windows:
```powershell
# Option 1: Using the provided script (Run PowerShell as Administrator)
.\scripts\install-ytdlp.ps1

# Option 2: Using winget
winget install yt-dlp

# Option 3: Using scoop
scoop install yt-dlp
```

### Verify Installation
```bash
yt-dlp --version
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/zgr2575/ZADMIN-Downloader.git
cd ZADMIN-Downloader
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the production server:
```bash
npm start
```

Or run in development mode:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🌐 Deployment

### ⚠️ Vercel Not Supported

**Vercel deployment is NOT recommended** due to serverless limitations:

**❌ Why Vercel Doesn't Work:**
- Cannot run yt-dlp binary in serverless environment  
- No persistent file storage for 24-hour download links
- ytdl-core library fallback is unreliable and frequently breaks (Status 410 errors)
- Bot detection issues with YouTube
-no access to 1000+ supported platforms

**✅ For full functionality, deploy to a VPS, Railway, or Render instead.**

### For Production (Self-Hosted/VPS) - **RECOMMENDED**

1. **Install yt-dlp** on your server (see instructions above)

2. **Deploy the application**:
```bash
git clone https://github.com/zgr2575/ZADMIN-Downloader.git
cd ZADMIN-Downloader
npm install
npm run build
npm start
```

3. **Using PM2** (recommended for production):
```bash
npm install -g pm2
pm2 start npm --name "zadmin-downloader" -- start
pm2 save
pm2 startup
```

## 📁 Project Structure

```
ZADMIN-Downloader/
├── app/
│   ├── api/
│   │   ├── info/          # Video info endpoint
│   │   ├── download/      # Download endpoint  
│   │   ├── file/[id]/     # File serving endpoint
│   │   └── cleanup/       # Cleanup expired files
│   ├── layout.tsx         # Root layout with SEO
│   └── page.tsx           # Home page
├── components/
│   ├── VideoDownloader.tsx # Main UI component
│   ├── Features.tsx       # Features section
│   ├── HowToUse.tsx       # Usage guide
│   └── FAQ.tsx            # FAQ section
├── lib/
│   ├── ytdlp.ts           # yt-dlp integration
│   └── gofile.ts          # Gofile API utilities
├── scripts/
│   ├── install-ytdlp.sh   # Linux/macOS installer
│   └── install-ytdlp.ps1  # Windows installer
└── tmp/
    └── downloads/         # Stored downloads (auto-cleanup after 24h)
```

## 🎯 Usage

1. **Paste a video URL** from YouTube or any supported platform
2. **Click "Get Video Information"** to fetch video details and available formats
3. **Select your preferred format** and quality
4. **Click "Start Download"** to process the video
5. **Get your private download link** - valid for 24 hours and can be reused within that period
6. **Download directly from our site** - no third-party redirects

## 🔧 Configuration

### Automatic Cleanup (Recommended)

To automatically clean up expired files, set up a cron job:

**Linux/macOS:**
```bash
# Add to crontab (runs cleanup every hour)
crontab -e

# Add this line:
0 * * * * curl http://localhost:3000/api/cleanup
```

**Or using a systemd timer:**
```bash
# Create /etc/systemd/system/zadmin-cleanup.service
[Unit]
Description=ZADMIN Downloader Cleanup

[Service]
Type=oneshot
ExecStart=/usr/bin/curl http://localhost:3000/api/cleanup

# Create /etc/systemd/system/zadmin-cleanup.timer
[Unit]
Description=Run ZADMIN cleanup hourly

[Timer]
OnBootSec=5min
OnUnitActiveSec=1h

[Install]
WantedBy=timers.target

# Enable and start
sudo systemctl enable --now zadmin-cleanup.timer
```

### Environment Variables (Optional)

Create a `.env.local` file:
```env
# Optional: Set custom cleanup schedule
CLEANUP_ENABLED=true
```

## 🐛 Troubleshooting

### "yt-dlp: command not found"
- Make sure yt-dlp is installed and in your PATH
- Run `yt-dlp --version` to verify installation

### Download fails
- Ensure you have write permissions in the `tmp/downloads` directory
- Check that yt-dlp can access the video URL
- Some videos may be region-locked or require authentication

### "Download link not found or has expired"
- Links expire after 24 hours for security
- Download the video again to generate a new link
- Ensure the cleanup cron job isn't running too frequently

### Running out of disk space
- Set up the automatic cleanup cron job (see Configuration)
- Manually run cleanup: `curl http://localhost:3000/api/cleanup`
- Check `tmp/downloads/` directory size

## 📝 License

ISC License - See [LICENSE](LICENSE) for details

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

## 📚 Documentation

- [API Documentation](API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)

## ⚡ Technologies

- **Next.js 15** - React framework
- **Material-UI v7** - Component library
- **TypeScript** - Type safety
- **yt-dlp** - Video downloader
- **Node.js File System** - Direct file serving

## 🌟 Supported Platforms

YouTube, Vimeo, TikTok, Facebook, Instagram, Twitter/X, Reddit, Dailymotion, Twitch, SoundCloud, and [1000+ more platforms](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)

---

**Built with ❤️ using Next.js, Material-UI, and yt-dlp**
