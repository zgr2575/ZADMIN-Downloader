import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
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
    
    // Load download metadata
    const metadataPath = path.join(process.cwd(), 'tmp', 'downloads', `${id}.json`)
    
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

    // Check if file exists
    if (!fs.existsSync(metadata.filePath)) {
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      )
    }

    // Read the file
    const fileBuffer = fs.readFileSync(metadata.filePath)
    
    // Set appropriate headers for download
    const headers = new Headers()
    headers.set('Content-Type', metadata.mimeType || 'application/octet-stream')
    headers.set('Content-Disposition', `attachment; filename="${metadata.fileName}"`)
    headers.set('Content-Length', fileBuffer.length.toString())
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    return new NextResponse(fileBuffer, {
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
