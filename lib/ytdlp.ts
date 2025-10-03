import { spawn } from 'child_process'

interface YtDlpOptions {
  url: string
  format?: string
  getInfo?: boolean
}

export async function runYtDlp(options: YtDlpOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    const args: string[] = []
    
    if (options.getInfo) {
      args.push('-J') // Output JSON
      args.push('--no-warnings')
      args.push(options.url)
    } else {
      args.push('-f', options.format || 'best')
      args.push('--no-warnings')
      args.push('-o', '%(title)s.%(ext)s')
      args.push(options.url)
    }

    const ytDlp = spawn('yt-dlp', args)
    let stdout = ''
    let stderr = ''

    ytDlp.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    ytDlp.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    ytDlp.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || 'yt-dlp process failed'))
      } else {
        if (options.getInfo) {
          try {
            resolve(JSON.parse(stdout))
          } catch (err) {
            reject(new Error('Failed to parse video info'))
          }
        } else {
          resolve(stdout)
        }
      }
    })

    ytDlp.on('error', (err) => {
      reject(err)
    })
  })
}

export function filterFormats(formats: any[]): any[] {
  // Filter and sort formats for better user experience
  const filtered = formats
    .filter((f) => {
      // Include formats with video or audio
      return (f.vcodec !== 'none' || f.acodec !== 'none')
    })
    .map((f) => ({
      format_id: f.format_id,
      ext: f.ext,
      resolution: f.resolution || (f.height ? `${f.width}x${f.height}` : 'audio only'),
      filesize: f.filesize || f.filesize_approx,
      format_note: f.format_note || f.format,
      vcodec: f.vcodec || 'none',
      acodec: f.acodec || 'none',
      fps: f.fps,
    }))
    .sort((a, b) => {
      // Sort by quality (higher resolution first)
      const aHeight = parseInt(a.resolution.split('x')[1]) || 0
      const bHeight = parseInt(b.resolution.split('x')[1]) || 0
      return bHeight - aHeight
    })

  return filtered
}
