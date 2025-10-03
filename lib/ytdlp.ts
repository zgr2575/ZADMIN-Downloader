import ytdl from '@distube/ytdl-core'
import * as PlayDL from 'play-dl'

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

export async function runYtDlp(options: YtDlpOptions): Promise<any> {
  const { url, getInfo } = options

  // Determine if it's a YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')

  if (getInfo) {
    if (isYouTube) {
      try {
        // Add options to avoid bot detection
        const info = await ytdl.getInfo(url, {
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          },
        })
        
        // Transform to consistent format
        return {
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url || '',
          duration: parseInt(info.videoDetails.lengthSeconds),
          uploader: info.videoDetails.author.name,
          view_count: parseInt(info.videoDetails.viewCount),
          formats: info.formats.map(f => ({
            format_id: f.itag?.toString() || 'unknown',
            ext: f.container || 'unknown',
            resolution: f.qualityLabel || (f.height ? `${f.width}x${f.height}` : 'audio only'),
            filesize: f.contentLength ? parseInt(f.contentLength) : null,
            format_note: f.qualityLabel || f.quality || 'unknown',
            vcodec: f.hasVideo ? (f.codecs || 'unknown') : 'none',
            acodec: f.hasAudio ? (f.codecs || 'unknown') : 'none',
            fps: f.fps || null,
            url: f.url,
          })),
        }
      } catch (error: any) {
        throw new Error(`Failed to get video info: ${error.message}`)
      }
    } else {
      // For non-YouTube URLs, use play-dl
      try {
        await PlayDL.setToken({
          soundcloud: {
            client_id: 'your_client_id_here' // Optional
          }
        })
        
        const type = await PlayDL.validate(url)
        
        if (type === 'yt_video') {
          const info = await PlayDL.video_info(url)
          const video = info.video_details
          
          return {
            title: video.title || 'Unknown',
            thumbnail: video.thumbnails[0]?.url || '',
            duration: video.durationInSec,
            uploader: video.channel?.name || 'Unknown',
            view_count: video.views || 0,
            formats: [
              {
                format_id: 'best',
                ext: 'mp4',
                resolution: '720x480',
                filesize: null,
                format_note: 'best',
                vcodec: 'h264',
                acodec: 'aac',
                fps: 30,
              }
            ],
          }
        } else if (type === 'so_track') {
          const info = await PlayDL.soundcloud(url)
          
          if ('thumbnail' in info) {
            return {
              title: info.name,
              thumbnail: info.thumbnail || '',
              duration: info.durationInSec,
              uploader: 'user' in info ? info.user.name : 'Unknown',
              view_count: 'playCount' in info ? info.playCount || 0 : 0,
              formats: [
                {
                  format_id: 'audio',
                  ext: 'mp3',
                  resolution: 'audio only',
                  filesize: null,
                  format_note: 'audio',
                  vcodec: 'none',
                  acodec: 'mp3',
                  fps: null,
                }
              ],
            }
          }
        }
        
        throw new Error('Unsupported URL type')
      } catch (error: any) {
        throw new Error(`Failed to get video info: ${error.message}`)
      }
    }
  } else {
    // For download, return the URL
    if (isYouTube) {
      const info = await ytdl.getInfo(url, {
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        },
      })
      const format = info.formats.find(f => f.itag?.toString() === options.format) || info.formats[0]
      return { url: format.url, title: info.videoDetails.title, ext: format.container }
    } else {
      throw new Error('Download not supported for non-YouTube URLs yet')
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

