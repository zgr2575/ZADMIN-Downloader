import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

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
  // 1. .vercel_build_output/bin/yt-dlp (packaged during build)
  // 2. /tmp/yt-dlp (downloaded at runtime on serverless)
  // 3. system PATH 'yt-dlp'
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

export async function runYtDlp(options: YtDlpOptions): Promise<any> {
  const { url, getInfo, format } = options
  const ytdlp = getYtDlpPath()

  if (getInfo) {
    try {
      // Get video info in JSON format. Use -J which returns JSON for single videos or playlists.
      const { stdout, stderr } = await execAsync(`${ytdlp} -J --no-warnings "${url}"`)

      // Parse JSON and handle playlists (take first entry)
      let raw: any
      try {
        raw = JSON.parse(stdout)
      } catch (e: unknown) {
        // If parsing failed, include stderr in the error to help debugging
        const parseErr = e instanceof Error ? e : new Error(String(e))
        throw new Error(`Failed to parse yt-dlp JSON output: ${parseErr.message}. stderr: ${stderr || 'none'}`)
      }

      let info: any = Array.isArray(raw?.entries) && raw.entries.length > 0 ? raw.entries[0] : raw

      // If info looks incomplete (no title or no formats), try a fallback that disables playlists
      const looksIncomplete = !info || !info.title || !(info.formats && info.formats.length)
      if (looksIncomplete) {
        try {
          const { stdout: stdout2, stderr: stderr2 } = await execAsync(`${ytdlp} -J --no-warnings --no-playlist "${url}"`)
          const raw2 = JSON.parse(stdout2)
          const info2 = Array.isArray(raw2?.entries) && raw2.entries.length > 0 ? raw2.entries[0] : raw2
          if (info2 && (info2.title || (info2.formats && info2.formats.length))) {
            info = info2
          }
        } catch (fallbackErr) {
          // Ignore fallback errors - we'll proceed with whatever info we have and surface a helpful error later if needed
          // Optionally include fallback stderr in logs if available
        }
      }

      // Transform to consistent format
      return {
        title: info.title || 'Unknown',
        thumbnail: info.thumbnail || info.thumbnails?.[0]?.url || '',
        duration: info.duration || 0,
        uploader: info.uploader || info.channel || 'Unknown',
        view_count: info.view_count || 0,
        formats: (info.formats || []).map((f: any) => ({
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
      // Surface more context to logs - include stderr when available on the thrown error
      const msg = error?.message || String(error)
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
      const { stdout: infoStdout } = await execAsync(`${ytdlp} -J --no-warnings "${url}"`)
      const info = JSON.parse(infoStdout)
      const title = info.title || 'video'
      
      // Sanitize filename
      const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const timestamp = Date.now()
  const outputTemplate = path.join(tempDir, `${sanitizedTitle}_${timestamp}.%(ext)s`)
      
      // Download with specified format
      const formatArg = format ? `-f ${format}` : '-f best'
      const command = `${ytdlp} ${formatArg} -o "${outputTemplate}" --no-warnings "${url}"`
      
      await execAsync(command)
      
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
      throw new Error(`Failed to download video: ${error.message}`)
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

