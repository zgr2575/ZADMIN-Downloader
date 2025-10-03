import { NextRequest, NextResponse } from 'next/server'
import { runYtDlp } from '@/lib/ytdlp'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, format } = body

    if (!url || !format) {
      return NextResponse.json(
        { error: 'URL and format are required' },
        { status: 400 }
      )
    }

    // Get download URL
    const result = await runYtDlp({
      url,
      format,
      getInfo: false,
    })

    return NextResponse.json({
      downloadUrl: result.url,
      fileName: `${result.title}.${result.ext}`,
    })
  } catch (error: any) {
    console.error('Error downloading video:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to download video' },
      { status: 500 }
    )
  }
}
