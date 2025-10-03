import { NextRequest, NextResponse } from 'next/server'
import { runYtDlp } from '@/lib/ytdlp'
import { uploadToGofile } from '@/lib/gofile'
import fs from 'fs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes timeout

export async function POST(request: NextRequest) {
  let filePath: string | null = null
  
  try {
    const body = await request.json()
    const { url, format } = body

    if (!url || !format) {
      return NextResponse.json(
        { error: 'URL and format are required' },
        { status: 400 }
      )
    }

    // Download the video
    const result = await runYtDlp({
      url,
      format,
      getInfo: false,
    })

    filePath = result.filePath

    // Upload to Gofile
    const uploadResult = await uploadToGofile(result.filePath, `${result.title}.${result.ext}`)

    // Clean up the local file
    if (fs.existsSync(result.filePath)) {
      fs.unlinkSync(result.filePath)
    }

    return NextResponse.json({
      downloadUrl: uploadResult.downloadPage,
      directUrl: uploadResult.downloadUrl,
      fileName: `${result.title}.${result.ext}`,
      fileId: uploadResult.fileId,
    })
  } catch (error: any) {
    console.error('Error downloading video:', error)

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch (e) {
        console.error('Failed to clean up file:', e)
      }
    }

    return NextResponse.json(
      { error: error.message || 'Failed to download video' },
      { status: 500 }
    )
  }
}
