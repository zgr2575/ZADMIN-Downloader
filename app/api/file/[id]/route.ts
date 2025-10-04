import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { Readable } from 'stream'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    
  // Load download metadata (use serverless-friendly tmp if available)
  const tmpBase = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp'
  const downloadsDir = fs.existsSync(tmpBase) ? path.join(tmpBase, 'zadmin_downloads') : path.join(process.cwd(), 'tmp', 'downloads')
  const metadataPath = path.join(downloadsDir, `${id}.json`)
    
    if (!fs.existsSync(metadataPath)) {
      return NextResponse.json(
        { error: 'Download link not found or has expired' },
        { status: 404 }
      )
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
    
    // Check if link has expired (24 hours)
    const expiresAt = new Date(metadata.expiresAt)
    if (new Date() > expiresAt) {
      // Clean up expired files
      if (fs.existsSync(metadata.filePath)) {
        fs.unlinkSync(metadata.filePath)
      }
      fs.unlinkSync(metadataPath)
      
      return NextResponse.json(
        { error: 'Download link has expired (24 hour limit)' },
        { status: 410 }
      )
    }

    // If this is a remote file (uploaded to Gofile or similar), redirect to the remote URL
    if (metadata.remote && metadata.filePath && typeof metadata.filePath === 'string') {
      // metadata.filePath holds the remote download URL
      return NextResponse.redirect(metadata.filePath)
    }

    // Check if local file exists
    if (!fs.existsSync(metadata.filePath)) {
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      )
    }

    // Stream the file to avoid buffering large files into memory (serverless-friendly)
    const nodeStream = fs.createReadStream(metadata.filePath)

    // Convert Node stream to Web ReadableStream (Node 18+)
    const webStream = Readable.toWeb(nodeStream as any) as unknown as BodyInit

    const headers = {
      'Content-Type': metadata.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${metadata.fileName}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }

    return new NextResponse(webStream, {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    )
  }
}
