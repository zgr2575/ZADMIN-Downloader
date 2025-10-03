import { NextRequest, NextResponse } from 'next/server'
import { runYtDlp, filterFormats } from '@/lib/ytdlp'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Get video info using yt-dlp
    const videoInfo = await runYtDlp({
      url,
      getInfo: true,
    })

    // Filter and format the response
    const formats = filterFormats(videoInfo.formats || [])

    return NextResponse.json({
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      duration: videoInfo.duration,
      uploader: videoInfo.uploader || videoInfo.channel || 'Unknown',
      view_count: videoInfo.view_count,
      formats: formats.slice(0, 30), // Limit to 30 formats for better UX
    })
  } catch (error: any) {
    console.error('Error fetching video info:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch video information' },
      { status: 500 }
    )
  }
}
