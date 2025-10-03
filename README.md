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
- **File Hosting**: Automatic upload to Gofile for easy access
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

### For Development/Demo (Vercel)
⚠️ **Note**: Vercel's serverless environment doesn't support yt-dlp binary. For production use, deploy to a VPS or container-based hosting.

### For Production (Self-Hosted/VPS)

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
│   │   └── demo/          # Demo data endpoint
│   ├── layout.tsx         # Root layout with SEO
│   └── page.tsx           # Home page
├── components/
│   ├── VideoDownloader.tsx # Main UI component
│   ├── Features.tsx       # Features section
│   ├── HowToUse.tsx       # Usage guide
│   └── FAQ.tsx            # FAQ section
├── lib/
│   ├── ytdlp.ts           # yt-dlp integration
│   └── gofile.ts          # Gofile API integration
├── scripts/
│   ├── install-ytdlp.sh   # Linux/macOS installer
│   └── install-ytdlp.ps1  # Windows installer
└── tmp/                   # Temporary download directory
```

## 🎯 Usage

1. **Paste a video URL** from YouTube or any supported platform
2. **Click "Get Info"** to fetch video details and available formats
3. **Select your preferred format** and quality
4. **Click "Download Video"** to process and upload to Gofile
5. **Get your download link** from Gofile (valid for 24-48 hours)

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file:
```env
# Gofile API token (optional, for extended features)
GOFILE_API_TOKEN=your_token_here
```

## 🐛 Troubleshooting

### "yt-dlp: command not found"
- Make sure yt-dlp is installed and in your PATH
- Run `yt-dlp --version` to verify installation

### Download fails
- Ensure you have write permissions in the `tmp` directory
- Check that yt-dlp can access the video URL
- Some videos may be region-locked or require authentication

### Gofile upload fails
- Check your internet connection
- Gofile API may be temporarily unavailable
- Try again after a few moments

## 📝 License

ISC License - See [LICENSE](LICENSE) for details

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

## 📚 Documentation

- [API Documentation](API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- [Gofile API Documentation](https://gofile.io/api)

## ⚡ Technologies

- **Next.js 15** - React framework
- **Material-UI v7** - Component library
- **TypeScript** - Type safety
- **yt-dlp** - Video downloader
- **Gofile API** - File hosting

## 🌟 Supported Platforms

YouTube, Vimeo, TikTok, Facebook, Instagram, Twitter/X, Reddit, Dailymotion, Twitch, SoundCloud, and [1000+ more platforms](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)

---

**Built with ❤️ using Next.js, Material-UI, and yt-dlp**
