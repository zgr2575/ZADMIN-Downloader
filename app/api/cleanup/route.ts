import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const downloadsDir = path.join(process.cwd(), 'tmp', 'downloads')
    
    if (!fs.existsSync(downloadsDir)) {
      return NextResponse.json({ message: 'No files to clean up', deleted: 0 })
    }

    let deletedCount = 0
    const files = fs.readdirSync(downloadsDir)
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const metadataPath = path.join(downloadsDir, file)
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
          const expiresAt = new Date(metadata.expiresAt)
          
          // Delete if expired
          if (new Date() > expiresAt) {
            // Delete the video file
            if (fs.existsSync(metadata.filePath)) {
              fs.unlinkSync(metadata.filePath)
              deletedCount++
            }
            // Delete the metadata file
            fs.unlinkSync(metadataPath)
          }
        } catch (error) {
          console.error(`Failed to process ${file}:`, error)
        }
      }
    }

    return NextResponse.json({
      message: 'Cleanup completed',
      deleted: deletedCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Cleanup failed', message: error.message },
      { status: 500 }
    )
  }
}
