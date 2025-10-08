import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

// Note: ytdl-core fallback removed due to reliability issues
// Vercel deployment is not recommended for production use
// For YouTube and all other platforms, deploy to a VPS with yt-dlp binary

interface YtDlpOptions {
  url: string
  format?: string
  getInfo?: boolean
}

interface VideoFormat {
  format_id: string
  ext: string
  resolution: string
  filesize: number | null
  format_note: string
  vcodec: string
  acodec: string
  fps: number | null
  url?: string
}

// Get yt-dlp binary path
function getYtDlpPath(): string {
  // Priority:
  // 1. YTDLP_PATH environment variable (for pm2 and production deployments)
  // 2. .vercel_build_output/bin/yt-dlp (packaged during build)
  // 3. /tmp/yt-dlp (downloaded at runtime on serverless)
  // 4. system PATH 'yt-dlp'
  
  if (process.env.YTDLP_PATH) {
    return process.env.YTDLP_PATH
  }

  const possible = [] as string[]
  const platformExe = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
  possible.push(require('path').join(process.cwd(), '.vercel_build_output', 'bin', platformExe))
  possible.push(require('path').join(process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp', platformExe))
  possible.push(platformExe)

  for (const p of possible) {
    try {
      if (p === platformExe) {
        // rely on PATH
        const which = require('child_process').spawnSync(p, ['--version'], { encoding: 'utf8' })
        if (which.status === 0) return p
      } else if (require('fs').existsSync(p)) {
        return p
      }
    } catch (e) {
      // ignore and continue
    }
  }

  // fallback
  return 'yt-dlp'
}

/**
 * Robust yt-dlp runner using spawn to avoid buffer truncation
 * Collects stdout/stderr fully and parses JSON only after process exits
 */
async function spawnYtDlp(args: string[], timeoutMs: number = 30000): Promise<{ stdout: string; stderr: string }> {
  const ytdlpPath = getYtDlpPath()
  
  return new Promise((resolve, reject) => {
    const stdoutChunks: Buffer[] = []
    const stderrChunks: Buffer[] = []
    
    const child = spawn(ytdlpPath, args, {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    
    let timedOut = false
    const timeout = setTimeout(() => {
      timedOut = true
      child.kill('SIGTERM')
      setTimeout(() => {
        if (!child.killed) {
          child.kill('SIGKILL')
        }
      }, 5000)
    }, timeoutMs)
    
    child.stdout.on('data', (chunk: Buffer) => {
      stdoutChunks.push(chunk)
    })
    
    child.stderr.on('data', (chunk: Buffer) => {
      stderrChunks.push(chunk)
    })
    
    child.on('close', (code, signal) => {
      clearTimeout(timeout)
      
      const stdout = Buffer.concat(stdoutChunks).toString('utf8')
      const stderr = Buffer.concat(stderrChunks).toString('utf8')
      
      if (timedOut) {
        const errMsg = `yt-dlp timed out after ${timeoutMs}ms. stdout length: ${stdout.length}, stderr length: ${stderr.length}`
        console.error(`[ytdlp] ${errMsg}`)
        if (stderr.length > 0) {
          console.error(`[ytdlp] stderr snippet: ${stderr.slice(0, 500)}`)
        }
        reject(new Error(errMsg + (stderr ? `. stderr snippet: ${stderr.slice(0, 200)}` : '')))
        return
      }
      
      if (code !== 0) {
        const errMsg = `yt-dlp exited with code ${code}${signal ? ` (signal: ${signal})` : ''}. stdout length: ${stdout.length}, stderr length: ${stderr.length}`
        console.error(`[ytdlp] ${errMsg}`)
        if (stderr.length > 0) {
          console.error(`[ytdlp] stderr snippet: ${stderr.slice(0, 500)}`)
        }
        reject(new Error(errMsg + (stderr ? `. stderr snippet: ${stderr.slice(0, 200)}` : '')))
        return
      }
      
      if (stdout.length === 0) {
        const errMsg = `yt-dlp produced empty stdout. stderr length: ${stderr.length}`
        console.error(`[ytdlp] ${errMsg}`)
        if (stderr.length > 0) {
          console.error(`[ytdlp] stderr snippet: ${stderr.slice(0, 500)}`)
        }
        reject(new Error(errMsg + (stderr ? `. stderr snippet: ${stderr.slice(0, 200)}` : '')))
        return
      }
      
      resolve({ stdout, stderr })
    })
    
    child.on('error', (err) => {
      clearTimeout(timeout)
      console.error(`[ytdlp] spawn error:`, err)
      reject(new Error(`Failed to spawn yt-dlp: ${err.message}. Ensure yt-dlp is installed and YTDLP_PATH is set correctly if needed.`))
    })
  })
}

export async function runYtDlp(options: YtDlpOptions): Promise<any> {
  // Check if we're on Vercel - provide clear error message
  if (isVercel) {
    throw new Error(
      'Video downloading is not available on Vercel due to serverless limitations. ' +
      'Please deploy this application to a VPS, Railway, or Render for full functionality. ' +
      'See the README for deployment instructions.'
    )
  }

  const { url, getInfo, format } = options

  if (getInfo) {
    try {
      // Get video info in JSON format using spawn for robustness
      // Use -j (lowercase) which returns JSON line-by-line for playlists
      const { stdout } = await spawnYtDlp(['-j', '--no-warnings', '--no-playlist', url])

      // Parse JSON - if multiple JSON objects (one per line), take the first one
      let raw: any
      try {
        const lines = stdout.trim().split('\n').filter(line => line.trim().length > 0)
        const jsonLine = lines[0] || '{}'
        raw = JSON.parse(jsonLine)
      } catch (e: unknown) {
        const parseErr = e instanceof Error ? e : new Error(String(e))
        console.error(`[ytdlp] Failed to parse JSON output:`, parseErr)
        throw new Error(`Failed to parse yt-dlp JSON output: ${parseErr.message}`)
      }

      // Transform to consistent format
      return {
        title: raw.title || 'Unknown',
        thumbnail: raw.thumbnail || raw.thumbnails?.[0]?.url || '',
        duration: raw.duration || 0,
        uploader: raw.uploader || raw.channel || 'Unknown',
        view_count: raw.view_count || 0,
        formats: (raw.formats || []).map((f: any) => ({
          format_id: f.format_id || 'unknown',
          ext: f.ext || 'unknown',
          resolution: f.resolution || (f.height ? `${f.width}x${f.height}` : 'audio only'),
          filesize: f.filesize || null,
          format_note: f.format_note || f.quality || 'unknown',
          vcodec: f.vcodec || 'none',
          acodec: f.acodec || 'none',
          fps: f.fps || null,
        })),
      }
    } catch (error: any) {
      const msg = error?.message || String(error)
      console.error(`[ytdlp] Failed to get video info:`, msg)
      throw new Error(`Failed to get video info: ${msg}`)
    }
  } else {
    // Download the video
    try {
      // Use /tmp when running in serverless environments; fall back to repo tmp
      const tmpBase = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp'
      const tempDir = fs.existsSync(tmpBase) ? tmpBase : path.join(process.cwd(), 'tmp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
      }

      // Get video info first to get the title
      const { stdout: infoStdout } = await spawnYtDlp(['-j', '--no-warnings', '--no-playlist', url])
      const lines = infoStdout.trim().split('\n').filter(line => line.trim().length > 0)
      const info = JSON.parse(lines[0] || '{}')
      const title = info.title || 'video'
      
      // Sanitize filename
      const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const timestamp = Date.now()
      const outputTemplate = path.join(tempDir, `${sanitizedTitle}_${timestamp}.%(ext)s`)
      
      // Download with specified format
      const formatArg = format || 'best'
      const downloadArgs = ['-f', formatArg, '-o', outputTemplate, '--no-warnings', url]
      
      await spawnYtDlp(downloadArgs, 300000) // 5 minute timeout for downloads
      
      // Find the downloaded file
      const files = fs.readdirSync(tempDir).filter(f => f.startsWith(`${sanitizedTitle}_${timestamp}`))
      if (files.length === 0) {
        throw new Error('Download failed - file not found')
      }
      
      const filePath = path.join(tempDir, files[0])
      const ext = path.extname(files[0]).slice(1)
      
      return {
        filePath,
        title: info.title,
        ext,
      }
    } catch (error: any) {
      const msg = error?.message || String(error)
      console.error(`[ytdlp] Failed to download video:`, msg)
      throw new Error(`Failed to download video: ${msg}`)
    }
  }
}

export function filterFormats(formats: VideoFormat[]): VideoFormat[] {
  // Filter and sort formats for better user experience
  const filtered = formats
    .filter((f) => {
      // Include formats with video or audio
      return (f.vcodec !== 'none' || f.acodec !== 'none')
    })
    .sort((a, b) => {
      // Sort by quality (higher resolution first)
      const aHeight = parseInt(a.resolution.split('x')[1]) || 0
      const bHeight = parseInt(b.resolution.split('x')[1]) || 0
      return bHeight - aHeight
    })

  // Remove duplicates and limit
  const seen = new Set<string>()
  return filtered.filter(f => {
    const key = `${f.resolution}-${f.ext}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 30)
}

// Export whether we're running on Vercel (or Vercel-like) environment
export const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_URL)
