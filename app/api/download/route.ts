import { NextRequest, NextResponse } from 'next/server'
import { runYtDlp, isVercel } from '@/lib/ytdlp'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes timeout

export async function POST(request: NextRequest) {
  let filePath: string | null = null

  try {
    const body = await request.json()
    const { url, format, preferredFormat, preferredQuality } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Use format if provided, otherwise use preferences
    let formatString = format
    if (!formatString && preferredFormat && preferredQuality) {
      // Build format string based on preferences
      if (['mp3', 'm4a', 'opus'].includes(preferredFormat)) {
        // Audio only
        formatString = `bestaudio[ext=${preferredFormat}]/bestaudio`
      } else if (preferredQuality === 'best') {
        formatString = `bestvideo[ext=${preferredFormat}]+bestaudio/best[ext=${preferredFormat}]/best`
      } else {
        // Specific quality
        formatString = `bestvideo[height<=${preferredQuality}][ext=${preferredFormat}]+bestaudio/best[height<=${preferredQuality}][ext=${preferredFormat}]/best`
      }
    }

    // Decide where the download runs: delegate on Vercel if an external downloader is configured
    let result: any
    if (isVercel) {
      const external = process.env.EXTERNAL_DOWNLOADER_URL
      if (!external) {
        return NextResponse.json({ error: 'On Vercel: EXTERNAL_DOWNLOADER_URL not configured. Configure an external downloader service or deploy off-server.' }, { status: 503 })
      }

      // Forward request to external downloader. Send the effective formatString (may be undefined).
      const resp = await axios.post(`${external.replace(/\/$/, '')}/download`, { url, format: formatString }, { timeout: 0 })
      // Expect the external service to return the same shape: { filePath, title, ext, downloadUrl }
      result = resp.data
    } else {
      // Download the video locally
      result = await runYtDlp({
        url,
        format: formatString,
        getInfo: false,
      })
    }

    // If the result already includes a remote download URL (e.g., uploaded to Gofile by external service),
    // don't attempt to move local files. Instead store metadata that points to the remote URL and return it.
    const tmpBase = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp'
    const downloadsDir = fs.existsSync(tmpBase) ? path.join(tmpBase, 'zadmin_downloads') : path.join(process.cwd(), 'tmp', 'downloads')
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true })
    }

    // Calculate expiration (24 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // If result contains a downloadUrl, treat it as a remote-hosted file (Gofile)
    if (result && result.downloadUrl) {
      const downloadId = crypto.randomBytes(16).toString('hex')
      const fileName = result.fileName || (result.title ? `${result.title}.${result.ext || 'bin'}` : 'file')

      const metadata = {
        downloadId,
        fileName,
        // store remote URL in filePath for backwards compat with metadata shape
        filePath: result.downloadUrl,
        remote: true,
        mimeType: result.mimeType || getMimeType(result.ext || ''),
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      }

      const metadataPath = path.join(downloadsDir, `${downloadId}.json`)
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

      // Return the remote download URL directly
      return NextResponse.json({
        downloadUrl: result.downloadUrl,
        fileName,
        downloadId,
        expiresAt: expiresAt.toISOString(),
      })
    }

    // Otherwise assume a local file was returned and move it into downloadsDir
    filePath = result.filePath
    // Generate unique download ID
    const downloadId = crypto.randomBytes(16).toString('hex')
    const fileName = `${result.title}.${result.ext}`
    const newFilePath = path.join(downloadsDir, `${downloadId}.${result.ext}`)

    // Move file to downloads directory
    fs.renameSync(result.filePath, newFilePath)

    // Store metadata for local file
    const metadata = {
      downloadId,
      fileName,
      filePath: newFilePath,
      mimeType: getMimeType(result.ext),
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    const metadataPath = path.join(downloadsDir, `${downloadId}.json`)
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

    // Create download URL for our own server
    const baseUrl = request.nextUrl.origin
    const downloadUrl = `${baseUrl}/api/file/${downloadId}`

    return NextResponse.json({
      downloadUrl,
      fileName,
      downloadId,
      expiresAt: expiresAt.toISOString(),
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

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mkv': 'video/x-matroska',
    'm4a': 'audio/mp4',
    'mp3': 'audio/mpeg',
    'opus': 'audio/opus',
    'flac': 'audio/flac',
  }
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream'
}
