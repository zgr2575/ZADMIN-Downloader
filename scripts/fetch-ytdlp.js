const https = require('https')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function getDestPath() {
  // On Vercel and many serverless platforms, /tmp is writable at runtime.
  // During build we place the binary under .vercel_build_output/bin when possible to be included.
  const tmp = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp'
  const vercelOut = path.join(process.cwd(), '.vercel_build_output', 'bin')
  try {
    if (fs.existsSync('.vercel_build_output')) {
      if (!fs.existsSync(vercelOut)) fs.mkdirSync(vercelOut, { recursive: true })
      return path.join(vercelOut, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')
    }
  } catch (e) {
    // ignore
  }
  return path.join(tmp, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp')
}

const url = process.platform === 'win32'
  ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
  : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp'

const dest = getDestPath()

function download() {
  console.log('Downloading yt-dlp to', dest)
  const file = fs.createWriteStream(dest, { mode: 0o755 })
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.headers.location) {
      // follow redirect
      return https.get(res.headers.location, (r2) => r2.pipe(file).on('finish', () => file.close()))
    }
    res.pipe(file)
    file.on('finish', () => {
      file.close()
      console.log('yt-dlp downloaded')
    })
  }).on('error', (err) => {
    try { fs.unlinkSync(dest) } catch (e) {}
    console.error('Failed to download yt-dlp:', err.message)
    process.exit(0) // don't fail install/build; keep app deployable
  })
}

try {
  const destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
  download()
} catch (e) {
  console.error('fetch-ytdlp error', e.message)
}
