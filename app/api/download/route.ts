import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import { join } from 'path'
import { uploadToGofile } from '@/lib/gofile'
import { tmpdir } from 'os'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes timeout

export async function POST(request: NextRequest) {
  let downloadPath = ''
  
  try {
    const body = await request.json()
    const { url, format } = body

    if (!url || !format) {
      return NextResponse.json(
        { error: 'URL and format are required' },
        { status: 400 }
      )
    }

    // Create temporary directory for downloads
    const tempDir = join(tmpdir(), `ytdlp-${Date.now()}`)
    await fs.mkdir(tempDir, { recursive: true })

    // Download video with yt-dlp
    const outputTemplate = join(tempDir, '%(title)s.%(ext)s')
    
    const downloadPromise = new Promise<string>((resolve, reject) => {
      const ytDlp = spawn('yt-dlp', [
        '-f', format,
        '--no-warnings',
        '--no-playlist',
        '-o', outputTemplate,
        url,
      ])

      let stderr = ''

      ytDlp.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      ytDlp.on('close', async (code) => {
        if (code !== 0) {
          reject(new Error(stderr || 'Download failed'))
        } else {
          try {
            // Find the downloaded file
            const files = await fs.readdir(tempDir)
            if (files.length > 0) {
              resolve(join(tempDir, files[0]))
            } else {
              reject(new Error('No file was downloaded'))
            }
          } catch (err) {
            reject(err)
          }
        }
      })

      ytDlp.on('error', (err) => {
        reject(err)
      })
    })

    downloadPath = await downloadPromise

    // Upload to Gofile
    const fileName = downloadPath.split('/').pop() || 'video'
    const gofileUrl = await uploadToGofile(downloadPath, fileName)

    // Clean up
    try {
      await fs.unlink(downloadPath)
      await fs.rmdir(tempDir)
    } catch (cleanupErr) {
      console.error('Cleanup error:', cleanupErr)
    }

    return NextResponse.json({
      downloadUrl: gofileUrl,
      fileName,
    })
  } catch (error: any) {
    console.error('Error downloading video:', error)
    
    // Clean up on error
    if (downloadPath) {
      try {
        await fs.unlink(downloadPath)
        const tempDir = join(downloadPath, '..')
        await fs.rmdir(tempDir)
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr)
      }
    }

    return NextResponse.json(
      { error: error.message || 'Failed to download video' },
      { status: 500 }
    )
  }
}
